// Get models
const {Post} = require("../models")

// Get comment model
const Comment = require('../models/comment');

// Get file system for image downloads and modifications
const fs = require('fs');

// Post
exports.getAllPosts = (req, res, next) => {
    try {
        Post.findAll({
            attributes: ["id", "message", "image"],
            order: [
                ["createdAt", "DESC"]
            ],
            include: [{
                    model: User,
                    attributes: ["name", "id", "image"],
                },
                {
                    model: Comment,
                    attributes: ["message", "UserId", "PostId"],
                    order: [
                        ["createdAt", "DESC"]
                    ],
                },
            ],
        })
        if (!posts) {
            throw new Error('Erreur');
        }
        res.status(200).send(posts);
    } catch (error) {
        res.status(400).json({
            error
        });
    };
}

exports.getOnePost = (req, res, next) => {
    try {
        Post.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                    model: User,
                    attributes: ["name", "image", "id"],
                },
                {
                    model: Like,
                    attributes: ["PostId", "UserId"],
                },
                {
                    model: Comment,
                    order: [
                        ["createdAt", "DESC"]
                    ],
                    attributes: ["message", "pseudo", "UserId"],
                    include: [{
                        model: db.User,
                        attributes: ["photo", "pseudo"],
                    }, ],
                },
            ],
        });
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({
            error
        });
    };
};

exports.createOnePost = (req, res, next) => {
    let image = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    if (!image) {
        throw new Erreur('Erreur')
    }
    User.findOne({
        attributes: ["name", "image", "id"],
        where: { id: req.user.id },
      });

      const post = new Post(
        {
            UserId: req.body.UserId,
            message: req.body.message,
            image: image
        }
    )
    post.save()
        .then((retour) => res.status(201).json({ message: "Message créé !" }))
        .catch(error => res.status(400).json({ error }))
};

exports.modifyOnePost = (req, res, next) => {  try {
    let newimage;
    let post = Post.findOne({ where: { id: req.params.id } });
    if (userId === post.id) {
      if (req.file) {
        newimage = `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`;
        if (post.image) {
          const filename = post.image.split("/images")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) console.log(err);
            else {
              console.log(`Deleted file: images/${filename}`);
            }
          });
        }
      }
      if (req.body.message) {
        post.message = req.body.message;
      }
      post.image = newimage;
      const newPost = post.save({
        fields: ["message", "image"],
      });
      res.status(200).json({ newPost: newPost, messageRetour: "Post modifié" });
    } else {
      res.status(400).json({ message: "Vous n'avez pas les droits requis" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

exports.deleteOnePost = (req, res, next) => {
    Post.destroy({
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
};

exports.getUserPosts = (req, res, next) => {
    try {
        Post.findAll({
            where: {
                UserId: req.params.id
            },
            include: {
                model: User,
                required: true,
                attributes: ["name", "image", "id"]
            },
            order: [
                ["createdAt", "DESC"]
            ]
        })
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({
            error
        });
    };
};

// Comment

exports.createOneComment = (req, res, next) => {
    const comment = new Comment({
        message: req.body.message,
        UserId: req.body.UserId,
        PostId: req.params.PostId,
    });
    comment.save()
        .then((retour) => res.status(201).json({
            message: "Commentaire publié !"
        }))
        .catch(error => res.status(400).json({
            error
        }))
};

exports.modifyOneComment = (req, res, next) => {
    const commentObject = req.file ? {
        ...req.body.comment,
        image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {
        ...req.body
    }
    Comment.update({
            ...commentObject,
            id: req.params.id
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(() => res.status(200).json({
            message: "Commentaire modifié !"
        }))
        .catch(error => res.status(400).json({
            error
        }))
};

exports.deleteOneComment = (req, res, next) => {
    Comment.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(() => res.status(200).json({
            message: "Commentaire supprimé !"
        }))
        .catch(error => res.status(400).json({
            error
        }))
}