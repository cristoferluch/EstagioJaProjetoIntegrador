import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import RegisterCompany from './pages/RegisterCompany';
import User from './pages/User';
import Company from './pages/Company';
import PrivateRoute from './pages/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import FormCompany from './pages/FormCompany';
import Vagas from './pages/Vagas';
import CreateVaga from './pages/CreateVaga';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={ <> <Header /> <Home /> </>}/>
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/cadastro" element={<RegisterScreen />} />
                <Route path="/cadastroEmpresa" element={<RegisterCompany />} />
                <Route path="/user" element={<PrivateRoute><User /></PrivateRoute>} />
                <Route path="/company" element={<PrivateRoute><Company /></PrivateRoute>} />
                <Route path="/" element={<FormCompany />} />
                <Route path="/vagas" element={<Vagas />} />
                <Route path="/criar-vaga" element={<CreateVaga />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
