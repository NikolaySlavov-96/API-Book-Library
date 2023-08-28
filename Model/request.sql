CREATE DATABASE booklibrary;

CREATE TABLE
    book (
        ID SERIAL PRIMARY KEY,
        author VARCHAR(60),
        booktitle VARCHAR(40) UNIQUE
    );

INSERT INTO
    book (author, booktitle)
VALUES ('Ashlii Vans', 'Ilon Musk');

SELECT * FROM book;

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

CREATE TABLE
    user_book (
        user_id INT NOT NULL,
        book_id INT NOT NULL,
        CONSTRAINT pk_user PRIMARY KEY (user_id),
        CONSTRAINT fk_user_book FOREIGN KEY (user_id) REFERENCES account (id),
        CONSTRAINT fk_user_book_book FOREIGN KEY (book_id) REFERENCES book (id)
    );

INSERT INTO user_book (user_id, book_id) VALUES (1, 10);

SELECT * FROM account AS u JOIN user_book AS ub ON ub.user_id = u.id;

SELECT * FROM user_book AS ub JOIN account AS u ON ub.user_id = u.id;

SELECT *
FROM account AS u
    JOIN user_book AS ub ON ub.user_id = u.id
    JOIN book AS b ON ub.book_id = b.id;

SELECT
    u.email,
    b.author,
    b.booktitle
FROM account AS u
    JOIN user_book AS ub ON ub.user_id = u.id
    JOIN book AS b ON ub.book_id = b.id;

DROP TABLE user_book;

CREATE TABLE
    user_book_purchase (
        user_id INT NOT NULL,
        book_id INT NOT NULL,
        CONSTRAINT pk_user_book PRIMARY KEY (user_id, book_id),
        CONSTRAINT fk_user_book FOREIGN KEY (user_id) REFERENCES account (id),
        CONSTRAINT fk_user_book_book FOREIGN KEY (book_id) REFERENCES book (id)
    );

INSERT INTO user_book_purchase (user_id, book_id) VALUES (1, 10);

SELECT
    u.email,
    b.author,
    b.booktitle
FROM account AS u
    JOIN user_book_purchase AS ubp ON ubp.user_id = u.id
    JOIN book AS b ON ubp.book_id = b.id
WHERE
    b.author LIKE 'Остин Клиън';

SELECT
    u.email,
    b.author,
    b.booktitle
FROM account AS u
    JOIN user_book_purchase AS ubp ON ubp.user_id = u.id
    JOIN book AS b ON ubp.book_id = b.id
LIMIT 5;

CREATE TABLE
    user_book_forpurchase (
        user_id INT NOT NULL,
        book_id INT NOT NULL,
        isDelete BOOLEAN DEFAULT false,
        CONSTRAINT pk_user_book_for PRIMARY KEY (user_id, book_id),
        CONSTRAINT fk_user_book_for FOREIGN KEY (user_id) REFERENCES account (id),
        CONSTRAINT fk_user_book_forpurchase FOREIGN KEY (book_id) REFERENCES book (id)
    );

INSERT INTO user_book_forpurchase (user_id, book_id) VALUES (1, 10);

UPDATE user_book_forpurchase SET isdelete = true;

SELECT * FROM book WHERE id > 38;

UPDATE book
SET
    author = '',
    booktitle = 'Как да манипулираме хората'
WHERE id = 39;

SELECT * FROM book WHERE id > 35;

ALTER TABLE book ALTER COLUMN booktitle TYPE varchar(255);

INSERT INTO book (author, booktitle) VALUES ('','');

SELECT COUNT(*) FROM book;

DELETE FROM user_book_forpurchase WHERE book_id = 10;

DELETE FROM user_book_forpurchase WHERE user_id = 1 AND book_id = 10;

INSERT INTO
    book (author, booktitle)
VALUES ('', 'Да се научим да умираме') RETURNING id;

WITH book AS (INSERT INTO book (author, booktitle) VALUES ('','Аз съм добре и ти си добре') RETURNING id AS id) INSERT INTO user_book_forpurchase (user_id, book_id) VALUES (1, (SELECT id FROM book));
WITH book AS (INSERT INTO book (author, booktitle) VALUES ('','') RETURNING id AS id) INSERT INTO user_book_forpurchase (user_id, book_id) VALUES (1, (SELECT id FROM book));