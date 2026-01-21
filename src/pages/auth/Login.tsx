import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, Globe } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { cn } from '@/utils/cn';

// Flag components
function BrazilFlag({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect fill="#009c3b" width="512" height="512" />
            <polygon fill="#ffdf00" points="256,64 480,256 256,448 32,256" />
            <circle fill="#002776" cx="256" cy="256" r="96" />
            <path d="M160,256 Q256,180 352,256" stroke="#fff" strokeWidth="12" fill="none" />
        </svg>
    );
}

function UKFlag({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect fill="#012169" width="512" height="512" />
            <path fill="#fff" d="M0,0 L512,512 M512,0 L0,512" stroke="#fff" strokeWidth="80" />
            <path fill="#C8102E" d="M0,0 L512,512 M512,0 L0,512" stroke="#C8102E" strokeWidth="52" />
            <path fill="#fff" d="M256,0 V512 M0,256 H512" stroke="#fff" strokeWidth="100" />
            <path fill="#C8102E" d="M256,0 V512 M0,256 H512" stroke="#C8102E" strokeWidth="60" />
        </svg>
    );
}

export function Login() {
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);

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

    const handleLanguageSelect = (lang: Language) => {
        setLanguage(lang);
        setIsLanguageOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 relative">
            {/* Language Selector - Top Right */}
            <div className="absolute top-4 right-4">
                <div className="relative">
                    <button
                        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-neutral-200 hover:bg-neutral-50 transition-colors"
                    >
                        {language === 'pt-BR' ? (
                            <BrazilFlag className="w-5 h-5 rounded-sm" />
                        ) : (
                            <UKFlag className="w-5 h-5 rounded-sm" />
                        )}
                        <span className="text-sm font-medium text-neutral-700">
                            {language === 'pt-BR' ? 'Português' : 'English'}
                        </span>
                        <Globe size={16} className="text-neutral-400" />
                    </button>

                    {isLanguageOpen && (
                        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50 min-w-[180px]">
                            <button
                                onClick={() => handleLanguageSelect('pt-BR')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors",
                                    language === 'pt-BR' && "bg-neutral-100"
                                )}
                            >
                                <BrazilFlag className="w-6 h-6 rounded-sm" />
                                <span className="text-sm font-medium text-neutral-700">Português (BR)</span>
                            </button>
                            <button
                                onClick={() => handleLanguageSelect('en-GB')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors",
                                    language === 'en-GB' && "bg-neutral-100"
                                )}
                            >
                                <UKFlag className="w-6 h-6 rounded-sm" />
                                <span className="text-sm font-medium text-neutral-700">English (GB)</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

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
