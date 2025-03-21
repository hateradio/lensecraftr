const LenseCraftr = require("./lensecraftr");

const rawSegments = [
  {
    text: "Hello",
    boundingBox: { pixelCoords: { x: 100, y: 50, width: 60, height: 20 } }
  },
  {
    text: "World",
    boundingBox: { pixelCoords: { x: 170, y: 53, width: 80, height: 20 } }
  },
  {
    text: "This",
    boundingBox: { pixelCoords: { x: 95, y: 100, width: 50, height: 20 } }
  },
  {
    text: "is",
    boundingBox: { pixelCoords: { x: 150, y: 102, width: 30, height: 20 } }
  },
  {
    text: "lensecraftr",
    boundingBox: { pixelCoords: { x: 190, y: 105, width: 120, height: 20 } }
  }
];

const crafter = new LenseCraftr(1.5, "ltr"); // densityFactor: 1.5, left-to-right ordering.
const { lines, paragraphs } = crafter.process(rawSegments);

console.log("Lines:");
lines.forEach((line, index) => {
  console.log(`Line ${index + 1}: ${line.combinedText}`);
});

console.log("\nParagraphs:");
paragraphs.forEach((para, index) => {
  console.log(`Paragraph ${index + 1}: ${para.combinedText}`);
});
