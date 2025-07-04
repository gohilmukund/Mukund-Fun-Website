/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import '@tailwindcss/browser';

//Gemini 95 was fully vibe-coded by @ammaar and @olacombe, while we don't endorse code quality, we thought it was a fun demonstration of what's possible with the model when a Designer and PM jam.
//An homage to an OS that inspired so many of us!

// Define the dosInstances object to fix type errors
const dosInstances: Record<string, { initialized: boolean }> = {};

// --- DOM Element References ---
const desktop = document.getElementById('desktop') as HTMLDivElement;
const windows = document.querySelectorAll('.window') as NodeListOf<HTMLDivElement>;
const icons = document.querySelectorAll('.icon') as NodeListOf<HTMLDivElement>; // This is a NodeList
const startMenu = document.getElementById('start-menu') as HTMLDivElement;
const startButton = document.getElementById('start-button') as HTMLButtonElement;
const taskbarAppsContainer = document.getElementById('taskbar-apps') as HTMLDivElement;
const clockElement = document.getElementById('taskbar-clock') as HTMLDivElement;
const paintAssistant = document.getElementById('paint-assistant') as HTMLDivElement;
const assistantBubble = paintAssistant?.querySelector('.assistant-bubble') as HTMLDivElement;

// --- State Variables ---
let activeWindow: HTMLDivElement | null = null;
let highestZIndex: number = 20; // Start z-index for active windows
const openApps = new Map<string, { windowEl: HTMLDivElement; taskbarButton: HTMLDivElement }>(); // Store open apps and their elements
let geminiInstance: any | null = null; // Store the initialized Gemini AI instance
let paintCritiqueIntervalId: number | null = null; // Timer for paint critiques

// Store ResizeObservers to disconnect them later
const paintResizeObserverMap = new Map<Element, ResizeObserver>();

// --- Minesweeper Game State Variables ---
let minesweeperTimerInterval: number | null = null;
let minesweeperTimeElapsed: number = 0;
let minesweeperFlagsPlaced: number = 0;
let minesweeperGameOver: boolean = false;
let minesweeperMineCount: number = 10; // Default for 9x9
let minesweeperGridSize: { rows: number, cols: number } = { rows: 9, cols: 9 }; // Default 9x9
let minesweeperFirstClick: boolean = true; // To ensure first click is never a mine

// --- YouTube Player State ---
// @ts-ignore: YT will be defined by the YouTube API script
const youtubePlayers: Record<string, YT.Player | null> = {};
let ytApiLoaded = false;
let ytApiLoadingPromise: Promise<void> | null = null;

const DEFAULT_YOUTUBE_VIDEO_ID = 'WXuK6gekU1Y'; // Default video for GemPlayer ("Never Gonna Give You Up")

// --- Core Functions ---

/** Brings a window to the front and sets it as active */
function bringToFront(windowElement: HTMLDivElement): void {
    if (activeWindow === windowElement) return; // Already active

    if (activeWindow) {
        activeWindow.classList.remove('active');
        const appName = activeWindow.id;
        if (openApps.has(appName)) {
            openApps.get(appName)?.taskbarButton.classList.remove('active');
        }
    }

    highestZIndex++;
    windowElement.style.zIndex = highestZIndex.toString();
    windowElement.classList.add('active');
    activeWindow = windowElement;

    const appNameRef = windowElement.id;
    if (openApps.has(appNameRef)) {
        openApps.get(appNameRef)?.taskbarButton.classList.add('active');
    }
     if ((appNameRef === 'doom' || appNameRef === 'wolf3d') && dosInstances[appNameRef]) {
        const container = document.getElementById(`${appNameRef}-container`); // This ID might need checking
        const canvas = container?.querySelector('canvas');
        canvas?.focus();
     }
}

/** Opens an application window */
async function openApp(appName: string): Promise<void> {
    const windowElement = document.getElementById(appName) as HTMLDivElement | null;
    if (!windowElement) {
        console.error(`Window element not found for app: ${appName}`);
        return;
    }

    if (openApps.has(appName)) {
        bringToFront(windowElement);
        windowElement.style.display = 'flex';
        windowElement.classList.add('active');
        return;
    }

    windowElement.style.display = 'flex';
    windowElement.classList.add('active');
    bringToFront(windowElement);

    const taskbarButton = document.createElement('div');
    taskbarButton.classList.add('taskbar-app');
    taskbarButton.dataset.appName = appName;

    let iconSrc = '';
    let title = appName;
    const iconElement = findIconElement(appName);
    if (iconElement) {
        const img = iconElement.querySelector('img');
        const span = iconElement.querySelector('span');
        if(img) iconSrc = img.src;
        if(span) title = span.textContent || appName;
    } else { // Fallback for apps opened via start menu but maybe no desktop icon
         switch(appName) {
            case 'myComputer': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/mycomputer.png'; title = 'My Gemtop'; break;
            case 'chrome': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/chrome-icon-2.png'; title = 'Chrome'; break;
            case 'notepad': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/GemNotes.png'; title = 'GemNotes'; break;
            case 'paint': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/gempaint.png'; title = 'GemPaint'; break;
            case 'doom': iconSrc = 'https://64.media.tumblr.com/1d89dfa76381e5c14210a2149c83790d/7a15f84c681c1cf9-c1/s540x810/86985984be99d5591e0cbc0dea6f05ffa3136dac.png'; title = 'Doom II'; break;
            case 'gemini': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/GeminiChatRetro.png'; title = 'Gemini App'; break;
            case 'minesweeper': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/gemsweeper.png'; title = 'GemSweeper'; break;
            case 'imageViewer': iconSrc = 'https://win98icons.alexmeub.com/icons/png/display_properties-4.png'; title = 'Image Viewer'; break;
            case 'mediaPlayer': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/ytmediaplayer.png'; title = 'GemPlayer'; break;
         }
    }

    if (iconSrc) {
        const img = document.createElement('img');
        img.src = iconSrc;
        img.alt = title;
        taskbarButton.appendChild(img);
    }
    taskbarButton.appendChild(document.createTextNode(title));

    taskbarButton.addEventListener('click', () => {
        if (windowElement === activeWindow && windowElement.style.display !== 'none') {
             minimizeApp(appName);
        } else {
            windowElement.style.display = 'flex';
            bringToFront(windowElement);
        }
    });

    taskbarAppsContainer.appendChild(taskbarButton);
    openApps.set(appName, { windowEl: windowElement, taskbarButton: taskbarButton });
    taskbarButton.classList.add('active');

    // Initialize specific applications
    if (appName === 'chrome') {
        initAiBrowser(windowElement);
    }
    else if (appName === 'notepad') {
        await initNotepadStory(windowElement);
    }
    else if (appName === 'paint') {
        initSimplePaintApp(windowElement);
        if (paintAssistant) paintAssistant.classList.add('visible');
        if (assistantBubble) assistantBubble.textContent = 'Warming up my judging circuits...';
        if (paintCritiqueIntervalId) clearInterval(paintCritiqueIntervalId);
        paintCritiqueIntervalId = window.setInterval(critiquePaintDrawing, 15000);
    }
    else if (appName === 'doom' && !dosInstances['doom']) {
        const doomContainer = document.getElementById('doom-content') as HTMLDivElement;
        if (doomContainer) {
            doomContainer.innerHTML = '<iframe src="https://js-dos.com/games/doom.exe.html" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen></iframe>';
            dosInstances['doom'] = { initialized: true };
        }
    } else if (appName === 'gemini') {
        await initGeminiChat(windowElement);
    }
    else if (appName === 'minesweeper') {
        initMinesweeperGame(windowElement);
    }
    else if (appName === 'myComputer') {
        initMyComputer(windowElement);
    }
    else if (appName === 'mediaPlayer') {
        await initMediaPlayer(windowElement);
    }
}

