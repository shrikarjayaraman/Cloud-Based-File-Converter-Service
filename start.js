import express from "express";

import fileUpload from "express-fileupload";
import mergePDFs from "./merge-pdf.js";
import convertDocxToPDF from "./convert-docx-to-pdf.js";
import convertJPGtoPNG from "./convert-jpg-to-png.js";
import { uploadToAWS } from "./awsupload.js";
import cookieparser from "cookie-parser";
import capabilities from "./capabilities.json" assert { type: "json" };
import { createWriteStream } from "fs";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
app.use(express.static("static"));
app.use(cookieparser("marauder"));

const logfile = createWriteStream("access-log", { encoding: "utf-8", flags: "a" });
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    res.cookie("username", username, { maxAge: 1000 * 60 * 60 * 24 * 7, signed: true });
    res.redirect("/");
});

app.post("/convert", async (req, res) => {
    const username = req.signedCookies.username;
    const allowed = capabilities[username]?.split(",");
    console.log(allowed);
    const id = Math.floor(Math.random() * 10000000);
    let embed = "application/pdf";
    const filename = `./static/output-${id}`;
    let extension = "pdf";
    if (req.body.type == "1") {
        if (!allowed?.includes("merge")) {
            return res.send("You do not have access to this feature");
        }
        const sourcePaths = req.files.multiplefiles.map(x => x.tempFilePath);
        extension = "pdf";
        await mergePDFs(sourcePaths, filename + "." + extension);
        logfile.write(`${username} accessed the merge feature at ${new Date().toISOString()}\n`);
    } else if (req.body.type == "2") {
        if (!allowed?.includes("docx")) {
            return res.send("You do not have access to this feature");
        }
        const sourcePath = req.files.multiplefiles.tempFilePath;
        extension = "pdf";
        await convertDocxToPDF(sourcePath, filename + "." + extension);
        logfile.write(`${username} accessed the docx feature at ${new Date().toISOString()}\n`);
    } else if (req.body.type == "3") {
        if (!allowed?.includes("jpg")) {
            return res.send("You do not have access to this feature");
        }
        embed = "image/png";
        const sourcePath = req.files.multiplefiles.tempFilePath;
        extension = "png";
        await convertJPGtoPNG(sourcePath, filename + "." + extension);
        logfile.write(`${username} accessed the jpg feature at ${new Date().toISOString()}\n`);
    }

    const resultFilename = filename + "." + extension;
    await uploadToAWS(resultFilename);
    res.send(
        `
        <!DOCTYPE html>
        <html>
        <body>
        <h1>Here is your file</h1>
        <object data="/output-${id}.${extension}" type="${embed}">
        </object>
        </body>
        </html>
        `
    );
});

app.listen(8000, () => console.log("listening"));
