/**
 * DINO Seminar - Slide Generator
 *
 * Usage:
 *   node generate.js           # Generate all slides into one pptx
 *   node generate.js 1         # Generate only slide 1
 *   node generate.js 1 5       # Generate slides 1 to 5
 *   node generate.js --single  # Generate each slide as separate file
 */

const { createPresentation } = require('./config');
const path = require('path');

const TOTAL_SLIDES = 24;

// Load all slide modules
const slides = [];
for (let i = 1; i <= TOTAL_SLIDES; i++) {
  const num = i.toString().padStart(2, '0');
  slides.push(require(`./slide_${num}.js`));
}

async function generateAll(outputName = 'DINO_Seminar_v69.pptx') {
  const pres = createPresentation();

  for (let i = 0; i < slides.length; i++) {
    slides[i].create(pres);
    console.log(`✓ Slide ${i + 1}: created`);
  }

  const outputPath = path.join(__dirname, '..', outputName);
  await pres.writeFile({ fileName: outputPath });
  console.log(`\n✓ Generated: ${outputPath} (${TOTAL_SLIDES} slides)`);
}

async function generateSingle(slideNum) {
  if (slideNum < 1 || slideNum > TOTAL_SLIDES) {
    console.error(`Error: Slide number must be 1-${TOTAL_SLIDES}`);
    process.exit(1);
  }

  const pres = createPresentation();
  slides[slideNum - 1].create(pres);

  const num = slideNum.toString().padStart(2, '0');
  const outputName = `slide_${num}.pptx`;
  const outputPath = path.join(__dirname, '..', 'output', outputName);

  // Ensure output directory exists
  const fs = require('fs');
  const outputDir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await pres.writeFile({ fileName: outputPath });
  console.log(`✓ Generated: ${outputPath}`);
}

async function generateRange(start, end) {
  if (start < 1 || end > TOTAL_SLIDES || start > end) {
    console.error(`Error: Invalid range. Must be 1-${TOTAL_SLIDES}`);
    process.exit(1);
  }

  const pres = createPresentation();

  for (let i = start - 1; i < end; i++) {
    slides[i].create(pres);
    console.log(`✓ Slide ${i + 1}: created`);
  }

  const outputName = `DINO_slides_${start}-${end}.pptx`;
  const outputPath = path.join(__dirname, '..', outputName);
  await pres.writeFile({ fileName: outputPath });
  console.log(`\n✓ Generated: ${outputPath} (${end - start + 1} slides)`);
}

async function generateEachSeparate() {
  const fs = require('fs');
  const outputDir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let i = 0; i < slides.length; i++) {
    const pres = createPresentation();
    slides[i].create(pres);

    const num = (i + 1).toString().padStart(2, '0');
    const outputName = `slide_${num}.pptx`;
    const outputPath = path.join(outputDir, outputName);

    await pres.writeFile({ fileName: outputPath });
    console.log(`✓ Generated: ${outputName}`);
  }

  console.log(`\n✓ Generated ${TOTAL_SLIDES} separate slide files in output/`);
}

async function main() {
  const args = process.argv.slice(2);

  console.log('═'.repeat(50));
  console.log(' DINO Seminar - Slide Generator');
  console.log('═'.repeat(50));
  console.log('');

  if (args.length === 0) {
    // Generate all
    await generateAll();
  } else if (args[0] === '--single' || args[0] === '-s') {
    // Generate each as separate file
    await generateEachSeparate();
  } else if (args.length === 1) {
    // Generate single slide
    const num = parseInt(args[0]);
    await generateSingle(num);
  } else if (args.length === 2) {
    // Generate range
    const start = parseInt(args[0]);
    const end = parseInt(args[1]);
    await generateRange(start, end);
  } else {
    console.log('Usage:');
    console.log('  node generate.js           # All slides → one file');
    console.log('  node generate.js 5         # Only slide 5');
    console.log('  node generate.js 1 10      # Slides 1-10');
    console.log('  node generate.js --single  # Each slide → separate file');
  }
}

main().catch(console.error);
