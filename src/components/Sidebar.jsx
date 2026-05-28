import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Database, LogOut, Lock, BookOpen, Shield, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/logo.png'; 

export default function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar o hover
  const [isDark, setIsDark] = useState(true); // Estado do tema

  // Aplica a classe de light-theme no HTML globalmente
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
    }
  }, [isDark]);

  const items = [
    { path: '/', label: 'Ferramentas Gerais', icon: <LayoutDashboard size={20} /> },
    { path: '/workspace', label: 'Meu Workspace', icon: <BookOpen size={20} /> },
    { path: '/tde', label: 'Cadastro TDE', icon: <Users size={20} /> },
    { path: '/ibge', label: 'Base IBGE', icon: <Database size={20} /> }
  ];

  const handleLogout = () => {
    setIsLoggingOut(true); 
    setTimeout(() => { signOut(); }, 1500);
  };

  return (
    <>
      <style>{`
        @keyframes disconnect-progress { 0% { width: 0%; opacity: 1; } 80% { width: 100%; opacity: 1; } 100% { width: 100%; opacity: 0; } }
        .animate-disconnect { animation: disconnect-progress 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        
        /* ANIMAÇÃO DO LASER CONTÍNUO (SEAMLESS LOOP) */
        @keyframes led-continuous {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-led-continuous { animation: led-continuous 2s linear infinite; }
      `}</style>

      {/* ==========================================
          ANIMAÇÃO DE SAÍDA (TELA CHEIA)
          ========================================== */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] bg-[#09090b] flex flex-col items-center justify-center animate-in fade-in duration-500">
          
          <div className="absolute inset-0 opacity-[0.04] mix-blend-screen pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>

          <div className="relative mb-6 group animate-in zoom-in-50 duration-500">
             <div className="absolute inset-0 bg-red-500 blur-2xl opacity-30 animate-pulse"></div>
             <div className="relative z-10 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)]">
               <Lock size={48} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
             </div>
          </div>

          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 tracking-widest uppercase mb-2 drop-shadow-md animate-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            Sessão Encerrada
          </h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-red-500 text-[10px] mb-10 tracking-widest uppercase drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">
            Desconectando Workspace...
          </p>

          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
             <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_15px_#ef4444] animate-disconnect"></div>
          </div>
        </div>
      )}

      {/* ==========================================
          BARRA LATERAL COLLAPSIBLE
          ========================================== */}
      <div 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`bg-[#09090b]/90 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between py-6 z-20 shadow-2xl h-screen transition-all duration-300 ease-in-out ${isExpanded ? 'w-72 px-6' : 'w-20 px-3'}`}
      >
        <div>
          
          <div className={`mb-10 px-2 flex flex-col items-center ${isExpanded ? 'md:items-start' : 'md:items-center'}`}>
            
            {/* --- LOGO INTERATIVA --- */}
            <Link to="/afk" className={`relative mb-2 group cursor-pointer transition-all duration-500 hover:scale-110 drop-shadow-2xl z-50 flex items-center justify-center ${isExpanded ? 'w-48' : 'w-14'}`}>
               
               <div className="absolute inset-0 bg-[#5C2EE9] blur-[40px] opacity-0 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"></div>
               
               <img 
                 src={logoImg} 
                 alt="Consolida Logo" 
                 className={`h-auto object-contain brightness-0 invert transition-all duration-500 relative z-10 ${isExpanded ? 'w-full opacity-90 group-hover:opacity-20' : 'w-14 opacity-90'}`} 
               />

               {isExpanded && (
                 <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden pointer-events-none" style={{ WebkitMaskImage: `url(${logoImg})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'left center' }}>
                   
                   <div className="absolute top-0 bottom-0 left-0 flex w-[200%] animate-led-continuous">
                      <div className="w-1/2 relative h-full">
                         <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-[#b39afe] to-transparent skew-x-[-15deg] shadow-[0_0_30px_#9d7aff]"></div>
                      </div>
                      <div className="w-1/2 relative h-full">
                         <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-[#b39afe] to-transparent skew-x-[-15deg] shadow-[0_0_30px_#9d7aff]"></div>
                      </div>
                   </div>

                   <img src={logoImg} alt="" className="relative z-10 w-full h-auto object-contain brightness-0 invert mix-blend-overlay opacity-80" />
                 </div>
               )}
            </Link>

            {isExpanded && (
              <div className="flex items-center gap-2 px-1">
                <div className="h-1.5 w-1.5 rounded-full bg-[#5C2EE9] animate-pulse shadow-[0_0_10px_#5C2EE9]"></div>
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Workspace</p>
              </div>
            )}
          </div>

          <nav className="space-y-3">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  title={!isExpanded ? item.label : ""}
                  className={`relative flex items-center ${isExpanded ? 'gap-4 px-4 justify-start' : 'justify-center'} py-3.5 rounded-xl text-xs font-bold uppercase transition-all duration-300 group overflow-hidden ${
                    isActive 
                      ? 'text-white bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(92,46,233,0.15)]' 
                      : 'text-gray-500 hover:bg-white/5 hover:text-gray-300 border border-transparent'
                  }`}>
                  
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#5C2EE9]/20 to-transparent opacity-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'group-hover:opacity-50'}`}></div>
                  <span className={`relative z-10 transition-colors ${isActive ? 'text-[#5C2EE9]' : 'text-gray-500 group-hover:text-white'}`}>{item.icon}</span>
                  {isExpanded && <span className="relative z-10 tracking-wide">{item.label}</span>}
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-[#5C2EE9] rounded-r-full shadow-[0_0_10px_#5C2EE9]"></div>}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div>
           <div className={`border-t border-white/10 pt-6 mb-6 ${isExpanded ? '' : 'flex justify-center'}`}>
              <Link to="/usuarios" title={!isExpanded ? "Administração" : ""} className={`relative flex items-center ${isExpanded ? 'gap-4 px-4 justify-start' : 'justify-center'} py-3.5 rounded-xl text-xs font-bold uppercase transition-all duration-300 group overflow-hidden ${location.pathname === '/usuarios' ? 'text-white bg-blue-500/10 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'text-blue-500/70 hover:bg-blue-500/5 hover:text-blue-400 border border-transparent'}`}>
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 transition-opacity duration-300 ${location.pathname === '/usuarios' ? 'opacity-100' : 'group-hover:opacity-50'}`}></div>
                  <span className="relative z-10"><Shield size={20} /></span>
                  {isExpanded && <span className="relative z-10 tracking-wide">Administração</span>}
                  {location.pathname === '/usuarios' && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_#3b82f6]"></div>}
              </Link>
           </div>
           
           <div className={`flex items-center gap-3 mb-4 ${isExpanded ? 'px-2' : 'justify-center'}`}>
              <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-full border border-white/10 shrink-0" />
              {isExpanded && (
                  <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                  </div>
              )}
           </div>

           <button title={!isExpanded ? "Sair do Sistema" : ""} onClick={handleLogout} className={`flex items-center ${isExpanded ? 'justify-center gap-3 px-4' : 'justify-center'} text-red-500/80 hover:text-red-400 text-xs font-bold uppercase py-3 w-full rounded-xl hover:bg-red-500/10 transition-all group mb-4`}>
              <LogOut size={18} className="group-hover:scale-110 transition-transform shrink-0"/> 
              {isExpanded && <span>Sair do Sistema</span>}
           </button>

           <div className={`flex justify-center border-t border-white/10 pt-4 ${!isExpanded ? 'px-0' : 'px-4'}`}>
              <button 
                onClick={() => setIsDark(!isDark)}
                title="Mudar Tema"
                className={`relative flex items-center p-1 rounded-full overflow-hidden transition-all duration-500 border border-white/10 ${isDark ? 'bg-[#09090b] shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]' : 'bg-blue-300 shadow-[inset_0_0_15px_rgba(59,130,246,0.5)]'} ${isExpanded ? 'w-[72px]' : 'w-10'}`}
              >
                  {/* Fundo dinâmico */}
                  <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'opacity-100 bg-[url("data:image/svg+xml,%3Csvg width=\\\'10\\\' height=\\\'10\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Ccircle cx=\\\'2\\\' cy=\\\'2\\\' r=\\\'1\\\' fill=\\\'%23ffffff33\\\'/%3E%3C/svg%3E")]' : 'opacity-0'}`}></div>
                  
                  {/* O "Toggle" rolante */}
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-transform duration-700 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] z-10 ${isDark ? 'translate-x-0 rotate-0 bg-gray-800 text-yellow-100 border border-white/10' : (isExpanded ? 'translate-x-[32px]' : 'translate-x-[0px]') + ' rotate-[360deg] bg-yellow-400 text-orange-600 border border-yellow-200'}`}>
                      {isDark ? <Moon size={16} className="fill-current"/> : <Sun size={16} className="fill-current"/>}
                  </div>
              </button>
           </div>
        </div>
      </div>
    </>
  );
}