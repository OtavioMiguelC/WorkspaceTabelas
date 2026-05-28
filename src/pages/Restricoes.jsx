import React, { useState } from 'react';
import { Users, Play, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Restricoes() {
  const [forms, setForms] = useState({ limit: 500, category: 'TDE', type: 'J', useValue: true, textData: '' });
  const [isProcessing, setIsProcessing] = useState(false);

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
      let filename = "Download.zip";
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
      
    } catch (error) {
      toast.error('Falha no processamento.', { style: { background: '#121212', color: '#fff', border: '1px solid #ef4444' } });
    } finally {
      setIsProcessing(false);
    }
  };

  const executeTool = async () => {
    const fd = new FormData();
    if (!forms.textData) return toast.error('Cole os dados!');
    fd.append('texto_rest', forms.textData);
    fd.append('limite_linhas', forms.limit);
    fd.append('categoria', forms.category);
    fd.append('tipo_pessoa', forms.type);
    fd.append('usar_valor', forms.useValue);
    await processAPI('/api/restricoes', fd);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-600 flex items-center gap-4">
          <Users size={36} className="text-rose-500" /> Restrições de Pessoas
        </h1>
        <p className="text-gray-400 mt-2 font-light">Gere arquivos de cadastro de pessoas separando por valor e limite de linhas.</p>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[120px] opacity-10 pointer-events-none bg-rose-500"></div>
        
        <div className="relative z-10 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassInput type="number" label="Linhas por Arquivo" val={forms.limit} onChange={e=>setForms({...forms, limit: e.target.value})} />
            <GlassInput label="Categoria (TDE, TAE, Outros)" val={forms.category} onChange={e=>setForms({...forms, category: e.target.value})} />
            <GlassInput label="Tipo Pessoa (J ou F)" val={forms.type} onChange={e=>setForms({...forms, type: e.target.value})} />
          </div>

          <div className="flex flex-col min-h-[300px]">
            <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block ml-1">Dados (CNPJ | Razão Social | Valor Opcional)</label>
            <textarea 
              className="w-full flex-1 bg-[#09090b]/50 border border-white/10 rounded-xl p-4 text-[13px] text-emerald-400 placeholder-gray-600 outline-none focus:border-white/30 resize-none font-mono focus:bg-[#09090b]/90 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all"
              placeholder="Ex: 12345678000100 EMPRESA LTDA 250,00"
              onChange={e=>setForms({...forms, textData: e.target.value})}
            ></textarea>
          </div>

          <button 
              onClick={executeTool} disabled={isProcessing}
              className={`w-full relative overflow-hidden bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg border border-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
              <span className="relative z-10 flex items-center justify-center gap-3">
                  {isProcessing ? <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div> : <Play size={20} className="drop-shadow-md text-rose-400"/>}
                  {isProcessing ? 'Gerando Arquivos...' : 'Processar Restrições'}
              </span>
          </button>
        </div>
      </div>
    </div>
  );
}

const GlassInput = ({ label, ...props }) => (
  <div className="w-full">
    {label && <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block ml-1">{label}</label>}
    <input {...props} style={{ fontFamily: "'JetBrains Mono', monospace" }} className="w-full bg-[#09090b]/50 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-gray-200 placeholder-gray-600 outline-none focus:border-white/30 focus:bg-[#09090b]/90 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all" />
  </div>
);
