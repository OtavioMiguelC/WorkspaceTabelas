import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

export default function PrivateRoute() {
  const { signed, loading } = useAuth();
  const location = useLocation();
  
  // Verifica se estamos no ecrã de descanso
  const isAfk = location.pathname === '/afk';

  if (loading) {
    return (
      <div className="h-screen bg-[#09090b] flex items-center justify-center text-[#5C2EE9] flex-col gap-4">
        <div className="h-2 w-2 rounded-full bg-[#5C2EE9] animate-ping"></div>
        <p className="text-xs tracking-widest uppercase font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          A verificar credenciais...
        </p>
      </div>
    );
  }

  // Se não estiver logado, vai pro Login
  if (!signed) return <Navigate to="/login" />;

  // MÁGICA: Se estiver no AFK, devolve APENAS a tela AFK (Oculta Sidebar e todo o resto)
  if (isAfk) {
    return <Outlet />;
  }

  // LAYOUT NORMAL DO SISTEMA
  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden selection:bg-[#5C2EE9] selection:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        
        <style>{`
          @keyframes float-purple-global { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30vw, 20vh) scale(1.2); } 66% { transform: translate(-10vw, 40vh) scale(0.9); } 100% { transform: translate(0, 0) scale(1); } }
          @keyframes float-blue-global { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(-30vw, -20vh) scale(1.1); } 66% { transform: translate(20vw, -30vh) scale(1.3); } 100% { transform: translate(0, 0) scale(1); } }
          .animate-float-purple-global { animation: float-purple-global 35s infinite ease-in-out; }
          .animate-float-blue-global { animation: float-blue-global 40s infinite ease-in-out; }
        `}</style>

        <Toaster position="top-right" reverseOrder={false} />

        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="absolute inset-0 opacity-[0.04] mix-blend-screen z-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-float-purple-global"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/15 rounded-full blur-[150px] animate-float-blue-global"></div>
        </div>

        <Sidebar />
        
        <main className="relative z-10 flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-[#5C2EE9]/50 transition-colors">
           <Outlet /> 
        </main>
    </div>
  );
}