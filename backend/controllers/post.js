// Get models
const {
    Post,
    Comment,
    User
} = require("../models")

// Get jsonwebtoken
const jwt = require('jsonwebtoken');

// Get file system for image downloads and modifications
const fs = require('fs');

// POST
// Get all Posts
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
                        attributes: ["message", "UserId", "PostId", "id"],
                        order: [
                            ["createdAt", "DESC"]
                        ],
                        include: [{
                            model: User,
                            attributes: ["name", "id", "image"],
                        }, ],
                    },
                ],
            })
            .then(posts => {
                res.status(200).send(posts);
            })

    } catch (error) {
        res.status(400).json({
            error
        });
    };
}
//Get one Post
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
                        attributes: ["message", "UserId", "PostId", "id"],
                        include: [{
                            model: User,
                            attributes: ["name", "id", "image"],
                        }, ],
                    },
                ],
            })
            .then(post => {
                res.status(200).send(post);
            })
    } catch (error) {
        res.status(400).json({
            error
        });
    };
};
//Create one Post
exports.createOnePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    try {
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

            .then(() => res.status(201).json({
                message: "Message créé !"
            }))
            .catch(() => res.status(400).send({
                error: "Erreur "
            }))
    } catch (error) {
        return res.status(500).send({
            error: "Erreur serveur"
        })
    }
};
//Modify one Post
exports.modifyOnePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    Post.findOne({
            where: {
                id: req.params.id,
            }
        })
        .then((Post) => {
            if (userId == Post.UserId) {
                if (req.file && Post.image) {
                    const filename = Post.image.split("/images")[1];
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) {
                            console.log("failed to delete local image:" + err);
                        } else {
                            console.log('successfully deleted local image');
                        }
                    });
                    const postObject = req.file ? {
                        ...req.body,
                        image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
                    } : {
                        ...req.body,
                        image: Post.image
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
                } else {
                    const postObject = req.file ? {
                        ...req.body,
                        image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
                    } : {
                        ...req.body,
                        image: Post.image
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
                }
            }
        })
        .catch(error => res.status(400).json({
            error
        }))
};

//Delete one Post
exports.deleteOnePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    Post.findOne({
            where: {
                id: req.params.id,
            }
        })
        .then((Post) => {
            if (userId == Post.UserId || userId == 1) {
                if (Post.image) {
                    const filename = Post.image.split("/images")[1];
                    fs.unlink(`images/${filename}`, () => {
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
                    });
                } else {
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
                }
            }
        })
        .catch(error => res.status(400).json({
            error
        }))
};

// COMMENT
//Create one Comment
exports.createOneComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    const message = req.body.message;

    console.log(req.body)

    // checking fields
    if (message === null || message === '') {
        return res.status(400).json({
            'error': "Les champs 'nom' et 'biographie' doivent être remplis"
        });
    }

    const comment = new Comment({
        message: req.body.message,
        UserId: userId,
        PostId: req.params.id,
    });
    comment.save()
        .then((res) => res.status(201).json({
            message: "Commentaire publié !"
        }))
        .catch(error => res.status(400).json({
            error
        }))
};
//Delete one Comment
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