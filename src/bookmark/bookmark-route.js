const express = require('express')
const { v4: uuid } = require('uuid');
const logger = require('../logger');
const bookmark = require('../store');
const bookmarkRouter = express.Router()

const bodyParser = express.json();


bookmarkRouter
    .route('/bookmark')
    .get((req, res) => {
        res.json(bookmark)
    })
    .post(bodyParser, (req, res) => { 
        const { title, url, rating=1, description=' '} = req.body

        if(!title){
            logger.error(`title is required`)
            return res  
                .status(400)
                .send('Invalid data')
        }

        if(!url){
            logger.error(`url is required`)
            return res 
                .status(400)
                .send('Invalid data')
        }

        if(!rating && isNaN(rating)){
            logger.error(`rating is required and must be a number`)
            return res 
                .status(400)
                .send('Invalid data')
        }

        if(!description){
            logger.error(`description is required`)
            return res
                .status(400)
                .send('Invalid data')
        }

        const id = uuid();
        const newBookmark = {
            id,
            title,
            url,
            rating,
            description
        }
        bookmark.push(newBookmark)
        logger.info(`bookmark with id ${id} created`)

        res 
            .status(201)
            .location(`http://localhost:8000/bookmark/${id}`)
            .json(newBookmark)
    })

bookmarkRouter
    .route('/bookmark/:id')
    .get((req, res) => {
        const { id } = req.params
        const bookmarks = bookmarks.find(b=>b.id === id)

        if(!bookmarks){
            logger.error(`Bookmark with id ${id} not found.`)
            return res  
                .status(404)
                .send('Bookmark not found')
        }

        res.json(bookmarks)
    })
    .delete((req, res) => {
        const { id } = req.params
        const bookmarkIndex = bookmark.findIndex(b=>b.id === id);

        if(bookmarkIndex === -1){
            logger.error(`Bookmark with id ${id} not found.`)
            return res
                .status(404)
                .send('Not found')
        }

        bookmark.splice(bookmarkIndex, 1);
        
        logger.info(`Bookmark with id ${id} deleted.`)

        res
            .status(204)
            .end()
    })

module.exports = bookmarkRouter