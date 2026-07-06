import { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw, Terminal, ArrowLeft } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallbackTitle?: string;
  isSection?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.isSection) {
        // Section-specific beautiful recovery widget
        return (
          <div className="w-full min-h-[300px] border border-red-500/30 rounded-xl bg-red-950/20 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-4 font-mono">
            <AlertOctagon className="w-10 h-10 text-red-500 animate-pulse" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest">
                {this.props.fallbackTitle || "SECTION LOCKOUT / RENDER ERROR"}
              </h4>
              <p className="text-[10px] text-slate-400 max-w-md">
                An unhandled component mutation occurred. Core isolated to prevent general memory failure.
              </p>
            </div>
            {this.state.error && (
              <pre className="text-[8px] bg-black/50 p-2.5 rounded border border-red-500/10 text-red-300 max-w-full overflow-x-auto text-left whitespace-pre-wrap max-h-24">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 text-red-300 text-[10px] rounded transition-all flex items-center gap-1.5 uppercase cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> REBOOT MODULE
            </button>
          </div>
        );
      }

      // Full screen beautiful fallback page
      return (
        <div className="min-h-screen w-full bg-[#070712] text-slate-200 flex flex-col items-center justify-center p-6 relative font-mono overflow-hidden">
          {/* Cyber matrix background lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.08)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          <div className="max-w-2xl w-full border border-red-500/30 rounded-xl bg-red-950/10 p-8 md:p-10 space-y-8 backdrop-blur-xl relative shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#070712] px-4 py-1 border border-red-500/40 text-red-500 font-bold text-xs uppercase tracking-[0.3em] rounded-full flex items-center gap-1.5 animate-pulse">
              <AlertOctagon className="w-4 h-4 text-red-500" /> SYS_HALT: STACK_COLLAPSE
            </div>

            {/* Title & Graphic */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-red-500 uppercase">
                DEVILVERSE FAULT ISOLATION
              </h1>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                A core virtual matrix sequence resulted in an exception. Memory structures have been secured to protect the browser instance.
              </p>
            </div>

            {/* Error Diagnostics Screen */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[9px] text-red-400/80 tracking-widest uppercase">
                <Terminal className="w-3.5 h-3.5" /> DIAGNOSTIC_DUMP_STREAM
              </div>
              <div className="bg-black/80 rounded-lg p-4 border border-red-500/20 text-xs font-mono space-y-2 text-slate-300 max-h-48 overflow-y-auto">
                <p className="text-red-400 font-bold">
                  Exception: {this.state.error?.name || "RuntimeError"}: {this.state.error?.message}
                </p>
                {this.state.error?.stack && (
                  <pre className="text-[9.5px] leading-relaxed text-slate-500 select-all overflow-x-auto whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            </div>

            {/* Manual recovery option */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 text-red-300 text-xs rounded transition-all flex items-center justify-center gap-2 uppercase font-bold tracking-wider cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-4 h-4" /> REBOOT SYSTEM CORE
              </button>
              
              <button
                onClick={() => { window.location.href = "/"; }}
                className="w-full sm:w-auto px-6 py-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-slate-400 text-xs rounded transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> RETIRE TO HOME
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children || null;
  }
}
