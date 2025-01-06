import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import zIndex from '@mui/material/styles/zIndex';

function Header() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ background: "#333" }}>
                <Toolbar sx={{ zIndex: 9999 }}>
                    <Typography component={Link} to="/" variant="h6" sx={{ flexGrow: 1, textDecoration: 'none', color: '#fff',  fontWeight: 'bold' }}>
                        EstágioJá
                    </Typography>

                    <Button component={Link} to="/login" variant="outlined" color="inherit">Entrar</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );

}

export default Header;
