import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import image from '../assets/register.gif';

import { useNavigate } from 'react-router-dom';
import FormUser from './FormUser';

const RegisterForm = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        sobrenome: '',
        email: '',
        senha: '',
        celular: '',
        cpf: '',
        cep: '',
        uf: '',
        municipio: '',
        endereco: '',
        bairro: '',
        numero: '',
        genero: '',
        dataNascimento: ''
    });

    const disabledFields = {
        nome: false,
        sobrenome: false,
        email: false,
        senha: false,
        celular: false,
        cpf: false,
        cep: false,
        uf: false,
        municipio: false,
        endereco: false,
        bairro: false,
        numero: false,
        genero: false,
        dataNascimento: false
    };

    const requiredFields = {
        nome: true,
        sobrenome: true,
        email: true,
        senha: true,
        celular: true,
        cpf: true,
        cep: true,
        uf: true,
        municipio: true,
        endereco: true,
        bairro: true,
        numero: true,
        genero: true,
        dataNascimento: true
    }

    const handleRegisterClick = () => {
        navigate('/login');
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
                navigate('/login', { state: { email: formData.email } });
            }
        });

        try {
            const response = await fetch('http://localhost:8080/auth/register/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const resposta = await response.json();

            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: resposta.message,
                });
            } else {
                Toast.fire({
                    icon: "success",
                    title: "Usuário criado com sucesso!",
                });
            }

        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (
        <Box id="container" sx={{ display: 'flex', gap: 5 }}>


            <img src={image} style={{ width: '100%', height: 'auto' }} ></img>


            <form onSubmit={handleSubmit}>
                <h2>Cadastro</h2>

                <FormUser formData={formData} setFormData={setFormData} disabledFields={disabledFields} requiredFields={requiredFields} />

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button type="submit" variant="outlined" fullWidth sx={{ backgroundColor: '#333', color: 'white' }}>Cadastrar</Button>
                    <Button variant="outlined" sx={{ width: '200px', borderColor: '#333', color: '#333' }} onClick={handleRegisterClick}>Voltar</Button>
                </Box>
            </form>
        </Box>


    );
};

export default RegisterForm;
