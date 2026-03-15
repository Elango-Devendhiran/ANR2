/* ═══════════════════════════════════════════════
   ANR SILKS & SHIRTS — SHARED JAVASCRIPT v2
═══════════════════════════════════════════════ */

(function () {

    /* ── 3-Second Luxury Page Loader ── */
    (function () {
        var loader  = document.getElementById('page-loader');
        var bar     = document.getElementById('loader-bar');
        if (!loader) return;

        document.documentElement.classList.add('is-loading');

        var progress  = 0;
        var startTime = Date.now();
        var MIN_SHOW  = 3000;  /* 3 seconds minimum */
        var pageReady = false;
        var barDone   = false;

        /* Fill bar smoothly over ~2.6s */
        var fillTimer = setInterval(function () {
            if (progress >= 92) { clearInterval(fillTimer); return; }
            var increment = progress < 40 ? (Math.random() * 8 + 4)
                          : progress < 70 ? (Math.random() * 5 + 2)
                          : (Math.random() * 2 + 0.8);
            progress = Math.min(progress + increment, 92);
            if (bar) bar.style.width = progress + '%';
        }, 100);

        function dismiss() {
            if (bar) bar.style.width = '100%';
            /* Open curtains first */
            setTimeout(function () {
                loader.classList.add('curtain-open');
                document.documentElement.classList.remove('is-loading');
                /* Then fade whole loader */
                setTimeout(function () {
                    loader.classList.add('fade-out');
                    setTimeout(function () {
                        if (loader.parentNode) loader.parentNode.removeChild(loader);
                    }, 900);
                }, 700);
            }, 250);
        }

        function tryDismiss() {
            if (!pageReady || !barDone) return;
            var elapsed   = Date.now() - startTime;
            var remaining = MIN_SHOW - elapsed;
            setTimeout(dismiss, remaining > 0 ? remaining : 0);
        }

        setTimeout(function () { barDone = true; tryDismiss(); }, 2600);

        if (document.readyState === 'complete') {
            pageReady = true; tryDismiss();
        } else {
            window.addEventListener('load', function () { pageReady = true; tryDismiss(); });
        }

        /* Hard fallback at 4.5s */
        setTimeout(function () { if (loader.parentNode) dismiss(); }, 4500);
    })();

    /* ── Hamburger toggle ── */
    var ham    = document.querySelector('.nav-hamburger');
    var drawer = document.querySelector('.nav-drawer');
    if (ham && drawer) {
        ham.addEventListener('click', function () {
            var isOpen = ham.classList.toggle('open');
            drawer.classList.toggle('open');
            document.documentElement.classList.toggle('menu-open', isOpen);
        });
        drawer.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                ham.classList.remove('open');
                drawer.classList.remove('open');
                document.documentElement.classList.remove('menu-open');
            });
        });
    }

    /* ── Nav scroll shadow ── */
    var nav = document.querySelector('.site-nav');
    if (nav) {
        window.addEventListener('scroll', function () {
            nav.classList.toggle('scrolled', window.scrollY > 10);
        });
    }

    /* ── Active nav link ── */
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    /* ── Scroll Reveal (IntersectionObserver) ── */
    var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if ('IntersectionObserver' in window && revealEls.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.08 });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ── Parallax on hero sections ── */
    var parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length) {
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            parallaxEls.forEach(function (el) {
                var speed  = parseFloat(el.dataset.parallax) || 0.3;
                el.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
            });
        }, { passive: true });
    }

    /* ── Number counter animation ── */
    document.querySelectorAll('[data-count]').forEach(function (el) {
        var target   = parseInt(el.dataset.count, 10);
        var duration = 1800;
        var started  = false;
        var obs = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting && !started) {
                started = true;
                var start = 0, startTime = null;
                function step(ts) {
                    if (!startTime) startTime = ts;
                    var progress = Math.min((ts - startTime) / duration, 1);
                    var ease = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(ease * target) + (el.dataset.suffix || '');
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
                obs.disconnect();
            }
        }, { threshold: 0.5 });
        obs.observe(el);
    });

})();
