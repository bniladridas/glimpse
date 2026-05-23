import React, { useState, useRef, useEffect, useCallback } from "react";
import { Download, Image as ImageIcon, Upload, CheckCircle2, ChevronRight, X, Loader2, Type, Box, Palette, Search, Sun, Moon } from "lucide-react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { removeBackground } from "@imgly/background-removal";

// Curated list of symbols for the deterministic builder
const LOGO_SYMBOLS = [
  // Mobile Software
  "Smartphone", "Tablet", "AppWindow", "Fingerprint", "Bluetooth", "QrCode", "Bell", "Share2", "Compass", "MessageSquare",
  // Computer / Infrastructure
  "Cpu", "Laptop", "Monitor", "Server", "HardDrive", "Terminal", "Code2", "GitBranch", "Network", "Database", "Binary", "Blocks", "Bot", "Webhook", "Keyboard", "Mouse",
  // Academic / School / EdTech
  "GraduationCap", "BookOpen", "Book", "School", "Library", "Trophy", "Calculator", "Award", "PenTool", "Feather", "Bookmark", "Brain", "Microscope",
  // Corporate / Enterprise
  "Briefcase", "Building2", "Building", "TrendingUp", "BarChart3", "PieChart", "Target", "Shield", "Users", "Mail", "FileText", "Handshake", "Receipt", "Presentation", "Calendar", "DollarSign",
  // Shapes & Layouts
  "NodeTree", "Box", "Circle", "Triangle", "Hexagon", "Layers", "Infinity", "Command", "Layout",
  // Nature & Elements
  "Flame", "Zap", "Droplet", "Sun", "Moon", "Cloud", "Leaf", "Flower", "Sparkles", "Star", "Heart",
  // Tools & Action symbols
  "Key", "Lock", "Anchor", "Crown", "Lightbulb", "Atom", "Puzzle", "Mic", "Pause", "File", "Tv", "Check", "Info", "Play", "Music", "Headphones", "Volume2", "HelpCircle", "RefreshCw", "Eraser", "Brush", "Wand2", "Move", "Hand"
];

