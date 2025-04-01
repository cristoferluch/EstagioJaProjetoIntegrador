import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import './Global.css';
import image from '../assets/login.gif';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormControlLabel } from "@mui/material";

const LoginForm = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        password: '',
        is_company: false,
    });

    const handleRegisterClick = () => {

        if (!formData.is_company) {
            navigate('/cadastro');
        } else {
            navigate('/cadastroEmpresa');
        }

    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });

        try {
           
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const resposta = await response.json();
            console.log(resposta)
            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: resposta.error,
                });
            } else {
                Toast.fire({
                    icon: "success",
                    title: formData.is_company === false ? "Usuário logado com sucesso!" : "Empresa logado com sucesso!",
                });

                localStorage.setItem("token", resposta.token);
                localStorage.setItem("id", resposta.id);
     
                navigate('/');
            }

        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (
        <Box id="container" sx={{ display: 'flex', gap: 1 }}>
            <img img src={image} style={{ width: '100%', height: 'auto' }} ></img>

            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>

                <h2>Entrar</h2>

                <TextField
                    name="email"
                    label="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth margin="normal"
                    required
                    sx={{ width: '300px' }}
                />
                <TextField
                    type="password"
                    name="password"
                    label="Senha"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={{ width: '300px' }}
                />
                <FormControlLabel
                    control={<Switch
                        name="is_company"
                        checked={formData.is_company}
                        onChange={(e) => setFormData({ ...formData, is_company: e.target.checked })} />}
                    label="É uma empresa"
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Button type="submit" variant="contained" sx={{ width: '150px', backgroundColor: '#333', color: 'white', marginTop: '16px' }}>Entrar</Button>
                    <Button variant="outlined" sx={{ width: '150px', borderColor: '#333', color: '#333', marginTop: '16px' }} onClick={handleRegisterClick}>Cadastrar</Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Button to="/" component={Link} variant="outlined" sx={{ width: '150px', borderColor: '#333', color: '#333', marginTop: '16px' }}>Voltar</Button>
                </Box>
            </form>
        </Box>


    );
}

export default LoginForm;
