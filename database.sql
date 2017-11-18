CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT,
    image TEXT,
    name TEXT,
    last_login TEXT
);
CREATE TABLE users_shows
(
    id SERIAL PRIMARY KEY,
    version_id TEXT,
    artist TEXT NOT NULL,
    mbid TEXT,
    show_date DATE NOT NULL,
    full_year INT,
    venue TEXT NOT NULL,
    city TEXT NOT NULL,
    state VARCHAR(10),
    notes TEXT,
    setlist TEXT[],
    image TEXT,
    user_id INT REFERENCES users
);
CREATE TABLE friends
(
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT,
    user_show INT REFERENCES users_shows
);