const SYMBOL_CATEGORIES: Record<string, string[]> = {
  mobile: ["Smartphone", "Tablet", "AppWindow", "Fingerprint", "Bluetooth", "QrCode", "Bell", "Share2", "Compass", "MessageSquare"],
  computer: ["Cpu", "Laptop", "Monitor", "Server", "HardDrive", "Terminal", "Code2", "GitBranch", "Network", "Database", "Binary", "Blocks", "Bot", "Webhook", "Keyboard", "Mouse"],
  academic: ["GraduationCap", "BookOpen", "Book", "School", "Library", "Trophy", "Calculator", "Award", "PenTool", "Feather", "Bookmark", "Brain", "Microscope"],
  corporate: ["Briefcase", "Building2", "Building", "TrendingUp", "BarChart3", "PieChart", "Target", "Shield", "Users", "Mail", "FileText", "Handshake", "Receipt", "Presentation", "Calendar", "DollarSign"],
  shapes: ["NodeTree", "Box", "Circle", "Triangle", "Hexagon", "Layers", "Infinity", "Command", "Layout"],
  nature: ["Flame", "Zap", "Droplet", "Sun", "Moon", "Cloud", "Leaf", "Flower", "Sparkles", "Star", "Heart"],
  tools: ["Key", "Lock", "Anchor", "Crown", "Lightbulb", "Atom", "Puzzle", "Mic", "Pause", "File", "Tv", "Check", "Info", "Play", "Music", "Headphones", "Volume2", "HelpCircle", "RefreshCw", "Eraser", "Brush", "Wand2", "Move", "Hand"]
};

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
  { version: "v1.22", date: "Today", features: ["Integrated React and Raw SVG code exporters for every catalog symbol to support instantaneous design-to-development code reuse"] },
  { version: "v1.21", date: "Today", features: ["Introduced a floating 'Symbol Atelier' popout drawer that anchors alongside the controls panel, completely preventing vertical layout clutter", "Created a high-contrast inline preview section with responsive focus tiles and immediate category shortcuts", "Perfected responsive overlays with fluid spring gestures on mobile screens"] },
  { version: "v1.20", date: "Today", features: ["Replaced horizontal category scrolling with flexwrap containers to eradicate browser scrollbar overlays and restore instantaneous icon selection"] },
  { version: "v1.19", date: "Today", features: ["Integrated dynamic panel expansion for the icon catalog, featuring both compact minimal and ultra-wide grid modes"] },
  { version: "v1.18", date: "Today", features: ["Introduced tailored icon libraries for specific industrial structures (Mobile developers, Computing hubs, Academic campuses, Corporate suites)", "Optimized the filter row layout to intuitively classify icons under smart taxonomies"] },
  { version: "v1.17", date: "Today", features: ["Repositioned edge-to-edge header layout to naturally flow with document scroll for enhanced organic breathing space"] },
  { version: "v1.16", date: "Today", features: ["Restructured edge-to-edge navigation bar styled with elegant backdrop details", "Expanded content container limits specifically for wide viewing arrays", "Calibrated general padding parameters for unmatched studio breathing room"] },
  { version: "v1.15", date: "Today", features: ["Recalibrated screen spacing by removing redundant large header titles", "Restructured grid constraints for comfortable vertical breathing room", "Enhanced minimalist layout density to optimize tool parameters viewing"] },
  { version: "v1.14", date: "Today", features: ["Integrated multimedia symbols (Mic, Play, Pause, Music, Headphones, Audio Volume)", "Added document & utility visuals (File, Check/Tick mark, Info indicator, Help/Guide bubble)", "Enabled dynamic layout vectors (Widescreen TV, Structural grids & Inset frames)"] },
  { version: "v1.13", date: "Today", features: ["Expanded symbol library with digital screens (Computer, Laptop, Mobile, Dual-devices)", "Added clean vectors for operations (Refresh-loop, Ship, Erase/Wipe brush, Move, Hand)", "Integrated minimal tech components (Crown, Lightbulb, Atom, Feather, Pen, Puzzle, Code)"] },
  { version: "v1.12", date: "Today", features: ["Logo scaling controls (Zoom in/out)", "Vector stroke path weight adjustment", "Text style weights (Light/Normal/Bold)", "Optimized icon visibility for dark, light & grey themes"] },
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
  const [builderIcon, setBuilderIcon] = useState("NodeTree");
  const [builderColor, setBuilderColor] = useState(COLORS[0]);
  const [customColor, setCustomColor] = useState(COLORS[0].hex);
  const [builderFont, setBuilderFont] = useState(FONTS[0]);
  const [builderTextWeight, setBuilderTextWeight] = useState<"light" | "normal" | "bold">("light");
  const [iconCategory, setIconCategory] = useState<string>("all");
  const [iconSearch, setIconSearch] = useState<string>("");
  const [isIconsExpanded, setIsIconsExpanded] = useState(false);
  const [isBgTransparent, setIsBgTransparent] = useState(false);
  const [builderBgColor, setBuilderBgColor] = useState(CANVAS_COLORS[0]);
  const [customBgColor, setCustomBgColor] = useState(CANVAS_COLORS[0].hex);
  const [iconScale, setIconScale] = useState(1.0);
  const [strokeWidth, setStrokeWidth] = useState(1.5);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  
  // Isolator State
  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const builderRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSymbols = LOGO_SYMBOLS.filter(symbol => {
    const matchesCategory = iconCategory === "all" || SYMBOL_CATEGORIES[iconCategory]?.includes(symbol);
    const matchesSearch = symbol.toLowerCase().includes(iconSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    const targetSize = Math.round(400 * iconScale);
    
    // Clear any inline style size properties to prevent overriding attributes
    if (svgClone.style) {
      svgClone.style.width = "";
      svgClone.style.height = "";
    }
    
    svgClone.setAttribute("width", targetSize.toString());
    svgClone.setAttribute("height", targetSize.toString());
    svgClone.setAttribute("stroke-width", strokeWidth.toString());
    svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgClone.style.color = customColor;

    let svgData = new XMLSerializer().serializeToString(svgClone);
    // Replace all instances of currentColor with explicit hex customColor so it resolves in isolated blob context
    svgData = svgData.replace(/currentColor/g, customColor);
    
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Logic for conditional centering
      const iconSize = targetSize;
      const iconY = builderText.trim() ? canvas.height / 2 - 350 : canvas.height / 2 - (iconSize / 2);
      
      // Draw Icon
      ctx.drawImage(img, canvas.width / 2 - (iconSize / 2), iconY, iconSize, iconSize);

      // Draw Text if present
      if (builderText.trim()) {
        ctx.fillStyle = customColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const fontName = builderFont.name === "Mono" ? "monospace" : builderFont.name === "Serif" ? "serif" : "sans-serif";
        const weightValue = builderTextWeight === "light" ? "300" : builderTextWeight === "bold" ? "bold" : "normal";
        ctx.font = `${weightValue} 120px ${fontName}`;
        ctx.letterSpacing = "10px";
        ctx.fillText(builderText, canvas.width / 2, canvas.height / 2 + 150);
      }

      const dataUrl = canvas.toDataURL("image/png");
      downloadBlob(dataUrl, `brand-${builderText.toLowerCase().trim() || "asset"}-${Date.now()}.png`);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const copyIconCode = (type: "react" | "svg") => {
    if (type === "react") {
      const componentName = builderIcon === "NodeTree" ? "NodeTree" : builderIcon;
      const snippet = `import { ${componentName} } from 'lucide-react';\n\n// Usage\n<${componentName} size={24} strokeWidth={${strokeWidth}} />`;
      navigator.clipboard.writeText(snippet);
      setCopiedType("react");
      setTimeout(() => setCopiedType(null), 2000);
    } else {
      const rawSvg = document.querySelector("#preview-symbol svg");
      if (rawSvg) {
        const svgClone = rawSvg.cloneNode(true) as SVGSVGElement;
        svgClone.removeAttribute("class");
        svgClone.removeAttribute("style");
        svgClone.setAttribute("width", "24");
        svgClone.setAttribute("height", "24");
        svgClone.setAttribute("stroke-width", strokeWidth.toString());
        svgClone.setAttribute("stroke", customColor);
        let svgData = new XMLSerializer().serializeToString(svgClone);
        svgData = svgData.replace(/currentColor/g, customColor);
        navigator.clipboard.writeText(svgData);
        setCopiedType("svg");
        setTimeout(() => setCopiedType(null), 2000);
      }
    }
  };

  const DynamicIcon = ({ name, className, style, strokeWidth, width, height }: { name: string, className?: string, style?: React.CSSProperties, strokeWidth?: number, width?: number, height?: number }) => {
    if (name === "NodeTree") {
      return (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth={strokeWidth ?? 1.5} 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={className} 
          style={style}
          width={width ?? 20}
          height={height ?? 20}
        >
          <line x1="12" y1="12" x2="18" y2="7" />
          <line x1="12" y1="12" x2="18" y2="17" />
          <line x1="12" y1="12" x2="6" y2="12" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          <circle cx="18" cy="7" r="1.5" fill="currentColor" />
          <circle cx="18" cy="17" r="1.5" fill="currentColor" />
          <circle cx="6" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    }
    // @ts-ignore
    const IconComponent = Icons[name] || Icons.Box;
    return <IconComponent className={className} style={style} strokeWidth={strokeWidth ?? 1.5} size={width || height || 20} />;
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-text selection:bg-stone-100 transition-colors duration-300 flex flex-col">
      {/* Premium edge-to-edge top header */}
      <header className="w-full border-b border-brand-border/10 py-4 px-6 md:px-12 flex items-center justify-between bg-brand-bg transition-all">
        <div className="flex items-center gap-8 relative">
          <div className="w-5 h-5 grayscale opacity-40 hover:opacity-100 transition-all">
            <img src={COMPANY_LOGO_URL} alt="Company" className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-8 relative border-l border-brand-border/10 pl-8">
            {[
              { id: "create", label: "LOGO" },
              { id: "isolate", label: "CLEAN" },
              { id: "guide", label: "HELP" }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-[9px] tracking-[0.2em] transition-all duration-500 relative py-1.5 uppercase font-semibold ${
                  activeTab === tab.id 
                    ? "text-brand-text" 
                    : theme === "grey"
                      ? "text-stone-500 hover:text-stone-400"
                      : "text-stone-400 dark:text-stone-700 hover:text-stone-500"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="active-tab-line"
                    className="absolute -bottom-1.5 left-0 right-0 h-px bg-brand-text/30"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={toggleTheme}
          className={`p-1.5 transition-colors flex items-center gap-2 group ${
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
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col justify-between">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
          
          <div className="lg:col-span-4 space-y-12 relative">
            {activeTab === "guide" ? (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12"
              >
                <section className="space-y-4">
                  <span className="text-[10px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Logo Making</span>
                  <p className="text-sm text-stone-500 font-light leading-relaxed">
                    Quickly create a logo. Use symbols and text to build your identity. Turn on 'Alpha' for a clear background.
                  </p>
                </section>
                <section className="space-y-4 pt-8 border-t border-brand-border/10">
                   <span className="text-[10px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Updates</span>
                   <div className="space-y-6 pt-2">
                     {CHANGELOG.slice(0, 3).map((item) => (
                       <div key={item.version} className="space-y-2 border-b border-brand-border/5 pb-4 last:border-0 last:pb-0">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-brand-text opacity-50 uppercase">{item.version}</span>
                            <span className="text-[9px] font-medium text-stone-400 dark:text-stone-500 lowercase">{item.date}</span>
                         </div>
                         <ul className="space-y-1 list-none pl-0">
                           {item.features.map((feature, idx) => (
                             <li key={idx} className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed flex items-start gap-2">
                               <span className="text-stone-300 dark:text-stone-700 select-none mt-1.5 font-bold text-[6px]">■</span>
                               <span>{feature}</span>
                             </li>
                           ))}
                         </ul>
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
                    className="w-full bg-transparent border-b border-brand-border py-2 outline-none text-sm font-light tracking-widest focus:border-brand-text transition-colors"
                    placeholder="NAME"
                  />
                  <div className="flex flex-col gap-3">
                    <span className="text-[9px] uppercase tracking-widest text-stone-400 dark:text-stone-600">Family</span>
                    <div className="flex gap-6">
                      {FONTS.map(f => (
                        <button 
                          key={f.name}
                          onClick={() => setBuilderFont(f)}
                          className={`text-[10px] font-medium tracking-widest transition-all duration-300 uppercase ${
                            builderFont.name === f.name 
                              ? "text-brand-text scale-105" 
                              : theme === "grey"
                                ? "text-stone-500 hover:text-stone-400"
                                : "text-stone-300 dark:text-stone-600 hover:text-stone-500"
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <span className="text-[9px] uppercase tracking-widest text-stone-400 dark:text-stone-600">Weight</span>
                    <div className="flex gap-6">
                      {(["light", "normal", "bold"] as const).map(w => (
                        <button 
                          key={w}
                          onClick={() => setBuilderTextWeight(w)}
                          className={`text-[10px] font-medium tracking-widest transition-all duration-300 uppercase ${
                            builderTextWeight === w 
                              ? "text-brand-text scale-105" 
                              : theme === "grey"
                                ? "text-stone-500 hover:text-stone-400"
                                : "text-stone-300 dark:text-stone-600 hover:text-stone-500"
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Active Icon</span>
                    <button 
                      onClick={() => setIsIconsExpanded(!isIconsExpanded)}
                      className={`text-[9px] font-mono tracking-wider px-2.5 py-1 rounded-sm border transition-all duration-300 uppercase ${
                        isIconsExpanded
                          ? "bg-stone-900 border-stone-900 text-stone-50 dark:bg-stone-100 dark:border-stone-100 dark:text-stone-950 font-bold"
                          : "border-brand-border/10 text-stone-400 dark:text-stone-500 hover:text-brand-text hover:border-brand-text/30 font-medium"
                      }`}
                    >
                      {isIconsExpanded ? "Close Atelier [-]" : "Browse Atelier [+]"}
                    </button>
                  </div>

                  {/* High Quality Inline Focus Tile and Shortcuts */}
                  <div className="grid grid-cols-12 gap-3 border border-brand-border/10 rounded-sm p-3 bg-stone-100/10 dark:bg-stone-900/10 items-center">
                    {/* Active Icon Display */}
                    <div className="col-span-4 flex flex-col items-center justify-center border-r border-brand-border/10 pr-3 h-14">
                      <div className="w-9 h-9 rounded-sm bg-stone-100/50 dark:bg-stone-900/50 border border-brand-border/5 flex items-center justify-center shadow-inner">
                        <DynamicIcon name={builderIcon} className="w-5 h-5 text-brand-text stroke-[1.5px]" />
                      </div>
                      <span className="text-[8px] font-semibold tracking-tight text-center max-w-full truncate text-stone-400 mt-1">{builderIcon}</span>
                    </div>

                    {/* Quick Selection Library */}
                    <div className="col-span-8 pl-1 flex flex-col justify-center h-14">
                      <span className="text-[8px] font-mono tracking-widest text-stone-400 dark:text-stone-600 uppercase mb-1.5 block">Quick Select</span>
                      <div className="flex gap-1.5">
                        {["Smartphone", "Cpu", "GraduationCap", "Briefcase", "NodeTree"].map((fav) => (
                          <button
                            key={fav}
                            onClick={() => setBuilderIcon(fav)}
                            className={`w-7 h-7 rounded-sm border transition-all flex items-center justify-center ${
                              builderIcon === fav
                                ? "border-brand-text bg-stone-200/30 dark:bg-stone-800/30 scale-105"
                                : "border-brand-border/10 hover:border-brand-border/25 hover:bg-stone-200/5 dark:hover:bg-stone-800/5"
                            }`}
                            title={`Quick select ${fav}`}
                          >
                            <DynamicIcon name={fav} className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dev Code Copiers */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <button
                      onClick={() => copyIconCode("react")}
                      className="py-1.5 px-3 rounded-sm border border-brand-border/10 bg-stone-100/20 dark:bg-stone-900/20 text-[9px] font-mono tracking-wider font-semibold hover:border-brand-text/30 hover:text-brand-text transition-all duration-300 flex items-center justify-center gap-1.5"
                    >
                      {copiedType === "react" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>COPIED REACT</span>
                        </>
                      ) : (
                        <>
                          <span>COPY REACT CODE</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => copyIconCode("svg")}
                      className="py-1.5 px-3 rounded-sm border border-brand-border/10 bg-stone-100/20 dark:bg-stone-900/20 text-[9px] font-mono tracking-wider font-semibold hover:border-brand-text/30 hover:text-brand-text transition-all duration-300 flex items-center justify-center gap-1.5"
                    >
                      {copiedType === "svg" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>COPIED SVG</span>
                        </>
                      ) : (
                        <>
                          <span>COPY RAW SVG</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Floating Symbol Atelier Popout */}
                  <AnimatePresence>
                    {isIconsExpanded && (
                      <>
                        {/* Mobile backdrop to block page & tap away to close */}
                        <div 
                          onClick={() => setIsIconsExpanded(false)}
                          className="fixed inset-0 bg-stone-950/20 dark:bg-stone-950/50 backdrop-blur-[2px] z-30 lg:hidden"
                        />
                        
                        {/* Smooth Slide Drawer on Mobile, Absolute floating panel next to Sidebar on Desktop */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98, y: 12, x: 0 }}
                          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                          exit={{ opacity: 0, scale: 0.98, y: 12 }}
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                          className="fixed inset-x-0 bottom-0 max-h-[75vh] rounded-t-md bg-stone-50 dark:bg-stone-950 border-t border-brand-border/15 p-5 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] z-40 lg:absolute lg:inset-auto lg:left-[105%] lg:top-0 lg:bottom-auto lg:w-[410px] lg:h-[580px] lg:rounded-sm lg:border lg:border-brand-border/15 lg:shadow-[0_25px_60px_rgba(0,0,0,0.25)] flex flex-col gap-4 overflow-hidden"
                        >
                          {/* Pane Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-brand-border/10 shrink-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold tracking-[0.2em] text-brand-text uppercase">Symbol Atelier</span>
                              <span className="text-[9px] font-mono text-stone-400 bg-stone-200/30 dark:bg-stone-800/30 px-2 py-0.5 rounded-sm">
                                {filteredSymbols.length} available
                              </span>
                            </div>
                            <button 
                              onClick={() => setIsIconsExpanded(false)}
                              className="text-[9px] font-mono text-stone-400 dark:text-stone-500 hover:text-brand-text tracking-wider uppercase"
                            >
                              [Close]
                            </button>
                          </div>

                          {/* Quick Filter Search */}
                          <div className="relative flex items-center shrink-0">
                            <Search className="absolute left-2.5 w-3 h-3 text-stone-400 dark:text-stone-600 pointer-events-none" />
                            <input 
                              type="text" 
                              placeholder="Search all icons..." 
                              value={iconSearch}
                              onChange={(e) => setIconSearch(e.target.value)}
                              className="w-full bg-stone-200/20 dark:bg-stone-900/20 border border-brand-border/10 rounded-sm pl-8 pr-7 py-1.5 outline-none text-[10px] tracking-wide focus:border-brand-text transition-colors placeholder:text-stone-400 dark:placeholder:text-stone-600"
                            />
                            {iconSearch && (
                              <button 
                                onClick={() => setIconSearch("")}
                                className="absolute right-2.5 text-stone-400 hover:text-brand-text transition-colors text-[10px]"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          {/* Industry Clusters & Shape Filters */}
                          <div className="flex flex-wrap gap-1.5 shrink-0 max-h-24 overflow-y-auto no-scrollbar">
                            {["all", "mobile", "computer", "academic", "corporate", "shapes", "nature", "tools"].map((cat) => (
                              <button 
                                key={cat}
                                onClick={() => setIconCategory(cat)}
                                className={`text-[9px] font-bold tracking-wider px-2.5 py-0.5 rounded-full border transition-all duration-300 uppercase whitespace-nowrap ${
                                  iconCategory === cat 
                                    ? "bg-stone-900 border-stone-900 text-stone-50 dark:bg-stone-100 dark:border-stone-100 dark:text-stone-950" 
                                    : theme === "grey"
                                      ? "border-stone-800/20 text-stone-500 hover:text-stone-300 hover:border-stone-700/30"
                                      : "border-brand-border/5 text-stone-400 dark:text-stone-600 hover:text-stone-600 dark:hover:text-stone-400 hover:border-brand-border/25"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>

                          {/* Interactive Grid containing all targeted symbols */}
                          <div className="flex-1 overflow-y-auto pr-1 border border-brand-border/10 rounded-sm p-3 bg-stone-100/10 dark:bg-stone-900/10 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-800">
                            {filteredSymbols.length > 0 ? (
                              <div className="grid grid-cols-6 gap-2">
                                {filteredSymbols.map(iconName => (
                                  <button 
                                    key={iconName}
                                    onClick={() => setBuilderIcon(iconName)}
                                    className={`aspect-square flex items-center justify-center rounded-sm border transition-all duration-200 ${
                                      builderIcon === iconName 
                                        ? "bg-stone-200/40 dark:bg-stone-800/40 border-stone-300 dark:border-stone-700" 
                                        : "border-transparent hover:bg-stone-200/10 dark:hover:bg-stone-800/10"
                                    }`}
                                    title={iconName}
                                  >
                                    <DynamicIcon 
                                      name={iconName} 
                                      className={`w-5 h-5 stroke-[1.5px] transition-all duration-300 ${
                                        builderIcon === iconName 
                                          ? "text-brand-text scale-110" 
                                          : theme === "grey"
                                            ? "text-stone-500 hover:text-stone-300"
                                            : "text-stone-300 dark:text-stone-700 hover:text-stone-500"
                                      }`} 
                                    />
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="py-12 text-center text-[10px] text-stone-400 dark:text-stone-600 italic">
                                No symbols match your filter
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </section>

                <section className="space-y-6 pt-4 border-t border-brand-border/10">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Logo Size</span>
                      <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500">{Math.round(iconScale * 100)}%</span>
                    </div>
                    <div className="relative flex items-center">
                      <input 
                        type="range" 
                        min="0.4" 
                        max="2.0" 
                        step="0.05"
                        value={iconScale}
                        onChange={(e) => setIconScale(parseFloat(e.target.value))}
                        className="w-full h-0.5 bg-stone-200 dark:bg-stone-800 appearance-none cursor-pointer outline-none rounded-full accent-stone-950 dark:accent-stone-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Stroke Weight</span>
                      <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500">{strokeWidth.toFixed(1)}px</span>
                    </div>
                    <div className="relative flex items-center">
                      <input 
                        type="range" 
                        min="0.5" 
                        max="4.0" 
                        step="0.1"
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                        className="w-full h-0.5 bg-stone-200 dark:bg-stone-800 appearance-none cursor-pointer outline-none rounded-full accent-stone-950 dark:accent-stone-50"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Colors</span>
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
                  <span className="text-[10px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Glass</span>
                  <div className="flex gap-6">
                    <button 
                      onClick={() => setIsBgTransparent(false)}
                      className={`text-[10px] font-medium tracking-widest transition-all duration-300 ${
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
                      className={`text-[10px] font-medium tracking-widest transition-all duration-300 ${
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
                      <span className="text-[10px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Canvas</span>
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
                    className="w-full h-full flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                      <div className="absolute inset-0 border border-brand-text/5 rounded-full animate-pulse-slow" />
                      <div className="absolute inset-4 border border-brand-text/5 rounded-full" />
                      <div className="absolute inset-8 border border-brand-text/10 rounded-full" />
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-text/[0.04]" />
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-text/[0.04]" />
                      
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 text-brand-text/30">
                        <line x1="12" y1="12" x2="18" y2="7" />
                        <line x1="12" y1="12" x2="18" y2="17" />
                        <line x1="12" y1="12" x2="6" y2="12" />
                        <circle cx="12" cy="12" r="2.5" fill="none" />
                        <circle cx="18" cy="7" r="1.5" />
                        <circle cx="18" cy="17" r="1.5" />
                        <circle cx="6" cy="12" r="1.5" />
                      </svg>
                    </div>
                    <span className="text-[10px] tracking-[0.4em] text-brand-text/50 uppercase font-medium">
                      GLIMPSE BUILDER
                    </span>
                    <p className="text-[11px] text-stone-400 dark:text-stone-600 max-w-[240px] mt-2 font-light leading-relaxed">
                      Create minimalist logotypes, customize vector proportions, or refine custom visual elements instantly.
                    </p>
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
                        <DynamicIcon 
                          name={builderIcon} 
                          strokeWidth={strokeWidth}
                          width={(builderText.trim() ? 96 : 160) * iconScale}
                          height={(builderText.trim() ? 96 : 160) * iconScale}
                          style={{ 
                            color: customColor
                          }} 
                          className="transition-all duration-300" 
                        />
                      </div>
                      {builderText.trim() && (
                        <span 
                          style={{ 
                            color: customColor,
                            fontWeight: builderTextWeight === "light" ? 300 : builderTextWeight === "bold" ? 700 : 400
                          }} 
                          className={`text-4xl tracking-[0.2em] ${builderFont.class} animate-in fade-in slide-in-from-bottom-2`}
                        >
                          {builderText}
                        </span>
                      )}
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



