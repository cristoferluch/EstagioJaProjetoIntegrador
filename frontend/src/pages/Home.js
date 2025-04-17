import React from 'react';
import './Home.css';
import Box from '@mui/material/Box';
import image from '../assets/banner.png';
import image1 from '../assets/programerPic.png';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import '@fontsource/roboto/400.css';

function Home() {

    return (

        <Box // TUDO MENOS DIV BANNER
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'absolute',
                zIndex: 0,
                width: '100%',
            }}>

            <Box // DIV QUE CONTEM BANNER, FOTO E TEXTO
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    backgroundColor:'red'
                }}
            >
                <img src={image} alt="Banner" style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }} />

                <Box // DIV QUE CONTEM FOTO E TEXTO
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        
                    }}
                >
                    <Box sx={{ // Container da imagem e texto
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70%',
                        
                    }}>
                        <img src={image1} alt="Programador" style={{
                            height: '200px',
                            width: '200px',
                            marginRight: '40px',
                        }} />
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 'bold',
                                color: 'black',
                                fontSize: '35px',
                                fontFamily: 'Special Gothic Expanded One',
                                textAlign: 'center'
                            }}
                        >
                            AS MELHORES VAGAS ESTÃO AQUI!
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ // DIV BARRA COM FILTROS
                background: 'white',
                width: '50%',
                borderRadius: '20px',
                position: 'absolute',
                boxShadow: '0px 11px 19px -3px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
                top:'78%'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: '10px',
                    flexWrap: 'wrap',
                }}>
                    <TextField label="Vaga" variant="outlined" />
                    <TextField label="Vaga" variant="outlined" />
                    <TextField label="Vaga" variant="outlined" />
                    <TextField label="Vaga" variant="outlined" />
                </Box>
            </Box>
        </Box>
    )
}
export default Home;
