"use strict";

const FPUtils = {
  average: (arr) => arr.reduce((acc, val) => acc + val, 0) / arr.length,
  stdDev: (arr) => {
    const mean = FPUtils.average(arr);
    const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  }
};

class Segment {
  constructor(text, boundingBox) {
    this.text = text;
    this.boundingBox = boundingBox;
  }

  get centerY() {
    return this.boundingBox.pixelCoords.y + this.boundingBox.pixelCoords.height / 2;
  }

  get centerX() {
    return this.boundingBox.pixelCoords.x + this.boundingBox.pixelCoords.width / 2;
  }
}

class Line {
  constructor(segments = []) {
    this.segments = segments;
  }

  addSegment(segment, direction = "ltr") {
    this.segments.push(segment);
    this.segments.sort((a, b) => {
      return direction === "ltr" 
        ? a.boundingBox.pixelCoords.x - b.boundingBox.pixelCoords.x 
        : b.boundingBox.pixelCoords.x - a.boundingBox.pixelCoords.x;
    });
  }

  get combinedText() {
    return this.segments.map((seg) => seg.text).join(" ");
  }

  get averageY() {
    const centers = this.segments.map((seg) => seg.centerY);
    return FPUtils.average(centers);
  }
}

class LenseCraftr {
  constructor(densityFactor = 1, direction = "ltr") {
    if (densityFactor < 0 || densityFactor > 4) {
      throw new Error("Density factor must be within [0, 4]");
    }
    this.densityFactor = densityFactor;
    this.direction = direction;
    this.baseDelta = 10;
    this.thresholdY = this.densityFactor * this.baseDelta;
  }

  static createSegments(rawSegments) {
    return rawSegments.map((seg) => new Segment(seg.text, seg.boundingBox));
  }

  groupSegmentsIntoLines(segments) {
    if (!segments || !segments.length) return [];

    const sortedSegments = segments.slice().sort((a, b) => {
      const diffY = a.centerY - b.centerY;
      if (Math.abs(diffY) > this.thresholdY) {
        return diffY;
      } else {
        return a.boundingBox.pixelCoords.x - b.boundingBox.pixelCoords.x;
      }
    });

    const lines = [];
    let currentLine = new Line();

    sortedSegments.forEach((segment) => {
      if (currentLine.segments.length === 0) {
        currentLine.addSegment(segment, this.direction);
      } else {
        const currentAvgY = currentLine.averageY;
        if (Math.abs(segment.centerY - currentAvgY) <= this.thresholdY) {
          currentLine.addSegment(segment, this.direction);
        } else {
          lines.push(currentLine);
          currentLine = new Line();
          currentLine.addSegment(segment, this.direction);
        }
      }
    });

    if (currentLine.segments.length > 0) {
      lines.push(currentLine);
    }
    return lines;
  }

  groupLinesIntoParagraphs(lines) {
    if (!lines || lines.length === 0) return [];

    const paragraphs = [];
    let currentParagraph = new Line();

    for (let i = 0; i < lines.length; i++) {
      if (currentParagraph.segments.length === 0) {
        currentParagraph.segments = lines[i].segments.slice();
      } else {
        const prevY = currentParagraph.averageY;
        const currY = lines[i].averageY;
        if (Math.abs(currY - prevY) <= this.thresholdY * 1.5) {
          lines[i].segments.forEach((seg) => currentParagraph.addSegment(seg, this.direction));
        } else {
          paragraphs.push(currentParagraph);
          currentParagraph = new Line();
          currentParagraph.segments = lines[i].segments.slice();
        }
      }
    }
    if (currentParagraph.segments.length) {
      paragraphs.push(currentParagraph);
    }
    return paragraphs;
  }

  process(rawSegments) {
    try {
      if (!Array.isArray(rawSegments)) {
        throw new Error("Input must be an array of segments");
      }
      const segments = LenseCraftr.createSegments(rawSegments);
      const lines = this.groupSegmentsIntoLines(segments);
      const paragraphs = this.groupLinesIntoParagraphs(lines);
      return { lines, paragraphs };
    } catch (error) {
      console.error("Error in LenseCraftr process:", error);
      throw error;
    }
  }
}

module.exports = LenseCraftr;
