import React, { useState, useEffect, useContext } from "react";
import './Account.css';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import InfoCard from "../../components/InfoCard/InfoCard";
import TextField from '@mui/material/TextField';
import VerifyPassword from "../../components/VerifyPassword/VerifyPassword";
import { AuthContext } from "../../context/AuthContext";

const AccountInfo = () => {
  const paths = [
    { name: 'Gestión de cuenta', link: '/gestion-cuenta' },
    { name: 'Información Personal', link: '/mi-cuenta' }
  ];

  const { user, setUser } = useContext(AuthContext);

  const [formValues, setFormValues] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    correo: "",
    telefono: "",
    direccion: ""
  });

  const [initialValues, setInitialValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      const values = {
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        fechaNacimiento: user.fecha_nacimiento ? user.fecha_nacimiento.split('T')[0] : "",
        correo: user.correo || "",
        telefono: user.telefono || "",
        direccion: user.direccion || ""
      };
      setFormValues(values);
      setInitialValues(values);
    }
  }, [user]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === "nombre" || name === "apellido") {
      filteredValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, ""); // Solo letras y espacios
    } else if (name === "telefono") {
      filteredValue = value.replace(/[^0-9]/g, ""); // Solo números
    } else if (name === "direccion") {
      if (value.length > 100) {
        filteredValue = value.substring(0, 100); // Máximo 100 caracteres
      }
    }

    if (name === "nombre" || name === "apellido") {
      filteredValue = filteredValue.substring(0, 30); // Máximo 30 caracteres
    } else if (name === "telefono") {
      filteredValue = filteredValue.substring(0, 10); // Máximo 10 caracteres
    }

    setFormValues((prevValues) => ({ ...prevValues, [name]: filteredValue }));
  };

  const handleUpdateData = async () => {
    try {
      const token = user?.token || localStorage.getItem("token");
      const updateResponse = await fetch("http://localhost:3002/api/usuarios/actualizar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });

      if (updateResponse.ok) {
        const updatedUser = await updateResponse.json();
        setUser(updatedUser);
        alert("Datos actualizados con éxito.");
        setIsVerifyingPassword(false);
        window.location.reload();
      } else {
        alert("Error al actualizar los datos.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al intentar actualizar los datos.");
    }
  };

  const isFormModified = () => {
    return Object.keys(formValues).some(key => formValues[key] !== initialValues[key]);
  };

  return (
    <div className="account-info">
      <Breadcrumbs paths={paths} />

      <div className="account-info__cards-container">
        <InfoCard
          title={isVerifyingPassword ? "Confirma tu contraseña" : "Tu Información"}
          actions={
            isVerifyingPassword ? null : (
              isFormModified() && (
                <button className="save-btn" onClick={() => setIsVerifyingPassword(true)}>Siguiente</button>
              )
            )
          }
        >
          {isVerifyingPassword ? (
            <VerifyPassword
              onCancel={() => setIsVerifyingPassword(false)}
              onConfirm={handleUpdateData}
              userToken={user?.token || localStorage.getItem("token")}
            />
          ) : (
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
                  onInput={handleInput}
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
                  onInput={handleInput}
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
                  InputLabelProps={{ shrink: true }}
                  disabled={true}
                />
              </div>
              <div className="account-form-group">
                <TextField
                  id="outlined-correo"
                  label="Correo Electrónico"
                  variant="outlined"
                  size="small"
                  margin="dense"
                  name="correo"
                  value={formValues.correo}
                  disabled={true}
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
                  onInput={handleInput}
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
                  onInput={handleInput}
                  error={Boolean(errors.direccion)}
                  helperText={errors.direccion}
                />
              </div>
            </div>
          )}
        </InfoCard>
      </div>
    </div>
  );
};

export default AccountInfo;
