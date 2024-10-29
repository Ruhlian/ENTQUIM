import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ paths }) => {

    const breadcrumbStyle = {
        padding: '15px 0',
        fontSize: '17px'
    }


  return (
    <nav aria-label="breadcrumb" style={breadcrumbStyle}>
      <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}>
        {paths.map((path, index) => (
          <li key={index} style={{ marginRight: index < paths.length - 1 ? '8px' : '0' }}>
            {index < paths.length - 1 ? (
              <>
                <Link to={path.link} style={{ color: '#7B8496', textDecoration: 'none' }}>
                  {path.name}
                </Link>
                <span style={{ margin: '0 8px' }}>{'>'}</span>
              </>
            ) : (
              <span style={{ color: '#1A729A' }}>{path.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
