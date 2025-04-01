import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import Swal from "sweetalert2";
import { useNavigate, useParams } from 'react-router-dom';

const EditVaga = () => {
    const { jobId } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salary: '',
        category_id: '',
        company_id: localStorage.getItem("id"),
    });

    const [categorias, setCategorias] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchVaga = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/job/${jobId}`);
                const vaga = await response.json();
                if (response.ok) {
                    setFormData({
                        title: vaga.title,
                        description: vaga.description,
                        salary: vaga.salary,
                        category_id: vaga.category_id,
                        company_id: vaga.company_id,
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

        fetch('http://localhost:8080/api/category/')
            .then((response) => response.json())
            .then((data) => setCategorias(data))
            .catch((error) => console.error('Erro ao carregar categorias:', error));
    }, [jobId, navigate]);

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
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/job/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
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

    return (
        <Box id="container" sx={{ display: 'flex', gap: 5 }}>
            <form onSubmit={handleSubmit}>
                <h2>Editar Vaga</h2>

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
                        sx={{ backgroundColor: 'black', color: 'white' }}
                    >
                        Salvar Alterações
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ width: '200px', borderColor: 'black', color: 'black' }}
                        onClick={handleClick}
                    >
                        Voltar
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditVaga;
