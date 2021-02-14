// =====================================
// Server dependencies
// =====================================

const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// =====================================
// Set up Express application
// =====================================

// Instantiate express and configure port
const app = express();
const port = 3001;

// =====================================
// Server configuration
// =====================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(logger('dev'));
app.use(cookieParser());

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
});

// Export the app for testing
module.exports = app;

// =====================================
// Get parse, database models
// =====================================

// const parse = require('./parse.js');
const db = require('./db.js');

// =====================================
// Routes
// =====================================

// Only for debugging
app.get('/', (req, res) => {
	res.json({
		info: 'ey b0ss',
		req_query: req.query,
		req_params: req.params,
		req_body: req.body
	})
})

// =====================================
// users
// =====================================

// POST users
app.post('/users', (req, res) => {
	db.insertUser(req.body.name, req.body.email, req.body.pwd_hash)
	.then(response => { res.status(200).send(response); })
	.catch(error => { res.status(500).send(error); })	
})

// DELETE users
app.post('/users/:id', (req, res) => {
	db.deleteUser(req.params.id)
	.then(response => { res.status(200).send(response); })
	.catch(error => { res.status(500).send(error); })	
})

// PUT users
app.put('/users/:id', (req, res) => {
	db.updateUserPassword(req.params.id, req.body.new_pwd_hash)
	.then(response => { res.status(200).send(response); })
	.catch(error => { res.status(500).send(error); })	
})

// =====================================
// pages
// =====================================

// POST pages
app.post('/pages', (req, res) => {
	db.insertPage(req.body.user_id, req.body.time, req.body.page_name)
	.then(response => { res.status(200).send(response); })
	.catch(error => { res.status(500).send(error); })	
})

// GET pages
app.get('/pages', (req, res) => {
	db.getUserPages(parseInt(req.query.user_id))
	.then(response => { res.status(200).send(response); })
	.catch(error => { res.status(500).send(error); })	
})

// DELETE pages
app.post('/pages/:id', (req, res) => {
	db.deletePage(req.params.id)
	.then(response => { res.status(200).send(response); })
	.catch(error => { res.status(500).send(error); })	
})

// PUT pages
app.put('/pages/:id', (req, res) => {
	db.updatePageName(req.params.id, req.body.new_page_name)
	.then(response => { res.status(200).send(response); })
	.catch(error => { res.status(500).send(error); })	
})

// =====================================
// notes
// =====================================

// POST notes
app.post('/notes', (req, res) => {
	db.insertNote(req.body.title, req.body.user_id, req.body.time, req.body.page_id, req.body.content)
	.then(response => { res.status(200).send(response); })
	.catch(error => { res.status(500).send(error); })	
})

// GET notes
app.get('/notes', (req, res) => {
	db.getUserNotes(req.query.user_id)
	.then(response => { res.status(200).send(response); })
	.catch(error => { res.status(500).send(error); })	
})

// DELETE notes
app.post('/notes/:id', (req, res) => {
	db.deleteNote(req.params.id)
	.then(response => { res.status(200).send(response); })
	.catch(error => { res.status(500).send(error); })	
})

// PUT notes
app.put('/notes/:id', (req, res) => {
	db.updateNote(req.params.id, req.body.title, req.body.time, req.body.content)
	.then(response => { res.status(200).send(response); })
	.catch(error => { res.status(500).send(error); })	
})