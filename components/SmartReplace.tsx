
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { Language } from '../types';

interface SmartReplaceProps {
  apiKey: string;
  language: Language;
}

const SmartReplace: React.FC<SmartReplaceProps> = ({ apiKey, language }) => {
  const [template, setTemplate] = useState('');
  const [data, setData] = useState('');
  const [customPrompt, setCustomPrompt] = useState('Replace all placeholders in the [Template] using information provided in [Data Source]. Maintain the exact formatting and tone of the original template.');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMerge = async () => {
    const key = process.env.API_KEY || apiKey;
    if (!key) {
      alert("API Key required.");
      return;
    }
    if (!template || !data) {
      alert("Template and Data Source are both required.");
      return;
    }

    setIsProcessing(true);
    try {
      const gemini = new GeminiService(key);
      const prompt = `
        System Instruction: ${customPrompt}
        
        [Template]
        ${template}
        
        [Data Source]
        ${data}
      `;
      
      const response = await gemini.generateSummary(prompt, 'gemini-3-flash-preview', 'You are a professional template editor.');
      setResult(response);
    } catch (err) {
      alert("Merge failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-20">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span>🧠</span> {language === 'English' ? 'Agentic Template Processor' : '智慧模板處理器'}
        </h2>
        
        <div className="mb-8">
          <label className="block text-xs mb-3 opacity-60 uppercase tracking-widest font-bold">Replacement Logic (System Prompt)</label>
          <textarea
            className="w-full h-24 bg-black/30 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Describe how the AI should perform replacements..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold opacity-60 uppercase tracking-wider flex items-center gap-2">
              📄 Template Content
            </h3>
            <textarea 
              className="w-full h-80 bg-white/5 border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-white/30 text-sm font-mono leading-relaxed"
              placeholder="Example: Dear [Name], your balance is [Amount]..."
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold opacity-60 uppercase tracking-wider flex items-center gap-2">
              📊 Source Data
            </h3>
            <textarea 
              className="w-full h-80 bg-white/5 border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-white/30 text-sm font-mono leading-relaxed"
              placeholder="Example: Name: Alice, Amount: $500..."
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-10">
          <button 
            onClick={handleMerge}
            disabled={isProcessing}
            className="w-full py-5 bg-white text-black font-black text-lg rounded-2xl hover:scale-[1.01] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <span>✨ MERGE WITH INTELLIGENCE</span>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-bottom duration-500">
          <h3 className="text-xl font-bold mb-6">Generated Result</h3>
          <div className="bg-black/40 p-8 rounded-3xl border border-white/10 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {result}
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(result);
              alert("Copied to clipboard!");
            }}
            className="mt-6 px-6 py-2 bg-white/10 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/20 transition-all"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartReplace;
