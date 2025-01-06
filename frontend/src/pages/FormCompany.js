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
                    name="nome"
                    label="Nome"
                    value={formData.nome}
                    onChange={handleChange}
                    disabled={disabledFields.nome}
                    fullWidth
                    margin="normal"
                    required={requiredFields.nome}
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
                    value={formData.celular}
                    onChange={handleChange}
                    disabled={disabledFields.celular}
                >
                    {(inputProps) => (
                        <TextField
                            {...inputProps}
                            name="celular"
                            label="Celular"
                            fullWidth
                            margin="normal"
                            required={requiredFields.celular}
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
                    name="senha"
                    label="Senha"
                    type="password"
                    value={formData.senha}
                    onChange={handleChange}
                    disabled={disabledFields.senha}
                    fullWidth
                    margin="normal"
                    required={requiredFields.senha}
                    inputProps={{ minLength: 6 }}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="uf-label">UF</InputLabel>
                    <Select
                        labelId="uf-label"
                        name="uf"
                        label="UF"
                        onChange={handleChange}
                        value={formData.uf}
                        disabled={disabledFields.uf}
                        required={requiredFields.uf}
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
                    value={formData.cep}
                    onChange={handleChange}
                    disabled={disabledFields.cep}
                >
                    {(inputProps) => (
                        <TextField
                            {...inputProps}
                            name="cep"
                            label="CEP"
                            fullWidth
                            margin="normal"
                            required={requiredFields.cep}
                        />
                    )}
                </InputMask>

                <TextField
                    name="municipio"
                    label="Município"
                    value={formData.municipio}
                    onChange={handleChange}
                    disabled={disabledFields.municipio}
                    fullWidth
                    margin="normal"
                    required={requiredFields.municipio}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    name="endereco"
                    label="Endereço"
                    value={formData.endereco}
                    onChange={handleChange}
                    disabled={disabledFields.endereco}
                    fullWidth
                    margin="normal"
                    required={requiredFields.endereco}
                />
                <TextField
                    name="bairro"
                    label="Bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    disabled={disabledFields.bairro}
                    fullWidth
                    margin="normal"
                    required={requiredFields.bairro}
                />
                <TextField
                    name="numero"
                    label="Número"
                    type="number"
                    value={formData.numero}
                    onChange={handleChange}
                    disabled={disabledFields.numero}
                    fullWidth
                    margin="normal"
                    required={requiredFields.numero}
                />
            </Box>
        </>
    );
};

export default FormCompany;
