import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function Header() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        navigate('/');
    };

    let button;
    if (localStorage.getItem('token')) {
        button = <Button onClick={handleLogout} variant="outlined" color="inherit">Deslogar</Button>;
    } else {
        button = <Button component={Link} to="/login" variant="outlined" color="inherit">Entrar</Button>;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ background: "#333" }}>
                <Toolbar sx={{ zIndex: 9999 }}>
                    <Typography component={Link} to="/" variant="h6" sx={{ flexGrow: 1, textDecoration: 'none', color: '#fff', fontWeight: 'bold' }}>
                        EstágioJá
                    </Typography>

                    {button}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
export default Header;
