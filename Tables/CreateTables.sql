CREATE table IF NOT EXISTS products (
    ID SERIAL PRIMARY KEY,
    authorId INT not NULL,
    productTitle VARCHAR(140) UNIQUE,
    genre VARCHAR(45),
    isVerify BOOLEAN default false
);

create table IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60),
    image VARCHAR(145),
    genre VARCHAR(45),
    isVerify BOOLEAN default false authorId INT REFERENCES products (id)
);

CREATE TEMPORARY TABLE bookAuthorPairs (
    productTitle VARCHAR(140),
    authorName VARCHAR(60)
);