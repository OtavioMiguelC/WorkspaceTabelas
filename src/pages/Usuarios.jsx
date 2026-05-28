import React, { useState } from 'react';
import { Users, Shield, ShieldAlert, ShieldCheck, UserCheck, UserX, CheckCircle2, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Usuarios() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Otávio Miguel', email: 'otavio@consolida.com', role: 'Administrador', status: 'Aprovado', avatar: 'https://ui-avatars.com/api/?name=Otavio+Miguel&background=3b82f6&color=fff' },
    { id: 2, name: 'Ana Souza', email: 'ana@consolida.com', role: 'Analista', status: 'Aprovado', avatar: 'https://ui-avatars.com/api/?name=Ana+Souza&background=10b981&color=fff' },
    { id: 3, name: 'Carlos Lima', email: 'carlos.l@exemplo.com', role: 'Visitante', status: 'Pendente', avatar: 'https://ui-avatars.com/api/?name=Carlos+Lima&background=6b7280&color=fff' },
  ]);
  
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleApprove = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'Aprovado', role: 'Analista' } : u));
    toast.success('Acesso aprovado com sucesso!', { style: { background: '#121212', color: '#fff', border: '1px solid #10b981' } });
  };

  const handleDeny = (id) => {
    setUsers(users.filter(u => u.id !== id));
    toast.error('Acesso negado e usuário removido.', { style: { background: '#121212', color: '#fff', border: '1px solid #ef4444' } });
  };

  const changeRole = (id, newRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    toast.success(`Perfil alterado para ${newRole}.`, { style: { background: '#121212', color: '#fff', border: '1px solid #3b82f6' } });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative z-10">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-pulse"></div>
            <p className="text-blue-500 text-xs font-mono uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Painel de Controle</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
            Administração
          </h1>
          <p className="text-gray-400 mt-2 font-light">Gerencie os acessos, aprove novos cadastros e defina níveis de permissão.</p>
        </div>
      </header>

      {/* CONTROLES E PESQUISA */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center relative z-10">
        
        <div className="relative group w-full md:w-96">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-[#5C2EE9] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-[#121212]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-2 shadow-xl">
                <Search className="text-blue-500 ml-4" size={20}/>
                <input 
                    value={search} onChange={e=>setSearch(e.target.value)}
                    className="w-full bg-transparent p-3 text-white outline-none placeholder-gray-500 ml-2 text-sm font-light" 
                    placeholder="Pesquisar por nome ou e-mail..."
                />
            </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-xs font-bold uppercase text-gray-400 shadow-lg">
                <Users size={16} className="text-blue-500"/> Total: <span className="text-white">{users.length}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-xs font-bold uppercase text-gray-400 shadow-lg">
                <UserCheck size={16} className="text-emerald-500"/> Pendentes: <span className="text-white">{users.filter(u => u.status === 'Pendente').length}</span>
            </div>
        </div>

      </div>

      {/* TABELA DE USUÁRIOS */}
      <div className="relative bg-[#121212]/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] min-h-[500px]">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] pointer-events-none"></div>

         <div className="relative z-10 overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-[#09090b]/80 backdrop-blur-md text-gray-400 text-[10px] uppercase tracking-widest border-b border-white/10">
                    <tr>
                        <th className="p-6 font-bold">Usuário</th>
                        <th className="p-6 font-bold">E-mail</th>
                        <th className="p-6 font-bold">Nível de Acesso</th>
                        <th className="p-6 font-bold text-center">Status</th>
                        <th className="p-6 font-bold text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-6">
                                <div className="flex items-center gap-4">
                                    <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-white/10 shadow-lg group-hover:scale-110 transition-transform"/>
                                    <span className="font-bold text-white text-base">{user.name}</span>
                                </div>
                            </td>
                            <td className="p-6 text-gray-400 font-mono text-xs">{user.email}</td>
                            <td className="p-6">
                                {user.status === 'Pendente' ? (
                                    <span className="text-gray-500 italic text-xs">Aguardando aprovação...</span>
                                ) : (
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => changeRole(user.id, e.target.value)}
                                        className={`bg-black/40 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase outline-none cursor-pointer hover:border-blue-500/50 transition-colors focus:border-blue-500 appearance-none
                                            ${user.role === 'Administrador' ? 'text-blue-400' : 'text-gray-300'}`}
                                    >
                                        <option value="Analista">Analista</option>
                                        <option value="Administrador">Administrador</option>
                                    </select>
                                )}
                            </td>
                            <td className="p-6 text-center">
                                {user.status === 'Aprovado' ? (
                                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                        <CheckCircle2 size={14}/> Aprovado
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                        <ShieldAlert size={14}/> Pendente
                                    </div>
                                )}
                            </td>
                            <td className="p-6 text-right">
                                {user.status === 'Pendente' ? (
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleApprove(user.id)} className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:border-emerald-500 rounded-xl text-emerald-500 hover:text-white transition-all shadow-lg" title="Aprovar Acesso">
                                            <UserCheck size={18}/>
                                        </button>
                                        <button onClick={() => handleDeny(user.id)} className="p-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:border-red-500 rounded-xl text-red-500 hover:text-white transition-all shadow-lg" title="Negar e Remover">
                                            <UserX size={18}/>
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleDeny(user.id)} className="p-2 bg-white/5 border border-white/10 hover:bg-red-500 hover:border-red-500 rounded-lg text-gray-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg" title="Revogar Acesso">
                                        <UserX size={16}/>
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                        <tr><td colSpan="5" className="p-20 text-center text-gray-500">
                            <Shield size={48} className="mx-auto mb-4 opacity-20"/>
                            Nenhum usuário encontrado.
                        </td></tr>
                    )}
                </tbody>
             </table>
         </div>
      </div>

    </div>
  );
}
