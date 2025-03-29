import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import FormCompany from './FormCompany';

const Company = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        cnpj: '',
        senha: '',
        state: '',
        postal_code: '',
        city: '',
        street: '',
        district: '',
        number: '',
    });

    const disabledFields = {
        name: false,
        email: false,
        phone: false,
        cnpj: false,
        password: false,
        state: false,
        postal_code: false,
        city: false,
        street: false,
        district: false,
        number: false,
    };

    const requiredFields = {
        name: true,
        email: true,
        phone: true,
        cnpj: true,
        password: true,
        state: true,
        postal_code: true,
        city: true,
        street: true,
        district: true,
        number: true,
    };

    const companyId = localStorage.getItem("id");

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/api/company/${companyId}`, {
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

                const companyData = await response.json();
                setFormData(companyData);
            } catch (error) {
                console.error('Erro:', error);
            }
        };

        fetchCompanyData();
    }, [companyId]);

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
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:8080/api/company/${companyId}`, {
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
                    title: "Empresa Atualizada com sucesso!",
                });
            }

        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (
        <Box id="container" sx={{ display: 'flex', gap: 5 }}>
            <form onSubmit={handleSubmit}>
                <h2>Dados da Empresa</h2>

                <FormCompany formData={formData} setFormData={setFormData} disabledFields={disabledFields} requiredFields={requiredFields} />

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button type="submit" variant="outlined" fullWidth sx={{ backgroundColor: 'black', color: 'white' }}>Atualizar</Button>
                </Box>
            </form>
        </Box>
    );
};

export default Company;
