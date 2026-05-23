import React, { useState, useRef, useEffect, useCallback } from "react";
import { Download, Image as ImageIcon, Upload, CheckCircle2, ChevronRight, X, Loader2, Type, Box, Palette, Search, Sun, Moon } from "lucide-react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { removeBackground } from "@imgly/background-removal";
import { type Session } from "@supabase/supabase-js";
import { AuthPanel } from "./AuthPanel";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
// @ts-ignore
import readmeText from "../README.md?raw";

// Curated list of symbols for the deterministic builder and categories
const SYMBOL_CATEGORIES: Record<string, string[]> = {
  mobile: ["Smartphone", "Tablet", "AppWindow", "Fingerprint", "Bluetooth", "QrCode", "Bell", "Share2", "Compass", "MessageSquare"],
  computer: ["Cpu", "Laptop", "Monitor", "Server", "HardDrive", "Terminal", "Code2", "GitBranch", "Network", "Database", "Binary", "Blocks", "Bot", "Webhook", "Keyboard", "Mouse"],
  academic: ["GraduationCap", "BookOpen", "Book", "School", "Library", "Trophy", "Calculator", "Award", "PenTool", "Feather", "Bookmark", "Brain", "Microscope"],
  corporate: ["Briefcase", "Building2", "Building", "TrendingUp", "BarChart3", "PieChart", "Target", "Shield", "Users", "Mail", "FileText", "Handshake", "Receipt", "Presentation", "Calendar", "DollarSign"],
  shapes: ["Workflow", "Box", "Circle", "Triangle", "Hexagon", "Layers", "Infinity", "Command", "Layout"],
  nature: ["Flame", "Zap", "Droplet", "Sun", "Moon", "Cloud", "Leaf", "Flower", "Sparkles", "Star", "Heart"],
  browser: ["Home", "Search", "Download", "Share2", "Copy", "ExternalLink", "Maximize2", "Plus", "Settings", "SlidersHorizontal", "Globe", "Link", "ArrowUpRight", "RefreshCw", "Folder", "Menu", "AppWindow", "Trash2"],
  tools: ["Key", "Lock", "Anchor", "Crown", "Lightbulb", "Atom", "Puzzle", "Mic", "Pause", "File", "Tv", "Check", "Info", "Play", "Music", "Headphones", "Volume2", "HelpCircle", "RefreshCw", "Eraser", "Brush", "Wand2", "Move", "Hand"],
  social: ["User", "Users", "UserPlus", "UserMinus", "UserCheck", "Contact", "Smile", "Heart", "Handshake", "Sparkles", "Mail", "MessageCircle", "PartyPopper", "Gift", "Coffee", "Crown"],
  hardware: ["Battery", "BatteryCharging", "Plug", "Power", "Radio", "RadioTower", "TowerControl", "Wifi", "Signal", "Satellite", "Tv", "Cpu", "Server", "Database", "Network", "HardDrive", "Laptop"]
};

const LOGO_SYMBOLS = Array.from(new Set(Object.values(SYMBOL_CATEGORIES).flat()));

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
  { version: "v1.24", date: "Today", features: ["Integrated a dedicated Rust code exporter generating optimal, safe zero-cost raw static string slices (r##\"<svg>...</svg>\"##) for immediate use in any Rust GUI framework (egui, iced, yew)"] },
  { version: "v1.23", date: "Today", features: ["Added a dedicated browser layout & navigation category containing standard browser actions (Home, Search, Download, Share, Copy, ExternalLink, Maximize, Settings, Sliders, Globe, Trash, Link, ArrowUpRight, etc.)"] },
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

const NAV_TABS = [
  { id: "create", label: "Logo", Icon: Icons.Shapes },
  { id: "isolate", label: "Clean", Icon: Icons.Eraser },
  { id: "webpage", label: "Webpage", Icon: Icons.FileText },
  { id: "guide", label: "Help", Icon: Icons.CircleHelp },
] as const;

function removeEmptyUrlHash() {
  if (window.location.href.endsWith("#")) {
    window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
  }
}

