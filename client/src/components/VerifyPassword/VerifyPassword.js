import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Images from "../../utils/Images/Images";
import "./VerifyPassword.css"; // Asegúrate de importar el archivo CSS

const VerifyPassword = ({ onCancel, onConfirm, userToken }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPassword = async () => {
    try {
      if (!userToken) {
        alert("No se ha encontrado el token de autenticación.");
        return;
      }

      const passwordVerificationResponse = await fetch(
        "http://localhost:3002/api/usuarios/verificar-contrasena",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      if (passwordVerificationResponse.ok) {
        onConfirm(); // Llama a la función de confirmación proporcionada
      } else {
        alert("Contraseña incorrecta.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al intentar verificar la contraseña.");
    }
  };

  return (
    <div className="verify-password">
      <div className="account-form-group">
        <TextField
          id="outlined-password"
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          size="small"
          margin="dense"
          value={password}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleShowPassword} edge="end">
                  <img
                    src={showPassword ? Images.icons.visibilityoff : Images.icons.visibility}
                    alt="toggle visibility"
                    className="account-visibility-icon"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className="verify-password__actions">
        <button className="cancel-btn" onClick={onCancel}>
          Cancelar
        </button>
        <button className="save-btn" onClick={handleConfirmPassword} disabled={!password}>
          Guardar
        </button>
      </div>
    </div>
  );
};

export default VerifyPassword;
