// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Lock, AlertCircle } from 'lucide-react';

const Login = ({ setAutorizado }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const manejarLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { password });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        setAutorizado(true);
      }
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
            <Lock size={40} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Acceso Restringido</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">Solo el administrador de Cuna Alada puede entrar aquí.</p>
        
        <form onSubmit={manejarLogin} className="space-y-4">
          <input 
            type="password" 
            placeholder="Introduce la contraseña maestra"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm justify-center bg-red-50 p-2 rounded">
              <AlertCircle size={16} /> Clave incorrecta
            </div>
          )}
          <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition">
            Entrar al Panel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;