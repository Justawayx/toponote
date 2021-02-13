--------------------------------
-- Toponote database creation --
--------------------------------

-- Table of users
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username TEXT NOT NULL,
	email TEXT NOT NULL,
	pwd_hash TEXT NOT NULL,
	UNIQUE(username)
);

-- Table of user-created pages
CREATE TABLE pages (
	id SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(id), -- User who created this page
	name TEXT NOT NULL
);

-- Table of user-created notes
CREATE TABLE notes (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	user_id INT REFERENCES users(id), -- User who created this note
	time_last_modified TIMESTAMP NOT NULL, -- store as Pacific timezone
	page_id INT REFERENCES pages(id), -- Page which note is part of
	content TEXT NOT NULL -- Content of note in markdown format
);

-- Table of application-wide tags
CREATE TABLE tags (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	UNIQUE(name)
);

-- Associates notes with tags
CREATE TABLE m2m_note_tag (
	note_id INT REFERENCES notes(id),
	tag_id INT REFERENCES tags(id), 
	CONSTRAINT note_tag_id PRIMARY KEY (note_id, tag_id)
);

----------------------------------
-- Utility functions/procedures --
----------------------------------
