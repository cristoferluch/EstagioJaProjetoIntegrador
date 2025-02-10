import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    MenuItem,
    Container,
    Paper,
    OutlinedInput,
    Select,
    Stack,
    Chip, InputLabel, FormControl
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { height, styled, width } from '@mui/system';
import Swal from 'sweetalert2';


const Vagas = () => {
    const navigate = useNavigate();

    const [vagas, setVagas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtros, setFiltros] = useState({
        titulo: '',
        minSalario: '',
        maxSalario: '',
        categories: []
    });

    const buscarVagas = () => {
        const queryParams = new URLSearchParams(filtros).toString();
        fetch(`http://localhost:8080/jobs?${queryParams}`)
            .then(response => response.json())
            .then(vagas => setVagas(vagas))
            .catch(error => console.error('Erro ao buscar dados:', error));
    };

    const buscarCategorias = () => {
        fetch(`http://localhost:8080/categories`)
            .then(response => response.json())
            .then(categorias => setCategorias(categorias))
            .catch(error => console.error('Erro ao buscar dados:', error));
    };

    useEffect(() => {
        buscarVagas();
        buscarCategorias();
    }, [filtros]); 

    const handleInputChange = (e) => {
        console.log(e.target);
        const { name, value } = e.target;
        setFiltros({ ...filtros, [name]: value });
    };

    const handleFiltrar = () => {
        buscarVagas();
    };

    const handleCreateJob = () => {
        navigate('/criar-vaga');
    };

    const handleEditJob = (id) => {

        console.log(id)

        navigate(`/editar-vaga/${id}`);
    };

    const handleCreateCategory = (id) => {
        navigate(`/categoria/`);
    }

    const handleDeleteJob = async (id) => {

        try {
            const response = await fetch(`http://localhost:8080/jobs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const resposta = await response.json();
            
            if (response.ok) {
                setVagas((prevVagas) => prevVagas.filter(vaga => vaga.id !== id));
                Swal.fire({
                    icon: 'success',
                    title: 'Vaga removida com sucesso!'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: resposta,
                });
            }

        } catch (error) {
            console.error('Erro:', error);
        }
    }

    return (
        <Box
            id="container"
            sx={{
                display: 'flex',
                gap: 2,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                backgroundColor: '#f4f6f8',
                padding: 2
            }}
            style={{ justifyContent: 'flex-start' }}
        >

            <Box sx={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography variant="h5" fontWeight="bold" color="#333">Lista de Vagas</Typography>
                <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', padding: '6px' }} onClick={handleCreateCategory}>Cadastrar Categoria</Button>
                <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', padding: '6px' }} onClick={handleCreateJob}>Criar Vaga</Button>
            </Box>

            <Container sx={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <TextField
                        label="Título"
                        name="titulo"
                        value={filtros.titulo}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 220 }}
                    />
                    <TextField
                        label="Salário Mínimo"
                        name="minSalario"
                        type="number"
                        value={filtros.minSalario}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 220 }}
                    />
                    <TextField
                        label="Salário Máximo"
                        name="maxSalario"
                        type="number"
                        value={filtros.maxSalario}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 220 }}
                    />
                    <FormControl sx={{ maxWidth: 220 }} size="small" fullWidth>
                        <InputLabel>Categorias</InputLabel>
                        <Select
                            multiple
                            value={filtros.categories}
                            onChange={(e) => setFiltros({ ...filtros, categories: e.target.value })} // Atualizando corretamente o estado
                            input={<OutlinedInput label="Categorias" />}
                        >
                            {categorias.map((categoria) => (
                                <MenuItem key={categoria.id} value={categoria.id}>
                                    {categoria.titulo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" sx={{ height: '40px', width: '140px', backgroundColor: '#333', color: 'white' }} onClick={handleFiltrar}>Filtrar</Button>
                </Box>
            </Container>

            <Container sx={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
                <Grid container spacing={3}>
                    {Array.isArray(vagas) && vagas.length > 0 ? (
                        vagas.map((vaga) => (
                            <Grid item xs={12} sm={8} md={6} lg={4} key={vaga.id}>
                                <StyledCard sx={{
                                    boxShadow: 3,
                                    borderRadius: 3,
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 6,
                                    },
                                }}>
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" fontWeight="bold" color="#333">{vaga.titulo}</Typography>
                                        </Box>
                                        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1, lineHeight: 1.5 }}>
                                            {vaga.descricao}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Salário: R${vaga.salario}</Typography>
                                       
                                        <Typography variant="body2" color="textSecondary">Categoria: {vaga.category.titulo}</Typography>

                                        <Box sx={{ marginTop: 'auto', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button
                                                size="small"
                                                color="error"
                                                sx={{
                                                    fontWeight: 'bold',
                                                }}
                                                onClick={() => handleDeleteJob(vaga.id)}>
                                                Excluir
                                            </Button>
                                            <Button
                                                size="small"
                                                color="primary"
                                                sx={{
                                                    fontWeight: 'bold',
                                                }}
                                                onClick={() => handleEditJob(vaga.id)}>
                                                Editar
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center' }}>
                                Nenhuma vaga disponível
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Container>


        </Box>
    );
};

const StyledCard = styled(Paper)(({ theme }) => ({
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#fff',
    padding: theme.spacing(2),
    '&:hover': {
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-5px)',
        transition: 'all 0.3s ease',
    },
}));

export default Vagas;
