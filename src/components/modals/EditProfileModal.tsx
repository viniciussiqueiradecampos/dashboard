import { X, Camera } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.user_metadata?.name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await updateProfile({
                name,
                avatar_url: avatarUrl
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar perfil');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
                    <h2 className="text-xl font-bold text-neutral-1100 dark:text-white">Editar Perfil</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors dark:text-neutral-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden border-4 border-white dark:border-neutral-900 shadow-md">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-neutral-400">
                                        {name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera size={24} className="text-white" />
                            </div>
                        </div>
                        <p className="text-sm text-neutral-500 mt-2">Clique para alterar (URL)</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Nome</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-12 px-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] outline-none"
                                placeholder="Seu nome"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">URL do Avatar</label>
                            <input
                                type="text"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                className="w-full h-12 px-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] outline-none"
                                placeholder="https://exemplo.com/foto.jpg"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-full border border-neutral-200 dark:border-neutral-700 font-bold dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 h-12 rounded-full bg-neutral-1100 dark:bg-[#D7FF00] text-white dark:text-[#080B12] font-bold hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
