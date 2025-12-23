
import React, { useState } from 'react';
import { Language, ThemeMode, TabType } from './types';
import { ARTIST_STYLES } from './constants';
import Sidebar from './components/Sidebar';
import FileIntelligence from './components/FileIntelligence';
import Dashboard from './components/Dashboard';
import SmartReplace from './components/SmartReplace';

const App: React.FC = () => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [language, setLanguage] = useState<Language>('English');
  const [artist, setArtist] = useState<string>('Van Gogh');
  const [apiKey, setApiKey] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>(TabType.FileIntelligence);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const style = ARTIST_STYLES[artist] || ARTIST_STYLES['Van Gogh'];

  // Global theme classes based on mode
  const themeBase = mode === 'dark' ? 'bg-[#0e1117] text-gray-100' : 'bg-gray-50 text-gray-900';

  return (
    <div 
      className={`flex min-h-screen overflow-hidden transition-colors duration-500 ${themeBase}`}
      style={{
        fontFamily: style.font,
        background: mode === 'dark' ? '#0a0d12' : style.bg,
        backgroundImage: mode === 'dark' ? 'none' : style.grad
      }}
    >
      {/* Dynamic Background Mesh for Wow Effect */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 blur-[100px]"
        style={{
          background: `radial-gradient(circle at top right, ${style.accent}, transparent), radial-gradient(circle at bottom left, #4f46e5, transparent)`
        }}
      />

      <aside className={`relative z-20 h-screen border-r border-white/10 backdrop-blur-3xl bg-black/30 transition-all duration-300 ease-in-out ${sidebarVisible ? 'w-80 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'}`}>
        <Sidebar
          apiKey={apiKey}
          setApiKey={setApiKey}
          language={language}
          setLanguage={setLanguage}
          mode={mode}
          setMode={setMode}
          artist={artist}
          setArtist={setArtist}
        />
      </aside>

      <main className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navigation Tabs */}
        <header className="px-8 lg:px-12 pt-8 pb-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/20 shadow-lg"
                title="Toggle Sidebar"
              >
                {sidebarVisible ? '⬅️' : '➡️'}
              </button>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase italic">
                AuditFlow <span style={{ color: style.accent }}>AI</span>
              </h1>
            </div>
            <div className="flex bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 overflow-x-auto max-w-full">
              {Object.values(TabType).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 lg:px-6 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? 'bg-white text-black shadow-xl scale-105' 
                      : 'hover:bg-white/10 opacity-60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto px-8 lg:px-12 pb-12">
          {activeTab === TabType.FileIntelligence && (
            <FileIntelligence apiKey={apiKey} language={language} />
          )}

          {activeTab === TabType.Pipeline && (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] text-center">
                <div className="text-6xl mb-6">🔄</div>
                <h2 className="text-3xl font-bold mb-4">Pipeline Agents Active</h2>
                <p className="opacity-60 max-w-lg mx-auto mb-8">
                  The multi-agent orchestrator is running. 
                  Agents are validating document integrity based on your selected artist style.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['NODE_ALPHA', 'NODE_BETA', 'NODE_GAMMA'].map((node, i) => (
                    <div key={node} className="p-6 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
                      <p className="text-xs font-bold opacity-40 mb-2 uppercase tracking-widest">{['Parser', 'Validator', 'Writer'][i]}</p>
                      <p className="text-lg font-bold">{node}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === TabType.SmartReplace && (
            <SmartReplace apiKey={apiKey} language={language} />
          )}

          {activeTab === TabType.Dashboard && (
            <Dashboard />
          )}
        </section>
      </main>

      {/* Artist Credit */}
      <div className="fixed bottom-4 right-12 text-[10px] font-bold opacity-30 uppercase tracking-[0.4em] pointer-events-none z-30">
        Style: {artist} Edition / v2.5.0
      </div>
    </div>
  );
};

export default App;
