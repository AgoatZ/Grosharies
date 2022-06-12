const fs = require('fs');

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

        // req.on('data', function (chunk, error) {
        //   console.log('here');
        //   chData.push(chunk);
        // });

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
      
      newFile.on('close', () => {
        console.log('closing file');
        //const enc = Buffer.from(chData.toString()).toString("base64");
        //const enc = chData.toString("base64");
        req.body = { image: data };
        next();
      });
    } catch (err) {
      throw Error(err);
    }
  };

  module.exports = {
    uploadImage
  };