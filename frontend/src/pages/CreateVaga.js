
import React, {useState} from 'react';
import { Box, TextField, Button } from '@mui/material';
import './CreateVaga.css';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const CreateVaga = () => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        salario: '',
        categoria: '',
        jobId: '',
        companyId: localStorage.getItem("id")
    });

    const disabledFields = {
        titulo: false,
        descricao: false,
        salario: false,
        categoria: false,
        jobId: false
    };

    const requiredFields = {
        titulo: true,
        descricao: true,
        salario: true,
        categoria: false,
        jobId: false
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
                navigate('/vagas');
            }
        });

        try {

            formData.jobId = '';
            const response = await fetch('http://localhost:8080/jobs', {
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
                    title: "Vaga registrada com sucesso!",
                });
            }

        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const handleClick = () => {
        navigate('/vagas');
    };

    const safeFormData = formData || {};

    return (
        <div>
            <h2>Criar Vaga</h2>
            <form onSubmit={handleSubmit}>
                <Box sx={{position: 'absolute', top: 16, right: 16}}>
                    <Button
                        className="button-ver-vagas2"
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/vagas')}
                    >
                        Ver Vagas
                    </Button>
                </Box>

                <Box sx={{display: 'flex', gap: 1}}>
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
                </Box>

                <Box sx={{display: 'flex', gap: 1}}>
                    <TextField
                        name="descricao"
                        label="Descrição"
                        value={safeFormData.descricao || ''}
                        onChange={handleChange}
                        disabled={disabledFields.descricao}
                        fullWidth
                        multiline
                        rows={10}
                        margin="normal"
                        required={requiredFields.descricao}
                    />
                </Box>

                <Box sx={{display: 'flex', gap: 1}}>
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
                        name="categoria"
                        label="Categoria"
                        value={safeFormData.categoria || ''}
                        onChange={handleChange}
                        disabled={disabledFields.categoria}
                        fullWidth
                        margin="normal"
                        required={requiredFields.categoria}
                    />
                </Box>

                <Box sx={{display: 'flex', gap: 1}}>
                    <Button type="submit" variant="outlined" fullWidth
                            sx={{backgroundColor: 'black', color: 'white'}}>Cadastrar</Button>
                    <Button variant="outlined" sx={{width: '200px', borderColor: 'black', color: 'black'}}
                            onClick={handleClick}>Voltar</Button>
                </Box>
            </form>
        </div>
    );
};

export default CreateVaga;
