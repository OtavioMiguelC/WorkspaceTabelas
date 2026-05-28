import React, { useState } from 'react';
import { Clock, MapPinned, Route, RefreshCw, Calendar, FileSpreadsheet, ChevronDown, UploadCloud, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleCard = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const processExcel = async (e, logicName) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2500)),
      {
        loading: `A enviar ${file.name}...`,
        success: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{logicName} processado!</span>,
        error: 'Erro na leitura do ficheiro.',
      },
      {
        style: { borderRadius: '16px', background: 'rgba(18, 18, 18, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' },
        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
      <style>{`
        @keyframes border-glow-spin { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-magic-border { background-size: 200% 200%; animation: border-glow-spin 3s linear infinite; }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Ferramentas Gerais</h1>
          <p className="text-gray-400 mt-2 font-light">Selecione uma ferramenta abaixo para configurar e executar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <GlassCard 
          id="prazos" title="Prazos e Frequência" desc="Cruzamento com Tabela de Prazos."
          icon={<Clock size={24} className="text-white"/>} color="blue"
          isExpanded={expandedId === 'prazos'} onToggle={() => toggleCard('prazos')}
        >
            <div className="grid grid-cols-2 gap-3 mt-2">
                <UploadBtn label="Tabela Prazo" onChange={(e) => processExcel(e, 'TAB_PRAZOS')} />
                <UploadBtn label="Base Dados" onChange={(e) => processExcel(e, 'BASE_PRAZOS')} />
            </div>
        </GlassCard>

        <GlassCard 
          id="ibge" title="Preencher IBGE" desc="Enriquecimento via Cache Local."
          icon={<FileSpreadsheet size={24} className="text-white"/>} color="emerald"
          isExpanded={expandedId === 'ibge'} onToggle={() => toggleCard('ibge')}
        >
            <UploadBtn label="Planilha Destino" onChange={(e) => processExcel(e, 'PREENCH_IBGE')} />
        </GlassCard>

        <GlassCard 
          id="regiao" title="Criar Região" desc="Estruturação CEP/KM."
          icon={<MapPinned size={24} className="text-white"/>} color="purple"
          isExpanded={expandedId === 'regiao'} onToggle={() => toggleCard('regiao')}
        >
             <div className="space-y-3 mb-4">
               <GlassSelect options={["Opção 1: Faixa de Km", "Opção 2: Prazos", "Opção 3: Frete"]} />
               <GlassInput placeholder="Nome da Transportadora" />
             </div>
             <div className="grid grid-cols-2 gap-3">
                <UploadBtn label="Base CEPs" onChange={(e) => processExcel(e, 'REGIAO_BASE')} />
                <UploadBtn label="Tabela Ref." onChange={(e) => processExcel(e, 'REGIAO_TAB')} />
             </div>
        </GlassCard>

        <GlassCard 
          id="rotas" title="Gerar Rotas" desc="Roteirização Logística (Excel)."
          icon={<Route size={24} className="text-white"/>} color="orange"
          isExpanded={expandedId === 'rotas'} onToggle={() => toggleCard('rotas')}
        >
             <div className="space-y-3 mb-4">
               <GlassInput placeholder="CNPJ da Transportadora" />
               <GlassInput placeholder="Código IBGE Origem" />
             </div>
             <div className="grid grid-cols-2 gap-3">
                <UploadBtn label="Planilha 1" onChange={(e) => processExcel(e, 'ROTAS_P1')} />
                <UploadBtn label="Planilha 2" onChange={(e) => processExcel(e, 'ROTAS_P2')} />
             </div>
        </GlassCard>

        <GlassCard 
          id="sn" title="Converter S/N" desc="Normalização Booleana."
          icon={<RefreshCw size={24} className="text-white"/>} color="cyan"
          isExpanded={expandedId === 'sn'} onToggle={() => toggleCard('sn')}
        >
            <UploadBtn label="Processar Ficheiro" onChange={(e) => processExcel(e, 'CONVERT_SN')} />
        </GlassCard>

        <GlassCard 
          id="stqqs" title="Converter STQQS" desc="Parsing de string semanal."
          icon={<Calendar size={24} className="text-white"/>} color="pink"
          isExpanded={expandedId === 'stqqs'} onToggle={() => toggleCard('stqqs')}
        >
            <UploadBtn label="Processar Ficheiro" onChange={(e) => processExcel(e, 'CONVERT_STQQS')} />
        </GlassCard>

      </div>
    </div>
  );
}

function GlassCard({ title, desc, icon, color, children, isExpanded, onToggle }) {
  const styles = {
    blue: { glow: "bg-blue-600", iconBox: "from-blue-500 to-indigo-600", magicBorder: "from-blue-500 via-indigo-400 to-blue-600", text: "text-blue-400" },
    emerald: { glow: "bg-emerald-600", iconBox: "from-emerald-500 to-green-600", magicBorder: "from-emerald-500 via-green-400 to-emerald-600", text: "text-emerald-400" },
    purple: { glow: "bg-purple-600", iconBox: "from-purple-500 to-fuchsia-600", magicBorder: "from-purple-500 via-pink-400 to-purple-600", text: "text-purple-400" },
    orange: { glow: "bg-orange-600", iconBox: "from-orange-500 to-red-600", magicBorder: "from-orange-500 via-yellow-400 to-orange-600", text: "text-orange-400" },
    cyan: { glow: "bg-cyan-600", iconBox: "from-cyan-500 to-blue-600", magicBorder: "from-cyan-500 via-teal-400 to-cyan-600", text: "text-cyan-400" },
    pink: { glow: "bg-pink-600", iconBox: "from-pink-500 to-rose-600", magicBorder: "from-pink-500 via-rose-400 to-pink-600", text: "text-pink-400" },
  };
  const theme = styles[color] || styles.blue;

  return (
    <div onClick={onToggle} className={`group relative w-full rounded-3xl p-[1px] transition-all duration-500 ease-out cursor-pointer overflow-hidden shadow-2xl ${isExpanded ? `bg-gradient-to-r ${theme.magicBorder} animate-magic-border shadow-[0_0_30px_rgba(0,0,0,0.5)]` : 'bg-white/10 hover:bg-white/20 hover:-translate-y-2'}`}>
      <div className="relative w-full h-full bg-[#121212]/80 backdrop-blur-3xl rounded-[23px] overflow-hidden">
        <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full ${theme.glow} opacity-20 blur-[80px] pointer-events-none transition-all duration-700 ease-in-out group-hover:opacity-40 group-hover:scale-125`}></div>

        <div className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center gap-5">
            <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconBox} shadow-lg transform transition-all duration-500 ease-out ${isExpanded ? 'scale-110 rotate-3 shadow-lg shadow-black/20' : 'group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`}>
              {icon}
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-white transition-colors">{title}</h3>
              <span className={`text-xs font-medium transition-colors duration-300 ${isExpanded ? theme.text : 'text-gray-500 group-hover:text-gray-400'}`}>{desc}</span>
            </div>
          </div>
          <div className={`p-2 rounded-full border border-white/5 bg-white/5 transition-all duration-300 ${isExpanded ? 'bg-white/10 rotate-180 text-white' : 'group-hover:bg-white/10 text-gray-500 group-hover:text-white'}`}>
            <ChevronDown size={20} />
          </div>
        </div>

        <div className={`relative z-10 px-6 transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5"></div>
          <div onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
      </div>
    </div>
  );
}

const GlassInput = ({ ...props }) => (
  <input {...props} style={{ fontFamily: "'JetBrains Mono', monospace" }} className="w-full bg-[#09090b]/50 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-emerald-400 placeholder-gray-600 outline-none focus:border-white/30 focus:bg-[#09090b]/90 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all mb-2" />
);

const GlassSelect = ({ options }) => (
  <div className="relative mb-2">
    <select style={{ fontFamily: "'JetBrains Mono', monospace" }} className="w-full bg-[#09090b]/50 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-emerald-400 outline-none focus:border-white/30 appearance-none cursor-pointer">
      {options.map((opt, i) => <option key={i}>{opt}</option>)}
    </select>
    <Settings2 size={16} className="absolute right-4 top-3.5 text-gray-600 pointer-events-none"/>
  </div>
);

const UploadBtn = ({ label, onChange }) => (
  <label className="group relative block w-full cursor-pointer overflow-hidden rounded-xl h-full">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    <div className="relative h-full bg-[#09090b]/70 border border-dashed border-white/20 hover:border-white/50 text-gray-400 hover:text-white py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:bg-[#09090b]/90">
        <UploadCloud size={20} className="text-gray-500 group-hover:text-[#5C2EE9] transition-colors duration-300"/>
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[10px] font-bold uppercase tracking-widest text-center mt-1 text-[#a1a1aa] group-hover:text-white transition-colors">{label}</span>
    </div>
    <input type="file" className="hidden" onChange={onChange} />
  </label>
);