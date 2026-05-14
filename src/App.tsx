import React, { useState, useRef, useEffect, useCallback } from "react";
import { Download, Image as ImageIcon, Upload, CheckCircle2, ChevronRight, X, Loader2, Type, Box, Palette, Search, Sun, Moon } from "lucide-react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { removeBackground } from "@imgly/background-removal";

// Curated list of symbols for the deterministic builder
const LOGO_SYMBOLS = [
  "Box", "Circle", "Triangle", "Hexagon", "Shield", "Zap", "Flame", "Droplet", "Sun", "Moon", 
  "Cloud", "Leaf", "Flower", "Anchor", "Compass", "Key", "Lock", "Heart", "Star", "Target",
  "Award", "Briefcase", "Cpu", "Globe", "Layers", "MousePointer2", "Rocket", "Server", "Terminal", "Wifi"
];

const FONTS = [
  { name: "Sans", class: "font-sans" },
  { name: "Serif", class: "font-serif" },
  { name: "Mono", class: "font-mono" },
];

const COLORS = [
  { name: "Snow", bg: "bg-stone-50", text: "text-stone-50", hex: "#fafaf9" },
  { name: "Coal", bg: "bg-stone-950", text: "text-stone-950", hex: "#0c0a09" },
  { name: "Gold", bg: "bg-amber-200", text: "text-amber-200", hex: "#fde68a" },
  { name: "Clay", bg: "bg-orange-600", text: "text-orange-600", hex: "#ea580c" },
  { name: "Jade", bg: "bg-emerald-500", text: "text-emerald-500", hex: "#10b981" },
];

const CANVAS_COLORS = [
  { name: "Coal", hex: "#1c1917", bg: "bg-stone-900" },
  { name: "Slate", hex: "#334155", bg: "bg-slate-700" },
  { name: "Snow", hex: "#fafaf9", bg: "bg-stone-50" },
  { name: "Black", hex: "#000000", bg: "bg-black" },
  { name: "Gray", hex: "#4a4a4a", bg: "bg-stone-600" },
];

const CHANGELOG = [
  { version: "v1.11", date: "Today", features: ["Simple Guide", "Better naming (Logo/Eraser)", "Cleaner layout"] },
  { version: "v1.10", date: "Today", features: ["Cleaner loading style", "Workspace cleanup", "Better transparency"] },
  { version: "v1.9", date: "Today", features: ["Simple loading view", "Interface cleanup", "Better animations"] },
  { version: "v1.8", date: "Today", features: ["Background eraser view", "New scan animation", "Grid layout"] },
  { version: "v1.7", date: "Today", features: ["Added scan animation", "Better loading view", "Smooth transitions"] },
  { version: "v1.6", date: "Today", features: ["Minimal controls", "Border cleanup", "Visual hierarchy"] },
  { version: "v1.5", date: "Today", features: ["Simple selection UI", "Clean borders", "Text style controls"] },
  { version: "v1.4", date: "Today", features: ["Custom color input", "Canvas color control", "Dynamic transparency"] },
  { version: "v1.3", date: "Today", features: ["Simple themes (Light/Dark/Grey)"] },
  { version: "v1.2", date: "Today", features: ["Image rendering update", "Centering for icon logos"] },
  { version: "v1.1", date: "Today", features: ["Logo tools", "Background tools"] },
];

const COMPANY_LOGO_URL = "https://github.com/emberlamp.png";

