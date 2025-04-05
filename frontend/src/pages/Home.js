import React, { Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import Box from '@mui/material/Box';
import image from '../assets/banner.png';
import TextField from '@mui/material/TextField';
import Background from 'three/src/renderers/common/Background.js';
import { Typography } from '@mui/material';
import '@fontsource/roboto/400.css';

function Home() {

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
        }}>
            <img src={image} style={{ height: 'auto', width: '100%' }} />
            <Typography variant="h3" gutterBottom
                sx={{
                    position: 'absolute',
                    right: '5%',
                    fontWeight: 'bold'
                }}>
                O PORTAL DE VAGAS MAIS AMADO DO BRASIL!
            </Typography>


            <Box sx={{
                display: 'flex',
                background: 'white',
                width: '50%',
                padding: '20px',
                position: 'absolute',
                top: '100%',
                transform: 'translateY(-50%)',
                borderRadius: '20px',
                boxShadow: '0px 11px 19px -3px rgba(0,0,0,0.1)'
            }}>
                <TextField id="outlined-basic" label="Vaga" variant="outlined" />
            </Box>
        </Box>

    )
}
export default Home;
