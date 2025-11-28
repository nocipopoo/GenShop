import React, { useState } from 'react';
import { 
  Wand2, 
  Download, 
  RefreshCcw, 
  Type, 
  Layout, 
  Tag, 
  Sparkles,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { AppState, CopyMode, AspectRatio, CATEGORY_TAGS } from './types';
import { ImageUpload } from './components/ImageUpload';
import { generateMainImage, editGeneratedImage } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    mainCopy: '',
    subCopy: '',
    copyMode: CopyMode.MANUAL,
    aspectRatio: '3:4', // Typical for e-commerce
    productImage: null,
    referenceImage: null,
    customPrompt: '',
    selectedTag: '',
    generatedImage: null,
    isGenerating: false,
    isEditing: false,
    error: null,
  });

  const [editInput, setEditInput] = useState('');

  const handleGenerate = async () => {
    if (!state.productImage) {
      setState(prev => ({ ...prev, error: "Please upload a product image." }));
      return;
    }
    
    // Check API Key first
    if (window.aistudio) {
        try {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                 await window.aistudio.openSelectKey();
            }
        } catch (e) {
            console.error(e);
            setState(prev => ({ ...prev, error: "API Key selection failed." }));
            return;
        }
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null, generatedImage: null }));

    try {
      const imageUrl = await generateMainImage(state);
      setState(prev => ({ ...prev, generatedImage: imageUrl }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || "Generation failed" }));
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleEdit = async () => {
    if (!state.generatedImage || !editInput) return;
    
    setState(prev => ({ ...prev, isEditing: true, error: null }));
    try {
      const newUrl = await editGeneratedImage(state.generatedImage, editInput);
      setState(prev => ({ ...prev, generatedImage: newUrl }));
      setEditInput('');
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || "Edit failed" }));
    } finally {
      setState(prev => ({ ...prev, isEditing: false }));
    }
  };

  const handleDownload = () => {
    if (!state.generatedImage) return;
    const link = document.createElement('a');
    link.href = state.generatedImage;
    link.download = `ecom-gen-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 font-sans selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-primary to-purple-600 rounded-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              GenShop
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            {window.aistudio && (
               <button 
                onClick={() => window.aistudio?.openSelectKey()} 
                className="hover:text-white transition-colors"
               >
                 API Settings
               </button>
            )}
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Billing Info
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-5 space-y-8 h-fit">
          
          {/* Section: Text Config */}
          <section className="space-y-4 bg-surface p-6 rounded-2xl border border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Type size={18} className="text-primary" />
                Copywriting
              </h2>
              <div className="flex bg-zinc-950 rounded-lg p-1 border border-border">
                <button
                  onClick={() => updateState({ copyMode: CopyMode.MANUAL })}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${state.copyMode === CopyMode.MANUAL ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Manual
                </button>
                <button
                  onClick={() => updateState({ copyMode: CopyMode.AUTO_COPY })}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${state.copyMode === CopyMode.AUTO_COPY ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Auto-Copy
                </button>
              </div>
            </div>

            {state.copyMode === CopyMode.MANUAL ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Main Headline (Required)</label>
                  <input
                    type="text"
                    value={state.mainCopy}
                    onChange={(e) => updateState({ mainCopy: e.target.value })}
                    placeholder="e.g., SUPER SALE"
                    className="w-full bg-zinc-950 border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Sub Headline (Optional)</label>
                  <input
                    type="text"
                    value={state.subCopy}
                    onChange={(e) => updateState({ subCopy: e.target.value })}
                    placeholder="e.g., 50% Off Today"
                    className="w-full bg-zinc-950 border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-zinc-950/50 rounded-lg border border-border/50 text-sm text-zinc-400 italic">
                The AI will extract text from your reference image and attempt to replicate its content and style.
              </div>
            )}
          </section>

          {/* Section: Visuals */}
          <section className="space-y-4 bg-surface p-6 rounded-2xl border border-border">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon size={18} className="text-primary" />
              Visual Assets
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload 
                label="Product Image" 
                image={state.productImage} 
                onImageChange={(img) => updateState({ productImage: img })} 
              />
              <ImageUpload 
                label="Style Reference" 
                image={state.referenceImage} 
                onImageChange={(img) => updateState({ referenceImage: img })} 
              />
            </div>
          </section>

          {/* Section: Specs */}
          <section className="space-y-4 bg-surface p-6 rounded-2xl border border-border">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Layout size={18} className="text-primary" />
              Composition
            </h2>
            
            <div className="grid grid-cols-4 gap-2">
              {(['9:16', '3:4', '4:3', '16:9'] as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => updateState({ aspectRatio: ratio })}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    state.aspectRatio === ratio 
                      ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'border-border hover:border-zinc-600 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  <span className="text-lg font-bold mb-1">{ratio}</span>
                </button>
              ))}
            </div>
          </section>

           {/* Section: Details */}
           <section className="space-y-4 bg-surface p-6 rounded-2xl border border-border">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Tag size={18} className="text-primary" />
              Details & Tags
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {CATEGORY_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => updateState({ selectedTag: tag })}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    state.selectedTag === tag
                      ? 'bg-zinc-100 text-zinc-900 border-zinc-100 font-semibold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <textarea
              value={state.customPrompt}
              onChange={(e) => updateState({ customPrompt: e.target.value })}
              placeholder="Additional AI Instructions (e.g. 'Use cyberpunk neon lighting', 'Soft pastel background')..."
              className="w-full bg-zinc-950 border border-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-zinc-700 h-24 resize-none"
            />
          </section>

          <button
            onClick={handleGenerate}
            disabled={state.isGenerating || !state.productImage}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${
              state.isGenerating || !state.productImage
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-primary hover:bg-primaryHover text-white shadow-primary/25 hover:shadow-primary/40'
            }`}
          >
            {state.isGenerating ? (
              <>
                <RefreshCcw className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Wand2 /> Generate Image
              </>
            )}
          </button>

          {state.error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {state.error}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Result */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`h-[800px] w-full bg-surface rounded-2xl border border-border flex flex-col items-center justify-center p-4 relative overflow-hidden group ${!state.generatedImage ? 'border-dashed' : ''}`}>
             
             {!state.generatedImage ? (
                <div className="text-center text-zinc-500 max-w-sm">
                  <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                     <ImageIcon size={32} className="opacity-50"/>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-zinc-300">Ready to Create</h3>
                  <p className="text-sm">Configure your settings on the left and hit Generate to see the magic happen.</p>
                </div>
             ) : (
               <>
                 <img 
                   src={state.generatedImage} 
                   alt="Generated Product" 
                   className="max-h-full max-w-full object-contain shadow-2xl rounded-lg"
                 />
                 <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={handleDownload}
                     className="bg-black/80 hover:bg-black text-white p-3 rounded-full backdrop-blur-sm border border-white/10 shadow-lg transition-all"
                     title="Download PNG"
                   >
                     <Download size={20} />
                   </button>
                 </div>
               </>
             )}

             {/* Loading Overlay */}
             {(state.isGenerating || state.isEditing) && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center flex-col z-10">
                 <RefreshCcw className="animate-spin text-primary mb-4" size={48} />
                 <span className="text-zinc-200 font-medium animate-pulse">
                   {state.isGenerating ? 'Gemini 3 Pro is crafting your masterpiece...' : 'Gemini 2.5 Flash is applying edits...'}
                 </span>
               </div>
             )}
          </div>

          {/* Edit Section */}
          {state.generatedImage && (
            <div className="bg-surface p-4 rounded-xl border border-border flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                  placeholder="Ask AI to edit: 'Change background to red', 'Make title bigger'..."
                  className="w-full bg-zinc-950 border border-border rounded-lg pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-zinc-600"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-800 px-2 py-0.5 rounded text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
                  Nano Banana
                </div>
              </div>
              <button
                onClick={handleEdit}
                disabled={state.isEditing || !editInput}
                className="bg-zinc-100 hover:bg-white text-zinc-900 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronRight size={18} /> Edit
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;