import type { DetailedHTMLProps, HTMLAttributes } from "react";

type ModelViewerAttributes = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  src?: string;
  alt?: string;
  poster?: string;
  "camera-controls"?: boolean | "";
  "auto-rotate"?: boolean | "";
  "auto-rotate-delay"?: string | number;
  "rotation-per-second"?: string;
  loading?: "auto" | "lazy" | "eager";
  reveal?: "auto" | "interaction" | "manual";
  "shadow-intensity"?: string | number;
  "camera-orbit"?: string;
  exposure?: string | number;
};

// React 19's "react-jsx" transform resolves intrinsic elements from
// React's own JSX namespace (re-exported by react/jsx-runtime), not the
// ambient global JSX namespace — so <model-viewer>, a custom element, has
// to be registered here rather than via `declare global { namespace JSX }`.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes;
    }
  }
}

export {};
