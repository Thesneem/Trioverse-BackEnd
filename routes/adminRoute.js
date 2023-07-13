const express = require('express');
const admincontroller = require('../controllers/adminControllers');
const verifyJWT = require('../middleWares/verifyJWT')
const { uploadImage } = require('../middleWares/multer')

const router = express.Router();

router.get('/users', verifyJWT, admincontroller.users)
router.get('/sellers', verifyJWT, admincontroller.sellers)
router.get('/categories', verifyJWT, admincontroller.categories)
router.get('/getCategory/:id', admincontroller.getCategory)
router.get('/subCategories', verifyJWT, admincontroller.subCategories)
router.get('/getSubCategory/:id', admincontroller.getSubcategory)
router.get('/packages', verifyJWT, admincontroller.packages)
router.get('/getPackage/:id', admincontroller.getPackage)
router.get('/getDashboardData', verifyJWT, admincontroller.getDashboardData)
router.get('/getOrders', admincontroller.getOrders)



router.post('/login', admincontroller.adminLogin)
router.post('/editUser/:id', admincontroller.editUser)
router.post('/addCategory', uploadImage.single("image"), verifyJWT, admincontroller.addCategory)
router.post('/editCategory/:id', uploadImage.single("image"), admincontroller.editCategory)
router.post('/addSubCategory', admincontroller.addSubCategory)
router.post('/editSubCategory/:id', admincontroller.editSubCategory)
router.post('/listCategory/:id', verifyJWT, admincontroller.listCategory)
router.post('/listSubCategory', admincontroller.listSubCategory1)
router.post('/addPackage', verifyJWT, admincontroller.addPackage)
router.post('/listPackage/:id', admincontroller.listPackage)
router.post('/editPackage/:id', admincontroller.editPackage)
router.post('/approveSeller/:id', admincontroller.approveSeller)
router.post('/salesreport', admincontroller.getSalesReport)


module.exports = router;