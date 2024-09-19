import React from 'react';
import './Header.css';
import Button from '@mui/material/Button';

function Header() {
  return (
    <header className="header">
      <a href="https://twitter.com/Dave_Conner" class="btn btn-1">
      <svg>
        <rect x="0" y="0" fill="none" width="100%" height="100%"/>
      </svg>
     Entrar
    </a>
    </header>
  );
}

export default Header;
