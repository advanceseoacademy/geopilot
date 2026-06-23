import { createHash, randomBytes } from "crypto";

export function generateApiKey(): { key: string; keyHash: string; keyPrefix: string } {
  const key = `gp_${randomBytes(32).toString("hex")}`;
  const keyHash = createHash("sha256").update(key).digest("hex");
  const keyPrefix = key.slice(0, 12);
  return { key, keyHash, keyPrefix };
}

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}
