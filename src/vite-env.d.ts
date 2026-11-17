/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  /** URL of a backend endpoint that creates a Stripe Checkout Session. */
  readonly VITE_STRIPE_CHECKOUT_ENDPOINT?: string;
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
