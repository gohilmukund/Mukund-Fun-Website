import clippy from "clippyjs";
import type { Clippy } from "./clippy.d";
// CSS import is handled by bundler config

// Keep a cache of loaded agents and inflight promises to avoid duplicate loads
// allow undefined values so runtime existence checks work with TypeScript
const agentCache: Record<string, Clippy | undefined> = {};
const inflight: Record<string, Promise<Clippy> | undefined> = {};
const refCount: Record<string, number | undefined> = {};

const extendAgent = (agent: any): Clippy => {
  // add convenience ask method that renders an input in the balloon
  (agent as any).ask = (message: string, callback: (response: string) => void) => {
    const balloon = document.querySelector('.clippy-balloon');
    if (balloon) {
      const content = balloon.querySelector('.clippy-content');
      if (content) {
        // remove any previous ad-hoc input
        const existing = content.querySelector('.clippy-input');
        if (existing) existing.remove();

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'clippy-input';
        input.style.width = '100%';
        input.style.marginTop = '8px';
        input.style.padding = '4px';
        input.style.border = '1px solid #000';

        const handleSubmit = () => {
          const value = input.value;
          input.remove();
          callback(value);
        };

        input.addEventListener('keydown', (e) => {
          if ((e as KeyboardEvent).key === 'Enter') {
            handleSubmit();
          }
        });

        // speak then append input so it doesn't get overwritten by balloon text
        if (typeof agent.speak === 'function') {
          agent.speak(message, () => {
            content.appendChild(input);
            input.focus();
          });
        } else {
          content.appendChild(input);
          input.focus();
        }
      }
    }
  };

  return agent as Clippy;
};

export const load = (name = ""): Promise<Clippy> => {
  const key = name || 'Clippy';
  if (agentCache[key]) {
    refCount[key] = (refCount[key] || 0) + 1;
    return Promise.resolve(agentCache[key]);
  }
  if (inflight[key]) {
    // ensure refcount increments once the inflight promise resolves
    inflight[key] = inflight[key].then((agent) => {
      refCount[key] = (refCount[key] || 0) + 1;
      return agent;
    });
    return inflight[key];
  }

  const p = new Promise<Clippy>((resolve, reject) => {
    clippy.load(
      name,
      (agent: any) => {
        const extended = extendAgent(agent);
        agentCache[key] = extended;
        resolve(extended);
      },
      reject,
      "https://cdn.jsdelivr.net/gh/pi0/clippyjs/assets/agents/"
    );
  });

  inflight[key] = p;
  // clear inflight on completion
  p.finally(() => delete inflight[key]);
  // increment reference count when starting load; will be incremented again on cache hit
  refCount[key] = (refCount[key] || 0) + 1;
  return p;
};

export const unload = (name = '') => {
  const key = name || 'Clippy';
  if (!refCount[key]) refCount[key] = 0;
  refCount[key] = Math.max(0, refCount[key] - 1);
  if (refCount[key] === 0 && agentCache[key]) {
    try {
      const agent = agentCache[key] as any;
      if (typeof agent.stop === 'function') agent.stop();
      if (typeof agent.hide === 'function') agent.hide();
    } catch (e) {
      // ignore
    }
    // remove any leftover DOM nodes that clippyjs may have left
    setTimeout(() => {
      const nodes = document.querySelectorAll('.clippy, .clippy-balloon');
      nodes.forEach(n => n.remove());
      delete agentCache[key];
    }, 300);
  }
};