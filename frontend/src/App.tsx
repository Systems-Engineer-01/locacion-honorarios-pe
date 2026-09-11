import { useState, useEffect } from 'react';
import {
  FileText,
  Calculator,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const [backendStatus, setBackendStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [lastCheck, setLastCheck] = useState<string | null>(null);

  const checkHealth = async () => {
    setBackendStatus('loading');
    try {
      // Intenta vía proxy /api/health o directo a http://localhost:5000/health
      const res = await fetch('/api/health').catch(() => fetch('http://localhost:5000/health'));
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok') {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } else {
        setBackendStatus('error');
      }
    } catch {
      setBackendStatus('error');
    } finally {
      setLastCheck(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between p-6">
      {/* Top Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100 tracking-tight">Locación & Honorarios PE</h1>
            <p className="text-xs text-slate-400">Normativa Civil & Tributaria Peruana</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> Sprint 0 — En construcción
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full my-auto py-12 flex flex-col items-center text-center">
        {/* Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/60 border border-slate-700 text-xs font-medium text-slate-300 mb-6 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Código Civil Art. 1764-1770 & Retención 8% I.R. (SUNAT)
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight max-w-3xl leading-tight mb-4">
          Sistema de Locación de Servicios y Honorarios — Perú
        </h2>

        <p className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Plataforma web para la automatización de contratos civiles para entidades públicas y privadas, y gestión mensual de recibos por honorarios con retención automática del 8%.
        </p>

        {/* Backend Connection Card */}
        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-300">Estado del Backend</span>
            <button
              onClick={checkHealth}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Revisar conexión"
            >
              <RefreshCw className={`w-4 h-4 ${backendStatus === 'loading' ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            {backendStatus === 'loading' && (
              <div className="flex items-center space-x-3 text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
                <span className="font-medium text-sm">Verificando conexión...</span>
              </div>
            )}

            {backendStatus === 'connected' && (
              <div className="flex items-center space-x-3 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-bold text-lg">Backend conectado ✅</span>
              </div>
            )}

            {backendStatus === 'error' && (
              <div className="flex items-center space-x-3 text-rose-400">
                <XCircle className="w-6 h-6" />
                <span className="font-bold text-lg">Desconectado ❌</span>
              </div>
            )}
          </div>

          {lastCheck && (
            <p className="text-xs text-slate-500 mt-3 text-center">
              Última verificación: {lastCheck} • Endpoint: <code className="text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">GET /health</code>
            </p>
          )}
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-12">
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-left">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-1">Generación de Contratos .docx</h3>
            <p className="text-xs text-slate-400">Plantillas personalizadas automatizadas para entidades públicas y privadas.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-left">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-1">Cálculo de Retención (8%)</h3>
            <p className="text-xs text-slate-400">Cálculo automático de retención cuando el recibo supera S/ 1,500 y monto neto.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-4 border-t border-slate-800/80 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Locación & Honorarios PE — Repositorio Scaffold Sprint 0
      </footer>
    </div>
  );
}
