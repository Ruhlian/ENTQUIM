import React from 'react';
import './Configuration.css';
import HeaderM from '../../../componentes/Management/Header/HeaderM';
import SideBarNav from '../../../componentes/Management/SideBarNav/SideBarNav';
import Navegation from '../../../componentes/Management/Navegation/Navegation';

const Configuration = () => {
  return (
    <div className="configuration-container">
      <HeaderM />
      <Navegation />
      <SideBarNav />

      <div className="configuration-content">
        <h1>Configuración del Sistema</h1>
        <div className="config-options">
          <div className="config-card">
            <h3>Gestión de Roles</h3>
            <p>Administra los roles de los usuarios del sistema.</p>
            <button>Administrar</button>
          </div>
          <div className="config-card">
            <h3>Configuración General</h3>
            <p>Ajusta las configuraciones generales del sistema.</p>
            <button>Editar</button>
          </div>
          <div className="config-card">
            <h3>Notificaciones</h3>
            <p>Configura cómo deseas recibir notificaciones.</p>
            <button>Configurar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuration;
