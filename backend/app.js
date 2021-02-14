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
const port = 9000; // 3001

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
	// db.getUserPages(parseInt(req.query.user_id))
	// .then(response => { res.status(200).send(response); })
	// .catch(error => { res.status(500).send(error); })
	res.send([{"id": 1, "name": "Calculus"}, {"id": 2, "name": "Deep Learning"}, {"id": 3, "name": "Surrealism"}]);	
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
	// db.getUserNotes(req.query.user_id)
	// .then(response => { res.status(200).send(response); })
	// .catch(error => { res.status(500).send(error); })
	res.send([{"title": "Neural Networks", "body": "<ul><li>perceptrons</li><li>backprop</li><li>wheee</li></ul>", "tags": ["backpropagation", "training"], "prereqs": ["chain rule"]}]);	
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

// =====================================
// study guide
// =====================================
app.get('/study/:topic', (req, res) => {   // get up to 20 prereqs for specific topic on current page
	let topic = req.params.topic;
	let otherPages = req.body.otherPages;
	// find list of prereqs
	// ** ideally this would breadth-first search but we're running out of time and this doesn't work for sure **
	// let prereqs = [];
	// db.getUserNotesByTopic(1, topic, "")  // user_id, topic, page_id, prereqs
	// .then(response => { 
	// 	for (prereq in response) {
	// 		prereqs.push(prereq)
	// 	}
	// 	while (prereqs.length < 20) {
	// 		for (prereq in prereqs) {
	// 			db.getUserNotesByTopic(1, prereq)
	// 			.then(response1 => { 
	// 				for (p in response1) {
	// 					prereqs.push(p)
	// 				}
	// 			})
	// 			.catch(error => { res.status(500).send(error); })
	// 		}
	// 	}
	// 	res.status(200).send(prereqs);
	// })
	// .catch(error => { res.status(500).send(error); })

	res.send(["chain rule", "partial derivatives", "matrix multiplication"]);
});

function topologicalSortHelper(note, explored, s, notes, prereq_graph) {
	explored.add(note.title);
	// Marks this node as visited and goes on to the nodes
	// that are dependent on this node, the edge is node ----> n
	note.prereqs.forEach(prereq => {
		prereq_graph[prereq].forEach(noteTitle => {
			if (!explored.has(noteTitle)) {
			   this.topologicalSortHelper(notes[noteTitle], explored, s, prereq_graph);
			}
		 });
	});
	// All dependencies are resolved for this node, we can now add
	// This to the stack.
	s.push(note);
 }
 
 function topologicalSort(notes, prereq_graph) {
	// Create a Stack to keep track of all elements in sorted order
	let s = new Stack(notes.length);
	let explored = new Set();
 
	// For every unvisited node in our graph, call the helper.
	notes.forEach(note => {
		if (!explored.has(note.title)) {
			topologicalSortHelper(note, explored, s, notes, prereq_graph);
		}
	});
 
	let result = [];
	while (!s.isEmpty()) {
		result.push(s.pop());
	}
	return result;
 }

app.get('/study/guide', (req,res) => {  // topological sort
	let notes = [
		{
			"title": "Neural Networks",
			"body": "<ul><li>perceptrons</li><li>backprop</li><li>wheee</li></ul>",
			"tags": ["backpropagation", "training"],
			"prereqs": ["chain rule"]
		},
		{
			"title": "Chain Rule",
			"body": "<ul><li>dC/dz = dC/da * da/dz</li></ul>",
			"tags": ["chain rule", "derivatives"],
			"prereqs": ["partial derivatives"]
		},
		{
			"title": "Matrix Multiplication",
			"body": "<ul><li>multiply the matrix bruh</li></ul>",
			"tags": ["matrix multiplication"],
			"prereqs": []
		}, {
			"title": "Partial Derivative",
			"body": "<ul><li>take a derivative, but not entirely :)</li></ul>",
			"tags": ["partial derivatives"],
			"prereqs": []
		}
	]
	let prereq_graph = {};  // prereq --> dependent note titles
	notes.forEach(note => {
		note.prereqs.forEach(p => {
			if (!p in prereq_graph) {
				prereq_graph[p] = {};
			}
			prereq_graph[p].push(note.title);
		});
	});
	res.send(topologicalSort(notes, prereq_graph));
})