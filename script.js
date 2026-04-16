// Força o scroll para o topo antes do reload terminar
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Flag global para controle de estado da música
let musicStarted = false;

window.addEventListener('load', () => {
    // --- ELEMENTOS DO DOM ---
    const loader = document.getElementById('loader');
    const container = document.getElementById('main-container');
    const percentEl = document.getElementById('load-percent');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const cascadeWrapper = document.getElementById('cascade-wrapper');
    const navbar = document.getElementById('navbar');
    
    
    // --- LÓGICA DO MENU MOBILE ---
    const menuBtn = document.getElementById('mobile-menu-btn'); 
    const mobileMenu = document.getElementById('mobile-menu');

        if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('active'); // Alterna a classe de animação
        });

        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active'); // Fecha suavemente ao clicar
            });
        });
        
        // Opcional: fecha o menu se clicar fora dele
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
    
    
    // Elementos de Áudio
    const audio = document.getElementById('bg-music');
    const soundBtn = document.getElementById('sound-control');
    const soundIcon = document.getElementById('sound-icon');
    const led = document.getElementById('led');
    const glow = document.getElementById('statusGlow');
    const mutedContent = document.getElementById('mutedContent');
    const barsContainer = document.getElementById('bars');

    // --- 1. NAVBAR (Comportamento de Scroll) ---
    let lastScrollTop = 0;

    // --- DETECTOR DE SESSÃO ATIVA (SCROLL SPY) ---
    const sections = document.querySelectorAll("section, header");
    const navLinks = document.querySelectorAll(".mobile-nav-link, .nav-link-cyber");

    window.addEventListener('scroll', () => {
        // Lógica da Navbar (Esconder/Mostrar)
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (navbar) {
            navbar.style.transform = (scrollTop > lastScrollTop && scrollTop > 100) ? "translateY(-100%)" : "translateY(0)";
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        // Lógica do Scroll Spy (Sessão Ativa)
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active-section");
            // Verifica se o href do link corresponde à seção atual
            if (current && link.getAttribute("href").includes(current)) {
                link.classList.add("active-section");
            }
        });
    }, { passive: true });

    // --- 2. SCROLL SUAVE PARA LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith("#")) {
                e.preventDefault();
                
                // Se for mobile, fecha o menu ao clicar (opcional, mas recomendado)
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) mobileMenu.classList.remove('active');

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
                if (['R', 'B', 'A', 'S', 'D'].includes(char) && Math.random() > 0.4) span.className = 'neon-flicker';
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
                if(loader) loader.style.opacity = '0'; 
                setTimeout(() => { 
                    if(loader) loader.remove(); 
                    document.body.classList.remove('is-loading'); 
                    if(container) container.classList.remove('opacity-0', 'translate-y-10'); 
                    typeFullTitle();
                }, 800); 
            }, 500);
        }
        if(percentEl) percentEl.innerText = `${progress}%`; 
        if(progressBarFill) progressBarFill.style.width = `${progress}%`; 
    }, 90);

    // --- 6. LÓGICA DE ÁUDIO (SINCRONIZADA) ---
    function updateAudioVisuals(playing) {
        if (playing) {
            // Transição de conteúdo: Sai ícone, entra Equalizador
            mutedContent.classList.add('opacity-0', '-translate-y-8', 'blur-md');
            barsContainer.classList.remove('opacity-0', 'translate-y-8', 'blur-md');
            barsContainer.classList.add('opacity-100', 'translate-y-0');

            // Feedback de Hardware (LED e Brilho)
            if (led) {
                led.style.backgroundColor = '#ff1f57';
                led.style.boxShadow = '0 0 8px #ff1f57';
            }
            if (glow) glow.style.opacity = '1';
            
            soundBtn.classList.add('shadow-[0_20px_50px_rgba(255,31,87,0.2)]');
            soundBtn.style.borderColor = 'rgba(255, 31, 87, 0.4)';
        } else {
            // Volta ao estado de Mudo
            mutedContent.classList.remove('opacity-0', '-translate-y-8', 'blur-md');
            barsContainer.classList.add('opacity-0', 'translate-y-8', 'blur-md');
            barsContainer.classList.remove('opacity-100', 'translate-y-0');

            // Desliga Feedbacks
            if (led) {
                led.style.backgroundColor = '#334155'; // Cor slate-700
                led.style.boxShadow = 'none';
            }
            if (glow) glow.style.opacity = '0';
            
            soundBtn.classList.remove('shadow-[0_20px_50px_rgba(255,31,87,0.2)]');
            soundBtn.style.borderColor = 'rgba(255, 31, 87, 0.1)';
        }
    }

    // Sincronização Automática
    if (audio) {
    // Força o loop nativo
        audio.loop = true;

        // EVENTO CHAVE: Reinicia antes do "silêncio" do arquivo (Gapless Trick)
        audio.addEventListener('timeupdate', function() {
            // Se faltar menos de 0.3 segundos para acabar, volta para o início
            // Esse valor (0.3) pode ser ajustado dependendo do seu arquivo de áudio
            const buffer = 0.3; 
            if (this.currentTime > this.duration - buffer) {
                this.currentTime = 0;
                this.play();
            }
        });

        audio.onplay = () => updateAudioVisuals(true);
        audio.onpause = () => updateAudioVisuals(false);
    }

    function toggleSound() {
        if (audio.paused) {
            audio.volume = 0.05;
            audio.play().catch(err => console.log("Erro ao tocar:", err));
        } else {
            audio.pause();
        }
    }

    function handleFirstMusicInteraction() {
        if (!musicStarted && audio) {
            audio.volume = 0.05;
            audio.play().then(() => {
                musicStarted = true;
                document.removeEventListener("mousedown", handleFirstMusicInteraction);
                document.removeEventListener("keydown", handleFirstMusicInteraction);
                document.removeEventListener("touchstart", handleFirstMusicInteraction);
            }).catch(err => console.log("Aguardando interação real..."));
        }
    }

    if (soundBtn) {
        soundBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!musicStarted) handleFirstMusicInteraction();
            else toggleSound();
        });
    }

    document.addEventListener("mousedown", handleFirstMusicInteraction);
    document.addEventListener("keydown", handleFirstMusicInteraction);
    document.addEventListener("touchstart", handleFirstMusicInteraction);


    // --- 7. ROLETA 3D DE PROJETOS ---
    const carousel = document.getElementById('carousel');
    const cards = document.querySelectorAll('.card');
    if (carousel && cards.length > 0) {
        let currentIndex = 0;
        const angleStep = 360 / cards.length;
        const radius = window.innerWidth < 768 ? 200 : 350; 
        let isDragging = false, startX = 10, currentDragDistance = 0;

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

    // --- 8. TERMINAL ---
    const terminalData = [
        { text: "anderson@linux:~$ ", color: "#60a5fa", type: "prompt" }, 
        { text: "python3 hello_world.py", color: "#fff", type: "input", delay: 80 }, 
        { text: "Traceback (most recent call last):", color: "#ef4444", type: "output" },
        { text: '  File "hello_world.py", line 1, in <module>', color: "#ef4444", type: "output" },
        { text: "PermissionError: [Errno 13] Permission denied", color: "#ef4444", type: "output" },
        { text: "anderson@linux:~$ ", color: "#60a5fa", type: "prompt" },
        { text: "...", color: "#fff", type: "input", delay: 1000 },
        { text: "sudo !!", color: "#fff", type: "input", delay: 150 },
        { text: "[sudo] password for developer: **********", color: "#7289a3", type: "input", delay: 50 },
        { text: "Hello World!", color: "#f1fa8c", type: "success" } 
    ];
    
    let isTerminalTyping = false;
    async function typeTerminal() {
    const terminalEl = document.getElementById('terminal-code');
    const cursor = document.getElementById('terminal-cursor');
    if (!terminalEl || isTerminalTyping) return;
    isTerminalTyping = true;

    for (const line of terminalData) {
        const span = document.createElement('span');
        span.style.color = line.color;
        if (line.type === "success") span.className = "block text-xl font-bold mt-2 text-[#7ee787] animate-pulse";
        terminalEl.appendChild(span);

        if (line.type === "input") {
            span.appendChild(cursor); 
            
            // ATIVA o modo estático (parar de piscar)
            cursor.classList.add('typing');

            for (const char of line.text) {
                const charNode = document.createTextNode(char);
                span.insertBefore(charNode, cursor); 
                await new Promise(r => setTimeout(r, line.delay || 35));
            }

            // DESATIVA o modo estático (volta a piscar) ao fim da linha
            cursor.classList.remove('typing');
            
            terminalEl.appendChild(document.createElement('br'));
        } else {
            span.textContent = line.text;
            if (line.type !== "prompt") terminalEl.appendChild(document.createElement('br'));
            terminalEl.appendChild(cursor);
        }

        // Tempo de espera entre uma linha e outra (o cursor pisca aqui)
        await new Promise(r => setTimeout(r, 600));
        
        const containerTerm = document.getElementById('terminal-container');
        if(containerTerm) containerTerm.scrollTop = containerTerm.scrollHeight;
    }
    }

    // --- 9. MOUSE EFFECT ---
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 1024) return;
        const bgLight = document.getElementById('bg-light');
        const cursor = document.getElementById('custom-cursor');
        const stackCards = document.querySelectorAll('.stack-card');

        if (bgLight) bgLight.style.background = `radial-gradient(circle 250px at ${e.clientX}px ${e.clientY}px, transparent 0%, rgba(2, 4, 10, 1) 100%)`;
        if (cursor) { 
            cursor.style.left = `${e.clientX}px`; 
            cursor.style.top = `${e.clientY}px`; 
        }

        stackCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (e.clientX > rect.left - 50 && e.clientX < rect.right + 50 &&
                e.clientY > rect.top - 50 && e.clientY < rect.bottom + 50) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y / rect.height - 0.5) * -25; 
                const rotateY = (x / rect.width - 0.5) * 25;   
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                card.style.borderColor = "rgba(255, 31, 87, 0.8)";
            } else {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.borderColor = "rgba(255, 31, 87, 0.1)";
            }
        });
    });

    // --- 10. OBSERVER ---
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