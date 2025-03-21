# lensecraftr
shake a lens at it

circa MMXXV

lensecraftr is a modular, object-oriented JavaScript library designed to post-process OCR segments by grouping them into line and paragraph blocks based on pixel density and spatial proximity. It leverages simple statistical measures along with a density factor (from 0 to 4) to dynamically determine grouping thresholds. lensecraftr is ideal for use in operations where OCR output requires organizational structure—especially for documents with form text or simulated paragraphs.

* * *

Features
--------

*   **Segment Grouping:** Groups OCR segments based on their Y-coordinate proximity.
*   **Customizable Density Factor:** Adjust the sensitivity of grouping using a density factor on a simple 0–4 scale.
*   **Bi-directional Sorting:** Supports both left-to-right (LTR) and right-to-left (RTL) ordering for languages with different reading orders.
*   **Functional & Object-Oriented Design:** Combines robust OOP patterns with functional programming techniques (via map, filter, reduce) to create an efficient and modular pipeline.
*   **Resilient & Testable:** Built with error handling and modular functions that can be scaled or extended for more complex layouts.

* * *

Installation
------------

Clone or download the repository, then include the script in your project. If you're using Node.js, you might install it as a module by copying `lensecraftr.js` into your project directory.

* * *

Usage
-----

### Importing lensecraftr

In a Node.js environment:

```javascript

const lensecraftr = require('./lensecraftr');
```

### Basic Example

Here's a basic example using a set of raw OCR segments:

```javascript

const rawSegments = [
  {
    text: "Hello",
    boundingBox: { pixelCoords: { x: 100, y: 50, width: 60, height: 20 } },
  },
  {
    text: "World",
    boundingBox: { pixelCoords: { x: 170, y: 53, width: 80, height: 20 } },
  },
  {
    text: "This",
    boundingBox: { pixelCoords: { x: 95, y: 100, width: 50, height: 20 } },
  },
  {
    text: "is",
    boundingBox: { pixelCoords: { x: 150, y: 102, width: 30, height: 20 } },
  },
  {
    text: "lensecraftr",
    boundingBox: { pixelCoords: { x: 190, y: 105, width: 120, height: 20 } },
  },
];
const crafter = new lensecraftr(1.5, "ltr");
const { lines, paragraphs } = crafter.process(rawSegments);
console.log("Lines:");
lines.forEach((line, index) => {
  console.log(`Line ${index + 1}: ${line.combinedText}`);
});
console.log("\nParagraphs:");
paragraphs.forEach((para, index) => {
  console.log(`Paragraph ${index + 1}: ${para.combinedText}`);
});


```

### Using Different Density Factors

Adjust the grouping sensitivity by specifying different density factors (scale 0 to 4):

```javascript

const crafterLow = new lensecraftr(0.5, "ltr"); // Process rawSegments with a low density factor
const crafterHigh = new lensecraftr(4, "ltr"); // Process rawSegments with a high density factor
```

### Right-to-Left (RTL) Sorting

This is expecting that segments were able to be captured with the right words in intended language.

For OCR data in RTL languages:

```javascript

const rawSegmentsRTL = [
  {
    text: "مرحبا",
    boundingBox: { pixelCoords: { x: 200, y: 40, width: 70, height: 20 } },
  },
  {
    text: "بك",
    boundingBox: { pixelCoords: { x: 130, y: 42, width: 60, height: 20 } },
  },
  {
    text: "العالم",
    boundingBox: { pixelCoords: { x: 250, y: 45, width: 80, height: 20 } },
  },
];
const crafterRTL = new lensecraftr(1, "rtl");
const { lines } = crafterRTL.process(rawSegmentsRTL);
lines.forEach((line, index) => {
  console.log(`Line ${index + 1}: ${line.combinedText}`);
});

```

### Asynchronous Workflow Integration

lensecraftr can easily be integrated with asynchronous OCR libraries. For instance, using the `chrome-lens-ocr`:

```javascript

const lensecraftr = require("./lensecraftr");
const Lens = require("chrome-lens-ocr");
const lens = new Lens(); lens.scanByFile("path/to/your/image.jpg")   .then((rawSegments) => {
    const crafter = new lensecraftr(1.5, "ltr");
    const { lines, paragraphs } = crafter.process(rawSegments);
    console.log("Extracted Lines:");
        lines.forEach((line, index) => {
            console.log(`Line ${index + 1}: ${line.combinedText}`);
            });
        })
        .catch((error) => console.error("OCR scan failed:", error));
```

* * *

API Reference
-------------

### Class: lensecraftr

*   **Constructor:**  
    `new lensecraftr(densityFactor, direction)`
    
    *   _densityFactor:_ A number between 0 and 4 (default: 1).
    *   _direction:_ `"ltr"` or `"rtl"` (default: `"ltr"`).
*   **Method:** `process(rawSegments)`  
    Processes an array of raw OCR segments and returns an object containing the grouped `lines` and `paragraphs`.
    
*   **Method:** `groupSegmentsIntoLines(segments)`  
    Internally used to group segments into lines based on spatial proximity.
    
*   **Method:** `groupLinesIntoParagraphs(lines)`  
    Internally used to merge lines into paragraphs based on vertical distance.
    
*   **Static Method:** `createSegments(rawSegments)`  
    Converts raw segments into `Segment` objects.
    

### Class: Segment

Represents a single OCR segment with text and bounding box data.

*   **Properties:**
    
    *   `text` — The recognized text.
    *   `boundingBox` — The bounding box data with `pixelCoords`.
*   **Getters:**
    
    *   `centerY` — Vertical center calculated from the bounding box.
    *   `centerX` — Horizontal center calculated from the bounding box.

### Class: Line

Represents a group of segments (a line or a paragraph).

*   **Method:** `addSegment(segment, direction)`  
    Adds a segment to the line and sorts based on the specified direction.
    
*   **Getters:**
    
    *   `combinedText` — Returns a concatenated string of the contained segments’ text.
    *   `averageY` — Computes the average Y coordinate of all segments within the line.

* * *

Contributing
------------

Contributions to lensecraftr are welcome! If you have ideas for improvements or additional features, please open an issue or submit a pull request.

* * *

License
-------

This project is licensed under the MIT License.

* * *

Acknowledgments
---------------

lensecraftr was designed to simplify the process of grouping OCR segments using a blend of object-oriented and functional programming strategies. Special thanks to the developers and the community that continue to innovate and contribute ideas to OCR post-processing techniques.

Enjoy crafting with lensecraftr!
