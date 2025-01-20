import React, { useState, useEffect } from 'react';
import { Grid, Table, TableHead, TableBody, TableRow, TableCell, IconButton, TextField, Button, Box, Card, Typography, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from "sweetalert2";

const FormWithCategories = () => {

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({ titulo: '' });

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        zIndex: 9999,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    const buscarCategorias = () => {
        fetch(`http://localhost:8080/categories`)
            .then(response => response.json())
            .then(categorias => setCategories(categorias))
            .catch(error => console.error('Erro ao buscar dados:', error));
    };

    useEffect(() => {
        buscarCategorias();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setFormData({ titulo: category.titulo });
    };

    const handleUpdate = async (categoryId) => {

        if(formData.titulo == ''){
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Categoria não pode ser vazia',
            });
            return;
        }

        const response = await fetch(`http://localhost:8080/categories/${categoryId}`, {
            method: 'PUT',
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
                title: "Categoria Atualizada",
            });
            buscarCategorias();
        }
    };

    const handleDelete = async (categoryId) => {
        const response = await fetch(`http://localhost:8080/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
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
                title: "Categoria Removida",
            });
            buscarCategorias();
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();
        if (selectedCategory) {
            handleUpdate(selectedCategory.id);
        } else {
            console.log(formData)
            const response = await fetch(`http://localhost:8080/categories`, {
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
                    title: "Categoria Criada",
                });
                buscarCategorias();
                setFormData({ titulo: '' });
            }
        }
    };

    return (
        <Box id="container" sx={{ display: 'flex', gap: 5 }}>

            <Card sx={{ padding: 2, boxShadow: 3, width: '400px' }}>
                <Typography variant="h6" gutterBottom>
                    Categorias
                </Typography>
                <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Nome</strong></TableCell>
                                <TableCell><strong>Ações</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">
                                        Nenhuma categoria encontrada
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id} hover>
                                        <TableCell onClick={() => setSelectedCategory(category)} sx={{ cursor: 'pointer' }}>
                                            {category.titulo}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEdit(category)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(category.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Card>

            <form onSubmit={handleSave}>
                <Typography variant="h6" gutterBottom>
                    {selectedCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        label="Nome"
                        fullWidth
                        variant="outlined"
                        value={formData.titulo}
                        name="titulo"
                        onChange={handleChange}
                        sx={{ marginBottom: 2 }}
                    />
                </Box>
                <Button type="submit" variant="outlined" fullWidth sx={{ backgroundColor: '#333', color: 'white' }}>
                    {selectedCategory ? 'Atualizar' : 'Salvar'}
                </Button>
            </form>

        </Box>
    );
};

export default FormWithCategories;
