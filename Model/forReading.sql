CREATE TABLE
    user_book_forreading (
        user_id INT NOT NULL,
        book_id INT NOT NULL,
        CONSTRAINT pk_user PRIMARY KEY (user_id),
        CONSTRAINT fk_user_book_forreading_user FOREIGN KEY (user_id) REFERENCES account (id),
        CONSTRAINT fk_user_book_book_forreading_book FOREIGN KEY (book_id) REFERENCES book (id)
    );

SELECT * FROM account AS u JOIN user_book_forreading AS ub ON ub.user_id = u.id;

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