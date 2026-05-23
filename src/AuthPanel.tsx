import { Loader2, LogIn, ShieldCheck } from "lucide-react";

type AuthPanelProps = {
  error: string | null;
  isConfigured: boolean;
  isLoading: boolean;
  onGoogleSignIn: () => void;
};

export function AuthPanel({
  error,
  isConfigured,
  isLoading,
  onGoogleSignIn,
}: AuthPanelProps) {
  return (
    <div className="flex min-h-[calc(100vh-58px)] items-center justify-center px-6 py-16">
      <section className="w-full max-w-sm space-y-8">
        <div className="space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-brand-border bg-brand-subtle">
            <ShieldCheck className="h-4 w-4 text-brand-text/60" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-text">
              Sign in to Glimpse
            </h1>
            <p className="text-sm font-light leading-relaxed text-brand-text/55">
              Use your Google account to access the workspace.
            </p>
          </div>
        </div>

        {!isConfigured && (
          <div className="rounded-sm border border-brand-border bg-brand-subtle p-4 text-[11px] leading-relaxed text-brand-text/60">
            Add <span className="font-mono text-brand-text">VITE_SUPABASE_URL</span> and{" "}
            <span className="font-mono text-brand-text">VITE_SUPABASE_ANON_KEY</span> to your
            local environment before signing in.
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-red-500/20 bg-red-500/5 p-4 text-[11px] leading-relaxed text-red-500">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={onGoogleSignIn}
          disabled={!isConfigured || isLoading}
          className="flex w-full items-center justify-between border border-brand-border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-text transition-colors hover:border-brand-text disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>Continue with Google</span>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-brand-text/45" />
          ) : (
            <LogIn className="h-4 w-4 text-brand-text/45" />
          )}
        </button>
      </section>
    </div>
  );
}
