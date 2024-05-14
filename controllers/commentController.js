"use strict";

const Comment = require("../models/commentModel");
const Discussion = require("../models/discussionModel");

//trouve les commentaire qui appartiennent à une discussion
const getCommentsForDiscussion = async (req, res) => {
    const discussionId = req.params.id
    try {
        const comments = await Comment.find({ discussionId: discussionId })

        res.status(200).json(comments)

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        res.status(error.statusCode).json(error.message);

    }

}

const createComment = async (req, res) => {
    const { text } = req.body;
    const userId = req.user.id;
    const discussionId = req.params.id;

    try {
        const discussion = await Discussion.findById(discussionId);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion introuvable' });
        }

        const newComment = new Comment({
            text: text,
            userId: userId,
            discussionId: discussionId,
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du commentaire' });
    }
};

const updateComment = async (req, res) => {
    const { text } = req.body;
    const userId = req.user.id;
    const commentId = req.params.id;

    try {
        const comment = await Comment.findByIdAndUpdate(commentId, {
            text: text
        });

        if (!comment) {
            return res.status(404).json({ error: 'Commentaire introuvable' });
        }

        res.status(201).json(comment);

    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'édition du commentaire" });
    }

}

const deleteComment = async (req, res) => {
    const commentId = req.params.id;

    try {
        const comment = await Comment.findByIdAndUpdate(commentId, {
            isDeleted: true
        });

        if (!comment) {
            return res.status(404).json({ error: 'Commentaire introuvable' });
        }

        res.status(201).json(comment);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        res.status(error.statusCode).json(error.message);
    }
}

const upvoteComment = async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;

    try {
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { $addToSet: { "votes.upvotes": userId }, $pull: { "votes.downvotes": userId } },
            { new: true }
        );

        if (!comment) {
            return res.status(404).json({ error: 'Commentaire introuvable' });
        }

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'upvote du commentaire' });
    }
}

const downvoteComment = async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;

    try {
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { $addToSet: { "votes.downvotes": userId }, $pull: { "votes.upvotes": userId } },
            { new: true }
        );

        if (!comment) {
            return res.status(404).json({ error: 'Commentaire introuvable' });
        }

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'downvote du commentaire' });
    }
}

module.exports = { getCommentsForDiscussion, createComment, updateComment, deleteComment, upvoteComment, downvoteComment };