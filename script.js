window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const container = document.getElementById('main-container');
    const percentEl = document.getElementById('load-percent');
    const statusEl = document.getElementById('status-text');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const asciiTesseract = document.getElementById('ascii-tesseract');

    const statusUpdates = ["> INICIANDO_NÓ_SENAI_JND...", "> CARREGANDO_REGISTROS...", "> AUTENTICANDO...", "> MAPEANDO_RECURSOS...", "> ACESSO_PERMITIDO."];

    // --- 4D TESSERACT ENGINE ---
    let angle = 0;
    const width = 80, height = 28;
    const buffer = new Array(width * height);
    const vertices4D = [];
    for (let x = -1; x <= 1; x += 2) for (let y = -1; y <= 1; y += 2) for (let z = -1; z <= 1; z += 2) for (let w = -1; w <= 1; w += 2) vertices4D.push({x, y, z, w});
    const edges = [];
    for (let i = 0; i < 16; i++) for (let j = i + 1; j < 16; j++) {
        if ([vertices4D[i].x!==vertices4D[j].x, vertices4D[i].y!==vertices4D[j].y, vertices4D[i].z!==vertices4D[j].z, vertices4D[i].w!==vertices4D[j].w].filter(Boolean).length === 1) edges.push([i, j]);
    }
    function renderTesseract() {
        buffer.fill(' ');
        const projected = vertices4D.map(v => {
            const cosT = Math.cos(angle), sinT = Math.sin(angle);
            let x = v.x * cosT - v.y * sinT, y = v.x * sinT + v.y * cosT, z = v.z, w = v.w;
            const zr = z * Math.cos(angle * 0.5) - w * Math.sin(angle * 0.5), wr = z * Math.sin(angle * 0.5) + w * Math.cos(angle * 0.5);
            const f4 = 1 / (3 + wr), f3 = 1 / (4 + zr * f4);
            return { x: Math.floor(width/2 + 60 * f3 * x * f4 * 2.2), y: Math.floor(height/2 + 60 * f3 * y * f4) };
        });
        edges.forEach(edge => {
            let x0 = projected[edge[0]].x, y0 = projected[edge[0]].y, x1 = projected[edge[1]].x, y1 = projected[edge[1]].y;
            let dx = Math.abs(x1-x0), sx = x0<x1?1:-1, dy = -Math.abs(y1-y0), sy = y0<y1?1:-1, err = dx+dy;
            while(true){
                if(x0>=0 && x0<width && y0>=0 && y0<height) buffer[x0+y0*width] = '#';
                if(x0===x1 && y0===y1) break;
                let e2 = 2*err;
                if(e2>=dy){ err+=dy; x0+=sx; }
                if(e2<=dx){ err+=dx; y0+=sy; }
            }
        });
        asciiTesseract.textContent = buffer.join('').match(new RegExp('.{1,' + width + '}', 'g')).join('\n');
        angle += 0.02; requestAnimationFrame(renderTesseract);
    }
    renderTesseract();

    // --- BOOT ---
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 1;
        if (progress >= 100) {
            progress = 100; clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => { 
                    loader.remove(); 
                    container.classList.remove('opacity-0', 'translate-y-10'); 
                    startHeaderAnim(); 
                }, 800);
            }, 500);
        }
        percentEl.innerText = `${progress}%`;
        progressBarFill.style.width = `${progress}%`;
        statusEl.innerText = statusUpdates[Math.floor((progress/100)*(statusUpdates.length-1))];
    }, 80);
});

function startHeaderAnim() {
    const last = document.getElementById('typewriter-last'), text = "Ribeiro";
    let i = 0;
    (function type() { if(i < text.length) { last.innerText += text.charAt(i++); setTimeout(type, 120); } })();
}

