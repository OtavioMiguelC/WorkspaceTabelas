import React, { useState } from 'react';
import { FileStack, ArrowRight, Activity, Terminal, Database } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TDE() {
  const [limit, setLimit] = useState(500);
  const [data, setData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processData = () => {
    if (!data) return;
    setIsProcessing(true);
    
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      { loading: 'Validando e estruturando dados...', success: 'Arquivos gerados com sucesso!', error: 'Erro ao processar.' },
      { style: { borderRadius: '16px', background: 'rgba(18, 18, 18, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' } }
    ).then(() => {
        setIsProcessing(false);
        setData('');
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative z-10">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_15px_#ec4899] animate-pulse"></div>
            <p className="text-pink-500 text-xs font-mono uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">Cadastro Massivo</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
            Cadastro TDE
          </h1>
          <p className="text-gray-400 mt-2 font-light">Importação e validação de base de Pessoas via Texto/Excel.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUNA ESQUERDA: CONFIGS E INFOS */}
          <div className="lg:col-span-4 space-y-6">
              
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transition-all duration-500 hover:border-white/20 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-10 bg-pink-500 pointer-events-none"></div>
                  
                  <h3 className="flex items-center gap-3 font-black text-white tracking-widest uppercase mb-6 drop-shadow-md relative z-10">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
                          <Activity size={18} className="text-pink-500" />
                      </div>
                      Parâmetros
                  </h3>

                  <div className="space-y-5 relative z-10">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                             <FileStack size={14} className="text-pink-500"/> Modelo Excel (Pessoa)
                         </label>
                         <input type="file" className="block w-full text-xs text-gray-400 
                            file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 
                            file:text-xs file:font-bold file:bg-white/10 file:text-white 
                            hover:file:bg-pink-500/20 hover:file:text-pink-400 transition-all cursor-pointer
                            bg-white/5 border border-white/10 rounded-xl p-1"
                         />
                      </div>

                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                             <Database size={14} className="text-pink-500"/> Limite de Linhas/Arq
                         </label>
                         <input type="number" value={limit} onChange={e=>setLimit(e.target.value)} style={{ fontFamily: "'JetBrains Mono', monospace" }} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-pink-400 font-bold outline-none focus:border-pink-500/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(236,72,153,0.15)] transition-all"/>
                      </div>
                  </div>
              </div>

              {/* Dica de Formato */}
              <div className="bg-pink-500/5 border border-pink-500/10 p-5 rounded-3xl backdrop-blur-md">
                 <p className="text-[10px] uppercase font-bold text-pink-500 mb-2 tracking-widest">Formato Esperado</p>
                 <p className="text-gray-400 text-xs leading-relaxed" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Cole os dados brutos no console ao lado. O sistema espera que cada linha contenha pelo menos o <strong>CNPJ</strong>, o <strong>TIPO</strong> e a <strong>RAZÃO SOCIAL</strong>.
                 </p>
              </div>
          </div>

          {/* COLUNA DIREITA: CONSOLE INPUT E BOTÃO */}
          <div className="lg:col-span-8 flex flex-col gap-6">
              
              <div className="flex-1 bg-[#030303]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-1 shadow-2xl transition-all duration-500 focus-within:border-pink-500/30 focus-within:shadow-[0_0_30px_rgba(236,72,153,0.1)] relative overflow-hidden group min-h-[400px] flex flex-col">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-10 bg-pink-500 pointer-events-none transition-opacity duration-500 group-focus-within:opacity-20"></div>

                  <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-white/5 relative z-10">
                      <Terminal size={16} className="text-pink-500" />
                      <span className="uppercase tracking-widest font-bold text-gray-300 text-xs">Console de Dados</span>
                  </div>

                  <textarea 
                      value={data} onChange={e=>setData(e.target.value)}
                      placeholder="Ex: 12.345.678/0001-90 J RAZAO SOCIAL LTDA R$ 1.500,00"
                      className="relative z-10 flex-1 w-full bg-transparent p-6 text-pink-400 outline-none resize-none font-mono text-[13px] placeholder-gray-700 custom-scrollbar leading-relaxed"
                  ></textarea>
              </div>

              <button 
                  onClick={processData}
                  disabled={isProcessing || !data}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(236,72,153,0.3)] hover:shadow-[0_15px_40px_rgba(236,72,153,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                  <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none"></div>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                     {isProcessing ? <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div> : 'Processar e Gerar Arquivos'}
                     {!isProcessing && <ArrowRight size={20} />}
                  </span>
              </button>

          </div>
      </div>
    </div>
  );
}