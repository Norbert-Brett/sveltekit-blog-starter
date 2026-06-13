<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { magnetic } from '$lib/actions/magnetic.js';
  import { Marquee } from '$lib/components/magic/marquee';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let heroSection = $state(null);
  let textRef = $state(null);
  let ctaRef = $state(null);
  let headlineEl = $state(null);
  let subtitleEl = $state(null);
  let mouseX = $state(0);
  let mouseY = $state(0);
  let windowWidth = $state(0);
  let windowHeight = $state(0);
  let isMobile = $state(false);
  let ctx;
  let animationFrameId;
  let resizeTimer;

  let particleCanvas = $state(null);
  let particleAnimationFrameId;
  let particles = [];
  const particleCount = 60;
  let displayedHeadline = $state(['Building', 'intelligent', 'systems.']);
  let decryptionTimers = [];

  function startDecryption(delayMs = 0) {
    // Clear any existing decryption timers
    decryptionTimers.forEach(t => clearInterval(t));
    decryptionTimers = [];

    const targetWords = ['Building', 'intelligent', 'systems.'];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&*_-';
    
    // Scramble immediately
    targetWords.forEach((word, wordIdx) => {
      displayedHeadline[wordIdx] = word
        .split('')
        .map(c => (c === ' ' || c === '.') ? c : chars[Math.floor(Math.random() * chars.length)])
        .join('');
    });

    // Start decryption after delay, one word at a time for drama
    targetWords.forEach((word, wordIdx) => {
      const wordDelay = delayMs + wordIdx * 180;
      setTimeout(() => {
        let currentIteration = 0;
        const originalWord = word;
        const interval = setInterval(() => {
          displayedHeadline[wordIdx] = originalWord
            .split('')
            .map((char, charIdx) => {
              if (char === ' ' || char === '.') return char;
              if (currentIteration > charIdx + 2) return char;
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

          if (displayedHeadline[wordIdx] === originalWord) {
            clearInterval(interval);
          }
          currentIteration += 0.8;
        }, 30);
        decryptionTimers.push(interval);
      }, wordDelay);
    });
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * windowWidth,
        y: Math.random() * windowHeight,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
  }

  function runParticleBackdrop() {
    if (!particleCanvas) return;
    const ctx = particleCanvas.getContext('2d');
    
    const resizeParticles = () => {
      if (!particleCanvas) return;
      particleCanvas.width = windowWidth;
      particleCanvas.height = windowHeight;
      initParticles();
    };
    resizeParticles();

    function draw() {
      if (!particleCanvas) return;
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      const mouseOffsetX = (mouseX - windowWidth / 2) * 0.04;
      const mouseOffsetY = (mouseY - windowHeight / 2) * 0.04;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = windowWidth;
        if (p.x > windowWidth) p.x = 0;
        if (p.y < 0) p.y = windowHeight;
        if (p.y > windowHeight) p.y = 0;

        const x = p.x + mouseOffsetX * (p.size * 0.5);
        const y = p.y + mouseOffsetY * (p.size * 0.5);

        ctx.fillStyle = `rgba(212, 176, 85, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const loop = () => {
      draw();
      particleAnimationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  // --- INTERACTIVE DIAGNOSTICS & SYSTEM STATES ---
  let scrollProgress = $state(0);
  let terminalInputValue = $state('');
  let terminalMinimized = $state(false);
  let terminalLogs = $state([
    'SYS_CONSOLE BOOT INITIALIZATION... [OK]',
    'NODE SYNC VERIFICATION... [OK]',
    'ANTIGRAVITY PROPULSION ENGINE... [OK]',
    'Type "help" to list terminal commands.'
  ]);

  let badgeSpeed = $state('16s');
  let glitchActive = $state(false);

  // Web Audio Synth Hum States
  let audioCtx;
  let humOscillator;
  let humGainNode;
  let filterNode;
  let isHumming = $state(false);

  // Canvas Matrix Cascade States
  let matrixCanvas = $state(null);
  let matrixActive = $state(false);
  let matrixAnimationFrameId;

  function addTerminalLog(text) {
    terminalLogs = [...terminalLogs, text];
    if (terminalLogs.length > 50) {
      terminalLogs = terminalLogs.slice(terminalLogs.length - 50);
    }
    setTimeout(() => {
      const container = document.getElementById('terminal-log-container');
      if (container) container.scrollTop = container.scrollHeight;
    }, 20);
  }

  function triggerScanlineSweep() {
    if (!browser) return;
    addTerminalLog('Laser scan: ENGAGING');
    gsap.set('.hud-scan-line', { top: '0%', opacity: 0 });
    const sweep = gsap.timeline();
    sweep.to('.hud-scan-line', { opacity: 0.8, duration: 0.2 });
    sweep.to('.hud-scan-line', { top: '100%', duration: 1.5, ease: 'power2.inOut' });
    sweep.to('.hud-scan-line', { opacity: 0, duration: 0.2 });
  }

  function triggerGlitchEffect() {
    if (glitchActive) return;
    addTerminalLog('Video filter diagnostics: COGNITIVE SHIFT');
    glitchActive = true;
    setTimeout(() => {
      glitchActive = false;
    }, 1200);
  }

  function toggleHum(forceState = null) {
    if (!browser) return;
    const targetState = forceState !== null ? forceState : !isHumming;
    
    if (targetState) {
      try {
        if (!audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioCtx = new AudioContext();
          
          humOscillator = audioCtx.createOscillator();
          humOscillator.type = 'sawtooth';
          humOscillator.frequency.setValueAtTime(55, audioCtx.currentTime);

          filterNode = audioCtx.createBiquadFilter();
          filterNode.type = 'lowpass';
          filterNode.frequency.setValueAtTime(70, audioCtx.currentTime);

          humGainNode = audioCtx.createGain();
          humGainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);

          humOscillator.connect(filterNode);
          filterNode.connect(humGainNode);
          humGainNode.connect(audioCtx.destination);
          
          humOscillator.start();
        } else if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        isHumming = true;
        addTerminalLog('Ambient system hum: ENABLED');
      } catch (e) {
        addTerminalLog('Audio Error: Web Audio API blocked/unsupported');
      }
    } else {
      if (audioCtx && isHumming) {
        audioCtx.suspend();
        isHumming = false;
        addTerminalLog('Ambient system hum: DISABLED');
      }
    }
  }

  function runMatrixCascade() {
    if (!matrixCanvas) return;
    const ctx = matrixCanvas.getContext('2d');
    
    const chars = '01ABCDEF'.split('');
    const fontSize = 11;
    let columns = Math.floor(windowWidth / fontSize);
    let drops = Array(columns).fill(0).map(() => Math.random() * -100);

    const resizeMatrix = () => {
      if (!matrixCanvas) return;
      matrixCanvas.width = windowWidth;
      matrixCanvas.height = windowHeight;
      columns = Math.floor(windowWidth / fontSize);
      drops = Array(columns).fill(0).map(() => Math.random() * -100);
    };
    resizeMatrix();

    function draw() {
      if (!matrixActive || !matrixCanvas) return;
      ctx.fillStyle = 'rgba(24, 23, 21, 0.06)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = 'rgba(212, 176, 85, 0.35)';
      ctx.font = 'bold ' + fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const loop = () => {
      if (!matrixActive) return;
      draw();
      matrixAnimationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  function toggleMatrix(forceState = null) {
    const targetState = forceState !== null ? forceState : !matrixActive;
    if (targetState) {
      matrixActive = true;
      addTerminalLog('Matrix cascade: ACTIVE');
      setTimeout(() => {
        runMatrixCascade();
      }, 50);
    } else {
      matrixActive = false;
      if (matrixAnimationFrameId) {
        cancelAnimationFrame(matrixAnimationFrameId);
        matrixAnimationFrameId = null;
      }
      if (matrixCanvas) {
        const ctx = matrixCanvas.getContext('2d');
        ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      }
      addTerminalLog('Matrix cascade: INACTIVE');
    }
  }

  function executeTerminalCommand() {
    const cmd = terminalInputValue.trim().toLowerCase();
    if (!cmd) return;

    addTerminalLog(`guest@antigravity:~$ ${terminalInputValue}`);
    terminalInputValue = '';

    switch (cmd) {
      case 'help':
        addTerminalLog('Available commands:');
        addTerminalLog('  laser   - Fire viewfinder laser sweep');
        addTerminalLog('  glitch  - Trigger digital CRT glitch');
        addTerminalLog('  speed   - Boost center badge spin');
        addTerminalLog('  hum     - Toggle Web Audio synth drone');
        addTerminalLog('  matrix  - Toggle gold matrix rainfall');
        addTerminalLog('  clear   - Wipe terminal console');
        break;
      case 'laser':
        triggerScanlineSweep();
        break;
      case 'glitch':
        triggerGlitchEffect();
        break;
      case 'speed':
        badgeSpeed = badgeSpeed === '16s' ? '4s' : '16s';
        addTerminalLog(`Holographic rotation speed: ${badgeSpeed === '4s' ? 'BOOSTED' : 'STANDARD'}`);
        break;
      case 'hum':
        toggleHum();
        break;
      case 'matrix':
        toggleMatrix();
        break;
      case 'clear':
        terminalLogs = [];
        break;
      default:
        addTerminalLog(`Error: Command not found: "${cmd}". Type "help" for a list of commands.`);
    }
  }

  function setupGSAP() {
    if (!browser || !heroSection || !textRef || !headlineEl || !subtitleEl) return;

    if (ctx) ctx.revert();

    // Reset styles so we get accurate bounding rects
    gsap.set([headlineEl, subtitleEl, '.hero-video-wrapper', '.hero-cta-wrapper', '.scroll-indicator', '.hero-hud-inner', '.hero-badge-inner'], { clearProps: 'all' });

    const isMobileDevice = windowWidth < 768 || matchMedia('(pointer: coarse)').matches;

    if (isMobileDevice) {
      // MOBILE LIGHTWEIGHT INITIALIZATION (NO PINNING, NO SHRINKING, NO CORNER TRANSITIONS)
      ctx = gsap.context(() => {
        const isAtTop = window.scrollY < 20;

        // Initial States for mobile (centered, no translate, clean opacity fade)
        gsap.set('.scroll-indicator', { opacity: 0 });
        gsap.set('.hero-hud-inner', { opacity: 0 });
        gsap.set('.hero-badge-inner', { opacity: 0 });
        gsap.set(headlineEl, { opacity: 0, y: 20 });
        gsap.set(subtitleEl, { opacity: 0, y: 15 });
        gsap.set('.hero-cta-wrapper', { opacity: 0, y: 15 });

        if (isAtTop) {
          const introTL = gsap.timeline({ delay: 0.05 });
          
          introTL.fromTo('.hero-bg-video', 
            { scale: 1.2, filter: 'blur(15px) brightness(0.3)' },
            { scale: 1.05, filter: 'blur(0px) brightness(1)', duration: 1.4, ease: 'power3.out' },
            0
          );
          
          introTL.to('.scroll-indicator', { opacity: 1, duration: 0.8 }, 0.6);
          introTL.to('.hero-hud-inner', { opacity: 1, duration: 0.9, ease: 'power2.out' }, 0.15);
          introTL.to('.hero-badge-inner', { opacity: 1, duration: 1.1, ease: 'power3.out' }, 0.2);
          introTL.to(headlineEl, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.25);
          introTL.to(subtitleEl, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.3);
          introTL.to('.hero-cta-wrapper', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.35);
        } else {
          gsap.set('.hero-bg-video', { scale: 1.05, filter: 'blur(0px) brightness(1)' });
          gsap.set('.scroll-indicator', { opacity: 1 });
          gsap.set('.hero-hud-inner', { opacity: 1 });
          gsap.set('.hero-badge-inner', { opacity: 1 });
          gsap.set(headlineEl, { opacity: 1, y: 0 });
          gsap.set(subtitleEl, { opacity: 1, y: 0 });
          gsap.set('.hero-cta-wrapper', { opacity: 1, y: 0 });
        }
      }, heroSection);
      return;
    }

    // DESKTOP CINEMATIC PINNED ANIMATION
    const hRect = headlineEl.getBoundingClientRect();
    const sRect = subtitleEl.getBoundingClientRect();

    const hScale = 0.18;
    const sScale = 0.85;

    const hX = 48 - hRect.left;
    const hY = 40 - hRect.top;

    const sX = (windowWidth - 48) - sRect.right;
    const sY = 40 - sRect.top;

    ctx = gsap.context(() => {
      const isAtTop = window.scrollY < 20;

      // 1. Initial State configurations
      gsap.set('.hero-marquee-wrapper', { opacity: 0, scale: 0.92 });
      gsap.set('.hero-cta-wrapper', { opacity: 0, y: 50 });
      gsap.set('.scroll-indicator', { opacity: 0 });

      // Set corner positions initially with opacity 0 for fade in
      gsap.set(headlineEl, {
        x: hX,
        y: hY,
        scale: hScale,
        transformOrigin: 'top left',
        opacity: 0
      });

      gsap.set(subtitleEl, {
        x: sX,
        y: sY,
        scale: sScale,
        transformOrigin: 'top right',
        opacity: 0
      });

      if (isAtTop) {
        // ═══════════════════════════════════════════════
        // CINEMATIC BOOT SEQUENCE — 3-PHASE REVEAL
        // ═══════════════════════════════════════════════
        const introTL = gsap.timeline({ delay: 0.15 });

        // ── PHASE 1: APERTURE REVEAL (0s → 1.5s) ──
        // The screen awakens like a camera powering on.
        // Video starts completely dark, heavily blurred & zoomed.
        // A radial vignette overlay peels back like a lens aperture.

        // Initial blackout state
        introTL.set('.hero-video-wrapper', { opacity: 1 }, 0);
        introTL.set('.hero-aperture-vignette', { opacity: 1 }, 0);

        // Video: zoomed, blurred, near-black → slowly reveals
        introTL.fromTo('.hero-bg-video',
          { scale: 1.35, filter: 'blur(30px) brightness(0) contrast(1.2)' },
          { scale: 1.15, filter: 'blur(12px) brightness(0.4) contrast(1.1)', duration: 1.2, ease: 'power2.inOut' },
          0
        );

        // Aperture vignette fades back to reveal the frame
        introTL.to('.hero-aperture-vignette', {
          opacity: 0,
          duration: 1.2,
          ease: 'power2.inOut'
        }, 0.3);

        // Video settles into final resting state with a slow pull-back
        introTL.to('.hero-bg-video', {
          scale: 1.05,
          filter: 'blur(0px) brightness(1) contrast(1.1)',
          duration: 1.2,
          ease: 'power3.out'
        }, 0.8);

        // Scanline sweep — a single dramatic gold beam wipes down
        introTL.set('.hud-scan-line', { top: '0%', opacity: 0, scaleX: 1 }, 0);
        introTL.to('.hud-scan-line', { opacity: 0.9, duration: 0.1, ease: 'power2.in' }, 0.5);
        introTL.to('.hud-scan-line', { top: '100%', duration: 1.1, ease: 'power1.inOut' }, 0.5);
        introTL.to('.hud-scan-line', { opacity: 0, duration: 0.2 }, 1.5);

        // ── PHASE 2: INSTRUMENT CALIBRATION (1.0s → 2.2s) ──
        // Badge, corners, readouts emerge with orchestrated stagger

        // Viewfinder corners converge from center outwards
        introTL.fromTo('.hud-corner-tl',
          { x: 40, y: 40, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.1
        );
        introTL.fromTo('.hud-corner-tr',
          { x: -40, y: 40, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.13
        );
        introTL.fromTo('.hud-corner-bl',
          { x: 40, y: -40, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.16
        );
        introTL.fromTo('.hud-corner-br',
          { x: -40, y: -40, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.19
        );

        // HUD readouts type in with letter-spacing compression
        introTL.fromTo('.hud-readout',
          { opacity: 0, letterSpacing: '0.5em' },
          { opacity: 1, letterSpacing: '0.2em', duration: 0.8, stagger: 0.08, ease: 'power2.out' },
          1.2
        );

        // Badge: scales from zero with a satisfying elastic overshoot
        introTL.fromTo('.hero-badge-inner',
          { scale: 0, opacity: 0, rotation: -45 },
          { scale: 1, opacity: 1, rotation: 0, duration: 1.4, ease: 'elastic.out(1, 0.7)' },
          1.1
        );

        // Particle canvas fades in gently
        introTL.fromTo(particleCanvas,
          { opacity: 0 },
          { opacity: 0.6, duration: 1.2, ease: 'power2.out' },
          1.0
        );

        // Scroll indicator — last element, the final gentle cue
        introTL.fromTo('.scroll-indicator',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          1.4
        );

      } else {
        // Fallback states for scrolled viewports (skip intro entirely)
        gsap.set('.hero-aperture-vignette', { opacity: 0 });
        gsap.set('.hud-scan-line', { opacity: 0 });
        gsap.set('.hero-bg-video', { scale: 1.05, filter: 'blur(0px) brightness(1) contrast(1.1)' });
        gsap.set('.hud-corner-tl', { x: 0, y: 0, opacity: 1 });
        gsap.set('.hud-corner-tr', { x: 0, y: 0, opacity: 1 });
        gsap.set('.hud-corner-bl', { x: 0, y: 0, opacity: 1 });
        gsap.set('.hud-corner-br', { x: 0, y: 0, opacity: 1 });
        gsap.set('.hud-readout', { opacity: 1, letterSpacing: '0.2em' });
        gsap.set('.hero-badge-inner', { scale: 1, opacity: 1 });
        gsap.set(headlineEl, { x: hX, y: hY, scale: hScale, opacity: 0 });
        gsap.set(subtitleEl, { x: sX, y: sY, scale: sScale, opacity: 0 });
        gsap.set('.scroll-indicator', { opacity: 1 });
        gsap.set(particleCanvas, { opacity: 0.6 });
      }

      // 2. Cinematic Morphing & Pinned Exit Animation: Unified in a Single Timeline
      let decryptionTriggered = false;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: '+=120%',
          scrub: 1.2,    // Highly fluid inertia scrub damping
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            scrollProgress = Math.round(self.progress * 100);
            if (self.progress > 0.15 && !decryptionTriggered) {
              decryptionTriggered = true;
              startDecryption(0);
            } else if (self.progress < 0.05 && decryptionTriggered) {
              decryptionTriggered = false;
            }
          }
        }
      });

      // --- PHASE 1: Scale down video wrapper & reveal content smoothly ---
      tl.to('.hero-video-wrapper', {
        scale: 0.48,
        borderRadius: '32px',
        opacity: 1,
        boxShadow: '0 20px 80px rgba(0,0,0,0.65)',
        border: '1px solid var(--border)',
        ease: 'power2.inOut',
        duration: 2
      }, 0);

      // Center badge and HUD overlay fade out as video shrinks
      tl.fromTo('.hero-center-badge', {
        opacity: 1,
        scale: 1
      }, {
        opacity: 0,
        scale: 0.6,
        ease: 'power2.inOut',
        duration: 1.6
      }, 0);

      // HUD overlay fades out
      tl.fromTo('.hero-hud-overlay', {
        opacity: 1
      }, {
        opacity: 0,
        ease: 'power2.out',
        duration: 1.0
      }, 0);

      // Ambient particle canvas fades out
      tl.to(particleCanvas, {
        opacity: 0,
        ease: 'power2.out',
        duration: 1.0
      }, 0);

      // Scroll indicator fades out fast
      tl.to('.scroll-indicator', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, 0);

      // Double marquee running behind fades and scales in
      tl.to('.hero-marquee-wrapper', {
        opacity: 1,
        scale: 1,
        ease: 'power2.out',
        duration: 1.5
      }, 0.3);

      // Headline grows and centers as video shrinks
      tl.to(headlineEl, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        transformOrigin: 'center center',
        ease: 'power2.inOut',
        duration: 2
      }, 0);

      // Subtitle grows and centers as video shrinks
      tl.to(subtitleEl, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        transformOrigin: 'center center',
        ease: 'power2.inOut',
        duration: 2
      }, 0.1);

      // CTA button slides in directly below the shrunk video
      tl.to('.hero-cta-wrapper', {
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        duration: 1.5
      }, 0.7);

      // --- PHASE 2: Morph Complete (unpins immediately for organic scrolling) ---
      tl.to({}, { duration: 0.1 });

      // 3. Magnetic Tracking on the text group (desktop only)
      const xTo = gsap.quickTo(textRef, 'x', { duration: 0.8, ease: 'power3' });
      const yTo = gsap.quickTo(textRef, 'y', { duration: 0.8, ease: 'power3' });

      const animateMagnet = () => {
        const cx = windowWidth / 2;
        const cy = windowHeight / 2;
        const dx = (mouseX - cx) / cx;
        const dy = (mouseY - cy) / cy;
        xTo(dx * 25);
        yTo(dy * 15);
        animationFrameId = requestAnimationFrame(animateMagnet);
      };
      animateMagnet();
    }, heroSection);
  }

  onMount(() => {
    if (!browser || !heroSection || !textRef) return;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    isMobile = windowWidth < 768 || matchMedia('(pointer: coarse)').matches;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        isMobile = windowWidth < 768 || matchMedia('(pointer: coarse)').matches;
        setupGSAP();
        if (matrixActive && matrixCanvas) {
          matrixCanvas.width = windowWidth;
          matrixCanvas.height = windowHeight;
        }
        if (particleCanvas) {
          particleCanvas.width = windowWidth;
          particleCanvas.height = windowHeight;
          initParticles();
        }
      }, 250);
    };

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = height > 0 ? Math.round((scrolled / height) * 100) : 0;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    setupGSAP();

    if (!isMobile) {
      runParticleBackdrop();
      // Decryption is now triggered by the GSAP intro timeline via introTL.call()
      // so it fires in sync with text becoming visible, not on a fixed timeout.
    }

    return () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (matrixAnimationFrameId) cancelAnimationFrame(matrixAnimationFrameId);
      if (particleAnimationFrameId) cancelAnimationFrame(particleAnimationFrameId);
      if (ctx) ctx.revert();
      if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
      }
    };
  });

  onDestroy(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (matrixAnimationFrameId) cancelAnimationFrame(matrixAnimationFrameId);
    if (particleAnimationFrameId) cancelAnimationFrame(particleAnimationFrameId);
    if (ctx) ctx.revert();
  });
</script>

<section
  bind:this={heroSection}
  class="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-background"
>
  {#if !isMobile}
  <!-- 1. Double Marquee running behind the video -->
  <div class="hero-marquee-wrapper absolute inset-0 z-10 flex flex-col justify-center gap-12 md:gap-16 pointer-events-none select-none gpu-accelerated">
    <!-- Row 1: Left to Right (Current message, larger font, halved speed duration 360s, tight gap 0.5rem) -->
    <div class="w-full overflow-hidden">
      <Marquee pauseOnHover={false} class="[--duration:360s] [--gap:0.5rem]">
        <span class="text-[10vh] md:text-[12vh] lg:text-[13vh] font-sans font-black tracking-tighter uppercase text-primary whitespace-nowrap px-2 leading-none">
          Open to work · Full Stack · AI/ML · Svelte · Node · Python · LLMs ·
        </span>
      </Marquee>
    </div>

    <!-- Row 2: Right to Left (Role and open to work, outlined text, halved speed duration 440s, tight gap 0.5rem) -->
    <div class="w-full overflow-hidden">
      <Marquee reverse pauseOnHover={false} class="[--duration:440s] [--gap:0.5rem]">
        <span class="text-[10vh] md:text-[12vh] lg:text-[13vh] font-sans font-black tracking-tighter uppercase text-stroke-accent whitespace-nowrap px-2 leading-none opacity-30">
          Full Stack Developer · AI Specialist · Open to work · Available for projects ·
        </span>
      </Marquee>
    </div>
  </div>
  {/if}

  <!-- 2. Background Video (morphing scaling wrapper, z-index 20) -->
  <div class="hero-video-wrapper absolute inset-0 w-full h-full z-20 overflow-hidden bg-background origin-center border border-transparent gpu-accelerated {glitchActive ? 'glitch-active' : ''}">
    <video 
      autoplay 
      loop 
      muted 
      playsinline
      preload={isMobile ? 'none' : 'metadata'}
      poster="https://res.cloudinary.com/nbrett/image/upload/f_auto,q_auto/v1758661776/3170B43D-E178-4C7F-81A1-B4D0B128D021_zjinq2.jpg"
      class="hero-bg-video w-full h-full object-cover grayscale opacity-40 dark:opacity-80 scale-105 gpu-accelerated"
    >
      <source src="https://res.cloudinary.com/nbrett/video/upload/f_auto:video,q_auto/v1768848615/video_un63ox.mov" type="video/mp4" />
    </video>
    
    <!-- Cinematic Dark Vignette Overlay for Ultimate Contrast -->
    <div class="absolute inset-0 bg-black/10 dark:bg-black/30 pointer-events-none"></div>
    
    <!-- Radial Aperture Vignette — starts fully opaque black, fades to reveal -->
    <div class="hero-aperture-vignette absolute inset-0 pointer-events-none z-1"></div>
    
    <!-- Mobile/Global Fade Overlay -->
    <div class="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background"></div>
    <!-- Scroll-driven darkness overlay (camera iris) -->
    <div class="hero-overlay absolute inset-0 bg-background opacity-0 pointer-events-none"></div>
  </div>

  <!-- Matrix rain canvas -->
  <canvas bind:this={matrixCanvas} class="absolute inset-0 pointer-events-none z-21 w-full h-full transition-opacity duration-500 {matrixActive ? 'opacity-70' : 'opacity-0'}"></canvas>

  <!-- Ambient particles canvas -->
  <canvas bind:this={particleCanvas} class="absolute inset-0 pointer-events-none z-21 w-full h-full opacity-0"></canvas>

  <!-- HUD Viewfinder Overlay (z-index 22, fades on scroll) -->
  <div class="hero-hud-overlay absolute inset-0 z-22 pointer-events-none select-none">
    <!-- Scanning laser sweep line -->
    <div class="hud-scan-line absolute left-0 right-0 h-[2.5px] bg-linear-to-r from-transparent via-accent/60 to-transparent opacity-0 pointer-events-none z-24"></div>

    <div class="hero-hud-inner relative w-full h-full opacity-0">
      <!-- Viewfinder Corners -->
      <div class="hud-corner hud-corner-tl absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-accent/60 dark:border-accent/30"></div>
      <div class="hud-corner hud-corner-tr absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-accent/60 dark:border-accent/30"></div>
      <div class="hud-corner hud-corner-bl absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-accent/60 dark:border-accent/30"></div>
      <div class="hud-corner hud-corner-br absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-accent/60 dark:border-accent/30"></div>

      <!-- HUD Stats & Indicators -->
      <div class="hud-readout absolute top-8 left-20 text-[9px] font-mono tracking-[0.2em] text-foreground/45 uppercase hidden sm:block">
        SYS: ACTIVE // LENS: CRT-X
      </div>
      <div class="hud-readout absolute top-8 right-20 text-[9px] font-mono tracking-[0.2em] text-foreground/45 uppercase hidden sm:block">
        REC [●]
      </div>
      <div class="hud-readout absolute bottom-8 left-20 text-[9px] font-mono tracking-[0.2em] text-foreground/45 uppercase hidden sm:block">
        FPS: 60 // SHUTTER: 1/120s
      </div>
      <div class="hud-readout absolute bottom-8 right-20 text-[9px] font-mono tracking-[0.2em] text-foreground/45 uppercase hidden sm:block">
        ANTIGRAVITY PROPULSION
      </div>

      <!-- Interactive Cybernetic Diagnostics Terminal Console (pointer-events-auto to allow input clicks) -->
      <div 
        class="absolute bottom-20 left-8 sm:left-20 w-[300px] sm:w-[360px] rounded-xl glass-panel border border-accent/20 bg-background/90 backdrop-blur-md shadow-2xl transition-all duration-300 pointer-events-auto z-30 select-text flex flex-col overflow-hidden {terminalMinimized ? 'h-9' : 'h-52'}"
      >
        <!-- Terminal Header -->
        <div class="flex items-center justify-between px-3 py-2 border-b border-accent/10 bg-accent/5 font-mono text-[9px] tracking-wider font-bold">
          <div class="flex items-center gap-1.5 text-accent select-none">
            <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            SYS_CONSOLE // DIAGNOSTICS
          </div>
          <div class="flex items-center gap-3 text-foreground/45 select-none">
            <span>X: {mouseX} Y: {mouseY}</span>
            <span>SCROLL: {scrollProgress}%</span>
            <button 
              onclick={() => terminalMinimized = !terminalMinimized} 
              class="hover:text-accent font-sans text-xs font-black cursor-pointer leading-none px-1"
              aria-label={terminalMinimized ? "Expand console" : "Minimize console"}
            >
              {terminalMinimized ? '＋' : '－'}
            </button>
          </div>
        </div>

        <!-- Terminal Output Logs -->
        {#if !terminalMinimized}
          <div 
            id="terminal-log-container"
            class="flex-1 overflow-y-auto p-3 font-mono text-[10px] text-foreground/75 leading-relaxed space-y-1 select-text scrollbar-thin"
          >
            {#each terminalLogs as log}
              <div class="whitespace-pre-wrap {log.startsWith('guest@') ? 'text-accent/80 font-bold' : log.startsWith('Error:') ? 'text-red-400 font-semibold' : ''}">{log}</div>
            {/each}
          </div>

          <!-- Terminal Input Prompt -->
          <form 
            onsubmit={(e) => { e.preventDefault(); executeTerminalCommand(); }}
            class="flex items-center border-t border-accent/10 bg-background/50 px-3 py-1.5 gap-2 font-mono text-[10px]"
          >
            <span class="text-accent select-none">guest@antigravity:~$</span>
            <input 
              bind:value={terminalInputValue}
              type="text" 
              placeholder='Type "help"...' 
              class="flex-1 bg-transparent border-none outline-hidden text-foreground placeholder-foreground/30 font-mono caret-accent"
              aria-label="Terminal command"
            />
          </form>
        {/if}
      </div>
    </div>
  </div>

  <!-- Central Rotating Holographic Badge (z-index 25, fades on scroll) -->
  <div class="hero-center-badge absolute top-1/2 left-1/2 z-25 pointer-events-none select-none">
    <div class="hero-badge-inner relative flex items-center justify-center opacity-0 drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <!-- Outer Ring (Dotted) -->
      <svg class="absolute w-64 h-64 md:w-80 md:h-80 text-accent dark:text-accent/20 animate-spin-slow-clockwise" viewBox="0 0 220 220">
        <circle cx="110" cy="110" r="95" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4, 8" />
      </svg>

      <!-- Spinning Circular Text Ring (Middle Ring, Counter-Clockwise) -->
      <svg 
        class="w-56 h-56 md:w-72 md:h-72 text-accent dark:text-accent/50 animate-spin-slow-counter" 
        style="animation-duration: {badgeSpeed};"
        viewBox="0 0 200 200"
      >
        <defs>
          <path id="badgeCircle" d="M 100, 100 m -65, 0 a 65,65 0 1,1 130,0 a 65,65 0 1,1 -130,0" fill="none" />
        </defs>
        <text class="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.25em] fill-current">
          <textPath href="#badgeCircle" startOffset="0%">
            NORBERT BRETT • DESIGN & CODE • FULL STACK · AI·
          </textPath>
        </text>
      </svg>

      <!-- Inner Ring (Calibration Ticks) -->
      <svg class="absolute w-44 h-44 md:w-60 md:h-60 text-accent dark:text-accent/30 animate-spin-slow-clockwise" style="animation-duration: 8s;" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" stroke-width="0.75" stroke-dasharray="1, 5" />
        <path d="M 80, 5 L 80, 10 M 80, 150 L 80, 155 M 5, 80 L 10, 80 M 150, 80 L 155, 80" stroke="currentColor" stroke-width="1.5" />
      </svg>

      <!-- Glassmorphic 3D Gyroscope Core -->
      <div class="absolute w-28 h-28 md:w-36 md:h-36 rounded-full glass-panel bg-white/20 dark:bg-transparent border border-white/30 dark:border-accent/25 flex items-center justify-center shadow-[0_8px_32px_0_var(--glass-shadow)] backdrop-blur-md overflow-hidden">
        <div class="absolute inset-0 bg-accent/5 blur-md animate-pulse"></div>
        
        <div class="relative w-16 h-16 md:w-20 md:h-20 perspective-tilt scale-95">
          <!-- Outer Gyro Ring -->
          <div class="absolute inset-0 w-full h-full border border-accent/70 dark:border-accent/40 rounded-full animate-gyro-1"></div>
          <!-- Mid Gyro Ring -->
          <div class="absolute inset-0 w-[75%] h-[75%] border border-accent/85 border-dashed rounded-full animate-gyro-2"></div>
          <!-- Inner Gyro Ring -->
          <div class="absolute inset-0 w-[50%] h-[50%] border border-accent/90 dark:border-accent/80 rounded-full animate-gyro-3 flex items-center justify-center">
            <span class="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_15px_var(--color-accent)] animate-ping absolute"></span>
            <span class="w-3.5 h-3.5 rounded-full bg-accent shadow-[0_0_15px_var(--color-accent)] z-10"></span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 3. Kinetic Text (Headline & Subtitle, z-index 30) -->
  <div 
    bind:this={textRef} 
    class="hero-text-group absolute inset-x-0 top-[12%] md:top-[14%] z-30 flex flex-col items-center pointer-events-none px-6 gpu-accelerated"
  >
    <h1 bind:this={headlineEl} class="hero-headline relative z-10 text-center flex flex-col leading-[1.05] tracking-tight text-foreground drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] opacity-0">
      {#each displayedHeadline as word, wi (wi)}
        <span class="overflow-hidden py-1">
          <span
            class="hero-word inline-block text-[8.5vw] md:text-[6.5vw] lg:text-[5.5vw] font-serif font-normal uppercase tracking-tighter will-change-transform"
            style="{wi === 1 ? 'color: var(--color-accent);' : 'color: var(--color-foreground);'}"
          >
            {word}
          </span>
        </span>
      {/each}
    </h1>

    <!-- Subtitle -->
    <p bind:this={subtitleEl} class="hero-subtitle relative z-10 mt-6 text-xs md:text-sm font-sans tracking-[0.25em] text-foreground/80 text-center font-bold uppercase opacity-0">
      Full Stack Developer <span class="text-accent/80 mx-1">&bull;</span> AI Specialist
    </p>
  </div>

  <!-- 4. Pushed CTA Button (Fade-in under the smaller video, z-index 30) -->
  <div 
    bind:this={ctaRef}
    class="hero-cta-wrapper absolute inset-x-0 bottom-[10%] z-30 flex justify-center pointer-events-auto px-6 gpu-accelerated"
  >
    <a 
      href="/contact" 
      use:magnetic={{ strength: 0.3, textStrength: 0.1 }} 
      class="hero-cta flex items-center gap-3 px-6 py-3.5 md:px-8 md:py-4 rounded-full bg-foreground text-background hover:bg-foreground/90 active:scale-[0.97] hover:scale-105 transition-all duration-300 shadow-2xl interactive group"
    >
      <span class="magnetic-text flex items-center gap-3">
        <span class="text-sm font-sans font-semibold tracking-wide">Start a project</span>
        <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </span>
    </a>
  </div>

  <!-- 5. Scroll Indicator (Universally recognized scroll-down hint) -->
  <div class="scroll-indicator absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
    <svg width="20" height="30" viewBox="0 0 20 30" class="text-foreground/40">
      <rect x="1" y="1" width="18" height="28" rx="9" stroke="currentColor" stroke-width="1.5" fill="none" />
      <circle cx="10" cy="10" r="2" fill="currentColor" class="animate-float" />
    </svg>
  </div>
</section>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(10px); }
  }
  .animate-float {
    animation: float 2s ease-in-out infinite;
  }


  @keyframes spin-clockwise {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes spin-counter {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }
  .animate-spin-slow-clockwise {
    animation: spin-clockwise 16s linear infinite;
  }
  .animate-spin-slow-counter {
    animation: spin-counter 16s linear infinite;
  }

  /* Gyroscope 3D Animations */
  @keyframes gyro-1 {
    0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
    100% { transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg); }
  }
  @keyframes gyro-2 {
    0% { transform: rotateX(180deg) rotateY(0deg) rotateZ(0deg); }
    100% { transform: rotateX(180deg) rotateY(360deg) rotateZ(360deg); }
  }
  @keyframes gyro-3 {
    0% { transform: rotateX(0deg) rotateY(180deg) rotateZ(0deg); }
    100% { transform: rotateX(360deg) rotateY(180deg) rotateZ(-360deg); }
  }
  .animate-gyro-1 {
    animation: gyro-1 5s linear infinite;
    transform-style: preserve-3d;
  }
  .animate-gyro-2 {
    animation: gyro-2 3.5s linear infinite;
    transform-style: preserve-3d;
  }
  .animate-gyro-3 {
    animation: gyro-3 2.2s linear infinite;
    transform-style: preserve-3d;
  }
  .perspective-tilt {
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  @keyframes badge-float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-8px) scale(1.02); }
  }
  .hero-badge-inner {
    animation: badge-float 4.5s ease-in-out infinite;
  }

  .hero-center-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  :global(html) {
    --hero-vignette-color: 24, 23, 21;
  }
  :global(html[data-theme="light"]) {
    --hero-vignette-color: 246, 243, 235;
  }

  /* Cinematic Aperture Vignette — heavy radial gradient from edges to center */
  .hero-aperture-vignette {
    background: radial-gradient(
      ellipse 60% 60% at 50% 50%,
      transparent 0%,
      rgba(var(--hero-vignette-color), 0.4) 40%,
      rgba(var(--hero-vignette-color), 0.85) 65%,
      rgb(var(--hero-vignette-color)) 100%
    );
  }

  .hud-scan-line {
    box-shadow: 0 0 20px 3px var(--color-accent), 0 0 60px 6px rgba(212, 176, 85, 0.15);
  }

  /* CRT SCREEN DISTORTION GLITCH EFFECTS */
  @keyframes glitch-anim {
    0% {
      clip-path: inset(40% 0 61% 0);
      transform: skew(0.3deg);
    }
    20% {
      clip-path: inset(92% 0 1% 0);
      transform: skew(-0.5deg);
    }
    40% {
      clip-path: inset(15% 0 80% 0);
      transform: skew(0.5deg);
    }
    60% {
      clip-path: inset(80% 0 5% 0);
      transform: skew(-0.3deg);
    }
    80% {
      clip-path: inset(5% 0 92% 0);
      transform: skew(0.8deg);
    }
    100% {
      clip-path: inset(40% 0 61% 0);
      transform: skew(0deg);
    }
  }

  .glitch-active .hero-bg-video {
    animation: glitch-anim 0.8s steps(2, start) infinite;
    filter: grayscale(1) contrast(1.8) hue-rotate(90deg);
  }

  /* Scrollbar styling for terminal */
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: var(--color-accent);
    opacity: 0.3;
    border-radius: 9999px;
  }
</style>
