"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        verified: { type: Boolean, default: false },
        isAdmin:{ type: Boolean, default: false },
        isDeleted:{ type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
