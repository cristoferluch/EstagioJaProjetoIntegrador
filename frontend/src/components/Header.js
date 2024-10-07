import React from 'react';
import './Header.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <><header className="header">
      <Link to="/login" className="btn btn-1">
        <svg>
          <rect x="0" y="0" fill="none" width="100%" height="100%" />
        </svg>
        Entrar
      </Link>
    </header>
    <header className="header">
        <Link to="/TipoUsuario" className="btn btn-2">
          <svg>
            <rect x="0" y="0" fill="none" width="100%" height="100%" />
          </svg>
          Cadastrar
        </Link>
      </header></>

  );
}

export default Header;