/** Closes an application window */
function closeApp(appName: string): void {
    const appData = openApps.get(appName);
    if (!appData) return;

    const { windowEl, taskbarButton } = appData;

    windowEl.style.display = 'none';
    windowEl.classList.remove('active');
    taskbarButton.remove();
    openApps.delete(appName);

    if (dosInstances[appName]) {
        console.log(`Cleaning up ${appName} instance (iframe approach)`);
        const container = document.getElementById(`${appName}-content`);
        if (container) container.innerHTML = '';
        delete dosInstances[appName];
    }

    if (appName === 'paint') {
        if (paintCritiqueIntervalId) {
            clearInterval(paintCritiqueIntervalId);
            paintCritiqueIntervalId = null;
            if (paintAssistant) paintAssistant.classList.remove('visible');
        }
         const paintContent = appData.windowEl.querySelector('.window-content') as HTMLDivElement | null;
         if (paintContent && paintResizeObserverMap.has(paintContent)) {
             paintResizeObserverMap.get(paintContent)?.disconnect();
             paintResizeObserverMap.delete(paintContent);
         }
    }

    if (appName === 'minesweeper') {
        if (minesweeperTimerInterval) {
            clearInterval(minesweeperTimerInterval);
            minesweeperTimerInterval = null;
        }
    }

    if (appName === 'mediaPlayer') {
        const player = youtubePlayers[appName];
        if (player) {
            try {
                if (typeof player.stopVideo === 'function') player.stopVideo();
                if (typeof player.destroy === 'function') player.destroy();
            } catch (e) {
                console.warn("Error stopping/destroying media player:", e);
            }
            delete youtubePlayers[appName];
            console.log("Destroyed YouTube player for mediaPlayer.");
        }
        // Reset the player area with a message
        const playerDivId = `youtube-player-${appName}`;
        const playerDiv = document.getElementById(playerDivId) as HTMLDivElement | null;
        if (playerDiv) {
            playerDiv.innerHTML = `<p class="media-player-status-message">Player closed. Enter a YouTube URL to load.</p>`;
        }
        // Reset control buttons state (optional, but good practice)
        const mediaPlayerWindow = document.getElementById('mediaPlayer');
        if (mediaPlayerWindow) {
            const playBtn = mediaPlayerWindow.querySelector('#media-player-play') as HTMLButtonElement;
            const pauseBtn = mediaPlayerWindow.querySelector('#media-player-pause') as HTMLButtonElement;
            const stopBtn = mediaPlayerWindow.querySelector('#media-player-stop') as HTMLButtonElement;
            if (playBtn) playBtn.disabled = true;
            if (pauseBtn) pauseBtn.disabled = true;
            if (stopBtn) stopBtn.disabled = true;
        }
    }


    if (activeWindow === windowEl) {
        activeWindow = null;
        let nextAppToActivate: HTMLDivElement | null = null;
        let maxZ = -1;
        openApps.forEach((data) => {
             const z = parseInt(data.windowEl.style.zIndex || '0', 10);
             if (z > maxZ) {
                 maxZ = z;
                 nextAppToActivate = data.windowEl;
             }
        });
        if (nextAppToActivate) {
            bringToFront(nextAppToActivate);
        }
    }
}

/** Minimizes an application window */
function minimizeApp(appName: string): void {
    const appData = openApps.get(appName);
    if (!appData) return;

    const { windowEl, taskbarButton } = appData;

    windowEl.style.display = 'none';
    windowEl.classList.remove('active');
    taskbarButton.classList.remove('active');

    if (activeWindow === windowEl) {
        activeWindow = null;
         let nextAppToActivate: string | null = null;
         let maxZ = 0;
         openApps.forEach((data, name) => {
             if (data.windowEl.style.display !== 'none') {
                 const z = parseInt(data.windowEl.style.zIndex || '0', 10);
                 if (z > maxZ) {
                     maxZ = z;
                     nextAppToActivate = name;
                 }
             }
         });
         if (nextAppToActivate) {
             bringToFront(openApps.get(nextAppToActivate)!.windowEl);
         }
    }
}

