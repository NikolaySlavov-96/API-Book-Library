CREATE TABLE orders (
    order_id INT PRIMARY KEY,   
);

-- Composite key
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);

-- Composite key
CREATE TABLE shipments (
    shipment_id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    FOREIGN KEY (order_id, product_id) REFERENCES order_items(order_id, product_id)
);