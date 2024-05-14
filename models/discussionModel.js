"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = require("./userModel");
const Comment = require("./commentModel");

const categoriesEnum = ['Autre', 'Science', 'Art', 'Sports', 'Politique', 'Technologie', 'Gaming'];


const discussionSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        text: { type: String, required: true, unique: false },
        image: { type: String, required: false },
        userAuthor:{type:Schema.Types.ObjectId, ref: 'User', required:true},
        isDeleted: { type: Boolean, default: false },
        comments: [Comment.schema],
        category: { type: String, enum: categoriesEnum, required: true }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Discussion", discussionSchema);
