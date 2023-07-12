
const usermodel = require('../models/userModel')
const categorymodel = require('../models/categoryModel')
const packagemodel = require('../models/packagesModel')
const listingmodel = require('../models/listingModel')
// const jwt = require('jsonwebtoken')
require('dotenv').config(); // Load environment variables from .env file
const jwtSecret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const { sendOtp, verifyOtp } = require("../middleWares/Twilio");
const { createToken } = require("../middleWares/JWTtoken");
const { UserDefinedMessageInstance } = require('twilio/lib/rest/api/v2010/account/call/userDefinedMessage');

// const maxAge = 3 * 24 * 60 * 60
// const createToken = (id, email, type) => {
//     return jwt.sign({ id, email, type }, jwtSecret, {
//         expiresIn: maxAge
//     })
// }

const userType = process.env.USER_TYPE
let signupData

module.exports = {

    signup: async (req, res, next) => {
        try {
            const { firstName, lastName, email, password, mobile } = req.body
            const isUserExist = await usermodel.findOne({ $or: [{ email: req.body.email }, { mobile: req.body.mobile }] })
            if (isUserExist) {
                return res.status(200).json({ message: "user already exists", success: false });
            }
            else {
                signupData = {
                    firstName,
                    lastName,
                    email,
                    mobile,
                    password
                }
                sendOtp(mobile)
                return res.status(200).json({ message: "OTP has been sent", success: true });

            }
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Error while creating user", success: false, err });
        }
    },
    verifyOtp: async (req, res, next) => {
        try {
            const { otp } = req.body
            console.log(otp)
            if (signupData.mobile) {
                console.log('HI OTP', signupData.mobile)

                await verifyOtp(signupData.mobile, otp).then(async (verification_check) => {
                    if (verification_check.status === 'approved') {
                        console.log('TESTOTP', verification_check)
                        const newPassword = await bcrypt.hash(signupData.password, 10)
                        const newUser = {
                            firstName: signupData.firstName,
                            lastName: signupData.lastName,
                            email: signupData.email,
                            mobile: signupData.mobile,
                            password: newPassword
                        }
                        console.log('NewUser', newUser)
                        await usermodel.create(newUser)
                        res.status(200).json({ message: "User has been created", success: true });
                    }
                })
            }
            else {
                res.status(200).json({ message: "Registration failed,try again", success: false });

            }
        }


        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Error while creating user", success: false, err });

        }
    },

    login: async (req, res, next) => {
        try {
            console.log("hiLogin")
            const { email, password } = req.body;
            const user = await usermodel.findOne({ email: email });
            if (!user) {
                console.log("Invalid user")
                res.status(400).json({ message: "Invalid email id", success: false });
            }
            if (user && user.status === 'Inactive') {
                console.log('User blocked')
                res.status(400).json({ mesage: "User has been blocked.", success: false });
            }
            else {
                const isUser = await bcrypt.compare(password, user.password);
                if (!isUser) {
                    console.log("Invalid password")
                    res.status(400).json({ mesage: "Incorrect password", success: false });

                }

                else {
                    const profileStat = user.isProfile_set
                    const userToken = createToken(user._id, user.email, userType)
                    console.log(userToken + 'TOKEN')
                    res.status(201).json({ message: 'Login success', success: true, userToken, profileStat })
                }
            }
        }
        catch (err) {
            console.log(err)
            res
                .status(500)
                .json({ message: "something went wrong ", success: false });
        }
    },
    resendOtp: async (req, res, next) => {
        try {
            //let mobile = signupData.mobile
            console.log(signupData.mobile)
            if (signupData.mobile) {
                await sendOtp(signupData.mobile)
                console.log("hi")
                return res.status(200).json({ message: "OTP has been sent", success: true });
            }
            else {
                res.status(200).json({ message: 'something went wrong', success: false })
            }
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "something went wrong ", success: false });
        }


    },
    profile: async (req, res, next) => {
        try {
            console.log(req.user.id)
            const user = await usermodel.findOne({ _id: req.user.id })
            console.log(user)
            res.status(200).json({ success: true, user })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "something went wrong ", success: false });
        }
    },
    AddProfileImage: async (req, res, next) => {
        try {
            console.log("editImage")
            const image = req.file.filename
            const user = await usermodel.updateOne({ _id: req.user.id }, { $set: { profile_pic: image } }, { upsert: true })
            res.status(201).json({ type: 'Success' })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "something went wrong ", success: false });
        }
    },
    updateProfile: async (req, res, next) => {
        try {
            console.log("KOKOKO")
            console.log('ProfileData', req.body)
            const { firstName, lastName, userName, place, about } = req.body
            await usermodel.updateOne({ _id: req.user.id }, { $set: { firstName, lastName, userName, place, about, isProfile_set: true } })
            res.status(201).json({ type: 'Success' })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "something went wrong ", success: false });
        }
    },
    createSeller: async (req, res, next) => {
        try {
            const { occupation,
                experience,
                skills,
                education,
                personal_Website,
                social_media_platform,
                social_media_links,
            } = req.query
            const idProof = req.file.filename
            console.log(idProof)
            console.log('REqPARAMS', req.query)
            await usermodel.updateOne({ _id: req.user.id }, {
                occupation,
                experience,
                skills,
                education,
                personal_Website,
                "social_media": [{
                    social_media_platform,
                    social_media_links
                }],
                idProof,
                "sellerProfileStatus.created.state": true,
                "sellerProfileStatus.created.date": Date.now(),
                "sellerProfileStatus.pending_Approval.state": true,
                "sellerProfileStatus.pending_Approval.date": Date.now(),
                isSellerProfile_set: true,
            })


            res.status(201).json({ message: "Created seller profile", success: true })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "something went wrong ", success: false });
        }
    },
    categories: async (req, res, next) => {
        try {
            const categories = await categorymodel.find({ status: 'List' })
            console.log('subcat', categories)
            res.status(200).json({ success: true, categories })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "something went wrong ", success: false });
        }
    },
    selectcategory: async (req, res, next) => {
        try {
            const id = req.params.id
            console.log('hiid', req.params.id)
            const selectcategory = await categorymodel.find({ _id: id })
            res.status(200).json({ success: true, selectcategory })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "something went wrong ", success: false });
        }
    },
    packages: async (req, res, next) => {
        try {
            const packages = await packagemodel.find({})
            console.log(packages)
            res.status(200).json({ success: true, packages })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "something went wrong ", success: false });
        }
    },
    createList: async (req, res, next) => {
        try {

            const { listingTitle,
                description,
                category,
                subcategory,
                features, packages, requirements } = req.body
            console.log(req.body)

            // Convert the input data to match the schema structure
            const packagesData = Array.isArray(packages) ? packages.map(packageData => ({
                packageId: packageData.package,
                shortDescription: packageData.shortDescription,
                deliverables: packageData.deliverables,
                delivery_Time: packageData.delivery_Time,
                revisions: packageData.revisions,
                price: packageData.price
            })) : []

            console.log(req.body.packages)
            console.log(Array.isArray(packages))
            const coverImage = req.files['coverImage'][0].filename; // Assuming only one file is uploaded
            const images = req.files['images[]'].map(file => file.filename); // Assuming multiple files are uploaded
            const videos = req.files['videos[]'] ? req.files['videos[]'][0].filename : ''; // Assuming only one file is uploaded
            console.log('CI', coverImage)
            console.log('I', images)
            console.log('V', videos)

            //console.log(packagesData.length())
            //console.log('hijhjh', req.file.filename)


            const newListing = listingmodel({
                listingTitle,
                description,
                'category.categoryId': category,
                'category.subcategory': subcategory,
                features,
                requirements,
                coverImage,
                images,
                videos,
                packages: packagesData,
                seller_id: req.user.id

            })
            console.log(newListing)
            await listingmodel.create(newListing)
            res.status(201).json({ success: true })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "something went wrong ", success: false });
        }
    },
    getSellerListings: async (req, res, next) => {
        try {
            console.log(req.user.id)
            const listings = await listingmodel.find({ seller_id: req.user.id }).populate('category.categoryId')
            console.log(listings)
            res.status(200).json({ success: true, listings })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "something went wrong ", success: false });
        }
    },
    changeStatus: async (req, res, next) => {
        try {
            const listingId = req.params.id
            console.log('hi block', listingId)
            const listing = await listingmodel.findById(listingId)
            console.log(listing)
            listing.listing_status = listing.listing_status === 'Available' ? 'Unavailable' : 'Available';
            await listing.save();
            res.status(201).json({ type: 'success', listing })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "something went wrong ", success: false });
        }
    },
    getListing: async (req, res, next) => {
        try {
            console.log(req.params.id)
            const id = req.params.id
            const listing = await listingmodel.findOne({ _id: id }).populate('category.categoryId')
                .populate('seller_id').populate('packages.packageId')
            res.status(200).json({ success: true, listing })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "something went wrong ", success: false });
        }
    },
    getUser: async (req, res, next) => {
        try {
            console.log('ji');
            const receivers = req.query.receivers;
            console.log(receivers);
            const membersData = await Promise.all(receivers.map(async (receiver) => {
                return await usermodel.find({ _id: receiver });
            }));
            console.log(membersData);
            res.status(200).json({ success: true, membersData });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Something went wrong", success: false });
        }
    },
    allListings: async (req, res, next) => {
        try {
            const { category, search, sort, page } = req.query;
            console.log(req.query)
            const filters = {};

            if (category && category !== 'All') {
                filters['category.categoryId'] = category;
            }

            if (search && search !== 'null') {
                filters.listingTitle = { $regex: search, $options: 'i' };
            }

            const pageSize = 4; // Number of listings per page
            const pageNumber = parseInt(page) || 1; // Current page number

            const countQuery = listingmodel.countDocuments(filters);
            const totalListings = await countQuery.exec();

            const listingsQuery = listingmodel.find(filters)
                .populate('seller_id')
                .sort({
                    'packages.0.price': sort === 'desc' ? -1 : 1
                })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);

            const listings = await listingsQuery.exec();

            res.status(200).json({
                success: true,
                listings,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalListings / pageSize),
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong', success: false });
        }
    }



}