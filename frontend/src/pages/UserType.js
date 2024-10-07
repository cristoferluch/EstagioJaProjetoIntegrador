import React from 'react';
import './UserType.css';
import { useNavigate } from 'react-router-dom';

const UserType = () => {
    const navigate = useNavigate();

    const handleOptionClick = (option) => {
        // Mapeia as opções para as rotas corretas
        if (option === 'candidato') {
            navigate('/cadastro'); // Altere para a rota correta do cadastro de candidato
        } else if (option === 'empresa') {
            navigate('/CadastroEmpresa'); // Rota para o cadastro de empresa
        }
    };

    return (
        <div id="user-type-container">
            <button className="user-type-button" onClick={() => handleOptionClick('candidato')}>
                Candidato
            </button>
            <button className="user-type-button" onClick={() => handleOptionClick('empresa')}>
                Empresa
            </button>
        </div>
    );
};

export default UserType;
