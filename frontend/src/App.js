import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import RegisterCompany from './pages/RegisterCompany';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Header />
              <Home />
            </>
          } 
        />
        <Route path="/login" element={<LoginScreen />} /> 
        <Route path="/cadastro" element={<RegisterScreen />} />
        <Route path="/cadastroEmpresa" element={<RegisterCompany />} />


      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
