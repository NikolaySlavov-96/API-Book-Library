CREATE DATABASE booklibrary;

CREATE TABLE
    user_book_reading (
        user_id INT NOT NULL,
        book_id INT NOT NULL,
        CONSTRAINT pk_user_book_read PRIMARY KEY (user_id, book_id),
        CONSTRAINT fk_user_book_read FOREIGN KEY (user_id) REFERENCES account (id),
        CONSTRAINT fk_user_book_book_read FOREIGN KEY (book_id) REFERENCES book (id)
    );

SELECT * FROM user_book_reading;
INSERT INTO user_book_reading (user_id, book_id) VALUES (1, 10);

SELECT
    u.email,
    b.author,
    b.booktitle
FROM account AS u
    JOIN user_book_reading AS ubr ON ubr.user_id = u.id
    JOIN book AS b ON ubr.book_id = b.id
WHERE
    b.author LIKE 'Остин Клиън';

SELECT
    u.email,
    b.author,
    b.booktitle
FROM account AS u
    JOIN user_book_reading AS ubr ON ubr.user_id = u.id
    JOIN book AS b ON ubr.book_id = b.id
LIMIT 5;