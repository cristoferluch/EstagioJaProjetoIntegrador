import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import './CreateVaga.css';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const CreateVaga = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        salario: '',
        category: '',
        jobId: '',
        companyId: localStorage.getItem("id"),
        customCategoria: ''  // Novo campo para categoria personalizada
    });

    const [categorias, setCategorias] = useState([]); // Estado para armazenar categorias do banco
    const [showCustomCategoria, setShowCustomCategoria] = useState(false); // Controla se o campo customCategoria será mostrado

    const navigate = useNavigate();

    // Carregar as categorias ao montar o componente
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
            formData.jobId = '';
            if (formData.customCategoria) {
                
                formData.category = formData.customCategoria;  // Usa a nova categoria
            }

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
                        fullWidth
                        margin="normal"
                        required
                    />
                </Box>

                <Box sx={{display: 'flex', gap: 1}}>
                    <TextField
                        name="descricao"
                        label="Descrição"
                        value={safeFormData.descricao || ''}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={10}
                        margin="normal"
                        required
                    />
                </Box>

                <Box sx={{display: 'flex', gap: 1}}>
                    <TextField
                        name="salario"
                        label="Salário"
                        type="number"
                        value={safeFormData.salario || ''}
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
                                {categoria.titulo}
                            </MenuItem>
                        ))}
                        <MenuItem value="Outra" onClick={() => setShowCustomCategoria(true)}>
                            Outra (digite a categoria)
                        </MenuItem>
                    </TextField>

                    {showCustomCategoria && (
                        <TextField
                            name="customCategoria"
                            label="Nova Categoria"
                            value={safeFormData.customCategoria || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                    )}
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
