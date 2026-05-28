import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Importação de todas as Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TDE from './pages/TDE'; 
import Ibge from './pages/Ibge';
import Afk from './pages/Afk'; 
import Workspace from './pages/Workspace';
import Usuarios from './pages/Usuarios'; // NOVA ROTA DE ADMINISTRAÇÃO

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Privadas (Protegidas pelo PrivateRoute) */}
          <Route element={<PrivateRoute />}>
             <Route path="/" element={<Dashboard />} />
             <Route path="/tde" element={<TDE />} />
             <Route path="/ibge" element={<Ibge />} />
             <Route path="/afk" element={<Afk />} />
             
             <Route path="/workspace" element={<Workspace />} />
             <Route path="/usuarios" element={<Usuarios />} /> {/* NOVA ROTA */}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;