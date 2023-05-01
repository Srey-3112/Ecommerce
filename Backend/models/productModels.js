const mongoose = require('mongoose');

const productSchema=new mongoose.Schema({

    name: {
        type: String,
        required:[true,"Please Enter Product Name"],
        trim: true
    },
    description:{
        type: String,
        required: [true,"Please Enter Product Description"]
    },
    price:{
        type: Number,
        required: [true,"Please Enter Product Price"],
        maxLength:[6,"Price cannot exceed 6 characters"]
    },
    ratings:{
        type: Number,
        default:0
    },
    images:[
            {
                public_id:{
                    type: String,
                    required: [true,"public_id is required"]
                },
                url:{
                    type: String,
                    required: [true,"url is required"]
                }

            }
    ],
    category:{
        type: String,
        required: [true,"category is required"]
    },
    stock:{
        type: Number,
        required: [true,"stock is required"],
        maxLength: [4,"stock max_length cannot exceed 4 characters"],
        default: 1
    },
    numOfReviews:{
        type: Number,
        default: 0,
    },
    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"user",
            required: true
        },
        name:{
            type: String,
            required:true
        },
        rating:{
            type: Number,
            required: true
        },
        comment:{
            type: String,
            required: true    
        }
    }],
    
    createdAt:{
        type: Date,
        default:Date.now()
    }

})

module.exports = mongoose.model("Product",productSchema);