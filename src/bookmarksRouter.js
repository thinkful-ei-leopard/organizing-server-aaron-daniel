const express = require('express');
const uuid = require('uuid/v4');
const bookmarks = require('./store')
const logger = require('./logger')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter 
    .route('/bookmarks')
    .get((req, res) => {
        res
            .status(200)
            .json(bookmarks)
    })
    .post((req, res) => {
        const { title, rating, description} = req.query;
        const newBookmark = {
            id: uuid,
            title,
            description,
            rating,
        };
        if(!title) {
            return res
                .status(400)
                .send('Title required')
        }
        if(!rating) {
            return res
                .status(400)
                .send('Rating required')
        }
        if(!description) {
            return res
                .status(400)
                .send('Description required')
        }
        const ratingNum = parseFloat(rating);
        if(Number.isNaN(ratingNum)) {
            return res 
                .status(400)
                .send('Rating must be a number')
        }
        else {
            
            res
                .status(200)
                .send('Bookmark Saved')
                bookmarks.push(newBookmark)
        }
    })

bookmarkRouter 
    .route('/bookmarks/:id')
    .get((req, res) => {
        const bookmarkId = req.params.id;
        const foundBookmark = bookmarks.find(bookmark => bookmark.id === bookmarkId)
        if(foundBookmark) {
            return res
                .status(200)
                .send('Found Bookmark')
                .json(foundBookmark)
        }
        else {
            return res
                .status(404)
                .send('Bookmark not found')
        }
    })
    .delete((req, res) => {
        const bookmarkId = req.params.id;
        const index = bookmarks.findIndex(bookmark => bookmark.id === bookmarkId);
        if(index === -1) {
            return res 
                .status(404)
                .send('Bookmark not found')
        }
        else {
            bookmarks.splice(index, 1)
            return res 
                .status(204)
                .end()
        }
    })