import React, { useState } from "react";
import './AddMethodForm.css';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Typography, Link } from '@mui/material';

const paths = [
  { name: 'Gestión de cuenta', link: '/gestion-cuenta' },
  { name: 'Métodos de Pago', link: '/gestion-cuenta/pagos' },
  { name: 'Añadir Método de Pago', link: '/gestion-cuenta/pagos/nuevo-metodo' }
];

const countries = ["México", "Estados Unidos", "Colombia", "España"]; // Ejemplo de países
const cities = {
  "México": ["Ciudad de México", "Guadalajara", "Monterrey"],
  "Estados Unidos": ["Nueva York", "Los Ángeles", "Chicago"],
  "Colombia": ["Bogotá", "Medellin", "Cali"],
  "España": ["Madrid", "Barcelona", "Valencia"]
};

const AddMethodForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const handleSave = () => {
    if (cardNumber.length !== 16 || expiryDate.length !== 5 || cvc.length < 3 || cardholderName.length < 3) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }
    alert("Método de pago guardado");
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
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            inputProps={{ maxLength: 16 }}
          />

          <Box display="flex" gap={2}>
            <TextField
              label="MM/AA"
              variant="outlined"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/AA"
              style={{ width: '50%' }}
            />
            <TextField
              label="CVC"
              variant="outlined"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              inputProps={{ maxLength: 4 }}
              style={{ width: '50%' }}
            />
          </Box>

          <TextField
            fullWidth
            label="Titular de la tarjeta"
            variant="outlined"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            inputProps={{ maxLength: 30 }}
          />

          <TextField
            fullWidth
            label="Dirección"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            inputProps={{ maxLength: 100 }}
          />

          <Box display="flex" gap={2}>
            <Autocomplete
              options={countries}
              value={country}
              onChange={(e, newValue) => {
                setCountry(newValue);
                setCity(""); // Resetea la ciudad cuando cambie el país
              }}
              renderInput={(params) => (
                <TextField {...params} label="País" variant="outlined" />
              )}
              style={{ width: '50%' }} // Ajuste del ancho
            />

            <Autocomplete
              options={cities[country] || []}
              value={city}
              onChange={(e, newValue) => setCity(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Ciudad" variant="outlined" />
              )}
              disabled={!country} // Deshabilita si no hay un país seleccionado
              style={{ width: '50%' }} // Ajuste del ancho
            />
          </Box>
        </Box>

        <Typography className="terms" variant="body2" mt={2}>
          Si continúas, confirmas que aceptas los <Link href="/terms">Términos del Servicio</Link> de ENTQUIM.
        </Typography>

        <div className="button-group">
          <button type="button" className="cancel__button-add-method" onClick={() => alert("Cancelar")}>Cancelar</button>
          <button type="button" className="save__button-cancel-method" onClick={handleSave}>Guardar</button>
        </div>
      </form>
    </Box>
  );
};

export default AddMethodForm;
