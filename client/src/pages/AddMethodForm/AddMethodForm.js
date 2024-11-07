import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './AddMethodForm.css';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Typography, Link } from '@mui/material';  

import {
  validateCardNumber,
  validateExpiryDate,
  validateCVC,
  validateCardholderName,
  validateAddress,
  validateCountryOrCity
} from "../../utils/formValidations";

const paths = [
  { name: 'Gestión de cuenta', link: '/gestion-cuenta' },
  { name: 'Métodos de Pago', link: '/gestion-cuenta/pagos' },
  { name: 'Añadir Método de Pago', link: '/gestion-cuenta/pagos/nuevo-metodo' }
];

const countries = ["México", "Estados Unidos", "Colombia", "España"];
const cities = {
  "México": ["Ciudad de México", "Guadalajara", "Monterrey"],
  "Estados Unidos": ["Nueva York", "Los Ángeles", "Chicago"],
  "Colombia": ["Bogotá", "Medellin", "Cali"],
  "España": ["Madrid", "Barcelona", "Valencia"]
};

const AddMethodForm = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");


  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(value);
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  const handleCVCChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvc(value);
  };

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "").slice(0, 30);
    setCardholderName(value);
  };

  const handleAddressChange = (e) => {
    const value = e.target.value.slice(0, 100);
    setAddress(value);
  };

  const handleSave = async () => {
    if (
      !validateCardNumber(cardNumber) ||
      !validateExpiryDate(expiryDate) ||
      !validateCVC(cvc) ||
      !validateCardholderName(cardholderName) ||
      !validateAddress(address) ||
      !validateCountryOrCity(country) ||
      !validateCountryOrCity(city)
    ) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    const paymentData = {
      numero_tarjeta: cardNumber,
      nombre_titular: cardholderName,
      mm_aa: expiryDate,
      cvc,
      direccion: address,
      ciudad: city,
      pais: country,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3002/api/metodos-pago", paymentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Método de pago guardado correctamente");
      setCardNumber("");
      setCardholderName("");
      setExpiryDate("");
      setCvc("");
      setAddress("");
      setCountry("");
      setCity("");

      navigate("/gestion-cuenta/pagos");
    } catch (error) {
      console.error("Error al guardar el método de pago:", error);
      alert("Ocurrió un error al guardar el método de pago.");
    }
  };

  return (
    <Box className="add-method-form">
      <Breadcrumbs paths={paths} />
      <form className="AddMethodPayment-form">
        <h2>Añadir tarjeta de crédito o débito</h2>
        
        <Box display="grid" gap={2}>
          <TextField
            fullWidth
            label="Número de la tarjeta"
            variant="outlined"
            size="small"
            value={cardNumber}
            onChange={handleCardNumberChange}
          />

          <Box display="flex" gap={2}>
            <TextField
              label="MM/AA"
              variant="outlined"
              size="small"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              placeholder="MM/AA"
              style={{ width: '50%' }}
            />
            <TextField
              label="CVC"
              variant="outlined"
              size="small"
              value={cvc}
              onChange={handleCVCChange}
              style={{ width: '50%' }}
            />
          </Box>

          <TextField
            fullWidth
            label="Titular de la tarjeta"
            size="small"
            variant="outlined"
            value={cardholderName}
            onChange={handleNameChange}
          />

          <TextField
            fullWidth
            label="Dirección"
            variant="outlined"
            size="small"
            value={address}
            onChange={handleAddressChange}
          />

          <Box display="flex" gap={2}>
            <Autocomplete
              options={countries}
              value={country}
              size="small"
              onChange={(e, newValue) => {
                setCountry(newValue);
                setCity("");
              }}
              renderInput={(params) => (
                <TextField {...params} label="País" variant="outlined" />
              )}
              style={{ width: '50%' }}
            />

            <Autocomplete
              options={cities[country] || []}
              size="small"
              value={city}
              onChange={(e, newValue) => setCity(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Ciudad" variant="outlined" />
              )}
              disabled={!country}
              style={{ width: '50%' }}
            />
          </Box>
        </Box>

        <Typography className="terms" variant="body2" mt={2}>
          Si continúas, confirmas que aceptas los <Link href="/terms">Términos del Servicio</Link> de ENTQUIM.
        </Typography>

        <div className="button-group">
          <button type="button" className="cancel__button-add-method" onClick={() => navigate("/gestion-cuenta/pagos")}>Cancelar</button>
          <button type="button" className="confirm__button-add-method" onClick={handleSave}>Guardar</button>
        </div>
      </form>
    </Box>
  );
};

export default AddMethodForm;