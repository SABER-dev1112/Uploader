const fs = require('fs');

const header = Buffer.from('GIF89a', 'ascii');
const body = Buffer.alloc(12 * 1024 * 1024 - header.length, 0);
const fileData = Buffer.concat([header, body]);

async function upload() {
    // Let's try to upload it as a video but renaming extension to .mp4
    // and let Cloudinary process it? Wait, a GIF is not a video if it just has a GIF header.
    // What about using chunked uploads? Or unauthenticated chunked uploads?

    // According to Cloudinary: "When uploading using a simple unauthenticated upload request, the maximum file size is limited to 10 MB. However, you can use the chunked upload API..."

    console.log("This is an unauthenticated upload script so the limit is 10 MB for PRESETS.");

    // Let's test uploading it to auto with chunking.
    // Chunking requires multiple requests. Cloudinary allows unauthenticated chunked uploads up to 100MB!

    const chunk_size = 6 * 1024 * 1024; // 6MB chunk
    const fileSize = fileData.length;
    const uniqueUploadId = 'test_' + Date.now();

    let start = 0;
    let chunkCount = 0;

    while (start < fileSize) {
        const end = Math.min(start + chunk_size, fileSize);
        const chunk = fileData.slice(start, end);

        const formData = new FormData();
        formData.append('file', new Blob([chunk]), 'toolarge.gif');
        formData.append('upload_preset', 'Upload');

        const res = await fetch('https://api.cloudinary.com/v1_1/du2knsck4/auto/upload', {
            method: 'POST',
            headers: {
                'X-Unique-Upload-Id': uniqueUploadId,
                'Content-Range': `bytes ${start}-${end - 1}/${fileSize}`
            },
            body: formData
        });

        const text = await res.text();
        console.log(`Chunk ${start}-${end - 1}:`, res.status, text);
        start = end;
    }
}

upload().catch(console.error);
