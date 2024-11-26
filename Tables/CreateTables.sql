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
    isVerify BOOLEAN default false,
    authorId INT REFERENCES products (id)
);

CREATE TEMPORARY TABLE productAuthorPairs (
    productTitle VARCHAR(140),
    authorName VARCHAR(60)
);

DO $$
DECLARE
    v_productTitle VARCHAR(255);
    v_authorName VARCHAR(255);
    authorId INT;
	productId INT;
BEGIN
    FOR v_productTitle, v_authorName IN
        SELECT productTitle, authorName FROM productAuthorPairs
    LOOP
        SELECT id INTO authorId FROM authors WHERE name = v_authorName LIMIT 1;
        IF authorId IS NULL THEN
            INSERT INTO authors (name) VALUES (v_authorName) RETURNING id INTO authorId;
        END IF;

		SELECT id INTO productId FROM products WHERE productTitle = v_productTitle LIMIT 1;
		IF productId IS NULL THEN
			INSERT INTO products (productTitle, authorId) VALUES (v_productTitle, authorId);
		END IF;
    END LOOP;

	DROP TABLE IF EXISTS productAuthorPairs;

END $$;