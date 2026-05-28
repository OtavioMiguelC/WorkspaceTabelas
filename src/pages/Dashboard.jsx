import React, { useState } from 'react';
import { 
  FileSpreadsheet, Clock, MapPinned, Route, RefreshCw, Calendar, 
  UploadCloud, Play, X, Settings2 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Removida 'restricoes' pois agora tem tela própria
const TOOLS = [
  { id: 'ibge', title: 'Base IBGE', desc: 'Preencher Códigos IBGE', icon: <FileSpreadsheet size={24}/>, color: 'emerald' },
  { id: 'prazos', title: 'Prazos e Frequência', desc: 'Cruzamento com Tabela Base', icon: <Clock size={24}/>, color: 'blue' },
  { id: 'regiao', title: 'Criar Regiões', desc: 'Estruturação CEP/KM', icon: <MapPinned size={24}/>, color: 'purple' },
  { id: 'rotas', title: 'Gerar Rotas', desc: 'Roteirização Logística', icon: <Route size={24}/>, color: 'orange' },
  { id: 'sn', title: 'Converter S/N', desc: 'Normalização Booleana', icon: <RefreshCw size={24}/>, color: 'cyan' },
  { id: 'stqqs', title: 'Converter STQQS', desc: 'Parsing de String Semanal', icon: <Calendar size={24}/>, color: 'pink' },
];

export default function Dashboard() {
  const [activeModal, setActiveModal] = useState(null);
  const [files, setFiles] = useState({});
  const [forms, setForms] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const openModal = (tool) => {
    setActiveModal(tool);
    setFiles({});
    setForms({});
  };

  const handleFile = (key, e) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  const processAPI = async (endpoint, formData) => {
    setIsProcessing(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Erro na API');
      }

      const blob = await response.blob();
      let filename = "Download.xlsx";
      const disposition = response.headers.get('content-disposition');
      if (disposition && disposition.indexOf('filename=') !== -1) {
          filename = disposition.split('filename=')[1].replace(/["']/g, '');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Processamento concluído!', { style: { background: '#121212', color: '#fff', border: '1px solid #10b981' } });
      setActiveModal(null); // Fechar modal em sucesso
    } catch (error) {
      toast.error('Falha no processamento.', { style: { background: '#121212', color: '#fff', border: '1px solid #ef4444' } });
    } finally {
      setIsProcessing(false);
    }
  };

  const executeTool = async () => {
    const fd = new FormData();
    
    switch (activeModal.id) {
      case 'ibge':
        if (!files.f1) return toast.error('Anexe a Planilha de Base!');
        fd.append('file', files.f1);
        await processAPI('/api/processar_ibge', fd);
        break;
        
      case 'prazos':
        if (!files.f1 || !files.f2) return toast.error('Anexe Planilha Destino e Base!');
        fd.append('file_destino', files.f1);
        fd.append('file_base', files.f2);
        await processAPI('/api/processar_prazos', fd);
        break;

      case 'regiao':
        if (!files.f1) return toast.error('Anexe a Planilha de Prazos (Base)!');
        fd.append('file_base', files.f1);
        fd.append('cnpj', forms.cnpj || '00000000000000');
        await processAPI('/api/processar_regiao', fd);
        break;

      case 'rotas':
        if (!files.f1) return toast.error('Anexe o Modelo de Região preenchido!');
        fd.append('file_modelo_regioes', files.f1);
        fd.append('tipo_rota', forms.rotaType || '1: ROTA - PRAZO');
        fd.append('cnpj_rota', forms.cnpj || '0000');
        fd.append('nome_transp_rota', forms.transpName || 'TRANSPORTADORA');
        fd.append('desc_rota', forms.desc || '');
        fd.append('tipo_origem', forms.origemType || 'Região');
        fd.append('valor_origem', forms.origemVal || 'CENTRAL');
        await processAPI('/api/processar_rotas', fd);
        break;

      case 'sn':
      case 'stqqs':
        if (!files.f1) return toast.error('Anexe a Planilha Excel!');
        fd.append('file', files.f1);
        await processAPI(`/api/converter_${activeModal.id}`, fd);
        break;
        
      default:
        toast.error("Ferramenta não implementada.");
    }
  };

  const getThemeVars = (color) => {
    const map = {
      blue: { bg: "bg-blue-600", text: "text-blue-400", border: "border-blue-500/30" },
      emerald: { bg: "bg-emerald-600", text: "text-emerald-400", border: "border-emerald-500/30" },
      purple: { bg: "bg-purple-600", text: "text-purple-400", border: "border-purple-500/30" },
      orange: { bg: "bg-orange-600", text: "text-orange-400", border: "border-orange-500/30" },
      cyan: { bg: "bg-cyan-600", text: "text-cyan-400", border: "border-cyan-500/30" },
      pink: { bg: "bg-pink-600", text: "text-pink-400", border: "border-pink-500/30" },
    };
    return map[color] || map.blue;
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 relative">
      
      <div className="mb-10">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Ferramentas Gerais</h1>
        <p className="text-gray-400 mt-2 font-light">Selecione um processo logístico abaixo para começar.</p>
      </div>

      {/* GRID DE FERRAMENTAS - Visual Limpo (Bento Box / Cards Premium) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map(tool => {
          const tVars = getThemeVars(tool.color);
          return (
            <div 
              key={tool.id} 
              onClick={() => openModal(tool)}
              className="group relative w-full h-[180px] rounded-3xl p-[1px] transition-all duration-500 ease-out cursor-pointer overflow-hidden bg-white/5 hover:bg-white/10 hover:-translate-y-2 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5"
            >
              <div className="relative w-full h-full bg-[#121212]/80 backdrop-blur-md rounded-[23px] p-6 flex flex-col justify-center items-center text-center overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${tVars.bg} opacity-10 blur-[50px] group-hover:opacity-30 transition-all duration-700`}></div>
                
                <div className={`p-4 rounded-2xl bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-500 ${tVars.text}`}>
                  {tool.icon}
                </div>
                
                <h3 className="text-lg font-bold text-white tracking-wide">{tool.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{tool.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* MODAL DE EXECUÇÃO */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay Escuro */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isProcessing && setActiveModal(null)}></div>
          
          {/* Caixa do Modal */}
          <div className="relative w-full max-w-2xl bg-[#09090b] border border-white/10 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className={`p-6 border-b border-white/10 flex justify-between items-center relative overflow-hidden`}>
              <div className={`absolute inset-0 opacity-10 ${getThemeVars(activeModal.color).bg}`}></div>
              <h2 className={`relative z-10 text-2xl font-black uppercase tracking-widest ${getThemeVars(activeModal.color).text} flex items-center gap-3`}>
                {activeModal.icon} {activeModal.title}
              </h2>
              <button disabled={isProcessing} onClick={() => setActiveModal(null)} className="relative z-10 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition">
                <X size={24} />
              </button>
            </div>

            {/* Corpo / Inputs */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {activeModal.id === 'ibge' && (
                  <UploadZone label="Planilha de Base (Excel)" onChange={(e) => handleFile('f1', e)} file={files.f1} />
                )}

                {activeModal.id === 'prazos' && (
                  <div className="grid grid-cols-2 gap-4">
                    <UploadZone label="1. Planilha DESTINO" onChange={(e) => handleFile('f1', e)} file={files.f1} />
                    <UploadZone label="2. Planilha BASE" onChange={(e) => handleFile('f2', e)} file={files.f2} />
                  </div>
                )}

                {activeModal.id === 'regiao' && (
                  <div className="space-y-4">
                    <GlassInput label="CNPJ Transportadora Padrão" val={forms.cnpj} onChange={e=>setForms({...forms, cnpj: e.target.value})} />
                    <UploadZone label="Base de Prazos (Excel)" onChange={(e) => handleFile('f1', e)} file={files.f1} />
                  </div>
                )}

                {activeModal.id === 'rotas' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <GlassInput label="CNPJ Transp." val={forms.cnpj} onChange={e=>setForms({...forms, cnpj: e.target.value})} />
                      <GlassInput label="Nome Transp." val={forms.transpName} onChange={e=>setForms({...forms, transpName: e.target.value})} />
                    </div>
                    <GlassInput label="Origem (IBGE ou Nome Região)" val={forms.origemVal} onChange={e=>setForms({...forms, origemVal: e.target.value})} />
                    <UploadZone label="Modelo de Região Preenchido" onChange={(e) => handleFile('f1', e)} file={files.f1} />
                  </div>
                )}

                {(activeModal.id === 'sn' || activeModal.id === 'stqqs') && (
                  <UploadZone label="Ficheiro Excel para Conversão" onChange={(e) => handleFile('f1', e)} file={files.f1} />
                )}
            </div>

            {/* Footer / Botão de Ação */}
            <div className="p-6 border-t border-white/5 bg-black/20">
              <button 
                  onClick={executeTool} disabled={isProcessing}
                  className={`w-full relative overflow-hidden bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg border border-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                      {isProcessing ? <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div> : <Play size={20} className={`drop-shadow-md ${getThemeVars(activeModal.color).text}`}/>}
                      {isProcessing ? 'Processando...' : 'Iniciar Processamento'}
                  </span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

const GlassInput = ({ label, ...props }) => (
  <div className="w-full">
    {label && <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block ml-1">{label}</label>}
    <input {...props} style={{ fontFamily: "'JetBrains Mono', monospace" }} className="w-full bg-[#09090b]/50 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-gray-200 placeholder-gray-600 outline-none focus:border-white/30 focus:bg-[#09090b]/90 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all" />
  </div>
);

const UploadZone = ({ label, onChange, file }) => (
  <label className="group relative block w-full cursor-pointer overflow-hidden rounded-xl min-h-[120px]">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    <div className={`relative h-full border border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-300 ${file ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/20 hover:border-white/50 text-gray-400 hover:text-white hover:bg-white/10'}`}>
        <UploadCloud size={28} className={file ? 'text-emerald-500' : 'text-gray-500 group-hover:text-white transition-colors'}/>
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[11px] font-bold uppercase tracking-widest text-center px-4">
          {file ? file.name : label}
        </span>
    </div>
    <input type="file" className="hidden" onChange={onChange} />
  </label>
);