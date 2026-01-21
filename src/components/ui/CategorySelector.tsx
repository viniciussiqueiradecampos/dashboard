import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Category, TransactionType } from '@/types';

interface CategorySelectorProps {
    categories: Category[];
    selectedCategory: string;
    onSelect: (categoryName: string) => void;
    onAddCategory: (name: string) => void;
    onDeleteCategory?: (id: string) => void;
    type: TransactionType;
    error?: string;
}

export function CategorySelector({
    categories,
    selectedCategory,
    onSelect,
    onAddCategory,
    onDeleteCategory,
    type,
    error
}: CategorySelectorProps) {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const filteredCategories = categories.filter(c => c.type === type);

    const handleAddNew = () => {
        if (newCategoryName.trim()) {
            onAddCategory(newCategoryName.trim());
            setNewCategoryName('');
            setIsAddingNew(false);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Categoria
            </label>

            {/* Category Grid */}
            <div className="flex flex-wrap gap-2 mb-3">
                {filteredCategories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => onSelect(cat.name)}
                        className={cn(
                            "relative flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 group",
                            selectedCategory === cat.name
                                ? "bg-neutral-900 dark:bg-[#D7FF00] border-neutral-900 dark:border-[#D7FF00] text-white dark:text-black"
                                : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                        )}
                    >
                        {cat.icon && <span className="text-sm">{cat.icon}</span>}
                        <span className="text-sm font-medium">{cat.name}</span>

                        {selectedCategory === cat.name && (
                            <div className="w-4 h-4 bg-white dark:bg-black rounded-full flex items-center justify-center ml-1">
                                <Check size={10} className="text-neutral-900 dark:text-[#D7FF00]" />
                            </div>
                        )}

                        {/* Delete button on hover */}
                        {onDeleteCategory && selectedCategory !== cat.name && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteCategory(cat.id);
                                }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full items-center justify-center hidden group-hover:flex hover:bg-red-600 transition-colors"
                            >
                                <X size={10} />
                            </button>
                        )}
                    </button>
                ))}

                {/* Add New Category Button */}
                {!isAddingNew && (
                    <button
                        type="button"
                        onClick={() => setIsAddingNew(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-all"
                    >
                        <Plus size={16} />
                        <span className="text-sm font-medium">Nova</span>
                    </button>
                )}
            </div>

            {/* Add New Category Input */}
            {isAddingNew && (
                <div className="flex gap-2 animate-in slide-in-from-top-2 duration-200">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Nome da categoria..."
                        className="flex-1 h-11 px-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#D7FF00] outline-none transition-all"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddNew();
                            }
                            if (e.key === 'Escape') {
                                setIsAddingNew(false);
                                setNewCategoryName('');
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleAddNew}
                        disabled={!newCategoryName.trim()}
                        className="px-4 h-11 bg-neutral-900 dark:bg-[#D7FF00] text-white dark:text-black rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Adicionar
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsAddingNew(false);
                            setNewCategoryName('');
                        }}
                        className="px-3 h-11 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-xs mt-2">{error}</p>
            )}

            {/* Empty state */}
            {filteredCategories.length === 0 && !isAddingNew && (
                <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-2">
                    Nenhuma categoria cadastrada. Clique em "Nova" para criar uma.
                </p>
            )}
        </div>
    );
}
