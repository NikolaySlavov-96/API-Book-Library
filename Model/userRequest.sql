CREATE DATABASE booklibrary;

CREATE TABLE
    'account' (
        ID SERIAL PRIMARY KEY,
        email VARCHAR(80) UNIQUE NOT NULL,
        password VARCHAR(60),
        year NUMERIC(40) NOT NULL
    );

INSERT INTO
    account (email, password, year)
VALUES (
        'gogle.bg.napster@gmail.com',
        '223344',
        22
    );