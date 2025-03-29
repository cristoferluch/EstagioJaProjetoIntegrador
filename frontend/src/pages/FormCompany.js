import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import InputMask from 'react-input-mask';

import { useNavigate, useLocation } from 'react-router-dom';

const FormCompany = ({ formData, setFormData, disabledFields, requiredFields }) => {
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Button
                    className="button-ver-vagas"
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/vagas')}
                >
                    Ver vagas
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    name="name"
                    label="Nome"
                    value={formData.nome}
                    onChange={handleChange}
                    disabled={disabledFields.name}
                    fullWidth
                    margin="normal"
                    required={requiredFields.name}
                />
                <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={disabledFields.email}
                    fullWidth
                    margin="normal"
                    required={requiredFields.email}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <InputMask
                    mask="(99) 99999-9999"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={disabledFields.phone}
                >
                    {(inputProps) => (
                        <TextField
                            {...inputProps}
                            name="phone"
                            label="Celular"
                            fullWidth
                            margin="normal"
                            required={requiredFields.phone}
                        />
                    )}
                </InputMask>

                <InputMask
                    mask="99.999.999/9999-99"
                    value={formData.cnpj}
                    onChange={handleChange}
                    disabled={disabledFields.cnpj}
                >
                    {(inputProps) => (
                        <TextField
                            {...inputProps}
                            name="cnpj"
                            label="CNPJ"
                            fullWidth
                            margin="normal"
                            required={requiredFields.cnpj}
                        />
                    )}
                </InputMask>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    name="password"
                    label="Senha"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={disabledFields.password}
                    fullWidth
                    margin="normal"
                    required={requiredFields.password}
                    inputProps={{ minLength: 6 }}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="uf-label">UF</InputLabel>
                    <Select
                        labelId="uf-label"
                        name="state"
                        label="UF"
                        onChange={handleChange}
                        value={formData.state}
                        disabled={disabledFields.state}
                        required={requiredFields.state}
                    >
                        {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                            <MenuItem key={uf} value={uf}>{uf}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <InputMask
                    mask="99999-999"
                    value={formData.postal_code}
                    onChange={handleChange}
                    disabled={disabledFields.postal_code}
                >
                    {(inputProps) => (
                        <TextField
                            {...inputProps}
                            name="postal_code"
                            label="CEP"
                            fullWidth
                            margin="normal"
                            required={requiredFields.postal_code}
                        />
                    )}
                </InputMask>

                <TextField
                    name="city"
                    label="Município"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={disabledFields.city}
                    fullWidth
                    margin="normal"
                    required={requiredFields.city}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    name="street"
                    label="Endereço"
                    value={formData.street}
                    onChange={handleChange}
                    disabled={disabledFields.street}
                    fullWidth
                    margin="normal"
                    required={requiredFields.street}
                />
                <TextField
                    name="district"
                    label="Bairro"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={disabledFields.district}
                    fullWidth
                    margin="normal"
                    required={requiredFields.district}
                />
                <TextField
                    name="number"
                    label="Número"
                    type="number"
                    value={formData.number}
                    onChange={handleChange}
                    disabled={disabledFields.number}
                    fullWidth
                    margin="normal"
                    required={requiredFields.number}
                />
            </Box>
        </>
    );
};

export default FormCompany;
