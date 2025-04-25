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
    OutlinedInput,
    Select,
    InputLabel, FormControl
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import Swal from 'sweetalert2';

const Vagas = () => {
    const navigate = useNavigate();

    const [vagas, setVagas] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [filtros, setFiltros] = useState({
        title: '',
        minSalary: '',
        maxSalary: '',
        category: []
    });

    const buscarVagas = () => {

        const params = { ...filtros };

        if (params.category.length > 0) {
            params.category = params.category.join(',');
        } else {
            delete params.category;
        }

        const queryParams = new URLSearchParams(params).toString();
        fetch(`http://localhost:8080/api/job/?${queryParams}`)
            .then(response => response.json())
            .then(vagas => setVagas(vagas))
            .catch(error => console.error('Erro ao buscar dados:', error));
    };

    const buscarCategorias = () => {
        fetch(`http://localhost:8080/api/category/`)
            .then(response => response.json())
            .then(categorys => setCategorys(categorys))
            .catch(error => console.error('Erro ao buscar dados:', error));


    };

    useEffect(() => {
        buscarVagas();
        buscarCategorias();
    }, [filtros]);

    const handleCategoryChange = (event) => {
        const { value } = event.target;
        console.log(value)

        setFiltros({ ...filtros, category: value });
    };

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
        navigate(`/editar-vaga/${id}`);
    };

    const handleCreateCategory = (id) => {
        navigate(`/categoria/`);
    };

    const inscreverNaVaga = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/job/${id}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const resposta = await response.json();
            if (response.ok) {

                Swal.fire({
                    icon: 'success',
                    title: 'Inscrição realizada com sucesso!'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: resposta.error,
                });
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const EmpresaCadastro = () => {
        if (localStorage.getItem("is_company") === '1') {
            return (
                <Box sx={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h5" fontWeight="bold" color="#333">Lista de Vagas</Typography>
                    <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', padding: '6px' }} onClick={handleCreateCategory}>Cadastrar Categoria</Button>
                    <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', padding: '6px' }} onClick={handleCreateJob}>Criar Vaga</Button>
                </Box>
            );
        }

        return ('');
    }

    const BotaoEmpresa = ({ vaga }) => {
        if (localStorage.getItem("is_company") === '1') {
            return (
                <>
                    <Button
                        size="small"
                        color="error"
                        sx={{ fontWeight: 'bold' }}
                        onClick={() => handleDeleteJob(vaga.id)}
                    >
                        Excluir
                    </Button>
                    <Button
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                        onClick={() => handleEditJob(vaga.id)}
                    >
                        Editar
                    </Button>
                </>
            );
        }

        return ('');
    };
 

    const handleDeleteJob = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/job/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
                    text: resposta.error,
                });
            }

        } catch (error) {
            console.error('Erro:', error);
        }
    };

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

            <EmpresaCadastro />

            <Container sx={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <TextField
                        label="Título"
                        name="title"
                        value={filtros.title}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 220 }}
                    />
                    <TextField
                        label="Salário Mínimo"
                        name="minSalary"
                        type="number"
                        value={filtros.minSalary}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 220 }}
                    />
                    <TextField
                        label="Salário Máximo"
                        name="maxSalary"
                        type="number"
                        value={filtros.maxSalary}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 220 }}
                    />
                    <FormControl sx={{ maxWidth: 220 }} size="small" fullWidth>
                        <InputLabel>Categorias</InputLabel>
                        <Select
                            multiple
                            value={filtros.category}
                            onChange={handleCategoryChange}
                            input={<OutlinedInput label="Categorias" />}
                            renderValue={(selected) => selected.map(id =>
                                categorys.find(c => c.ID === id)?.title
                            ).join(', ')}
                        >
                            {categorys.map((categoria) => (
                                <MenuItem key={categoria.ID} value={categoria.ID}>
                                    {categoria.title}
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
                                            <Typography variant="h6" fontWeight="bold" color="#333">{vaga.title}</Typography>
                                        </Box>
                                        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1, lineHeight: 1.5 }}>
                                            {vaga.descricao}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Salário: R${vaga.salary}</Typography>

                                        <Typography variant="body2" color="textSecondary">Categoria: {vaga.category_title}</Typography>

                                        <Box sx={{ marginTop: 'auto', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button
                                                size="small"
                                                color="success"
                                                sx={{
                                                    fontWeight: 'bold',
                                                }}
                                                onClick={() => inscreverNaVaga(vaga.id)}
                                            >
                                                Inscrever
                                            </Button>
                                            <BotaoEmpresa vaga={vaga} />
                                        </Box>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="h6" color="textSecondary">
                                Nenhuma vaga encontrada!
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
}

const StyledCard = styled(Card)`
    padding: 16px;
    background-color: #f9f9f9;
`;

export default Vagas;
