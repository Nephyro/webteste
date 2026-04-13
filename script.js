// Força o scroll para o topo antes do reload terminar
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
    
window.scrollTo(0, 0);

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const container = document.getElementById('main-container');
    const percentEl = document.getElementById('load-percent');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const cascadeWrapper = document.getElementById('cascade-wrapper');
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');




    // --- 1. NAVBAR (Comportamento de Scroll) ---
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        navbar.style.transform = (scrollTop > lastScrollTop && scrollTop > 100) ? "translateY(-100%)" : "translateY(0)";
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    }, { passive: true });

    // --- 2. SCROLL SUAVE PARA LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith("#")) {
                e.preventDefault();
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
            }
        });
    });

    // --- 3. LOADER (Efeito de Cascata de Código) ---
    const codeFragments = ["BOOT_NODE_082", "AUTH_KEY_VERIFIED", "SQL_SHIELD_UP", "JVM_THREAD_INIT", "ENCRYPT_AES_256"];
    function createCodeLine() {
        if (!cascadeWrapper) return;
        const line = document.createElement('div');
        line.className = "whitespace-nowrap flex gap-4 text-[10px] font-mono";
        line.innerHTML = `<span class="text-[#ff1f57]/40">[${Math.random().toString().slice(2,10)}]</span><span class="text-white/80">${codeFragments[Math.floor(Math.random() * codeFragments.length)]}</span>`;
        cascadeWrapper.appendChild(line);
        if (cascadeWrapper.childNodes.length > 25) cascadeWrapper.removeChild(cascadeWrapper.firstChild);
    }
    const cascadeInterval = setInterval(createCodeLine, 50);

    // --- 4. TYPEWRITER (Header) ---
    function typeFullTitle() {
        const name = "ANDERSON RIBEIRO";
        const titleContainer = document.getElementById('typewriter-name');
        if (!titleContainer) return;
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

    // --- 5. PROGRESSO DO CARREGAMENTO ---
    let progress = 0;
    const bootInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 1;
        if (progress >= 100) {
            progress = 100; 
            clearInterval(bootInterval); 
            clearInterval(cascadeInterval);
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

    // --- 6. ROLETA 3D DE PROJETOS ---
    const carousel = document.getElementById('carousel');
    const cards = document.querySelectorAll('.card');
    if (carousel && cards.length > 0) {
        let currentIndex = 0;
        const angleStep = 360 / cards.length;
        const radius = 350; 
        let isDragging = false, startX = 0, currentDragDistance = 0;

        cards.forEach((card, i) => {
            card.style.transform = `rotateY(${i * angleStep}deg) translateZ(${radius}px)`;
        });

        const updateRotation = () => {
            carousel.style.transform = `translateZ(-${radius}px) rotateY(${currentIndex * -angleStep}deg)`;
        };
        updateRotation();

        const onStart = (e) => {
            isDragging = true;
            startX = e.pageX || e.touches[0].pageX;
            currentDragDistance = 0;
        };
        const onMove = (e) => {
            if (!isDragging) return;
            currentDragDistance = (e.pageX || e.touches[0].pageX) - startX;
        };
        const onEnd = () => {
            if (!isDragging) return;
            if (Math.abs(currentDragDistance) > 80) {
                currentDragDistance > 0 ? currentIndex-- : currentIndex++;
                updateRotation();
            }
            isDragging = false;
        };

        window.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchstart', onStart);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onEnd);

        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (Math.abs(currentDragDistance) < 10) card.classList.toggle('flipped');
            });
        });
    }

    // --- 7. TERMINAL (Simulação Java) ---
    const terminalData = [
        { text: "anderson@linux:~$ ", color: "#60a5fa", type: "prompt" }, 
        { text: "python3 hello_world.py", color: "#fff", type: "input", delay: 80 }, 
        { text: "Traceback (most recent call last):", color: "#ef4444", type: "output" },
        { text: '  File "hello_world.py", line 1, in <module>', color: "#ef4444", type: "output" },
        { text: "PermissionError: [Errno 13] Permission denied", color: "#ef4444", type: "output" },
        { text: "anderson@linux:~$ ", color: "#60a5fa", type: "prompt" },
        { text: "...", color: "#fff", type: "input", delay: 1000 }, // Pausa dramática
        { text: "sudo !!", color: "#fff", type: "input", delay: 150 },
        { text: "[sudo] password for developer: **********", color: "#7289a3", type: "input", delay: 30 },
        { text: "Hello World!", color: "#f1fa8c", type: "success" } 
    ];
    
    let pIdx = 0;
    let isTerminalTyping = false;
    
    async function typeTerminal() {
        const terminalEl = document.getElementById('terminal-code');
        const cursor = document.getElementById('terminal-cursor'); // Pegamos o cursor
        
        if (!terminalEl || isTerminalTyping) return;
        isTerminalTyping = true;
    
        for (const line of terminalData) {
            const span = document.createElement('span');
            span.style.color = line.color;
            
            if (line.type === "success") {
                span.className = "block text-xl font-bold mt-2 text-[#7ee787] animate-pulse";
            }
    
            terminalEl.appendChild(span);
    
            if (line.type === "input") {
                // Colocamos o cursor DENTRO do span para ele ficar colado no texto
                span.appendChild(cursor); 
    
                for (const char of line.text) {
                    // Inserimos o texto ANTES do cursor
                    const charNode = document.createTextNode(char);
                    span.insertBefore(charNode, cursor); 
                    
                    await new Promise(r => setTimeout(r, line.delay || 50));
                }
                
                // Após terminar a linha, podemos deixar o cursor ali ou mover para a próxima
                terminalEl.appendChild(document.createElement('br'));
            } else {
                span.textContent = line.text;
                if (line.type !== "prompt") {
                    terminalEl.appendChild(document.createElement('br'));
                }
                // Move o cursor para o final da última ação
                terminalEl.appendChild(cursor);
            }
    
            await new Promise(r => setTimeout(r, 600));
            
            const container = document.getElementById('terminal-container');
            container.scrollTop = container.scrollHeight;
        }
    }

    // --- 8. MOUSE EFFECT (Luz de Fundo e Tilt nos Cards) ---
document.addEventListener('mousemove', (e) => {
    const bgLight = document.getElementById('bg-light');
    const cursor = document.getElementById('custom-cursor');
    const stackCards = document.querySelectorAll('.stack-card');

    // Move a luz de fundo e o cursor
    if (bgLight) bgLight.style.background = `radial-gradient(circle 250px at ${e.clientX}px ${e.clientY}px, transparent 0%, rgba(2, 4, 10, 1) 100%)`;
    if (cursor) { 
        cursor.style.left = `${e.clientX}px`; 
        cursor.style.top = `${e.clientY}px`; 
    }

    // Efeito de Inclinação (Tilt)
    stackCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Se o mouse estiver dentro do card
        if (x > 0 && y > 0 && x < rect.width && y < rect.height) {
            const rotateX = (y / rect.height - 0.5) * -15; // Inclinação vertical
            const rotateY = (x / rect.width - 0.5) * 15;   // Inclinação horizontal
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.borderColor = "rgba(255, 31, 87, 0.6)";
        } else {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.borderColor = "rgba(255, 31, 87, 0.1)";
        }
    });
});

    // --- 9. MENU MOBILE ---
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex', !isHidden);
            mobileMenuBtn.querySelector('i').className = isHidden ? 'fas fa-bars' : 'fas fa-times';
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            });
        });
    }

    // --- 10. OBSERVER (Reveal de Seções) ---
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