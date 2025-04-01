import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const CreateVaga = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salary: 0,
        category_id: 0,
        company_id: 5
    });

    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const loadCategorias = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/category/');
                const data = await response.json();
                setCategorias(data);
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
            }
        };
        loadCategorias();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'salary') {
            const numericValue = parseFloat(value);
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

    const validateForm = () => {
        if (!formData.title || !formData.description || !formData.salary || !formData.category_id) {
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Todos os campos obrigatórios devem ser preenchidos!',
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

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
            const requestBody = {
                ...formData,
            
                category: formData.customCategoria || formData.category,
            };
            const token = localStorage.getItem("token");
            const response = await fetch('http://localhost:8080/api/job/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
               
                body: JSON.stringify(requestBody),
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
                    title: "Vaga registrada com sucesso!",
                });
            }
        } catch (error) {
            console.error('Erro ao registrar vaga:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Houve um erro ao tentar cadastrar a vaga. Tente novamente.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        navigate('/vagas');
    };

    return (
        <Box id="container" sx={{ display: 'flex', gap: 5 }}>

            <form onSubmit={handleSubmit}>
                <h2>Criar Vaga</h2>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        name="title"
                        label="Título"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        name="description"
                        label="Descrição"
                        value={formData.description}
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
                        name="salary"
                        label="Salário"
                        type="number"
                        value={formData.salary}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="category_id"
                        label="Categoria"
                        value={formData.category_id}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        select
                        required
                    >
                        {categorias.map((categoria) => (
                            <MenuItem key={categoria.ID} value={categoria.ID}>
                                {categoria.title}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        type="submit"
                        variant="outlined"
                        fullWidth
                        sx={{ backgroundColor: '#333', color: 'white' }}
                        disabled={loading}
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ width: '200px', borderColor: '#333', color: '#333' }}
                        onClick={handleClick}
                    >
                        Voltar
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default CreateVaga;
