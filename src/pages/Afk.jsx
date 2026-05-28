import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export default function Afk() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      onClick={() => navigate(-1)} 
      className="fixed top-0 left-0 w-screen h-screen z-[99999] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#030303] animate-in fade-in duration-1000"
    >
        {/* CSS INJETADO PARA LUZES E RADARES */}
        <style>{`
          @keyframes float-logo { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
          @keyframes ripple-radar { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(4); opacity: 0; } }
          @keyframes led-continuous { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
          
          /* Movimentos das Luzes Vivas (Orbs) */
          @keyframes drift-purple { 0% { transform: translate(0,0) scale(1); } 33% { transform: translate(30vw, 30vh) scale(1.3); } 66% { transform: translate(-20vw, 40vh) scale(0.8); } 100% { transform: translate(0,0) scale(1); } }
          @keyframes drift-blue { 0% { transform: translate(0,0) scale(1); } 33% { transform: translate(-30vw, -20vh) scale(1.2); } 66% { transform: translate(40vw, -10vh) scale(1.4); } 100% { transform: translate(0,0) scale(1); } }
          @keyframes drift-white { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(20vw, -30vh) scale(1.5); } 100% { transform: translate(0,0) scale(1); } }
        `}</style>

        {/* Textura de Ruído */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen z-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

        {/* ==========================================
            LUZES VIVAS SE MOVIMENTANDO (GLOWS)
            ========================================== */}
        {/* Glow Roxo (Logo) */}
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-[#5C2EE9]/15 rounded-full blur-[150px] animate-[drift-purple_25s_infinite_ease-in-out] pointer-events-none z-0"></div>
        
        {/* Glow Azul */}
        <div className="absolute bottom-[20%] right-[10%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[160px] animate-[drift-blue_30s_infinite_ease-in-out] pointer-events-none z-0"></div>
        
        {/* Glow Branco (Estilo Scanner) */}
        <div className="absolute top-[60%] left-[40%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px] animate-[drift-white_20s_infinite_ease-in-out] pointer-events-none z-0"></div>

        {/* ==========================================
            RADARES SECUNDÁRIOS PELO MAPA
            ========================================== */}
        {/* Radar Topo-Direita */}
        <div className="absolute top-[20%] right-[25%] z-0 opacity-30">
           <div className="absolute w-1 h-1 bg-white/50 rounded-full"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/20 rounded-full animate-[ripple-radar_3s_ease-out_infinite] pointer-events-none"></div>
        </div>

        {/* Radar Fundo-Esquerda */}
        <div className="absolute bottom-[25%] left-[20%] z-0 opacity-20">
           <div className="absolute w-1 h-1 bg-[#5C2EE9]/50 rounded-full"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#5C2EE9]/30 rounded-full animate-[ripple-radar_5s_ease-out_infinite] pointer-events-none"></div>
        </div>

        {/* Relógio Gigante Estilo "Vidro Fosco" */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-10">
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-[20vw] font-bold text-white/[0.02] tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.01)] transition-all duration-1000">
                {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}
            </h1>
        </div>

        {/* ==========================================
            ELEMENTO CENTRAL (LOGO + RADAR PRINCIPAL)
            ========================================== */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
            
            {/* Ondas do Radar Central (Roxo vibrante) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#5C2EE9]/40 rounded-full animate-[ripple-radar_4s_cubic-bezier(0.1,0.5,0.8,1)_infinite] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-blue-500/20 rounded-full animate-[ripple-radar_4s_cubic-bezier(0.1,0.5,0.8,1)_infinite_2s] pointer-events-none"></div>

            {/* Logo Flutuante com LED */}
            <div className="relative w-72 md:w-96 mb-8 animate-[float-logo_6s_ease-in-out_infinite]">
                
                {/* Luz de fundo própria da logo */}
                <div className="absolute inset-0 bg-[#5C2EE9] blur-[50px] opacity-30"></div>

                {/* Base da Logo */}
                <img src={logoImg} alt="Consolida" className="relative z-10 w-full h-auto brightness-0 invert opacity-40 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />

                {/* Camada do LED a varrer infinitamente */}
                <div className="absolute inset-0 z-20 overflow-hidden" style={{ WebkitMaskImage: `url(${logoImg})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }}>
                   <div className="absolute top-0 bottom-0 left-0 flex w-[200%] animate-[led-continuous_2.5s_linear_infinite]">
                      <div className="w-1/2 relative h-full">
                         <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-transparent via-[#b39afe] to-transparent skew-x-[-15deg] shadow-[0_0_40px_#9d7aff]"></div>
                      </div>
                      <div className="w-1/2 relative h-full">
                         <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-transparent via-[#b39afe] to-transparent skew-x-[-15deg] shadow-[0_0_40px_#9d7aff]"></div>
                      </div>
                   </div>
                   {/* Capa de vidro da logo */}
                   <img src={logoImg} alt="" className="relative z-10 w-full h-auto brightness-0 invert mix-blend-overlay opacity-80" />
                </div>
            </div>

            {/* Texto de Status Interativo */}
            <div className="flex flex-col items-center gap-3 mt-6 opacity-80 hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(92,46,233,0.15)]">
                  <div className="h-2 w-2 rounded-full bg-[#5C2EE9] animate-ping shadow-[0_0_10px_#5C2EE9]"></div>
                  <p className="text-white tracking-[0.3em] text-[10px] font-bold uppercase drop-shadow-md">
                      Sistema em Standby
                  </p>
                </div>
                
                <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-gray-500 text-[11px] uppercase mt-2 group-hover:text-white transition-colors">
                    Clique em qualquer lugar para retomar
                </p>
            </div>
        </div>
    </div>
  );
}