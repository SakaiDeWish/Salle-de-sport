// Génère une paire de clés VAPID (format attendu par @block65/webcrypto-web-push :
// clé publique = point P-256 non compressé en base64url, privée = scalaire d en base64url).
import { webcrypto as c } from "node:crypto";
const b64 = u8 => Buffer.from(u8).toString("base64url");
const k = await c.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign"]);
const pub = new Uint8Array(await c.subtle.exportKey("raw", k.publicKey));
const jwk = await c.subtle.exportKey("jwk", k.privateKey);
console.log("VAPID_PUBLIC_KEY =", b64(pub));
console.log("VAPID_PRIVATE_KEY =", jwk.d);
