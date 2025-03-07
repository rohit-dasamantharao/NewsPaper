import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';
import xml2js from 'xml2js';


// Parse the HOCR file
const parseHOCR = (hocrDataRaw) => {
  const parser = new xml2js.Parser();
  return new Promise((resolve, reject) => {
    parser.parseString(hocrDataRaw, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Step 2: Extract bounding boxes and word text from the HOCR
const extractWords = (page) => {
    const words = [];
  
    // Iterate through all ocr_carea elements in the page
    const areas = page.div.div; // Assumes div[0] is 'ocr_page' and div[1+] are content areas
    var text = "";
    // Loop over each content area (ocr_carea)
    areas.forEach((area) => {
      if (area.p) {  // Ensure there are paragraphs (p elements)
        const paragraphs = Array.isArray(area.p) ? area.p : [area.p]; // Make sure it's an array
  
        paragraphs.forEach((p) => {
          if (p.span) {
            const spans = Array.isArray(p.span) ? p.span : [p.span];  // Ensure it's an array of spans
            //Spans
            spans.forEach((morespans) => {
                //morespans
                const Allspans = Array.isArray(morespans.span) ? morespans.span : [morespans.span];  // Ensure it's an array of spans
                Allspans.forEach((span)=>{
                    console.log("more spans")
                    console.log(span);
                const wordText = span._ || span['#text']; // Extract word text from span (in _ or '#text')
                const title = span.$ && span.$.title; // Bounding box info in the title
    
                if (wordText && title && title.includes('bbox')) {
                    const bboxMatch = title.match(/bbox (\d+) (\d+) (\d+) (\d+)/); // Extract bbox coordinates
                    if (bboxMatch) {
                    const [_, x0, y0, x1, y1] = bboxMatch.map(Number);
                        if( true){
                            words.push({ wordText, bbox: { x0, y0, x1, y1 } });
                            if(wordText!="")
                            text = text+ " "+wordText;
                        }
                    }
                }
              });
            });
          }
        });
      }
    });
    console.log(text)
    return words;
  };

// Step 3: Draw bounding boxes on the image
const drawBoundingBoxes = async (imageFilePath,outputFilePath,hocrDataRaw) => {
    try {
      // Step 1: Parse the HOCR file
      const hocrData = await parseHOCR(hocrDataRaw);
  
      // Step 2: Extract words with their bounding boxes from HOCR data
      const words = extractWords(hocrData);
  
      // Step 3: Load the image using node-canvas
      const image = await loadImage(imageFilePath);
  
      // Step 4: Create a canvas with the same dimensions as the image
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
  
      // Draw the original image onto the canvas
      ctx.drawImage(image, 0, 0);
  
      // Step 5: Loop through each word and draw bounding boxes
      words.forEach((word) => {
        const { x0, y0, x1, y1 } = word.bbox;
  
        // Debugging: Log word text and bbox
        console.log(`Drawing box for word: ${word.wordText}, Bbox: [${x0}, ${y0}, ${x1}, ${y1}]`);
  
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
      });
  
      // Step 6: Save the output image with bounding boxes
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputFilePath, buffer);
  
      console.log('Output image saved to', outputFilePath);
    } catch (error) {
      console.error('Error:', error);
    }
  };
// Run the function to draw bounding boxes
export default drawBoundingBoxes;
