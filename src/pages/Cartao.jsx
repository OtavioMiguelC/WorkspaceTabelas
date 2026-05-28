import React, { useState } from 'react';
import { Mail, Plus, Trash2, Paperclip, Send, Truck, Package, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Cartao() {
  const [fila, setFila] = useState([]);
  const [form, setForm] = useState({ nf: '', cliente: '', transp: '', uf: '', data: '', po: '', prot: '', pdf: null });

  const add = () => {
    if(!form.nf) return;
    setFila([...fila, { ...form, id: Date.now() }]);
    setForm({ ...form, nf: '' });
  };

  const dispararEmails = () => {
      toast.success('Envio iniciado em background!', { style: { background: '#121212', color: '#fff' } });
      setFila([]);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10">
      <div>
         <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Cartão de Agendamento</h1>
         <p className="text-gray-400 mt-2 font-light">Monte a fila de disparos e envie e-mails em massa com os PDFs em anexo.</p>
      </div>

      <div className="relative bg-[#121212]/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
         <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-500/10 blur-[100px] pointer-events-none"></div>
         <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/10 blur-[100px] pointer-events-none"></div>

         <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlassInput icon={<Package size={16}/>} label="Nota Fiscal" val={form.nf} onChange={e=>setForm({...form, nf: e.target.value})} />
            <div className="md:col-span-2">
                <GlassInput icon={<User size={16}/>} label="Cliente" val={form.cliente} onChange={e=>setForm({...form, cliente: e.target.value})} />
            </div>
            <GlassInput icon={<Truck size={16}/>} label="Transportadora" val={form.transp} onChange={e=>setForm({...form, transp: e.target.value})} />
            
            <GlassInput label="UF" val={form.uf} onChange={e=>setForm({...form, uf: e.target.value})} />
            <GlassInput label="Data" type="date" val={form.data} onChange={e=>setForm({...form, data: e.target.value})} />
            <GlassInput label="PO (Pedido)" val={form.po} onChange={e=>setForm({...form, po: e.target.value})} />
            <GlassInput label="Protocolo" val={form.prot} onChange={e=>setForm({...form, prot: e.target.value})} />
         </div>

         <div className="relative z-10 flex flex-col md:flex-row gap-4 items-center justify-between pt-6 border-t border-white/10">
             <label className="flex items-center gap-3 bg-[#09090b]/60 border border-white/10 hover:border-orange-500/50 hover:bg-[#09090b]/80 px-5 py-3 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all text-gray-400 hover:text-white group">
                <Paperclip size={18} className="text-orange-500 group-hover:scale-110 transition-transform"/> 
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{form.pdf ? form.pdf : "Anexar PDF da Nota"}</span>
                <input type="file" className="hidden" onChange={e => setForm({...form, pdf: e.target.files[0]?.name})}/>
             </label>

             <button onClick={add} className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <Plus size={16}/> Adicionar à Fila
             </button>
         </div>
      </div>

      <div className="relative bg-[#121212]/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] min-h-[250px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 p-5 border-b border-white/10 flex justify-between items-center bg-[#09090b]/40">
           <span className="font-bold text-sm text-gray-300 uppercase tracking-widest">Fila de Envios <span className="text-[#5C2EE9] ml-2">{fila.length}</span></span>
           {fila.length > 0 && <button onClick={()=>setFila([])} className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18}/></button>}
        </div>
        
        <div className="relative z-10">
            {fila.length === 0 ? (
                <div className="h-60 flex flex-col items-center justify-center text-gray-600">
                    <Mail size={48} className="mb-4 opacity-20"/>
                    <p className="text-sm">Nenhum item na fila. Preencha o card acima.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 bg-[#09090b]/40 text-xs uppercase tracking-wider">
                        <tr><th className="p-4 font-medium">NF</th><th className="p-4 font-medium">Cliente</th><th className="p-4 font-medium">Transp.</th><th className="p-4 font-medium text-center">Anexo</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                        {fila.map(i => (
                            <tr key={i.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-emerald-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{i.nf}</td>
                                <td className="p-4">{i.cliente}</td>
                                <td className="p-4">{i.transp}</td>
                                <td className="p-4 text-center">{i.pdf ? <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-md">PDF OK</span> : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            )}
        </div>
      </div>
        
      {fila.length > 0 && (
        <div className="sticky bottom-8 z-50 animate-in slide-in-from-bottom-4 duration-500">
          <button onClick={dispararEmails} className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 py-5 rounded-2xl font-black uppercase text-lg text-white shadow-[0_10px_40px_rgba(16,185,129,0.4)] flex justify-center gap-3 items-center transition-all hover:-translate-y-1">
             <Send size={24} /> Disparar Emails da Fila
          </button>
        </div>
      )}
    </div>
  );
}

const GlassInput = ({ label, type = "text", val, onChange, icon }) => (
    <div className="w-full">
        <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 flex items-center gap-2 ml-1">
            {icon && <span className="text-[#5C2EE9]">{icon}</span>} {label}
        </label>
        <input 
            type={type} value={val || ''} onChange={onChange} 
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            className="w-full bg-[#09090b]/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-emerald-400 outline-none focus:border-[#5C2EE9] focus:bg-[#09090b]/80 focus:shadow-[0_0_15px_rgba(92,46,233,0.2)] transition-all placeholder-gray-600" 
        />
    </div>
);