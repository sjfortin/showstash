CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    email VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(80) NOT NULL,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL
);
CREATE TABLE shows
(
    id SERIAL PRIMARY KEY,
    band VARCHAR(80) NOT NULL,
    show_date DATE NOT NULL,
    venue VARCHAR(120) NOT NULL,
    venue_id INT REFERENCES venues
);
CREATE TABLE users_shows
(
    id SERIAL PRIMARY KEY,
    notes VARCHAR(256),
    show_id INT REFERENCES shows,
    user_id INT REFERENCES users
);
CREATE TABLE venues
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(10),
);
CREATE TABLE friends
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    user_id INT REFERENCES users
);
CREATE TABLE user_show_friends
(
    user_show_id INT REFERENCES users_shows,
    friend_id INT REFERENCES friends,
    PRIMARY KEY (user_show_id, friend_id)
);
