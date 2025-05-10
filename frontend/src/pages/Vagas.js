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
    InputLabel,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import Swal from 'sweetalert2';

const Vagas = () => {
    const navigate = useNavigate();

    const [vagaSelecionada, setVagaSelecionada] = useState(null);
    const handleFecharDialog = () => setVagaSelecionada(null);

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

    const inscreverNaVaga = async (id, message) => {
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
                    title: message
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

    const confirmarInscricaoComUpload = async (vagaId) => {
        const result = await Swal.fire({
            title: 'Enviar Currículo',
            html: `
            <input type="file" id="upload-cv" accept=".pdf,.doc,.docx" class="swal2-file" style="display: block; margin: 1em auto;">
        `,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Enviar e Inscrever',
            denyButtonText: 'Apenas e Inscrever',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const fileInput = Swal.getPopup().querySelector('#upload-cv');
                if (!fileInput.files[0]) {
                    Swal.showValidationMessage('Por favor, selecione um arquivo.');
                }
                return fileInput.files[0];
            }
        });

        const token = localStorage.getItem("token");
        const file = result.value;


        if (result.isConfirmed || result.isDenied) {
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("document_type", "job-" + vagaId);

                    const uploadResponse = await fetch('http://localhost:8080/api/user/upload', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData,
                    });

                    if (!uploadResponse.ok) {
                        const errorData = await uploadResponse.json();
                        return Swal.fire('Erro no upload', errorData.error || 'Tente novamente.', 'error');
                    }

                    await inscreverNaVaga(vagaId, 'Currículo enviado e inscrição realizada!');
                } catch (error) {
                    console.error("Erro no upload:", error);
                    Swal.fire('Erro inesperado', 'Não foi possível enviar o arquivo.', 'error');
                }

            } else {
                await inscreverNaVaga(vagaId, 'Inscrição realizada!');
            }
        }
    };

    const EmpresaCadastro = () => {
        if (localStorage.getItem("is_company") === '1') {
            return (

                <>
                    <Box
                        sx={{
                            position: 'relative',
                            backgroundColor: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            height: '64px',
                            paddingX: 2
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="#333"
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)'
                            }}
                        >
                            Lista de Vagas
                        </Typography>

                        <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#333', color: 'white', padding: '6px' }}
                                onClick={handleCreateCategory}
                            >
                                Cadastrar Categoria
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#333', color: 'white', padding: '6px' }}
                                onClick={handleCreateJob}
                            >
                                Criar Vaga
                            </Button>
                        </Box>
                    </Box>
                </>
            );
        }

        return ('');
    }

    const BotaoUsuario = ({ vaga }) => {
        if (localStorage.getItem("is_company") == null || localStorage.getItem("is_company") === '0') {
            return (
                <>
                    <Button size="small" color="dimgrey" sx={{ fontWeight: 'bold' }} onClick={() => setVagaSelecionada(vaga)}>Ver detalhes</Button>
                </>
            );
        }

        return ('');
    };

    const BotaoEmpresa = ({ vaga }) => {
        if (localStorage.getItem("is_company") === '1' && localStorage.getItem("id") == vaga.company_id) {
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
                                        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1, lineHeight: 1.5, height: '50px' }}>
                                            {vaga.description ? (vaga.description.replace(/<[^>]+>/g, '').length > 80 ? vaga.description.replace(/<[^>]+>/g, '').slice(0, 80) + '...' : vaga.description) : ""}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary"><strong>Salário:</strong>: R${vaga.salary}</Typography>
                                        <Typography variant="body2" color="textSecondary"><strong>Categoria:</strong> {vaga.category_title}</Typography>
                                        <Typography variant="body2" color="textSecondary"><strong>Empresa:</strong> {vaga.company_name}</Typography>

                                        <Box sx={{ marginTop: '15px', display: 'flex', gap: 2, height: '20px', justifyContent: 'flex-end' }}>
                                            <BotaoUsuario vaga={vaga} />
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

            <Dialog open={Boolean(vagaSelecionada)} onClose={handleFecharDialog} fullWidth maxWidth="sm">
                <DialogTitle>{vagaSelecionada?.title}</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" fontSize={15} color="black" sx={{ marginTop: 1 }}><strong>Salário:</strong> R${vagaSelecionada?.salary}</Typography>
                    <Typography variant="body2" fontSize={15} color="black"><strong>Categoria:</strong> {vagaSelecionada?.category_title}</Typography>
                    <Typography variant="body2" fontSize={15} color="black"><strong>Empresa:</strong> {vagaSelecionada?.company_name}</Typography>
                    <br></br>
                    <Typography gutterBottom dangerouslySetInnerHTML={{
                        __html: vagaSelecionada?.description?.replace(/\n/g, '<br />')
                    }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFecharDialog} color="inherit">Fechar</Button>
                    <Button onClick={() => { confirmarInscricaoComUpload(vagaSelecionada.id); handleFecharDialog(); }} color="success">Inscrever</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

const StyledCard = styled(Card)`
    padding: 16px;
    background-color: #f9f9f9;
`;

export default Vagas;
