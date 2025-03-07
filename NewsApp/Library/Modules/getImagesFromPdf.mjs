import { promises as fs } from "node:fs";
import { pdf } from "pdf-to-img";

const generateImagesFromPdf = async function (pdfPath,socket,pagecount) {
  let counter = 1;
  const document = pagecount != undefined? await pdf(pdfPath, { scale: 3 },pagecount):
                                           await pdf(pdfPath, { scale: 3 });
  var Images = [];
  for await (const image of document) {
    var imageName = `page${counter}.png`;
    await fs.writeFile("..\\server\\public\\images\\"+imageName, image);
    Images.push(imageName)
    if(socket!=null){
      socket.emit('progress',{imageCount:counter,imageName:imageName});
    }
    counter++;
    if(pagecount!=undefined && counter> pagecount) break;
  }
  return Images;
}

export default generateImagesFromPdf;
