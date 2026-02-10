import React, { useState } from 'react';
import { User, Users } from 'lucide-react';
import { useUser } from '../UserContext';

const PRESETS = ['Mom', 'Dad', 'Family'];

export const UserSelection = () => {
    const { login } = useUser();
    const [customName, setCustomName] = useState('');

    const handleLogin = (name: string) => {
        if (name.trim()) {
            login(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-surface-dark border border-white/10 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                        <Users size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center">Who is this?</h2>
                    <p className="text-slate-400 text-center mt-2">Select your profile to continue</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {PRESETS.map(name => (
                        <button
                            key={name}
                            onClick={() => handleLogin(name)}
                            className="bg-white/5 hover:bg-white/10 active:scale-95 transition-all p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2 group"
                        >
                            <span className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold group-hover:bg-primary group-hover:text-background-dark transition-colors">
                                {name[0]}
                            </span>
                            <span className="text-white font-medium">{name}</span>
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-surface-dark px-2 text-slate-500">Or type name</span>
                    </div>
                </div>

                <form 
                    onSubmit={(e) => { e.preventDefault(); handleLogin(customName); }}
                    className="mt-6 flex gap-2"
                >
                    <input 
                        type="text" 
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Your Name"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button 
                        type="submit"
                        disabled={!customName.trim()}
                        className="bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-background-dark font-bold px-4 rounded-xl"
                    >
                        <User size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};