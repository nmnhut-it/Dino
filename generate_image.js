/**
 * Generate images for DINO Seminar using Gemini/Imagen API
 * Usage: node generate_image.js [slide_number]
 *
 * Models tried in order:
 * 1. gemini-2.5-flash-image
 * 2. gemini-2.0-flash-exp-image-generation
 * 3. imagen-4.0-generate-001 (requires different endpoint)
 */

const fs = require('fs');
const path = require('path');

// Load API key from .env
require('dotenv').config();
const API_KEY = process.env['gemini-key'];

if (!API_KEY) {
  console.error('Error: gemini-key not found in .env file');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, 'generated_images');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Image prompts for each slide
const PROMPTS = {
  1: {
    name: 'slide01_attention_maps',
    prompt: `Create a scientific visualization of a tench fish with attention map overlays. Show three semi-transparent colored heatmaps: RED on the fish head, GREEN on body and fins, BLUE on background. Clean white background, professional academic style.`
  },

  6: {
    name: 'slide06_collapse_problem',
    prompt: `Create a clean diagram showing neural network collapse. Left side: scatter plot with all dots clustered at one point labeled "Mode Collapse". Right side: scatter plot with dots in uniform grid pattern labeled "Uniform Collapse". Both marked with red X. Clean minimal style, white background.`
  },

  11: {
    name: 'slide11_multicrop',
    prompt: `Create a diagram showing image crop strategy. Center: a colorful bird photo. Around it: 2 large blue dashed rectangles (labeled "Global 224x224") and 6 small orange dashed rectangles showing parts like beak, eye, wing (labeled "Local 96x96"). White background, clean technical style.`
  },

  14: {
    name: 'slide14_data_funnel',
    prompt: `Create a funnel infographic showing data filtering. Top (wide, gray): "1.2B images". Middle levels getting narrower: "1.1B", "744M". Bottom (narrow, green): "142M curated". Add filter icons between levels. Text: "Quality > Quantity". Professional infographic style.`
  },

  20: {
    name: 'slide20_gram_matrix',
    prompt: `Create a mathematical diagram of Gram matrix. Left: 4x4 grid of image patches. Center: equation "X × X^T = G". Right: P×P heatmap matrix with bright diagonal (similarity=1) and varying off-diagonal values. Blue to red color scale. Clean mathematical style.`
  }
};

// Models to try in order
const MODELS = [
  'gemini-2.5-flash-image',
  'gemini-2.0-flash-exp-image-generation',
  'gemini-3-pro-image-preview'
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateWithModel(modelName, prompt, retries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [{
      parts: [{
        text: `Generate an image: ${prompt}`
      }]
    }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"]
    }
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`  Trying ${modelName} (attempt ${attempt}/${retries})...`);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = errorData.error;

        // Check if rate limited
        if (error.code === 429) {
          const retryDelay = error.details?.find(d => d.retryDelay)?.retryDelay || '60s';
          const waitTime = parseInt(retryDelay) || 60;
          console.log(`  Rate limited. Waiting ${waitTime}s before retry...`);

          if (attempt < retries) {
            await sleep(waitTime * 1000);
            continue;
          }
        }

        console.log(`  Error: ${error.message?.substring(0, 100)}`);
        return null;
      }

      const data = await response.json();

      // Extract image from response
      if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData?.mimeType?.startsWith('image/')) {
            return {
              data: part.inlineData.data,
              mimeType: part.inlineData.mimeType
            };
          }
        }
      }

      console.log(`  No image in response`);
      return null;

    } catch (error) {
      console.log(`  Network error: ${error.message}`);
      if (attempt < retries) {
        await sleep(5000);
      }
    }
  }

  return null;
}

async function generateImage(slideNum) {
  const promptData = PROMPTS[slideNum];

  if (!promptData) {
    console.error(`No prompt found for slide ${slideNum}`);
    console.log('Available slides:', Object.keys(PROMPTS).join(', '));
    return null;
  }

  console.log(`\nGenerating: ${promptData.name}`);
  console.log(`Prompt: ${promptData.prompt.substring(0, 80)}...`);
  console.log('');

  // Try each model
  for (const model of MODELS) {
    const result = await generateWithModel(model, promptData.prompt);

    if (result) {
      const extension = result.mimeType.split('/')[1] || 'png';
      const filename = `${promptData.name}.${extension}`;
      const filepath = path.join(OUTPUT_DIR, filename);

      const buffer = Buffer.from(result.data, 'base64');
      fs.writeFileSync(filepath, buffer);

      console.log(`\n✓ SUCCESS! Image saved: ${filepath}`);
      console.log(`  Model used: ${model}`);
      console.log(`  Size: ${(buffer.length / 1024).toFixed(1)} KB`);
      return filepath;
    }

    console.log(`  Model ${model} failed, trying next...\n`);
  }

  console.error('\n✗ All models failed. Quota may be exhausted.');
  console.log('\nOptions:');
  console.log('1. Wait for quota reset (usually resets daily)');
  console.log('2. Use Google AI Studio manually: https://aistudio.google.com');
  console.log('3. Check quota: https://ai.dev/rate-limit');

  return null;
}

async function main() {
  const slideNum = parseInt(process.argv[2]) || 6;

  console.log('═'.repeat(50));
  console.log(' DINO Seminar Image Generator');
  console.log(' Gemini/Imagen API');
  console.log('═'.repeat(50));

  await generateImage(slideNum);
}

main();