function scheduleEmptyUrlHashCleanup() {
  removeEmptyUrlHash();
  window.setTimeout(removeEmptyUrlHash, 0);
  window.setTimeout(removeEmptyUrlHash, 250);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"create" | "isolate" | "guide" | "webpage">("create");
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

  useEffect(() => {
    scheduleEmptyUrlHashCleanup();
    window.addEventListener("hashchange", scheduleEmptyUrlHashCleanup);
    return () => window.removeEventListener("hashchange", scheduleEmptyUrlHashCleanup);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "grey";
      return "light";
    });
  };

  const nextThemeLabel = theme === "light" ? "Dark theme" : theme === "dark" ? "Grey theme" : "Light theme";
  
  // Builder State
  const [builderText, setBuilderText] = useState("GLIMPSE");
  const [builderIcon, setBuilderIcon] = useState("Workflow");
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
  const [isMoreCopyOpen, setIsMoreCopyOpen] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(290);
  const [isViewRawReadme, setIsViewRawReadme] = useState(false);
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Isolator State
  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const builderRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      setSidebarWidth(window.innerWidth < 480 ? 240 : 290);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarHovered(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        setAuthError(error.message);
      }
      setAuthSession(data.session);
      setIsAuthLoading(false);
      scheduleEmptyUrlHashCleanup();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
      setIsAuthLoading(false);
      setAuthError(null);
      scheduleEmptyUrlHashCleanup();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase) return;
    setIsAuthLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setAuthError(error.message);
      setIsAuthLoading(false);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    setIsAuthLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error.message);
    }
    setIsAuthLoading(false);
  };

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

  const copyIconCode = (type: "react" | "svg" | "rust" | "kotlin" | "dart") => {
    if (type === "react") {
      const componentName = builderIcon === "NodeTree" ? "NodeTree" : builderIcon;
      const snippet = `import { ${componentName} } from 'lucide-react';\n\n// Usage\n<${componentName} size={24} strokeWidth={${strokeWidth}} />`;
      navigator.clipboard.writeText(snippet);
      setCopiedType("react");
      setTimeout(() => setCopiedType(null), 2000);
    } else if (type === "svg") {
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
    } else if (type === "rust") {
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
        
        // Convert PascalCase or camelCase to Rust SCREAMING_SNAKE_CASE const name
        const screamingSnake = builderIcon
          .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
          .toUpperCase();
          
        const snippet = `// Rust - Embed SVG String constant (safe, zero-cost raw literal)
pub const ${screamingSnake}_ICON: &str = r##"${svgData}"##;`;
        
        navigator.clipboard.writeText(snippet);
        setCopiedType("rust");
        setTimeout(() => setCopiedType(null), 2000);
      }
    } else if (type === "kotlin") {
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
        
        const screamingSnake = builderIcon
          .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
          .toUpperCase();
          
        const snippet = `// Kotlin (Jetpack Compose) - Multiplatform SVG Resource String
const val ${screamingSnake}_SVG_ASSET = """
${svgData}
""".trimIndent()`;
        
        navigator.clipboard.writeText(snippet);
        setCopiedType("kotlin");
        setTimeout(() => setCopiedType(null), 2000);
      }
    } else if (type === "dart") {
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
        
        const camelCaseIcon = builderIcon.charAt(0).toLowerCase() + builderIcon.slice(1);
        
        const snippet = `// Dart (Flutter) - Vector String Constant (compatible with flutter_svg)
const String ${camelCaseIcon}IconSvg = r'''${svgData}''';`;
        
        navigator.clipboard.writeText(snippet);
        setCopiedType("dart");
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
      <header className="w-full border-b border-brand-border/10 py-4 px-4 md:px-12 flex items-center justify-between bg-transparent transition-colors duration-300">
        <div className="flex items-center gap-3 md:gap-8 relative">
          <div className="w-5 h-5 grayscale opacity-40 hover:opacity-100 transition-all flex-shrink-0">
            <img src={COMPANY_LOGO_URL} alt="Company" className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-1.5 sm:gap-2.5 relative border-l border-brand-border/10 pl-2.5 md:pl-8">
            {NAV_TABS.map((tab) => (
              <div key={tab.id} className="group relative">
                <button 
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-label={tab.label}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-brand-text/20 ${
                    activeTab === tab.id 
                      ? "border-brand-text/25 bg-brand-text/[0.04] text-brand-text" 
                      : "border-transparent text-brand-text/40 hover:border-brand-border/40 hover:text-brand-text/75"
                  }`}
                >
                  <tab.Icon className="h-3.5 w-3.5" />
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="active-tab-line"
                      className="absolute -bottom-1 left-1/2 h-px w-3 -translate-x-1/2 bg-brand-text/40"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </button>
                <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-brand-border bg-brand-bg px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-wider text-brand-text/60 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  {tab.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {authSession && (
            <div className="flex items-center gap-3">
              <div className="group relative">
                <button
                  type="button"
                  aria-label={authSession.user.email ? `Signed in as ${authSession.user.email}` : "Signed in user"}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-border/40 text-brand-text/45 transition-colors hover:border-brand-text/35 hover:text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-text/20"
                >
                  <Icons.UserRound className="h-3.5 w-3.5" />
                </button>
                {authSession.user.email && (
                  <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 max-w-[240px] rounded-sm border border-brand-border bg-brand-bg px-3 py-2 text-[9px] font-mono tracking-wider text-brand-text/60 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    {authSession.user.email}
                  </div>
                )}
              </div>
              <div className="group relative">
                <button
                  type="button"
                  onClick={signOut}
                  disabled={isAuthLoading}
                  aria-label="Sign out"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-brand-text/40 transition-colors hover:border-brand-border/40 hover:text-brand-text/75 focus:outline-none focus:ring-1 focus:ring-brand-text/20 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Icons.LogOut className="h-3.5 w-3.5" />
                </button>
                <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-sm border border-brand-border bg-brand-bg px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-wider text-brand-text/60 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  Sign out
                </div>
              </div>
            </div>
          )}

          <div className="group relative">
            <button 
              type="button"
              onClick={toggleTheme}
              aria-label={nextThemeLabel}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-brand-text/40 transition-colors hover:border-brand-border/40 hover:text-brand-text/75 focus:outline-none focus:ring-1 focus:ring-brand-text/20"
            >
              {theme === "light" ? (
                <Moon className="w-3.5 h-3.5" />
              ) : theme === "dark" ? (
                <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-current rounded-full" />
                </div>
              ) : (
                <Sun className="w-3.5 h-3.5" />
              )}
            </button>
            <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-sm border border-brand-border bg-brand-bg px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-wider text-brand-text/60 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              {nextThemeLabel}
            </div>
          </div>
        </div>
      </header>

      {!authSession ? (
        <AuthPanel
          error={authError}
          isConfigured={isSupabaseConfigured}
          isLoading={isAuthLoading}
          onGoogleSignIn={signInWithGoogle}
        />
      ) : (
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col justify-between">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
          
          <div className="lg:col-span-4 space-y-12 relative order-2 lg:order-1">
            <AnimatePresence mode="wait">
              {activeTab === "guide" ? (
                <motion.div 
                  key="guide"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="space-y-12"
                >
                <section className="space-y-4">
                  <span className="text-[10px] font-semibold tracking-widest text-brand-text/50 uppercase">Logo Making</span>
                  <p className="text-sm text-brand-text/60 font-light leading-relaxed">
                    Quickly create a logo. Use symbols and text to build your identity. Turn on 'Alpha' for a clear background.
                  </p>
                </section>
                
                <section className="space-y-4 pt-8 border-t border-brand-border/10">
                  <span className="text-[10px] font-semibold tracking-widest text-brand-text/50 uppercase">Official Index</span>
                  <p className="text-xs text-brand-text/60 font-light leading-relaxed">
                    Read the objective overview describing this software's specifications in simple, non-cosmetic statements.
                  </p>
                  <button 
                    onClick={() => setActiveTab("webpage")}
                    className="text-[10px] font-bold tracking-[0.2em] text-brand-text hover:opacity-75 transition-opacity uppercase flex items-center gap-1.5"
                  >
                    Open Webpage [→]
                  </button>
                </section>

                <section className="space-y-4 pt-8 border-t border-brand-border/10">
                   <span className="text-[10px] font-semibold tracking-widest text-brand-text/50 uppercase">Updates</span>
                   <div className="space-y-6 pt-2">
                     {CHANGELOG.slice(0, 3).map((item) => (
                       <div key={item.version} className="space-y-2 border-b border-brand-border/5 pb-4 last:border-0 last:pb-0">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-brand-text opacity-50 uppercase">{item.version}</span>
                            <span className="text-[9px] font-medium text-brand-text/40 lowercase">{item.date}</span>
                         </div>
                         <ul className="space-y-1 list-none pl-0">
                           {item.features.map((feature, idx) => (
                             <li key={idx} className="text-[11px] text-brand-text/60 leading-relaxed flex items-start gap-2">
                               <span className="text-brand-text/30 select-none mt-1.5 font-bold text-[6px]">■</span>
                               <span>{feature}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                     ))}
                   </div>
                </section>
              </motion.div>
            ) : activeTab === "webpage" ? (
              <motion.div 
                key="webpage"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <span className="text-[10px] font-semibold tracking-widest text-brand-text/40 uppercase">Glimpse Webpage</span>
                  <p className="text-sm text-brand-text/60 font-light leading-relaxed">
                    This directory describes Glimpse's execution model and technical facts. We prioritize objective truth over cosmetic or verbose statements.
                  </p>
                </div>
              </motion.div>
            ) : activeTab === "create" ? (
              <motion.div 
                key="create"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-10"
              >
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
                    <span className="text-[9px] uppercase tracking-widest text-brand-text/50">Family</span>
                    <div className="flex gap-6">
                      {FONTS.map(f => (
                        <button 
                          key={f.name}
                          onClick={() => setBuilderFont(f)}
                          className={`text-[10px] tracking-widest transition-all duration-300 uppercase ${
                            builderFont.name === f.name 
                              ? "text-brand-text font-bold scale-105" 
                              : "text-brand-text/40 hover:text-brand-text/70 font-medium"
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <span className="text-[9px] uppercase tracking-widest text-brand-text/50">Weight</span>
                    <div className="flex gap-6">
                      {(["light", "normal", "bold"] as const).map(w => (
                        <button 
                          key={w}
                          onClick={() => setBuilderTextWeight(w)}
                          className={`text-[10px] tracking-widest transition-all duration-300 uppercase ${
                            builderTextWeight === w 
                              ? "text-brand-text font-bold scale-105" 
                              : "text-brand-text/40 hover:text-brand-text/70 font-medium"
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
                    <span className="text-[10px] font-semibold tracking-widest text-brand-text/50 uppercase">Active Icon</span>
                    <button 
                      onClick={() => setIsIconsExpanded(!isIconsExpanded)}
                      className={`text-[9px] font-mono tracking-wider px-2.5 py-1 rounded-sm border transition-all duration-300 uppercase ${
                        isIconsExpanded
                          ? "bg-brand-text border-brand-text text-brand-bg font-bold"
                          : "border-brand-border/10 text-brand-text/50 hover:text-brand-text hover:border-brand-text/30 font-medium"
                      }`}
                    >
                      {isIconsExpanded ? "Close Atelier [-]" : "Browse Atelier [+]"}
                    </button>
                  </div>

                  {/* High Quality Inline Focus Tile and Shortcuts */}
                  <div className="grid grid-cols-12 gap-3 border border-brand-border/10 rounded-sm p-3 bg-brand-subtle/40 items-center">
                    {/* Active Icon Display */}
                    <div className="col-span-4 flex flex-col items-center justify-center border-r border-brand-border/10 pr-3 h-14">
                      <div className="w-9 h-9 rounded-sm bg-brand-subtle/80 border border-brand-border/5 flex items-center justify-center shadow-inner">
                        <DynamicIcon name={builderIcon} className="w-5 h-5 text-brand-text stroke-[1.5px]" />
                      </div>
                      <span className="text-[8px] font-semibold tracking-tight text-center max-w-full truncate text-brand-text/50 mt-1">{builderIcon}</span>
                    </div>

                    {/* Quick Selection Library */}
                    <div className="col-span-8 pl-1 flex flex-col justify-center h-14">
                      <span className="text-[8px] font-mono tracking-widest text-brand-text/40 uppercase mb-1.5 block">Quick Select</span>
                      <div className="flex gap-1.5">
                        {["Circle", "Triangle", "Hexagon", "Infinity", "NodeTree"].map((fav) => (
                          <button
                            key={fav}
                            onClick={() => setBuilderIcon(fav)}
                            className={`w-7 h-7 rounded-sm border transition-all flex items-center justify-center ${
                              builderIcon === fav
                                ? "border-brand-text bg-brand-text/10 scale-105"
                                : "border-brand-border/10 hover:border-brand-border/25 hover:bg-brand-text/5"
                            }`}
                            title={`Quick select ${fav}`}
                          >
                            <DynamicIcon name={fav} className={`w-3.5 h-3.5 ${builderIcon === fav ? "text-brand-text" : "text-brand-text/40"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dev Code Copiers */}
                  <div className="flex items-center justify-end gap-2.5 text-[8px] sm:text-[9px] text-brand-text/50 font-mono select-none relative">
                    <span className="text-[8px] text-brand-text/30 uppercase tracking-wider">Use in code:</span>
                    <button
                      onClick={() => copyIconCode("react")}
                      className="hover:text-brand-text cursor-pointer transition-colors duration-150 underline decoration-brand-text/10 underline-offset-2"
                    >
                      {copiedType === "react" ? "React (Copied)" : "React"}
                    </button>
                    <span className="text-brand-text/20">•</span>
                    <button
                      onClick={() => copyIconCode("svg")}
                      className="hover:text-brand-text cursor-pointer transition-colors duration-150 underline decoration-brand-text/10 underline-offset-2"
                    >
                      {copiedType === "svg" ? "SVG (Copied)" : "SVG"}
                    </button>
                    <span className="text-brand-text/20">•</span>
                    
                    {/* Extra Clever Native Formats Popover - Quiet, elegant, zero clutter */}
                    <div className="relative inline-block" id="more-copy-dropdown">
                      <button
                        onClick={() => setIsMoreCopyOpen(!isMoreCopyOpen)}
                        className="hover:text-brand-text cursor-pointer transition-colors duration-150 flex items-center gap-0.5 underline decoration-brand-text/10 underline-offset-2"
                      >
                        {copiedType === "rust" || copiedType === "kotlin" || copiedType === "dart" 
                          ? `${copiedType.charAt(0).toUpperCase() + copiedType.slice(1)} (Copied)`
                          : "More ▾"}
                      </button>

                      <AnimatePresence>
                        {isMoreCopyOpen && (
                          <>
                            {/* Quiet background touch panel close wrapper */}
                            <div 
                              className="fixed inset-0 z-40 bg-transparent"
                              onClick={() => setIsMoreCopyOpen(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 5, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 5, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 bottom-full mb-2 w-32 bg-brand-bg border border-brand-border rounded shadow-md p-1 z-50 flex flex-col gap-0.5"
                            >
                              <div className="px-1.5 py-0.5 text-[7px] text-brand-text/40 uppercase tracking-wider border-b border-brand-border mb-0.5 select-none">
                                native formats
                              </div>
                              <button
                                onClick={() => {
                                  copyIconCode("rust");
                                  setIsMoreCopyOpen(false);
                                }}
                                className="w-full text-left px-1.5 py-1 rounded hover:bg-brand-text/[0.04] text-[8px] sm:text-[9px] hover:text-brand-text transition-colors duration-150 text-brand-text/60 cursor-pointer"
                              >
                                Rust (String)
                              </button>
                              <button
                                onClick={() => {
                                  copyIconCode("kotlin");
                                  setIsMoreCopyOpen(false);
                                }}
                                className="w-full text-left px-1.5 py-1 rounded hover:bg-brand-text/[0.04] text-[8px] sm:text-[9px] hover:text-brand-text transition-colors duration-150 text-brand-text/60 cursor-pointer"
                              >
                                Kotlin (Compose)
                              </button>
                              <button
                                onClick={() => {
                                  copyIconCode("dart");
                                  setIsMoreCopyOpen(false);
                                }}
                                className="w-full text-left px-1.5 py-1 rounded hover:bg-brand-text/[0.04] text-[8px] sm:text-[9px] hover:text-brand-text transition-colors duration-150 text-brand-text/60 cursor-pointer"
                              >
                                Dart (Flutter Svg)
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Floating Symbol Atelier Popout */}
                  <AnimatePresence>
                    {isIconsExpanded && (
                      <>
                        {/* Mobile backdrop to block page & tap away to close */}
                        <div 
                          onClick={() => setIsIconsExpanded(false)}
                          className="fixed inset-0 bg-brand-text/10 backdrop-blur-[2px] z-30 lg:hidden"
                        />
                        
                        {/* Smooth Slide Drawer on Mobile, Absolute floating panel next to Sidebar on Desktop */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98, y: 12, x: 0 }}
                          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                          exit={{ opacity: 0, scale: 0.98, y: 12 }}
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                          className="fixed inset-x-0 bottom-0 max-h-[75vh] rounded-t-md bg-brand-bg border-t border-brand-border px-5 py-5 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] z-40 lg:absolute lg:inset-auto lg:left-[105%] lg:top-0 lg:bottom-auto lg:w-[410px] lg:h-[580px] lg:rounded-sm lg:border lg:border-brand-border lg:shadow-[0_25px_60px_rgba(0,0,0,0.25)] flex flex-col gap-4 overflow-hidden"
                        >
                          {/* Pane Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-brand-border/10 shrink-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold tracking-[0.2em] text-brand-text uppercase">Symbol Atelier</span>
                              <span className="text-[9px] font-mono text-brand-text/50 bg-brand-subtle px-2 py-0.5 rounded-sm">
                                {filteredSymbols.length} available
                              </span>
                            </div>
                            <button 
                              onClick={() => setIsIconsExpanded(false)}
                              className="text-[9px] font-mono text-brand-text/40 hover:text-brand-text tracking-wider uppercase"
                            >
                              [Close]
                            </button>
                          </div>

                          {/* Quick Filter Search */}
                          <div className="relative flex items-center shrink-0">
                            <Search className="absolute left-2.5 w-3 h-3 text-brand-text/30 pointer-events-none" />
                            <input 
                              type="text" 
                              placeholder="Search all icons..." 
                              value={iconSearch}
                              onChange={(e) => setIconSearch(e.target.value)}
                              className="w-full bg-brand-subtle/30 border border-brand-border/10 rounded-sm pl-8 pr-7 py-1.5 outline-none text-[10px] tracking-wide focus:border-brand-text transition-colors placeholder:text-brand-text/30"
                            />
                            {iconSearch && (
                              <button 
                                onClick={() => setIconSearch("")}
                                className="absolute right-2.5 text-brand-text/40 hover:text-brand-text transition-colors text-[10px]"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          {/* Industry Clusters & Shape Filters */}
                          <div className="flex flex-wrap gap-1.5 shrink-0 max-h-24 overflow-y-auto no-scrollbar">
                            {["all", ...Object.keys(SYMBOL_CATEGORIES)].map((cat) => (
                              <button 
                                key={cat}
                                onClick={() => setIconCategory(cat)}
                                className={`text-[9.5px] font-bold tracking-wider px-2.5 py-0.5 rounded-full border transition-all duration-300 uppercase whitespace-nowrap ${
                                  iconCategory === cat 
                                    ? "bg-brand-text border-brand-text text-brand-bg" 
                                    : "border-brand-border/10 text-brand-text/40 hover:text-brand-text hover:border-brand-border/40"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>

                          {/* Interactive Grid containing all targeted symbols */}
                          <div className="flex-1 overflow-y-auto pr-1 border border-brand-border/10 rounded-sm p-3 bg-brand-subtle/30 scrollbar-thin scrollbar-thumb-brand-border">
                            {filteredSymbols.length > 0 ? (
                              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                                {filteredSymbols.map(iconName => (
                                  <button 
                                    key={iconName}
                                    onClick={() => setBuilderIcon(iconName)}
                                    className={`aspect-square flex items-center justify-center rounded-sm border transition-all duration-200 ${
                                      builderIcon === iconName 
                                        ? "bg-brand-text/10 border-brand-text/20" 
                                        : "border-transparent hover:bg-brand-text/5"
                                    }`}
                                    title={iconName}
                                  >
                                    <DynamicIcon 
                                      name={iconName} 
                                      className={`w-5 h-5 stroke-[1.5px] transition-all duration-300 ${
                                        builderIcon === iconName 
                                          ? "text-brand-text scale-110" 
                                          : "text-brand-text/30 hover:text-brand-text"
                                      }`} 
                                    />
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="py-12 text-center text-[10px] text-brand-text/40 italic">
                                No symbols match your filter
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </section>

                <section className="grid grid-cols-2 gap-x-5 pt-4 border-t border-brand-border/10">
                  <div className="space-y-1.5 prose-none">
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] font-mono tracking-wider text-brand-text/50 uppercase">Size</span>
                      <span className="text-[8px] font-mono text-brand-text/50">{Math.round(iconScale * 100)}%</span>
                    </div>
                    <div className="relative flex items-center">
                      <input 
                        type="range" 
                        min="0.4" 
                        max="2.0" 
                        step="0.05"
                        value={iconScale}
                        onChange={(e) => setIconScale(parseFloat(e.target.value))}
                        className="w-full h-0.5 bg-brand-border/20 appearance-none cursor-pointer outline-none rounded-full accent-brand-text opacity-70 hover:opacity-100 transition-opacity duration-150"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 prose-none">
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] font-mono tracking-wider text-brand-text/50 uppercase">Stroke</span>
                      <span className="text-[8px] font-mono text-brand-text/50">{strokeWidth.toFixed(1)}px</span>
                    </div>
                    <div className="relative flex items-center">
                      <input 
                        type="range" 
                        min="0.5" 
                        max="4.0" 
                        step="0.1"
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                        className="w-full h-0.5 bg-brand-border/20 appearance-none cursor-pointer outline-none rounded-full accent-brand-text opacity-70 hover:opacity-100 transition-opacity duration-150"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-widest text-brand-text/50 uppercase">Colors</span>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-mono text-brand-text/30">#</span>
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
                  <div className="flex gap-4 items-center">
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

                    {/* Highly Interactive Rainbow Color Wheel Picker - Extra Clever & Minimalist */}
                    <div 
                      className={`relative w-4 h-4 rounded-full border cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 flex-shrink-0 flex items-center justify-center ${
                        !COLORS.some(c => c.hex.toLowerCase() === customColor.toLowerCase()) 
                          ? "scale-125 border-brand-text/30" 
                          : "border-dashed border-brand-border/40 bg-transparent hover:border-brand-text/40"
                      }`}
                      style={{
                        backgroundColor: !COLORS.some(c => c.hex.toLowerCase() === customColor.toLowerCase())
                          ? customColor
                          : "transparent"
                      }}
                      title="Custom Color"
                    >
                      <input 
                        type="color"
                        value={customColor.startsWith("#") && customColor.length === 7 ? customColor : "#fde68a"}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {COLORS.some(c => c.hex.toLowerCase() === customColor.toLowerCase()) ? (
                        <svg className="w-1.5 h-1.5 text-brand-text/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      ) : (
                        <div className="w-1 h-1 rounded-full bg-brand-bg/85 mix-blend-difference" />
                      )}
                      {!COLORS.some(c => c.hex.toLowerCase() === customColor.toLowerCase()) && (
                        <motion.div 
                          layoutId="palette-ring"
                          className="absolute -inset-1.5 border border-brand-text tracking-tighter opacity-35 rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <span className="text-[10px] font-semibold tracking-widest text-brand-text/50 uppercase">Glass</span>
                  <div className="flex gap-6">
                    <button 
                      onClick={() => setIsBgTransparent(false)}
                      className={`text-[10px] font-medium tracking-widest transition-all duration-300 ${
                        !isBgTransparent 
                          ? "text-brand-text scale-105" 
                          : "text-brand-text/40 hover:text-brand-text/75"
                      }`}
                    >
                      SOLID
                    </button>
                    <button 
                      onClick={() => setIsBgTransparent(true)}
                      className={`text-[10px] font-medium tracking-widest transition-all duration-300 ${
                        isBgTransparent 
                          ? "text-brand-text scale-105" 
                          : "text-brand-text/40 hover:text-brand-text/75"
                      }`}
                    >
                      CLEAR
                    </button>
                  </div>
                </section>

                {!isBgTransparent && (
                  <section className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-widest text-brand-text/50 uppercase">Canvas</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-brand-text/30">#</span>
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
                    <div className="flex gap-4 items-center">
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

                      {/* Custom Spectrum Canvas BG Color Picker - Extra Clever & Minimalist */}
                      <div 
                        className={`relative w-4 h-4 rounded-full border cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 flex-shrink-0 flex items-center justify-center ${
                          !CANVAS_COLORS.some(c => c.hex.toLowerCase() === customBgColor.toLowerCase()) 
                            ? "scale-125 border-brand-text/30" 
                            : "border-dashed border-brand-border/40 bg-transparent hover:border-brand-text/40"
                        }`}
                        style={{
                          backgroundColor: !CANVAS_COLORS.some(c => c.hex.toLowerCase() === customBgColor.toLowerCase())
                            ? customBgColor
                            : "transparent"
                        }}
                        title="Custom Canvas BG"
                      >
                        <input 
                          type="color"
                          value={customBgColor.startsWith("#") && customBgColor.length === 7 ? customBgColor : "#1c1917"}
                          onChange={(e) => setCustomBgColor(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        {CANVAS_COLORS.some(c => c.hex.toLowerCase() === customBgColor.toLowerCase()) ? (
                          <svg className="w-1.5 h-1.5 text-brand-text/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        ) : (
                          <div className="w-1 h-1 rounded-full bg-brand-bg/85 mix-blend-difference" />
                        )}
                        {!CANVAS_COLORS.some(c => c.hex.toLowerCase() === customBgColor.toLowerCase()) && (
                          <motion.div 
                            layoutId="canvas-ring"
                            className="absolute -inset-1.5 border border-brand-text tracking-tighter opacity-35 rounded-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </div>
                    </div>
                  </section>
                )}

                <div className="pt-12">
                  <button 
                    onClick={captureBuilderLogo}
                    className="w-full text-[10px] font-bold tracking-[0.4em] text-brand-text hover:opacity-50 transition-all flex items-center justify-between group"
                  >
                    SAVE PNG
                    <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform opacity-40" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="isolate"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-12"
              >
                <p className="text-xs text-brand-text/50 font-medium leading-relaxed max-w-sm">
                  Remove backgrounds from your images instantly.
                </p>
                
                <div className="space-y-6">
                  {!assetUrl ? (
                    <div onClick={() => fileInputRef.current?.click()} className="group cursor-pointer py-4 border-b border-brand-border hover:border-brand-text transition-colors flex items-center justify-between">
                      <span className="text-sm font-bold tracking-widest">Select Image</span>
                      <ChevronRight className="w-3 h-3 text-brand-text/30 group-hover:translate-x-1 group-hover:text-brand-text transition-all" />
                      <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" accept="image/*" />
                    </div>
                  ) : (
                    <div className="pt-12 space-y-4">
                      <button 
                        onClick={() => outputUrl && downloadBlob(outputUrl, `isolated-${Date.now()}.png`)}
                        disabled={!outputUrl || isProcessing} 
                        className="w-full text-[10px] font-bold tracking-[0.4em] text-brand-text hover:opacity-50 transition-all flex items-center justify-between group disabled:opacity-10"
                      >
                        EXPORT PNG
                        <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform opacity-40" />
                      </button>
                      <button onClick={() => { setAssetUrl(null); setOutputUrl(null); }} className="w-full py-2 text-brand-text/40 hover:text-brand-text transition-colors text-[10px] font-bold tracking-[0.2em] flex items-center justify-center gap-2">
                        <X className="w-2.5 h-2.5" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {assetUrl && (
                  <section className="space-y-4 pt-8 border-t border-brand-border/10 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest text-brand-text/50 uppercase font-mono">Backdrop</span>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setIsBgTransparent(true)}
                          className={`text-[9.5px] font-mono tracking-wider transition-all uppercase ${
                            isBgTransparent ? "text-brand-text font-bold" : "text-brand-text/40 hover:text-brand-text/75"
                          }`}
                        >
                          Grid
                        </button>
                        <button 
                          onClick={() => setIsBgTransparent(false)}
                          className={`text-[9.5px] font-mono tracking-wider transition-all uppercase ${
                            !isBgTransparent ? "text-brand-text font-bold" : "text-brand-text/40 hover:text-brand-text/75"
                          }`}
                        >
                          Solid
                        </button>
                      </div>
                    </div>

                    {!isBgTransparent && (
                      <div className="space-y-3 pt-2">
                        <div className="flex gap-4 items-center">
                          {CANVAS_COLORS.map(c => (
                            <button 
                              key={c.name}
                              onClick={() => { setBuilderBgColor(c); setCustomBgColor(c.hex); }}
                              className={`w-3.5 h-3.5 rounded-full border border-brand-border/10 ${c.bg} transition-all duration-300 relative ${
                                customBgColor === c.hex 
                                  ? "scale-110" 
                                  : "opacity-45 hover:opacity-100"
                              }`}
                            >
                              {customBgColor === c.hex && (
                                <div className="absolute -inset-1 border border-brand-text opacity-40 rounded-full" />
                              )}
                            </button>
                          ))}
                          
                          {/* Extra Clever & Minimalist Spectrum Picker for Backdrop */}
                          <div 
                            className={`relative w-3.5 h-3.5 rounded-full border cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 flex-shrink-0 flex items-center justify-center ${
                              !CANVAS_COLORS.some(c => c.hex.toLowerCase() === customBgColor.toLowerCase()) 
                                ? "scale-110 border-brand-text/30 bg-transparent" 
                                : "border-dashed border-brand-border/40 bg-transparent hover:border-brand-text/40"
                            }`}
                            style={{
                              backgroundColor: !CANVAS_COLORS.some(c => c.hex.toLowerCase() === customBgColor.toLowerCase())
                                ? customBgColor
                                : "transparent"
                            }}
                          >
                            <input 
                              type="color"
                              value={customBgColor.startsWith("#") && customBgColor.length === 7 ? customBgColor : "#1c1917"}
                              onChange={(e) => setCustomBgColor(e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            {CANVAS_COLORS.some(c => c.hex.toLowerCase() === customBgColor.toLowerCase()) ? (
                              <svg className="w-1 h-1 text-brand-text/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                            ) : (
                              <div className="w-1 h-1 rounded-full bg-brand-bg/85 mix-blend-difference" />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                )}
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="aspect-square md:aspect-[4/3] bg-brand-subtle rounded-sm overflow-hidden relative border border-brand-border flex items-center justify-center transition-colors duration-300">
              <AnimatePresence mode="wait">
                {activeTab === "guide" ? (
                  <motion.div 
                    key="guide-preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
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
                    <p className="text-[11px] text-brand-text/50 max-w-[240px] mt-2 font-light leading-relaxed">
                      Create minimalist logotypes, customize vector proportions, or refine custom visual elements instantly.
                    </p>
                  </motion.div>
                ) : activeTab === "create" ? (
                  <motion.div 
                    key="builder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = Math.round(e.clientX - rect.left);
                      const y = Math.round(e.clientY - rect.top);
                      setMousePos({ x, y });
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="w-full h-full flex flex-col items-center justify-center p-12 transition-colors duration-300 relative overflow-hidden group/canvas"
                    style={isBgTransparent ? {
                      backgroundImage: theme === "light" 
                        ? "linear-gradient(45deg, #F5F5F5 25%, transparent 25%), linear-gradient(-45deg, #F5F5F5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #F5F5F5 75%), linear-gradient(-45deg, transparent 75%, #F5F5F5 75%)"
                        : theme === "grey"
                        ? "linear-gradient(45deg, #444444 25%, transparent 25%), linear-gradient(-45deg, #444444 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #444444 75%), linear-gradient(-45deg, transparent 75%, #444444 75%)"
                        : "linear-gradient(45deg, #12100f 25%, transparent 25%), linear-gradient(-45deg, #12100f 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #12100f 75%), linear-gradient(-45deg, transparent 75%, #12100f 75%)",
                      backgroundSize: "16px 16px",
                      backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px"
                    } : {
                      backgroundColor: customBgColor
                    }}
                  >
                    {/* CAD Guides Overlay System - Non-destructive, fades in on hover, very quiet visually */}
                    {showGuides && (
                      <div 
                        className="absolute inset-0 pointer-events-none overflow-hidden select-none transition-opacity duration-300"
                        style={{ opacity: isHovered ? 1 : 0 }}
                      >
                        {/* Bisecting axes (extremely faint solid lines instead of loud dashes) */}
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-text/[0.025]" />
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-text/[0.025]" />
                        
                        {/* Alignment indicators next to crosshair center */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-brand-text/[0.06] rounded-full" />

                        {/* Interactive cursor alignment crosshairs - dynamic tracker */}
                        {isHovered && (
                          <>
                            <div 
                              className="absolute left-0 right-0 h-px border-t border-dotted border-brand-text/[0.03] transition-all duration-75"
                              style={{ top: mousePos.y }}
                            />
                            <div 
                              className="absolute top-0 bottom-0 w-px border-l border-dotted border-brand-text/[0.03] transition-all duration-75"
                              style={{ left: mousePos.x }}
                            />
                            {/* Tiny coordinates bubble right at cursor */}
                            <div 
                              className="absolute pointer-events-none text-[8px] font-mono text-brand-text/30 bg-brand-bg/60 dark:bg-stone-900/60 px-1 py-0.5 rounded leading-none border border-brand-text/[0.03] -translate-x-1/2 -translate-y-[20px]"
                              style={{ left: mousePos.x, top: mousePos.y }}
                            >
                              {mousePos.x}, {mousePos.y}
                            </div>
                          </>
                        )}

                        {/* Concentric subtle target bounds */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed border-brand-text/[0.02]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-dashed border-brand-text/[0.012]" />

                        {/* Tech-driven corner croppers */}
                        <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-brand-text/10" />
                        <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-brand-text/10" />
                        <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-brand-text/10" />
                        <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-brand-text/10" />
                      </div>
                    )}

                    {/* Interactive UI Overlay Controls (top & bottom edges) - completely hidden on image saves, fades dynamically */}
                    <div 
                      className="absolute inset-x-4 top-4 flex justify-between items-center pointer-events-auto select-none transition-opacity duration-300"
                      style={{ opacity: isHovered ? 1 : 0.3 }}
                    >
                      {/* Guides status option toggle */}
                      <button 
                        onClick={() => setShowGuides(!showGuides)}
                        className="text-[8px] font-mono tracking-widest text-brand-text/30 hover:text-brand-text transition-colors duration-200 capitalize cursor-pointer"
                      >
                        [guides: {showGuides ? "on" : "off"}]
                      </button>

                      {/* Quiet status banner, very simple */}
                      <span className="text-[8px] font-mono tracking-widest text-brand-text/30">
                        {showGuides ? "PREVIEW ALIGNMENT ENGINE" : "CLEAN VIEW"}
                      </span>
                    </div>

                    <div 
                      className="absolute inset-x-4 bottom-4 flex justify-between items-center pointer-events-none select-none text-[8px] font-mono tracking-widest text-brand-text/25 transition-opacity duration-300"
                      style={{ opacity: isHovered ? 1 : 0.2 }}
                    >
                      <span>SCALE: {Math.round(iconScale * 100)}%</span>
                      <span className="uppercase">{builderFont.name} / {builderTextWeight}</span>
                    </div>

                    {/* Outer centered composition block */}
                    <div className="flex flex-col items-center gap-6 relative z-10 group/logo">
                      {/* Geometry dimension boundaries - visible only on active guide hover */}
                      {showGuides && isHovered && (
                        <div className="absolute -inset-6 border border-brand-text/[0.03] transition-all duration-300 rounded pointer-events-none select-none animate-in fade-in zoom-in-95">
                          {/* Sizing box ticks */}
                          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-brand-text/20" />
                          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-brand-text/20" />
                          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-brand-text/20" />
                          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-brand-text/20" />
                          
                           {/* Raw coordinates / dimensional labels - minimalist, clean, non-obtrusive */}
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[7.5px] font-mono text-brand-text/45 bg-brand-bg border border-brand-border px-1 py-0.5 rounded leading-none shadow-sm">
                            W: {Math.round((builderText.trim() ? 96 : 160) * iconScale)}px
                          </div>
                          <div className="absolute -right-11 top-1/2 -translate-y-1/2 text-[7.5px] font-mono text-brand-text/45 bg-brand-bg border border-brand-border px-1 py-0.5 rounded leading-none shadow-sm rotate-90 origin-center">
                            H: {Math.round((builderText.trim() ? 144 : 160) * iconScale)}px
                          </div>
                        </div>
                      )}

                      <div id="preview-symbol">
                        <DynamicIcon 
                          name={builderIcon} 
                          strokeWidth={strokeWidth}
                          width={(builderText.trim() ? 96 : 160) * iconScale}
                          height={(builderText.trim() ? 96 : 160) * iconScale}
                          style={{ 
                            color: customColor
                          }} 
                          className="transition-all duration-300 animate-in fade-in zoom-in-95" 
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
                ) : activeTab === "webpage" ? (
                  <motion.div  
                    key="webpage"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="w-full h-full flex flex-col items-start p-6 md:p-12 overflow-y-auto"
                  >
                     <div className="w-full max-w-xl space-y-8 text-left font-sans">
                       <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border/10">
                         <h1 className="text-xs font-bold tracking-[0.2em] text-brand-text uppercase">Glimpse Webpage Specifications</h1>
                         <div className="flex gap-3">
                           <button 
                             onClick={() => setIsViewRawReadme(false)}
                             className={`text-[9px] font-mono tracking-wider uppercase transition-all ${
                               !isViewRawReadme ? "text-brand-text font-bold underlineUnderline underline-offset-4" : "text-brand-text/45 hover:text-brand-text/75"
                             }`}
                           >
                             Specs View
                           </button>
                           <button 
                             onClick={() => setIsViewRawReadme(true)}
                             className={`text-[9px] font-mono tracking-wider uppercase transition-all ${
                               isViewRawReadme ? "text-brand-text font-bold underlineUnderline underline-offset-4" : "text-brand-text/45 hover:text-brand-text/75"
                             }`}
                           >
                             Raw README.md (Plain)
                           </button>
                         </div>
                       </header>

                       {isViewRawReadme ? (
                         <div className="space-y-4">
                           <span className="text-[9px] font-mono tracking-widest text-brand-text/40 uppercase block">Plaintext Repository Documentation</span>
                           <pre className="font-mono text-[9.5px] leading-relaxed text-brand-text/75 whitespace-pre-wrap bg-brand-subtle/50 p-4 border border-brand-border/10 rounded-sm select-text selection:bg-brand-text/10">
                             {readmeText || "No plain readme available."}
                           </pre>
                         </div>
                       ) : (
                         <div className="space-y-8 text-xs leading-relaxed text-brand-text/70 font-light">
                           <div className="space-y-4 pt-2">
                             <h2 className="text-[10px] font-bold tracking-[0.15em] text-brand-text uppercase font-mono">1. Online & CDN Requirements</h2>
                             <p>
                               When deployed on Vercel, Glimpse is not natively offline-capable. It does not implement custom service worker static asset caching or local PWA offline manifests.
                             </p>
                             <p>
                               The neural network weights and WebAssembly configurations utilized for background isolation are retrieved at runtime from public content distribution networks (such as unpkg.com). Thus, an active internet connection is mandatory to load and run background removal for the first time.
                             </p>
                           </div>

                           <div className="space-y-4 pt-6 border-t border-brand-border/10">
                             <h2 className="text-[10px] font-bold tracking-[0.15em] text-brand-text uppercase font-mono">2. Execution Architecture</h2>
                             <p>
                               No remote databases, logging telemetry, or third-party tracking scripts are included. All vector assets, SVG models, and graphics calculations are executed locally within browser viewport memory.
                             </p>
                           </div>
                         </div>
                       )}
                     </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="isolator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="w-full h-full flex items-center justify-center p-6 md:p-24 relative transition-colors duration-300" 
                    style={isBgTransparent ? {
                      backgroundImage: theme === "light" 
                        ? "linear-gradient(45deg, #F5F5F5 25%, transparent 25%), linear-gradient(-45deg, #F5F5F5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #F5F5F5 75%), linear-gradient(-45deg, transparent 75%, #F5F5F5 75%)"
                        : theme === "grey"
                        ? "linear-gradient(45deg, #444444 25%, transparent 25%), linear-gradient(-45deg, #444444 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #444444 75%), linear-gradient(-45deg, transparent 75%, #444444 75%)"
                        : "linear-gradient(45deg, #12100f 25%, transparent 25%), linear-gradient(-45deg, #12100f 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #12100f 75%), linear-gradient(-45deg, transparent 75%, #12100f 75%)",
                      backgroundSize: "16px 16px",
                      backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px"
                    } : {
                      backgroundColor: customBgColor
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

        <footer className="mt-24 md:mt-40 pt-12 border-t border-brand-border flex items-center justify-between gap-4">
          <p className="text-[9px] font-bold tracking-[0.6em] text-brand-text/30 uppercase">
             &copy; {new Date().getFullYear()} GLIMPSE
          </p>
        </footer>

        {/* Quiet, extra clever hover-reveal sidebar for emberlamp */}
        <motion.div
          ref={sidebarRef}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
          onClick={() => {
            if (!isSidebarHovered) {
              setIsSidebarHovered(true);
            }
          }}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center bg-brand-bg/95 backdrop-blur-md border-y border-l border-brand-border/40 rounded-l-xl shadow-2xl overflow-hidden cursor-pointer"
          animate={{
            width: isSidebarHovered ? sidebarWidth : 38,
            height: isSidebarHovered ? 160 : 110,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        >
          <div className="flex h-full w-full items-center">
            {/* Persistent dock tab indicator */}
            <div 
              onClick={(e) => {
                if (isSidebarHovered) {
                  e.stopPropagation();
                  setIsSidebarHovered(false);
                }
              }}
              className="w-[38px] flex flex-col items-center justify-between py-5 h-full border-r border-brand-border/10 cursor-pointer text-brand-text/35 hover:text-[#ea580c] transition-colors"
            >
              <Icons.Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <div className="text-[7.5px] tracking-[0.25em] font-mono [writing-mode:vertical-lr] select-none text-brand-text/30 uppercase font-medium">
                emberlamp
              </div>
              <Icons.ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isSidebarHovered ? 'rotate-180 text-brand-text/60' : ''}`} />
            </div>

            {/* Extended drawer sponsorship details */}
            <AnimatePresence>
              {isSidebarHovered && (
                <motion.div 
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="flex-1 p-4 flex flex-col justify-between h-full select-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono tracking-widest text-orange-500 uppercase font-semibold">Community Hub</span>
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <h4 className="text-xs font-bold tracking-wider text-brand-text">emberlamp</h4>
                    <p className="text-[11px] text-brand-text/50 font-light leading-relaxed">
                      Sponsoring ultra-clean, minimalist digital utilities and design ecosystems with complete structural focus.
                    </p>
                  </div>
                  <a 
                    href="https://github.com/emberlamp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono text-brand-text/40 hover:text-brand-text/80 transition-colors border-t border-brand-border/15 pt-2 mt-2 group"
                  >
                    <span>visit github community</span>
                    <Icons.ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
      )}
    </div>
  );
}
