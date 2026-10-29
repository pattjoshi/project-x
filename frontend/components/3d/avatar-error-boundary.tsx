"use client";

import { Component, type ReactNode } from "react";

export class AvatarErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Failed to load VRM model, falling back to placeholder:", error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
