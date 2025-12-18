import React, { useState, useEffect } from 'react';
import { generateImageReference } from '../services/geminiService';

interface AIGeneratorProps {
  onBack: () => void;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    await window.aistudio.openSelectKey();
    setHasKey(true);
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    
    // Verificar clave antes de proceder
    const selected = await window.aistudio.hasSelectedApiKey();
    if (!selected) {
      setHasKey(false);
      return;
    }

    setLoading(true);
    try {
      const result = await generateImageReference(prompt, size);
      setGeneratedImage(result);
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        alert("La API Key seleccionada no es válida o no tiene facturación. Por favor, selecciona una nueva.");
      } else {
        alert("Error al generar la imagen. Por favor intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
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
            {!hasKey && (
              <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-orange-500">key_off</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400">API Key Requerida</p>
                    <p className="text-xs text-orange-600/80 dark:text-orange-400/80">Para generar imágenes de alta calidad (2K/4K), debes vincular una clave de un proyecto con facturación.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleOpenKeySelector}
                    className="flex-1 bg-orange-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Configurar Clave
                  </button>
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold py-2 rounded-lg text-center hover:bg-orange-500/5 transition-colors"
                  >
                    Ver Facturación
                  </a>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500 rounded-lg text-white">
                        <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Imagen Gen Pro</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Calidad industrial con Gemini 3 Pro</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descripción de la referencia</label>
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ej. Detalle de montaje de bridas industriales en caldera de alta presión, estilo fotorealista..."
                            className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl p-3 h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Resolución</label>
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
                        {loading ? 'Generando...' : 'Generar Referencia'}
                    </button>
                </div>
            </div>

            {generatedImage && (
                <div className="space-y-3 animate-fade-in mb-10">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="font-bold text-sm uppercase tracking-wide text-slate-500">Resultado AI</h3>
                      <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">Referencia Visual</span>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                        <img src={generatedImage} alt="Generated" className="w-full h-auto" />
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-sm">
                          <span className="material-symbols-outlined text-lg">download</span>
                          Descargar
                      </button>
                      <button onClick={() => setGeneratedImage(null)} className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-500 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm">
                          <span className="material-symbols-outlined text-lg">delete</span>
                          Limpiar
                      </button>
                    </div>
                </div>
            )}
        </main>
    </div>
  );
};

export default AIGenerator;