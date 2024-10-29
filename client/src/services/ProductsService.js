import api from './Api'; // Asegúrate de que esto apunta a tu archivo de configuración de Axios

const ProductService = {
    // Obtener todos los productos
    fetchProductos: async () => {
        try {
            const response = await api.get('/productos');
            return response.data;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error; // Lanza el error para que el componente pueda manejarlo
        }
    },

    // Obtener producto por ID
    fetchProductoById: async (id) => {
        try {
            const response = await api.get(`/productos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error; // Lanza el error
        }
    },

    // Crear un nuevo producto
    createProducto: async (productoData) => {
        try {
            // Crear un FormData para manejar la imagen y otros datos
            const formData = new FormData();
            for (const key in productoData) {
                formData.append(key, productoData[key]);
            }

            const response = await api.post('/productos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error al crear producto:', error);
            throw error; // Lanza el error
        }
    },

    // Actualizar un producto
    updateProducto: async (id, productoData) => {
        try {
            // Crear un FormData para manejar la imagen y otros datos
            const formData = new FormData();
            for (const key in productoData) {
                formData.append(key, productoData[key]);
            }

            const response = await api.put(`/productos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error; // Lanza el error
        }
    },

    // Eliminar un producto
    deleteProducto: async (id) => {
        try {
            const response = await api.delete(`/productos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error; // Lanza el error
        }
    },

    // Obtener productos por categoría
    fetchProductosByCategoria: async (idCategoria) => {
        try {
            const endpoint = idCategoria && idCategoria !== 'Todos' 
                ? `/productos/categoria/${idCategoria}` 
                : '/productos'; // Ruta para obtener todos los productos si no hay categoría
            const response = await api.get(endpoint);
            return response.data;
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error);
            throw error; // Lanza el error
        }
    }
};

export default ProductService;