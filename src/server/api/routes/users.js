const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err  });
    });
});

router.post('/', (req, res, next) => {
    if (!req.body.userId) {
        throw new Error(`Must supply user ID to create new user`);
    }

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId || '',
        userId: req.body.email || '',
        name: req.body.name,
        description: req.body.description,
        picture: req.body.picture
    });

    User.find({ userId: req.body.userId })
    .exec()
    .then(docs => {
        if (docs.length === 0) {
            return user.save();
        } else {
            throw new Error(`User with ID ${req.body.userId} already exists`);
        }
    })
    .catch(err => {
        console.log(err);
        if (err.message) {
            err = err.message;
        }
        res.status(500).json({
            error: err
        });
    });
});

router.post('/:userId', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        userId: req.params.userId,
        email: req.body.email || '',
        name: req.body.name || '',
        description: req.body.description || '',
        picture: req.body.picture || ''
    });

    User.find({ userId: req.params.userId })
    .exec()
    .then(docs => {
        if (docs.length === 0) {
            return user.save();
        } else {
            throw new Error(`User with ID ${req.params.userId} already exists`);
        }
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Handling POST requests to /users",
            createdUser: user
        });
    })
    .catch(err => {
        console.log(err);
        if (err.message) {
            err = err.message;
        }
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findOne({ userId: id })
    .exec()
    .then(doc => {
        console.log("DOC",doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({ message: 'No valid entry found for that user id' });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOperations = {};
    for (const ops of req.body) {
        updateOperations[ops.propName] = ops.value;
    }
    if (updateOperations.userId) {
        delete updateOperations.userId;
    }

    User.update({ userId: id }, { $set: updateOperations })
      .exec()
      .then(result => {
          console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
});

router.delete("/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.remove({ userId: id })
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

module.exports = router;