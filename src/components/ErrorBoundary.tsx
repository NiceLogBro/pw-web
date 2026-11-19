import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Without a boundary, a single thrown render (e.g. a service referencing a photo
 * key that no longer exists) unmounts the whole tree and leaves a blank page.
 * This keeps the page usable and surfaces the failure in the console.
 */
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-2xl font-extrabold text-foam">
          Something went wrong loading the report
        </h1>
        <p className="text-sm leading-relaxed text-white/60">
          The comparison failed to render. You can reload the page, or reach the #1 pick directly at{" "}
          <a href="tel:+18089276202" className="text-spray underline underline-offset-2">
            (808) 927-6202
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-spray px-5 py-2.5 text-sm font-bold text-abyss transition hover:bg-foam"
        >
          Reload
        </button>
      </div>
    );
  }
}
