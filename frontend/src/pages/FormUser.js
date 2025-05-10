import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import InputMask from 'react-input-mask';
import { HandleCepBlur } from '../utils/CepUtils';
import Button from "@mui/material/Button";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const FormUser = ({ formData, setFormData, disabledFields, requiredFields }) => {
    const navigate = useNavigate();

    const handleCepBlur = (event) => {
        const cep = event.target.value;
        console.log(cep)
        HandleCepBlur(cep, setFormData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'number' || name === 'gender') {
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

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

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

        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', 'user');

        const token = localStorage.getItem("token");

        try {
            const response = await fetch('http://localhost:8080/api/user/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const resposta = await response.json();

            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: resposta.error,
                });
            } else {
                Toast.fire({
                    icon: "success",
                    title: "Envio do currículo com sucesso!",
                });
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const BotaoCurriculo = () => {
        if (localStorage.getItem("token") != null) {
            return (
                <>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            component="label"
                            sx={{ marginBottom: '8px', marginTop: '8px' }}
                        >
                            Currículo
                            <input
                                type="file"
                                hidden
                                onChange={handleFileUpload}
                            />
                        </Button>
                    </Box>
                </>
            );
        }

        return ('');
    };

    return (
        <>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField name="name" label="Nome" value={formData.name} onChange={handleChange} disabled={disabledFields.name} fullWidth margin="normal" required />
                <TextField name="last_name" label="Sobrenome" value={formData.last_name} onChange={handleChange} disabled={disabledFields.last_name} fullWidth margin="normal" required />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} disabled={disabledFields.email} fullWidth margin="normal" required />
                <TextField name="birth_date" label="Data de Nascimento" type="date" value={formData.birth_date} onChange={handleChange} disabled={disabledFields.birth_date} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField name="password" label="Senha" type="password" value={formData.password} onChange={handleChange} disabled={disabledFields.password} fullWidth margin="normal" required={requiredFields.password} inputProps={{ minLength: 6 }} />
                <InputMask mask="(99) 99999-9999" value={formData.phone} onChange={handleChange} disabled={disabledFields.phone}>
                    {(inputProps) => <TextField {...inputProps} name="phone" label="Celular" fullWidth margin="normal" required />}
                </InputMask>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <InputMask mask="999.999.999-99" value={formData.cpf} onChange={handleChange} disabled={disabledFields.cpf}>
                    {(inputProps) => <TextField {...inputProps} name="cpf" label="CPF" fullWidth margin="normal" required />}
                </InputMask>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="demo-simple-select-label">Gênero</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" name="gender" label="Gênero" onChange={handleChange} value={formData.gender} required>
                        <MenuItem value={1}>Masculino</MenuItem>
                        <MenuItem value={2}>Feminino</MenuItem>
                        <MenuItem value={3}>Outro</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <InputMask mask="99999-999" value={formData.postal_code} onChange={handleChange} disabled={disabledFields.postal_code} onBlur={handleCepBlur}>
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
                <TextField name="city" label="Município" value={formData.city} onChange={handleChange} disabled={disabledFields.city} fullWidth margin="normal" required />
                <TextField name="district" label="Bairro" value={formData.district} onChange={handleChange} disabled={disabledFields.district} fullWidth margin="normal" required />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField name="street" label="Endereço" value={formData.street} onChange={handleChange} disabled={disabledFields.street} fullWidth margin="normal" required />
                <TextField name="number" label="Número" type="number" value={formData.number} onChange={handleChange} disabled={disabledFields.number} fullWidth margin="normal" required />
            </Box>

            <BotaoCurriculo />
        </>
    );
};

export default FormUser;
