import React from 'react';
import { Box, Button, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./Vagas.css";

const Vagas = () => {
    const navigate = useNavigate();

    const vagas = [
        { id: 1, titulo: 'Desenvolvedor Front-End', descricao: 'Desenvolvimento de interfaces.' },
        { id: 2, titulo: 'Desenvolvedor Back-End', descricao: 'Desenvolvimento de APIs.' },
        { id: 3, titulo: 'Analista de Dados', descricao: 'Análise de dados e relatórios.' },
        { id: 4, titulo: 'Designer UI/UX', descricao: 'Design de interfaces e experiência do usuário.' },
        { id: 5, titulo: 'Gerente de Projetos', descricao: 'Gerenciamento de projetos e equipe.' },
        { id: 6, titulo: 'Especialista em Marketing', descricao: 'Criação de campanhas e estratégias de marketing.' }
    ];

    return (
        <Box>
            <Box
                sx={{
                    backgroundColor: '#f0f0f0',
                    padding: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                }}
            >
                <Typography variant="h5">Lista de Vagas</Typography>
                <Button
                    className="button-criar-vaga"
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/criar-vaga')}
                >
                    Criar Vaga
                </Button>
            </Box>

            <Box sx={{ paddingTop: 8, padding: 4 }}>
                <Grid container spacing={2}>
                    {vagas.map((vaga) => (
                        <Grid item xs={12} sm={6} md={4} key={vaga.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6">{vaga.titulo}</Typography>
                                        <Button
                                            className="button-criar-vaga" // Usa o mesmo estilo do botão "Criar Vaga"
                                            size="small"
                                            onClick={() => navigate(`/editar-vaga/${vaga.id}`)} // Redireciona para a página de edição
                                        >
                                            Editar
                                        </Button>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        {vaga.descricao}
                                    </Typography>
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
