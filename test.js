const crypto = require('crypto');

const API_KEY = '234262158991291';
const API_SECRET = 'ziFe2psPslOs0GE27AMClWDVXh8';
const CLOUD_NAME = 'du2knsck4';

const header = Buffer.from('GIF89a', 'ascii');
const body = Buffer.alloc(12 * 1024 * 1024 - header.length, 0);
const fileData = Buffer.concat([header, body]);

async function upload() {
    const timestamp = Math.floor(Date.now() / 1000);
    const strToSign = `timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

    const formData = new FormData();
    const blob = new Blob([fileData], { type: 'image/gif' });
    formData.append('file', blob, 'test.gif');
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    // Let's test the /auto/upload endpoint authenticated
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData
    });

    const text = await res.text();
    console.log('Authenticated /auto/upload:', res.status, text);
}

upload().catch(console.error);
