const fs = require('fs');
const { s3Client } = require('../utils/s3-client');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
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
            const run = async () => {
                try {
                    const response = await s3Client.send(new PutObjectCommand(bucketParams));
                    return response; // For unit tests.
                    console.log("Successfully uploaded object:", imageLocation);
                } catch (err) {
                    console.log("Error", err);
                }
            };
            const s3Answer = await run();
            console.log("S3 Answer is:", s3Answer);
            
            req.body = { image: imageLocation };
            next();
        });
    } catch (err) {
        throw Error(err);
    }
};

module.exports = {
    uploadImage
};