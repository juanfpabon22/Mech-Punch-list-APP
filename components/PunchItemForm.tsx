import React, { useState, useRef, useEffect } from 'react';
import { PunchItem, Priority, Status, User, Role } from '../types';
import { editImage } from '../services/geminiService';
import { SYSTEMS, DEFAULT_ASSIGNED_TO } from '../constants';

interface PunchItemFormProps {
  item: PunchItem | null;
  currentUser: User | null;
  onBack: () => void;
  onSave: (item: any) => void;
}

const PunchItemForm: React.FC<PunchItemFormProps> = ({ item, currentUser, onBack, onSave }) => {
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [assignedTo, setAssignedTo] = useState(item?.assignedTo || DEFAULT_ASSIGNED_TO);
  const [systemId, setSystemId] = useState(item?.systemId || '');
  const [selectedPriority, setSelectedPriority] = useState<Priority>(item?.priority || Priority.B);
  
  // Images
  const [images, setImages] = useState<string[]>(item?.images?.map(i => i.url) || []);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  
  // AI
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCreator = currentUser?.role === Role.CREATOR;

  const isFormValid = () => {
    const basicValidation = (
        title.trim() !== '' &&
        description.trim() !== '' &&
        assignedTo !== '' &&
        systemId !== ''
    );
    if (isCreator) return basicValidation;
    return basicValidation && images.length > 0;
  };

  const handleSave = () => {
    if (!isFormValid()) return;
    onSave({
        title,
        description,
        assignedTo,
        systemId,
        priority: selectedPriority,
        images: images.map(url => ({ url, label: 'Evidencia' }))
    });
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setLoading(true);
      try {
        const fileArray = Array.from(files);
        const base64Promises = fileArray.map(file => fileToBase64(file as File));
        const newBase64Images = await Promise.all(base64Promises);
        setImages(prev => [...prev, ...newBase64Images]);
      } catch (error) {
        console.error("Error reading file", error);
        alert("Error al cargar la imagen.");
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setImages(prev => prev.filter((_, i) => i !== index));
    if (activeImageIndex === index) setActiveImageIndex(null);
  };

  const openAiEditor = (index: number) => {
    setActiveImageIndex(index);
    setShowAiModal(true);
    setAiPrompt('');
  };

  const handleAiEdit = async () => {
    if (activeImageIndex === null || !images[activeImageIndex] || !aiPrompt) return;
    
    // Validar clave antes de proceder
    const selected = await window.aistudio.hasSelectedApiKey();
    if (!selected) {
      alert("Debes seleccionar una API Key para usar las funciones de IA.");
      await window.aistudio.openSelectKey();
      return;
    }

    setLoading(true);
    try {
        // Extraer solo la data base64 pura de la URL de datos
        const base64Data = images[activeImageIndex].split(',')[1];
        const result = await editImage(base64Data, aiPrompt);
        
        if (result) {
            const updatedImages = [...images];
            updatedImages[activeImageIndex] = result;
            setImages(updatedImages);
            setShowAiModal(false);
        } else {
            alert("No se pudo procesar la imagen.");
        }
    } catch (error: any) {
        if (error.message?.includes("Requested entity was not found")) {
            alert("API Key no válida. Por favor configúrala de nuevo.");
            await window.aistudio.openSelectKey();
        } else {
            console.error("AI Edit error", error);
            alert("Error al procesar la imagen con IA.");
        }
    } finally {
        setLoading(false);
    }
  };

  const priorityOptions = [
    { value: Priority.A, label: 'Tipo A', description: 'Requerido antes arranque' },
    { value: Priority.B, label: 'Tipo B', description: 'Realizable durante operación' },
    { value: Priority.C, label: 'Tipo C', description: 'Deseable' }
  ];

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pb-24 overflow-hidden">
      <header className="flex items-center justify-between px-4 py-4 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shrink-0">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-lg font-bold">{item ? 'Editar Pendiente' : 'Crear Pendiente'}</h2>
        <button 
            onClick={handleSave} 
            disabled={!isFormValid()}
            className={`text-sm font-bold transition-colors ${isFormValid() ? 'text-primary hover:text-primary-dark' : 'text-slate-400 cursor-not-allowed'}`}
        >
            Guardar
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Detalles Generales</h3>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium ml-1">Asunto *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Grieta en muro perimetral" className="w-full bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            </div>
            
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium ml-1">Sistema / Área *</label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">grid_view</span>
                    <select value={systemId} onChange={(e) => setSystemId(e.target.value)} className="w-full bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3.5 appearance-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer">
                        <option value="">Seleccionar Sistema</option>
                        {SYSTEMS.map(sys => <option key={sys.id} value={sys.id}>{sys.name}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">expand_more</span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium ml-1">Descripción *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe el problema detalladamente..." className="w-full bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 min-h-[120px] focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"></textarea>
            </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold">Clasificación</h3>
            <div className="space-y-4">
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium ml-1">Prioridad</label>
                    <div className="flex flex-col gap-3">
                        {priorityOptions.map((option) => {
                            const isSelected = selectedPriority === option.value;
                            return (
                                <div key={option.value} onClick={() => setSelectedPriority(option.value)} className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${isSelected ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark hover:border-slate-300 dark:hover:border-slate-600'}`}>
                                    <div className={`flex items-center justify-center size-5 rounded-full border transition-colors shrink-0 ${isSelected ? 'border-primary' : 'border-slate-400 dark:border-slate-500'}`}>
                                        {isSelected && <div className="size-2.5 rounded-full bg-primary" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>{option.label}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{option.description}</span>
                                    </div>
                                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Evidencia ({images.length}) {isCreator ? '(Opcional)' : '*'}</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                {images.map((img, idx) => (
                    <div key={idx} onClick={() => openAiEditor(idx)} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95 transition-transform">
                        <img src={img} alt={`Evidencia ${idx}`} className="w-full h-full object-cover" />
                        <button className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm z-10" onClick={(e) => handleRemoveImage(e, idx)}>
                            <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                        <div className="absolute bottom-1 right-1 bg-black/50 backdrop-blur-sm rounded-lg p-1.5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[14px]">auto_fix_high</span>
                        </div>
                    </div>
                ))}
                <button onClick={handleAddImageClick} className="aspect-square rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center gap-1 hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-primary text-2xl">add_a_photo</span>
                    <span className="text-xs font-bold text-primary">Agregar</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
            </div>
        </div>
      </main>

      {showAiModal && activeImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-2xl p-6 shadow-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-500">auto_fix_high</span>
                    Editor AI de Evidencia
                </h3>
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-slate-900 relative border border-slate-700">
                    <img src={images[activeImageIndex]} alt="Preview" className="w-full h-full object-contain" />
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <span className="material-symbols-outlined animate-spin text-white text-3xl">refresh</span>
                        </div>
                    )}
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-medium">Instrucción para mejorar la foto</label>
                    <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Ej. Resalta la grieta con un círculo rojo..." className="w-full bg-slate-100 dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
                    <p className="text-[10px] text-slate-500">Utiliza Gemini 2.5 Flash para procesar visualmente la evidencia.</p>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowAiModal(false)} className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-600 font-semibold text-sm">Cerrar</button>
                    <button onClick={handleAiEdit} disabled={loading || !aiPrompt} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50">
                        {loading ? 'Procesando...' : 'Aplicar AI'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PunchItemForm;