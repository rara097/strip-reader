// Minimal ZIP writer (store/no-compression) so the app can bundle photos for
// export without pulling in an external library or needing network access.

function u16(v) { return new Uint8Array([v & 0xff, (v >>> 8) & 0xff]); }
function u32(v) { return new Uint8Array([v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff]); }

function concatBytes(arrays) {
  const total = arrays.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const a of arrays) { out.set(a, o); o += a.length; }
  return out;
}

function crc32(buf) {
  if (!crc32.table) {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
      table[n] = c >>> 0;
    }
    crc32.table = table;
  }
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ crc32.table[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}

function dosDateTime(date) {
  const time = ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | ((date.getSeconds() >> 1) & 0x1f);
  const day = (((date.getFullYear() - 1980) & 0x7f) << 9) | (((date.getMonth() + 1) & 0xf) << 5) | (date.getDate() & 0x1f);
  return { time, day };
}

// files: [{ name, blob, date? }]
export async function buildZip(files) {
  const localParts = [];
  const entries = [];
  let offset = 0;

  for (const f of files) {
    const data = new Uint8Array(await f.blob.arrayBuffer());
    const crc = crc32(data);
    const nameBytes = new TextEncoder().encode(f.name);
    const { time, day } = dosDateTime(f.date || new Date());

    const localHeader = concatBytes([
      u32(0x04034b50), u16(20), u16(0), u16(0),
      u16(time), u16(day),
      u32(crc), u32(data.length), u32(data.length),
      u16(nameBytes.length), u16(0),
      nameBytes,
    ]);

    entries.push({ nameBytes, crc, size: data.length, time, day, offset });
    localParts.push(localHeader, data);
    offset += localHeader.length + data.length;
  }

  const centralStart = offset;
  const centralParts = [];
  for (const e of entries) {
    const central = concatBytes([
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0),
      u16(e.time), u16(e.day),
      u32(e.crc), u32(e.size), u32(e.size),
      u16(e.nameBytes.length), u16(0), u16(0),
      u16(0), u16(0), u32(0),
      u32(e.offset),
      e.nameBytes,
    ]);
    centralParts.push(central);
    offset += central.length;
  }
  const centralSize = offset - centralStart;

  const eocd = concatBytes([
    u32(0x06054b50), u16(0), u16(0),
    u16(entries.length), u16(entries.length),
    u32(centralSize), u32(centralStart),
    u16(0),
  ]);

  return new Blob([...localParts, ...centralParts, eocd], { type: "application/zip" });
}
