// Get models
const {Post , Comment , User } = require("../models")

const jwt = require('jsonwebtoken');
// Get file system for image downloads and modifications
const fs = require('fs');

// Post
exports.getAllPosts = (req, res, next) => {
    try {
        Post.findAll({
            attributes: ["id", "message", "image", "createdAt"],
            order: [
                ["createdAt", "DESC"]
            ],
            include: [{
                    model: User,
                    attributes: ["name", "id", "image"],
                },
                {
                    model: Comment,
                    attributes: ["message", "image","UserId", "PostId"],
                    order: [
                        ["createdAt", "DESC"]
                    ],
                },
            ],
        })
        .then( posts =>{
            res.status(200).send(posts);
        })
        
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
                    model: Comment,
                    order: [
                        ["createdAt", "DESC"]
                    ],
                    attributes: ["message", "image", "UserId","PostId"],
                    include: [{
                        model: User,
                        attributes: ["image", "name"],
                    }, ],
                },
            ],
        })
        .then( post =>{
            res.status(200).send(post);
        })
    } catch (error) {
        res.status(400).json({
            error
        });
    };
};

exports.createOnePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    try {
        // if (userId !== null) {
            if (req.file) {
              image = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
            } else {
              image = null;
            }
            Post.create({
                message: req.body.message,
                UserId: userId,
                image: image,
              })

            .then(()=>res.status(201).json({ message: "Message créé !" }))
            .catch(()=> res.status(400).send({ error: "Erreur " }))
            // }
        } catch (error) { return res.status(500).send({ error: "Erreur serveur" })}
};

exports.modifyOnePost = (req, res, next) => {  
    const postObject = req.file ? {
        ...req.body.post,
        image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {
        ...req.body
    }
    Post.update({
            ...postObject,
            id: req.params.id
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(() => res.status(200).json({
            message: "Post modifié !"
        }))
        .catch(error => res.status(400).json({
            error
        }))
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

// Comment

exports.createOneComment = (req, res, next) => {
    const comment = new Comment({
        message: req.body.message,
        image: req.body.image,
        UserId: req.body.UserId,
        PostId: req.params.id,
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
};