import React, { useState, useRef } from 'react';
import { User } from '../types';
import { USERS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleLoginSubmit = () => {
    // Buscar por email o nombre
    const foundUser = USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() || 
      u.name.toLowerCase() === email.toLowerCase()
    );

    if (foundUser) {
        if (foundUser.password === password) {
            setError('');
            onLogin(foundUser);
        } else {
            setError('Clave de acceso incorrecta.');
            setPassword('');
            passwordInputRef.current?.focus();
        }
    } else {
        setError('Usuario o correo no registrado.');
    }
  };

  const selectUser = (user: User) => {
    setEmail(user.name);
    setPassword(''); // Asegurar que la contraseña esté vacía
    setError('');
    // Pequeño timeout para asegurar que el input sea enfocable tras el render
    setTimeout(() => {
        passwordInputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background-light dark:bg-background-dark overflow-y-auto">
      <div className="w-full h-64 relative overflow-hidden rounded-b-[2rem] shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10 opacity-90"></div>
        <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: 'url("./imagen.jpg")' }}></div>
        <div className="absolute bottom-6 left-0 w-full z-20 flex justify-center">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white text-4xl">construction</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center pt-6 px-8 shrink-0">
        <h2 className="text-2xl font-bold tracking-tight text-center">Gestión de Punch List</h2>
        <p className="text-base font-semibold text-primary mt-1 text-center">Montaje mecánico - Proyecto Caldera de Biomasa</p>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 text-center">Inicie sesión con su clave personal</p>
      </div>

      <div className="px-8 mt-6 w-full flex-1 pb-10">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Usuario</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nombre o email" 
                className={`w-full bg-white dark:bg-surface-dark border ${error && !password ? 'border-red-500' : 'border-none'} rounded-xl py-3.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary shadow-sm transition-all`}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Clave de acceso</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
              <input 
                ref={passwordInputRef}
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLoginSubmit()}
                placeholder="Introduzca su contraseña" 
                className={`w-full bg-white dark:bg-surface-dark border ${error && (password === '' || error.includes('incorrecta')) ? 'border-red-500' : 'border-none'} rounded-xl py-3.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary shadow-sm`} 
              />
            </div>
            {error && <p className="text-xs text-red-500 ml-1 font-medium">{error}</p>}
          </div>

          <button onClick={handleLoginSubmit} className="mt-4 w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]">
            Entrar
          </button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-300 dark:border-slate-700"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background-light dark:bg-background-dark px-2 text-slate-500 font-bold tracking-widest">Seleccionar Perfil</span></div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {USERS.map(user => (
                <button 
                    key={user.id} 
                    onClick={() => selectUser(user)}
                    className={`flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl border transition-all ${email === user.name ? 'border-primary ring-1 ring-primary/30' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                >
                    <div className="h-10 w-10 rounded-full bg-cover bg-center shrink-0 border-2 border-slate-100 dark:border-slate-800" style={{ backgroundImage: `url('${user.avatar}')` }}></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter">{user.role}</p>
                    </div>
                    <span className={`material-symbols-outlined text-sm ${email === user.name ? 'text-primary' : 'text-slate-300'}`}>
                      {email === user.name ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;