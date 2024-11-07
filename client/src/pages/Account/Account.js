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

  const { user, updateUser } = useAuth();

  const [formValues, setFormValues] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    correo: "",
    telefono: "",
    direccion: ""
  });

  const [errors, setErrors] = useState({});
  const [showActionsBasicInfo, setShowActionsBasicInfo] = useState(false);
  const [showActionsContactInfo, setShowActionsContactInfo] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [password, setPassword] = useState("");

  // Sincroniza formValues con el usuario actual al cargar o actualizar el usuario
  useEffect(() => {
    setFormValues({
      nombre: user?.nombre || "",
      apellido: user?.apellido || "",
      fechaNacimiento: user?.fecha_nacimiento ? user.fecha_nacimiento.split('T')[0] : "",
      correo: user?.correo || "",
      telefono: user?.telefono || "",
      direccion: user?.direccion || ""
    });
  }, [user]);

  const handleSectionChange = (section) => {
    const hasChanges = Object.keys(formValues).some(
      (key) => formValues[key] !== (user[key] || "")
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
    setFormValues({
      nombre: user?.nombre || "",
      apellido: user?.apellido || "",
      fechaNacimiento: user?.fecha_nacimiento ? user.fecha_nacimiento.split('T')[0] : "",
      correo: user?.correo || "",
      telefono: user?.telefono || "",
      direccion: user?.direccion || ""
    });
    if (section === "basicInfo") {
      setShowActionsBasicInfo(false);
    } else if (section === "contactInfo") {
      setShowActionsContactInfo(false);
    }
  };

  const handleSave = (section) => {
    setIsVerifyingPassword(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPassword = async () => {
    try {
        const token = user?.token || localStorage.getItem("token");
        if (!token) {
            alert("No se ha encontrado el token de autenticación.");
            return;
        }

        const passwordVerificationResponse = await fetch("http://localhost:3002/api/usuarios/verificar-contrasena", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ password }),
        });

        if (passwordVerificationResponse.ok) {
            const updateResponse = await fetch("http://localhost:3002/api/usuarios/actualizar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formValues),
            });

            if (updateResponse.ok) {
                const updatedUser = await updateResponse.json();
                updateUser(updatedUser);  // Aquí sincronizamos el estado global del usuario

                setFormValues({
                    nombre: updatedUser.nombre || "",
                    apellido: updatedUser.apellido || "",
                    fechaNacimiento: updatedUser.fecha_nacimiento ? updatedUser.fecha_nacimiento.split('T')[0] : "",
                    correo: updatedUser.correo || "",
                    telefono: updatedUser.telefono || "",
                    direccion: updatedUser.direccion || ""
                });

                setIsVerifyingPassword(false);
                setPassword("");
                alert("Datos actualizados con éxito.");
            } else {
                alert("Error al actualizar los datos.");
            }
        } else {
            alert("Contraseña incorrecta.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al intentar actualizar los datos.");
    }
};


  return (
    <div className="account-info">
      <Breadcrumbs paths={paths} />

      <div className="account-info__cards-container">
        <InfoCard
          title={isVerifyingPassword ? "Verificación de Contraseña" : "Información Básica"}
          actions={
            isVerifyingPassword ? (
              <>
                <button className="cancel-btn" onClick={() => setIsVerifyingPassword(false)}>Cancelar</button>
                <button className="save-btn" onClick={handleConfirmPassword} disabled={!password}>Guardar</button>
              </>
            ) : (
              showActionsBasicInfo && (
                <>
                  <button className="cancel-btn" onClick={() => handleCancel("basicInfo")}>Cancelar</button>
                  <button className="save-btn" onClick={() => handleSave("basicInfo")} disabled={Object.values(errors).some(error => error !== "")}>Siguiente</button>
                </>
              )
            )
          }
        >
          {isVerifyingPassword ? (
            <div className="account-form-section">
              <div className="account-form-group">
                <TextField
                  id="outlined-password"
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  size="small"
                  margin="dense"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
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
          )}
        </InfoCard>

        <InfoCard title="Información de Contacto" actions={
          showActionsContactInfo && (
            <>
              <button className="cancel-btn" onClick={() => handleCancel("contactInfo")}>Cancelar</button>
              <button className="save-btn" onClick={() => handleSave("contactInfo")} disabled={Object.values(errors).some(error => error !== "")}>Guardar</button>
            </>
          )
        }>
          <div className="account-form-section">
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
                inputProps={{ maxLength: 50 }}
                error={Boolean(errors.correo)}
                helperText={errors.correo}
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
                onChange={handleChange}
                inputProps={{ maxLength: 15 }}
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
