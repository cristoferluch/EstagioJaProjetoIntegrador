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
import './RegisterCompany.css';
import { useNavigate } from 'react-router-dom';

const RegisterCompany = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        celular: '',
        cnpj: '',
        senha: '',
        uf: '',
        municipio: '',
        endereco: '',
        bairro: '',
        numero: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleRegisterClick = () => {
        navigate('/TipoUsuario');
    };

    const handleCepBlur = async () => {
        const { cep } = formData;

        const cepLocal = cep.replace("-", "");

        if (cepLocal.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cepLocal}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setFormData((prevData) => ({
                        ...prevData,
                        endereco: data.logradouro,
                        bairro: data.bairro,
                        municipio: data.localidade,
                        uf: data.uf,
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
            }
        });

        try {
            const response = await fetch('http://localhost:8080/auth/register', {
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
            <img src={image} alt="register-gif"></img>

            <form onSubmit={handleSubmit}>
                <h2>Cadastro de Empresa</h2>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField name="nome" label="Nome" value={formData.nome} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" required />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <InputMask mask="(99) 99999-9999" value={formData.celular} onChange={handleChange}>
                        {(inputProps) => <TextField {...inputProps} name="celular" label="Celular" fullWidth margin="normal" required />}
                    </InputMask>
                    <InputMask mask="99.999.999/9999-99" value={formData.cnpj} onChange={handleChange}>
                        {(inputProps) => <TextField {...inputProps} name="cnpj" label="CNPJ" fullWidth margin="normal" required />}
                    </InputMask>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField name="senha" label="Senha" type="password" value={formData.senha} onChange={handleChange} fullWidth margin="normal" required inputProps={{ minLength: 6 }} />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="uf-label">UF</InputLabel>
                        <Select labelId="uf-label" id="uf-select" name="uf" label="UF" onChange={handleChange} value={formData.uf} required>
                            {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                                <MenuItem key={uf} value={uf}>{uf}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField name="municipio" label="Município" value={formData.municipio} onChange={handleChange} fullWidth margin="normal" required />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField name="bairro" label="Bairro" value={formData.bairro} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="endereco" label="Endereço" value={formData.endereco} onChange={handleChange} fullWidth margin="normal" required />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField name="numero" label="Número" type="number" value={formData.numero} onChange={handleChange} fullWidth margin="normal" inputProps={{ min: 1 }} required />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button type="submit" variant="outlined" fullWidth sx={{ backgroundColor: 'black', color: 'white' }}>Cadastrar</Button>
                    <Button variant="outlined" sx={{ width: '200px', borderColor: 'black', color: 'black' }} onClick={handleRegisterClick}>Voltar</Button>
                </Box>
            </form>
        </Box>
    );
};

export default RegisterCompany;
