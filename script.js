/**
 * script.js — Para Mafe, Com Amor
 * Interactive love letter with psychological easter eggs.
 */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* =========================================================
       UTILITIES
       ========================================================= */
    var isMobile = window.innerWidth <= 768;
    var originalTitle = document.title;

    var timers = { intervals: [], timeouts: [], rafs: [] };
    function safeTimeout(fn, ms) { var id = setTimeout(fn, ms); timers.timeouts.push(id); return id; }
    function safeInterval(fn, ms) { var id = setInterval(fn, ms); timers.intervals.push(id); return id; }
    function safeRAF(fn) { var id = requestAnimationFrame(fn); timers.rafs.push(id); return id; }

    function throttle(fn, wait) {
        var last = 0;
        return function () {
            var now = Date.now();
            if (now - last >= wait) { last = now; fn.apply(this, arguments); }
        };
    }

    function rand(min, max) { return min + Math.random() * (max - min); }
    function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

    function injectStyles(id, css) {
        if (document.getElementById(id)) return;
        var el = document.createElement('style');
        el.id = id;
        el.textContent = css;
        document.head.appendChild(el);
    }

    /* Cleanup heavy work when tab hidden */
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            timers.intervals.forEach(function (id) { clearInterval(id); });
            timers.rafs.forEach(function (id) { cancelAnimationFrame(id); });
        }
    });

    /* =========================================================
       0. LOADING SCREEN — 2s then fade out
       ========================================================= */
    (function loadingScreen() {
        var screen = document.getElementById('loadingScreen');
        if (!screen) return;
        safeTimeout(function() {
            screen.classList.add('hidden');
        }, 2000);
    })();

    /* =========================================================
       0b. TIME-BASED SUBTITLE — changes based on hour
       ========================================================= */
    (function timeSubtitle() {
        var el = document.getElementById('subtitleTime');
        if (!el) return;
        var h = new Date().getHours();
        var msg = '';

        if (h >= 0 && h < 5) {
            msg = 'Mesmo de madrugada, essa carta ainda está aqui.';
        } else if (h >= 5 && h < 12) {
            msg = 'Essa carta ainda te espera.';
        } else if (h >= 12 && h < 18) {
            msg = 'Essa carta ainda está aqui.';
        } else {
            msg = 'Mesmo agora, essa carta ainda está aqui.';
        }

        if (msg) {
            el.textContent = msg;
            safeTimeout(function() { el.classList.add('visible'); }, 2500);
        }
    })();

    /* =========================================================
       1. SCROLL ANIMATIONS — IntersectionObserver on [data-section]
       ========================================================= */
    (function scrollAnimations() {
        var sections = document.querySelectorAll('[data-section]');
        if (!sections.length) return;

        sections.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)';
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var section = entry.target;
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                section.classList.add('visible');

                /* Stagger children */
                var children = section.children;
                for (var i = 0; i < children.length; i++) {
                    (function (child, idx) {
                        child.style.opacity = '0';
                        child.style.transform = 'translateY(18px)';
                        child.style.transition = 'opacity 0.6s ease ' + (idx * 0.12) + 's, transform 0.6s ease ' + (idx * 0.12) + 's';
                        safeTimeout(function () {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, 50);
                    })(children[i], i);
                }
                observer.unobserve(section);
            });
        }, { threshold: 0.15 });

        sections.forEach(function (s) { observer.observe(s); });
    })();

    /* =========================================================
       2. MUSIC PLAYER
       ========================================================= */
    (function musicPlayer() {
        var audio = document.getElementById('bgMusic');
        if (!audio) return;

        audio.volume = 0;
        audio.currentTime = 54;
        var activated = false;

        function fadeIn() {
            var start = audio.volume;
            var target = 0.3;
            var duration = 2000;
            var startTime = null;
            function step(ts) {
                if (!startTime) startTime = ts;
                var progress = Math.min((ts - startTime) / duration, 1);
                audio.volume = start + (target - start) * progress;
                if (progress < 1) safeRAF(step);
            }
            safeRAF(step);
        }

        function createBurst() {
            var colors = ['#e8b4cb', '#ddb3d0', '#d4a5a5', '#f8d7da', '#8b5a6b', '#fadadd'];
            for (var r = 0; r < 3; r++) {
                (function(delay) {
                    safeTimeout(function() {
                        var ring = document.createElement('div');
                        ring.className = 'music-burst';
                        document.body.appendChild(ring);
                        safeTimeout(function() { if (ring.parentNode) ring.remove(); }, 1000);
                    }, delay * 200);
                })(r);
            }
            for (var i = 0; i < 30; i++) {
                (function(idx) {
                    var p = document.createElement('div');
                    p.className = 'burst-particle';
                    var angle = (idx / 30) * Math.PI * 2;
                    var dist = 80 + Math.random() * 180;
                    var x = Math.cos(angle) * dist;
                    var y = Math.sin(angle) * dist;
                    var size = 4 + Math.random() * 6;
                    p.style.top = '50%';
                    p.style.left = '50%';
                    p.style.width = size + 'px';
                    p.style.height = size + 'px';
                    p.style.background = colors[idx % colors.length];
                    p.style.boxShadow = '0 0 ' + size + 'px ' + colors[idx % colors.length];
                    p.style.animation = 'burstParticle 1.2s ease-out forwards';
                    p.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                    document.body.appendChild(p);
                    safeTimeout(function() { if (p.parentNode) p.remove(); }, 1300);
                })(i);
            }
        }

        /* First click anywhere on the page starts the music */
        document.addEventListener('click', function startMusic() {
            if (activated) return;
            activated = true;
            document.removeEventListener('click', startMusic);

            var p = audio.play();
            if (p && typeof p.then === 'function') {
                p.then(function () {
                    fadeIn();
                    createBurst();
                }).catch(function () {
                    activated = false;
                });
            } else {
                fadeIn();
                createBurst();
            }
        });
    })();

    /* =========================================================
       3. TYPEWRITER EFFECT
       ========================================================= */
    (function typewriterEffect() {
        var letterSection = document.querySelector('.letter-section');
        var content = document.getElementById('letterContent');
        if (!letterSection || !content) return;

        var triggered = false;
        /* Collect all direct p and div.signature children in order */
        var paragraphs = content.querySelectorAll('p, div.signature');
        var originals = [];
        paragraphs.forEach(function (p) {
            originals.push(p.innerHTML);
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !triggered) {
                    triggered = true;
                    observer.unobserve(letterSection);
                    startTypewriter();
                }
            });
        }, { threshold: 0.2 });

        observer.observe(letterSection);

        /**
         * Tokenize HTML string so that tags are single tokens
         * and regular characters are individual tokens.
         * Preserves <b class="sdds"> and </b> tags as units.
         */
        function tokenize(html) {
            var tokens = [];
            var i = 0;
            while (i < html.length) {
                if (html[i] === '<') {
                    var end = html.indexOf('>', i);
                    if (end === -1) {
                        tokens.push(html.substring(i));
                        break;
                    }
                    tokens.push(html.substring(i, end + 1));
                    i = end + 1;
                } else if (html[i] === '&') {
                    /* Handle HTML entities like &amp; &#123; etc */
                    var semiIdx = html.indexOf(';', i);
                    if (semiIdx !== -1 && semiIdx - i < 12) {
                        tokens.push(html.substring(i, semiIdx + 1));
                        i = semiIdx + 1;
                    } else {
                        tokens.push(html[i]);
                        i++;
                    }
                } else {
                    tokens.push(html[i]);
                    i++;
                }
            }
            return tokens;
        }

        function startTypewriter() {
            /* Clear all paragraphs */
            paragraphs.forEach(function (p) { p.innerHTML = ''; });

            /* Create blinking cursor */
            injectStyles('tw-blink-style', '@keyframes twBlink{0%,100%{opacity:1}50%{opacity:0}}.typewriter-cursor{animation:twBlink 0.7s step-end infinite;font-weight:100;color:#8b5a6b;}');

            var cursor = document.createElement('span');
            cursor.className = 'typewriter-cursor';
            cursor.textContent = '|';

            var pIdx = 0;

            function typeNextParagraph() {
                if (pIdx >= originals.length) {
                    /* Done — remove cursor */
                    if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
                    return;
                }

                var el = paragraphs[pIdx];
                var html = originals[pIdx];
                var tokens = tokenize(html);
                var tIdx = 0;
                var built = '';

                el.innerHTML = '';
                el.appendChild(cursor);

                function typeChar() {
                    if (tIdx >= tokens.length) {
                        /* Paragraph done — restore exact original HTML */
                        el.innerHTML = html;
                        pIdx++;
                        safeTimeout(typeNextParagraph, 400);
                        return;
                    }
                    built += tokens[tIdx];
                    tIdx++;
                    el.innerHTML = built;
                    el.appendChild(cursor);
                    safeTimeout(typeChar, 20);
                }

                typeChar();
            }

            typeNextParagraph();
        }
    })();

    /* =========================================================
       4. PHOTO FADE ON SCROLL — like a memory slipping away
       ========================================================= */
    (function photoFade() {
        var photoFrame = document.getElementById('photoFrame');
        var bgImg = document.getElementById('backgroundImg');

        function update() {
            var scrollY = window.scrollY || window.pageYOffset;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var ratio = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

            /* Background photo loses color as you scroll down */
            if (bgImg) {
                var grayscale = ratio * 100;
                bgImg.style.filter = 'blur(14px) brightness(1.1) sepia(' + (15 - ratio * 15) + '%) saturate(' + (0.9 - ratio * 0.9) + ') grayscale(' + grayscale + '%)';
            }

            /* Circular photo also loses color */
            if (photoFrame) {
                var img = photoFrame.querySelector('img');
                if (img) {
                    var photoRect = photoFrame.getBoundingClientRect();
                    var center = photoRect.top + photoRect.height / 2;
                    var vpCenter = window.innerHeight / 2;

                    if (center <= vpCenter) {
                        var dist = vpCenter - center;
                        var maxDist = vpCenter + photoRect.height / 2;
                        var r = Math.min(dist / maxDist, 1);
                        img.style.filter = 'saturate(' + (1.1 - r) + ') contrast(1.05) grayscale(' + (r * 100) + '%)';
                        photoFrame.style.opacity = String(1 - r * 0.4);
                    } else {
                        img.style.filter = 'saturate(1.1) contrast(1.05)';
                        photoFrame.style.opacity = '1';
                    }
                }
            }

            safeRAF(update);
        }
        safeRAF(update);
    })();

    /* =========================================================
       5. DAY/NIGHT MODE
       ========================================================= */
    (function dayNight() {
        var h = new Date().getHours();
        if (h >= 20 || h < 6) {
            document.body.classList.add('night-mode');
        }
    })();

    /* =========================================================
       6. SUNFLOWER PETALS
       ========================================================= */
    (function sunflowerPetals() {
        var container = document.getElementById('petalsContainer');
        if (!container) return;
        var MAX_PETALS = 8;
        var activeCount = 0;

        injectStyles('petal-style',
            '@keyframes petalFall{0%{top:-20px;opacity:0.7}80%{opacity:0.5}100%{top:105vh;opacity:0}}' +
            '@keyframes petalSway{0%{margin-left:-30px}100%{margin-left:30px}}'
        );

        function createPetal() {
            if (activeCount >= MAX_PETALS || document.hidden) return;
            activeCount++;

            var petal = document.createElement('div');
            var size = 8 + Math.random() * 8;
            var left = Math.random() * 100;
            var duration = 8 + Math.random() * 6;
            var rotation = Math.random() * 360;
            var swayDuration = 2 + Math.random() * 3;

            petal.style.cssText =
                'position:fixed;top:-20px;left:' + left + '%;width:' + size + 'px;height:' + size + 'px;' +
                'border-radius:50% 0 50% 0;pointer-events:none;z-index:5;' +
                'background:linear-gradient(135deg,#f0c27f,#e8b4cb,#ddb3d0);' +
                'opacity:0.7;transform:rotate(' + rotation + 'deg);' +
                'animation:petalFall ' + duration + 's linear forwards, petalSway ' + swayDuration + 's ease-in-out infinite alternate;';

            container.appendChild(petal);

            safeTimeout(function () {
                if (petal.parentNode) petal.parentNode.removeChild(petal);
                activeCount--;
            }, duration * 1000);
        }

        createPetal();
        safeInterval(createPetal, 3000);
    })();

    /* =========================================================
       7 & 11. VISIT COUNTER & MESSAGE
       ========================================================= */
    (function visitCounter() {
        var key = 'mafe_visits';
        var visits = parseInt(localStorage.getItem(key) || '0', 10) + 1;
        localStorage.setItem(key, String(visits));

        /* Feature 7 — psychological return message */
        var msgEl = document.getElementById('visitMessage');
        if (msgEl) {
            if (visits === 2) msgEl.textContent = 'Você voltou.';
            else if (visits === 3) msgEl.textContent = 'Eu sabia que voltaria.';
            else if (visits >= 4) msgEl.textContent = 'Sempre soube que voltaria...';
            /* visit 1: empty, no message */
        }

        /* Feature 11 — counter display */
        var ctrEl = document.getElementById('visitCounter');
        if (ctrEl) {
            ctrEl.textContent = 'Esta página foi visitada ' + visits + (visits === 1 ? ' vez' : ' vezes');
        }
    })();

    /* =========================================================
       9. TIMELINE VISIBILITY
       ========================================================= */
    (function timelineToggle() {
        var timeline = document.getElementById('timeline');
        if (!timeline) return;

        var onScroll = throttle(function () {
            if ((window.scrollY || window.pageYOffset) > 200) {
                timeline.classList.add('visible');
            } else {
                timeline.classList.remove('visible');
            }
        }, 100);

        window.addEventListener('scroll', onScroll, { passive: true });
    })();

    /* =========================================================
       10. "REACENDER A CHAMA" — the most important easter egg
       ========================================================= */
    (function reacenderAChama() {
        var sdds = document.getElementById('sddsText');
        var card = document.getElementById('letterCard');
        if (!sdds) return;

        /* Make it interactive */
        if (getComputedStyle(sdds).position === 'static') {
            sdds.style.position = 'relative';
        }
        sdds.style.cursor = 'pointer';

        injectStyles('flame-particle-css',
            '@keyframes flameRise{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-40px) scale(0.3)}}' +
            '.flame-particle{position:absolute;border-radius:50%;pointer-events:none;animation:flameRise 1.2s ease-out forwards;}'
        );

        var flameActive = false;
        var flameInterval;

        function spawnFlame() {
            var particle = document.createElement('span');
            particle.className = 'flame-particle';
            var x = rand(5, sdds.offsetWidth - 5);
            var colors = ['#e8b4cb', '#ddb3d0', '#d4a5a5', '#f8d7da', '#c97b9e'];
            var color = colors[randInt(0, colors.length - 1)];
            var size = rand(3, 7);
            particle.style.left = x + 'px';
            particle.style.bottom = '100%';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = color;
            particle.style.boxShadow = '0 0 ' + (size + 2) + 'px ' + color;
            sdds.appendChild(particle);
            safeTimeout(function () {
                if (particle.parentNode) particle.parentNode.removeChild(particle);
            }, 1200);
        }

        /* Hover flames */
        sdds.addEventListener('mouseenter', function () {
            if (flameActive) return;
            flameActive = true;
            flameInterval = setInterval(spawnFlame, 60);
        });
        sdds.addEventListener('mouseleave', function () {
            flameActive = false;
            clearInterval(flameInterval);
        });

        /* Mobile touch flames */
        sdds.addEventListener('touchstart', function () {
            if (flameActive) return;
            flameActive = true;
            flameInterval = setInterval(spawnFlame, 60);
            safeTimeout(function () {
                flameActive = false;
                clearInterval(flameInterval);
            }, 3000);
        }, { passive: true });

        /* CLICK — relight the flame (the core easter egg) */
        sdds.addEventListener('click', function (e) {
            /* Burst of flame particles */
            for (var i = 0; i < 8; i++) {
                (function (idx) {
                    safeTimeout(function () { spawnFlame(); }, idx * 40);
                })(i);
            }

            /* Glow the text golden-white */
            sdds.style.transition = 'text-shadow 0.3s ease, color 0.3s ease';
            sdds.style.textShadow = '0 0 20px #ffd700, 0 0 40px #ffaa00, 0 0 60px #fff';
            sdds.style.color = '#fff8dc';

            safeTimeout(function () {
                sdds.style.textShadow = '';
                sdds.style.color = '';
            }, 2000);

            /* Pulse the letter card */
            if (card) {
                card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                card.style.transform = 'scale(1.015)';
                card.style.boxShadow = '0 0 40px rgba(255,215,0,0.3)';
                safeTimeout(function () {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                }, 800);
            }

            /* Warm overlay shift — the background briefly shifts warmer */
            var overlay = document.querySelector('.photo-overlay');
            if (overlay) {
                overlay.style.transition = 'background 0.5s ease';
                overlay.style.background = 'linear-gradient(to bottom, rgba(255,170,50,0.15), rgba(255,100,0,0.08))';
                safeTimeout(function () {
                    overlay.style.background = '';
                }, 3000);
            }
        });
    })();

    /* =========================================================
       12. TAB TITLE — "Volta logo..."
       ========================================================= */
    (function tabTitle() {
        document.addEventListener('visibilitychange', function () {
            document.title = document.hidden ? 'Volta logo...' : originalTitle;
        });
    })();

    /* =========================================================
       13. CONSOLE MESSAGE
       ========================================================= */
    (function consoleMsg() {
        console.log(
            '%c\u2661 A chama nunca se apagou.',
            'color:#e8b4cb;font-size:20px;font-weight:bold;font-family:Georgia,serif;padding:12px 0;text-shadow:0 0 5px #ddb3d0;'
        );
        console.log(
            '%c\u266A You Look Like You Love Me \u2014 Ella Langley',
            'color:#8b5a6b;font-size:11px;font-style:italic;font-family:Georgia,serif;'
        );
    })();

    /* =========================================================
       14. NAME EASTER EGG — type "mafe" for golden glow
       ========================================================= */
    (function nameEasterEgg() {
        var secret = 'mafe';
        var buffer = '';
        var photoFrame = document.getElementById('photoFrame');

        document.addEventListener('keydown', function (e) {
            buffer += e.key.toLowerCase();
            if (buffer.length > secret.length) buffer = buffer.slice(-secret.length);

            if (buffer === secret) {
                buffer = '';

                /* Golden glow overlay on entire page */
                var glow = document.createElement('div');
                glow.style.cssText =
                    'position:fixed;inset:0;z-index:99999;pointer-events:none;' +
                    'background:radial-gradient(circle at center,rgba(255,215,0,0.15),transparent 70%);' +
                    'transition:opacity 1.5s ease;opacity:1;';
                document.body.appendChild(glow);
                safeTimeout(function () { glow.style.opacity = '0'; }, 100);
                safeTimeout(function () {
                    if (glow.parentNode) glow.parentNode.removeChild(glow);
                }, 1700);

                /* Photo glow */
                if (photoFrame) {
                    photoFrame.style.transition = 'box-shadow 0.4s ease';
                    photoFrame.style.boxShadow = '0 0 40px rgba(255,215,0,0.6), 0 0 80px rgba(255,170,0,0.3)';
                    safeTimeout(function () {
                        photoFrame.style.boxShadow = '';
                    }, 2000);
                }
            }
        });
    })();

    /* =========================================================
       15. PARALLAX — background image at 0.12x scroll speed
       ========================================================= */
    /* Parallax desativado — foto de fundo fica fixa */

    /* =========================================================
       16. ASCII ART FIT — responsive font-size
       ========================================================= */
    (function asciiFit() {
        var ascii = document.getElementById('asciiArt');
        if (!ascii) return;
        var frame = ascii.closest('.ascii-frame');
        if (!frame) return;

        var lines = ascii.textContent.split('\n').filter(function (l) { return l.trim().length > 0; });
        var maxChars = 0;
        lines.forEach(function (l) { if (l.length > maxChars) maxChars = l.length; });
        if (maxChars === 0) return;

        /* Probe character width ratio at 100px to get accurate measurement */
        var probe = document.createElement('span');
        probe.style.cssText = "font-family:'Courier New',monospace;font-size:100px;font-weight:900;position:absolute;visibility:hidden;white-space:pre;";
        probe.textContent = '@';
        document.body.appendChild(probe);
        var charRatio = probe.offsetWidth / 100;
        document.body.removeChild(probe);

        function fit() {
            var style = getComputedStyle(frame);
            var available = frame.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
            if (available <= 0) return;
            var fontSize = available / (maxChars * charRatio);
            fontSize = Math.min(fontSize, 14);
            fontSize = Math.max(fontSize, 1);
            ascii.style.fontSize = fontSize + 'px';
        }

        requestAnimationFrame(function () { requestAnimationFrame(fit); });
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () { safeTimeout(fit, 200); });
        }
        window.addEventListener('resize', throttle(fit, 150));
    })();

    /* =========================================================
       17. PROGRESS BAR — thin 2px pink gradient at top
       ========================================================= */
    (function progressBar() {
        var bar = document.createElement('div');
        bar.style.cssText =
            'position:fixed;top:0;left:0;height:2px;width:0%;z-index:99999;pointer-events:none;' +
            'background:linear-gradient(90deg,#e8b4cb,#8b5a6b,#ddb3d0);border-radius:0 2px 2px 0;' +
            'transition:width 0.1s linear;';
        document.body.appendChild(bar);

        var ticking = false;
        function update() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var h = document.documentElement.scrollHeight - window.innerHeight;
                bar.style.width = (h > 0 ? ((window.scrollY || window.pageYOffset) / h) * 100 : 0) + '%';
                ticking = false;
            });
        }
        window.addEventListener('scroll', update, { passive: true });
        update();
    })();

    /* =========================================================
       18. IMAGE FADE-IN ON LOAD
       ========================================================= */
    (function imageFadeIn() {
        var images = document.querySelectorAll('img');
        images.forEach(function (img) {
            if (img.id === 'backgroundImg') return; /* skip bg, handled by parallax */
            if (img.complete && img.naturalWidth > 0) return;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.8s ease';
            img.addEventListener('load', function () { img.style.opacity = '1'; }, { once: true });
            img.addEventListener('error', function () { img.style.opacity = '1'; }, { once: true });
        });
    })();

    /* =========================================================
       19. FLOATING PARTICLES ON HEADER — reduced count
       ========================================================= */
    (function floatingParticles() {
        var container = document.querySelector('.floating-hearts');
        if (!container) return;
        var count = isMobile ? 10 : 15;
        var symbols = ['\u2661', '\u2726', '\u00b7', '\u2665', '\u2727'];

        injectStyles('float-style',
            '@keyframes floatUp{' +
            '0%{transform:translateY(100vh) rotate(0deg);opacity:0}' +
            '10%{opacity:0.5}' +
            '90%{opacity:0.3}' +
            '100%{transform:translateY(-20vh) rotate(360deg);opacity:0}' +
            '}'
        );

        for (var i = 0; i < count; i++) {
            var p = document.createElement('span');
            var size = 8 + Math.random() * 16;
            var left = Math.random() * 100;
            var dur = 6 + Math.random() * 10;
            var delay = Math.random() * dur;
            p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            p.setAttribute('aria-hidden', 'true');
            p.style.cssText =
                'position:absolute;pointer-events:none;opacity:0;font-size:' + size + 'px;' +
                'left:' + left + '%;color:#e8b4cb;' +
                'animation:floatUp ' + dur + 's ' + delay + 's ease-in-out infinite;';
            container.appendChild(p);
        }
    })();

    /* =========================================================
       BONUS: "29.08" date reveal at bottom of page
       ========================================================= */
    (function dateReveal() {
        var el = document.createElement('div');
        el.className = 'hidden-date';
        el.textContent = '29.08';
        document.body.appendChild(el);

        var check = throttle(function () {
            var scrollBottom = (window.scrollY || window.pageYOffset) + window.innerHeight;
            var docHeight = document.documentElement.scrollHeight;
            if (docHeight - scrollBottom < 80) {
                el.classList.add('revealed');
            } else {
                el.classList.remove('revealed');
            }
        }, 100);
        window.addEventListener('scroll', check, { passive: true });
    })();

});
