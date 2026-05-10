# Recommended Improvements for Windows 95/98 Authenticity

This document tracks potential enhancements to make the web app feel even more like a real Windows 95/98 machine.

## 🪟 Window Management
- [ ] **Active Window Focus**: Implement a `zIndex` system to bring clicked windows to the front.
- [ ] **True Resizing**: Add logic to drag window borders for resizing.
- [ ] **Maximize/Restore**: Implement snapped full-screen and restore functionality.
- [ ] **Minimize Animation**: Add a "shrink" animation towards the taskbar icon.

## 🎨 Visual Aesthetics
- [ ] **Retro Typography**: Switch to fonts like MS Sans Serif or Tahoma.
- [ ] **Pixel-Perfect Cursors**: Use classic Windows 95 cursor icons (arrow, hourglass, etc.).
- [ ] **Enhanced 3D Borders**: Use authentic hex codes for 1px inset/outset borders.
- [ ] **CRT/Scanline Overlay**: Add a subtle scanline/flicker effect for that CRT glow.

## 🔊 Audio & Interaction
- [ ] **System Sounds**: Add click, error (ding), and window action sounds.
- [ ] **Context Menus**: Implement custom right-click menus for Desktop and Taskbar.
- [ ] **Screensaver**: Add classic screensavers (e.g., Flying Windows) after inactivity.
- [ ] **Easter Egg**: Implement a fun "Blue Screen of Death" (BSOD) scenario.

## 📁 App & System Logic
- [ ] **Functional "My Computer"**: Create a simulated file explorer for "C:\" and "A:\".
- [ ] **State Persistence**: Save Notepad content and window positions in `localStorage`.
- [ ] **Detailed Taskbar Clock**: Show the date on hover.

## ⚙️ Performance & Polish
- [ ] **Low-Res Mode**: Add a toggle for a restricted 256-color palette look.
- [ ] **Asset Preloading**: Ensure sounds and heavy images are preloaded during boot.
