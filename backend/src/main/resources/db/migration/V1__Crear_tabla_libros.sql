-- Crear tabla de libros
CREATE TABLE libros (
                        id SERIAL PRIMARY KEY,
                        titulo VARCHAR(255) NOT NULL,
                        autor VARCHAR(255) NOT NULL,
                        isbn VARCHAR(255) NOT NULL,
                        precio NUMERIC(10, 2) NOT NULL,
                        fecha_publicacion DATE NOT NULL
);

-- Insertar datos iniciales
INSERT INTO libros (titulo, autor, isbn, precio, fecha_publicacion) VALUES
                                                                        ('Cien años de soledad', 'Gabriel García Márquez', '978-8437604947', 15000.00, '1967-05-30'),
                                                                        ('Don Quijote de la Mancha', 'Miguel de Cervantes', '978-8424116274', 12500.00, '1605-01-16'),
                                                                        ('El Principito', 'Antoine de Saint-Exupéry', '978-0156012195', 8900.00, '1943-04-06'),
                                                                        ('1984', 'George Orwell', '978-0451524935', 11200.00, '1949-06-08'),
                                                                        ('Ficciones', 'Jorge Luis Borges', '978-8420633126', 10500.00, '1944-01-01');