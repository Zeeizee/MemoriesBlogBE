import express from "express";
import mongoose from 'mongoose';
const postSchema=mongoose.Schema({
    title:String,
    message:String,
    creator:String,
    category:String,
    tags:[String],
    selectedFile:String,
    likeCount:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },

})
const postModel=mongoose.model('postModel',postSchema)
export default postModel;