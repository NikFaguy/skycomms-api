"use strict"

//trucs nécessaires pour les routers
const express = require("express");
const {getDiscussions, getDiscussionsById, deleteDiscussion, getDiscussionsByUserId, getDiscussionsRecentesCategory, getDiscussionsByTitle, getDiscussionsByTitleAndCategory} = require('../controllers/discussionController');
const router = express.Router();
const Discussion = require('../models/discussionModel')


//middleware pour user
const requireUser = require('../middleware/requireUser')



//gestion d'image
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../frontend/images")); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage })

//routes

//GET all discussions

router.get('/discussions', getDiscussions);
router.get('/:id', getDiscussionsById);

//GET 3 dernières discussions
router.get('/discussions-supplementaires/:category/:discussionId', getDiscussionsRecentesCategory);

//Routes disponnibles en étant connecté

//Rechercher une discussion par titre
router.get('/search/:title', getDiscussionsByTitle)
router.get('/search/:title/:category', getDiscussionsByTitleAndCategory)

router.use(requireUser)
//POST create a discussion
router.post('/create', upload.single('imageUploaded'), (req, res) => {
    const { title, text, category } = req.body;
    const userAuthor = req.user._id;
    const image = req.file;

    try {
        const newDiscussion = new Discussion({
            title,
            text,
            image: image ? image.filename : null,
            userAuthor: userAuthor._id,
            category: category
        });

        const saveDiscussion = newDiscussion.save();
        res.status(201).json(saveDiscussion);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

//GET 3 dernières discussions d'un utilisateur en particulier
router.get('/discussions-recentes/:userId', getDiscussionsByUserId);

//DELETE suppression d'une disscussion
router.delete('/delete/:id', deleteDiscussion)


module.exports = router;