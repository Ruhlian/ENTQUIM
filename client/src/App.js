import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ScrollToTop from './hooks/ScrollToTop/ScrollToTop';
import { ToastContainer } from 'react-toastify'; // Importa ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Asegúrate de importar los estilos de toastify

// Importación de páginas.
import Layout from './components/Layout/Layout';
import ManagementLayout from './components/ManagementLayout/ManagementLayout';
import Home from './pages/Home/Home';
import AboutUs from './pages/Us/AboutUs';
import Products from './pages/Products/Products';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import AllProducts from './pages/AllProducts/AllProducts';
import AccountInfo from './pages/Account/Account';
import Methods from './pages/Methods/Methods';
import AddMethodForm from './pages/AddMethodForm/AddMethodForm';
import CartPage from './pages/CartPage/CartPage'; // Importa CartPage
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <ScrollToTop />
                    {/* Aquí está el ToastContainer que manejará las notificaciones */}
                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

                    <Routes>
                        <Route path='/' exact element={
                            <Layout>
                                <Home />
                            </Layout>
                        } />

                        <Route path='/Nosotros' exact element={
                            <Layout>
                                <AboutUs />
                            </Layout>
                        } />

                        <Route path='/Productos' exact element={
                            <Layout>
                                <Products />
                            </Layout>
                        } />

                        <Route path='/Contacto' exact element={
                            <Layout>
                                <Contact />
                            </Layout>
                        } />

                        <Route path='/Iniciar-Sesion' exact element={
                            <Layout>
                                <Login />
                            </Layout>
                        } />

                        <Route path='/Productos/Todos' exact element={
                            <Layout>
                                <AllProducts />
                            </Layout>
                        } />

                        <Route path='/Carrito' exact element={ // Nueva ruta para CartPage
                            <Layout>
                                <CartPage />
                            </Layout>
                        } />

                        <Route path='/gestion-cuenta' exact element={
                            <ManagementLayout>
                                <AccountInfo />
                            </ManagementLayout>
                        } />

                        <Route path='/gestion-cuenta/mi-cuenta' exact element={
                            <ManagementLayout>
                                <AccountInfo />
                            </ManagementLayout>
                        } />

                        <Route path='/gestion-cuenta/pagos' exact element={
                            <ManagementLayout>
                                <Methods />
                            </ManagementLayout>
                        } />

                        <Route path='/gestion-cuenta/pagos/nuevo-metodo' exact element={
                            <ManagementLayout>
                                <AddMethodForm />
                            </ManagementLayout>
                        } />
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
