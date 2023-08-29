CREATE DATABASE booklibrary;

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

DELETE FROM user_book_forpurchase WHERE book_id = 10;

DELETE FROM user_book_forpurchase WHERE user_id = 1 AND book_id = 10;

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