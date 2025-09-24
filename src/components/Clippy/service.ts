import clippy from "clippyjs";
import type { Clippy } from "./clippy.d";
// CSS import is handled by bundler config

const extendAgent = (agent: any): Clippy => {
  agent.askUser = (message: string, callback: (response: string) => void) => {
    const balloon = document.querySelector('.clippy-balloon');
    if (balloon) {
      const content = balloon.querySelector('.clippy-content');
      if (content) {
        const input = document.createElement('input');
        input.type = 'text';
        input.style.width = '100%';
        input.style.marginTop = '8px';
        input.style.padding = '4px';
        input.style.border = '1px solid #000';
        
        const handleSubmit = () => {
          const value = input.value;
          content.removeChild(input);
          callback(value);
        };

        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        });

        agent.speak(message, () => {
          content.appendChild(input);
          input.focus();
        });
      }
    }
  };
  return agent;
};

export const load = (name = ""): Promise<Clippy> =>
  new Promise((resolve, reject) => {
    clippy.load(
      name,
      (agent) => resolve(extendAgent(agent)),
      reject,
      "https://cdn.jsdelivr.net/gh/pi0/clippyjs/assets/agents/"
    );
  });