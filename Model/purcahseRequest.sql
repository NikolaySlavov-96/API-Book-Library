CREATE DATABASE booklibrary;

CREATE TABLE
    user_book_purchase (
        user_id INT NOT NULL,
        book_id INT NOT NULL,
        isDelete BOOLEAN DEFAULT false,
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