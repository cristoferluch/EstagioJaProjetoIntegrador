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
        name: '',
        last_name: '',
        email: '',
        password: '',
        phone: '',
        cpf: '',
        postal_code: '',
        state: '',
        city: '',
        street: '',
        district: '',
        number: '',
        gender: '',
        birth_date: ''
    });

    const disabledFields = {
        name: false,
        last_name: false,
        email: false,
        password: false,
        phone: false,
        cpf: false,
        postal_code: false,
        state: false,
        city: false,
        street: false,
        district: false,
        number: false,
        gender: false,
        birth_date: false
    };

    const requiredFields = {
        name: true,
        last_name: true,
        email: true,
        password: true,
        phone: true,
        cpf: true,
        postal_code: true,
        state: true,
        city: true,
        street: true,
        district: true,
        number: true,
        gender: true,
        birth_date: true
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
            const response = await fetch('http://localhost:8080/api/user', {
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

                <Box sx={{ display: 'flex', gap: 1, marginBottom: '8px', marginTop: '8px' }}>
                    <Button type="submit" variant="outlined" fullWidth sx={{ backgroundColor: '#333', color: 'white' }}>Cadastrar</Button>
                    <Button variant="outlined" sx={{ width: '200px', borderColor: '#333', color: '#333' }} onClick={handleRegisterClick}>Voltar</Button>
                </Box>
            </form>
        </Box>


    );
};

export default RegisterForm;
