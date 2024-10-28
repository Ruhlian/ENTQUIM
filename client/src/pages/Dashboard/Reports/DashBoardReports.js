import React, { useState } from 'react';
import './Reports.css';
import HeaderM from '../../../componentes/Management/Header/HeaderM';
import SideBarNav from '../../../componentes/Management/SideBarNav/SideBarNav';
import Navegation from '../../../componentes/Management/Navegation/Navegation';

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState("Ventas");
  const [timeInterval, setTimeInterval] = useState("Hoy");

  const handleReportCreation = () => {
    // Lógica para generar reporte
    console.log(`Generando reporte de ${selectedReportType} para ${timeInterval}`);
  };

  return (
    <div className="reports-container">
      <HeaderM />
      <Navegation />
      <SideBarNav />

      
    </div>
  );
};

export default Reports;
