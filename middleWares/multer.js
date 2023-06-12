const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/profilepics');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + file.originalname)
        //console.log(file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

const uploadImage = multer({ storage: storage })

module.exports = { uploadImage: uploadImage }