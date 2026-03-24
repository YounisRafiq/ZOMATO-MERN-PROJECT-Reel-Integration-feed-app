const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, image, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, image, cb) {
    cb(null, image.originalname)
  }
});

const upload2 = multer({ storage: storage });
module.exports = upload2;
