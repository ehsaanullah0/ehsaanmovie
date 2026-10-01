import React, { useState, useEffect } from 'react';
import { X, Trash2, Check, Sparkles, ListPlus } from 'lucide-react';
import { useCollection } from '../context/CollectionContext';

export const CustomListModal: React.FC = () => {
  const {
    isListModalOpen,
    setIsListModalOpen,
    editingList,
    setEditingList,
    createCustomList,
    updateCustomList,
    deleteCustomList,
  } = useCollection();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    setIsConfirmingDelete(false);
    if (editingList) {
      setName(editingList.name);
      setDescription(editingList.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [editingList, isListModalOpen]);

  if (!isListModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingList) {
      updateCustomList(editingList.id, name.trim(), '', description);
    } else {
      createCustomList(name.trim(), '', description);
    }
    setIsListModalOpen(false);
    setEditingList(null);
  };

  const handleDelete = () => {
    if (editingList) {
      deleteCustomList(editingList.id);
      setIsListModalOpen(false);
      setEditingList(null);
      setIsConfirmingDelete(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1e1511] border border-[#e4e4e7] dark:border-[#382820] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-[#09090b] dark:text-[#faf6f2]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e4e7] dark:border-[#382820] bg-[#fafafc] dark:bg-[#251a15]">
          <h3 className="text-sm font-extrabold text-[#09090b] dark:text-[#faf6f2] flex items-center gap-2">
            <ListPlus className="w-4 h-4 text-[#caa282]" />
            {editingList ? 'Edit Custom List' : 'Create Custom List'}
          </h3>
          <button
            onClick={() => {
              setIsListModalOpen(false);
              setEditingList(null);
            }}
            className="p-1 rounded-lg text-[#71717a] hover:text-[#09090b] dark:hover:text-[#faf6f2] hover:bg-[#f1f2f4] dark:hover:bg-[#2e2019] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* List Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#71717a] dark:text-[#ad988b] block mb-1.5">
              List Title
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Weekend Noir, Christopher Nolan"
              className="w-full px-4 py-2.5 rounded-xl bg-[#f4f4f5] dark:bg-[#1c1410] border border-[#e4e4e7] dark:border-[#382820] text-sm text-[#09090b] dark:text-[#faf6f2] placeholder-[#a1a1aa] focus:outline-hidden focus:border-[#09090b] dark:focus:border-[#caa282] font-bold"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#71717a] dark:text-[#ad988b] block mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What defines this curated collection?"
              className="w-full px-4 py-2.5 rounded-xl bg-[#f4f4f5] dark:bg-[#1c1410] border border-[#e4e4e7] dark:border-[#382820] text-xs text-[#09090b] dark:text-[#faf6f2] placeholder-[#a1a1aa] focus:outline-hidden focus:border-[#09090b] dark:focus:border-[#caa282] resize-none font-medium"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between">
            {editingList ? (
              isConfirmingDelete ? (
                <div className="flex items-center gap-1.5 animate-in fade-in">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-2.5 py-1.5 rounded-lg text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete?</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    className="text-xs font-semibold text-[#71717a] hover:text-[#09090b] dark:text-[#baa698] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete List
                </button>
              )
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsListModalOpen(false);
                  setEditingList(null);
                }}
                className="px-4 py-2 text-xs font-bold text-[#71717a] dark:text-[#baa698] hover:text-[#09090b] dark:hover:text-[#faf6f2] rounded-xl hover:bg-[#f1f2f4] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-[#caa282] hover:bg-[#d8b598] text-[#231814] rounded-xl transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                {editingList ? 'Save Changes' : 'Create List'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
