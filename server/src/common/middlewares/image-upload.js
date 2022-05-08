const fs = require('fs');
const GroceryService = require('.././../grocery/grocery.services');
const PostService = require('.././../post/post.services');
const EventService = require('.././../event/event.services');
const UserService = require('.././../user/user.services');

const { promisify } = require('util');


const uploadImage = async (req, res, type) => {
  try {
    let service;
    switch (type) {
      case 'grocery':
        service = GroceryService;
        break;

      case 'post':
        service = PostService;
        break;

      case 'event':
        service = EventService;
        break;
        
      case 'user':
        service = UserService;
        break;

      default:
        break;
    }
    const r = Date.now() + Math.round(Math.random() * 1E9);
    var fileBytes = req.headers['content-length'];
    const newFile = fs.createWriteStream(r.toString() + '.txt');
    var uploadedBytes = 0;
    req.pipe(newFile, (error) => {
      throw Error(error);
    });
    const chData = [];
    req.on('data', function (chunk, error) {
      // uploadedBytes += chunk.length;
      // var progress = (uploadedBytes / fileBytes) * 100;
      //res.write('progress: '+ parseInt(progress, 10) + "%\n");
      chData.push(chunk);
    });

    req.on('end', async (error) => {
      const enc = Buffer.from(chData.toString()).toString("base64");
      fs.rm(newFile.path, async (error) => {
        if (error) {
          throw Error(error);
        } else {
          const oldG = await service.update(req.params.id, { image: enc });
          return res.status(200).json({ message: 'Successfully uploaded image' });
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