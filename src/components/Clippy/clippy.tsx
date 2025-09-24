import React, { useEffect, useRef } from "react";
import { load, unload } from "./service";
import type { Clippy as ClippyType } from "./clippy.d";

export const Clippy = React.forwardRef<ClippyType, { name?: string; onLoad?: (agent: ClippyType) => void }>(
  ({ name = "Clippy", onLoad = () => null }, ref) => {
    const clippyRef = useRef<ClippyType | null>(null);

    useEffect(() => {
      let mounted = true;
      const initClippy = async () => {
        try {
          const agent = await load(name);
          if (!mounted) return;
          clippyRef.current = agent;
          if (typeof ref === 'function') {
            (ref as any)(agent);
          } else if (ref) {
            (ref as any).current = agent;
          }
          if (onLoad) onLoad(agent);
        } catch (err) {
          console.error(err);
        }
      };

      initClippy();

      return () => {
        mounted = false;
        if (clippyRef.current) {
          try {
            clippyRef.current.hide();
          } catch (e) {
            // ignore
          }
          // tell service we no longer need it
          try { unload(name); } catch (e) {}
          clippyRef.current = null;
        }
        if (typeof ref === 'function') {
          (ref as any)(null);
        } else if (ref) {
          (ref as any).current = null;
        }
      };
    }, [name]);

    return <></>;
  }
);

export default Clippy;