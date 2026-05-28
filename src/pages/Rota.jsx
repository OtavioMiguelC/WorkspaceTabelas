import React, { useState } from 'react';
import { Map, MapPin, Navigation, Clock, Gauge, Route as RouteIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Rota() {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [calculando, setCalculando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const calcularRota = (e) => {
    e.preventDefault();
    if (!origem || !destino) return;
    
    setCalculando(true);
    setResultado(null);

    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      { loading: 'Mapeando rota via satélite...', success: 'Rota traçada com sucesso!', error: 'Erro ao calcular.' },
      { style: { background: 'rgba(18, 18, 18, 0.9)', color: '#fff', border: '1px solid rgba(16,185,129,0.3)' } }
    ).then(() => {
        setCalculando(false);
        setResultado({ distancia: '458 km', tempo: '06h 30m', pedagios: '4' });
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10">
      <div>
         <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Calculadora de Rotas</h1>
         <p className="text-gray-400 mt-2 font-light">Planejamento logístico: Distância, estimativa de tempo e pedágios.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 relative bg-[#121212]/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden h-fit">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[80px] pointer-events-none"></div>
              
              <h3 className="relative z-10 text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Navigation size={20} className="text-emerald-500"/> Parâmetros
              </h3>

              <form onSubmit={calcularRota} className="relative z-10 space-y-5">
                  <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block ml-1">Origem</label>
                      <div className="relative">
                          <MapPin size={16} className="absolute left-4 top-3.5 text-gray-500" />
                          <input required value={origem} onChange={e=>setOrigem(e.target.value)} placeholder="Ex: São Paulo, SP" className="w-full bg-[#09090b]/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[13px] text-white outline-none focus:border-emerald-500 focus:bg-[#09090b]/80 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all"/>
                      </div>
                  </div>

                  <div className="flex justify-center -my-2 relative z-20">
                      <div className="bg-[#121212] border border-white/10 p-2 rounded-full text-gray-500 shadow-lg"><RouteIcon size={16} className="rotate-90"/></div>
                  </div>

                  <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block ml-1">Destino</label>
                      <div className="relative">
                          <MapPin size={16} className="absolute left-4 top-3.5 text-gray-500" />
                          <input required value={destino} onChange={e=>setDestino(e.target.value)} placeholder="Ex: Curitiba, PR" className="w-full bg-[#09090b]/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[13px] text-white outline-none focus:border-emerald-500 focus:bg-[#09090b]/80 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all"/>
                      </div>
                  </div>

                  <button type="submit" disabled={calculando} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] disabled:opacity-50">
                      {calculando ? 'Roteirizando...' : 'Calcular Rota'}
                  </button>
              </form>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-500 ${resultado ? 'opacity-100 translate-y-0' : 'opacity-30 blur-sm translate-y-4 pointer-events-none'}`}>
                  <ResultCard icon={<Gauge/>} label="Distância" value={resultado?.distancia} color="text-blue-400" />
                  <ResultCard icon={<Clock/>} label="Tempo Est." value={resultado?.tempo} color="text-emerald-400" />
                  <ResultCard icon={<MapPin/>} label="Pedágios" value={resultado?.pedagios} color="text-orange-400" />
              </div>

              <div className="relative flex-1 bg-[#09090b]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] min-h-[400px] flex items-center justify-center group">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                  {!resultado && !calculando && (
                      <div className="relative z-10 flex flex-col items-center text-gray-500 transition-colors">
                          <Map size={48} className="mb-4 opacity-20" />
                          <p className="text-sm font-mono tracking-widest text-center">SISTEMA DE ROTEIRIZAÇÃO<br/><span className="text-[10px] text-gray-600">Aguardando coordenadas...</span></p>
                      </div>
                  )}

                  {calculando && (
                      <div className="relative z-10 flex flex-col items-center text-emerald-500 transition-colors animate-pulse">
                          <Navigation size={48} className="mb-4 opacity-50 animate-bounce" />
                          <p className="text-sm font-mono tracking-widest text-center">MAPEANDO ROTA...</p>
                      </div>
                  )}
                  
                  {resultado && (
                      <div className="absolute inset-0 w-full h-full p-8 flex items-center justify-center animate-in fade-in duration-1000">
                          <style>{`@keyframes dash { to { stroke-dashoffset: -20; } } .animate-path { animation: dash 1s linear infinite; }`}</style>
                          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                              <path d="M 50 150 C 150 150, 150 50, 250 80 S 350 100, 350 50" fill="transparent" stroke="#10b981" strokeWidth="4" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-path" strokeDasharray="10 10"/>
                              <circle cx="50" cy="150" r="6" fill="#10b981" className="animate-pulse drop-shadow-[0_0_10px_#10b981]" />
                              <circle cx="50" cy="150" r="15" fill="none" stroke="#10b981" strokeWidth="2" className="animate-ping opacity-50" />
                              <text x="50" y="175" fill="#a1a1aa" fontSize="10" fontFamily="monospace" textAnchor="middle" className="font-bold">ORIGEM</text>
                              <circle cx="350" cy="50" r="6" fill="#3b82f6" className="animate-pulse drop-shadow-[0_0_10px_#3b82f6]" />
                              <circle cx="350" cy="50" r="15" fill="none" stroke="#3b82f6" strokeWidth="2" className="animate-ping opacity-50" />
                              <text x="350" y="30" fill="#a1a1aa" fontSize="10" fontFamily="monospace" textAnchor="middle" className="font-bold">DESTINO</text>
                          </svg>
                          <div className="absolute bottom-6 left-6 bg-[#09090b]/80 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-lg flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Rota Estabelecida</span>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}

function ResultCard({ icon, label, value, color }) {
    return (
        <div className="bg-[#121212]/40 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex flex-col justify-between items-start gap-4 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full bg-current opacity-10 blur-[30px] transition-all group-hover:scale-150 ${color}`}></div>
            <div className={`relative z-10 p-3 bg-white/5 border border-white/5 rounded-xl ${color} shadow-lg`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div className="relative z-10">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{label}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className={`text-2xl font-black ${color} drop-shadow-md`}>{value || '---'}</p>
            </div>
        </div>
    )
}