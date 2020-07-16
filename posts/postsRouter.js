const express = require('express');
const router = express.Router();

const Posts = require('../data/db.js');

// 2.) router file only handle path after the /
// 3.) create all routes on the router and not the server
// 4.) export the router


// //--------------------
//     //Create
// //--------------------
router.post('/', (req, res) => {
    const { title, contents } = req.body;

    if (!title || !contents ) {
        res.status(400).json({ message: 'Please add title and or contents'})
    } else {
        Posts.insert({ title, contents })
        .then(
            id => Posts.findById(id.id).then( post => res.status(201).json(post))
        )
        .catch(
            err => res.status(500).json({ message: err.message })
        )
    }
})

// //--------------------
//     //Create - Comment
// //--------------------
router.post('/:id/comments', (req, res) => {
    const { text } = req.body;
    const post_id = req.params.id;

    Posts.findById(post_id)
    .then(post => {

        if (post.length > 0) {
            if (!text) {
                res.status(400).json({ message: 'Please add text to comment'})
            } else {
                let comment = {
                    text,
                    post_id
                }
    
                Posts.insertComment(comment)
                .then(
                    ({ id }) => {
                        Posts.findCommentById(id)
                        .then( comment => {
                            res.status(201).json(comment)
                        })
                    }
                )
                .catch(
                    err => res.status(500).json({ message: err.message })
                )
            }
        } else {
            res.status(404).json({ message: 'Post does not exist' })
        }            
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error retrieving the posts' });
    })

})

// //--------------------
//     //Read
// //--------------------

router.get('/', (req, res) => {
    Posts.find(req.query)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error retrieving the posts', err });
    })
})

// //--------------------
//     //Read by ID
// //--------------------

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {

        if (post.length > 0) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: 'Post does not exist' })
        }            
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error retrieving the posts' });
    })
})

// //--------------------
//     //Read Comments by Post ID
// //--------------------
router.get('/:id/comments', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {

        if (post.length > 0) {
            Posts.findPostComments(req.params.id)
                .then(comment => {
                    res.status(200).json(comment)
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ message: 'Error retrieving the comments'});
                })
        } else {
            res.status(404).json({ message: 'Post does not exist' })
        }            
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error retrieving the posts' });
    })
})

// //--------------------
//     //Update
// //--------------------
router.put('/:id', (req, res) => {
    const { title, contents } = req.body;
    const { id } = req.params;

    const updated = {
        title,
        contents
    }
    
    Posts.update(id, updated)
        .then(post => {
            if(post) {
                if(!title || !contents) {
                    res.status(400).json({ message: 'Please add title and or contents'})
                } else {
                    Posts.findById(id)
                    .then(post => 
                        res.status(201).json(post))
                }
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } 
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error retrieving the posts' })
        })
})

// //--------------------
//     //Delete
// //--------------------
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    Posts.remove(id)
        .then(post => {
            if(post) {
                res.status(201).json({ message: 'The post was deleted' })
            } else {
                res.status(400).json({ message: 'The specified post does not exist' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error retrieving the post' })
        })
})


module.exports = router;