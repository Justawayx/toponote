// =====================================
// Set up node-postgres pool
// =====================================

const dbconfig = require('../config.json');
const Pool = require('pg').Pool;
const pool = new Pool(dbconfig);

// =====================================
// Functions for querying data from db
// =====================================

// Get all notes corresponding to a user
// (all information except tags)

const getUserNotes = (d_user_id) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('SELECT * FROM notes WHERE user_id=$1', [d_user_id],
				(error, results) => {
					if (error) { reject(error); }
					resolve(results.rows);
				});
		});
}

// Get all pages corresponding to a user

const getUserPages = (d_user_id) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('SELECT * FROM pages WHERE user_id=$1', [d_user_id],
				(error, results) => {
					if (error) { reject(error); }
					resolve(results.rows);
				});
		});
}

// Get all prereq tags (ids and names) corresponding to a note ID

const getNotePrereqTags = (d_note_id) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('SELECT getNotePrereqTags($1)', [d_note_id],
				(error, results) => {
					if (error) { reject(error); }
					resolve(results.rows);
				});
		});
}

// Get all info tags (ids and names) corresponding to a note ID

const getNoteInfoTags = (d_note_id) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('SELECT getNoteInfoTags($1)', [d_note_id],
				(error, results) => {
					if (error) { reject(error); }
					resolve(results.rows);
				});
		});
}

// Get list of tags (ids and names) for a user

const getUserTags = (d_user_id) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('SELECT getUserTags($1)', [d_user_id],
				(error, results) => {
					if (error) { reject(error); }
					resolve(results.rows);
				});
		});
}

// =====================================
// Functions that modify db
// =====================================

// Inserts user to database if username does not already exist,
// returning id and other information if so
// d_name: string | d_email: string | d_pwd_hash: string

const insertUser = (d_name, d_email, d_pwd_hash) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('INSERT INTO users (id, name, email, pwd_hash) VALUES (DEFAULT, $1, $2, $3) ON CONFLICT DO NOTHING RETURNING *', [d_name, d_email, d_pwd_hash],
				(error, results) => {
					if (error) { reject(error); }
					resolve(results.rows);
				});
		})
}

// Updates user password
// d_user_id: int | d_new_pwd_hash: string

const updateUserPassword = (d_user_id, d_new_pwd_hash) => {
	return new Promise (
		function (resolve, reject) {
			pool.query('UPDATE users SET pwd_hash=$1 WHERE id=$2', [d_user_id, d_new_pwd_hash], 
				(error, results) => {
					if (error) { reject(error); }
					resolve(`User password has been updated`);
				});
		})
}

// Deletes user by ID

const deleteUser = (d_user_id) => {
  return new Promise(
		function(resolve, reject) {
			pool.query('DELETE FROM users WHERE id=$1', d_user_id,
				(error, results) => {
					if (error) reject(error)
					resolve(`User deleted with ID: ${d_user_id}`) // If no error, report user deletion
			})
		})
}

// Inserts a new tag, returning id and name if not already existing
// d_name: string

const insertTag = (d_name) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('INSERT INTO tags (id, name) VALUES (DEFAULT, $1) ON CONFLICT DO NOTHING RETURNING *', [d_name],
				(error, results) => {
					if (error) { reject(error); }
					resolve(results.rows);
				});
		})
}

// Inserts a new page, returning id and other information
// d_user_id: int | d_page_name: string
// conflict not possible?

const insertPage = (d_user_id, d_time, d_page_name) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('INSERT INTO pages (id, user_id, time_created, name) VALUES (DEFAULT, $1, $2, $3) RETURNING *', [d_user_id, d_time, d_page_name],
				(error, results) => {
					if (error) { reject(error); }
					resolve(results.rows);
				});
		})
}

// Updates name of a page
// d_page_id: int | d_new_page_name: string
// conflict not possible?

