import fs from "fs";
import docxToPdf from "docx-pdf";

export default async function convertDocxToPDF(sourcePath, destinationPath) {
    return new Promise((res, rej) => {
        docxToPdf(sourcePath, destinationPath, (err, result) => {
            if (err == null) {
                console.log(`Converted ${sourcePath} to ${destinationPath}.`);
                res(result);
            } else {
                console.log(err);
                rej(err);
            }
        });
    });
}
