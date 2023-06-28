const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/profilepics');
        //if possible change the folder name from profilepics
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + file.originalname)
        console.log(file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})


const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}


const uploadImage = multer({ storage: storage, fileFilter: fileFilter })

module.exports = { uploadImage: uploadImage }