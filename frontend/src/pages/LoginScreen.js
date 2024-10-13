import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import './LoginScreen.css';
import image from '../assets/login.gif';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import {FormControlLabel} from "@mui/material";

const LoginForm = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        password: '',
        isCompany: false,
    });

    const handleRegisterClick = () => {
        
        if (!formData.isCompany) {
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
            },
            willClose: () => {
                navigate('/user');
            }
        });

        try {
            let urlRequest = formData.isCompany === false ? 'http://localhost:8080/auth/login/user' : 'http://localhost:8080/auth/login/company';

            const response = await fetch(urlRequest, {
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
                    text: resposta.message,
                });
            } else {
                Toast.fire({
                    icon: "success",
                    title: formData.isCompany === false ? "Usuário logado com sucesso!" : "Empresa logado com sucesso!",
                });
                
                localStorage.setItem("token", resposta.token);
                localStorage.setItem("id", resposta.id);
                navigate('/user');
            }

        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (

        <Box id="container" sx={{ display: 'flex', gap: 5 }}>

            <Box id="div_esquerda">

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <h1 id="esquerda">Estágio</h1>
                    <h1 id="direita">Já</h1>
                </Box>
                <img img src={image} fullWidth ></img>

            </Box>

            <form onSubmit={handleSubmit}>

                <h2>Login</h2>

                <TextField name="email" label="E-mail" value={formData.email} onChange={handleChange} fullWidth margin="normal" required />
                <TextField type="password" name="password" label="Senha" value={formData.password} onChange={handleChange} fullWidth margin="normal" required />
                <FormControlLabel control={<Switch name="isCompany" checked={formData.isCompany} onChange={(e) => setFormData({ ...formData, isCompany: e.target.checked })} />} label="É uma empresa"/>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button type="submit" variant="contained" sx={{ width: '200px', backgroundColor: 'black', color: 'white', marginTop: '16px' }}>Entrar</Button>
                    <Button variant="outlined" sx={{ width: '200px', borderColor: 'black', color: 'black', marginTop: '16px' }} onClick={handleRegisterClick}>Cadastrar</Button>
                </Box>
            </form>
        </Box>

    );
}

export default LoginForm;
