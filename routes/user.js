"use strict"

const express = require('express');

//Import the userController methods
const { getUsers, loginUser, createUser, getProfile, updateUsername, updateEmail, deleteUser } = require('../controllers/userController');

//Create express router
const router = express.Router();

//GET all users
router.get('/users', getUsers);

//POST login
router.post('/login', loginUser);

//POST create user
router.post('/signup', createUser);

//GET profile
router.get('/profile/:id', getProfile);

//UPDATE username
router.put('/profile/username/:id', updateUsername);

//UPDATE email
router.put('/profile/email/:id', updateEmail);

//DELETE profile
router.delete('/profile/:id', deleteUser);

//Export the router to server.js
module.exports = router;