import Lens from 'chrome-lens-ocr';
import LenseCrafter from './lensecraftr.js';

const lens = new Lens();

const file = 'page1.png';

const crafter = new LenseCrafter(1.5, "ltr"); // densityFactor: 1.5, left-to-right ordering.

lens.scanByFile(file).then( ({segments}) => {
    const { lines, paragraphs } = crafter.process(segments);
    console.log("Lines:");
    lines.forEach((line, index) => {
      console.log(`Line ${index + 1}: ${line.combinedText}`);
    });
    
    console.log("\nParagraphs:");
    paragraphs.forEach((para, index) => {
      console.log(`Paragraph ${index + 1}: ${para.combinedText}`);
    });

}).catch(console.error);
