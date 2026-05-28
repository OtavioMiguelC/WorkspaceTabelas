import React, { useState } from 'react';
import { FileStack, ArrowRight } from 'lucide-react';

export default function TDE() {
  const [limit, setLimit] = useState(500);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cadastro TDE (Pessoas)</h1>
      
      <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#333] flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2 w-full">
             <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><FileStack size={14} className="text-[#5C2EE9]"/> Modelo Excel (Pessoa)</span>
             <input type="file" className="w-full bg-[#121212] border border-[#333] p-2 rounded text-xs text-gray-400"/>
          </div>
          <div className="w-32 space-y-2">
             <span className="text-xs font-bold text-gray-500 uppercase">Linhas/Arq</span>
             <input type="number" value={limit} onChange={e=>setLimit(e.target.value)} className="w-full bg-[#121212] border border-[#333] p-2 rounded text-center font-bold outline-none"/>
          </div>
      </div>

      <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#333] flex flex-col h-[500px]">
         <span className="text-xs font-bold text-gray-500 uppercase mb-2">Cole os dados (CNPJ + TIPO + RAZÃO + VALOR)</span>
         <textarea className="flex-1 bg-[#121212] border border-[#333] rounded-xl p-4 font-mono text-sm text-green-500 outline-none resize-none focus:border-[#5C2EE9]" placeholder="Ex: 12.345.678/0001-90 J RAZAO SOCIAL LTDA R$ 1.500,00"></textarea>
         <button className="mt-4 bg-[#5C2EE9] hover:bg-[#7B4DFF] py-3 rounded-xl font-bold uppercase flex justify-center gap-2 shadow-lg">
            <ArrowRight /> Processar e Gerar Arquivos
         </button>
      </div>
    </div>
  );
}