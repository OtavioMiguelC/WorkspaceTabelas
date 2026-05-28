import React, { useState } from 'react';
import { Search, Copy, RefreshCw, Database } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Ibge() {
  const [data] = useState([
      {id: 4202404, nome: "BLUMENAU", uf: "SC"},
      {id: 3550308, nome: "SAO PAULO", uf: "SP"},
      {id: 3304557, nome: "RIO DE JANEIRO", uf: "RJ"},
      {id: 4106902, nome: "CURITIBA", uf: "PR"},
  ]);
  const [search, setSearch] = useState('');

  const filtered = data.filter(i => i.nome.includes(search.toUpperCase()) || i.uf.includes(search.toUpperCase()));

  const copiar = (id) => {
      navigator.clipboard.writeText(id);
      toast.success(`Código ${id} copiado!`, { style: { background: '#121212', color: '#fff', border: '1px solid #10b981' } });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
         <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Base IBGE</h1>
            <p className="text-gray-400 mt-2 font-light">Consulta rápida de códigos de municípios via Cache Local.</p>
         </div>
         <button className="text-xs font-bold text-[#5C2EE9] bg-[#5C2EE9]/10 border border-[#5C2EE9]/20 hover:bg-[#5C2EE9]/20 hover:border-[#5C2EE9]/50 px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(92,46,233,0.15)]">
            <RefreshCw size={16}/> Sincronizar API
         </button>
      </div>

      <div className="relative group">
         <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5C2EE9] to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
         <div className="relative flex items-center bg-[#121212]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-2 shadow-xl">
            <Search className="text-gray-400 ml-4" size={20}/>
            <input 
                value={search} onChange={e=>setSearch(e.target.value)}
                className="w-full bg-transparent p-3 text-white outline-none placeholder-gray-500 ml-2 text-lg font-light" 
                placeholder="Pesquisar Cidade, UF ou Código IBGE..."
            />
         </div>
      </div>

      <div className="relative bg-[#121212]/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] min-h-[400px]">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] pointer-events-none"></div>

         <div className="relative z-10 overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-[#09090b]/60 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                    <tr>
                        <th className="p-6 font-semibold flex items-center gap-2"><Database size={14}/> Código</th>
                        <th className="p-6 font-semibold">Município</th>
                        <th className="p-6 font-semibold">UF</th>
                        <th className="p-6 font-semibold text-center">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filtered.map(item => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-6 text-emerald-400 font-bold text-[15px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.id}</td>
                            <td className="p-6 font-medium text-gray-200">{item.nome}</td>
                            <td className="p-6 text-gray-400">
                                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs">{item.uf}</span>
                            </td>
                            <td className="p-6 text-center">
                                <button onClick={()=>copiar(item.id)} className="p-2.5 bg-white/5 border border-white/10 hover:bg-[#5C2EE9] hover:border-[#5C2EE9] rounded-lg text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg" title="Copiar">
                                    <Copy size={16}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr><td colSpan="4" className="p-10 text-center text-gray-500">Nenhum município encontrado.</td></tr>
                    )}
                </tbody>
             </table>
         </div>
      </div>
    </div>
  );
}