// --- Gemini Chat Specific Functions ---
async function initGeminiChat(windowElement: HTMLDivElement): Promise<void> {
    const historyDiv = windowElement.querySelector('.gemini-chat-history') as HTMLDivElement;
    const inputEl = windowElement.querySelector('.gemini-chat-input') as HTMLInputElement;
    const sendButton = windowElement.querySelector('.gemini-chat-send') as HTMLButtonElement;

    if (!historyDiv || !inputEl || !sendButton) {
        console.error("Gemini chat elements not found in window:", windowElement.id);
        return;
    }

    function addChatMessage(container: HTMLDivElement, text: string, className: string = '') {
        const p = document.createElement('p');
        if (className) p.classList.add(className);
        p.textContent = text;
        container.appendChild(p);
        container.scrollTop = container.scrollHeight;
    }

    addChatMessage(historyDiv, "Initializing AI...", "system-message");

    const sendMessage = async () => {
        if (!geminiInstance) {
            const initSuccess = await initializeGeminiIfNeeded('initGeminiChat');
            if (!initSuccess) {
                addChatMessage(historyDiv, "Error: Failed to initialize AI.", "error-message");
                return;
            }
            const initMsg = Array.from(historyDiv.children).find(el => el.textContent?.includes("Initializing AI..."));
            if (initMsg) initMsg.remove();
            addChatMessage(historyDiv, "AI Ready.", "system-message");
        }

        const message = inputEl.value.trim();
        if (!message) return;

        addChatMessage(historyDiv, `You: ${message}`, "user-message");
        inputEl.value = '';
        inputEl.disabled = true;
        sendButton.disabled = true;

        try {
             // @ts-ignore
            const chat = geminiInstance.chats.create({ model: 'gemini-2.5-flash', history: [] });
             // @ts-ignore
            const result = await chat.sendMessageStream({message: message});
            let fullResponse = "";
            addChatMessage(historyDiv, "Gemini: ", "gemini-message");
            const lastMessageElement = historyDiv.lastElementChild as HTMLParagraphElement | null;
            for await (const chunk of result) {
                 const chunkText = chunk.text || "";
                 fullResponse += chunkText;
                 if (lastMessageElement) {
                    lastMessageElement.textContent += chunkText;
                    historyDiv.scrollTop = historyDiv.scrollHeight;
                 }
            }
        } catch (error: any) {
            addChatMessage(historyDiv, `Error: ${error.message || 'Failed to get response.'}`, "error-message");
        } finally {
             inputEl.disabled = false; sendButton.disabled = false; inputEl.focus();
        }
    };
    sendButton.onclick = sendMessage;
    inputEl.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
    inputEl.disabled = false; sendButton.disabled = false; inputEl.focus();
}

/** Handles Notepad story generation */
async function initNotepadStory(windowElement: HTMLDivElement): Promise<void> {
    const textarea = windowElement.querySelector('.notepad-textarea') as HTMLTextAreaElement;
    const storyButton = windowElement.querySelector('.notepad-story-button') as HTMLButtonElement;
    if (!textarea || !storyButton) return;

    storyButton.addEventListener('click', async () => {
        const currentText = textarea.value;
        textarea.value = currentText + "\n\nGenerating story... Please wait...\n\n";
        textarea.scrollTop = textarea.scrollHeight;
        storyButton.disabled = true; storyButton.textContent = "Working...";
        try {
            if (!geminiInstance) {
                if (!await initializeGeminiIfNeeded('initNotepadStory')) throw new Error("Failed to initialize Gemini API.");
            }
            const prompt = "Write me a short creative story (250-300 words) with an unexpected twist ending. Make it engaging and suitable for all ages.";
             // @ts-ignore
            const result = await geminiInstance.models.generateContentStream({ model: 'gemini-2.5-flash', contents: prompt });
            textarea.value = currentText + "\n\n";
            for await (const chunk of result) {
                 textarea.value += chunk.text || "";
                 textarea.scrollTop = textarea.scrollHeight;
            }
            textarea.value += "\n\n";
        } catch (error: any) {
            textarea.value = currentText + "\n\nError: " + (error.message || "Failed to generate story.") + "\n\n";
        } finally {
            storyButton.disabled = false; storyButton.textContent = "Generate Story";
            textarea.scrollTop = textarea.scrollHeight;
        }
    });
}

/** Initializes the AI Browser functionality with image generation */
function initAiBrowser(windowElement: HTMLDivElement): void {
    const addressBar = windowElement.querySelector('.browser-address-bar') as HTMLInputElement;
    const goButton = windowElement.querySelector('.browser-go-button') as HTMLButtonElement;
    const iframe = windowElement.querySelector('#browser-frame') as HTMLIFrameElement;
    const loadingEl = windowElement.querySelector('.browser-loading') as HTMLDivElement;
    const DIAL_UP_SOUND_URL = 'https://www.soundjay.com/communication/dial-up-modem-01.mp3';
    let dialUpAudio: HTMLAudioElement | null = null;

    if (!addressBar || !goButton || !iframe || !loadingEl) return;

    async function navigateToUrl(url: string): Promise<void> {
        if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname;

            // --- RESTORED DIALUP ANIMATION ---
            loadingEl.innerHTML = `
                <style>
                    .dialup-animation .dot {
                        animation: dialup-blink 1.4s infinite both;
                    }
                    .dialup-animation .dot:nth-child(2) {
                        animation-delay: 0.2s;
                    }
                    .dialup-animation .dot:nth-child(3) {
                        animation-delay: 0.4s;
                    }
                    @keyframes dialup-blink {
                        0%, 80%, 100% { opacity: 0; }
                        40% { opacity: 1; }
                    }
                    .browser-loading p { margin: 5px 0; }
                    .browser-loading .small-text { font-size: 0.8em; color: #aaa; }
                </style>
                <img src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/000/948/341/datas/original.gif"/>
                <p>Connecting to ${domain}<span class="dialup-animation"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span></p>
                <!-- Sound will play via JS -->
            `;
            loadingEl.style.display = 'flex';
            // --- END RESTORED DIALUP ANIMATION ---

            try {
                if (!dialUpAudio) {
                    dialUpAudio = new Audio(DIAL_UP_SOUND_URL); dialUpAudio.loop = true;
                }
                await dialUpAudio.play();
            } catch (audioError) { console.error("Dial-up sound error:", audioError); }

            try {
                if (!geminiInstance) {
                    if (!await initializeGeminiIfNeeded('initAiBrowser')) {
                        iframe.src = 'data:text/plain;charset=utf-8,AI Init Error';
                        loadingEl.style.display = 'none'; return;
                    }
                }
                const websitePrompt = `
                Create a complete 90s-style website for the domain "${domain}".
                MUST include: 1 relevant image, garish 90s styling (neon, comic sans, tables), content specific to "${domain}", scrolling marquee, retro emoji/ascii, blinking text, visitor counter (9000+), "Under Construction" signs. Fun, humorous, 1996 feel. Image MUST match theme. No modern design.
                `;
                 // @ts-ignore
                const result = await geminiInstance.models.generateContent({
                    model: 'gemini-2.0-flash-preview-image-generation',
                    contents: [{role: 'user', parts: [{text: websitePrompt}]}],
                    config: { temperature: 0.9, responseModalities: ['TEXT', 'IMAGE'] }
                });
                let htmlContent = ""; const images: string[] = [];
                if (result.candidates?.[0]?.content) {
                    for (const part of result.candidates[0].content.parts) {
                        if (part.text) htmlContent += part.text.replace(/```html|```/g, '').trim();
                        else if (part.inlineData?.data) images.push(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
                    }
                }
                if (!htmlContent.includes("<html")) {
                    htmlContent = `<!DOCTYPE html><html><head><title>${domain}</title><style>body{font-family:"Comic Sans MS";background:lime;color:blue;}marquee{background:yellow;color:red;}img{max-width:80%; display:block; margin:10px auto; border: 3px ridge gray;}</style></head><body><marquee>Welcome to ${domain}!</marquee><h1>${domain}</h1><div>${htmlContent}</div></body></html>`;
                }
                if (images.length > 0) {
                     if (!htmlContent.includes('<img src="data:')) {
                         htmlContent = htmlContent.replace(/(<\/h1>)/i, `$1\n<img src="${images[0]}" alt="Site Image">`);
                     }
                }
                iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
                addressBar.value = url;
            } catch (e: any) {
                iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(`<html><body>Error generating site: ${e.message}</body></html>`);
            } finally {
                loadingEl.style.display = 'none';
                if (dialUpAudio) { dialUpAudio.pause(); dialUpAudio.currentTime = 0; }
            }
        } catch (e) { alert("Invalid URL"); loadingEl.style.display = 'none'; }
    }
    goButton.addEventListener('click', () => navigateToUrl(addressBar.value));
    addressBar.addEventListener('keydown', (e) => { if (e.key === 'Enter') navigateToUrl(addressBar.value); });
    addressBar.addEventListener('click', () => addressBar.select());
}
// --- Event Listeners Setup ---

