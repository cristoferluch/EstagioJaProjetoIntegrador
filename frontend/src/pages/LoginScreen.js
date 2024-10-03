import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './LoginScreen.css';

const TypingText = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
      <h1 id="esquerda">Estágio</h1>
      <h1 id="direita">Já</h1>
    </Box>
  );
};

export default function BasicTextFields() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}>
      <Box
        sx={{
          flex: 0.3, // 30% para a esquerda
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TypingText />
      </Box>

      <Box
        sx={{
          flex: 0.7, // 70% para a direita
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