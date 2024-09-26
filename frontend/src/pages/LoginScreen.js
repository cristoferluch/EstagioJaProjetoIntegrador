import * as React from 'react';
import Box from '@mui/material/Box';
import './LoginScreen.css';
import TextField from '@mui/material/TextField';

export default function BasicTextFields() {
  return (
    <Box
      component="form"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      noValidate
      autoComplete="off"
    >
      <div className="input-container">
        <TextField 
          id="outlined-basic" 
          label="E-mail" 
          variant="outlined" 
          sx={{ width: '300px' }} // Defina a largura desejada
        />
        <TextField
          required
          id="outlined-required"
          label="Senha"
          defaultValue=""
          sx={{ width: '300px' }} // Defina a largura desejada
        />
      </div>
    </Box>
  );
}
