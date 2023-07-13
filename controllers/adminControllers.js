const mongoose = require('mongoose');
const usermodel = require('../models/userModel')

require('dotenv').config(); // Load environment variables from .env file
const categorymodel = require('../models/categoryModel');
const packagemodel = require('../models/packagesModel');
const packagesModel = require('../models/packagesModel');
const { createToken } = require('../middleWares/JWTtoken')
const ordermodel = require('../models/orderModel')



// const maxAge = 3 * 24 * 60 * 60
// const createToken = (id, email, type) => {
//     return jwt.sign({ id, email, type }, jwtSecret, {
//         expiresIn: maxAge
//     })
// }

const Adminemail = process.env.ADMIN_USERNAME;
const Adminpassword = process.env.ADMIN_PASSWORD;
const adminType = process.env.ADMIN_TYPE
const adminId = process.env.ADMIN_ID

module.exports = {
    adminLogin: (req, res, next) => {
        try {
            const { email, password } = req.body
            if (email == Adminemail && password == Adminpassword) {
                const adminToken = createToken(adminId, email, adminType)
                console.log(adminToken + 'adminTOKEN')
                res.status(201).json({ type: 'success', adminToken, message: 'Login Success' })
            }
            else {
                res.status(401).json({ type: 'error', message: 'Invalid email or password' });
            }
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },
    users: async (req, res, next) => {
        try {
            const users = await usermodel.find()
            console.log(users)
            res.status(201).json({ type: 'success', users })

        }
        catch (err) {
            console.log(err)
            res.status(500).json({ type: 'error', message: 'An error occurred' });

        }
    },
    editUser: async (req, res, next) => {
        try {
            const userId = req.params.id
            console.log('hi block', userId)
            const user = await usermodel.findById(userId)
            console.log(user)
            user.status = user.status === 'Active' ? 'Inactive' : 'Active';
            await user.save();
            res.status(201).json({ type: 'success', user })


        }
        catch (err) {
            console.log(err)
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },

    addCategory: async (req, res, next) => {
        try {
            console.log('HIII')
            let { category } = req.body;
            console.log(category);
            const image = req.file.filename
            console.log(image)
            category = category.trim().replace(/\s+/g, '-').toLowerCase()
            const isExist = await categorymodel.findOne({ category: category }).exec();
            console.log(isExist);
            if (!isExist) {
                const newCategory = await categorymodel({
                    category,
                    image
                });
                newCategory.save().then(() => {
                    res.status(201).json("success");
                }).catch((err) => {
                    res.status(400).json('Error' + err);
                });
            } else {
                res.status(400).json('Category already exists');
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },

    categories: async (req, res, next) => {
        try {
            const categories = await categorymodel.find()
            console.log(categories)
            res.status(201).json({ type: 'success', categories })

        }
        catch (err) {
            console.log(err)
            res.status(500).json({ type: 'error', message: 'An error occurred' });

        }
    },
    getCategory: async (req, res, next) => {
        try {
            const id = req.params.id
            console.log(id)
            const category = await categorymodel.findById({ _id: id })
            console.log(category)
            res.status(201).json({ type: 'success', category })

        }
        catch (err) {
            console.log(err)
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },

    editCategory: async (req, res, next) => {
        try {
            const id = req.params.id
            console.log(id)
            let { category } = req.body
            const image = req.file.filename
            console.log(image)
            category = category.trim().replace(/\s+/g, '-').toLowerCase()
            console.log(category)
            const isExist = await categorymodel.find({ category: category }).exec();
            console.log(isExist);
            if (isExist.length <= 1) {
                await categorymodel.findOneAndUpdate({ _id: id }, { $set: { category: category, image: image } })
                    .then(() => {
                        res.status(201).json("success");
                    }).catch((err) => {
                        res.status(400).json('Error' + err);
                    });
            }
            else {
                res.status(400).json('Category already exists');
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },
    listCategory: async (req, res, next) => {
        try {
            const categoryId = req.params.id
            console.log('hi block', categoryId)
            const category = await categorymodel.findById(categoryId)
            console.log(category)
            category.status = category.status === 'List' ? 'Unlist' : 'List';
            await category.save();
            res.status(201).json({ type: 'success', category })
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    subCategories: async (req, res, next) => {
        try {

            const subcategories = await categorymodel.aggregate([
                {
                    $unwind: "$subcategories" // Unwind the subcategories array
                },
                {
                    $group: {
                        _id: null,
                        subcategories: {
                            $push: {
                                category: {
                                    id: "$_id", // Include the category's _id field
                                    category: "$category" // Include the category field
                                },
                                subcategory: "$subcategories.subcategory",
                                status: "$subcategories.status",
                                id: "$subcategories._id"
                            }
                        }
                    }
                }
            ]);
            console.log(subcategories)
            res.status(201).json({ type: 'success', subcategories })
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    addSubCategory: async (req, res, next) => {
        try {
            let { category, subcategory } = req.body
            subcategory = subcategory.trim().replace(/\s+/g, '-').toLowerCase()
            const cat = await categorymodel.findOne({ category: category })
            let subcategories = [...cat.subcategories]
            const subcategoryExists = subcategories.some(
                (existingSubcategory) => existingSubcategory.subcategory === subcategory
            );
            if (!subcategoryExists) {
                subcategories.push({ subcategory: subcategory })
                cat.subcategories = subcategories
                await cat.save()
                res.status(201).json({ type: 'success' })
            }
            else {
                res.status(400).json({
                    type: 'subcategory aleady exists '
                })
            }
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }

    },
    getSubcategory: async (req, res, next) => {
        try {
            const id = req.params.id
            console.log(id)
            const subcategories = await categorymodel.aggregate([
                {
                    $unwind: "$subcategories" // Unwind the subcategories array
                },
                {
                    $group: {
                        _id: null,
                        subcategories: {
                            $push: {
                                category: {
                                    id: "$_id", // Include the category's _id field
                                    category: "$category" // Include the category field
                                },
                                subcategory: "$subcategories.subcategory",
                                status: "$subcategories.status",
                                id: "$subcategories._id"
                            }
                        }
                    }
                }
            ]);

            const foundSubcategory = subcategories.flatMap(subcategoryData => {
                console.log("Subcategory Data:", subcategoryData)
                const subcategory = subcategoryData.subcategories.find(subcategory => subcategory.id.toString() === id);
                //console.log("Found Subcategory:", subcategory);
                return subcategory;
            })
            console.log(foundSubcategory)
            res.status(201).json({ type: 'success', foundSubcategory })
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    editSubCategory: async (req, res, next) => {
        try {
            const { category, subcategory } = req.body
            const { selectedSubcategory } = req.params.id
            console.log(req.body)
            console.log(req.params.id)
            console.log(typeof (req.params.id))
            const cat = await categorymodel.findOne({ category: category })
            console.log(cat)
            const result = await categorymodel.updateOne(
                {
                    category: category,
                    'subcategories._id': req.params.id

                },
                {
                    $set: {
                        'subcategories.$.subcategory': subcategory
                    }
                }
            );


            let subcat = cat.subcategories
            console.log('sub', subcat)
            // const check = subcat.find(subcategory => subcategory._id.toString() == req.params.id);
            // console.log('Hi', check)
            res.status(201).json({ type: 'success', })

        }
        catch (err) {

        }
    },
    listSubCategory: async (req, res, next) => {
        try {
            const { subcategory, category } = req.query;
            console.log('Subcategory:', subcategory);
            console.log('Category:', category);
            const result = await categorymodel.find({
                _id: category,
                'subcategories._id': subcategory

            }, { 'subcategories.$': 1 })

            console.log(result[0].subcategories)

            const subcategoryToUpdate = result[0].subcategories[0];
            subcategoryToUpdate.status = subcategoryToUpdate.status === 'List' ? 'Unlist' : 'List';

            result[0].markModified('subcategories[0]'); // Mark the subcategories field as modified
            await result[0].save(); // Save the changes made to the category object
            // console.log('Hi', subcategoryToUpdate.status);

            // if (result.nModified === 0) {
            //     // No matching subcategory found or the status is not 'List' or 'Unlist'
            //     return res.status(404).json({ error: 'Subcategory not found or invalid status' });
            // }

            const updatedCategory = await categorymodel.findById(category);
            console.log('Hi', updatedCategory.subcategories[0].status);

            res.status(201).json({ type: 'success', category })
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    listSubCategory1: async (req, res, next) => {
        try {
            const { subcategory, category } = req.query;
            console.log('Subcategory:', subcategory);
            console.log('Category:', category);
            const result = await categorymodel.find({
                _id: category,
                'subcategories._id': subcategory

            }, { 'subcategories.$': 1 })

            console.log(result[0].subcategories)

            const subcategoryToUpdate = result[0].subcategories[0];
            if (subcategoryToUpdate.status === 'List') {

                const updatesubcat = await categorymodel.updateOne(
                    {
                        _id: category,
                        'subcategories._id': subcategory
                    },
                    { $set: { 'subcategories.$.status': 'Unlist' } } // Update the 'status' field of the matching subcategory
                );
            }
            else {
                const updatesubcat = await categorymodel.updateOne(
                    {
                        _id: category,
                        'subcategories._id': subcategory
                    },
                    { $set: { 'subcategories.$.status': 'List' } } // Update the 'status' field of the matching subcategory
                );
            }
            res.status(201).json({ type: 'success', })

        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    addPackage: async (req, res, next) => {
        try {
            let { package } = req.body
            package = package.trim().replace(/\s+/g, '-').toLowerCase()
            const isExist = await packagemodel.findOne({ package: package }).exec();
            console.log(isExist);
            if (!isExist) {
                const newPackage = await packagemodel({
                    package
                });
                newPackage.save().then(() => {
                    res.status(201).json("success");
                }).catch((err) => {
                    res.status(400).json('Error' + err);
                });
            } else {
                res.status(400).json('Package already exists');
            }

        }
        catch (err) {
            console.log(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },
    packages: async (req, res, next) => {
        try {
            const packages = await packagemodel.find()
            console.log(packages)
            res.status(201).json({ type: 'success', packages })
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },
    listPackage: async (req, res, next) => {
        try {
            const packageId = req.params.id
            console.log('hi block', packageId)
            const package = await packagemodel.findById(packageId)
            console.log(package)
            package.status = package.status === 'List' ? 'Unlist' : 'List';
            await package.save();
            res.status(201).json({ type: 'success', package })
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },
    getPackage: async (req, res, next) => {
        try {
            const id = req.params.id
            console.log(id)
            const package = await packagemodel.findById({ _id: id })
            console.log(package)
            res.status(201).json({ type: 'success', package })
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },
    editPackage: async (req, res, next) => {
        try {
            const id = req.params.id
            console.log('Hi', id)
            let { package } = req.body
            package = package.trim().replace(/\s+/g, '-').toLowerCase()
            console.log(package)
            const isExist = await packagemodel.findOne({ package: package }).exec();
            console.log(isExist);
            if (!isExist) {
                await packagemodel.findOneAndUpdate({ _id: id }, { $set: { package: package } })
                    .then(() => {
                        res.status(201).json("success");
                    }).catch((err) => {
                        res.status(400).json('Error' + err);
                    });
            }
            else {
                res.status(400).json('Category already exists');
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },
    sellers: async (req, res, next) => {
        try {
            const sellers = await usermodel.find({
                isSellerProfile_set: true
            })

            console.log(sellers)
            res.status(201).json({ type: 'success', sellers })
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },
    approveSeller: async (req, res, next) => {
        try {
            const id = req.params.id
            console.log(id)
            const user = await usermodel.findOne({ _id: id })
            console.log('seller', user)
            const seller = await usermodel.updateOne({ _id: id },
                {
                    $push: { userType: 'seller' },
                    $set: {
                        "sellerProfileStatus.approved.state": true,
                        "sellerProfileStatus.approved.date": Date.now()
                    }
                }
            );

            console.log(seller)
            res.status(201).json({ type: 'success' })
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },
    getDashboardData: async (req, res, next) => {
        try {
            const userCount = await usermodel.countDocuments()
            const sellerCount = await usermodel.find({ isSellerProfile_set: true }).countDocuments()
            const orderCount = await ordermodel.find({
                'order_Status.finished.state': true
            }).countDocuments()
            const pendingCount = await ordermodel.find({ $and: [{ sellerPayment_Status: 'pending' }, { 'order_Status.finished.state': true }] }).countDocuments()
            console.log(userCount, sellerCount, orderCount, pendingCount)


            // data for line chart
            let salesChartDt = await ordermodel.aggregate([
                {
                    $match: {
                        'order_Status.finished.state': true
                    }
                },
                {
                    $group: {
                        _id: { day: { $dayOfWeek: "$order_Status.created.date" } },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ]);

            let SalesCount = []
            for (let i = 1; i < 8; i++) {
                let found = false
                for (let j = 0; j < salesChartDt.length; j++) {
                    if (salesChartDt[j]._id.day == i) {
                        SalesCount.push({ _id: { day: i }, count: salesChartDt[j].count })
                        found = true
                        break;
                    }
                }
                if (!found) {
                    SalesCount.push({ _id: { day: i }, count: 0 })
                }
            }
            const salesCounts = SalesCount.map(d => d.count);
            // const salesCountsJson = JSON.stringify(salesCounts);
            // console.log(salesCountsJson)

            res.status(200).json({ type: 'success', userCount, sellerCount, orderCount, pendingCount, salesCounts })
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },
    getSalesReport: async (req, res, next) => {
        try {
            const { from, to } = req.query;

            console.log(req.query)

            const fromDate = new Date(`${from}T00:00:00Z`);
            const toDate = new Date(`${to}T23:59:59Z`);
            console.log(fromDate, toDate)

            let salesData = await ordermodel.aggregate([
                {
                    $match: {
                        'order_Status.finished.state': true,
                        'order_Status.created.date': {
                            $gte: new Date(fromDate.toISOString()),
                            $lte: new Date(toDate.toISOString())
                        }
                    },
                },
                {
                    $project: {
                        'order_Status.created.date': { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$order_Status.created.date" } } },
                        buyer_id: 1, seller_id: 1, selectedListing_title: 1, order_Price: 1
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "buyer_id",
                        foreignField: "_id",
                        as: "buyer",
                    },
                }, {
                    $lookup: {
                        from: "users",
                        localField: "seller_id",
                        foreignField: "_id",
                        as: "seller"
                    }
                },
                { $sort: { 'order_Status.created.date': -1 } },
            ]);
            console.log(salesData)
            res.status(200).json({ type: 'success', salesData })

        }
        catch (err) {
            console.log(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    },
    getOrders: async (req, res, next) => {
        try {
            const orders = await ordermodell.find({
                'order_Status.created.state': true
            })
            res.status(200).json({ type: 'success', orders })

        }
        catch (err) {
            console.log(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    }
}