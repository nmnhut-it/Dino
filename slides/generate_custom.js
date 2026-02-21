/**
 * Custom Generator - Generate specific slides as separate PPTX files
 *
 * Usage:
 *   node generate_custom.js          # Generate all custom slides
 *   node generate_custom.js 08       # Only slide 8 (EMA)
 *   node generate_custom.js 12       # Only slide 12 (Results)
 *   node generate_custom.js emerging # Only emerging properties
 */

const { createPresentation } = require('./config');
const path = require('path');
const fs = require('fs');

// Ensure output directory exists
const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateSlide(slideModule, outputName) {
  const pres = createPresentation();
  slideModule.create(pres);

  const outputPath = path.join(outputDir, outputName);
  await pres.writeFile({ fileName: outputPath });
  console.log(`✓ Generated: ${outputPath}`);
}

async function main() {
  const args = process.argv.slice(2);

  console.log('═'.repeat(50));
  console.log(' Custom Slide Generator');
  console.log('═'.repeat(50));
  console.log('');

  const slide08 = require('./slide_08');
  const slide12 = require('./slide_12');
  const slide17 = require('./slide_17');
  const slide21 = require('./slide_21');
  const slideEmerging = require('./slide_emerging');

  if (args.length === 0) {
    // Generate all custom slides
    await generateSlide(slide08, 'slide_08.pptx');
    await generateSlide(slide12, 'slide_12.pptx');
    await generateSlide(slide17, 'slide_17.pptx');
    await generateSlide(slide21, 'slide_21.pptx');
    await generateSlide(slideEmerging, 'slide_emerging.pptx');
    console.log('\n✓ Generated 5 slide files in output/');
  } else if (args[0] === '08' || args[0] === '8') {
    await generateSlide(slide08, 'slide_08.pptx');
  } else if (args[0] === '12') {
    await generateSlide(slide12, 'slide_12.pptx');
  } else if (args[0] === '17') {
    await generateSlide(slide17, 'slide_17.pptx');
  } else if (args[0] === '21') {
    await generateSlide(slide21, 'slide_21.pptx');
  } else if (args[0] === 'emerging') {
    await generateSlide(slideEmerging, 'slide_emerging.pptx');
  } else {
    console.log('Usage:');
    console.log('  node generate_custom.js          # All custom slides');
    console.log('  node generate_custom.js 08       # Slide 8 (EMA)');
    console.log('  node generate_custom.js 12       # Slide 12 (Results v1)');
    console.log('  node generate_custom.js 17       # Slide 17 (Results v2)');
    console.log('  node generate_custom.js 21       # Slide 21 (Results v3)');
    console.log('  node generate_custom.js emerging # Emerging properties');
  }
}

main().catch(console.error);
