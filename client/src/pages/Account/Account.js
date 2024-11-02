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
  const initialValues = {
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    fechaNacimiento: user?.fecha_nacimiento ? user.fecha_nacimiento.split('T')[0] : "",
    correo: user?.correo || "",
    telefono: user?.telefono || "",
    direccion: user?.direccion || ""
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showActionsBasicInfo, setShowActionsBasicInfo] = useState(false);
  const [showActionsContactInfo, setShowActionsContactInfo] = useState(false);

  useEffect(() => {
    setFormValues(initialValues);
  }, [user]);

  const handleSectionChange = (section) => {
    const hasChanges = Object.keys(formValues).some(
      (key) => formValues[key] !== initialValues[key]
    );
    if (section === "basicInfo") {
      setShowActionsBasicInfo(hasChanges);
    } else if (section === "contactInfo") {
      setShowActionsContactInfo(hasChanges);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const today = new Date();
    const currentYear = today.getFullYear();

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

    // Llama a handleSectionChange para actualizar el estado showActions por sección
    if (["nombre", "apellido", "fechaNacimiento"].includes(name)) {
      handleSectionChange("basicInfo");
    } else if (["correo", "telefono", "direccion"].includes(name)) {
      handleSectionChange("contactInfo");
    }
  };

  const handleInput = (e, pattern) => {
    if (!new RegExp(pattern).test(e.target.value) && e.nativeEvent.inputType !== "deleteContentBackward") {
      e.target.value = e.target.value.slice(0, -1);
    }
  };

  const handleCancel = (section) => {
    // Restaura los valores iniciales y oculta los botones de acción
    setFormValues(initialValues);
    if (section === "basicInfo") {
      setShowActionsBasicInfo(false);
    } else if (section === "contactInfo") {
      setShowActionsContactInfo(false);
    }
  };

  return (
    <div className="account-info">
      <Breadcrumbs paths={paths} />

      <div className="account-info__cards-container">
        <InfoCard
          title="Información Básica"
          actions={
            showActionsBasicInfo && (
              <>
                <button className="cancel-btn" onClick={() => handleCancel("basicInfo")}>Cancelar</button>
                <button className="save-btn" disabled={Object.values(errors).some(error => error !== "")}>Guardar</button>
              </>
            )
          }
        >
          <div className="account-form-section">
            <div className="account-form-group">
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
            <div className="account-form-group">
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
            <div className="account-form-group">
              <TextField
                id="outlined-fecha-nacimiento"
                label="Fecha de Nacimiento"
                type="date"
                variant="outlined"
                size="small"
                margin="dense"
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
          actions={
            showActionsContactInfo && (
              <>
                <button className="cancel-btn" onClick={() => handleCancel("contactInfo")}>Cancelar</button>
                <button className="save-btn" disabled={Object.values(errors).some(error => error !== "")}>Guardar</button>
              </>
            )
          }
        >
          <div className="form-section">
            <div className="account-form-group">
              <TextField 
                id="outlined-correo" 
                label="Correo Electrónico" 
                variant="outlined" 
                size="small"
                margin="dense"
                name="correo"
                value={formValues.correo}
                onChange={handleChange}
                inputProps={{ maxLength: 50, readOnly: true }}
                error={Boolean(errors.correo)}
                helperText={errors.correo}
                onFocus={(e) => e.target.blur()}
              />
            </div>
            <div className="account-form-group">
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
            <div className="account-form-group">
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
