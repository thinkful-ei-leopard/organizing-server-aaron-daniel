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
    .post(bodyParser, (req, res) => {
        const { title, rating, description} = req.body;
        const id = uuid()
        const newBookmark = {
            id,
            title,
            description,
            rating,
        };
        if(!title) {
            logger.error('Title required')
            return res
                .status(400)
                .send('Title required')
        }
        if(!rating) {
            logger.error('Rating required')
            return res
                .status(400)
                .send('Rating required')
        }
        if(!description) {
            logger.error('Description required')
            return res
                .status(400)
                .send('Description required')
        }
        const ratingNum = parseFloat(rating);
        if(Number.isNaN(ratingNum)) {
            logger.error('Rating must be a number')
            return res 
                .status(400)
                .send('Rating must be a number')
        }
        else {
            logger.info('Bookmark saved')
            res
                .status(200)
                .end()
                bookmarks.bookmarks.push(newBookmark)
        }
    })

bookmarkRouter 
    .route('/bookmarks/:id')
    .get((req, res) => {
        const bookmarkId = req.params.id;
        console.log(bookmarks)
        const foundBookmark = bookmarks.bookmarks.find(bookmark => bookmark.id === bookmarkId)
        if(foundBookmark) {
            return res
                .status(200)
                .send(foundBookmark)
        }
        else {
            logger.error(`Bookmark with id ${bookmarkId} not found`)
            return res
                .status(404)
                .send('Bookmark not found')
        }
    })
    .delete((req, res) => {
        const bookmarkId = req.params.id;
        const index = bookmarks.bookmarks.findIndex(bookmark => bookmark.id === bookmarkId);
        if(index === -1) {
            logger.error(`Bookmark with id ${bookmarkId} not found`)
            return res 
                .status(404)
                .send('Bookmark not found')
        }
        else {
            logger.info(`Bookmark with id ${bookmarkId} deleted`)
            bookmarks.bookmarks.splice(index, 1)
            return res 
                .status(204)
                .end()
        }
    })

    module.exports = bookmarkRouter;