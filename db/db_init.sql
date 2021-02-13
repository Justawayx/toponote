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

-- Associates notes with info tags
CREATE TABLE m2m_note_info_tag (
	note_id INT REFERENCES notes(id),
	tag_id INT REFERENCES tags(id), 
	CONSTRAINT note_info_tag_id PRIMARY KEY (note_id, tag_id)
);

-- Associates notes with prerequisite tags
CREATE TABLE m2m_note_prereq_tag (
	note_id INT REFERENCES notes(id),
	tag_id INT REFERENCES tags(id), 
	CONSTRAINT note_prereq_tag_id PRIMARY KEY (note_id, tag_id)
);

----------------------------------
-- Utility functions/procedures --
----------------------------------

-- Get notes meta-information only (exclude content)
CREATE VIEW notes_meta AS
	SELECT id, title, user_id, time_last_modified, pageid FROM notes;

-- Get all tags (names) corresponding to a user (ID)
-- based on union of tags of all notes of the user
CREATE FUNCTION getUserTags (d_user_id INT) RETURNS SETOF TEXT AS
$$ 
(SELECT t.name FROM m2m_note_prereq_tag a, tags t, notes n WHERE a.note_id=n.id AND a.tag_id=t.id AND n.user_id=d_user_id) 
UNION 
(SELECT t.name FROM m2m_note_info_tag a, tags t, notes n WHERE a.note_id=n.id AND a.tag_id=t.id AND n.user_id=d_user_id)  
$$ LANGUAGE SQL;

-- Get all notes (IDs) corresponding to a tag (name) for a user (ID)
-- consider both prereq and info tags
CREATE FUNCTION getTagUserNotes (d_user_id INT, d_tag_name TEXT) RETURNS SETOF INT AS
$$ 
(SELECT a.note_id FROM m2m_note_prereq_tag a, tags t, notes n WHERE a.note_id=n.id AND a.tag_id=t.id AND n.user_id=d_user_id AND t.name=d_tag_name) 
UNION 
(SELECT a.note_id FROM m2m_note_info_tag a, tags t, notes n WHERE a.note_id=n.id AND a.tag_id=t.id AND n.user_id=d_user_id AND t.name=d_tag_name)  
$$ LANGUAGE SQL;

-- Get all prereq tags (names) corresponding to a note (ID)
CREATE FUNCTION getNotePrereqTags (d_note_id INT) RETURNS SETOF TEXT AS
$$ SELECT t.name FROM m2m_note_prereq_tag a, tags t WHERE a.tag_id=t.id AND a.note_id=d_note_id $$ LANGUAGE SQL;

-- Get all info tags (names) corresponding to a note (ID)
CREATE FUNCTION getNoteInfoTags (d_note_id INT) RETURNS SETOF TEXT AS
$$ SELECT t.name FROM m2m_note_info_tag a, tags t WHERE a.tag_id=t.id AND a.note_id=d_note_id $$ LANGUAGE SQL;

----------------------------------
------ Initial/static data -------
----------------------------------

-- Test users (reserve id: 1)
INSERT INTO users (id, username, email, pwd_hash) VALUES (DEFAULT, 'Test User', 'test@bruintalks.com', 'badpassword');
INSERT INTO users (id, username, email, pwd_hash) VALUES (DEFAULT, 'Gannie Ao', 'harrypotter@gmail.com', 'iamawesome');

-- Test pages
INSERT INTO pages (id, user_id, name) VALUES
	(DEFAULT, 1, 'CS 143: Databases'), 
	(DEFAULT, 2, 'HSAR 439 Surrealism'),
	(DEFAULT, 2, 'Deep Learning Course');

-- Test tags
INSERT INTO tags (id, name) VALUES 
	(DEFAULT, 'Surrealism'),
	(DEFAULT, 'Consciousness'),
	(DEFAULT, 'Matrix Multiplication'),
	(DEFAULT, 'Neural Networks'),
	(DEFAULT, 'Linear Algebra'),
	(DEFAULT, 'Machine Learning'),
	(DEFAULT, 'Random Forest'),
	(DEFAULT, 'Optimization Theory'),
	(DEFAULT, 'Relational Model'),
	(DEFAULT, 'Relational Algebra'),
	(DEFAULT, 'Structured Query Language (SQL)'),
	(DEFAULT, 'Entity Relationship Diagram');

-- Test notes and note tag associations
INSERT INTO notes (id, title, user_id, time_last_modified, page_id, content) VALUES
	(DEFAULT, 'Overview', 2, NOW(), (SELECT id FROM pages WHERE name='HSAR 439 Surrealism'), 'The central idea is separate but shared consciousness among all humanity.'); -- no prereq, info: surrealism, consciousness

INSERT INTO m2m_note_info_tag (note_id, tag_id) VALUES
	(1, (SELECT id FROM tags WHERE name='Surrealism')),
	(1, (SELECT id FROM tags WHERE name='Consciousness'));

INSERT INTO notes (id, title, user_id, time_last_modified, page_id, content) VALUES
	(DEFAULT, 'Matrix Multiplication', 2, NOW(), (SELECT id FROM pages WHERE name='Deep Learning Course'), 'This is how you do matrix multiplication.'), -- no prereq, info: matrix multiplication, linear algebra
	(DEFAULT, 'Neutral Networks', 2, NOW(), (SELECT id FROM pages WHERE name='Deep Learning Course'), 'Each neuron output is the result of an activation function applied to a certain linear combination of its inputs.'), -- prereq: matrix multiplication, info: machine learning, neural networks
	(DEFAULT, 'Entity Relationship diagram', 1, NOW(), (SELECT id FROM pages WHERE name='CS 143: Databases'), 'Entity Relationship diagrams are a thing'), -- prereq: relational model, info: entity relationship diagram
	(DEFAULT, 'Relational Databases', 1, NOW(), (SELECT id FROM pages WHERE name='CS 143: Databases'), 'The relational model organizes data in tables, aka relations, which consist of attribute tuples.'); -- prereq: none, info: relational model, relational algebra

INSERT INTO m2m_note_info_tag (note_id, tag_id) VALUES
	(2, (SELECT id FROM tags WHERE name='Matrix Multiplication')),
	(2, (SELECT id FROM tags WHERE name='Linear Algebra')),
	(3, (SELECT id FROM tags WHERE name='Machine Learning')),
	(3, (SELECT id FROM tags WHERE name='Neural Networks')),
	(4, (SELECT id FROM tags WHERE name='Entity Relationship Diagram')),
	(5, (SELECT id FROM tags WHERE name='Relational Algebra')),
	(5, (SELECT id FROM tags WHERE name='Relational Model'));

INSERT INTO m2m_note_prereq_tag (note_id, tag_id) VALUES
	(3, (SELECT id FROM tags WHERE name='Matrix Multiplication')),
	(4, (SELECT id FROM tags WHERE name='Relational Algebra'));
	