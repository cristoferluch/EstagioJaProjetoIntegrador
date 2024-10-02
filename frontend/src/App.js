import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginScreen from './pages/LoginScreen'; // Certifique-se de ter importado a página de Login
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
              <Header /> {/* Renderiza o Header apenas na Home */}
              <Home />
            </>
          } 
        />
        <Route path="/login" element={<LoginScreen />} /> {/* Rota da página de login sem Header */}
        {/* Outras rotas podem ser adicionadas aqui */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
