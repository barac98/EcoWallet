import React, { useState, useEffect } from 'react';
import { Cloud, Loader2 } from 'lucide-react';

export const ServerAwakeWrapper = ({ children }: { children: React.ReactNode }) => {
    const [isServerReady, setIsServerReady] = useState(false);
    const [showWakeUpMessage, setShowWakeUpMessage] = useState(false);

    useEffect(() => {
        // If offline, assume ready (PWA mode)
        if (!navigator.onLine) {
            setIsServerReady(true);
            return;
        }

        let isMounted = true;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            if (isMounted) setShowWakeUpMessage(true);
        }, 1500);

        const checkHealth = async () => {
            try {
                // Try to fetch health endpoint
                // In development, this proxies to localhost:3001
                // In production, it hits the relative path
                const res = await fetch('/api/health', { signal: controller.signal });
                if (res.ok) {
                    if (isMounted) setIsServerReady(true);
                } else {
                    // If 404/500, we proceed anyway to not block the app indefinitely
                    console.warn('Health check failed status:', res.status);
                    if (isMounted) setIsServerReady(true);
                }
            } catch (error: any) {
                console.warn('Server check error (offline or timeout):', error);
                // On error (network failure), allow app to load (offline mode handling)
                if (isMounted) setIsServerReady(true);
            } finally {
                clearTimeout(timeoutId);
                if (isMounted) setShowWakeUpMessage(false);
            }
        };

        checkHealth();

        return () => {
            isMounted = false;
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, []);

    // 1. If Server is Ready, show App
    if (isServerReady) {
        return <>{children}</>;
    }

    // 2. If Waiting > 1.5s, show Wake Up UI
    if (showWakeUpMessage) {
        return (
            <div className="fixed inset-0 z-[100] bg-background-dark flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
                    <Cloud size={48} className="text-primary relative z-10" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75 duration-1000"></div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Waking up the server...</h2>
                <p className="text-slate-400 max-w-xs mb-8 leading-relaxed">
                    This usually takes about <span className="text-white font-bold">30 seconds</span> on the free plan. Hang tight!
                </p>
                
                {/* Indeterminate Progress Bar */}
                <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent w-1/2 animate-[shimmer_1s_infinite] translate-x-[-100%]"></div>
                </div>
                
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(300%); }
                    }
                `}</style>
            </div>
        );
    }

    // 3. Grace Period (0 - 1.5s) - Show minimal loader or nothing to avoid flash
    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );
};