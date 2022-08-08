const fs = require('fs');
const { s3Client } = require('../utils/s3-client');
const { Upload } = require('@aws-sdk/lib-storage');
const { path } = require("path");

const uploadImage = async (req, res, next) => {
    try {
        const r = Date.now() + Math.round(Math.random() * 1E9);
        const newFile = fs.createWriteStream(r.toString() + '.txt');
        let data;
        newFile.on('open', () => {
            console.log('opening file');
            req.pipe(newFile, (error) => {
                throw Error(error);
            });

            req.on('end', async (error) => {
                console.log('no more data');
                data = fs.readFileSync(newFile.path, "base64");
                fs.rm(newFile.path, async (error) => {
                    if (error) {
                        throw Error(error);
                    } else {
                        newFile.close();
                    }
                });
            });
        });

        newFile.on('close', async () => {
            console.log('closing file');
            const bucketParams = {
                Bucket: process.env.AWS_S3_BUCKETNAME,
                // Specify the name of the new object. For example, 'index.html'.
                // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
                Key: r.toString() + '.txt',
                // Content of the new object.
                Body: data,
                ContentLength: data.length
            };
            const imageLocation = bucketParams.Bucket + "/" + bucketParams.Key;
            const upload = new Upload({
                client: s3Client,
                params: bucketParams
            });
            upload.on("httpUploadProgress", (progress) => {
                console.log(progress);
            });
            const result = await upload.done();
            req.body = { image: result.Location };
            next();
        });
    } catch (err) {
        throw Error(err);
    }
};

module.exports = {
    uploadImage
};