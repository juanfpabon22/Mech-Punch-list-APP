import React, { useRef, useState } from 'react';
import { User, Role, PunchItem, Status, Priority } from '../types';
import { SYSTEMS } from '../constants';
import { StorageService } from '../services/storage';
import * as XLSX from 'xlsx';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  
  // --- EXCEL EXPORT LOGIC (ALL ROLES) ---
  const handleExportExcel = () => {
    const items = StorageService.getItems();
    
    if (items.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    // Map data to Spanish headers for the report
    const dataToExport = items.map(item => {
        const systemName = SYSTEMS.find(s => s.id === item.systemId)?.name || item.systemId;
        return {
            'ID': item.id,
            'Titulo': item.title,
            'Estado': item.status,
            'Prioridad': item.priority,
            'Sistema/Área': systemName,
            'Ubicación': item.location,
            'Asignado A': item.assignedTo,
            'Creado Por': item.createdBy,
            'Fecha Creación': item.createdAt,
            'Descripción': item.description
        };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pendientes Actualizados");
    
    // Generate filename with date
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Reporte_Pendientes_${dateStr}.xlsx`);
  };

  // --- PRINT / PDF REPORT LOGIC (ALL ROLES) ---
  const handlePrintReport = () => {
    const items = StorageService.getItems();
    if (items.length === 0) {
        alert("No hay datos para generar reporte.");
        return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '', 'height=800,width=1000');
    if (!printWindow) {
        alert("Por favor habilita las ventanas emergentes para generar el reporte.");
        return;
    }

    const dateStr = new Date().toLocaleString();

    // Generate HTML Table
    let tableRows = items.map(item => {
        const systemName = SYSTEMS.find(s => s.id === item.systemId)?.name || 'N/A';
        const colorClass = item.status === Status.CLOSED ? 'green' : item.status === Status.OPEN ? 'red' : 'black';
        return `
            <tr>
                <td>${item.id}</td>
                <td><strong>${item.title}</strong><br><small>${item.description}</small></td>
                <td>${systemName}<br><small>${item.location}</small></td>
                <td>${item.assignedTo}</td>
                <td>${item.priority}</td>
                <td style="color:${colorClass}; font-weight:bold;">${item.status}</td>
            </tr>
        `;
    }).join('');

    printWindow.document.write(`
        <html>
            <head>
                <title>Reporte de Pendientes - ${dateStr}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; }
                    h1 { color: #333; }
                    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; font-size: 12px; }
                    th { background-color: #f2f2f2; text-align: left; padding: 10px; border: 1px solid #ddd; }
                    td { padding: 8px; border: 1px solid #ddd; vertical-align: top; }
                    .footer { margin-top: 30px; font-size: 10px; text-align: center; color: #777; }
                    @media print {
                        .no-print { display: none; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1>Reporte de Pendientes</h1>
                        <p>Proyecto: Caldera de Biomasa HPB</p>
                    </div>
                    <div style="text-align:right;">
                        <p>Generado por: ${user.name} (${user.role})</p>
                        <p>Fecha: ${dateStr}</p>
                    </div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th width="5%">ID</th>
                            <th width="35%">Descripción</th>
                            <th width="20%">Ubicación/Sistema</th>
                            <th width="15%">Responsable</th>
                            <th width="10%">Prioridad</th>
                            <th width="15%">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>

                <div class="footer">
                    Documento generado vía Punch List Pro Web App.
                </div>
                
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
  };

  // --- IMPORT LOGIC (CREATOR ONLY) ---
  const handleDownloadTemplate = () => {
    const templateData = [
        {
            Titulo: 'Ej. Fuga en válvula',
            Descripcion: 'Descripción detallada del problema...',
            Ubicacion: 'Nivel 1, Zona Norte',
            Prioridad: 'A', 
            Sistema: 'Torre Norte - Piso 3', 
            Responsable: 'Supervisor 1'
        }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla Importación");
    XLSX.writeFile(wb, "Plantilla_Pendientes.xlsx");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const processImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
            alert("El archivo parece estar vacío.");
            setImporting(false);
            return;
        }

        const newItems: PunchItem[] = jsonData.map((row, index) => {
            const rowSystemName = row['Sistema'] || '';
            const matchedSystem = SYSTEMS.find(s => s.name.toLowerCase().includes(rowSystemName.toLowerCase())) || SYSTEMS[0];
            let priority = Priority.C;
            if (row['Prioridad'] === 'A') priority = Priority.A;
            if (row['Prioridad'] === 'B') priority = Priority.B;

            return {
                id: `pi-import-${Date.now()}-${index}`,
                projectId: 'p1',
                systemId: matchedSystem.id,
                title: row['Titulo'] || 'Sin Título',
                description: row['Descripcion'] || 'Sin descripción',
                status: Status.OPEN,
                priority: priority,
                assignedTo: row['Responsable'] || user.name,
                createdBy: user.name,
                createdAt: new Date().toISOString().split('T')[0],
                location: row['Ubicacion'] || 'General',
                images: [],
                comments: [],
                history: [{
                    id: `h-${Date.now()}-${index}`,
                    action: 'CREATE',
                    description: 'Importado desde Excel',
                    userId: user.id,
                    userName: user.name,
                    userRole: user.role,
                    userAvatar: user.avatar,
                    timestamp: new Date().toLocaleString()
                }]
            } as PunchItem;
        });

        StorageService.importItems(newItems);
        alert(`¡Éxito! Se han importado ${newItems.length} pendientes.`);
        window.location.reload();
    } catch (error) {
        console.error("Import error", error);
        alert("Hubo un error al procesar el archivo.");
    } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pb-24 overflow-y-auto">
        <div className="pt-10 pb-6 flex flex-col items-center">
            <div className="relative">
                <div className="h-24 w-24 rounded-full bg-cover bg-center ring-4 ring-background-light dark:ring-background-dark shadow-lg" style={{ backgroundImage: `url('${user.avatar}')` }}></div>
                <div className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full text-white ring-4 ring-background-light dark:ring-background-dark">
                    <span className="material-symbols-outlined text-sm">edit</span>
                </div>
            </div>
            <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
            <div className="mt-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">{user.role}</div>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        </div>

        <div className="px-4 space-y-6">
            
            {/* --- REPORTES (AVAILABLE FOR ALL ROLES) --- */}
            <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Reportes y Exportación</h3>
                <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-transparent p-4 flex flex-col gap-3">
                    <div className="flex gap-3">
                        <button 
                            onClick={handleExportExcel}
                            className="flex-1 py-3 px-2 rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/10 text-xs font-bold flex flex-col items-center gap-1 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-green-700 dark:text-green-400"
                        >
                            <span className="material-symbols-outlined">table_view</span>
                            Exportar Excel
                        </button>
                        <button 
                            onClick={handlePrintReport}
                            className="flex-1 py-3 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold flex flex-col items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
                        >
                            <span className="material-symbols-outlined">print</span>
                            Informe PDF
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center">
                        Descarga la base de datos completa o genera un reporte imprimible.
                    </p>
                </div>
            </div>

            {/* Data Management Section - ONLY VISIBLE FOR CREATOR ROLE */}
            {user.role === Role.CREATOR && (
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Gestión de Datos (Admin)</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-transparent p-4 flex flex-col gap-3">
                        <div className="flex gap-3">
                            <button 
                                onClick={handleDownloadTemplate}
                                className="flex-1 py-3 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold flex flex-col items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-primary">download</span>
                                Plantilla Excel
                            </button>
                            <button 
                                onClick={handleImportClick}
                                disabled={importing}
                                className="flex-1 py-3 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold flex flex-col items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                {importing ? (
                                    <span className="material-symbols-outlined animate-spin text-primary">refresh</span>
                                ) : (
                                    <span className="material-symbols-outlined text-primary">upload_file</span>
                                )}
                                {importing ? 'Procesando...' : 'Importar Excel'}
                            </button>
                        </div>
                        <input 
                            type="file" 
                            accept=".xlsx, .xls" 
                            ref={fileInputRef} 
                            onChange={processImport}
                            className="hidden"
                        />
                    </div>
                </div>
            )}

            <button onClick={onLogout} className="w-full py-4 rounded-xl border border-red-200 dark:border-red-900/30 text-red-500 font-bold bg-white dark:bg-surface-dark shadow-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                Cerrar Sesión
            </button>
        </div>
    </div>
  );
};

export default Profile;