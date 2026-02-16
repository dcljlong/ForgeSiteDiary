export function uuid(): string {
  const g: any = globalThis as any;

  // Preferred: native randomUUID when available
  if (g?.crypto && typeof g.crypto.randomUUID === "function") {
    return g.crypto.randomUUID();
  }

  // Standards-based fallback: RFC4122 v4 using getRandomValues
  if (g?.crypto && typeof g.crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    g.crypto.getRandomValues(bytes);

    // Per RFC 4122 section 4.4
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
    return (
      hex[0] + hex[1] + hex[2] + hex[3] + "-" +
      hex[4] + hex[5] + "-" +
      hex[6] + hex[7] + "-" +
      hex[8] + hex[9] + "-" +
      hex[10] + hex[11] + hex[12] + hex[13] + hex[14] + hex[15]
    );
  }

  // Last resort (non-crypto). Should never happen in modern browsers/Node.
  let d = Date.now();
  let d2 = (typeof performance !== "undefined" && performance.now) ? performance.now() * 1000 : 0;

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}