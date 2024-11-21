const DetalleDeVenta = require('../models/soldsDetails');

const detallesDeVentaController = {
    getAllDetalles: (req, res) => {
        DetalleDeVenta.getAllDetalles((err, detalles) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener los detalles de venta', detalles: err });
            }
            res.status(200).json(detalles);
        });
    },

    createDetalleDeVenta: (req, res) => {
        const { id_producto, id_venta, cantidad, precio_Unitario } = req.body;

        if (!id_producto || !id_venta || !cantidad || !precio_Unitario) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const query = `INSERT INTO detalles_de_ventas (id_producto, id_venta, cantidad, precio_Unitario) VALUES (?, ?, ?, ?)`;
        const params = [id_producto, id_venta, cantidad, precio_Unitario];

        db.query(query, params, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al crear el detalle de venta', detalles: err });
            }
            res.status(201).json({ message: 'Detalle de venta creado exitosamente', id_detalle_venta: result.insertId });
        });
    },

    getDetalleById: (req, res) => {
        const { id } = req.params;

        db.query('SELECT * FROM detalles_de_ventas WHERE id_detalle_venta = ?', [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener el detalle de venta', detalles: err });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Detalle de venta no encontrado' });
            }
            res.status(200).json(results[0]);
        });
    },

    deleteDetalleDeVenta: (req, res) => {
        const { id } = req.params;

        db.query('DELETE FROM detalles_de_ventas WHERE id_detalle_venta = ?', [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar el detalle de venta', detalles: err });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Detalle de venta no encontrado' });
            }
            res.status(200).json({ message: 'Detalle de venta eliminado exitosamente' });
        });
    }
};

module.exports = detallesDeVentaController;
