"use strict";

const Discussion = require("../models/discussionModel");

const getDiscussions = async (req, res) => {
    try {
        const discussion = await Discussion.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(10);

        return res.status(200).json(discussion);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        res.status(error.statusCode).json(error.message);

    }

}

const getDiscussionsById = async (req, res) => {
    const discussionId = req.params.id.trim();
    try {
        const discussion = await Discussion.findById(discussionId);

        if (!discussion || discussion.isDeleted) {
            const error = new Error("Discussion introuvable");
            error.statusCode = 404
            throw error;
        }
        return res.status(200).json(discussion);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        res.status(error.statusCode).json(error.message);

    }

}

const getDiscussionsByTitle = async (req, res) => {
    const title = req.params.title.trim();

    try {
        const discussions = await Discussion.find({
            $or: [
                { title: { $regex: new RegExp(title, 'i') } },
                { category: { $regex: new RegExp(title, 'i') } }
            ],
            isDeleted: false
        }).sort({ createdAt: -1 }).limit(10);

        if (!discussions || discussions.isDeleted) {
            const error = new Error("Aucune discussion trouvée");
            error.statusCode = 404
            throw error;
        }
        return res.status(200).json(discussions);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        res.status(error.statusCode).json(error.message);

    }
}

const getDiscussionsByTitleAndCategory = async (req, res) => {
    const title = req.params.title.trim();
    const category = req.params.category.trim();

    try {
        const discussions = await Discussion.find({
            $and: [
                { title: { $regex: new RegExp(title, 'i') } },
                { category: { $regex: new RegExp(category, 'i') } }
            ],
            isDeleted: false
        }).sort({ createdAt: -1 }).limit(10);

        if (!discussions || discussions.isDeleted) {
            const error = new Error("Aucune discussion trouvée");
            error.statusCode = 404
            throw error;
        }
        return res.status(200).json(discussions);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        res.status(error.statusCode).json(error.message);

    }
}

const createDiscussion = async (req, res) => {


    const { title, text, category } = req.body;
    const userAuthor = req.user._id;
    const image = req.file;

    try {
        const newDiscussion = await new Discussion({
            title,
            text,
            image: image ? image.filename : null,
            userAuthor: userAuthor._id,
            category: category
        });

        const saveDiscussion = await newDiscussion.save();
        res.status(201).json(saveDiscussion)

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        res.status(error.statusCode).json(error.message);
    }

}

const getDiscussionsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const discussion = await Discussion.find({ userAuthor: userId, isDeleted: false }).sort({ createdAt: -1 }).limit(3);

        if (!discussion || discussion.isDeleted) {
            const error = new Error("Discussion de l'utilisateur introuvable");
            error.statusCode = 404
            throw error;
        }
        return res.status(200).json(discussion);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        res.status(error.statusCode).json(error.message);

    }
}

const getDiscussionsRecentesCategory = async (req, res) => {
    const { category, discussionId } = req.params;

    try {
        const discussion = await Discussion.find({ category: category, isDeleted: false, _id: { $ne: discussionId } }).sort({ createdAt: -1 }).limit(3);
        if (!discussion || discussion.isDeleted) {
            const error = new Error("Discussion de l'utilisateur introuvable");
            error.statusCode = 404
            throw error;
        }
        return res.status(200).json(discussion);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        res.status(error.statusCode).json(error.message);
    }
}

const deleteDiscussion = async (req, res) => {
    const discussionId = req.params.id;

    try {
        const discussion = await Discussion.findByIdAndUpdate(discussionId, {
            isDeleted: true
        })
        if (!discussion) {
            return res.status(404).json({ error: 'discussion introuvable' });
        }
        res.status(201).json(discussion);


    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        res.status(error.statusCode).json(error.message);
    }

}

module.exports = { getDiscussions, createDiscussion, getDiscussionsById, deleteDiscussion, getDiscussionsByUserId, getDiscussionsRecentesCategory, getDiscussionsByTitle, getDiscussionsByTitleAndCategory };