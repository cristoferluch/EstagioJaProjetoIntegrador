import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import './LoginScreen.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const BlinkingText = () => {
  const [visibleText, setVisibleText] = useState('estagio');

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setVisibleText('ja');
    }, 2000);

    const timeout2 = setTimeout(() => {
      setVisibleText('estagio');
    }, 4000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [visibleText]);

  return (
    <Box className="blinking-text">
      <h1 className={visibleText === 'estagio' ? 'visible' : ''}>Estágio</h1>
      <h1 className={visibleText === 'ja' ? 'visible' : ''}>Já</h1>
    </Box>
  );
};

export default function BasicTextFields() {
  return (
    <Box
      sx={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}
    >
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BlinkingText />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <h2 style={{ marginBottom: '20px', color: 'black' }}>Login</h2>
        <div className="input-container">
          <TextField 
            id="outlined-basic" 
            label="E-mail" 
            variant="outlined" 
            InputLabelProps={{
              sx: { 
                color: 'black',
                '&.Mui-focused': {
                  color: 'black',
                },
              },
            }}
            sx={{ 
              width: '300px',
              backgroundColor: 'transparent',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'black',
                },
                '&:hover fieldset': {
                  borderColor: 'gray',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'black',
                },
              },
            }}
          />
          <TextField
            required
            id="outlined-required"
            label="Senha"
            defaultValue=""
            InputLabelProps={{
              sx: { 
                color: 'black',
                '&.Mui-focused': {
                  color: 'black',
                },
              },
            }}
            sx={{ 
              width: '300px', 
              backgroundColor: 'transparent',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'black',
                },
                '&:hover fieldset': {
                  borderColor: 'gray',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'black',
                },
              },
            }} 
          />
        </div>
        <Button 
          variant="contained" 
          sx={{ width: '200px', backgroundColor: 'black', color: 'white', marginTop: '16px' }}
        >
          Entrar
        </Button>
        <Button 
          variant="outlined" 
          sx={{ width: '200px', borderColor: 'black', color: 'black', marginTop: '8px' }}
        >
          Cadastrar
        </Button>
      </Box>
    </Box>
  );
}
