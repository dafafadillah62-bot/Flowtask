/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Filter, 
  Search, 
  Info,
  ChevronRight,
  LayoutList,
  CheckSquare,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: 'low' | 'medium' | 'high';
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskflow_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
      priority: priority,
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
    setPriority('medium');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearAllTasks = () => {
    setTasks([]);
    setShowClearConfirm(false);
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
      })
      .filter(task => 
        task.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [tasks, filter, searchQuery]);

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    percent: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0
  };

  return (
    <div className="min-h-screen bg-purple-50/30 pb-12 pt-[env(safe-area-inset-top)]">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <CheckSquare size={20} />
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight text-slate-800">TaskFlow</h1>
          </div>
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
            title="Panduan Penggunaan"
          >
            <Info size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        {/* Stats Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <LayoutList size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Tugas</p>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Sedang Berjalan</p>
              <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Selesai</p>
              <p className="text-2xl font-bold text-slate-800">{stats.percent}%</p>
            </div>
          </div>
        </motion.div>

        {/* Input Section */}
        <section className="mb-8 space-y-4">
          <form onSubmit={addTask} className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Apa yang ingin Anda kerjakan hari ini?"
              className="w-full h-14 pl-5 pr-16 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium shadow-sm"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 top-2 h-10 w-10 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-purple-200 disabled:shadow-none"
            >
              <Plus size={24} />
            </button>
          </form>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-500">Prioritas:</span>
            <div className="flex bg-slate-200/50 p-1 rounded-xl">
              {[
                { id: 'low', label: 'Rendah', color: 'text-blue-600', activeBg: 'bg-blue-100' },
                { id: 'medium', label: 'Sedang', color: 'text-amber-600', activeBg: 'bg-amber-100' },
                { id: 'high', label: 'Tinggi', color: 'text-rose-600', activeBg: 'bg-rose-100' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    priority === p.id 
                      ? `${p.activeBg} ${p.color} shadow-sm` 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
          <div className="flex bg-purple-100/50 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  filter === f 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : 'Selesai'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari tugas..."
                className="w-full h-10 pl-10 pr-4 bg-white border border-purple-100 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 outline-none transition-all text-sm"
              />
            </div>
            
            {tasks.length > 0 && (
              <div className="flex gap-1">
                {stats.completed > 0 && (
                  <button
                    onClick={clearCompletedTasks}
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                    title="Hapus yang selesai"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                )}
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  title="Hapus semua"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Task List */}
        <section className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className={`group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all ${
                    task.completed ? 'bg-slate-50/50' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 transition-colors ${
                      task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-purple-400'
                    }`}
                  >
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <span className={`flex-grow text-slate-700 font-medium transition-all ${
                    task.completed ? 'line-through text-slate-400' : ''
                  }`}>
                    {task.text}
                    <div className="flex mt-1">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md ${
                        task.priority === 'high' ? 'bg-rose-100 text-rose-600' :
                        task.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {task.priority === 'high' ? 'Tinggi' : task.priority === 'medium' ? 'Sedang' : 'Rendah'}
                      </span>
                    </div>
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="md:opacity-0 md:group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <LayoutList size={40} />
                </div>
                <h3 className="text-slate-500 font-medium">
                  {searchQuery ? 'Tidak ada tugas yang cocok' : 'Belum ada tugas di sini'}
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  {searchQuery ? 'Coba kata kunci lain' : 'Mulai dengan menambahkan tugas baru di atas'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Usage Guide Modal */}
        <AnimatePresence>
          {showGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGuide(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-bold text-slate-800">Panduan Penggunaan</h2>
                    <button 
                      onClick={() => setShowGuide(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <Plus className="rotate-45" size={24} />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Tambah Tugas</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">Ketik rencana Anda di kotak input atas dan tekan tombol "+" atau Enter untuk menyimpan.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Tandai Selesai</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">Klik ikon lingkaran di sebelah kiri tugas untuk menandainya sebagai selesai atau aktif kembali.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Filter & Cari</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">Gunakan tab filter (Semua, Aktif, Selesai) atau kotak pencarian untuk menemukan tugas tertentu dengan cepat.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Hapus Tugas</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">Arahkan kursor ke tugas dan klik ikon tempat sampah yang muncul di sebelah kanan untuk menghapus tugas secara permanen.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowGuide(false)}
                    className="w-full mt-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-purple-200"
                  >
                    Mengerti, Ayo Mulai!
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Clear All Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowClearConfirm(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
              >
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} />
                </div>
                <h2 className="text-xl font-display font-bold text-slate-800 mb-2">Hapus Semua Tugas?</h2>
                <p className="text-slate-600 text-sm mb-8">
                  Tindakan ini tidak dapat dibatalkan. Semua daftar tugas Anda akan dihapus secara permanen.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={clearAllTasks}
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-200"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="max-w-3xl mx-auto px-4 mt-8 text-center">
        <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
          Dibuat dengan <CheckCircle2 size={12} className="text-purple-400" /> untuk produktivitas Anda
        </p>
      </footer>
    </div>
  );
}
