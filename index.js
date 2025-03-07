var pdf2img = require('pdf-img-convert');
var fs = require('fs');

(async function () {
    pdfArray = await pdf2img.convert('C:\\Users\\dasam\\proj\\NewsPaper\\NewPaperPdf\\Paper1.pdf');
    console.log("saving");
    for (i = 0; i < pdfArray.length; i++){
      fs.writeFile("output"+i+".png", pdfArray[i], function (error) {
        if (error) { console.error("Error: " + error); }
      }); //writeFile
    } // for
  })();