CREATE TABLE
    user_book_forpurchase (
        user_id INT NOT NULL,
        book_id INT NOT NULL,
        isDelete BOOLEAN DEFAULT false,
        CONSTRAINT pk_user_book_for PRIMARY KEY (user_id, book_id),
        CONSTRAINT fk_user_book_forpurchase_user FOREIGN KEY (user_id) REFERENCES account (id),
        CONSTRAINT fk_user_book_forpurchase_book FOREIGN KEY (book_id) REFERENCES book (id)
    );
DELETE FROM user_book_forpurchase WHERE book_id = 10;

DELETE FROM user_book_forpurchase WHERE user_id = 1 AND book_id = 10;