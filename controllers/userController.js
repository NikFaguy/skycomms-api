"use strict";

const User = require("../models/userModel");
const webToken = require("jsonwebtoken");
const mongoose = require("mongoose");

const createToken = (_id) => {
    return webToken.sign({ _id }, process.env.WEB_TOKEN_KEY, {
        expiresIn: "2d",
    });
};

//GET all users
const getUsers = async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json(users);
};

//POST login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            username: username,
            password: password,
        });

        if (!user) {
            return res.status(400).json({ error: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        const token = createToken(user.id);

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//POST create a new user
const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const usernameAlreadyExists = await User.findOne({
            username: username,
        });
        const emailAlreadyExists = await User.findOne({ email: email });

        if (usernameAlreadyExists) {
            return res
                .status(400)
                .json({ error: "Ce username est déjà pris." });
        }
        if (emailAlreadyExists) {
            return res
                .status(400)
                .json({ error: "Ce email est déjà pris." });
        }

        const user = await User.create({ username, email, password });
        const token = createToken(user.id);
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//GET profil: username and email
const getProfile = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Profile non trouvé." });
        }

        // Retourne le profil de l'utilisateur (username et email)
        const user = await User.findById(id).select("username email");

        if (!user) {
            return res.status(404).json({ error: "Profile non trouvé." });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//UPDATE Username
const updateUsername = async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    try {
        //Si pas d'id
        if (!id) {
            return res.status(400).json({ error: "Id non trouvé." });
        }

        //Si pas de username
        if (!username) {
            return res
                .status(400)
                .json({ error: "Veuillez entrer un nom d'utilisateur." });
        }

        const usernameAlreadyExists = await User.findOne({ username: username })
            .where("_id")
            .ne(id);

        if (usernameAlreadyExists) {
            return res.status(400).json({ error: "Ce username est déjà pris." });
        }

        const user = await User.findByIdAndUpdate(id, { username });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// UPDATE Email
const updateEmail = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    try {
        //Si pas d'id
        if (!id) {
            return res.status(400).json({ error: "Id non trouvé." });
        }

        //Si pas de email
        if (!email) {
            return res
                .status(400)
                .json({ error: "Veuillez entrer un Email." });
        }

        const emailAlreadyExists = await User.findOne({ email: email })
            .where("_id")
            .ne(id);

        if (emailAlreadyExists) {
            return res.status(400).json({ error: "Ce email est déjà pris." });
        }

        const user = await User.findByIdAndUpdate(id, { email });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//DELETE user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ error: "Id non trouvé." });
        }

        const user = await User.findByIdAndUpdate(id,{isDeleted:true});
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//Export the controllers to user.js
module.exports = { getUsers, loginUser, createUser, getProfile, updateUsername, updateEmail, deleteUser };