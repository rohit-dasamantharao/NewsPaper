/*const fs = require('fs');
const pdf = require('pdf-parse');
 
let dataBuffer = fs.readFileSync('pdf\\Paper1.pdf');

pdf(dataBuffer).then(function(data) {
 
    // number of pages
    console.log(data.numpages);
    // number of rendered pages
    console.log(data.numrender);
    // PDF info
    console.log(data.info);
    // PDF metadata
    console.log(data.metadata); 
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    console.log(data.version);
    // PDF text
    console.log(data.text); 
        
});
*/
var pdfUtil = require('pdf-to-text');
var pdf_path = "pdf\\Paper1.pdf";


pdfUtil.info(pdf_path, function(err, info) {
    if (err) throw(err);
    console.log(info);
});

