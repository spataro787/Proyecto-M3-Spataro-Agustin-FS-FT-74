const fs = require('fs').promises;
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');
const outDir = path.join(process.cwd(), 'dist');

async function copyDir(source, target) {
  await fs.mkdir(target, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function build() {
  await fs.rm(outDir, { recursive: true, force: true });
  await copyDir(srcDir, outDir);
  console.log(`Build completed: ${outDir}`);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
