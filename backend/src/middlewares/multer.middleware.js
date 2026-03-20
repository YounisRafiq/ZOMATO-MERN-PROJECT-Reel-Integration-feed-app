const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, video, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, video, cb) {
    cb(null, video.originalname)
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
