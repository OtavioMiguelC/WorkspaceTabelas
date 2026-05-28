import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import logoImg from '../assets/logo.png'; 

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
      if (isLoginMode) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      setIsSuccess(true); 
      setTimeout(() => { navigate('/'); }, 1500);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
      setIsLoggingIn(false);
    } 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      
      {/* Grid e Ruído de Fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] z-0"></div>
      <div className="absolute inset-0 opacity-[0.04] mix-blend-screen z-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Orbs Flutuantes */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/40 rounded-full blur-[120px] animate-float-purple z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] animate-float-blue z-0 pointer-events-none"></div>

      {/* ========================================
          CARD PRINCIPAL
          ======================================== */}
      <div className={`relative z-10 w-full max-w-md p-8 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl transition-all duration-700 ease-in-out flex flex-col items-center
          ${isSuccess ? 'scale-105 border-[#5C2EE9]/30 shadow-[0_0_50px_rgba(92,46,233,0.2)]' : 'shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]'}`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {!isSuccess ? (
          <>
            {/* AREA DA LOGO */}
            <div className="flex flex-col items-center relative z-10 w-full mb-8">
              <div className="relative w-48 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                 <img src={logoImg} alt="Logo" className="w-full h-auto object-contain brightness-0 invert opacity-90" />
              </div>
              <p className="text-gray-400 mt-2 text-sm tracking-widest uppercase font-semibold">
                {isLoginMode ? 'Acesso Restrito' : 'Criar nova conta'}
              </p>
            </div>

            {/* AREA DO FORMULÁRIO */}
            <div className="w-full">
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10 w-full">
                {error && (
                  <div className="p-3 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl text-red-300 text-xs text-center font-medium animate-in slide-in-from-top-2 shadow-lg">
                    {error}
                  </div>
                )}

                {!isLoginMode && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 drop-shadow-md">Nome Completo</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-white transition-colors" size={18} />
                      <input 
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[13px] text-white outline-none focus:border-white/30 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all placeholder-gray-500"
                        placeholder="Seu nome" required disabled={isLoggingIn}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 drop-shadow-md">E-mail Corporativo</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-white transition-colors" size={18} />
                    <input 
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[13px] text-white outline-none focus:border-white/30 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all placeholder-gray-500"
                      placeholder="nome@exemplo.com" required disabled={isLoggingIn}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 drop-shadow-md">Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-white transition-colors" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white outline-none focus:border-white/30 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all placeholder-gray-500"
                      placeholder="••••••••" required disabled={isLoggingIn}
                    />
                    <button 
                      type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors focus:outline-none"
                      disabled={isLoggingIn}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" disabled={isLoggingIn}
                  className="w-full mt-6 bg-gradient-to-r from-[#5C2EE9]/90 to-[#7b4dff]/90 hover:from-[#5C2EE9] hover:to-[#7b4dff] backdrop-blur-md border border-white/10 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(92,46,233,0.3)] hover:shadow-[0_10px_40px_rgba(92,46,233,0.6)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
                >
                  {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : <>{isLoginMode ? 'Entrar no Sistema' : 'Criar Conta'} <ArrowRight size={18} /></>}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button 
                  type="button"
                  onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
                  className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-semibold"
                >
                  {isLoginMode ? 'Não tem uma conta? Registre-se' : 'Já tem conta? Faça Login'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-500">
             <div className="relative mb-8 group animate-in slide-in-from-bottom-10 duration-700 ease-out">
                <div className="absolute inset-0 bg-[#5C2EE9] blur-[40px] opacity-30 animate-pulse"></div>
                <img src={logoImg} alt="Logo" className="w-56 relative z-10 object-contain brightness-0 invert drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
             </div>
             <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2 drop-shadow-md animate-in slide-in-from-bottom-5 fade-in duration-700 delay-150 fill-mode-both">
               {isLoginMode ? 'Bem-vindo' : 'Conta Criada'}
             </h2>
             <p className="text-[#5C2EE9] text-[10px] font-mono mb-10 tracking-widest uppercase animate-in slide-in-from-bottom-2 fade-in duration-700 delay-300 fill-mode-both drop-shadow-[0_0_8px_rgba(92,46,233,0.8)]">Inicializando Workspace...</p>
             <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#5C2EE9] to-[#9d7aff] shadow-[0_0_15px_#5C2EE9] animate-progress"></div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}