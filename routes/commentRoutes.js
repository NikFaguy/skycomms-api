"use strict"
const express = require("express");
const {createComment,getCommentsForDiscussion,updateComment,deleteComment,upvoteComment,downvoteComment} = require('../controllers/commentController');
const router = express.Router();


//middleware pour user
const requireUser = require('../middleware/requireUser')

router.get('/comments/:id',getCommentsForDiscussion)

//routes disponnibles ent étant connecté 

router.post('/create/:id', requireUser, createComment);

router.patch('/update/:id', requireUser, updateComment);

router.delete('/delete/:id', requireUser, deleteComment);

router.patch('/upvote/:id', requireUser, upvoteComment);

router.patch('/downvote/:id', requireUser, downvoteComment);

module.exports = router;