export default function App() {
  const [activeTab, setActiveTab] = useState<"create" | "isolate" | "guide">("create");
  const [theme, setTheme] = useState<"light" | "dark" | "grey">("light");
  
  // Theme management
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark", "grey");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "grey";
      return "light";
    });
  };
  
  // Builder State
  const [builderText, setBuilderText] = useState("GLIMPSE");
  const [builderIcon, setBuilderIcon] = useState("Box");
  const [builderColor, setBuilderColor] = useState(COLORS[0]);
  const [customColor, setCustomColor] = useState(COLORS[0].hex);
  const [builderFont, setBuilderFont] = useState(FONTS[0]);
  const [isBgTransparent, setIsBgTransparent] = useState(false);
  const [builderBgColor, setBuilderBgColor] = useState(CANVAS_COLORS[0]);
  const [customBgColor, setCustomBgColor] = useState(CANVAS_COLORS[0].hex);
  
  // Isolator State
  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const builderRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async (sourceUrl: string) => {
    setIsProcessing(true);
    setProgress(0);
    try {
      const config = {
        progress: (status: string, progress: number) => {
          // status can be 'fetch', 'compute', etc.
          // We can weight these if we wanted, but for now just ensure it's a smooth 0-100
          setProgress(Math.round(progress * 100));
        }
      };
      const blob = await removeBackground(sourceUrl, config);
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
    } catch (error) {
      console.error("Isolation Error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    if (assetUrl && activeTab === "isolate") {
      processImage(assetUrl);
    }
  }, [assetUrl, activeTab, processImage]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAssetUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadBlob = async (url: string, name: string) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = url;
    link.click();
  };

  const captureBuilderLogo = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    if (isBgTransparent) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = customBgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Get the actual SVG from the DOM
    const rawSvg = document.querySelector("#preview-symbol svg");
    if (!rawSvg) return;

    const svgClone = rawSvg.cloneNode(true) as SVGSVGElement;
    svgClone.setAttribute("width", "400");
    svgClone.setAttribute("height", "400");
    svgClone.style.color = customColor;

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Logic for conditional centering
      const iconSize = 400;
      const iconY = builderText.trim() ? canvas.height / 2 - 350 : canvas.height / 2 - (iconSize / 2);
      
      // Draw Icon
      ctx.drawImage(img, canvas.width / 2 - (iconSize / 2), iconY, iconSize, iconSize);

      // Draw Text if present
      if (builderText.trim()) {
        ctx.fillStyle = customColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const fontName = builderFont.name === "Mono" ? "monospace" : builderFont.name === "Serif" ? "serif" : "sans-serif";
        ctx.font = `bold 120px ${fontName}`;
        ctx.letterSpacing = "10px";
        ctx.fillText(builderText, canvas.width / 2, canvas.height / 2 + 150);
      }

      const dataUrl = canvas.toDataURL("image/png");
      downloadBlob(dataUrl, `brand-${builderText.toLowerCase().trim() || "asset"}-${Date.now()}.png`);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const DynamicIcon = ({ name, className, style }: { name: string, className?: string, style?: React.CSSProperties }) => {
    // @ts-ignore
    const IconComponent = Icons[name] || Icons.Box;
    return <IconComponent className={className} style={style} />;
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-text selection:bg-stone-100 uppercase tracking-tighter transition-colors duration-300">
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-32">
        
        <header className="mb-20 md:mb-32 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8 relative">
              <div className="w-6 h-6 grayscale opacity-40 hover:opacity-100 transition-all">
                <img src={COMPANY_LOGO_URL} alt="Company" className="w-full h-full object-contain" />
              </div>
              <div className="flex gap-10 relative border-l border-brand-border/10 pl-10">
                {[
                  { id: "create", label: "logo" },
                  { id: "isolate", label: "clean" },
                  { id: "guide", label: "help" }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`text-[10px] tracking-[0.2em] transition-all duration-500 relative py-1 ${
                      activeTab === tab.id 
                        ? "text-brand-text font-medium" 
                        : theme === "grey"
                          ? "text-stone-500 hover:text-stone-400"
                          : "text-stone-300 dark:text-stone-800 hover:text-stone-400 dark:hover:text-stone-600"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="active-tab-line"
                        className="absolute -bottom-1 left-0 right-0 h-px bg-brand-text/30"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                  </button>
                ))}
              </div>
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 transition-colors flex items-center gap-2 group ${
              theme === "light" ? "text-stone-300" : 
              theme === "dark" ? "text-stone-800" : "text-stone-500"
            } hover:text-brand-text`}
          >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : theme === "dark" ? (
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                  <div className="w-2 h-2 bg-current rounded-full" />
                </div>
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>
          </div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tighter leading-tight">
            {activeTab === "create" ? <>Logo<br />Maker</> : activeTab === "isolate" ? <>Background<br />Eraser</> : <>User<br />Guide</>}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24 items-start">
          
          <div className="lg:col-span-4 space-y-12">
            {activeTab === "guide" ? (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12"
              >
                <section className="space-y-4">
                  <span className="text-[10px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Logo Making</span>
                  <p className="text-sm text-stone-500 font-light leading-relaxed">
                    Quickly create a logo. Use symbols and text to build your identity. Turn on 'Alpha' for a clear background.
                  </p>
                </section>
                <section className="space-y-4 pt-8 border-t border-brand-border/10">
                   <span className="text-[10px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Updates</span>
                   <div className="space-y-6 pt-2">
                     {CHANGELOG.slice(0, 3).map((item) => (
                       <div key={item.version} className="space-y-2">
                         <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-brand-text opacity-40 uppercase">{item.version}</span>
                            <span className="text-[8px] font-medium text-stone-300 dark:text-stone-800 lowercase">{item.date}</span>
                         </div>
                         <p className="text-[10px] text-stone-400 dark:text-stone-600 leading-relaxed italic">
                           {item.features[0]}
                         </p>
                       </div>
                     ))}
                   </div>
                </section>
              </motion.div>
            ) : activeTab === "create" ? (
              <div className="space-y-10">
                <section className="space-y-4">
                  <span className="text-[10px] font-bold tracking-widest text-stone-400 dark:text-stone-500">Text Style</span>
                  <input 
                    type="text" 
                    value={builderText}
                    onChange={(e) => setBuilderText(e.target.value.toUpperCase())}
                    className="w-full bg-transparent border-b border-brand-border py-2 outline-none text-sm font-bold tracking-widest focus:border-brand-text transition-colors"
                    placeholder="NAME"
                  />
                  <div className="flex gap-6">
                    {FONTS.map(f => (
                      <button 
                        key={f.name}
                        onClick={() => setBuilderFont(f)}
                        className={`text-[10px] font-bold tracking-widest transition-all duration-300 ${
                          builderFont.name === f.name 
                            ? "text-brand-text scale-105" 
                            : theme === "grey"
                              ? "text-stone-500 hover:text-stone-400"
                              : "text-stone-300 dark:text-stone-600 hover:text-stone-500"
                        }`}
                      >
                        {f.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <span className="text-[10px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Icons</span>
                  <div className="grid grid-cols-5 gap-2">
                    {LOGO_SYMBOLS.map(iconName => (
                      <button 
                        key={iconName}
                        onClick={() => setBuilderIcon(iconName)}
                        className="aspect-square flex items-center justify-center group transition-all"
                      >
                        <DynamicIcon 
                          name={iconName} 
                          className={`w-5 h-5 stroke-[1.5px] transition-all duration-300 ${
                            builderIcon === iconName 
                              ? "text-brand-text scale-125" 
                              : theme === "grey"
                                ? "text-stone-500 group-hover:text-stone-400"
                                : "text-stone-300 dark:text-stone-700 group-hover:text-stone-500"
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Colors</span>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-mono text-stone-300">#</span>
                       <input 
                        type="text" 
                        value={customColor.replace("#", "")}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.length <= 6) setCustomColor(`#${val}`);
                        }}
                        className="w-16 bg-transparent border-b border-brand-border text-right py-0.5 outline-none text-[10px] font-mono tracking-widest focus:border-brand-text transition-colors"
                       />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {COLORS.map(c => (
                      <button 
                        key={c.name}
                        onClick={() => { setBuilderColor(c); setCustomColor(c.hex); }}
                        className={`w-4 h-4 rounded-full ${c.bg} transition-all duration-500 relative ${
                          customColor === c.hex 
                            ? "scale-125" 
                            : theme === "grey" ? "opacity-50 hover:opacity-100" : "opacity-30 hover:opacity-100"
                        }`}
                      >
                        {customColor === c.hex && (
                          <motion.div 
                            layoutId="palette-ring"
                            className="absolute -inset-1.5 border border-brand-text tracking-tighter opacity-20 rounded-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <span className="text-[10px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Glass</span>
                  <div className="flex gap-6">
                    <button 
                      onClick={() => setIsBgTransparent(false)}
                      className={`text-[10px] font-bold tracking-widest transition-all duration-300 ${
                        !isBgTransparent 
                          ? "text-brand-text scale-105" 
                          : theme === "grey"
                            ? "text-stone-500 hover:text-stone-400"
                            : "text-stone-300 dark:text-stone-600 hover:text-stone-500"
                      }`}
                    >
                      SOLID
                    </button>
                    <button 
                      onClick={() => setIsBgTransparent(true)}
                      className={`text-[10px] font-bold tracking-widest transition-all duration-300 ${
                        isBgTransparent 
                          ? "text-brand-text scale-105" 
                          : theme === "grey"
                            ? "text-stone-500 hover:text-stone-400"
                            : "text-stone-300 dark:text-stone-600 hover:text-stone-500"
                      }`}
                    >
                      CLEAR
                    </button>
                  </div>
                </section>

                {!isBgTransparent && (
                  <section className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Canvas</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-stone-300">#</span>
                        <input 
                          type="text" 
                          value={customBgColor.replace("#", "")}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 6) setCustomBgColor(`#${val}`);
                          }}
                          className="w-16 bg-transparent border-b border-brand-border text-right py-0.5 outline-none text-[10px] font-mono tracking-widest focus:border-brand-text transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {CANVAS_COLORS.map(c => (
                        <button 
                          key={c.name}
                          onClick={() => { setBuilderBgColor(c); setCustomBgColor(c.hex); }}
                          className={`w-4 h-4 rounded-full border border-brand-border/10 ${c.bg} transition-all duration-500 relative ${
                            customBgColor === c.hex 
                              ? "scale-125" 
                              : theme === "grey" ? "opacity-50 hover:opacity-100" : "opacity-30 hover:opacity-100"
                          }`}
                        >
                          {customBgColor === c.hex && (
                            <motion.div 
                              layoutId="canvas-ring"
                              className="absolute -inset-1.5 border border-brand-text tracking-tighter opacity-20 rounded-full"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                <div className="pt-12">
                  <button 
                    onClick={captureBuilderLogo}
                    className="w-full text-[10px] font-bold tracking-[0.4em] text-brand-text hover:opacity-10 dark:hover:opacity-30 transition-all flex items-center justify-between group"
                  >
                    SAVE PNG
                    <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform opacity-30" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <p className="text-xs text-stone-400 dark:text-stone-500 font-medium leading-relaxed max-w-sm">
                  Remove backgrounds from your images instantly.
                </p>
                
                <div className="space-y-6">
                  {!assetUrl ? (
                    <div onClick={() => fileInputRef.current?.click()} className="group cursor-pointer py-4 border-b border-brand-border hover:border-brand-text transition-colors flex items-center justify-between">
                      <span className="text-sm font-bold tracking-widest">Select Image</span>
                      <ChevronRight className="w-3 h-3 text-stone-200 dark:text-stone-700 group-hover:translate-x-1 group-hover:text-brand-text transition-all" />
                      <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" accept="image/*" />
                    </div>
                  ) : (
                    <div className="pt-12 space-y-4">
                      <button 
                        onClick={() => outputUrl && downloadBlob(outputUrl, `isolated-${Date.now()}.png`)}
                        disabled={!outputUrl || isProcessing} 
                        className="w-full text-[10px] font-bold tracking-[0.4em] text-brand-text hover:opacity-10 dark:hover:opacity-30 transition-all flex items-center justify-between group disabled:opacity-10"
                      >
                        EXPORT PNG
                        <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform opacity-30" />
                      </button>
                      <button onClick={() => { setAssetUrl(null); setOutputUrl(null); }} className="w-full py-2 text-stone-300 dark:text-stone-700 hover:text-brand-text transition-colors text-[10px] font-bold tracking-[0.2em] flex items-center justify-center gap-2">
                        <X className="w-2.5 h-2.5" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            <div className="aspect-square md:aspect-[4/3] bg-brand-subtle rounded-sm overflow-hidden relative border border-brand-border flex items-center justify-center transition-colors duration-300">
              <AnimatePresence mode="wait">
                {activeTab === "guide" ? (
                  <motion.div 
                    key="guide-preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex items-center justify-center p-12 relative"
                  >
                    <div className="flex flex-col items-center gap-8 opacity-40">
                      <div className="grid grid-cols-3 gap-2">
                        {[...Array(9)].map((_, i) => (
                           <motion.div 
                             key={i} 
                             className="w-4 h-4 border border-brand-text"
                             animate={{ opacity: [0.2, 1, 0.2] }}
                             transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                           />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold tracking-[0.8em] text-brand-text uppercase">System Online</span>
                    </div>
                  </motion.div>
                ) : activeTab === "create" ? (
                  <motion.div 
                    key="builder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center p-12 transition-colors duration-300 relative overflow-hidden"
                    style={isBgTransparent ? {
                      backgroundImage: theme === "light" 
                        ? "linear-gradient(45deg, #F5F5F5 25%, transparent 25%), linear-gradient(-45deg, #F5F5F5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #F5F5F5 75%), linear-gradient(-45deg, transparent 75%, #F5F5F5 75%)"
                        : theme === "grey"
                        ? "linear-gradient(45deg, #4a4a4a 25%, transparent 25%), linear-gradient(-45deg, #4a4a4a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #4a4a4a 75%), linear-gradient(-45deg, transparent 75%, #4a4a4a 75%)"
                        : "linear-gradient(45deg, #1c1917 25%, transparent 25%), linear-gradient(-45deg, #1c1917 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1c1917 75%), linear-gradient(-45deg, transparent 75%, #1c1917 75%)",
                      backgroundSize: "16px 16px",
                      backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px"
                    } : {
                      backgroundColor: customBgColor
                    }}
                  >
                    <div className="flex flex-col items-center gap-6">
                      <div id="preview-symbol">
                        <DynamicIcon name={builderIcon} style={{ color: customColor }} className={`${builderText.trim() ? "w-24 h-24" : "w-40 h-40"} stroke-[1px] transition-all duration-500`} />
                      </div>
                      {builderText.trim() && (
                        <span style={{ color: customColor }} className={`text-4xl font-light tracking-[0.2em] ${builderFont.class} animate-in fade-in slide-in-from-bottom-2`}>
                          {builderText}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-8 right-8 text-[9px] font-bold text-stone-200 dark:text-stone-800 tracking-widest">
                      PREVIEW ONLY
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="isolator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full flex items-center justify-center p-6 md:p-24 relative" 
                    style={{
                      backgroundImage: theme === "light" 
                        ? "linear-gradient(45deg, #F5F5F5 25%, transparent 25%), linear-gradient(-45deg, #F5F5F5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #F5F5F5 75%), linear-gradient(-45deg, transparent 75%, #F5F5F5 75%)"
                        : theme === "grey"
                        ? "linear-gradient(45deg, #4a4a4a 25%, transparent 25%), linear-gradient(-45deg, #4a4a4a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #4a4a4a 75%), linear-gradient(-45deg, transparent 75%, #4a4a4a 75%)"
                        : "linear-gradient(45deg, #1c1917 25%, transparent 25%), linear-gradient(-45deg, #1c1917 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1c1917 75%), linear-gradient(-45deg, transparent 75%, #1c1917 75%)",
                      backgroundSize: "16px 16px",
                      backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px"
                    }}
                  >
                    {!assetUrl && !isProcessing ? (
                      <div className="flex flex-col items-center gap-6 opacity-20 text-brand-text font-bold tracking-[0.5em] text-[10px]">
                         <div className="w-px h-12 bg-brand-text" />
                         No Image
                      </div>
                    ) : (
                      <>
                        {isProcessing && (
                          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-bold text-brand-text/30 tracking-[0.5em] animate-pulse">
                              {progress}%
                            </span>
                          </div>
                        )}
                        {outputUrl && <img src={outputUrl} alt="Output" className="max-w-full max-h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <footer className="mt-24 md:mt-40 pt-12 border-t border-brand-border">
          <p className="text-[9px] font-bold tracking-[0.6em] text-stone-200 dark:text-stone-800">
             &copy; {new Date().getFullYear()} GLIMPSE
          </p>
        </footer>
      </main>
    </div>
  );
}



