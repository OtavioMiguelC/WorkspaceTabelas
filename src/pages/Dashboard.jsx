import React, { useState } from 'react';
import { 
  FileSpreadsheet, Clock, MapPinned, Route, RefreshCw, Calendar, 
  Users, UploadCloud, Play, Download, Terminal, Settings2 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Configuração das 7 Ferramentas disponíveis
const TOOLS = [
  { id: 'ibge', title: 'Base IBGE', desc: 'Preencher Códigos IBGE', icon: <FileSpreadsheet size={20}/>, color: 'emerald' },
  { id: 'prazos', title: 'Prazos/Freq', desc: 'Cruzamento com Tabela', icon: <Clock size={20}/>, color: 'blue' },
  { id: 'regiao', title: 'Criar Região', desc: 'Estruturação CEP/KM', icon: <MapPinned size={20}/>, color: 'purple' },
  { id: 'rotas', title: 'Gerar Rotas', desc: 'Roteirização Logística', icon: <Route size={20}/>, color: 'orange' },
  { id: 'sn', title: 'Conv. S/N', desc: 'Normalização Booleana', icon: <RefreshCw size={20}/>, color: 'cyan' },
  { id: 'stqqs', title: 'Conv. STQQS', desc: 'Parsing de String Semanal', icon: <Calendar size={20}/>, color: 'pink' },
  { id: 'restricoes', title: 'Restrições', desc: 'Geração Massiva de TDE', icon: <Users size={20}/>, color: 'rose' },
];

export default function Dashboard() {
  const [activeTool, setActiveTool] = useState(TOOLS[0]);
  const [files, setFiles] = useState({});
  const [forms, setForms] = useState({ limit: 500, category: 'TDE', type: 'J', useValue: true });
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState(['> Sistema pronto. Selecione uma ferramenta.']);

  const addLog = (msg) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleFile = (key, e) => {
    setFiles({ ...files, [key]: e.target.files[0] });
    addLog(`Arquivo '${e.target.files[0].name}' carregado em [${key}].`);
  };

  const processAPI = async (endpoint, formData) => {
    setIsProcessing(true);
    addLog(`> Iniciando comunicação com API Vercel Python (${endpoint})...`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Erro na API');
      }

      addLog('> Processamento concluído no backend. Baixando arquivo...');
      
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
      
      addLog(`> Arquivo '${filename}' salvo com sucesso!`);
      toast.success('Processamento concluído!', { style: { background: '#121212', color: '#fff', border: '1px solid #10b981' } });
      
    } catch (error) {
      addLog(`[ERRO] ${error.message}`);
      toast.error('Falha no processamento.', { style: { background: '#121212', color: '#fff', border: '1px solid #ef4444' } });
    } finally {
      setIsProcessing(false);
    }
  };

  const executeTool = async () => {
    const fd = new FormData();
    
    switch (activeTool.id) {
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
        if (!files.f1) return toast.error('Anexe a Planilha S/N!');
        fd.append('file', files.f1);
        await processAPI('/api/converter_sn', fd);
        break;

      case 'stqqs':
        if (!files.f1) return toast.error('Anexe a Planilha STQQS!');
        fd.append('file', files.f1);
        await processAPI('/api/converter_stqqs', fd);
        break;

      case 'restricoes':
        if (!forms.textData) return toast.error('Cole os dados!');
        fd.append('texto_rest', forms.textData);
        fd.append('limite_linhas', forms.limit);
        fd.append('categoria', forms.category);
        fd.append('tipo_pessoa', forms.type);
        fd.append('usar_valor', forms.useValue);
        await processAPI('/api/restricoes', fd);
        break;
        
      default:
        toast.error("Ferramenta não implementada.");
    }
  };

  const getThemeVars = (color) => {
    const map = {
      blue: { active: "text-blue-400 bg-blue-500/10 border-blue-500/30", text: "text-blue-400", bgGlow: "bg-blue-500", icon: "text-blue-500" },
      emerald: { active: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-400", bgGlow: "bg-emerald-500", icon: "text-emerald-500" },
      purple: { active: "text-purple-400 bg-purple-500/10 border-purple-500/30", text: "text-purple-400", bgGlow: "bg-purple-500", icon: "text-purple-500" },
      orange: { active: "text-orange-400 bg-orange-500/10 border-orange-500/30", text: "text-orange-400", bgGlow: "bg-orange-500", icon: "text-orange-500" },
      cyan: { active: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30", text: "text-cyan-400", bgGlow: "bg-cyan-500", icon: "text-cyan-500" },
      pink: { active: "text-pink-400 bg-pink-500/10 border-pink-500/30", text: "text-pink-400", bgGlow: "bg-pink-500", icon: "text-pink-500" },
      rose: { active: "text-rose-400 bg-rose-500/10 border-rose-500/30", text: "text-rose-400", bgGlow: "bg-rose-500", icon: "text-rose-500" },
    };
    return map[color] || map.blue;
  };

  const themeVars = getThemeVars(activeTool.color);

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-80px)] space-y-6">
      
      {/* HEADER MASTER-DETAIL */}
      <div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Ferramentas Logísticas</h1>
        <p className="text-gray-400 mt-2 font-light">Selecione uma ferramenta no carrossel abaixo e configure no painel central.</p>
      </div>

      {/* CARROSSEL DE FERRAMENTAS (Master) */}
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {TOOLS.map(tool => {
          const tVars = getThemeVars(tool.color);
          return (
            <button 
              key={tool.id} 
              onClick={() => { setActiveTool(tool); setFiles({}); setLogs([`> Ferramenta '${tool.title}' selecionada.`]); }}
              className={`snap-start shrink-0 relative flex flex-col items-start gap-2 p-5 rounded-2xl border transition-all duration-300 min-w-[200px] shadow-lg
                ${activeTool.id === tool.id 
                  ? `${tVars.active} shadow-[0_0_25px_rgba(255,255,255,0.05)] scale-105 z-10` 
                  : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300'}`}
            >
               <div className="p-2 rounded-lg bg-black/20">{tool.icon}</div>
               <div className="text-left">
                 <h3 className="font-bold text-sm uppercase tracking-wider">{tool.title}</h3>
                 <p className="text-[10px] opacity-70 mt-1">{tool.desc}</p>
               </div>
               {activeTool.id === tool.id && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-current rounded-t-full shadow-[0_0_10px_currentColor]"></div>}
            </button>
          )
        })}
      </div>

      {/* PAINEL DE CONTROLE (Detail) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]">
         
         {/* ESQUERDA: INPUTS & UPLOADS */}
         <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[100px] opacity-10 pointer-events-none ${themeVars.bgGlow}`}></div>
            
            <h2 className={`text-2xl font-black uppercase tracking-widest mb-6 drop-shadow-md ${themeVars.text} flex items-center gap-3`}>
               {activeTool.icon} {activeTool.title}
            </h2>

            <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                {/* RENDERIZAÇÃO DINÂMICA DE CAMPOS COM BASE NA FERRAMENTA */}
                
                {activeTool.id === 'ibge' && (
                  <UploadZone label="Planilha de Base (Excel)" onChange={(e) => handleFile('f1', e)} file={files.f1} />
                )}

                {activeTool.id === 'prazos' && (
                  <div className="space-y-4 h-full flex flex-col">
                    <UploadZone label="1. Planilha DESTINO" onChange={(e) => handleFile('f1', e)} file={files.f1} />
                    <UploadZone label="2. Planilha BASE" onChange={(e) => handleFile('f2', e)} file={files.f2} />
                  </div>
                )}

                {activeTool.id === 'regiao' && (
                  <>
                    <GlassInput label="CNPJ Transportadora Padrão" val={forms.cnpj} onChange={e=>setForms({...forms, cnpj: e.target.value})} />
                    <UploadZone label="Base de Prazos (Excel)" onChange={(e) => handleFile('f1', e)} file={files.f1} />
                  </>
                )}

                {activeTool.id === 'rotas' && (
                  <>
                    <GlassInput label="CNPJ Transp." val={forms.cnpj} onChange={e=>setForms({...forms, cnpj: e.target.value})} />
                    <GlassInput label="Nome Transp." val={forms.transpName} onChange={e=>setForms({...forms, transpName: e.target.value})} />
                    <GlassInput label="Origem (IBGE ou Nome Região)" val={forms.origemVal} onChange={e=>setForms({...forms, origemVal: e.target.value})} />
                    <UploadZone label="Modelo de Região Preenchido" onChange={(e) => handleFile('f1', e)} file={files.f1} />
                  </>
                )}

                {(activeTool.id === 'sn' || activeTool.id === 'stqqs') && (
                  <UploadZone label="Ficheiro Excel para Conversão" onChange={(e) => handleFile('f1', e)} file={files.f1} />
                )}

                {activeTool.id === 'restricoes' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <GlassInput type="number" label="Linhas/Arq" val={forms.limit} onChange={e=>setForms({...forms, limit: e.target.value})} />
                      <GlassInput label="Categoria" val={forms.category} onChange={e=>setForms({...forms, category: e.target.value})} />
                    </div>
                    <GlassInput label="Tipo Pessoa (J/F)" val={forms.type} onChange={e=>setForms({...forms, type: e.target.value})} />
                    <div className="flex-1 min-h-[150px]">
                      <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block ml-1">Dados (CNPJ | Razão | Valor)</label>
                      <textarea 
                        className="w-full h-full bg-[#09090b]/50 border border-white/10 rounded-xl p-4 text-[13px] text-emerald-400 placeholder-gray-600 outline-none focus:border-white/30 resize-none font-mono"
                        placeholder="Ex: 12345678000100 EMPRESA LTDA 250,00"
                        onChange={e=>setForms({...forms, textData: e.target.value})}
                      ></textarea>
                    </div>
                  </>
                )}

            </div>

            <button 
                onClick={executeTool} disabled={isProcessing}
                className={`w-full mt-6 relative overflow-hidden bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg border border-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                <span className="relative z-10 flex items-center justify-center gap-3">
                    {isProcessing ? <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div> : <Play size={20} className="drop-shadow-md"/>}
                    {isProcessing ? 'Processando API...' : 'Executar Processamento'}
                </span>
            </button>
         </div>

         {/* DIREITA: CONSOLE E SAÍDA */}
         <div className="lg:col-span-7 bg-[#030303]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col relative overflow-hidden font-mono">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
            
            <div className="flex items-center gap-3 text-gray-500 mb-4 border-b border-white/10 pb-4 relative z-10">
               <Terminal size={16} className={`${themeVars.icon}`} />
               <span className="uppercase tracking-widest font-bold text-xs">Vercel Backend Console Output</span>
            </div>
            
            <div className="overflow-y-auto flex-1 space-y-2 text-emerald-400 relative z-10 custom-scrollbar pr-2 text-[12px]">
               {logs.map((l, i) => (
                   <div key={i} className="flex gap-2 opacity-90 animate-in slide-in-from-left-2 duration-300">
                       <span className="text-gray-600 select-none opacity-50 shrink-0">~</span>
                       <span>{l}</span>
                   </div>
               ))}
            </div>

            {/* BOTÃO DE DOWNLOAD MODELO CASO EXISTA */}
            <div className="mt-4 pt-4 border-t border-white/10 relative z-10 flex justify-between items-center text-xs text-gray-500">
                <span className="opacity-50">Certifique-se de que os arquivos Modelo estão na raiz do projeto.</span>
                <button onClick={() => window.open('/api/download_base')} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Download size={14}/> Baixar Template Base Vazio
                </button>
            </div>
         </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTES MENORES
// ==========================================
const GlassInput = ({ label, ...props }) => (
  <div className="w-full">
    {label && <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block ml-1">{label}</label>}
    <input {...props} style={{ fontFamily: "'JetBrains Mono', monospace" }} className="w-full bg-[#09090b]/50 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-gray-200 placeholder-gray-600 outline-none focus:border-white/30 focus:bg-[#09090b]/90 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all" />
  </div>
);

const UploadZone = ({ label, onChange, file }) => (
  <label className="group relative block w-full cursor-pointer overflow-hidden rounded-xl h-full min-h-[100px]">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    <div className={`relative h-full border border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${file ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#09090b]/70 border-white/20 hover:border-white/50 text-gray-400 hover:text-white hover:bg-[#09090b]/90'}`}>
        <UploadCloud size={24} className={file ? 'text-emerald-500' : 'text-gray-500 group-hover:text-white'}/>
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[10px] font-bold uppercase tracking-widest text-center mt-1 px-4">
          {file ? file.name : label}
        </span>
    </div>
    <input type="file" className="hidden" onChange={onChange} />
  </label>
);