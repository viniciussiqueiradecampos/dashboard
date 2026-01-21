import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Login() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || t('login.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 relative">

            <div className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-xl border border-neutral-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#D7FF00] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm transform -rotate-3">
                        <span className="text-2xl font-bold text-black">m+</span>
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-1100 mb-2">{t('login.welcome')}</h1>
                    <p className="text-neutral-500">{t('login.subtitle')}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 mb-4">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 ml-1">{t('login.email')}</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-0 transition-colors outline-none"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 ml-1">{t('login.password')}</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-black focus:ring-0 transition-colors outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-neutral-1100 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                {t('login.submit')}
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-neutral-500">
                        {t('login.noAccount')}{' '}
                        <Link to="/register" className="text-black font-bold hover:underline">
                            {t('login.createNow')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
