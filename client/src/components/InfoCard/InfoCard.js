import React from "react";
import { useAuth } from "../../context/AuthContext";

const InfoCard = ({ title, children, actions }) => {
  const { user } = useAuth(); 
  const roles = {
    1: "Administrador",
    2: "Empleado",
    3: "Cliente",
  };

  return (
    <div
      style={{
        border: "1px solid #1A729A35",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#000", fontWeight: "500" }}>
          {title}
        </h2>
        {/* Mostrar el rol solo si no es "Cliente" */}
        {user?.id_rol !== 3 && (
          <span style={{ fontSize: "0.875rem", color: "#555" }}>
            {roles[user?.id_rol] || ""}
          </span>
        )}
      </div>
      <div style={{ marginBottom: "16px" }}>{children}</div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        {actions}
      </div>
    </div>
  );
};

export default InfoCard;
