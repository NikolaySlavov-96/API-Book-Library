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

-- BOOKS
INSERT INTO
    productAuthorPairs (productTitle, authorName)
VALUES (
        'Зов за завръщане книга',
        'Арнолд Шварценегер'
    ),
    (
        'Анти крехкост',
        'Насим Никълъс Талеб'
    ),
    (
        'Компенсация',
        'Ралф Лордо Емерсън'
    ),
    (
        'Епохата на разума',
        'Томас Пейн'
    ),
    (
        'Не ме карай да мисля',
        'Стийв Круг'
    ),
    ('Един изстрел', 'Лий Чайлд'),
    (
        'Predictable rewenue',
        ' Aaron Ross, Marylou Tyler'
    ),
    (
        'Залеза на боговете - ( Свободен да избираш )',
        'Том Егеланд'
    ),
    (
        'Игрите, които хората играят',
        'Ерик Бърн'
    ),
    (
        'Манията да бъдеш изключителен',
        'Патрик Ленсиони'
    ),
    ('Тим Кук', 'Лиандър Кейни'),
    (
        'Академия за убийци',
        'Рупърт Холмс'
    ),
    (
        'Изкуствен интелект',
        'Хилъри Ламб, Джоул Леви, Клеър Куигли'
    ),
    (
        'Не мисли прекалено много',
        'Ан Богъл'
    ),
    ('Писателят', 'Дж. С. Маетис'),
    (
        'Войната на буквите',
        'Людмила Филипова'
    ),
    (
        'Седемте решения',
        'Анди Андрюс'
    ),
    (
        'Оставаме или напускаме...',
        'Лайънел Шрайвър'
    ),
    (
        'Обсадата на Кришнапур',
        'Дж. Г. Фарел'
    ),
    (
        'Изобретенията на професор Вагнер',
        'Александър Беляев'
    ),
    (
        'Нарушете всички правила / Първо, наруши всички правила',
        'Маркъс Бъкингам, Кърт Кофман'
    ),
    (
        'Ключовите разговори',
        'Кери Патерсън'
    ),
    ('Мениджър мечта', 'Матю Кели'),
    (
        'Пусни народа ми да кара сърф',
        'Ивон Шуинар'
    ),
    (
        'По-важно от парите',
        'Робърт Кийосаки'
    ),
    (
        'Емоцията на марката. Творчески уроци по лидерство от кариерата ми в Nike',
        'Грег Хофман'
    ),
    (
        'Земното минало - книга 3: Безсмъртната смърт',
        'Лиу Цъсин'
    ),
    (
        'Земното минало - книга 2: Тъмна гора',
        'Лиу Цъсин'
    ),
    (
        'Земното минало - книга 1: Трите тела',
        'Лиу Цъсин'
    ),
    (
        'Игра на тронове',
        'Джордж Р. Р. Мартин'
    ),
    (
        'Сблъсък на крале',
        'Джордж Р. Р. Мартин'
    ),
    (
        'Вихър от мечове',
        'Джордж Р. Р. Мартин'
    ),
    (
        'Пир за врани',
        'Джордж Р. Р. Мартин'
    ),
    (
        'Танц с дракони',
        'Джордж Р. Р. Мартин'
    ),
    (
        'Съчинения в 11 тома - том 4',
        'Ерих Фром'
    );