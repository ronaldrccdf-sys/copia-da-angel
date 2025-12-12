
import React from 'react';
import { X, Sparkles, Copy, Download, Share2 } from 'lucide-react';
import { Note } from '../types';

interface NotepadProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
}

export const Notepad: React.FC<NotepadProps> = ({ isOpen, onClose, notes }) => {
  return (
    <div 
      className={`fixed inset-y-0 right-0 w-full md:w-96 bg-[#0a0a0a] text-gray-200 shadow-2xl transform transition-transform duration-500 ease-out z-50 flex flex-col border-l border-white/10 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0a0a0a]">
        <div className="flex items-center space-x-3">
          <Sparkles size={18} className="text-maurello-gold" />
          <span className="font-serif text-lg tracking-wide text-gray-100">Anotações da Angel</span>
        </div>
        <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-maurello-blue transition-colors">
                <Sparkles size={14} />
            </button>
            <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
            >
            <X size={20} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-[#0a0a0a]">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-center px-4 opacity-60">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
               <Sparkles size={24} className="text-maurello-gold opacity-50" />
            </div>
            <p className="font-serif text-lg mb-1">Espaço Vazio</p>
            <p className="text-xs font-light">
              Suas anotações e insights aparecerão aqui magicamente durante a conversa.
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div 
              key={note.id} 
              className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-maurello-gold/30 transition-colors group"
            >
              <div className="mb-3">
                <h3 className="font-serif text-xl text-[#e8e6e3] mb-1">{note.title}</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  {new Date(note.date).toLocaleDateString()} • {new Date(note.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {note.items.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="w-1 h-1 rounded-full bg-maurello-gold mt-2 flex-shrink-0 opacity-70"></span>
                    <p className="text-sm text-gray-300 font-light leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="text-gray-500 hover:text-white transition-colors" title="Copiar">
                    <Copy size={14} />
                 </button>
                 <button className="text-gray-500 hover:text-white transition-colors" title="Baixar">
                    <Download size={14} />
                 </button>
                 <button className="text-gray-500 hover:text-white transition-colors" title="Compartilhar">
                    <Share2 size={14} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Branding */}
      <div className="p-4 border-t border-white/5 bg-[#0a0a0a] text-center">
        <p className="text-[10px] text-gray-600 font-light tracking-widest uppercase">
            Gerado automaticamente pela Angel
        </p>
      </div>
    </div>
  );
};
