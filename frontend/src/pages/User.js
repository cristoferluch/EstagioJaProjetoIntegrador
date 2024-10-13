import React, { useState, useEffect  } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import './RegisterScreen.css';
import { useNavigate } from 'react-router-dom';
import FormUser from './FormUser';

const User = () => {
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
        nome: true,
        sobrenome: true,
        email: true,
        senha: false,
        celular: false,
        cpf: true,
        cep: false,
        uf: false,
        municipio: false,
        endereco: false,
        bairro: false,
        numero: false,
        genero: true,
        dataNascimento: true
    };

    const requiredFields = {
        senha: false
    }

    const userId = localStorage.getItem("id");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/auth/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                

                if (!response.ok) {
                    const errorResponse = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro!',
                        text: errorResponse.message,
                    });
                    return;
                }

                const userData = await response.json();
                console.log(userData)
                setFormData(userData);
            } catch (error) {
                console.error('Erro:', error);
            }
        };

        fetchUserData();
    }, [userId]);

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

            const userId = localStorage.getItem("id");
            const token = localStorage.getItem("token"); 

            const response = await fetch(`http://localhost:8080/auth/update/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
                    title: "Usuário Atualizado com sucesso!",
                });
            }

        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (
        <Box id="container" sx={{ display: 'flex', gap: 5 }}>
            <form onSubmit={handleSubmit}>
                <h2>Dados cadastrais</h2>

                <FormUser formData={formData} setFormData={setFormData} disabledFields={disabledFields} requiredFields={requiredFields}/>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button type="submit" variant="outlined" fullWidth sx={{ backgroundColor: 'black', color: 'white' }}>Atualizar</Button>
                </Box>
            </form>
        </Box>
    );
};

export default User;
