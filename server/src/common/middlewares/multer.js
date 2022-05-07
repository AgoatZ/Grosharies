// const { getPostById, updatePost } = require("../../post/post.repository");
// const fs = require('fs');

// // var storage = multer.diskStorage({
// //     destination: (req, file, cb) => {
// //         cb(null, path.join(__dirname + "/public/res/"));
// //     },
// //     filename: (req, file, cb) => {
// //         cb(null, file.fieldname + "-" + Date.now());
// //     },
// // });

// //app.post(
// //"/uploadImage/:postId",
// /* upload.single("file"),*/ //(req, res) => {
// const uploadImage = async (req, res) => {
//     const post = await getPostById(req.params.postId);
//     var newFile = fs.createWriteStream("readme_copy.md");
//     var fileBytes = request.headers['content-length'];
//     var uploadedBytes = 0;

//     request.pipe(newFile);

//     request.on('data', function (chunk) {
//         uploadedBytes += chunk.length;
//         var progress = (uploadedBytes / fileBytes) * 100;
//         response.write('progress: ' + parseInt(progress, 10) + "%\n");
//     });

//     request.on('end', function () {
//         response.end('uploaded!');
//     });
//     //console.log("req.body = " + JSON.stringify(req.body));

//     var img = fs.readFileSync(req.file.path);
//     var encoded_img = img.toString("base64");
//     await updatePost(postId, { images: [encoded_img] });

//     /*  var img = {
//     data: fs.readFileSync(
//       path.join(__dirname + "/public/res/" + req.file.filename)
//     ),
//     contentType: "image/png",
//   };*/

//     Ads.findOneAndUpdate(adName, [encode_img]);
// }
//   );
