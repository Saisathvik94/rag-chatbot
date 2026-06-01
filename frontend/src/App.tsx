import React, { useState, useEffect, useRef } from 'react';

type ChatMessage = { role: "user" | "assistant"; content: string };

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

function parseMarkdown(text: string) {
  const parts: React.ReactNode[] = [];
  // Match brackets for citations, double asterisks for bold, and newlines
  const regex = /(\[.*?\]|\*\*.*?\*\*|\n)/g;
  const splits = text.split(regex);
  
  splits.forEach((part, i) => {
    if (!part) return;
    
    if (part.startsWith('[') && part.endsWith(']')) {
      const inner = part.slice(1, -1);
      parts.push(
        <span key={i} className="inline-block px-2 py-0.5 mx-1 text-xs font-medium bg-badge-bg text-badge-text rounded-full whitespace-nowrap align-middle border border-teal-900/50 shadow-sm">
          {inner}
        </span>
      );
    } else if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      parts.push(<strong key={i} className="font-semibold text-gray-100">{inner}</strong>);
    } else if (part === '\n') {
      parts.push(<br key={i} />);
    } else {
      parts.push(<span key={i}>{part}</span>);
    }
  });
  
  return parts;
}

function VideoIngestionPanel() {
  const [urlA, setUrlA] = useState('');
  const [loadingA, setLoadingA] = useState(false);
  const [successA, setSuccessA] = useState('');
  const [errorA, setErrorA] = useState('');

  const [urlB, setUrlB] = useState('');
  const [loadingB, setLoadingB] = useState(false);
  const [successB, setSuccessB] = useState('');
  const [errorB, setErrorB] = useState('');

  const handleIngest = async (label: 'A' | 'B', url: string) => {
    if (label === 'A') {
      setLoadingA(true); setErrorA(''); setSuccessA('');
    } else {
      setLoadingB(true); setErrorB(''); setSuccessB('');
    }

    try {
      const res = await fetch('http://localhost:3000/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, videoLabel: label })
      });
      if (!res.ok) throw new Error('Ingestion failed: Server error');
      const data = await res.json();
      
      if (label === 'A') setSuccessA(data.title || 'Video A ingested successfully');
      else setSuccessB(data.title || 'Video B ingested successfully');
    } catch (err: any) {
      if (label === 'A') setErrorA(err.message || 'Network error occurred');
      else setErrorB(err.message || 'Network error occurred');
    } finally {
      if (label === 'A') setLoadingA(false);
      else setLoadingB(false);
    }
  };

  return (
    <div className="w-full md:w-80 lg:w-96 flex flex-col border-b md:border-b-0 md:border-r border-gray-800 bg-gray-900 p-5 md:p-6 shrink-0 h-auto md:h-full overflow-y-auto z-20">
      <h1 className="text-xl md:text-2xl font-bold text-gray-100 mb-5 md:mb-8 tracking-tight">Add Videos</h1>
      
      {/* Video A */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Video A</h2>
        <div className="flex flex-col gap-3">
          <input 
            className="w-full bg-gray-950 text-sm text-gray-200 border border-gray-700 rounded-lg px-3 py-2.5 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all placeholder:text-gray-600 shadow-inner" 
            placeholder="Paste YouTube URL..." 
            value={urlA} 
            onChange={(e) => setUrlA(e.target.value)} 
          />
          <button 
            className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            onClick={() => handleIngest('A', urlA)}
            disabled={loadingA || !urlA.trim()}
          >
            {loadingA ? <Spinner /> : 'Ingest'}
          </button>
        </div>
        {successA && <p className="text-teal-400 text-xs mt-3 font-medium flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>{successA}</p>}
        {errorA && <p className="text-red-400 text-xs mt-3 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{errorA}</p>}
      </div>

      {/* Video B */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Video B</h2>
        <div className="flex flex-col gap-3">
          <input 
            className="w-full bg-gray-950 text-sm text-gray-200 border border-gray-700 rounded-lg px-3 py-2.5 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all placeholder:text-gray-600 shadow-inner" 
            placeholder="Paste YouTube URL..." 
            value={urlB} 
            onChange={(e) => setUrlB(e.target.value)} 
          />
          <button 
            className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            onClick={() => handleIngest('B', urlB)}
            disabled={loadingB || !urlB.trim()}
          >
            {loadingB ? <Spinner /> : 'Ingest'}
          </button>
        </div>
        {successB && <p className="text-teal-400 text-xs mt-3 font-medium flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>{successB}</p>}
        {errorB && <p className="text-red-400 text-xs mt-3 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{errorB}</p>}
      </div>
    </div>
  );
}

function ChatPanel() {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!question.trim()) return;
    
    // Create local copies to manage state updates predictably
    const newQuestion = question.trim();
    const priorHistory = [...history];
    const newHistory: ChatMessage[] = [...history, { role: "user", content: newQuestion }];
    
    setHistory(newHistory);
    setQuestion('');
    setStreaming(true);

    try {
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQuestion, history: priorHistory })
      });

      if (!res.ok || !res.body) throw new Error('Chat request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let assistantMessage = "";

      // Add a placeholder message for the assistant
      setHistory(prev => [...prev, { role: "assistant", content: "" }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunkValue = decoder.decode(value, { stream: true });
          assistantMessage += chunkValue;
          
          // Update the last message
          setHistory(prev => {
            const updated = [...prev];
            updated[updated.length - 1].content = assistantMessage;
            return updated;
          });
        }
      }
    } catch (err) {
      console.error(err);
      setHistory(prev => [...prev, { role: "assistant", content: "Error: Could not connect to the server or stream failed." }]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-950 h-full overflow-hidden relative">
      <div className="px-8 py-5 border-b border-gray-800/60 bg-gray-900/30 backdrop-blur-sm z-10 shadow-sm flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-100 tracking-wide">Chat</h1>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Ready</span>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-6" ref={scrollRef}>
        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center shadow-inner">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium">Send a message to start the conversation</p>
          </div>
        ) : (
          history.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] rounded-2xl px-5 py-3.5 leading-relaxed text-[15px] shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-chat-user text-white rounded-br-sm border border-teal-900/30' 
                    : 'bg-chat-assistant text-gray-200 rounded-bl-sm border border-gray-700/50'
                }`}
              >
                {parseMarkdown(msg.content)}
                {streaming && i === history.length - 1 && msg.role === 'assistant' && (
                  <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-teal-400 animate-pulse"></span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 md:p-6 bg-gray-950 border-t border-gray-800/80">
        <div className="max-w-4xl mx-auto flex gap-3 relative group">
          <input 
            className="flex-1 bg-gray-900 text-gray-100 border border-gray-700 rounded-full pl-6 pr-24 py-3.5 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:bg-gray-800 transition-all shadow-inner placeholder:text-gray-500"
            placeholder="Ask a question about the videos..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !streaming && handleSend()}
            disabled={streaming}
            autoFocus
          />
          <button 
            className="absolute right-2 top-2 bottom-2 bg-teal-700 hover:bg-teal-600 text-white rounded-full px-5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
            onClick={handleSend}
            disabled={streaming || !question.trim()}
          >
            {streaming ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex flex-col md:flex-row w-full h-[100dvh] overflow-hidden text-gray-200 font-sans selection:bg-teal-900 selection:text-white">
      <VideoIngestionPanel />
      <ChatPanel />
    </div>
  );
}
