import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const CreateVaga = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salary: '',
        category: '',
        id: '',
        company_id: '8a3927a6-5972-4124-8223-5d0b55b73fec',
        customCategoria: ''
    });

    const [categorias, setCategorias] = useState([]);
    const [showCustomCategoria, setShowCustomCategoria] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/categories')
            .then((response) => response.json())
            .then((data) => setCategorias(data))
            .catch((error) => console.error('Erro ao carregar categorias:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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
            formData.id = '';
            if (formData.customCategoria) {
                formData.category = formData.customCategoria;
            }

            const response = await fetch('http://localhost:8080/job', {
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
        <Box id="container" sx={{ display: 'flex', gap: 5 }}>

            <form onSubmit={handleSubmit}>
                <h2>Criar Vaga</h2>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        name="titulo"
                        label="Título"
                        value={safeFormData.title || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        name="descricao"
                        label="Descrição"
                        value={safeFormData.description || ''}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={10}
                        margin="normal"
                        required
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        name="salario"
                        label="Salário"
                        type="number"
                        value={safeFormData.salary || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="category"
                        label="Categoria"
                        value={safeFormData.category || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        select
                        required
                    >

                        {categorias.map((categoria) => (
                            <MenuItem key={categoria.id} value={categoria.id}>
                                {categoria.title}
                            </MenuItem>
                        ))}

                    </TextField>


                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button type="submit" variant="outlined" fullWidth
                        sx={{ backgroundColor: '#333', color: 'white' }}>Cadastrar</Button>
                    <Button variant="outlined" sx={{ width: '200px', borderColor: '#333', color: '#333' }}
                        onClick={handleClick}>Voltar</Button>
                </Box>
            </form>
        </Box>
    );
};

export default CreateVaga;
