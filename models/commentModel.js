"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = require("./userModel");
const Discussion = require("./discussionModel");

const votesSchema = new Schema({
    upvotes: {
        type: Array,
        default: []
    },
    downvotes: {
        type: Array,
        default: []
    }
});

const commentSchema = new Schema(
    {
        userId:{type:Schema.Types.ObjectId, ref: 'User', required:true},
        discussionId:{type:Schema.ObjectId,ref:'Discussion', require:true},
        text:{type:String, required:true},
        isDeleted:{type:Boolean,default:false},
        votes:{type:votesSchema,default:{upvotes:[],downvotes:[]}}
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model("Comment",commentSchema)