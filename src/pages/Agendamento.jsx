import React, { useState } from 'react';
import { Database, Play, Terminal } from 'lucide-react';

export default function Agendamento() {
  const [log, setLog] = useState(['> Sistema pronto...', '> Aguardando arquivos...']);

  const run = () => {
    setLog(prev => [...prev, '> Carregando base...', '> Processando lote...', '> Concluído com sucesso.']);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-white">Agendamento TMS</h1>
            <p className="text-gray-400">Processamento em lote via Python Threading.</p>
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna de Configuração */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#18181b]/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
                <h3 className="flex items-center gap-2 font-bold mb-6 text-[#5C2EE9]">
                    <Database size={18}/> Arquivos de Entrada
                </h3>
                <div className="space-y-4">
                    <FileInput label="Base de Dados (Excel/CSV)" />
                    <FileInput label="Modelo de Ocorrência" />
                </div>
            </div>
            
            <button onClick={run} className="w-full group relative overflow-hidden bg-[#5C2EE9] hover:bg-[#4c25c9] text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(92,46,233,0.3)] hover:shadow-[0_0_30px_rgba(92,46,233,0.5)]">
                <span className="relative z-10 flex items-center justify-center gap-2"><Play size={18} fill="currentColor"/> Iniciar Processamento</span>
            </button>
        </div>

        {/* Coluna de Input e Log */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex-1 bg-[#18181b]/60 backdrop-blur-md p-1 rounded-2xl border border-white/5">
                 <textarea 
                    placeholder="Cole aqui: NF + DATA (ex: 12345 25/10/2023)" 
                    className="w-full h-40 bg-transparent text-gray-300 p-4 outline-none resize-none font-mono text-sm placeholder-gray-600 focus:bg-white/5 rounded-xl transition-colors"
                 ></textarea>
            </div>

            <div className="flex-1 bg-[#09090b] border border-white/10 rounded-2xl p-4 font-mono text-xs shadow-inner overflow-hidden flex flex-col">
                 <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-white/5 pb-2">
                    <Terminal size={14}/>
                    <span>Console Output</span>
                 </div>
                 <div className="overflow-y-auto space-y-1 text-green-500">
                    {log.map((l, i) => <div key={i} className="animate-pulse">{l}</div>)}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}

const FileInput = ({ label }) => (
    <div className="relative group">
        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block group-hover:text-[#5C2EE9] transition-colors">{label}</label>
        <input type="file" className="block w-full text-xs text-gray-400 
          file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 
          file:text-xs file:font-bold file:bg-[#27272a] file:text-white 
          hover:file:bg-[#5C2EE9] hover:file:text-white transition-all cursor-pointer
          bg-[#09090b]/50 border border-white/10 rounded-xl p-1"
        />
    </div>
);