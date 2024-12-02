import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Grid, Card, CardContent, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import "./Vagas.css";

const Vagas = () => {
    const navigate = useNavigate();

    const [vagas, setVagas] = useState([]);
    const [filtros, setFiltros] = useState({
        titulo: '',
        minSalario: '',
        maxSalario: '',
        category: ''
    });

    const categorias = ['TI', 'Vendas', 'Administração', 'Marketing']; // Lista de categorias

    const buscarVagas = () => {
        const queryParams = new URLSearchParams(filtros).toString();
        fetch(`http://localhost:8080/jobs?${queryParams}`)
            .then(response => response.json())
            .then(vagas => setVagas(vagas))
            .catch(error => console.error('Erro ao buscar dados:', error));
    };

    useEffect(() => {
        buscarVagas();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFiltros({ ...filtros, [name]: value });
    };

    const handleFiltrar = () => {
        buscarVagas();
    };

    return (
        <Box sx={{ marginTop: -80 }}>
            <Box sx={{ backgroundColor: '#f0f0f0', padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
                <Typography variant="h5">Lista de Vagas</Typography>
                <Button className="button-criar-vaga" variant="contained" color="primary" onClick={() => navigate('/criar-vaga')}>Criar Vaga</Button>
            </Box>

            <Box sx={{ paddingTop: 2, padding: 4 }}>
                <Box sx={{ marginBottom: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Título"
                        name="titulo"
                        value={filtros.titulo}
                        onChange={handleInputChange}
                        size="small"
                        sx={{ height: 40 }} // Ajuste a altura dos campos
                    />
                    <TextField
                        label="Salário Mínimo"
                        name="minSalario"
                        type="number"
                        value={filtros.minSalario}
                        onChange={handleInputChange}
                        size="small"
                        sx={{ height: 40 }} // Ajuste a altura dos campos
                    />
                    <TextField
                        label="Salário Máximo"
                        name="maxSalario"
                        type="number"
                        value={filtros.maxSalario}
                        onChange={handleInputChange}
                        size="small"
                        sx={{ height: 40 }} // Ajuste a altura dos campos
                    />
                    <Autocomplete
                        sx={{ width: 160 }}
                        value={filtros.category} // Para exibir o valor selecionado
                        onChange={(event, newValue) => setFiltros({ ...filtros, category: newValue })} // Atualiza o filtro de categoria
                        options={categorias} // Passa as categorias para o autocomplete
                        renderInput={(params) => 
                            <TextField 
                                {...params} 
                                label="Categoria" 
                                sx={{ 
                                    height: 40, 
                                    '& .MuiInputBase-root': {
                                        height: '100%', // Garante que o TextField ocupe toda a altura do componente
                                    }
                                }} 
                            />
                        }
                    />
                    <Button variant="contained" color="secondary" onClick={handleFiltrar}>Filtrar</Button>
                </Box>

                <Grid container spacing={2}>
                    {vagas.map((vaga) => (
                        <Grid item xs={12} sm={6} md={4} key={vaga.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6">{vaga.titulo}</Typography>
                                        <Button className="button-criar-vaga" size="small" onClick={() => navigate(`/editar-vaga/${vaga.id}`)}>Editar</Button>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">{vaga.descricao}</Typography>
                                    <Typography variant="body2" color="textSecondary">Salário: R${vaga.salario}</Typography>
                                    <Typography variant="body2" color="textSecondary">Categoria: {vaga.categoria}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default Vagas;
