// Create web server using express
// Create HTTP request using axios
// Create web server using express
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
// Create HTTP request using axios
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
// Create database
const commentsByPostId = {};

// Create route
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

// Create route
app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    // Get the request body
    const { content } = req.body;
    // Get the post id from the request params
    const postId = req.params.id;
    // Get the comments of the post id
    const comments = commentsByPostId[postId] || [];
    // Add the new comment to the comments array
    comments.push({ id: commentId, content, status: 'pending' });
    // Update the comments of the post id
    commentsByPostId[postId] = comments;
    // Send event to event bus
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId,
            status: 'pending',
        },
    });
    res.status(201).send(comments);
});

// Create route
app.post('/events', async (req, res) => {
    console.log('Event Received:', req.body.type);
    const { type, data } = req.body;
    if (type === 'CommentModerated') {
        const { id, postId, status, content } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find((comment) => {
            return comment.id === id;
        });
        comment.status = status;
        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                status,
                content,
            },
        });
    }
    res.send({});
});

// Create port
app.listen(4001, () => {
    console.log('Listening on 4001');
});