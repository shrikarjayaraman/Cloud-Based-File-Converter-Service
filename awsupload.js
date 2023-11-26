import { GetObjectCommand, ListBucketsCommand, ListObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createReadStream } from "fs";

const client = new S3Client({
    credentials: {
        accessKeyId: " ",
        secretAccessKey: " ",
    },
    region: "ap-south-1"
});

export async function uploadToAWS(filename) {
    const command = new PutObjectCommand({
        Bucket: "virt-s3-ssgsj",
        Key: filename,
        Body: createReadStream(filename),
    });

    try {
        const response = await client.send(command);
        console.log(response);
    } catch (err) {
        console.error(err);
    }
}
// client.send(new ListObjectsCommand({Bucket: 'virt-s3-ssgsj'})).then(console.log);
// client.send(new GetObjectCommand({
//     Bucket: 'virt-s3-ssgsj',
//     Key: 'put the filename here like ./static/output-whatever'
// })).then(console.log);
