const connection = require('../config/conexion'); // Asegúrate de importar la conexión
const multer = require('multer');
const path = require('path');
const Producto = require('../models/products'); // Ajusta la ruta según sea necesario

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/products'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para cada archivo
    }
});
const upload = multer({ storage: storage });

const ProductoController = {
    // Obtener todos los productos
    getAll: async (req, res) => {
        try {
            const query = 'SELECT * FROM productos';
            connection.query(query, (error, results) => {
                if (error) {
                    console.error('Error al ejecutar la consulta: ', error);
                    return res.status(500).json({ message: "Error al obtener productos", error });
                }
                return res.status(200).json(results);
            });
        } catch (err) {
            console.error('Error inesperado: ', err);
            return res.status(500).json({ message: "Error al obtener productos", error: err });
        }
    },

    // Obtener producto por ID
    getById: async (req, res) => {
        const { id } = req.params;
        try {
            const query = 'SELECT * FROM productos WHERE id_producto = ?';
            connection.query(query, [id], (error, results) => {
                if (error) {
                    return res.status(500).json({ message: 'Error al obtener producto', error: error.message });
                }
                if (results.length > 0) {
                    return res.status(200).json(results[0]);
                } else {
                    return res.status(404).json({ message: 'Producto no encontrado' });
                }
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error inesperado', error: error.message });
        }
    },

    // Crear un nuevo producto
    create: async (req, res) => {
        const { nombre, descripcion, precio, stock, plagas, dosis, id_categoria } = req.body;
        const imagen = req.file ? `/api/assets/products/${req.file.filename}` : null; // Ruta de la imagen
        try {
            const nuevoProducto = await Producto.create({ nombre, descripcion, precio, stock, plagas, dosis, imagen, id_categoria });
            return res.status(201).json(nuevoProducto);
        } catch (error) {
            return res.status(500).json({ message: 'Error al crear producto', error: error.message });
        }
    },

    // Actualizar un producto por ID
    update: async (req, res) => {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, plagas, dosis, id_categoria } = req.body;
        const imagen = req.file ? `/api/assets/products/${req.file.filename}` : null; // Nueva imagen
        try {
            const result = await Producto.update(id, { nombre, descripcion, precio, stock, plagas, dosis, imagen, id_categoria });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
        }
    },

    // Eliminar un producto por ID
    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await Producto.delete(id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
        }
    },

    // Obtener productos por categoría
    getByCategoria: async (req, res) => {
        const { id_categoria } = req.params;
        try {
            const query = 'SELECT * FROM productos WHERE id_categoria = ?';
            connection.query(query, [id_categoria], (error, results) => {
                if (error) {
                    console.error('Error al ejecutar la consulta: ', error);
                    return res.status(500).json({ message: "Error al obtener productos por categoría", error });
                }
                return res.status(200).json(results);
            });
        } catch (err) {
            console.error('Error inesperado: ', err);
            return res.status(500).json({ message: "Error al obtener productos por categoría", error: err });
        }
    },

    // Middleware para manejar la subida de imagen
    upload: upload
};

module.exports = ProductoController;
