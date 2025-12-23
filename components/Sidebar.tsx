
import React from 'react';
import { Language, ThemeMode } from '../types';
import Jackpot from './Jackpot';

interface SidebarProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  artist: string;
  setArtist: (artist: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  apiKey, setApiKey, language, setLanguage, mode, setMode, artist, setArtist
}) => {
  return (
    <div className="w-80 h-full flex flex-col gap-8 p-6 overflow-y-auto">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">🎨</div>
        <h1 className="text-xl font-bold">AuditFlow AI</h1>
      </div>

      <section>
        <h2 className="text-sm font-semibold opacity-60 mb-4 uppercase tracking-wider">🔑 API Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs mb-2 opacity-80">Gemini API Key</label>
            <input
              type="password"
              placeholder="Enter Key..."
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-sm focus:outline-none focus:border-white/50"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            {process.env.API_KEY && (
              <p className="text-[10px] mt-1 text-green-300">✓ Env key detected</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold opacity-60 mb-4 uppercase tracking-wider">🌍 Localization</h2>
        <select
          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-sm focus:outline-none cursor-pointer"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
        >
          <option value="English" className="text-black">English</option>
          <option value="Traditional Chinese" className="text-black">Traditional Chinese (繁體中文)</option>
        </select>
      </section>

      <section>
        <h2 className="text-sm font-semibold opacity-60 mb-4 uppercase tracking-wider">🌓 Appearance</h2>
        <button
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          className="w-full flex items-center justify-between bg-white/10 border border-white/20 rounded-lg p-3 text-sm hover:bg-white/20 transition-colors"
        >
          <span>{mode === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
          <span>{mode === 'light' ? '☀️' : '🌙'}</span>
        </button>
      </section>

      <Jackpot current={artist} onSelect={setArtist} />

      <div className="mt-auto pt-8 border-t border-white/10">
        <p className="text-[10px] opacity-40 text-center uppercase tracking-widest font-bold">
          Powered by Gemini 3.0 Pro
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
