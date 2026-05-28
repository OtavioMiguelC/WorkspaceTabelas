import React, { useState } from 'react';
import { Database, Play, Terminal, FileBox, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Agendamento() {
  const [log, setLog] = useState(['> Sistema inicializado e pronto.', '> Aguardando input de dados...']);
  const [isProcessing, setIsProcessing] = useState(false);

  const run = () => {
    setIsProcessing(true);
    setLog(prev => [...prev, '> Carregando base de dados...', '> Analisando lote...', '> 0% concluído...']);
    
    setTimeout(() => {
        setLog(prev => [...prev, '> 100% concluído.', '> Processamento finalizado com sucesso.']);
        setIsProcessing(false);
        toast.success('Agendamento processado com sucesso!', {
            style: { borderRadius: '16px', background: 'rgba(18, 18, 18, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }
        });
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-[#5C2EE9] shadow-[0_0_15px_#5C2EE9] animate-pulse"></div>
            <p className="text-[#5C2EE9] text-xs font-mono uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(92,46,233,0.5)]">Módulo TMS</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
            Agendamento
          </h1>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* COLUNA ESQUERDA: CONFIGURAÇÕES */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* CARD: UPLOAD */}
            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transition-all duration-500 hover:border-white/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-10 bg-[#5C2EE9] pointer-events-none"></div>
                
                <h3 className="flex items-center gap-3 font-black text-white tracking-widest uppercase mb-6 drop-shadow-md">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(92,46,233,0.15)]">
                        <Database size={18} className="text-[#5C2EE9]" />
                    </div>
                    Arquivos
                </h3>
                
                <div className="space-y-4 relative z-10">
                    <FileInput label="Base de Dados (Excel/CSV)" />
                    <FileInput label="Modelo de Ocorrência" />
                </div>
            </div>
            
            {/* BOTÃO START */}
            <button 
                onClick={run} 
                disabled={isProcessing}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-[#5C2EE9] to-[#7b4dff] hover:from-[#4c25c9] hover:to-[#5C2EE9] text-white py-4 rounded-2xl font-bold uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(92,46,233,0.3)] hover:shadow-[0_15px_40px_rgba(92,46,233,0.6)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                    {isProcessing ? (
                        <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                    ) : (
                        <Play size={20} fill="currentColor" className="drop-shadow-md"/>
                    )}
                    {isProcessing ? 'Processando...' : 'Iniciar Processamento'}
                </span>
            </button>
        </div>

        {/* COLUNA DIREITA: INPUT + LOGS */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* TEXTAREA INPUT */}
            <div className="flex-1 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-1 shadow-2xl transition-all duration-500 focus-within:border-white/30 focus-within:shadow-[0_0_30px_rgba(255,255,255,0.05)] relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-32 h-32 rounded-full blur-[80px] opacity-10 bg-white pointer-events-none"></div>
                 
                 <textarea 
                    placeholder="Cole aqui: NF + DATA (ex: 12345 25/10/2023)" 
                    className="relative z-10 w-full h-full min-h-[150px] bg-transparent text-gray-200 p-5 outline-none resize-none font-mono text-[13px] placeholder-gray-600 custom-scrollbar"
                 ></textarea>
            </div>

            {/* CONSOLE OUTPUT */}
            <div className="flex-1 min-h-[250px] bg-[#030303]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 font-mono text-[12px] shadow-2xl flex flex-col relative overflow-hidden">
                 
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

                 <div className="flex items-center gap-3 text-gray-500 mb-4 border-b border-white/10 pb-4 relative z-10">
                    <Terminal size={16} className="text-[#5C2EE9]" />
                    <span className="uppercase tracking-widest font-bold">Console Output</span>
                    {isProcessing && <div className="ml-auto flex gap-1"><div className="w-1.5 h-1.5 bg-[#5C2EE9] rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-[#5C2EE9] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div><div className="w-1.5 h-1.5 bg-[#5C2EE9] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div></div>}
                 </div>
                 
                 <div className="overflow-y-auto flex-1 space-y-2 text-emerald-400 relative z-10 custom-scrollbar pr-2">
                    {log.map((l, i) => (
                        <div key={i} className="flex gap-2 opacity-90 animate-in slide-in-from-left-2 duration-300">
                            <span className="text-gray-600 select-none">[{new Date().toLocaleTimeString()}]</span>
                            <span>{l}</span>
                        </div>
                    ))}
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
}

// COMPONENTE DE FILE UPLOAD REFEITO
const FileInput = ({ label }) => (
    <div className="relative group/file">
        <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block group-hover/file:text-[#5C2EE9] transition-colors drop-shadow-md">{label}</label>
        
        <div className="relative overflow-hidden bg-white/5 border border-dashed border-white/20 hover:border-[#5C2EE9]/50 rounded-xl transition-all duration-300">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
            
            <div className="flex items-center gap-3 p-4 relative z-10 pointer-events-none">
                <div className="p-2 bg-black/30 rounded-lg text-gray-400 group-hover/file:text-[#5C2EE9] transition-colors">
                    <FileBox size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-300 group-hover/file:text-white transition-colors">Selecionar arquivo</span>
                    <span className="text-[10px] text-gray-600">CSV, XLS, XLSX</span>
                </div>
            </div>
            
            {/* Efeito Hover interno */}
            <div className="absolute inset-0 bg-[#5C2EE9]/5 translate-y-full group-hover/file:translate-y-0 transition-transform duration-300"></div>
        </div>
    </div>
);