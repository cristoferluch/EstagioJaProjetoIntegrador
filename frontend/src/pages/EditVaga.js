import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import './EditVaga.css';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";

const EditVaga = () => {
    const { jobId } = useParams();
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        salario: '',
        category: '',
        companyId: localStorage.getItem("id"),
        customCategoria: ''
    });

    const [categorias, setCategorias] = useState([]);
    const [showCustomCategoria, setShowCustomCategoria] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchVaga = async () => {
            try {
                const response = await fetch(`http://localhost:8080/jobs/${jobId}`);
                const vaga = await response.json();
                if (response.ok) {
                    setFormData({
                        titulo: vaga.titulo,
                        descricao: vaga.descricao,
                        salario: vaga.salario,
                        category: vaga.category || '',
                        companyId: vaga.companyId,
                        customCategoria: ''
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro!',
                        text: 'Não foi possível carregar os dados da vaga.',
                    });
                    navigate('/vagas');
                }
            } catch (error) {
                console.error('Erro ao carregar vaga:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Erro ao carregar os dados da vaga.',
                });
                navigate('/vagas');
            }
        };

        fetchVaga();

        fetch('http://localhost:8080/categories')
            .then((response) => response.json())
            .then((data) => setCategorias(data))
            .catch((error) => console.error('Erro ao carregar categorias:', error));
    }, [jobId, navigate]);

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
        });

        try {
            if (formData.customCategoria) {
                formData.category = formData.customCategoria;
            }

            const response = await fetch(`http://localhost:8080/jobs/${jobId}`, {
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
                    title: "Vaga atualizada com sucesso!",
                });
                navigate('/vagas');
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
            <h2>Editar Vaga</h2>
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
                            sx={{backgroundColor: 'black', color: 'white'}}>Salvar Alterações</Button>
                    <Button variant="outlined" sx={{width: '200px', borderColor: 'black', color: 'black'}}
                            onClick={handleClick}>Voltar</Button>
                </Box>
            </form>
        </div>
    );
};

export default EditVaga;
