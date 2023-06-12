const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    mobile: {
        type: Number,
        required: [true, "Mobile Number is required"],
        unique: true
    },
    status: {
        type: String,
        default: 'Active'
    },
    profile_pic: {
        type: String,

    },
    wallet: {
        type: Number,
        default: 0
    },
    wishlist: [{
        listingId: {
            type: mongoose.Schema.Types.ObjectId,
            //required: true,
            ref: "listingsData"
        },
    }],
    rating: {
        type: Number,
        max: 5,// Maximum value constraint
    },

    place: {
        type: String,
        // requires: true
    },
    about: {
        type: String,
        //required: true
    },
    isProfile_set: {
        type: Boolean,
        default: 'false'
    },
    isSellerProfile_set: {
        type: Boolean,
        default: 'false'
    },
    sellerProfileStatus: {
        created: {
            state: { type: Boolean, default: false },
            date: { type: Date, default: Date.now() },
        },
        pending_Approval: {
            state: { type: Boolean, default: false },
            date: { type: Date, default: Date.now() }
        },
        approved: {
            state: { type: Boolean, default: false },
            date: { type: Date, default: Date.now() },
        },
        rejected: {
            state: { type: Boolean, default: false },
            reason: { type: String },
            date: { type: Date, default: Date.now() },
        },

    },
    userName: {
        type: String,
        //required: true
    },
    buy_Orders: [{
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orderData",
            //required: true
        },
    }],
    sell_Orders: [{
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orderData",
            //required: true
        },

    }],
    userType: {
        type: [String],
        enum: ['buyer', 'seller'],
        default: ['buyer']
    },
    occupation: {
        type: String,
    },
    experience: {
        type: Number,
    },
    skills: [{
        type: String,
    }],
    education: {
        type: String,

    },
    personal_Website: {
        type: String
    },

    projects: [{
        project: {
            type: String
        },
        project_link: {
            type: String
        }
    }],
    social_media: [{
        social_media_platform: {
            type: String
        },
        social_media_links: {
            type: String
        }
    }],
    idProof: {
        type: String
    },
    created_date: {
        type: Date, default: Date.now()
    },
    // listings: [{

    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "listingsData",
    //     //required: true
    // }],
}

);

module.exports = UserModel = mongoose.model('Users', userSchema);