icons.forEach(icon => {
    icon.addEventListener('click', () => {
        const appName = icon.getAttribute('data-app');
        if (appName) {
            openApp(appName);
            startMenu.classList.remove('active');
        }
    });
});

document.querySelectorAll('.start-menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const appName = (item as HTMLElement).getAttribute('data-app');
        if (appName) openApp(appName);
        startMenu.classList.remove('active');
    });
});

startButton.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.classList.toggle('active');
    if (startMenu.classList.contains('active')) {
        highestZIndex++;
        startMenu.style.zIndex = highestZIndex.toString();
    }
});

windows.forEach(windowElement => {
    const titleBar = windowElement.querySelector('.window-titlebar') as HTMLDivElement | null;
    const closeButton = windowElement.querySelector('.window-close') as HTMLDivElement | null;
    const minimizeButton = windowElement.querySelector('.window-minimize') as HTMLDivElement | null;

    windowElement.addEventListener('mousedown', () => bringToFront(windowElement), true);

    if (closeButton) {
        closeButton.addEventListener('click', (e) => { e.stopPropagation(); closeApp(windowElement.id); });
    }
    if (minimizeButton) {
        minimizeButton.addEventListener('click', (e) => { e.stopPropagation(); minimizeApp(windowElement.id); });
    }

    if (titleBar) {
        let isDragging = false;
        let dragOffsetX: number, dragOffsetY: number;
        const startDragging = (e: MouseEvent) => {
             if (!(e.target === titleBar || titleBar.contains(e.target as Node)) || (e.target as Element).closest('.window-control-button')) {
                 isDragging = false; return;
            }
            isDragging = true; bringToFront(windowElement);
            const rect = windowElement.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left; dragOffsetY = e.clientY - rect.top;
            titleBar.style.cursor = 'grabbing';
            document.addEventListener('mousemove', dragWindow);
            document.addEventListener('mouseup', stopDragging, { once: true });
        };
        const dragWindow = (e: MouseEvent) => {
            if (!isDragging) return;
            let x = e.clientX - dragOffsetX; let y = e.clientY - dragOffsetY;
            const taskbarHeight = taskbarAppsContainer.parentElement?.offsetHeight ?? 36;
            const maxX = window.innerWidth - windowElement.offsetWidth;
            const maxY = window.innerHeight - windowElement.offsetHeight - taskbarHeight;
            const minX = -(windowElement.offsetWidth - 40);
            const maxXAdjusted = window.innerWidth - 40;
            x = Math.max(minX, Math.min(x, maxXAdjusted));
            y = Math.max(0, Math.min(y, maxY));
            windowElement.style.left = `${x}px`; windowElement.style.top = `${y}px`;
        };
        const stopDragging = () => {
            if (!isDragging) return;
            isDragging = false; titleBar.style.cursor = 'grab';
            document.removeEventListener('mousemove', dragWindow);
        };
        titleBar.addEventListener('mousedown', startDragging);
    }

    if (!openApps.has(windowElement.id)) { // Only apply random for newly opened, not for bringToFront
        const randomTop = Math.random() * (window.innerHeight / 4) + 20;
        const randomLeft = Math.random() * (window.innerWidth / 3) + 20;
        windowElement.style.top = `${randomTop}px`;
        windowElement.style.left = `${randomLeft}px`;
    }
});

document.addEventListener('click', (e) => {
    if (startMenu.classList.contains('active') && !startMenu.contains(e.target as Node) && !startButton.contains(e.target as Node)) {
        startMenu.classList.remove('active');
    }
});

function findIconElement(appName: string): HTMLDivElement | undefined {
    return Array.from(icons).find(icon => icon.dataset.app === appName);
}

