CREATE DATABASE booklibrary;

CREATE TABLE
    book (
        ID SERIAL PRIMARY KEY,
        author VARCHAR(60),
        booktitle VARCHAR(40) UNIQUE,
        image VARCHAR(145),
        -- Not include
        genre VARCHAR(45) -- Not Include
    );

INSERT INTO
    book (author, booktitle)
VALUES ('Ashlii Vans', 'Ilon Musk');

SELECT * FROM book;

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

INSERT INTO
    book (author, booktitle)
VALUES ('', 'Да се научим да умираме') RETURNING id;

ALTER TABLE book ADD image VARCHAR(145);

WITH book AS (
        INSERT INTO
            book (author, booktitle)
        VALUES (
                '',
                'Аз съм добре и ти си добре'
            ) RETURNING id AS id
    )
INSERT INTO
    user_book_forpurchase (user_id, book_id)
VALUES (
        1, (
            SELECT id
            FROM book
        )
    );

WITH book AS (
        INSERT INTO
            book (author, booktitle)
        VALUES ('', '') RETURNING id AS id
    )
INSERT INTO
    user_book_forpurchase (user_id, book_id)
VALUES (
        1, (
            SELECT id
            FROM book
        )
    );

SELECT * FROM book LIMIT 10 OFFSET 20;

SELECT (SELECT COUNT(*) FROM book) as count, (SELECT json_agg(t.*) FROM(SELECT * FROM book OFFSET 10 LIMIT 10) AS t) AS rows;

SELECT * FROM book WHERE booktitle LIKE '%Ашли%' OR author LIKE '%Ашли%' OR genre LIKE '%Ашли%';