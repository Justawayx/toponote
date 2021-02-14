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

const getUserNotes = (d_user_id) => {
	return new Promise(
		function (resolve, reject) {
			pool.query('SELECT * FROM notes WHERE user_id=$1', [d_user_id],
				(error, results) => {
					if (error) { reject(error); }
					// If no error, return all rows from query
					resolve(results.rows);
				});
		});
}

// =====================================
// Functions that modify db
// =====================================

// ============================================
// insertUser (userReturnObject)
// ============================================
//   userInfoObject = {
//     name: [string],
//     email: [string],
//     pwd_hash: [string],
//   }
// ============================================
// Inserts user to database if username does
// not already exist.
// ============================================

const insertUser = (userInfoObject) => {
	return new Promise(
		function (resolve, reject) {
			const { name, email, pwd_hash } = userInfoObject
			pool.query('INSERT INTO users (id, name, email, pwd_hash) VALUES (DEFAULT, $1, $2, $3) ON CONFLICT DO NOTHING RETURNING *', [name, email, pwd_hash],
				(error, results) => {
					if (error) { reject(error); }
					resolve(`User has been updated`);
				});
		})
}

// ============================================
// updateUserPassword (id, new_pwd_hash)
// ============================================
// id: int
// new_pwd_hash: string
// ============================================
// Updates user password
// ============================================

const updateUserPassword = (id, new_pwd_hash) => {
	return new Promise (
		function (resolve, reject) {
			pool.query('UPDATE users SET pwd_hash=$1 WHERE id=$2', [new_pwd_hash, id], 
				(error, results) => {
					if (error) { reject(error); }
					resolve(`User password has been updated`);
				});
		})
}

// ============================================
// deleteUser (id)
// ============================================
// Deletes user by ID.
// ============================================

const deleteUser = (id) => {
  return new Promise(
		function(resolve, reject) {
			pool.query('DELETE FROM users WHERE id=$1', id,
				(error, results) => {
					if (error) reject(error)
					resolve(`User deleted with ID: ${id}`) // If no error, report user deletion
			})
		})
}

module.exports = {
	getUserNotes,
	insertUser,
}