function initTaskbar() {
    function updateClock() {
        if (!clockElement) return;
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
        const timeString = `${hours}:${minutesStr} ${ampm}`;
        clockElement.textContent = timeString;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

initTaskbar();

console.log("Gemini 95 Simulator Initialized (TS)");

async function critiquePaintDrawing(): Promise<void> {
    const paintWindow = document.getElementById('paint') as HTMLDivElement | null;
    if (!paintWindow || paintWindow.style.display === 'none') return;
    const canvas = paintWindow.querySelector('#paint-canvas') as HTMLCanvasElement | null;
    if (!canvas) { if (assistantBubble) assistantBubble.textContent = 'Error: Canvas not found!'; return; }
    if (!geminiInstance) {
        if (!await initializeGeminiIfNeeded('critiquePaintDrawing')) {
            if (assistantBubble) assistantBubble.textContent = 'Error: AI init failed!'; return;
        }
    }
    try {
        if (assistantBubble) assistantBubble.textContent = 'Analyzing...';
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64Data = imageDataUrl.split(',')[1];
        if (!base64Data) throw new Error("Failed to get base64 data.");
        const prompt = "Critique this drawing with witty sarcasm (1-2 sentences).";
        const imagePart = { inlineData: { data: base64Data, mimeType: "image/jpeg" } };
         // @ts-ignore
        const result = await geminiInstance.models.generateContent({ model: "gemini-2.5-pro-exp-03-25", contents: [{ role: "user", parts: [ { text: prompt }, imagePart] }] });
        const critique = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Is this art?";
        if (assistantBubble) assistantBubble.textContent = critique;
    } catch (error: any) {
        if (assistantBubble) assistantBubble.textContent = `Critique Error: ${error.message}`;
    }
}

function initSimplePaintApp(windowElement: HTMLDivElement): void {
    const canvas = windowElement.querySelector('#paint-canvas') as HTMLCanvasElement;
    const toolbar = windowElement.querySelector('.paint-toolbar') as HTMLDivElement;
    const contentArea = windowElement.querySelector('.window-content') as HTMLDivElement; // This is the direct parent managing canvas size
    const colorSwatches = windowElement.querySelectorAll('.paint-color-swatch') as NodeListOf<HTMLButtonElement>;
    const sizeButtons = windowElement.querySelectorAll('.paint-size-button') as NodeListOf<HTMLButtonElement>;
    const clearButton = windowElement.querySelector('.paint-clear-button') as HTMLButtonElement;

    if (!canvas || !toolbar || !contentArea || !clearButton) { return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) { return; }

    let isDrawing = false; let lastX = 0; let lastY = 0;
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    let currentStrokeStyle = ctx.strokeStyle; let currentLineWidth = ctx.lineWidth;

    function resizeCanvas() {
        const rect = contentArea.getBoundingClientRect();
        const toolbarHeight = toolbar.offsetHeight;
        const newWidth = Math.floor(rect.width); // Canvas width is content area width
        const newHeight = Math.floor(rect.height - toolbarHeight); // Canvas height is content area height minus toolbar

        if (canvas.width === newWidth && canvas.height === newHeight && newWidth > 0 && newHeight > 0) return;

        canvas.width = newWidth > 0 ? newWidth : 1;
        canvas.height = newHeight > 0 ? newHeight : 1;

        ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = currentStrokeStyle; ctx.lineWidth = currentLineWidth;
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    }

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(contentArea);
    paintResizeObserverMap.set(contentArea, resizeObserver);
    resizeCanvas();

    function getMousePos(canvasDom: HTMLCanvasElement, event: MouseEvent | TouchEvent): { x: number, y: number } {
        const rect = canvasDom.getBoundingClientRect();
        let clientX, clientY;
        if (event instanceof MouseEvent) { clientX = event.clientX; clientY = event.clientY; }
        else { clientX = event.touches[0].clientX; clientY = event.touches[0].clientY; }
        return { x: clientX - rect.left, y: clientY - rect.top };
    }
    function startDrawing(e: MouseEvent | TouchEvent) {
        isDrawing = true; const pos = getMousePos(canvas, e);
        [lastX, lastY] = [pos.x, pos.y]; ctx.beginPath(); ctx.moveTo(lastX, lastY);
    }
    function draw(e: MouseEvent | TouchEvent) {
        if (!isDrawing) return; e.preventDefault();
        const pos = getMousePos(canvas, e);
        ctx.lineTo(pos.x, pos.y); ctx.stroke();
        [lastX, lastY] = [pos.x, pos.y];
    }
    function stopDrawing() { if (isDrawing) isDrawing = false; }

    canvas.addEventListener('mousedown', startDrawing); canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing); canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing); canvas.addEventListener('touchcancel', stopDrawing);

    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            ctx.strokeStyle = swatch.dataset.color || 'black'; currentStrokeStyle = ctx.strokeStyle;
            colorSwatches.forEach(s => s.classList.remove('active')); swatch.classList.add('active');
            if (swatch.dataset.color === 'white') {
                const largeSizeButton = Array.from(sizeButtons).find(b => b.dataset.size === '10');
                if (largeSizeButton) {
                    ctx.lineWidth = parseInt(largeSizeButton.dataset.size || '10', 10); currentLineWidth = ctx.lineWidth;
                    sizeButtons.forEach(s => s.classList.remove('active')); largeSizeButton.classList.add('active');
                }
            } else {
                const activeSizeButton = Array.from(sizeButtons).find(b => b.classList.contains('active'));
                if (activeSizeButton) { ctx.lineWidth = parseInt(activeSizeButton.dataset.size || '2', 10); currentLineWidth = ctx.lineWidth; }
            }
        });
    });
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            ctx.lineWidth = parseInt(button.dataset.size || '2', 10); currentLineWidth = ctx.lineWidth;
            sizeButtons.forEach(s => s.classList.remove('active')); button.classList.add('active');
            const eraser = Array.from(colorSwatches).find(s => s.dataset.color === 'white');
            if (!eraser?.classList.contains('active')) {
                 if (!Array.from(colorSwatches).some(s => s.classList.contains('active'))) {
                    const blackSwatch = Array.from(colorSwatches).find(s => s.dataset.color === 'black');
                    blackSwatch?.classList.add('active'); ctx.strokeStyle = 'black'; currentStrokeStyle = ctx.strokeStyle;
                 }
            }
        });
    });
    clearButton.addEventListener('click', () => {
        ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    (windowElement.querySelector('.paint-color-swatch[data-color="black"]') as HTMLButtonElement)?.classList.add('active');
    (windowElement.querySelector('.paint-size-button[data-size="2"]') as HTMLButtonElement)?.classList.add('active');
}

type MinesweeperCell = { isMine: boolean; isRevealed: boolean; isFlagged: boolean; adjacentMines: number; element: HTMLDivElement; row: number; col: number; };
function initMinesweeperGame(windowElement: HTMLDivElement): void {
    const boardElement = windowElement.querySelector('#minesweeper-board') as HTMLDivElement;
    const flagCountElement = windowElement.querySelector('.minesweeper-flag-count') as HTMLDivElement;
    const timerElement = windowElement.querySelector('.minesweeper-timer') as HTMLDivElement;
    const resetButton = windowElement.querySelector('.minesweeper-reset-button') as HTMLButtonElement;
    const hintButton = windowElement.querySelector('.minesweeper-hint-button') as HTMLButtonElement;
    const commentaryElement = windowElement.querySelector('.minesweeper-commentary') as HTMLDivElement;
    if (!boardElement || !flagCountElement || !timerElement || !resetButton || !hintButton || !commentaryElement) return;
    let grid: MinesweeperCell[][] = [];
    function resetGame() {
        if (minesweeperTimerInterval) clearInterval(minesweeperTimerInterval);
        minesweeperTimerInterval = null; minesweeperTimeElapsed = 0; minesweeperFlagsPlaced = 0;
        minesweeperGameOver = false; minesweeperFirstClick = true; minesweeperMineCount = 10;
        minesweeperGridSize = { rows: 9, cols: 9 };
        timerElement.textContent = `⏱️ 0`; flagCountElement.textContent = `🚩 ${minesweeperMineCount}`;
        resetButton.textContent = '🙂'; commentaryElement.textContent = "Let's play! Click a square.";
        createGrid();
    }
    function createGrid() {
        boardElement.innerHTML = ''; grid = [];
        boardElement.style.gridTemplateColumns = `repeat(${minesweeperGridSize.cols}, 20px)`;
        boardElement.style.gridTemplateRows = `repeat(${minesweeperGridSize.rows}, 20px)`;
        for (let r = 0; r < minesweeperGridSize.rows; r++) {
            const row: MinesweeperCell[] = [];
            for (let c = 0; c < minesweeperGridSize.cols; c++) {
                const cellElement = document.createElement('div'); cellElement.classList.add('minesweeper-cell');
                const cellData: MinesweeperCell = { isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0, element: cellElement, row: r, col: c };
                cellElement.addEventListener('click', () => handleCellClick(cellData));
                cellElement.addEventListener('contextmenu', (e) => { e.preventDefault(); handleCellRightClick(cellData); });
                row.push(cellData); boardElement.appendChild(cellElement);
            }
            grid.push(row);
        }
    }
    function placeMines(firstClickRow: number, firstClickCol: number) {
        let minesPlaced = 0;
        while (minesPlaced < minesweeperMineCount) {
            const r = Math.floor(Math.random() * minesweeperGridSize.rows);
            const c = Math.floor(Math.random() * minesweeperGridSize.cols);
            if ((r === firstClickRow && c === firstClickCol) || grid[r][c].isMine) continue;
            grid[r][c].isMine = true; minesPlaced++;
        }
        for (let r = 0; r < minesweeperGridSize.rows; r++) {
            for (let c = 0; c < minesweeperGridSize.cols; c++) {
                if (!grid[r][c].isMine) grid[r][c].adjacentMines = countAdjacentMines(r, c);
            }
        }
    }
    function countAdjacentMines(row: number, col: number): number {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr; const nc = col + dc;
                if (nr >= 0 && nr < minesweeperGridSize.rows && nc >= 0 && nc < minesweeperGridSize.cols && grid[nr][nc].isMine) count++;
            }
        }
        return count;
    }
    function handleCellClick(cell: MinesweeperCell) {
        if (minesweeperGameOver || cell.isRevealed || cell.isFlagged) return;
        if (minesweeperFirstClick && !minesweeperTimerInterval) {
             placeMines(cell.row, cell.col); minesweeperFirstClick = false; startTimer();
        }
        if (cell.isMine) gameOver(cell);
        else { revealCell(cell); checkWinCondition(); }
    }
    function handleCellRightClick(cell: MinesweeperCell) {
        if (minesweeperGameOver || cell.isRevealed || (minesweeperFirstClick && !minesweeperTimerInterval)) return;
        cell.isFlagged = !cell.isFlagged; cell.element.textContent = cell.isFlagged ? '🚩' : '';
        minesweeperFlagsPlaced += cell.isFlagged ? 1 : -1;
        updateFlagCount(); checkWinCondition();
    }
    function revealCell(cell: MinesweeperCell) {
        if (cell.isRevealed || cell.isFlagged || cell.isMine) return;
        cell.isRevealed = true; cell.element.classList.add('revealed'); cell.element.textContent = '';
        if (cell.adjacentMines > 0) {
            cell.element.textContent = cell.adjacentMines.toString();
            cell.element.dataset.number = cell.adjacentMines.toString();
        } else {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = cell.row + dr; const nc = cell.col + dc;
                    if (nr >= 0 && nr < minesweeperGridSize.rows && nc >= 0 && nc < minesweeperGridSize.cols) {
                        const neighbor = grid[nr][nc];
                        if (!neighbor.isRevealed && !neighbor.isFlagged) revealCell(neighbor);
                    }
                }
            }
        }
    }
    function startTimer() {
        if (minesweeperTimerInterval) return;
        minesweeperTimeElapsed = 0; timerElement.textContent = `⏱️ 0`;
        minesweeperTimerInterval = window.setInterval(() => {
            minesweeperTimeElapsed++; timerElement.textContent = `⏱️ ${minesweeperTimeElapsed}`;
        }, 1000);
    }
    function updateFlagCount() {
        flagCountElement.textContent = `🚩 ${minesweeperMineCount - minesweeperFlagsPlaced}`;
    }
    function gameOver(clickedMine: MinesweeperCell) {
        minesweeperGameOver = true;
        if (minesweeperTimerInterval) clearInterval(minesweeperTimerInterval);
        minesweeperTimerInterval = null; resetButton.textContent = '😵';
        grid.forEach(row => row.forEach(cell => {
            if (cell.isMine) {
                cell.element.classList.add('mine', 'revealed'); cell.element.textContent = '💣';
            }
            if (!cell.isMine && cell.isFlagged) cell.element.textContent = '❌';
        }));
        clickedMine.element.classList.add('exploded'); clickedMine.element.textContent = '💥';
    }
    function checkWinCondition() {
        if (minesweeperGameOver) return;
        let revealedCount = 0; let correctlyFlaggedMines = 0;
        grid.forEach(row => row.forEach(cell => {
            if (cell.isRevealed && !cell.isMine) revealedCount++;
            if (cell.isFlagged && cell.isMine) correctlyFlaggedMines++;
        }));
        const totalNonMineCells = (minesweeperGridSize.rows * minesweeperGridSize.cols) - minesweeperMineCount;
        if (revealedCount === totalNonMineCells || (correctlyFlaggedMines === minesweeperMineCount && minesweeperFlagsPlaced === minesweeperMineCount)) {
            minesweeperGameOver = true;
            if (minesweeperTimerInterval) clearInterval(minesweeperTimerInterval);
            minesweeperTimerInterval = null; resetButton.textContent = '😎';
            if (revealedCount === totalNonMineCells) {
                 grid.forEach(row => row.forEach(cell => {
                     if (cell.isMine && !cell.isFlagged) { cell.isFlagged = true; cell.element.textContent = '🚩'; minesweeperFlagsPlaced++; }
                 })); updateFlagCount();
            }
        }
    }
    function getBoardStateAsText(): string {
        let boardString = `Flags: ${minesweeperMineCount - minesweeperFlagsPlaced}, Time: ${minesweeperTimeElapsed}s\nGrid (H=Hidden,F=Flag,Num=Mines):\n`;
        grid.forEach(row => {
            row.forEach(cell => {
                if (cell.isFlagged) boardString += " F ";
                else if (!cell.isRevealed) boardString += " H ";
                else if (cell.adjacentMines > 0) boardString += ` ${cell.adjacentMines} `;
                else boardString += " _ ";
            });
            boardString += "\n";
        });
        return boardString;
    }
    async function getAiHint() {
        if (minesweeperGameOver || minesweeperFirstClick) { commentaryElement.textContent = "Click a square first!"; return; }
        hintButton.disabled = true; hintButton.textContent = '🤔'; commentaryElement.textContent = 'Thinking...';
        if (!geminiInstance) {
            if (!await initializeGeminiIfNeeded('getAiHint')) {
                commentaryElement.textContent = 'AI Init Error.'; hintButton.disabled = false; hintButton.textContent = '💡 Hint'; return;
            }
        }
        try {
            const boardState = getBoardStateAsText();
            const prompt = `Minesweeper state:\n${boardState}\nShort, witty hint (1-2 sentences) for a safe move or dangerous area. Don't reveal exact mines unless certain. Hint:`;
             // @ts-ignore
            const result = await geminiInstance.models.generateContent({ model: "gemini-2.5-flash", contents: [{role:"user", parts:[{text:prompt}]}], config: {temperature: 0.7}});
            const hintText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Try clicking somewhere?";
            commentaryElement.textContent = hintText;
        } catch (error: any) { commentaryElement.textContent = `Hint Error: ${error.message}`;
        } finally { hintButton.disabled = false; hintButton.textContent = '💡 Hint'; }
    }
    resetButton.addEventListener('click', resetGame);
    hintButton.addEventListener('click', getAiHint);
    resetGame();
}

