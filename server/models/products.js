const db = require('../config/conexion'); // Tu conexión a la base de datos

class Producto {
        // Método para obtener todos los productos
        static async getAll() {
            const query = 'SELECT * FROM Productos';
            const [result] = await db.query(query);
            return result;
        }

    // Método para obtener un producto por ID
    static async getById(id) {
        const query = 'SELECT * FROM productos WHERE id_producto = ?';
        const [result] = await db.query(query, [id]);
        return result.length > 0 ? result[0] : null;
    }

    // Crear un nuevo producto
    static async create(data) {
        const { nombre, descripcion, precio, stock, plagas, dosis, imagen, id_categoria } = data;
        const query = 'INSERT INTO productos (nombre, descripcion, precio, stock, plagas, dosis, imagen, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [nombre, descripcion, precio, stock, plagas, dosis, imagen, id_categoria]);
        return { id_producto: result.insertId, ...data };
    }

    // Actualizar un producto por ID
    static async update(id, data) {
        const { nombre, descripcion, precio, stock, plagas, dosis, imagen, id_categoria } = data;
        const query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, plagas = ?, dosis = ?, imagen = ?, id_categoria = ? WHERE id_producto = ?';
        const [result] = await db.query(query, [nombre, descripcion, precio, stock, plagas, dosis, imagen, id_categoria, id]);
        if (result.affectedRows === 0) {
            throw new Error('Producto no encontrado para actualizar');
        }
        return { message: 'Producto actualizado' };
    }

    // Eliminar un producto por ID
    static async delete(id) {
        const query = 'DELETE FROM productos WHERE id_producto = ?';
        const [result] = await db.query(query, [id]);
        if (result.affectedRows === 0) {
            throw new Error('Producto no encontrado para eliminar');
        }
        return { message: 'Producto eliminado' };
    }
}

module.exports = Producto;
