const sharp = require('sharp');

async function drawBoxesOnImage(inputImagePath, outputImagePath, boxes) {
    // Load the original image
    const image = sharp(inputImagePath);

    // Get metadata to create a transparent overlay
    const { width, height } = await image.metadata();

    // Create a blank transparent image
    const overlay = sharp({
        create: {
            width,
            height,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        }
    });

    // Create the SVG with all boxes
    const svgBoxes = boxes.map(box => {
        const { x, y, width, height } = box;
        return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="red" stroke-width="3"/>`;
    }).join('');

    const svgImage = `
        <svg width="${width}" height="${height}">
            ${svgBoxes}
        </svg>
    `;

    // Composite the SVG onto the overlay
    const overlayBuffer = await overlay
        .composite([{
            input: Buffer.from(svgImage),
            blend: 'over'
        }])
        .toBuffer();

    // Overlay the boxes on the original image
    await image
        .composite([{ input: overlayBuffer, blend: 'over' }])
        .toFile(outputImagePath);

    console.log('Image processed and boxes drawn!');
}

// Example usage
const boxes = [
    { x: 50, y: 50, width: 100, height: 100 },
    { x: 200, y: 150, width: 150, height: 150 }
];

drawBoxesOnImage('input.jpg', 'output.jpg', boxes)
    .catch(err => console.error(err));