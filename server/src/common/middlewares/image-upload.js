const fs = require('fs');
const GroceryService = require('.././../grocery/grocery.services');
const PostService = require('.././../post/post.services');
const EventService = require('.././../event/event.services');
const UserService = require('.././../user/user.services');

const uploadImage = async (req, res, next) => {
    try {
      const r = Date.now() + Math.round(Math.random() * 1E9);
      const newFile = fs.createWriteStream(r.toString() + '.txt');
      const chData = [];
      newFile.on('open', () => {
        console.log('opening file');
        req.pipe(newFile, (error) => {
          throw Error(error);
        });

        req.on('data', function (chunk, error) {
          console.log('rec data');
          chData.push(chunk);
        });

        req.on('end', async (error) => {
          console.log('no more data');
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
        const enc = Buffer.from(chData.toString()).toString("base64");
        req.body = { image: enc };
        next();
      })
    } catch (err) {
      throw Error(err);
    }
  };

  module.exports = {
    uploadImage
  };