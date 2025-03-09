import getImagesForPdf from './Modules/getImagesFromPdf.mjs';
import getTextFromImage from './Modules/getTextFromImage.mjs';
import convertHocrToImage from './Modules/ConvertHocrToImage.mjs'
async function main()
{
    //const pdfPath = "pdf\\Paper1.pdf";
    //Generate images of the paper pdf
    //const images = await getImagesForPdf(pdfPath)
    //console.log(images)
    //Cut the pieces of each page of paper into different pics
    //Verify the cuts and approve them
    //refine contents from the paper
    //Verify them
    //Post them to the website
    const output = await getTextFromImage("./images/minipage1.png");
    console.log(output.data.box);
    // Run the function to draw bounding boxes
    convertHocrToImage("./images/minipage1.png","../server/public/images/Outputpage1.png",output.data.hocr);
}
await main();