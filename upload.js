const path = require('path');
const fs = require('fs');
const util = require('util');
const { parse } = require('querystring');

const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

const TEMP_DIR = '/tmp/uploads'; // Netlify Functions have a writable /tmp directory

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const boundary = event.headers['content-type'].split('boundary=')[1];
  const fileData = await parseFormData(event.body, boundary);

  const filePath = path.join(TEMP_DIR, fileData.filename);
  await writeFile(filePath, fileData.file);

  // Set file expiration logic (e.g., delete after 7 days) here if needed

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'File uploaded successfully!', filePath }),
  };
};

async function parseFormData(body, boundary) {
  // Implement form data parsing here (including file handling)
  // For simplicity, this is a placeholder implementation
  return {
    filename: 'uploaded-file.txt',
    file: Buffer.from(body),
  };
}
