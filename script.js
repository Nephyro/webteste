window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const container = document.getElementById('main-container');
    const percentEl = document.getElementById('load-percent');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const cascadeWrapper = document.getElementById('cascade-wrapper');
    const navbar = document.getElementById('navbar');

    // --- 1. NAVBAR ---
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        navbar.style.transform = (scrollTop > lastScrollTop && scrollTop > 100) ? "translateY(-100%)" : "translateY(0)";
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    }, { passive: true });

    // --- 2. SCROLL SUAVE ---
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#inicio") {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 90; 
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- 3. LOADER & CASCATA ---
    const codeFragments = ["BOOT_NODE_082", "AUTH_KEY_VERIFIED", "SQL_SHIELD_UP", "JVM_THREAD_INIT", "DOCKER_SPAWN_OK", "ENCRYPT_AES_256"];
    function createCodeLine() {
        if (!cascadeWrapper) return;
        const line = document.createElement('div');
        line.className = "whitespace-nowrap flex gap-4 text-[10px] font-mono";
        line.innerHTML = `<span class="text-[#ff1f57]/40">[${Math.random().toString().slice(2,10)}]</span><span class="text-white/80">${codeFragments[Math.floor(Math.random() * codeFragments.length)]}</span>`;
        cascadeWrapper.appendChild(line);
        if (cascadeWrapper.childNodes.length > 25) cascadeWrapper.removeChild(cascadeWrapper.firstChild);
    }
    const cascadeInterval = setInterval(createCodeLine, 50);

    // --- 4. TYPEWRITER ---
    function typeFullTitle() {
        const name = "ANDERSON RIBEIRO";
        const titleContainer = document.getElementById('typewriter-name');
        let i = 0;
        function step() {
            if (i < name.length) {
                const span = document.createElement('span');
                const char = name.charAt(i);
                if (['R', 'B', 'A'].includes(char) && Math.random() > 0.4) span.className = 'neon-flicker';
                span.textContent = char;
                titleContainer.appendChild(span);
                i++; setTimeout(step, 85);
            }
        }
        step();
    }

    // --- 5. PROGRESSO ---
    let progress = 0;
    const bootInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 1;
        if (progress >= 100) {
            progress = 100; clearInterval(bootInterval); clearInterval(cascadeInterval);
            setTimeout(() => { 
                loader.style.opacity = '0'; 
                setTimeout(() => { 
                    loader.remove(); 
                    container.classList.remove('opacity-0', 'translate-y-10'); 
                    typeFullTitle();
                }, 800); 
            }, 500);
        }
        percentEl.innerText = `${progress}%`; 
        progressBarFill.style.width = `${progress}%`; 
    }, 90);

    // --- 6. TERMINAL AJUSTADO (CÓDIGO + OUTPUT) ---
    const terminalData = [
        {text: '>>> ', color: '#7289a3'}, 
        {text: 'System.out.println', color: '#ff1f57'}, 
        {text: '(', color: '#fff'}, 
        {text: '"Hello World"', color: '#f1fa8c'}, 
        {text: ');\n', color: '#fff'},
        {text: 'Hello World', color: '#fff', delay: 500, isOutput: true} 
    ];

    let pIdx = 0, cIdx = 0, isTyping = false;
    function typeTerminal() {
        if (isTyping) return; isTyping = true;
        const terminalEl = document.getElementById('terminal-code');
        
        function step() {
            if (pIdx < terminalData.length) {
                const currentPart = terminalData[pIdx];
                
                if (cIdx === 0) {
                    const s = document.createElement('span');
                    s.style.color = currentPart.color;
                    if (currentPart.isOutput) s.style.fontWeight = 'bold';
                    s.id = `term-${pIdx}`;
                    terminalEl.appendChild(s);
                }

                document.getElementById(`term-${pIdx}`).textContent += currentPart.text.charAt(cIdx++);

                if (cIdx >= currentPart.text.length) {
                    cIdx = 0;
                    pIdx++;
                    setTimeout(step, currentPart.delay || 40);
                } else {
                    setTimeout(step, 40);
                }
            }
        }
        step();
    }

    // --- 7. MOUSE & TILT ---
    document.addEventListener('mousemove', (e) => {
        const bgLight = document.getElementById('bg-light');
        const cursor = document.getElementById('custom-cursor');
        if (bgLight) bgLight.style.background = `radial-gradient(circle 250px at ${e.clientX}px ${e.clientY}px, transparent 0%, rgba(2, 4, 10, 1) 100%)`;
        if (cursor) { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; }
    });

    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.transform = `rotateX(${(rect.height/2-(e.clientY - rect.top))/12}deg) rotateY(${(e.clientX - rect.left-rect.width/2)/12}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`); card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
        card.addEventListener('mouseleave', () => card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    });

    // --- 8. OBSERVER ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if(entry.isIntersecting) { 
                if(entry.target.id === 'terminal-code') typeTerminal();
                else entry.target.classList.add('active'); 
            } 
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-section, #terminal-code').forEach(s => observer.observe(s));
});