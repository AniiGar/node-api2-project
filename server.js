const express = require('express');

const server = express();

const postsRouter = require('./posts/postsRouter');

server.use(express.json());

// 1.) Must import the router.
server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
    res.json({message:'Server running'})
})

module.exports = server;