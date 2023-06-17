const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/userControllers');
const chatcontroller = require('../controllers/chatControllers')
const verifyJWT = require('../middleWares/verifyJWT')
const { uploadImage } = require('../middleWares/multer')
const { uploadFile } = require('../middleWares/fileUpload')
const { listingFiles } = require('../middleWares/listingFiles')


router.get('/resendOtp', usercontroller.resendOtp)
router.get('/profile', verifyJWT, usercontroller.profile)
router.get('/categories', verifyJWT, usercontroller.categories)
router.get('/packages', verifyJWT, usercontroller.packages)
router.get('/selectcategory/:id', usercontroller.selectcategory)
router.get('/getSellerListings', verifyJWT, usercontroller.getSellerListings)
router.get('/getListing/:id', verifyJWT, usercontroller.getListing)
router.get('/getUser', usercontroller.getUser)
router.get('/allListings', usercontroller.allListings)

router.post('/signup', usercontroller.signup)
router.post('/verifyOtp', usercontroller.verifyOtp)
router.post('/login', usercontroller.login)
router.post('/addProfileImage', verifyJWT, uploadImage.single("image"), usercontroller.AddProfileImage)
router.post('/updateProfile', verifyJWT, usercontroller.updateProfile)
router.post('/createSeller', verifyJWT, uploadFile.single("idProof"), usercontroller.createSeller)
router.post('/createList', verifyJWT, listingFiles.fields([
    { name: 'coverImage', minCount: 1, maxCount: 1 },
    { name: 'images[]', minCount: 1 },
    { name: 'videos[]', maxCount: 1 }
]), usercontroller.createList);

//chat routes

router.post('/newchat', verifyJWT, chatcontroller.createChat);
router.get('/allchats', verifyJWT, chatcontroller.userChats);
router.get('/findchat/:firstId/:secondId', verifyJWT, chatcontroller.findChat);

//message routes

router.post('/addmessage', verifyJWT, chatcontroller.addMessage);

router.get('/getmessages/:chatId', verifyJWT, chatcontroller.getMessages);



module.exports = router;