import Tesseract from 'tesseract.js';
import { promises as fs } from "node:fs";

export default async function readText(image)
{
  var output = await Tesseract.recognize(image,'tel',{logger:e => process.stdout.write(".")})
  //console.log(output)
  await fs.writeFile('output.txt', output.data.text);
  console.log(output);
  return output;
}