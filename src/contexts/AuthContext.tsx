
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: { name?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const sb = supabase as any;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch current session
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        fetchSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`, // Ajuste conforme sua rota
            },
        });
        if (error) throw error;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const updateProfile = async (updates: { name?: string; avatar_url?: string }) => {
        const { error } = await supabase.auth.updateUser({
            data: {
                name: updates.name,
                avatar_url: updates.avatar_url
            }
        });
        if (error) throw error;

        if (user) {
            const payload: Record<string, any> = {};
            if (updates.name) payload.name = updates.name;
            if (updates.avatar_url !== undefined) payload.avatar_url = updates.avatar_url;

            await sb.from('users').update(payload).eq('id', user.id);
        }

        // Refresh user state
        const { data: { user: updatedUser } } = await supabase.auth.getUser();
        setUser(updatedUser);
    };

    const value: AuthContextType = {
        user,
        session,
        loading,
        signInWithGoogle,
        signOut,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
