import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ScrollToTop from './hooks/ScrollToTop/ScrollToTop';
import { ToastContainer } from 'react-toastify'; // Importa ToastContainer

// Importación de páginas.
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import AboutUs from './pages/Us/AboutUs';
import Products from './pages/Products/Products';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import AllProducts from './pages/AllProducts/AllProducts';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ScrollToTop />
                <ToastContainer /> {/* Agrega ToastContainer aquí */}
                <Routes>
                    <Route path='/' exact element={
                        <>
                            <Layout>
                                <Home />
                            </Layout>
                        </>
                    } />

                    <Route path='/Nosotros' exact element={
                        <>
                            <Layout>
                                <AboutUs />
                            </Layout>
                        </>
                    } />

                    <Route path='/Productos' exact element={
                        <>
                            <Layout>
                                <Products />
                            </Layout>
                        </>
                    } />

                    <Route path='/Contacto' exact element={
                        <>
                            <Layout>
                                <Contact />
                            </Layout>
                        </>
                    } />

                    <Route path='/Iniciar-Sesion' exact element={
                        <>
                            <Layout>
                                <Login />
                            </Layout>
                        </>
                    } />

                    <Route path='/Productos/Todos' exact element={
                        <>
                            <Layout>
                                <AllProducts />
                            </Layout>
                        </>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