function initMyComputer(windowElement: HTMLDivElement): void {
    const cDriveIcon = windowElement.querySelector('#c-drive-icon') as HTMLDivElement;
    const cDriveContent = windowElement.querySelector('#c-drive-content') as HTMLDivElement;
    const secretImageIcon = windowElement.querySelector('#secret-image-icon') as HTMLDivElement;
    if (!cDriveIcon || !cDriveContent || !secretImageIcon) return;
    cDriveIcon.addEventListener('click', () => {
        cDriveIcon.style.display = 'none'; cDriveContent.style.display = 'block';
    });
    secretImageIcon.addEventListener('click', () => {
        const imageViewerWindow = document.getElementById('imageViewer') as HTMLDivElement | null;
        const imageViewerImg = document.getElementById('image-viewer-img') as HTMLImageElement | null;
        const imageViewerTitle = document.getElementById('image-viewer-title') as HTMLSpanElement | null;
        if (!imageViewerWindow || !imageViewerImg || !imageViewerTitle) { alert("Image Viewer corrupted!"); return; }
        imageViewerImg.src = 'https://storage.googleapis.com/gemini-95-icons/%40ammaar%2B%40olacombe.png';
        imageViewerImg.alt = 'dontshowthistoanyone.jpg';
        imageViewerTitle.textContent = 'dontshowthistoanyone.jpg - Image Viewer';
        openApp('imageViewer');
    });
    cDriveIcon.style.display = 'inline-flex'; cDriveContent.style.display = 'none';
}

