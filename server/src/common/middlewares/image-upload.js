const fs = require('fs');
const Grocery = require('.././../grocery/grocery.model');
const { promisify } = require('util');


const uploadImage = async (req, res) => {
  try {
    const r = Date.now() + Math.round(Math.random() * 1E9);
    var fileBytes = req.headers['content-length'];
    const newFile = fs.createWriteStream(r.toString() + '.txt');
    var uploadedBytes = 0;
    req.pipe(newFile, (error) => {
      throw Error(error);
    });
    var chData = [];
    req.on('data', function (chunk, error) {
      // uploadedBytes += chunk.length;
      // var progress = (uploadedBytes / fileBytes) * 100;
      chData += chunk;
      //res.write('progress: '+ parseInt(progress, 10) + "%\n");
    });
    
    await req.on('end', async (error) => {
      const enc = chData.toString("base64");
      fs.rm(newFile.path, (error) => {
        if (error) {
          throw Error(error);
        } else {
          console.log(enc);
          myfunc(enc)
          return res.status(200).json({ image: enc});
        }
    });
  });
  } catch (err) {
    throw Error(err);
  }
};

module.exports = {
  uploadImage
};