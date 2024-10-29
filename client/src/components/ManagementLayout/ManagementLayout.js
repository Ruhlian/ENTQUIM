import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderManagement from '../HeaderManagement/HeaderManagement';
import SideBarNavigation from '../SideBarNavigation/SideBarNavigation';
import Images from '../../utils/Images/Images';

const ManagementLayout = ({ children }) => {
  const location = useLocation();
  
  const accountMenu = [
    { 
      name: 'Mi cuenta', 
      paths: ['/gestion-cuenta/mi-cuenta', '/gestion-cuenta'], 
      selectedIcon: Images.icons.personselected, 
      unselectedIcon: Images.icons.personunselected 
    },
    { 
      name: 'Pagos', 
      path: '/gestion-cuenta/pagos', 
      selectedIcon: Images.icons.paymentsselected, 
      unselectedIcon: Images.icons.paymentsunselected 
    },
  ];
  
  const getInitialSection = () => {
    const activeMenuItem = accountMenu.find(item => 
      (item.paths && item.paths.includes(location.pathname)) || 
      item.path === location.pathname
    );
    return activeMenuItem ? activeMenuItem.name : 'Mi cuenta';
  };
  
  const [activeSection, setActiveSection] = useState(getInitialSection);
  
  useEffect(() => {
    setActiveSection(getInitialSection());
  }, [location.pathname]);

  return (
    <div>
      <HeaderManagement />
      <SideBarNavigation 
        menuNavigation={accountMenu}
        setActiveSection={setActiveSection}
        activeSection={activeSection}
        user={{ name: 'Joan Fontecha', role: 'Administrador', avatar: Images.icons.personselected }}
      />
      {children}
    </div>
  );
};

export default ManagementLayout;
