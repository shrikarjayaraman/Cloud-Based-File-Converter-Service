import fs from 'fs';
import p from 'pngjs';

const PNG = p.PNG

async function removeBackgroundFromPNG(sourcePath, destinationPath) {
  try {
    const sourceData = fs.readFileSync(sourcePath);
    const png = PNG.sync.read(sourceData);

    for (let i = 0; i < png.width * png.height; i++) {
      const r = png.data[i * 4];
      const g = png.data[i * 4 + 1];
      const b = png.data[i * 4 + 2];
      const a = png.data[i * 4 + 3];

      if (r > 200 && g > 200 && b > 200 && a > 200) {
        png.data[i * 4 + 3] = 0;
      }
    }

    const pngBuffer = PNG.sync.write(png);
    fs.writeFileSync(destinationPath, pngBuffer);

    console.log(`Removed background from ${sourcePath} and saved as ${destinationPath}.`);
  } catch (error) {
    console.error(error);
  }
}

const [sourcePath, destinationPath] = process.argv.slice(2);
removeBackgroundFromPNG(sourcePath, destinationPath);