// --- YouTube Player (GemPlayer) Logic ---
function loadYouTubeApi(): Promise<void> {
    if (ytApiLoaded) return Promise.resolve();
    if (ytApiLoadingPromise) return ytApiLoadingPromise;

    ytApiLoadingPromise = new Promise((resolve, reject) => {
        // @ts-ignore
        if (window.YT && window.YT.Player) {
            ytApiLoaded = true; resolve(); return;
        }
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.onerror = (err) => {
            console.error("Failed to load YouTube API script:", err);
            ytApiLoadingPromise = null;
            reject(new Error("YouTube API script load failed"));
        };
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);

        // @ts-ignore
        window.onYouTubeIframeAPIReady = () => {
            ytApiLoaded = true; ytApiLoadingPromise = null; resolve();
        };
        setTimeout(() => {
            if (!ytApiLoaded) {
                 // @ts-ignore
                if (window.onYouTubeIframeAPIReady) window.onYouTubeIframeAPIReady = null;
                ytApiLoadingPromise = null;
                reject(new Error("YouTube API load timeout"));
            }
        }, 10000);
    });
    return ytApiLoadingPromise;
}

function getYouTubeVideoId(urlOrId: string): string | null {
    if (!urlOrId) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
    const match = urlOrId.match(regExp);
    return (match && match[1]) ? match[1] : null;
}

