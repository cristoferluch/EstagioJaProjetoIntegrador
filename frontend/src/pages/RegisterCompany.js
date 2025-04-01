import React, { useState } from 'react';
import InputMask from 'react-input-mask';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import image from '../assets/register.gif';
import { useNavigate } from 'react-router-dom';

const RegisterCompany = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cnpj: '',
        password: '',
        postal_code: '',
        state: '',
        city: '',
        street: '',
        district: '',
        number: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'number' ) {
            const numericValue = parseInt(value, 10);
            setFormData({
                ...formData,
                [name]: isNaN(numericValue) ? '' : numericValue,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleRegisterClick = () => {
        navigate('/login');
    };

    const handleCepBlur = async () => {
        const { postal_code } = formData;

        const cepLocal = postal_code ? postal_code.replace("-", "") : 0;

        if (cepLocal.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cepLocal}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setFormData((prevData) => ({
                        ...prevData,
                        street: data.logradouro,
                        district: data.bairro,
                        city: data.localidade,
                        state: data.uf,
                    }));
                    return true;
                } else {
                    alert('CEP não encontrado');
                    return false;
                }
            } catch (error) {
                console.error('Erro ao buscar o CEP:', error);
                return false;
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isCepValid = await handleCepBlur();
        if (!isCepValid) {
            return;
        }

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
            const response = await fetch('http://localhost:8080/api/company', {
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
                    title: "Empresa registrada com sucesso!",
                });
            }

        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (
        <Box id="container" sx={{ display: 'flex', gap: 5 }}>
            <img src={image} style={{ width: '100%', height: 'auto' }} alt="register-gif"></img>

            <form onSubmit={handleSubmit}>
                <h2>Cadastro de Empresa</h2>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField name="name" label="Nome" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" required />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <InputMask mask="(99) 99999-9999" value={formData.phone} onChange={handleChange}>
                        {(inputProps) => <TextField {...inputProps} name="phone" label="Celular" fullWidth margin="normal" required />}
                    </InputMask>
                    <InputMask mask="99.999.999/9999-99" value={formData.cnpj} onChange={handleChange}>
                        {(inputProps) => <TextField {...inputProps} name="cnpj" label="CNPJ" fullWidth margin="normal" required />}
                    </InputMask>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField name="password" label="Senha" type="password" value={formData.password} onChange={handleChange} fullWidth margin="normal" required inputProps={{ minLength: 6 }} />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <InputMask mask="99999-999" value={formData.postal_code} onChange={handleChange} onBlur={handleCepBlur}>
                        {(inputProps) => <TextField {...inputProps} name="postal_code" label="CEP" fullWidth margin="normal" required />}
                    </InputMask>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="uf-label">UF</InputLabel>
                        <Select labelId="uf-label" id="uf-select" name="state" label="UF" onChange={handleChange} value={formData.state} required>
                            {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                                <MenuItem key={uf} value={uf}>{uf}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField name="city" label="Município" value={formData.city} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="district" label="Bairro" value={formData.district} onChange={handleChange} fullWidth margin="normal" required />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField name="street" label="Endereço" value={formData.street} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="number" label="Número" type="number" value={formData.number} onChange={handleChange} fullWidth margin="normal" inputProps={{ min: 1 }} required />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button type="submit" variant="outlined" fullWidth sx={{ backgroundColor: '#333', color: 'white' }}>Cadastrar</Button>
                    <Button variant="outlined" sx={{ width: '200px', borderColor: '#333', color: '#333' }} onClick={handleRegisterClick}>Voltar</Button>
                </Box>
            </form>
        </Box>
    );
};

export default RegisterCompany;
