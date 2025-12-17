import React, { useState } from 'react';
import { generateImageReference } from '../services/geminiService';

interface AIGeneratorProps {
  onBack: () => void;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    // In a real app with API Key, we would use:
    // const result = await generateImageReference(prompt, size);
    // setGeneratedImage(result);
    
    // Simulation:
    setTimeout(() => {
        setLoading(false);
        // Placeholder for demo as we don't have a live key in this context usually
        setGeneratedImage('https://lh3.googleusercontent.com/aida-public/AB6AXuAtGEIA4-DZbfH5bM5btackm73wU-WC4uoYdy1zYFuATbPlxQiw34o0vqlHSzKw-Dnln-XA6k3p75CFE3-Cvq9bd6Ni5c9DKEhcsnQ5FDosKDokcxyXvMb2fLeCVJjv6A4svSFAIiRcXf8E1ehwH4pCxUvirxrbI5KMAPCYf9jiHCsO65lpfdwSpF3YJ7h9YVWPKd0iWIXkW4WPuj1ipKqohmX38QBPE7HosFnXfCy4bH7Uh4wruxXPHUqv_azi8hL_4xgzH3x8HOo'); 
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
        <header className="flex items-center justify-between px-4 py-4 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800">
            <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold">Generador de Referencias (AI)</h1>
            <div className="w-10"></div>
        </header>

        <main className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500 rounded-lg text-white">
                        <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Nano Banana Pro</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Generación de imágenes de alta calidad</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descripción de la referencia</label>
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ej. Interior de almacén industrial moderno con iluminación LED..."
                            className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl p-3 h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tamaño</label>
                        <div className="flex gap-2">
                            {['1K', '2K', '4K'].map((s) => (
                                <button 
                                    key={s}
                                    onClick={() => setSize(s as any)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${size === s ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-background-dark'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={loading || !prompt}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">draw</span>}
                        {loading ? 'Generando...' : 'Generar Imagen'}
                    </button>
                </div>
            </div>

            {generatedImage && (
                <div className="space-y-2 animate-fade-in">
                    <h3 className="font-bold text-sm uppercase tracking-wide text-slate-500">Resultado</h3>
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                        <img src={generatedImage} alt="Generated" className="w-full h-auto" />
                    </div>
                    <button className="w-full py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">download</span>
                        Descargar
                    </button>
                </div>
            )}
        </main>
    </div>
  );
};

export default AIGenerator;
