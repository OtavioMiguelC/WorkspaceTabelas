import React, { useState, useEffect } from 'react';
import { Plus, Circle, CheckCircle2, Trash2, Sun, CalendarDays, AlignLeft } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Importa a conexão com o banco
import { useAuth } from '../contexts/AuthContext'; // Importa o usuário logado

// ==========================================
// COMPONENTE DE LISTA 
// ==========================================
const TaskGroup = ({ title, icon: Icon, tasks, type, themeColor, addTask, updateTaskText, toggleTask, removeTask }) => (
  <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl transition-all duration-500 hover:border-white/20">
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-20 pointer-events-none" style={{ backgroundColor: themeColor }}></div>

    <div className="flex items-center gap-3 mb-6 relative z-10">
      <div className="p-2 rounded-xl bg-white/5 border border-white/10" style={{ boxShadow: `0 0 15px ${themeColor}30` }}>
        <Icon color={themeColor} size={20} />
      </div>
      <h2 className="text-lg font-black text-white tracking-widest uppercase drop-shadow-md">{title}</h2>
      
      <button 
        onClick={() => addTask(type)}
        className="ml-auto flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white px-3 py-1.5 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
      >
        <Plus size={16} /> Novo
      </button>
    </div>

    <div className="space-y-3 relative z-10">
      {tasks.map(task => (
        <div key={task.id} className="flex items-start gap-3 group/task">
          <button 
            onClick={() => toggleTask(type, task)} 
            className="mt-2 flex-shrink-0 transition-transform hover:scale-110"
          >
            {task.completed ? (
              <CheckCircle2 color={themeColor} size={20} className="drop-shadow-[0_0_8px_currentColor]" />
            ) : (
              <Circle size={20} className="text-gray-600 hover:text-white" />
            )}
          </button>
          
          <input
            type="text"
            value={task.text}
            onChange={(e) => updateTaskText(type, task.id, e.target.value)}
            onBlur={() => updateTaskText(type, task.id, task.text, true)} // Salva no banco ao sair do input
            placeholder="Escreva uma tarefa..."
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className={`w-full bg-transparent border border-transparent outline-none py-2 px-3 text-[15px] transition-all duration-300 rounded-xl
              ${task.completed ? 'text-gray-600 line-through opacity-50' : 'text-gray-200'}
              focus:bg-white/5 focus:border-white/20 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] placeholder-gray-700`}
          />
          
          <button 
            onClick={() => removeTask(type, task.id)}
            className="mt-2 opacity-0 group-hover/task:opacity-100 text-gray-600 hover:text-red-500 transition-all hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="pl-10 py-2">
          <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">Nenhuma tarefa. Iniciando sistema vazio...</p>
        </div>
      )}
    </div>
  </div>
);


// ==========================================
// TELA PRINCIPAL
// ==========================================
export default function Workspace() {
  const { user } = useAuth(); // Puxa o usuário logado
  const [dailyTasks, setDailyTasks] = useState([]);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [notes, setNotes] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. CARREGAR DADOS AO ABRIR A TELA
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      // Puxa as Tarefas
      const { data: tasksData } = await supabase.from('tasks').select('*').order('created_at', { ascending: true });
      if (tasksData) {
        setDailyTasks(tasksData.filter(t => t.type === 'daily'));
        setWeeklyTasks(tasksData.filter(t => t.type === 'weekly'));
      }

      // Puxa as Anotações
      const { data: notesData } = await supabase.from('notes').select('content').eq('user_id', user.id).single();
      if (notesData) {
        setNotes(notesData.content);
      }
      setIsLoaded(true);
    };

    loadData();
  }, [user]);

  // 2. AUTO-SAVE DAS ANOTAÇÕES (Espera 1 segundo sem digitar para salvar)
  useEffect(() => {
    if (!isLoaded || !user) return;
    
    const delayDebounceFn = setTimeout(async () => {
      await supabase.from('notes').upsert({ user_id: user.id, content: notes });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [notes, isLoaded, user]);


  // 3. FUNÇÕES DE TAREFAS (Atualizam a tela na hora e salvam no banco no fundo)
  const addTask = async (type) => {
    const { data } = await supabase.from('tasks').insert({ user_id: user.id, type, text: '' }).select().single();
    if (data) {
      if (type === 'daily') setDailyTasks([...dailyTasks, data]);
      else setWeeklyTasks([...weeklyTasks, data]);
    }
  };

  const updateTaskText = async (type, id, text, saveToDb = false) => {
    // Atualiza a tela primeiro (rápido)
    const updater = prev => prev.map(t => t.id === id ? { ...t, text } : t);
    if (type === 'daily') setDailyTasks(updater);
    else setWeeklyTasks(updater);

    // Se saiu do campo (onBlur), salva no banco
    if (saveToDb) {
      await supabase.from('tasks').update({ text }).eq('id', id);
    }
  };

  const toggleTask = async (type, task) => {
    const newCompletedState = !task.completed;
    
    // Atualiza a tela primeiro
    const updater = prev => prev.map(t => t.id === task.id ? { ...t, completed: newCompletedState } : t);
    if (type === 'daily') setDailyTasks(updater);
    else setWeeklyTasks(updater);

    // Atualiza o banco
    await supabase.from('tasks').update({ completed: newCompletedState }).eq('id', task.id);
  };

  const removeTask = async (type, id) => {
    // Tira da tela primeiro
    if (type === 'daily') setDailyTasks(prev => prev.filter(t => t.id !== id));
    else setWeeklyTasks(prev => prev.filter(t => t.id !== id));

    // Deleta do banco
    await supabase.from('tasks').delete().eq('id', id);
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-gray-200 p-8 md:p-12 font-sans selection:bg-[#5C2EE9] selection:text-white">
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-[#5C2EE9] shadow-[0_0_15px_#5C2EE9] animate-pulse"></div>
              <p className="text-[#5C2EE9] text-xs font-mono uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(92,46,233,0.5)]">System Active</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              Minhas Anotações
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5">
            <TaskGroup 
              title="Tarefas de Hoje" icon={Sun} tasks={dailyTasks} type="daily" themeColor="#eab308"
              addTask={addTask} updateTaskText={updateTaskText} toggleTask={toggleTask} removeTask={removeTask}
            />
            <TaskGroup 
              title="Metas da Semana" icon={CalendarDays} tasks={weeklyTasks} type="weekly" themeColor="#5C2EE9"
              addTask={addTask} updateTaskText={updateTaskText} toggleTask={toggleTask} removeTask={removeTask}
            />
          </div>

          <div className="lg:col-span-7">
            <div className="h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:border-white/20 flex flex-col relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-[80px] opacity-10 bg-[#5C2EE9] pointer-events-none"></div>

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <AlignLeft size={20} className="text-gray-300" />
                </div>
                <h2 className="text-lg font-black text-white tracking-widest uppercase drop-shadow-md">Anotações & Rascunhos</h2>
              </div>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Comece a digitar suas anotações aqui... (O sistema salva automaticamente)"
                className="relative z-10 flex-1 w-full min-h-[400px] bg-transparent border-none outline-none resize-none text-gray-300 text-[15px] leading-relaxed placeholder-gray-700 custom-scrollbar focus:text-white transition-colors duration-300"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}