const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/userControllers');
const chatcontroller = require('../controllers/chatControllers')
const ordercontroller = require('../controllers/orderController')
const verifyJWT = require('../middleWares/verifyJWT')
const { uploadImage } = require('../middleWares/multer')
const { uploadFile } = require('../middleWares/fileUpload')
const { listingFiles } = require('../middleWares/listingFiles')


router.get('/resendOtp', usercontroller.resendOtp)
router.get('/profile', verifyJWT, usercontroller.profile)
router.get('/categories', usercontroller.categories)
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

router.post('/changeListingStatus/:id', usercontroller.changeStatus)

//chat routes

router.post('/newchat', verifyJWT, chatcontroller.createChat);
router.get('/allchats', verifyJWT, chatcontroller.userChats);
router.get('/findchat/:firstId/:secondId', verifyJWT, chatcontroller.findChat);

//message routes

router.post('/addmessage', verifyJWT, chatcontroller.addMessage);
router.get('/getmessages/:chatId', verifyJWT, chatcontroller.getMessages);

//order routes

router.get('/stripe/publish_key', ordercontroller.stripe_PublishKey)
router.get('/getActiveOrder/:id', verifyJWT, ordercontroller.getActiveOrder)
router.get('/allBuyOrders', verifyJWT, ordercontroller.allBuyOrders)
router.get('/getOrder/:id', ordercontroller.getOrder)
router.get('/allSellOrders', verifyJWT, ordercontroller.allSellOrders)
router.get('/download/:id', ordercontroller.download)
router.get('/checkUserOrdered/:id', verifyJWT, ordercontroller.checkUserOrdered)

router.post('/createOrder', verifyJWT, uploadImage.single("file"), ordercontroller.createOrder)
router.put('/confirmOrder', ordercontroller.confirmOrder)
router.put('/startOrder/:id', ordercontroller.startOrder)
router.post('/deliverOrder/:id', listingFiles.single('deliveryItem'), ordercontroller.deliverOrder)
router.put('/acceptDelivery/:id', ordercontroller.acceptOrder)
router.post('/returnDelivery/:id', ordercontroller.returnDelivery)

//reviews and ratings
router.get('/allReviews/:id', ordercontroller.allReviews)
router.get('/isReviewExist/:id', verifyJWT, ordercontroller.isReviewExist)

router.post('/addReview/:id', verifyJWT, ordercontroller.addReview)
router.post('/deleteReview/:id', ordercontroller.deleteReview)

module.exports = router;