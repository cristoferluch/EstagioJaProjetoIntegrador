import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import InputMask from 'react-input-mask';
import { HandleCepBlur } from '../utils/CepUtils';

const FormUser = ({ formData, setFormData, disabledFields, requiredFields }) => {

    const handleCepBlur = (event) => {
        const cep = event.target.value;
        console.log(cep)
        HandleCepBlur(cep, setFormData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField name="nome" label="Nome" value={formData.nome} onChange={handleChange} disabled={disabledFields.nome} fullWidth margin="normal" required />
                <TextField name="sobrenome" label="Sobrenome" value={formData.sobrenome} onChange={handleChange} disabled={disabledFields.sobrenome} fullWidth margin="normal" required />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} disabled={disabledFields.email} fullWidth margin="normal" required />
                <TextField name="dataNascimento" label="Data de Nascimento" type="date" value={formData.dataNascimento} onChange={handleChange} disabled={disabledFields.dataNascimento} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField name="senha" label="Senha" type="password" value={formData.senha} onChange={handleChange} disabled={disabledFields.senha} fullWidth margin="normal" required={requiredFields.senha} inputProps={{ minLength: 6 }} />
                <InputMask mask="(99) 99999-9999" value={formData.celular} onChange={handleChange} disabled={disabledFields.celular}>
                    {(inputProps) => <TextField {...inputProps} name="celular" label="Celular" fullWidth margin="normal" required />}
                </InputMask>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <InputMask mask="999.999.999-99" value={formData.cpf} onChange={handleChange} disabled={disabledFields.cpf}>
                    {(inputProps) => <TextField {...inputProps} name="cpf" label="CPF" fullWidth margin="normal" required />}
                </InputMask>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="demo-simple-select-label">Gênero</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" name="genero" label="Gênero" onChange={handleChange} value={formData.genero} required>
                        <MenuItem value="masculino">Masculino</MenuItem>
                        <MenuItem value="feminino">Feminino</MenuItem>
                        <MenuItem value="outro">Outro</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <InputMask mask="99999-999" value={formData.cep} onChange={handleChange} disabled={disabledFields.cep} onBlur={handleCepBlur}>
                    {(inputProps) => <TextField {...inputProps} name="cep" label="CEP" fullWidth margin="normal" required />}
                </InputMask>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="uf-label">UF</InputLabel>
                    <Select labelId="uf-label" id="uf-select" name="uf" label="UF" onChange={handleChange} value={formData.uf} required>
                        {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                            <MenuItem key={uf} value={uf}>{uf}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField name="municipio" label="Município" value={formData.municipio} onChange={handleChange} disabled={disabledFields.municipio} fullWidth margin="normal" required />
                <TextField name="bairro" label="Bairro" value={formData.bairro} onChange={handleChange} disabled={disabledFields.bairro} fullWidth margin="normal" required />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField name="endereco" label="Endereço" value={formData.endereco} onChange={handleChange} disabled={disabledFields.endereco} fullWidth margin="normal" required />
                <TextField name="numero" label="Número" type="number" value={formData.numero} onChange={handleChange} disabled={disabledFields.numero} fullWidth margin="normal" required />
            </Box>
        </>
    );
};

export default FormUser;