// MOUSE & CURSOR
const bgLight = document.getElementById('bg-light'), cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
    bgLight.style.background = `radial-gradient(circle 250px at ${e.clientX}px ${e.clientY}px, transparent 0%, rgba(2, 4, 10, 1) 100%)`;
    cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`;
});

// TILT EFFECT CARDS
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const rotateX = (rect.height / 2 - y) / 10, rotateY = (x - rect.width / 2) / 10;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
    card.addEventListener('mouseleave', () => card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
});

// TERMINAL LOGIC
const terminalData = [
    { text: '>>> ', color: '#7289a3' }, { text: 'print', color: '#ff1f57' }, { text: '(', color: '#fff' },
    { text: '"Hello World"', color: '#f1fa8c' }, { text: ')', color: '#fff' }, { text: '\nHello World', color: '#fff' }, { text: '\n>>> ', color: '#7289a3' }
];
let pIdx = 0, cIdx = 0;
const terminalEl = document.getElementById('terminal-code');
function typeTerminal() {
    if (pIdx < terminalData.length) {
        if (cIdx === 0) { const s = document.createElement('span'); s.style.color = terminalData[pIdx].color; s.id = `term-${pIdx}`; terminalEl.appendChild(s); }
        document.getElementById(`term-${pIdx}`).textContent += terminalData[pIdx].text.charAt(cIdx++);
        if (cIdx >= terminalData[pIdx].text.length) { cIdx = 0; pIdx++; }
        setTimeout(typeTerminal, 50);
    }
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting) { if(entry.target.id === 'terminal-code') typeTerminal(); else entry.target.classList.add('active'); } });
}, { threshold: 0.1 });
document.querySelectorAll('section, #terminal-code').forEach(s => observer.observe(s));
window.addEventListener('load', () => {
    const loader = document.getElementById('loader'), container = document.getElementById('main-container'), percentEl = document.getElementById('load-percent'), statusEl = document.getElementById('status-text'), progressBarFill = document.getElementById('progress-bar-fill'), asciiTesseract = document.getElementById('ascii-tesseract');
    const statusUpdates = ["> INICIANDO_NÓ...", "> CARREGANDO_REGISTROS...", "> AUTENTICANDO...", "> MAPEANDO_SISTEMA...", "> ACESSO_PERMITIDO."];
    
    // TILT & MOUSE
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top;
            card.style.transform = `rotateX(${(rect.height/2 - y)/10}deg) rotateY(${(x - rect.width/2)/10}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.setProperty('--mouse-x', `${x}px`); card.style.setProperty('--mouse-y', `${y}px`);
        });
        card.addEventListener('mouseleave', () => card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    });

    // TERMINAL
    const terminalData = [{text: '>>> ', color: '#7289a3'}, {text: 'print', color: '#ff1f57'}, {text: '(', color: '#fff'}, {text: '"Hello World"', color: '#f1fa8c'}, {text: ')', color: '#fff'}, {text: '\nHello World', color: '#fff'}, {text: '\n>>> ', color: '#7289a3'}];
    let pIdx = 0, cIdx = 0;
    function typeTerminal() {
        if (pIdx < terminalData.length) {
            if (cIdx === 0) { const s = document.createElement('span'); s.style.color = terminalData[pIdx].color; s.id = `term-${pIdx}`; document.getElementById('terminal-code').appendChild(s); }
            document.getElementById(`term-${pIdx}`).textContent += terminalData[pIdx].text.charAt(cIdx++);
            if (cIdx >= terminalData[pIdx].text.length) { cIdx = 0; pIdx++; }
            setTimeout(typeTerminal, 50);
        }
    }

    // BOOT & OBSERVER
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 1;
        if (progress >= 100) {
            progress = 100; clearInterval(interval);
            setTimeout(() => { loader.style.opacity = '0'; setTimeout(() => { loader.remove(); container.classList.remove('opacity-0', 'translate-y-10'); }, 800); }, 500);
        }
        percentEl.innerText = `${progress}%`; progressBarFill.style.width = `${progress}%`; statusEl.innerText = statusUpdates[Math.floor((progress/100)*(statusUpdates.length-1))];
    }, 80);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting) { if(entry.target.id === 'terminal-code') typeTerminal(); else entry.target.classList.add('active'); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-section, #terminal-code').forEach(s => observer.observe(s));
});