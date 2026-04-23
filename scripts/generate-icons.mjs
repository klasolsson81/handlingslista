import sharp from "sharp";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const svg = readFileSync(join(publicDir, "icon.svg"));

const sizes = [
  { size: 192, file: "icon-192.png" },
  { size: 512, file: "icon-512.png" },
  { size: 180, file: "apple-touch-icon.png" },
  { size: 512, file: "icon-512-maskable.png", padding: 64 },
];

for (const { size, file, padding } of sizes) {
  if (padding) {
    const innerSize = size - padding * 2;
    const inner = await sharp(svg).resize(innerSize, innerSize).png().toBuffer();
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 74, g: 124, b: 89, alpha: 1 },
      },
    })
      .composite([{ input: inner, top: padding, left: padding }])
      .png({ compressionLevel: 9 })
      .toFile(join(publicDir, file));
  } else {
    await sharp(svg)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(join(publicDir, file));
  }
  console.log(`wrote ${file} (${size}x${size})`);
}

