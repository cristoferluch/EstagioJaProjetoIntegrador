import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginScreen from './pages/LoginScreen'; // Import da tela de login

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginScreen />} /> {/* Rota para a tela de login */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
