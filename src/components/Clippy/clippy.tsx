import React, { useEffect, useRef } from "react";
import { load } from "./service";
import type { Clippy as ClippyType } from "./clippy.d";

export const Clippy = React.forwardRef<ClippyType, { name?: string; onLoad?: () => void }>(
  ({ name = "Clippy", onLoad = () => null }, ref) => {
    const clippyRef = useRef<ClippyType | null>(null);

    if (!ref) {
      throw Error("Clippy component requires a ref");
    }

    useEffect(() => {
      const initClippy = async () => {
        try {
          const agent = await load(name);
          clippyRef.current = agent;
          if (typeof ref === 'function') {
            ref(agent);
          } else if (ref) {
            ref.current = agent;
          }
          onLoad();
        } catch (err) {
          console.error(err);
        }
      };

      initClippy();

      return () => {
        if (clippyRef.current) {
          if (typeof ref === 'function') {
            ref(null);
          } else {
            ref.current = null;
          }
          clippyRef.current.hide();
        }
      };
    }, []);

    return <></>;
  }
);

export default Clippy;