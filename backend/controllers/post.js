// Get models
const db = require("../models")

// Get post model
const Post = require('../models/post');

// Get comment model
const Comment = require('../models/comment');

// Get file system for image downloads and modifications
const fs = require('fs');

// Post
exports.getAllPosts = (req, res, next) => {};

exports.getOnePost = (req, res, next) => {};

exports.createOnePost = (req, res, next) => {};

exports.modifyOnePost = (req, res, next) => {};

exports.deleteOnePost = (req, res, next) => {};

exports.getUserPosts = (req, res, next) => {};

// Comment

exports.createOneComment = (req, res, next) => {
    const comment =  new Comment({
        message: req.body.message,
        UserId: req.body.UserId,
        PostId: req.params.id,
      });
    comment.save()
        .then((retour) => res.status(201).json({ message: "Commentaire publié !" }))
        .catch(error => res.status(400).json({ error }))
};

exports.modifyOneComment = (req, res, next) => {
    const commentObject = req.file ?
    {
      ...req.body.comment,
      image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ... req.body}
    Comment.update({ ...commentObject, id:  req.params.id}, { where: { id: req.params.id }})
    .then(() => res.status(200).json({ message: "Commentaire modifié !" }))
    .catch(error => res.status(400).json({ error }))
};

exports.deleteOneComment = (req, res, next) => {
    Comment.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(() => res.status(200).json({
            message: "Post supprimé !"
        }))
        .catch(error => res.status(400).json({
            error
        }))
}