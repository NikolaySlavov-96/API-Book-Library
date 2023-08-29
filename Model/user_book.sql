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