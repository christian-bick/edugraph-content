import { readdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '..', '..');
const DATASET_DIR = resolve(PROJECT_ROOT, 'out', 'ml-dataset', 'train');

if (!existsSync(DATASET_DIR)) {
    console.error(`Dataset directory not found: ${DATASET_DIR}`);
    process.exit(1);
}

// Group files by visual module
const files = readdirSync(DATASET_DIR).filter(f => f.endsWith('.png'));
const moduleMap = new Map<string, string[]>();

for (const file of files) {
    // Format: id_rendererId_params_inst-X_view-Y.png
    // e.g. arithmetic-1-705-subtract--6503_operations-boxes-single_blankPart-answer_inst-0_view-A.png
    
    // Extract the rendererId by splitting by '_'
    const parts = file.split('_');
    if (parts.length >= 2) {
        let rendererId = parts[1];
        // handle 'operations-boxes-single' which has hyphens but no underscores
        if (!moduleMap.has(rendererId)) {
            moduleMap.set(rendererId, []);
        }
        moduleMap.get(rendererId)!.push(file);
    }
}

console.log('--- Random Sample Selection for Visual Validation ---');

const samples: { module: string, qPath: string, aPath: string }[] = [];

for (const [module, moduleFiles] of moduleMap.entries()) {
    // Find a random Question file
    const qFiles = moduleFiles.filter(f => f.includes('_view-Q.png'));
    if (qFiles.length === 0) continue;
    
    const randomQFile = qFiles[Math.floor(Math.random() * qFiles.length)];
    
    // Find the corresponding Answer file
    const baseName = randomQFile.replace('_view-Q.png', '');
    const expectedAFile = `${baseName}_view-A.png`;
    
    if (moduleFiles.includes(expectedAFile)) {
        samples.push({
            module: module,
            qPath: resolve(DATASET_DIR, randomQFile),
            aPath: resolve(DATASET_DIR, expectedAFile)
        });
    }
}

console.log(`Selected ${samples.length} pairs for review.\n`);

for (const sample of samples) {
    console.log(`[Module: ${sample.module}]`);
    console.log(`Q: ${sample.qPath}`);
    console.log(`A: ${sample.aPath}\n`);
}

console.log('--- Validation Checklist ---');
console.log(`
1. Strict Stimulus/Response Coloring:
   - Q images must contain NO green.
   - A images must contain forestgreen highlighting strictly the missing solution element.
2. Operations (Boxes & Vertical): Blank part missing in Q, green in A.
3. Measure Length:
   - Normal: Rectangle is colored. Box text empty in Q, green in A.
   - Reverse: Box text black. Rectangle hidden in Q, green in A.
4. Counting Inc/Dec: Horizontal layout. Indicator left of box, up/down triangle with bold white '1'.
5. Numbers Order: Horizontal layout. Connecting arrow reflects sorting direction (↗ or ↘).
6. Numbers Write: Order: Ten-frame -> Number Label -> Writing Boxes. Ten-frame pre-filled with blue dots (not green).
7. Time Analog:
   - Normal: Hands black. Box empty in Q, green in A.
   - Reverse: Box text black. Hands hidden in Q, green in A.
`);

// TODO (Option 3): Integrate Google Vertex AI or Gemini SDK here
// to loop over `samples`, encode the images as base64, attach the checklist prompt,
// and parse the JSON results.
