
import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import './CreateVaga.css';
import { useNavigate } from 'react-router-dom';

const CreateVaga = ({ formData, setFormData, disabledFields, requiredFields }) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const safeFormData = formData || {};

    return (
        <>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Button
                    className="button-ver-vagas2"
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/vagas')}
                >
                    Ver Vagas
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    name="titulo"
                    label="Título"
                    value={safeFormData.titulo || ''}
                    onChange={handleChange}
                    disabled={disabledFields.titulo}
                    fullWidth
                    margin="normal"
                    required={requiredFields.titulo}
                />
                <TextField
                    name="descricao"
                    label="Descrição"
                    value={safeFormData.descricao || ''}
                    onChange={handleChange}
                    disabled={disabledFields.descricao}
                    fullWidth
                    margin="normal"
                    required={requiredFields.descricao}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    name="salario"
                    label="Salário"
                    type="number"
                    value={safeFormData.salario || ''}
                    onChange={handleChange}
                    disabled={disabledFields.salario}
                    fullWidth
                    margin="normal"
                    required={requiredFields.salario}
                />
                <TextField
                    name="beneficios"
                    label="Benefícios"
                    value={safeFormData.beneficios || ''}
                    onChange={handleChange}
                    disabled={disabledFields.beneficios}
                    fullWidth
                    margin="normal"
                    required={requiredFields.beneficios}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    name="horario"
                    label="Horário"
                    value={safeFormData.horario || ''}
                    onChange={handleChange}
                    disabled={disabledFields.horario}
                    fullWidth
                    margin="normal"
                    required={requiredFields.horario}
                />
                
                <FormControl fullWidth margin="normal">
                    <InputLabel id="empresa-label">Empresa</InputLabel>
                    <Select
                        labelId="empresa-label"
                        name="empresa"
                        label="Empresa"
                        onChange={handleChange}
                        value={safeFormData.empresa || ''}
                        disabled={disabledFields.empresa}
                        required={requiredFields.empresa}
                    >
                        {['Empresa 1', 'Empresa 2', 'Empresa 3'].map(empresa => (
                            <MenuItem key={empresa} value={empresa}>{empresa}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </>
    );
};

export default CreateVaga;
