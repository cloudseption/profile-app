const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Resource = require('../models/resource');

router.get('/', (req, res, next) => {
    Resource.find()
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

router.get('/:resourceId', (req, res, next) => {
    Resource.find({ name: req.params.resourceId })
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
    Resource.find({ name: req.params.resourceId })
    .exec()
    .then(docs => {
        if (docs.length > 0) {
            throw new Error(`Resource ${req.params.resourceId} already exists.`);
        }
    })
    .then(() => {
        const resource = new Resource({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name, 
            displayName: req.body.displayName,
        });
        resource.save().then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /resources",
                createdUser: resource
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:resourceName', (req, res, next) => {
    const id = req.params.resourceName;
    Resource.findOne(id)
    .exec()
    .then(doc => {
        console.log(doc);
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

// router.patch('/:userId', (req, res, next) => {
//     const id = req.params.userId;
//     const updateOperations = {};
//     for (const ops of req.body) {
//         updateOperations[ops.propName] = ops.value;
//     }
//     User.update({ _id: id }, { $set: updateOperations })
//       .exec()
//       .then(result => {
//           console.log(result);
//         res.status(200).json(result);
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json({ error: err });
//       });
// });

// router.delete("/:userId", (req, res, next) => {
//     const id = req.params.userId;
//     User.remove({_id: id})
//     .exec()
//     .then(result => {
//         res.status(200).json(result);
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({ error: err });
//     });
// });

module.exports = router;