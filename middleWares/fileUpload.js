const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files/IDproofs');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + file.originalname)
        console.log(file.fieldname + '_' + Date.now() + file.originalname)
    }
})

const uploadFile = multer({ storage: storage })

module.exports = { uploadFile: uploadFile }