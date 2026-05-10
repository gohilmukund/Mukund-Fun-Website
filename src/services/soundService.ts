class SoundService {
  private audioCtx: AudioContext | null = null;

  private initContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playBIOSBeep() {
    try {
      this.initContext();
      const oscillator = this.audioCtx!.createOscillator();
      const gainNode = this.audioCtx!.createGain();

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, this.audioCtx!.currentTime); // High pitched beep
      
      gainNode.gain.setValueAtTime(0.1, this.audioCtx!.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx!.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx!.destination);

      oscillator.start();
      oscillator.stop(this.audioCtx!.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio blocked or not supported');
    }
  }

  playStartupSound() {
    const audio = new Audio('https://www.orangefreesounds.com/wp-content/uploads/2014/09/Windows-95-startup-sound.mp3');
    audio.play().catch(e => console.warn('Audio blocked by browser policy'));
  }
}

export const soundService = new SoundService();
