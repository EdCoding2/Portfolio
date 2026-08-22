/**
 * BackgroundEngine (v2 — multi-region)
 * -------------------------------------
 * Runs one animated canvas background PER SECTION instead of one
 * full-page canvas. Each region is a pair of stacked canvases (for
 * crossfade) sized to its own container via ResizeObserver.
 *
 * Usage:
 *   BackgroundEngine.setup([
 *     { containerId: 'home',     canvasIds: ['hero-bg-a', 'hero-bg-b'],         variant: 'hero' },
 *     { containerId: 'about',    canvasIds: ['about-bg-a', 'about-bg-b'],       variant: 'section' },
 *     { containerId: 'projects', canvasIds: ['projects-bg-a', 'projects-bg-b'], variant: 'section' },
 *     { containerId: 'contact',  canvasIds: ['contact-bg-a', 'contact-bg-b'],   variant: 'section' },
 *   ], {
 *     default: ThemeDefault,
 *     midnight: ThemeMidnight,
 *   });
 *
 *   BackgroundEngine.start('default');
 *   BackgroundEngine.switchTheme('midnight'); // call from applyTheme()
 *
 * Each theme module must look like:
 *   {
 *     hero:    { init(w,h) -> state, draw(ctx, state, w, h, dt) },
 *     section: { init(w,h) -> state, draw(ctx, state, w, h, dt) },
 *   }
 */
const BackgroundEngine = (() => {
  const regions = [];
  let themes = {};
  let currentThemeName = null;
  let lastTime = 0;
  let running = true;
  let started = false;

  function debounce(fn, wait) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  function resizeRegion(region) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = region.container.getBoundingClientRect();
    region.width = Math.max(1, Math.round(rect.width));
    region.height = Math.max(1, Math.round(rect.height));
    region.dpr = dpr;

    region.canvases.forEach((canvas, i) => {
      canvas.width = region.width * dpr;
      canvas.height = region.height * dpr;
      canvas.style.width = region.width + 'px';
      canvas.style.height = region.height + 'px';
      region.ctxs[i].setTransform(dpr, 0, 0, dpr, 0, 0);
    });

    // Re-init loaded theme state(s) so geometry matches new size.
    region.stateNames.forEach((name, i) => {
      if (name && themes[name]) {
        const variant = themes[name][region.variant];
        if (variant) region.states[i] = variant.init(region.width, region.height);
      }
    });
  }

  function switchRegionTheme(region, name) {
    const variant = themes[name] && themes[name][region.variant];
    if (!variant) {
      console.warn(`BackgroundEngine: theme "${name}" has no "${region.variant}" variant`);
      return;
    }
    if (region.stateNames[region.activeIndex] === name) return;

    const nextIndex = 1 - region.activeIndex;
    region.stateNames[nextIndex] = name;
    region.states[nextIndex] = variant.init(region.width, region.height);

    region.canvases[nextIndex].classList.add('active');
    region.canvases[region.activeIndex].classList.remove('active');
    region.activeIndex = nextIndex;
  }

  function switchTheme(name) {
    if (!themes[name]) {
      console.warn(`BackgroundEngine: unknown theme "${name}"`);
      return;
    }
    currentThemeName = name;
    regions.forEach((region) => switchRegionTheme(region, name));
  }

  function loop(time) {
    if (!running) return;

    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    regions.forEach((region) => {
      for (let i = 0; i < 2; i++) {
        const name = region.stateNames[i];
        if (name && themes[name] && region.states[i]) {
          const variant = themes[name][region.variant];
          variant.draw(region.ctxs[i], region.states[i], region.width, region.height, dt);
        }
      }
    });

    requestAnimationFrame(loop);
  }

  function setup(regionConfigs, themeDefs) {
    themes = themeDefs;

    regionConfigs.forEach((cfg) => {
      const container = document.getElementById(cfg.containerId);
      if (!container) throw new Error(`BackgroundEngine: container #${cfg.containerId} not found`);

      const canvases = cfg.canvasIds.map((id) => {
        const c = document.getElementById(id);
        if (!c) throw new Error(`BackgroundEngine: canvas #${id} not found`);
        return c;
      });
      const ctxs = canvases.map((c) => c.getContext('2d'));

      const region = {
        container,
        canvases,
        ctxs,
        variant: cfg.variant,
        states: [null, null],
        stateNames: [null, null],
        activeIndex: 0,
        width: 0,
        height: 0,
        dpr: 1,
      };

      regions.push(region);
      resizeRegion(region);

      if (window.ResizeObserver) {
        const observer = new ResizeObserver(debounce(() => resizeRegion(region), 150));
        observer.observe(container);
      }
    });

    // Fallback / extra safety net for browsers or layout shifts
    // ResizeObserver alone might miss (e.g. font loading reflow).
    window.addEventListener('resize', debounce(() => regions.forEach(resizeRegion), 200));

    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) {
        lastTime = performance.now();
        requestAnimationFrame(loop);
      }
    });
  }

  function start(initialTheme) {
    if (started) return;
    started = true;

    switchTheme(initialTheme);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      regions.forEach((region) => {
        const name = region.stateNames[region.activeIndex];
        const variant = themes[name][region.variant];
        variant.draw(
          region.ctxs[region.activeIndex],
          region.states[region.activeIndex],
          region.width,
          region.height,
          0
        );
      });
      return;
    }

    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  return { setup, start, switchTheme };
})();