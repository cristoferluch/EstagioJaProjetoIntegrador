// src/pages/CreateVagaPage.js
import React, { useState } from 'react';
import CreateVaga from '../pages/CreateVaga'; // Corrigir o caminho conforme a sua estrutura de pastas

const CreateVagaPage = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        salario: '',
        beneficios: '',
        horario: '',
        empresa: ''
    });

    const disabledFields = {
        titulo: false,
        descricao: false,
        salario: false,
        beneficios: false,
        horario: false,
        empresa: false
    };

    const requiredFields = {
        titulo: true,
        descricao: true,
        salario: true,
        beneficios: false,
        horario: true,
        empresa: true
    };

    return (
        <div>
            <h2>Criar Vaga</h2>
            <CreateVaga
                formData={formData}
                setFormData={setFormData}
                disabledFields={disabledFields}
                requiredFields={requiredFields}
            />
        </div>
    );
};

export default CreateVagaPage;