const updatePageName = (d_page_id, d_new_page_name) => {
	return new Promise (
		function (resolve, reject) {
			pool.query('UPDATE pages SET name=$1 WHERE id=$2', [d_page_id, d_new_page_name], 
				(error, results) => {
					if (error) { reject(error); }
					resolve(`Page name has been updated`);
				});
		})
}

// Deletes page by ID

const deletePage = (d_page_id) => {
  return new Promise(
		function(resolve, reject) {
			pool.query('DELETE FROM pages WHERE id=$1', d_page_id,
				(error, results) => {
					if (error) reject(error)
					resolve(`Page deleted with ID: ${d_page_id}`) // If no error, report user deletion
			})
		})
}

// Inserts a new note, returning id and other information
// d_title: string | d_user_id: int | d_time: string | d_page_id: int | d_content: string
// conflict not possible?

const insertNote = (d_title, d_user_id, d_time, d_page_id, d_content) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('INSERT INTO notes (id, title, user_id, time_last_modified, page_id, content) VALUES (DEFAULT, $1, $2, $3, $4, $5) RETURNING *', [d_title, d_user_id, d_time, d_page_id, d_content],
				(error, results) => {
					if (error) { reject(error); }
					resolve(results.rows);
				});
		})
}

// Updates title, content and time_last_modified of a note
// d_note_id: int | d_title: string | d_time: string | d_content: string

const updateNote = (d_note_id, d_title, d_time, d_content) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('UPDATE notes SET title=$2, time_last_modified=$3, content=$4 WHERE id=$1', [d_note_id, d_title, d_time, d_content],
				(error, results) => {
					if (error) { reject(error); }
					resolve(`Note has been updated`);
				});
		})
}

// Deletes note by ID

const deleteNote = (d_note_id) => {
  return new Promise(
		function(resolve, reject) {
			pool.query('DELETE FROM notes WHERE id=$1', d_note_id,
				(error, results) => {
					if (error) reject(error)
					resolve(`Note deleted with ID: ${d_note_id}`) // If no error, report user deletion
			})
		})
}

// Associates an existing note with an existing info tag

const insertNoteInfoTag = (d_note_id, d_tag_id) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('INSERT INTO m2m_note_info_tag (note_id, tag_id) VALUES ($1, $2)', [d_note_id, d_tag_id],
				(error, results) => {
					if (error) { reject(error); }
					resolve(`Note info tags have been updated`);
				});
		})
}

// Removes association between an existing note with an existing info tag

const removeNoteInfoTag = (d_note_id, d_tag_id) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('DELETE FROM m2m_note_info_tag WHERE note_id=$1 AND tag_id=$2', [d_note_id, d_tag_id],
				(error, results) => {
					if (error) { reject(error); }
					resolve(`Note info tags have been updated`);
				});
		})
}

// Associates an existing note with an existing prereq tag

const insertNotePrereqTag = (d_note_id, d_tag_id) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('INSERT INTO m2m_note_prereq_tag (note_id, tag_id) VALUES ($1, $2)', [d_note_id, d_tag_id],
				(error, results) => {
					if (error) { reject(error); }
					resolve(`Note prereq tags have been updated`);
				});
		})
}

// Removes association between an existing note with an existing prereq tag

const removeNotePrereqTag = (d_note_id, d_tag_id) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('DELETE FROM m2m_note_prereq_tag WHERE note_id=$1 AND tag_id=$2', [d_note_id, d_tag_id],
				(error, results) => {
					if (error) { reject(error); }
					resolve(`Note info tags have been updated`);
				});
		})
}

// Exports

module.exports = {
	
	getUserNotes,
	getUserPages,
	getNotePrereqTags, 
	getNoteInfoTags, 
	getUserTags, 
	
	insertUser,
	updateUserPassword, 
	deleteUser,
	
	insertTag, 
	
	insertPage,
	updatePageName,
	deletePage, 
	
	insertNote, 
	updateNote, 
	deleteNote, 
	
	insertNoteInfoTag, 
	removeNoteInfoTag,
	insertNotePrereqTag, 
	removeNotePrereqTag,
	
}