async function initMediaPlayer(windowElement: HTMLDivElement): Promise<void> {
    const appName = windowElement.id; // 'mediaPlayer'
    const urlInput = windowElement.querySelector('.media-player-input') as HTMLInputElement;
    const loadButton = windowElement.querySelector('.media-player-load-button') as HTMLButtonElement;
    const playerContainerDivId = `youtube-player-${appName}`;
    const playerDiv = windowElement.querySelector(`#${playerContainerDivId}`) as HTMLDivElement;
    const playButton = windowElement.querySelector('#media-player-play') as HTMLButtonElement;
    const pauseButton = windowElement.querySelector('#media-player-pause') as HTMLButtonElement;
    const stopButton = windowElement.querySelector('#media-player-stop') as HTMLButtonElement;

    if (!urlInput || !loadButton || !playerDiv || !playButton || !pauseButton || !stopButton) {
        console.error("Media Player elements not found for", appName);
        if (playerDiv) playerDiv.innerHTML = `<p class="media-player-status-message" style="color:red;">Error: Player UI missing.</p>`;
        return;
    }

    const updateButtonStates = (playerState?: number) => {
        // @ts-ignore
        const YTPlayerState = window.YT?.PlayerState;
        if (!YTPlayerState) {
             playButton.disabled = true; pauseButton.disabled = true; stopButton.disabled = true;
             return;
        }
        const state = playerState !== undefined ? playerState
            // @ts-ignore
            : (youtubePlayers[appName] && typeof youtubePlayers[appName].getPlayerState === 'function' ? youtubePlayers[appName].getPlayerState() : YTPlayerState.UNSTARTED);

        playButton.disabled = state === YTPlayerState.PLAYING || state === YTPlayerState.BUFFERING;
        pauseButton.disabled = state !== YTPlayerState.PLAYING && state !== YTPlayerState.BUFFERING; // Can pause if buffering too
        stopButton.disabled = state === YTPlayerState.ENDED || state === YTPlayerState.UNSTARTED || state === -1 /* UNSTARTED also seen as -1 */;
    };

    updateButtonStates(-1); // Initial state (unstarted)

    const showPlayerMessage = (message: string, isError: boolean = false) => {
        const player = youtubePlayers[appName];
        if (player) {
            try { if (typeof player.destroy === 'function') player.destroy(); }
            catch(e) { console.warn("Minor error destroying player:", e); }
            delete youtubePlayers[appName];
        }
        playerDiv.innerHTML = `<p class="media-player-status-message" style="color:${isError ? 'red' : '#ccc'};">${message}</p>`;
        updateButtonStates(-1);
    };

    const initialStatusMessageEl = playerDiv.querySelector('.media-player-status-message');
    if (initialStatusMessageEl) initialStatusMessageEl.textContent = 'Connecting to YouTube...';

    try {
        await loadYouTubeApi();
        if (initialStatusMessageEl) initialStatusMessageEl.textContent = 'YouTube API Ready. Loading default video...';
    } catch (error: any) {
        showPlayerMessage(`Error: Could not load YouTube Player API. ${error.message}`, true);
        return;
    }

    const createPlayer = (videoId: string) => {
        const existingPlayer = youtubePlayers[appName];
        if (existingPlayer) {
            try { if (typeof existingPlayer.destroy === 'function') existingPlayer.destroy(); }
            catch(e) { console.warn("Minor error destroying previous player:", e); }
        }
        playerDiv.innerHTML = ''; // Clear previous content/message

        try {
            // @ts-ignore
            youtubePlayers[appName] = new YT.Player(playerContainerDivId, {
                height: '100%', width: '100%', videoId: videoId,
                playerVars: { 'playsinline': 1, 'autoplay': 1, 'controls': 0, 'modestbranding': 1, 'rel': 0, 'fs': 0, 'origin': window.location.origin },
                events: {
                    'onReady': (event: any) => { /* Autoplay handles start */ updateButtonStates(event.target.getPlayerState()); },
                    'onError': (event: any) => {
                        const errorMessages: { [key: number]: string } = { 2: "Invalid video ID.", 5: "HTML5 Player error.", 100: "Video not found/private.", 101: "Playback disallowed.", 150: "Playback disallowed."};
                        showPlayerMessage(errorMessages[event.data] || `Playback Error (Code: ${event.data})`, true);
                    },
                    'onStateChange': (event: any) => { updateButtonStates(event.data); }
                }
            });
        } catch (error: any) {
             showPlayerMessage(`Failed to create video player: ${error.message}`, true);
        }
    };

    loadButton.addEventListener('click', () => {
        const videoUrlOrId = urlInput.value.trim();
        const videoId = getYouTubeVideoId(videoUrlOrId);
        if (videoId) {
             showPlayerMessage("Loading video..."); // Show loading message immediately
             createPlayer(videoId);
        } else {
            showPlayerMessage("Invalid YouTube URL or Video ID.", true);
        }
    });

    playButton.addEventListener('click', () => {
        const player = youtubePlayers[appName];
        // @ts-ignore
        if (player && typeof player.playVideo === 'function') player.playVideo();
    });
    pauseButton.addEventListener('click', () => {
        const player = youtubePlayers[appName];
        // @ts-ignore
        if (player && typeof player.pauseVideo === 'function') player.pauseVideo();
    });
    stopButton.addEventListener('click', () => {
        const player = youtubePlayers[appName];
        // @ts-ignore
        if (player && typeof player.stopVideo === 'function') {
            player.stopVideo();
            // @ts-ignore - Manually set to ended for button state update
            updateButtonStates(window.YT?.PlayerState?.ENDED);
        }
    });

    if (DEFAULT_YOUTUBE_VIDEO_ID) {
        if (initialStatusMessageEl) initialStatusMessageEl.textContent = `Loading default video...`; // Update message
        createPlayer(DEFAULT_YOUTUBE_VIDEO_ID);
    } else {
        // Message already set by HTML if no default video.
        // showPlayerMessage("Enter a YouTube URL or Video ID and click 'Load'.");
    }
}
// --- END YouTube Player Logic ---

async function initializeGeminiIfNeeded(context: string): Promise<boolean> {
    if (geminiInstance) return true;
    try {
        const module = await import('@google/genai');
        // @ts-ignore
        const GoogleAIClass = module.GoogleGenAI;
        if (typeof GoogleAIClass !== 'function') throw new Error("GoogleGenAI constructor not found.");
        // @ts-ignore
        const apiKey = process.env.GEMINI_API_KEY || "";
        if (!apiKey) {
            alert("CRITICAL ERROR: Gemini API Key missing.");
            throw new Error("API Key is missing.");
        }
         // @ts-ignore
        geminiInstance = new GoogleAIClass({apiKey: apiKey});
        return true;
    } catch (error: any) {
        console.error(`Failed Gemini initialization in ${context}:`, error);
        alert(`CRITICAL ERROR: Gemini AI failed to initialize. ${error.message}`);
        return false;
    }
}