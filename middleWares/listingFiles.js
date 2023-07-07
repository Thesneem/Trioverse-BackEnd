const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('yyyy')
        //console.log('Files', req.file)
        //console.log('testtttt', req.files.images)
        cb(null, 'public/uploads/listingImages');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + file.originalname)
        //console.log(file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

const uploadlistingImage = multer({ storage: storage })

module.exports = { listingFiles: uploadlistingImage }