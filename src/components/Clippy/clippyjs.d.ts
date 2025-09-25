declare module 'clippyjs' {
  export function load(
    name: string,
    successCb: (agent: any) => void,
    failCb: (error: any) => void,
    basePath?: string
  ): void;
  
  export default {
    load
  };
}