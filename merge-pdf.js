import pdfMerge from "pdf-merger-js";

// import { uploadToAWS } from "./awsupload";

export default async function mergePDFs(sourcePaths, filename) {
    const merger = new pdfMerge();
    for (const src of sourcePaths) {
        await merger.add(src);
    }
    await merger.save(filename);
}
