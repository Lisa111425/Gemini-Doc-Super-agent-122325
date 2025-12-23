
import React, { useState, useEffect, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { FILE_ANALYSIS_PROMPT } from '../constants';
import { Language } from '../types';
import mammoth from 'mammoth';

// Importing pdfjs via global script loaded in index.html
declare const pdfjsLib: any;

interface FileIntelligenceProps {
  apiKey: string;
  language: Language;
}

const FileIntelligence: React.FC<FileIntelligenceProps> = ({ apiKey, language }) => {
  const [fileContent, setFileContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('gemini-3-flash-preview');
  const [chatModel, setChatModel] = useState('gemini-3-flash-preview');
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [transformType, setTransformType] = useState<'markdown' | 'text'>('markdown');

  // File Preview States
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'txt' | 'md' | null>(null);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    if (file.name.endsWith('.docx')) {
      setFileType('docx');
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          // Extraction for analysis
          const resultText = await mammoth.extractRawText({ arrayBuffer });
          setFileContent(resultText.value);
          // Preview as HTML
          const resultHtml = await mammoth.convertToHtml({ arrayBuffer });
          setDocxHtml(resultHtml.value);
        } catch (err) {
          alert("Error parsing DOCX file.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith('.pdf')) {
      setFileType('pdf');
      const reader = new FileReader();
      reader.onload = async (event) => {
        const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
        try {
          // Initialize PDF.js
          const pdfjs = await import('https://esm.sh/pdfjs-dist@^4.0.379');
          pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;
          const pdf = await pdfjs.getDocument(typedarray).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            fullText += pageText + "\n";
          }
          setFileContent(fullText);
        } catch (err) {
          console.error(err);
          alert("Error parsing PDF file. Please ensure pdfjs is loaded.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setFileType('txt');
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFileContent(text);
      };
      reader.readAsText(file);
    }
  };

  const generateDeepSummary = async () => {
    const key = process.env.API_KEY || apiKey;
    if (!key) {
      alert("Please provide an API Key in the settings.");
      return;
    }
    if (!fileContent) {
      alert("Please upload or paste content first.");
      return;
    }

    setIsLoading(true);
    try {
      const customPrompt = `${FILE_ANALYSIS_PROMPT}\nPlease ensure the output is in ${transformType.toUpperCase()} format.`;
      const gemini = new GeminiService(key);
      const res = await gemini.generateSummary(fileContent, model, customPrompt);
      setSummary(res);
    } catch (err) {
      alert("Error generating summary.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = async () => {
    const key = process.env.API_KEY || apiKey;
    if (!key || !fileContent || !chatQuery) return;

    setIsChatting(true);
    try {
      const gemini = new GeminiService(key);
      const res = await gemini.chatWithFile(fileContent, chatQuery, chatModel);
      setChatResponse(res);
    } catch (err) {
      alert("Error chatting with file.");
    } finally {
      setIsChatting(false);
    }
  };

  const downloadFile = (content: string, type: 'md' | 'txt') => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFileContent('');
    setPreviewUrl(null);
    setFileType(null);
    setDocxHtml(null);
    setFileName('');
    setSummary('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: CONTENT INPUT & PREVIEW */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col min-h-[600px]">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>📁</span> {language === 'English' ? 'Document Intelligence' : '文檔智能'}
          </h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="relative px-6 py-2 bg-white/10 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/20 transition-all">
              {language === 'English' ? 'Upload PDF / DOCX / TXT' : '上傳 PDF / DOCX / TXT'}
              <input type="file" accept=".pdf,.txt,.md,.docx" onChange={handleFileUpload} className="hidden" id="fileInput" />
              <label htmlFor="fileInput" className="absolute inset-0 cursor-pointer" />
            </button>
            <button 
              onClick={clearAll}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl text-xs font-bold border border-red-500/30 hover:bg-red-500/30 transition-all"
            >
              {language === 'English' ? 'Reset' : '重置'}
            </button>
          </div>

          {/* PREVIEW CONTAINER */}
          <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl overflow-hidden relative flex flex-col">
            <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest truncate max-w-[200px]">
                {fileName || "No File Selected"}
              </span>
              {fileType && (
                <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded uppercase font-black">
                  {fileType}
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-auto relative">
              {!previewUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center opacity-30">
                  <span className="text-6xl mb-4">📂</span>
                  <p className="text-sm">Upload a file or paste text below to see preview</p>
                </div>
              )}

              {fileType === 'pdf' && previewUrl && (
                <iframe src={previewUrl} className="w-full h-full border-none" />
              )}

              {fileType === 'docx' && docxHtml && (
                <div className="p-8 prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: docxHtml }} />
              )}

              {fileType === 'txt' && (
                <textarea
                  className="w-full h-full bg-transparent border-none p-6 text-sm font-mono focus:outline-none resize-none"
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  placeholder="Paste or edit text here..."
                />
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">
              {fileContent.length.toLocaleString()} Transformed Tokens
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] opacity-40 uppercase font-bold">Analysis Target:</span>
              <div className="flex bg-black/30 p-1 rounded-lg border border-white/10">
                <button 
                  onClick={() => setTransformType('markdown')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${transformType === 'markdown' ? 'bg-white text-black' : 'opacity-50'}`}
                >
                  MD
                </button>
                <button 
                  onClick={() => setTransformType('text')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${transformType === 'text' ? 'bg-white text-black' : 'opacity-50'}`}
                >
                  TXT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: SETTINGS & ACTION */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col justify-between h-auto lg:h-[600px]">
          <div>
            <h2 className="text-2xl font-bold mb-6">⚙️ {language === 'English' ? 'Strategic Config' : '戰略配置'}</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs mb-3 opacity-60 uppercase tracking-widest font-bold">Analysis Engine</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', desc: 'Speed & Logic Balanced' },
                    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', desc: 'Maximum Reasoning Depth' },
                    { id: 'gemini-2.5-flash-native-audio-preview-09-2025', name: 'Native Multimodal', desc: 'Experimental Native Parser' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setModel(m.id)}
                      className={`p-4 rounded-2xl text-left transition-all border ${
                        model === m.id 
                          ? 'bg-white text-black border-white shadow-lg' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <p className="text-sm font-bold truncate">{m.name}</p>
                      <p className="text-[10px] opacity-60">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <p className="text-[10px] font-bold text-indigo-300 uppercase mb-1">Process Map</p>
              <p className="text-xs opacity-70">
                1. Extract raw data -> 2. Transform to {transformType} -> 3. Execute 3000-word deep summary.
              </p>
            </div>
            
            <button
              onClick={generateDeepSummary}
              disabled={isLoading || !fileContent}
              className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl ${
                isLoading || !fileContent 
                  ? 'bg-gray-700 opacity-50 cursor-not-allowed' 
                  : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'English' ? 'Synthesizing...' : '綜合中...'}</span>
                </>
              ) : (
                <span>⚡ {language === 'English' ? 'START ANALYSIS' : '開始深度分析'}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RESULT PANEL */}
      {summary && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold">📝 {language === 'English' ? 'Generated Intelligence' : '生成的情報'}</h2>
            <div className="flex items-center gap-3 bg-black/30 p-1.5 rounded-xl border border-white/10">
              <button 
                onClick={() => setViewMode('preview')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-white text-black' : 'opacity-60 hover:opacity-100'}`}
              >
                {language === 'English' ? 'Preview' : '預覽'}
              </button>
              <button 
                onClick={() => setViewMode('edit')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'edit' ? 'bg-white text-black' : 'opacity-60 hover:opacity-100'}`}
              >
                {language === 'English' ? 'Edit Raw' : '編輯'}
              </button>
              <div className="w-px h-4 bg-white/20 mx-1" />
              <button 
                onClick={() => downloadFile(summary, transformType === 'markdown' ? 'md' : 'txt')}
                className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-500/30 hover:bg-indigo-500/30 transition-all"
              >
                Export
              </button>
            </div>
          </div>

          <div className="min-h-[500px]">
            {viewMode === 'preview' ? (
              <div className="prose prose-invert max-w-none prose-p:text-sm prose-li:text-sm prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-table:text-xs bg-black/20 p-8 rounded-2xl border border-white/5 overflow-x-auto selection:bg-indigo-500/50">
                {summary.split('\n').map((line, i) => {
                   if (line.startsWith('#')) return <h3 key={i} className="mb-4 text-indigo-300 border-b border-white/10 pb-2">{line.replace(/#/g, '').trim()}</h3>;
                   if (line.trim() === '') return <div key={i} className="h-2" />;
                   return <p key={i} className="mb-2 leading-relaxed opacity-90">{line}</p>;
                })}
              </div>
            ) : (
              <textarea
                className="w-full h-[600px] bg-black/40 border border-white/10 rounded-2xl p-8 text-sm font-mono focus:outline-none focus:border-white/40 leading-relaxed"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            )}
          </div>

          {/* DYNAMIC CHAT / POST-ANALYSIS INTERROGATION */}
          <div className="mt-12 pt-12 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>💬</span> {language === 'English' ? 'Deep Document Interrogation' : '文檔深度拷問'}
              </h3>
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                 <span className="text-[10px] font-bold opacity-40 ml-2">MODEL:</span>
                 <select 
                   className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer p-2"
                   value={chatModel}
                   onChange={(e) => setChatModel(e.target.value)}
                 >
                   <option value="gemini-3-flash-preview">3 Flash</option>
                   <option value="gemini-3-pro-preview">3 Pro</option>
                   <option value="gemini-2.5-flash-lite-latest">Flash Lite</option>
                 </select>
              </div>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder={language === 'English' ? "Ask specifically about clauses, risks, or key entities..." : "專門詢問條款、風險或關鍵實體..."}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl p-5 text-sm focus:outline-none focus:border-white/50 shadow-inner"
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
              />
              <button
                onClick={handleChat}
                disabled={isChatting || !chatQuery}
                className="px-10 py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChatting ? (
                   <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (language === 'English' ? "Query" : "查詢")}
              </button>
            </div>
            {chatResponse && (
              <div className="mt-6 bg-indigo-500/10 p-8 rounded-3xl border border-indigo-500/20 text-sm leading-relaxed shadow-lg animate-in fade-in zoom-in duration-300 relative">
                <div className="absolute top-4 right-4 text-[10px] font-mono opacity-30">RESPONSE ENGINE: {chatModel}</div>
                <p className="font-bold mb-4 text-indigo-400 opacity-70 uppercase text-[10px] tracking-[0.2em]">Strategist Insights</p>
                <div className="whitespace-pre-wrap">{chatResponse}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileIntelligence;
