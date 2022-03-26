const express = require('express');
const { status } = require('express/lib/response');
const { MongoKerberosError } = require('mongodb');
const Post = require('../models/post');
const router = express.Router();

router.get('/', (req, res) => {
  Post.find({})
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ error: err }));
});

router.post('/add', (req, res) => {
  const postDetails = req.body;
  const newPost = new Post(postDetails);

  newPost.save()
    .then(post => res.status(200).json(post))
    .catch(err => res.status(500).json(err));
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  Post.findByIdAndDelete(id)
    .then(post => res.status(200).json(post))
    .catch(err => res.status(500).json(err));
});

router.post('/update/:id', (req, res) => {
  const { done } = req.body;

  Post.findByIdAndUpdate(req.params.id, { done })
    .then(post => res.status(200).json(post))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
