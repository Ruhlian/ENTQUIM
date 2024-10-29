import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SideBarNavigation.css'; 
import Images from '../../utils/Images/Images';

const SideBarNavigation = ({ menuNavigation, setActiveSection, user }) => {
  const [selected, setSelected] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    const activeMenuItem = menuNavigation.find(item => 
      (item.paths && item.paths.includes(currentPath)) || 
      item.path === currentPath
    );
    if (activeMenuItem) {
      setSelected(activeMenuItem.name);
      setActiveSection(activeMenuItem.name);
    }
  }, [location.pathname, setActiveSection, menuNavigation]);

  const handleNavigation = (item) => {
    setActiveSection(item.name); 
    setSelected(item.name); 
    const targetPath = item.path || item.paths[0]; // Navega a item.path o a la primera ruta en item.paths si no hay item.path
    navigate(targetPath); 
  };

  return (
    <div className="sidebar-nav-custom">
      <div className="sidebar-navigation-custom__box">
        <ul>
          {menuNavigation.map((item) => (
            <li
              key={item.name}
              onClick={() => handleNavigation(item)}
              className={`sidebar-item-custom ${selected === item.name ? 'active' : ''}`}
            >
              <img
                src={selected === item.name ? item.selectedIcon : item.unselectedIcon}
                alt={`${item.name} icon`}
                className='sidebar-icon-custom'
              />
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-user-custom">
        <div className="user-info-custom">
          <img src={user.avatar || Images.defaultAvatar} alt={user.name || 'User'} className="user-avatar-custom" />
          <div className="user-details-custom">
            <span>{user.name}</span>
            <small>{user.role}</small>
          </div>
          <img src={Images.icons.threepoints} alt='Mas opciones' className='more-options-custom' />
        </div>
      </div>
    </div>
  );
};

export default SideBarNavigation;
