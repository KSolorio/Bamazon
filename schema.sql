DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products ( 
item_id INTEGER NOT NULL AUTO_INCREMENT,
product_name VARCHAR(255) NOT NULL,
department_name VARCHAR(255) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT(10) NOT NULL,

PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES
		('Better than Sex Mascara', 'Eye Makeup', 19.00, 30),
        ('Naked Eyeshadow Pallete', 'Eye Makeup', 49.00, 80), 
        ('Anastasia Dipbrow Pomade', 'Eye Makeup', 18.00, 40), 
        ('Kat Von D liner', 'Eye Makeup', 19.00, 30),
        ('Becca Higlighter', 'Face Makeup', 38.00, 75), 
        ('Maybleline Super Stay Foundation', 'Face Makeup', 9.99, 60), 
        ('Kat Von D Everlasting Liquid Lipstick', 'Face Makeup', 20.00, 30), 
        ('It Cosmetics Pressed Powder', 'Face Makeup', 29.00, 15),
		('Beauty Blender', 'Beauty Tools', 20.00, 120),
        ('Morphe 18 piece Brush Set', 'Beauty Tools', 49.00, 25);
SELECT * FROM products;
