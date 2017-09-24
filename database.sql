CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    email VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(80) NOT NULL,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL
);
CREATE TABLE users_shows
(
    id SERIAL PRIMARY KEY,
    version_id VARCHAR(80),
    artist VARCHAR(80) NOT NULL,
    mbid VARCHAR(80),
    show_date DATE NOT NULL,
    show_date INT,
    venue VARCHAR(120) NOT NULL,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(10),
    notes VARCHAR(256),
    setlist TEXT[],
    image VARCHAR(256),
    user_id INT REFERENCES users
);
CREATE TABLE friends
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    user_show INT REFERENCES users_shows
);
