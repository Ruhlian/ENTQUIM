import React, { useState, useEffect } from "react";
import './Account.css';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import InfoCard from "../../components/InfoCard/InfoCard";
import TextField from '@mui/material/TextField';
import { useAuth } from "../../context/AuthContext";

const AccountInfo = () => {
  const paths = [
    { name: 'Gestión de cuenta', link: '/gestion-cuenta' },
    { name: 'Información Personal', link: '/mi-cuenta' }
  ];

  const { user } = useAuth();
  const [formValues, setFormValues] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    correo: "",
    telefono: "",
    direccion: ""
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    correo: "",
    telefono: "",
    direccion: ""
  });

  useEffect(() => {
    // Si existe un usuario, se actualizan los valores del formulario con su información
    if (user) {
      setFormValues({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        fechaNacimiento: user.fechaNacimiento || "",
        correo: user.correo || "",
        telefono: user.telefono || "",
        direccion: user.direccion || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const today = new Date();
    const currentYear = today.getFullYear();

    // Validaciones de fecha de nacimiento
    if (name === "fechaNacimiento") {
      const birthDate = value ? new Date(value) : null;
      if (birthDate && birthDate.getFullYear() > currentYear) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          fechaNacimiento: "El año no puede ser superior al año actual.",
        }));
        return;
      }
    }

    // Actualizar valores del formulario
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    let error = "";
    if (name === "nombre" || name === "apellido") {
      if (/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/.test(value)) {
        error = "Solo se permiten letras y espacios.";
      } else if (value.length > 30) {
        error = "Máximo 30 caracteres.";
      }
    } else if (name === "correo") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Formato de correo inválido.";
      } else if (value.length > 50) {
        error = "Máximo 50 caracteres.";
      }
    } else if (name === "direccion") {
      if (value.length > 100) {
        error = "Máximo 100 caracteres.";
      }
    } else if (name === "fechaNacimiento") {
      const birthDate = value ? new Date(value) : null;

      if (birthDate && birthDate > today) {
        error = "La fecha no puede ser en el futuro.";
      } else if (birthDate && today.getFullYear() - birthDate.getFullYear() > 120) {
        error = "Fecha de nacimiento inválida o poco coherente.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleInput = (e, pattern) => {
    if (!new RegExp(pattern).test(e.target.value) && e.nativeEvent.inputType !== "deleteContentBackward") {
      e.target.value = e.target.value.slice(0, -1);
    }
  };

  return (
    <div className="account-info">
      <Breadcrumbs paths={paths} />

      <div className="account-info__cards-container">
        <InfoCard
          title="Información Básica"
          actions={
            <>
              <button className="cancel-btn">Cancelar</button>
              <button className="save-btn" disabled={Object.values(errors).some(error => error !== "")}>Guardar</button>
            </>
          }
        >
          <div className="form-section">
            <div className="form-group">
              <TextField 
                id="outlined-nombre" 
                label="Nombre" 
                variant="outlined" 
                size="small"
                margin="dense"
                name="nombre"
                value={formValues.nombre}
                onInput={(e) => handleInput(e, "^[A-Za-zÁÉÍÓÚáéíóúñÑ\\s]*$")}
                onChange={handleChange}
                inputProps={{ maxLength: 30 }}
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}
              />
            </div>
            <div className="form-group">
              <TextField 
                id="outlined-apellido" 
                label="Apellido" 
                variant="outlined" 
                size="small"
                margin="dense"
                name="apellido"
                value={formValues.apellido}
                onInput={(e) => handleInput(e, "^[A-Za-zÁÉÍÓÚáéíóúñÑ\\s]*$")}
                onChange={handleChange}
                inputProps={{ maxLength: 30 }}
                error={Boolean(errors.apellido)}
                helperText={errors.apellido}
              />
            </div>
            <div className="form-group">
              <TextField
                id="outlined-fecha-nacimiento"
                label="Fecha de Nacimiento"
                type="date"
                variant="outlined"
                size="small"
                margin="normal"
                name="fechaNacimiento"
                value={formValues.fechaNacimiento}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(errors.fechaNacimiento)}
                helperText={errors.fechaNacimiento}
              />
            </div>
          </div>
        </InfoCard>

        <InfoCard
          title="Información de Contacto"
          actions={null}
        >
          <div className="form-section">
            <div className="form-group">
              <TextField 
                id="outlined-correo" 
                label="Correo Electrónico" 
                variant="outlined" 
                size="small"
                margin="dense"
                name="correo"
                value={formValues.correo}
                onChange={handleChange}
                inputProps={{ maxLength: 50 }}
                error={Boolean(errors.correo)}
                helperText={errors.correo}
              />
            </div>
            <div className="form-group">
              <TextField 
                id="outlined-telefono" 
                label="Teléfono" 
                variant="outlined" 
                size="small"
                margin="dense"
                name="telefono"
                value={formValues.telefono}
                onInput={(e) => handleInput(e, "^[0-9]*$")}
                onChange={handleChange}
                inputProps={{ maxLength: 10 }}
                error={Boolean(errors.telefono)}
                helperText={errors.telefono}
              />
            </div>
            <div className="form-group">
              <TextField 
                id="outlined-direccion" 
                label="Dirección" 
                variant="outlined" 
                size="small"
                margin="dense"
                name="direccion"
                value={formValues.direccion}
                onChange={handleChange}
                inputProps={{ maxLength: 100 }}
                error={Boolean(errors.direccion)}
                helperText={errors.direccion}
              />
            </div>
          </div>
        </InfoCard>
      </div>
    </div>
  );
};

export default AccountInfo;
