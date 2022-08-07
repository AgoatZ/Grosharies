const fs = require('fs');

const uploadImage = async (req, res, next) => {
  try {
    const r = Date.now() + Math.round(Math.random() * 1E9);
    const newFile = fs.createWriteStream(r.toString() + '.txt');
    let data;
    newFile.on('open', () => {
      req.pipe(newFile, (error) => {
        throw Error(error);
      });

      req.on('end', async (error) => {
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