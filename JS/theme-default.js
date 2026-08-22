// /**
//  * ThemeDefault
//  * ------------
//  * "hero"    — bold, prominent flowing wave lines (the original design).
//  * "section" — same motif, tuned way down: fewer lines, thinner, fainter,
//  *             slower — ambient movement behind text-heavy sections
//  *             (About / Projects / Contact) that won't fight for attention.
//  */
// const ThemeDefault = {
//   hero: {
//     init(width, height) {
//       const waveCount = 4;
//       const hues = [255, 200, 280, 190];

//       const waves = Array.from({ length: waveCount }, (_, i) => ({
//         amplitude: 35 + Math.random() * 35,
//         wavelength: 280 + Math.random() * 220,
//         speed: 0.12 + Math.random() * 0.15,
//         yOffset: height * (0.28 + i * 0.16),
//         phase: Math.random() * Math.PI * 2,
//         hue: hues[i % hues.length],
//         lineWidth: 2 + Math.random() * 1.5,
//         opacity: 0.22 + Math.random() * 0.22,
//       }));

//       return { waves, t: 0 };
//     },

//     draw(ctx, state, width, height, dt) {
//       state.t += dt;

//       ctx.fillStyle = '#0b1020';
//       ctx.fillRect(0, 0, width, height);

//       state.waves.forEach((wave) => {
//         ctx.beginPath();
//         for (let x = 0; x <= width; x += 6) {
//           const y =
//             wave.yOffset +
//             Math.sin(x / wave.wavelength + state.t * wave.speed + wave.phase) * wave.amplitude;
//           if (x === 0) ctx.moveTo(x, y);
//           else ctx.lineTo(x, y);
//         }
//         ctx.strokeStyle = `hsla(${wave.hue}, 80%, 65%, ${wave.opacity})`;
//         ctx.lineWidth = wave.lineWidth;
//         ctx.shadowColor = `hsla(${wave.hue}, 90%, 60%, 0.6)`;
//         ctx.shadowBlur = 12;
//         ctx.stroke();
//       });

//       ctx.shadowBlur = 0;
//     },
//   },

//   section: {
//     init(width, height) {
//       const waveCount = 2; // fewer lines than hero
//       const hues = [255, 200];

//       const waves = Array.from({ length: waveCount }, (_, i) => ({
//         amplitude: 18 + Math.random() * 14, // much flatter
//         wavelength: 400 + Math.random() * 250, // slower undulation
//         speed: 0.05 + Math.random() * 0.05, // noticeably calmer
//         yOffset: height * (0.35 + i * 0.35),
//         phase: Math.random() * Math.PI * 2,
//         hue: hues[i % hues.length],
//         lineWidth: 1.2,
//         opacity: 0.08 + Math.random() * 0.06, // faint — sits behind cards
//       }));

//       return { waves, t: 0 };
//     },

//     draw(ctx, state, width, height, dt) {
//       state.t += dt;

//       // No solid fill here — section canvas stays transparent so the
//       // page's own --bg color (and card translucency) shows through.
//       ctx.clearRect(0, 0, width, height);

//       state.waves.forEach((wave) => {
//         ctx.beginPath();
//         for (let x = 0; x <= width; x += 8) {
//           const y =
//             wave.yOffset +
//             Math.sin(x / wave.wavelength + state.t * wave.speed + wave.phase) * wave.amplitude;
//           if (x === 0) ctx.moveTo(x, y);
//           else ctx.lineTo(x, y);
//         }
//         ctx.strokeStyle = `hsla(${wave.hue}, 70%, 65%, ${wave.opacity})`;
//         ctx.lineWidth = wave.lineWidth;
//         ctx.shadowBlur = 0; // no glow — keep it subtle, cheaper to render
//         ctx.stroke();
//       });
//     },
//   },
// };


// New Script:

// /**
//  * ThemeDefault
//  * ------------
//  * hero     — bold flowing wave lines (original hero design).
//  * about    — same wave motif, boosted visibility (thicker/brighter).
//  * projects — a single line that continuously morphs shape and returns
//  *            to its exact starting shape at the end of each cycle.
//  * contact  — drifting glow particles with faint constellation lines
//  *            (no straight "lines" here, so the reflection idea becomes
//  *            a per-particle twinkle/flare instead).
//  *
//  * All wave/line variants share a "traveling glow" — a bright segment
//  * that occasionally sweeps right-to-left along the line's own curve,
//  * triggered at random intervals per line.
//  */
// const ThemeDefault = (() => {
//   // ---------- shared: traveling reflection glow ----------

//   function createTraveler() {
//     return {
//       active: false,
//       x: 0,
//       speed: 0,
//       length: 0,
//       elapsed: 0,
//       nextTriggerAt: 2 + Math.random() * 6, // seconds until first possible pass
//     };
//   }

//   function updateTraveler(traveler, dt, width) {
//     traveler.elapsed += dt;

//     if (!traveler.active) {
//       if (traveler.elapsed >= traveler.nextTriggerAt) {
//         traveler.length = 100 + Math.random() * 70;
//         traveler.speed = width / (2.5 + Math.random() * 2.5); // ~2.5-5s to cross
//         traveler.x = width + traveler.length; // start fully off the right edge
//         traveler.active = true;
//       }
//       return;
//     }

//     traveler.x -= traveler.speed * dt;

//     if (traveler.x < -traveler.length) {
//       traveler.active = false;
//       traveler.elapsed = 0;
//       traveler.nextTriggerAt = 3 + Math.random() * 8; // wait before the next pass
//     }
//   }

//   // yAt: function(x) -> y, following whatever curve the line currently has
//   function drawTravelerGlow(ctx, traveler, yAt, hue) {
//     if (!traveler.active) return;

//     const half = traveler.length / 2;
//     const minX = traveler.x - half;
//     const maxX = traveler.x + half;

//     const gradient = ctx.createLinearGradient(minX, 0, maxX, 0);
//     gradient.addColorStop(0, `hsla(${hue}, 100%, 80%, 0)`);
//     gradient.addColorStop(0.5, `hsla(${hue}, 100%, 88%, 0.95)`);
//     gradient.addColorStop(1, `hsla(${hue}, 100%, 80%, 0)`);

//     ctx.beginPath();
//     const step = 4;
//     for (let x = minX; x <= maxX; x += step) {
//       const y = yAt(x);
//       if (x === minX) ctx.moveTo(x, y);
//       else ctx.lineTo(x, y);
//     }
//     ctx.strokeStyle = gradient;
//     ctx.lineWidth = 3;
//     ctx.lineCap = 'round';
//     ctx.shadowColor = `hsla(${hue}, 100%, 75%, 0.85)`;
//     ctx.shadowBlur = 14;
//     ctx.stroke();
//     ctx.shadowBlur = 0;
//   }

//   function waveY(wave, x, t) {
//     return (
//       wave.yOffset +
//       Math.sin(x / wave.wavelength + t * wave.speed + wave.phase) * wave.amplitude
//     );
//   }

//   function drawWaveLine(ctx, wave, t, width) {
//     ctx.beginPath();
//     for (let x = 0; x <= width; x += 6) {
//       const y = waveY(wave, x, t);
//       if (x === 0) ctx.moveTo(x, y);
//       else ctx.lineTo(x, y);
//     }
//     ctx.strokeStyle = `hsla(${wave.hue}, ${wave.saturation}%, ${wave.lightness}%, ${wave.opacity})`;
//     ctx.lineWidth = wave.lineWidth;
//     ctx.shadowColor = `hsla(${wave.hue}, 90%, 62%, ${wave.glow})`;
//     ctx.shadowBlur = wave.shadowBlur;
//     ctx.stroke();
//     ctx.shadowBlur = 0;
//   }

//   // ---------- hero ----------

//   const hero = {
//     init(width, height) {
//       const hues = [255, 200, 280, 190];
//       const waves = Array.from({ length: 4 }, (_, i) => ({
//         amplitude: 35 + Math.random() * 35,
//         wavelength: 280 + Math.random() * 220,
//         speed: 0.12 + Math.random() * 0.15,
//         yOffset: height * (0.28 + i * 0.16),
//         phase: Math.random() * Math.PI * 2,
//         hue: hues[i % hues.length],
//         saturation: 80,
//         lightness: 65,
//         lineWidth: 2 + Math.random() * 1.5,
//         opacity: 0.22 + Math.random() * 0.22,
//         glow: 0.6,
//         shadowBlur: 12,
//       }));

//       return { waves, t: 0, travelers: waves.map(createTraveler) };
//     },

//     draw(ctx, state, width, height, dt) {
//       state.t += dt;

//       ctx.fillStyle = '#0b1020';
//       ctx.fillRect(0, 0, width, height);

//       state.waves.forEach((wave, i) => {
//         drawWaveLine(ctx, wave, state.t, width);

//         updateTraveler(state.travelers[i], dt, width);
//         drawTravelerGlow(ctx, state.travelers[i], (x) => waveY(wave, x, state.t), wave.hue);
//       });
//     },
//   };

//   // ---------- about ----------

//   const about = {
//     init(width, height) {
//       const hues = [255, 200];
//       const waves = Array.from({ length: 2 }, (_, i) => ({
//         amplitude: 30 + Math.random() * 25,
//         wavelength: 320 + Math.random() * 200,
//         speed: 0.07 + Math.random() * 0.06,
//         yOffset: height * (0.35 + i * 0.3),
//         phase: Math.random() * Math.PI * 2,
//         hue: hues[i % hues.length],
//         saturation: 85,
//         lightness: 68,
//         lineWidth: 2.4,
//         opacity: 0.4 + Math.random() * 0.18, // much more visible than before
//         glow: 0.3,
//         shadowBlur: 6,
//       }));

//       return { waves, t: 0, travelers: waves.map(createTraveler) };
//     },

//     draw(ctx, state, width, height, dt) {
//       state.t += dt;
//       ctx.clearRect(0, 0, width, height); // transparent — page bg / cards show through

//       state.waves.forEach((wave, i) => {
//         drawWaveLine(ctx, wave, state.t, width);

//         updateTraveler(state.travelers[i], dt, width);
//         drawTravelerGlow(ctx, state.travelers[i], (x) => waveY(wave, x, state.t), wave.hue);
//       });
//     },
//   };

//   // ---------- projects: single morphing line ----------

//   function morphPointsAt(state) {
//     return state.points.map((p) => ({
//       x: p.x,
//       y: p.baseY + p.amp * Math.sin(state.t * state.freq + p.phase),
//     }));
//   }

//   function drawSmoothCurve(ctx, pts) {
//     ctx.beginPath();
//     ctx.moveTo(pts[0].x, pts[0].y);
//     for (let i = 1; i < pts.length - 1; i++) {
//       const mx = (pts[i].x + pts[i + 1].x) / 2;
//       const my = (pts[i].y + pts[i + 1].y) / 2;
//       ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
//     }
//     const last = pts[pts.length - 1];
//     ctx.lineTo(last.x, last.y);
//   }

//   function morphYAt(pts, x) {
//     for (let i = 0; i < pts.length - 1; i++) {
//       if (x >= pts[i].x && x <= pts[i + 1].x) {
//         const span = pts[i + 1].x - pts[i].x || 1;
//         const t = (x - pts[i].x) / span;
//         return pts[i].y + (pts[i + 1].y - pts[i].y) * t;
//       }
//     }
//     return x < pts[0].x ? pts[0].y : pts[pts.length - 1].y;
//   }

//   const projects = {
//     init(width, height) {
//       const pointCount = 6;
//       const periodSeconds = 10 + Math.random() * 4; // time to complete one full morph loop
//       const freq = (Math.PI * 2) / periodSeconds;

//       const points = Array.from({ length: pointCount }, (_, i) => ({
//         x: (width * i) / (pointCount - 1),
//         baseY: height * 0.5,
//         amp: 30 + Math.random() * 45,
//         phase: Math.random() * Math.PI * 2,
//       }));

//       return {
//         points,
//         freq,
//         t: 0,
//         hue: 220,
//         traveler: createTraveler(),
//       };
//     },

//     draw(ctx, state, width, height, dt) {
//       state.t += dt;
//       ctx.clearRect(0, 0, width, height);

//       const pts = morphPointsAt(state);

//       drawSmoothCurve(ctx, pts);
//       ctx.strokeStyle = `hsla(${state.hue}, 85%, 68%, 0.5)`;
//       ctx.lineWidth = 2.6;
//       ctx.shadowColor = `hsla(${state.hue}, 90%, 65%, 0.35)`;
//       ctx.shadowBlur = 8;
//       ctx.stroke();
//       ctx.shadowBlur = 0;

//       updateTraveler(state.traveler, dt, width);
//       drawTravelerGlow(ctx, state.traveler, (x) => morphYAt(pts, x), state.hue);
//     },
//   };

//   // ---------- contact: particle constellation ----------

//   const contact = {
//     init(width, height) {
//       const area = width * height;
//       const count = Math.min(18, Math.max(8, Math.round(area / 45000)));
//       const hues = [255, 200, 280];

//       const particles = Array.from({ length: count }, () => ({
//         x: Math.random() * width,
//         y: Math.random() * height,
//         vx: (Math.random() - 0.5) * 12,
//         vy: (Math.random() - 0.5) * 8,
//         radius: 1.5 + Math.random() * 2,
//         hue: hues[Math.floor(Math.random() * hues.length)],
//         twinklePhase: Math.random() * Math.PI * 2,
//         twinkleSpeed: 0.5 + Math.random() * 0.6,
//       }));

//       return { particles, t: 0 };
//     },

//     draw(ctx, state, width, height, dt) {
//       state.t += dt;
//       ctx.clearRect(0, 0, width, height);

//       const { particles } = state;

//       particles.forEach((p) => {
//         p.x += p.vx * dt;
//         p.y += p.vy * dt;
//         if (p.x < -10) p.x = width + 10;
//         if (p.x > width + 10) p.x = -10;
//         if (p.y < -10) p.y = height + 10;
//         if (p.y > height + 10) p.y = -10;
//       });

//       // faint constellation lines between nearby particles
//       const maxDist = Math.min(width, height) * 0.3;
//       for (let i = 0; i < particles.length; i++) {
//         for (let j = i + 1; j < particles.length; j++) {
//           const a = particles[i];
//           const b = particles[j];
//           const dx = a.x - b.x;
//           const dy = a.y - b.y;
//           const dist = Math.sqrt(dx * dx + dy * dy);
//           if (dist < maxDist) {
//             const alpha = (1 - dist / maxDist) * 0.18;
//             ctx.beginPath();
//             ctx.moveTo(a.x, a.y);
//             ctx.lineTo(b.x, b.y);
//             ctx.strokeStyle = `hsla(220, 80%, 70%, ${alpha})`;
//             ctx.lineWidth = 1;
//             ctx.stroke();
//           }
//         }
//       }

//       // twinkling glow particles (their "flare" stands in for the reflection effect)
//       particles.forEach((p) => {
//         const twinkle = 0.5 + 0.5 * Math.sin(state.t * p.twinkleSpeed + p.twinklePhase);
//         const alpha = 0.35 + twinkle * 0.5;

//         const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
//         gradient.addColorStop(0, `hsla(${p.hue}, 100%, 82%, ${alpha})`);
//         gradient.addColorStop(1, `hsla(${p.hue}, 100%, 70%, 0)`);

//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
//         ctx.fillStyle = gradient;
//         ctx.fill();

//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
//         ctx.fillStyle = `hsla(${p.hue}, 100%, 92%, ${Math.min(alpha + 0.3, 1)})`;
//         ctx.fill();
//       });
//     },
//   };

//   return { hero, about, projects, contact };
// })();

// End :

/**
 * ThemeDefault
 * ------------
 * hero     — bold flowing wave lines (original hero design).
 * about    — same wave motif, boosted visibility (thicker/brighter).
 * projects — a single line that continuously morphs shape and returns
 *            to its exact starting shape at the end of each cycle.
 * contact  — drifting glow particles with faint constellation lines
 *            (no straight "lines" here, so the reflection idea becomes
 *            a per-particle twinkle/flare instead).
 *
 * All wave/line variants share a "traveling glow" — a bright segment
 * that occasionally sweeps right-to-left along the line's own curve,
 * triggered at random intervals per line.
 */
const ThemeDefault = (() => {
  // ---------- shared: traveling reflection glow ----------

  function createTraveler() {
    return {
      active: false,
      x: 0,
      speed: 0,
      length: 0,
      elapsed: 0,
      nextTriggerAt: 2 + Math.random() * 6, // seconds until first possible pass
    };
  }

  function updateTraveler(traveler, dt, width) {
    traveler.elapsed += dt;

    if (!traveler.active) {
      if (traveler.elapsed >= traveler.nextTriggerAt) {
        traveler.length = 100 + Math.random() * 70;
        traveler.speed = width / (2.5 + Math.random() * 2.5); // ~2.5-5s to cross
        traveler.x = width + traveler.length; // start fully off the right edge
        traveler.active = true;
      }
      return;
    }

    traveler.x -= traveler.speed * dt;

    if (traveler.x < -traveler.length) {
      traveler.active = false;
      traveler.elapsed = 0;
      traveler.nextTriggerAt = 3 + Math.random() * 8; // wait before the next pass
    }
  }

  // yAt: function(x) -> y, following whatever curve the line currently has
  function drawTravelerGlow(ctx, traveler, yAt, hue) {
    if (!traveler.active) return;

    const half = traveler.length / 2;
    const minX = traveler.x - half;
    const maxX = traveler.x + half;

    const gradient = ctx.createLinearGradient(minX, 0, maxX, 0);
    gradient.addColorStop(0, `hsla(${hue}, 100%, 80%, 0)`);
    gradient.addColorStop(0.5, `hsla(${hue}, 100%, 88%, 0.95)`);
    gradient.addColorStop(1, `hsla(${hue}, 100%, 80%, 0)`);

    ctx.beginPath();
    const step = 4;
    for (let x = minX; x <= maxX; x += step) {
      const y = yAt(x);
      if (x === minX) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.shadowColor = `hsla(${hue}, 100%, 75%, 0.85)`;
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function waveY(wave, x, t) {
    return (
      wave.yOffset +
      Math.sin(x / wave.wavelength + t * wave.speed + wave.phase) * wave.amplitude
    );
  }

  function drawWaveLine(ctx, wave, t, width) {
    ctx.beginPath();
    for (let x = 0; x <= width; x += 6) {
      const y = waveY(wave, x, t);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `hsla(${wave.hue}, ${wave.saturation}%, ${wave.lightness}%, ${wave.opacity})`;
    ctx.lineWidth = wave.lineWidth;
    ctx.shadowColor = `hsla(${wave.hue}, 90%, 62%, ${wave.glow})`;
    ctx.shadowBlur = wave.shadowBlur;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // ---------- hero ----------

  const hero = {
    init(width, height) {
      const hues = [255, 200, 280, 190];
      const waves = Array.from({ length: 4 }, (_, i) => ({
        amplitude: 35 + Math.random() * 35,
        wavelength: 280 + Math.random() * 220,
        speed: 0.12 + Math.random() * 0.15,
        yOffset: height * (0.28 + i * 0.16),
        phase: Math.random() * Math.PI * 2,
        hue: hues[i % hues.length],
        saturation: 80,
        lightness: 65,
        lineWidth: 2 + Math.random() * 1.5,
        opacity: 0.22 + Math.random() * 0.22,
        glow: 0.6,
        shadowBlur: 12,
      }));

      return { waves, t: 0, travelers: waves.map(createTraveler) };
    },

    draw(ctx, state, width, height, dt) {
      state.t += dt;

      ctx.fillStyle = '#0b1020';
      ctx.fillRect(0, 0, width, height);

      state.waves.forEach((wave, i) => {
        drawWaveLine(ctx, wave, state.t, width);

        updateTraveler(state.travelers[i], dt, width);
        drawTravelerGlow(ctx, state.travelers[i], (x) => waveY(wave, x, state.t), wave.hue);
      });
    },
  };

  // ---------- about ----------

  const about = {
    init(width, height) {
      const hues = [255, 200];
      const waves = Array.from({ length: 2 }, (_, i) => ({
        amplitude: 30 + Math.random() * 25,
        wavelength: 320 + Math.random() * 200,
        speed: 0.07 + Math.random() * 0.06,
        yOffset: height * (0.35 + i * 0.3),
        phase: Math.random() * Math.PI * 2,
        hue: hues[i % hues.length],
        saturation: 85,
        lightness: 68,
        lineWidth: 2.4,
        opacity: 0.4 + Math.random() * 0.18, // much more visible than before
        glow: 0.3,
        shadowBlur: 6,
      }));

      return { waves, t: 0, travelers: waves.map(createTraveler) };
    },

    draw(ctx, state, width, height, dt) {
      state.t += dt;
      ctx.clearRect(0, 0, width, height); // transparent — page bg / cards show through

      state.waves.forEach((wave, i) => {
        drawWaveLine(ctx, wave, state.t, width);

        updateTraveler(state.travelers[i], dt, width);
        drawTravelerGlow(ctx, state.travelers[i], (x) => waveY(wave, x, state.t), wave.hue);
      });
    },
  };

  // ---------- projects: shape-morphing polygon ----------
  // Cycles pentagon -> octagon -> heptagon -> pentagon..., smoothly
  // morphing between them, while the whole shape drifts around the
  // canvas (staying clear of the edges so no corner gets clipped).

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function polygonVertices(sides) {
    const verts = [];
    const startAngle = -Math.PI / 2; // first vertex points up, for a consistent silhouette
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + (i * 2 * Math.PI) / sides;
      verts.push({ x: Math.cos(angle), y: Math.sin(angle) });
    }
    return verts;
  }

  // Resamples a closed polygon into N points evenly spaced by arc length,
  // so any two shapes (even with different vertex counts) can be
  // interpolated point-by-point without the shape twisting oddly.
  function resampleClosedPath(vertices, N) {
    const edges = vertices.map((v, i) => {
      const next = vertices[(i + 1) % vertices.length];
      const dx = next.x - v.x;
      const dy = next.y - v.y;
      return { len: Math.sqrt(dx * dx + dy * dy), dx, dy, start: v };
    });
    const totalLen = edges.reduce((sum, e) => sum + e.len, 0);
    const step = totalLen / N;

    const points = [];
    let edgeIndex = 0;
    let edgeStartDist = 0;

    for (let i = 0; i < N; i++) {
      const targetDist = i * step;
      while (
        edgeIndex < edges.length - 1 &&
        targetDist > edgeStartDist + edges[edgeIndex].len
      ) {
        edgeStartDist += edges[edgeIndex].len;
        edgeIndex++;
      }
      const edge = edges[edgeIndex];
      const t = edge.len === 0 ? 0 : (targetDist - edgeStartDist) / edge.len;
      points.push({
        x: edge.start.x + edge.dx * t,
        y: edge.start.y + edge.dy * t,
      });
    }
    return points;
  }

  function lerpShapes(a, b, t) {
    return a.map((p, i) => ({
      x: p.x + (b[i].x - p.x) * t,
      y: p.y + (b[i].y - p.y) * t,
    }));
  }

  function createPerimeterTraveler() {
    return {
      active: false,
      progress: 0,
      speed: 0,
      elapsed: 0,
      nextTriggerAt: 2 + Math.random() * 6,
    };
  }

  function updatePerimeterTraveler(traveler, dt) {
    traveler.elapsed += dt;

    if (!traveler.active) {
      if (traveler.elapsed >= traveler.nextTriggerAt) {
        traveler.active = true;
        traveler.progress = 0;
        traveler.speed = 1 / (3 + Math.random() * 2); // one full lap every ~3-5s
      }
      return;
    }

    traveler.progress += traveler.speed * dt;
    if (traveler.progress >= 1) {
      traveler.active = false;
      traveler.elapsed = 0;
      traveler.nextTriggerAt = 3 + Math.random() * 8;
    }
  }

  function drawPerimeterGlow(ctx, traveler, worldPoints, hue) {
    if (!traveler.active) return;

    const N = worldPoints.length;
    const centerIdx = traveler.progress * N;
    const halfWidthIdx = N * 0.12;

    for (let offset = -Math.ceil(halfWidthIdx); offset <= Math.ceil(halfWidthIdx); offset++) {
      const dist = Math.abs(offset);
      if (dist > halfWidthIdx) continue;

      const idx = (((Math.round(centerIdx) + offset) % N) + N) % N;
      const nextIdx = (idx + 1) % N;
      const falloff = 1 - dist / halfWidthIdx;
      const alpha = falloff * falloff * 0.9;
      if (alpha < 0.03) continue;

      const p1 = worldPoints[idx];
      const p2 = worldPoints[nextIdx];

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = `hsla(${hue}, 100%, 85%, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowColor = `hsla(${hue}, 100%, 75%, ${alpha})`;
      ctx.shadowBlur = 12;
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }

  const projects = {
    init(width, height) {
      const N = 60; // resample resolution — higher = smoother morph
      const shapesData = [5, 8, 7].map((sides) =>
        resampleClosedPath(polygonVertices(sides), N)
      );

      const margin = 26;
      const radius = Math.max(
        18,
        Math.min(Math.min(width, height) * 0.24, Math.min(width, height) / 2 - margin)
      );

      // Center must stay within this range so the shape (circumscribed
      // by `radius`) never crosses the margin, on any side, at any time.
      const rangeX = Math.max(0, width - margin * 2 - radius * 2);
      const rangeY = Math.max(0, height - margin * 2 - radius * 2);

      return {
        shapesData,
        N,
        shapeIndex: 0,
        nextIndex: 1,
        phase: 'hold',
        timer: 0,
        holdDuration: 3.2, // how long a shape stays fully formed
        morphDuration: 3, // transition length — matches the hero waves' unhurried pace
        radius,
        margin,
        rangeX,
        rangeY,
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
        hue: 220,
        traveler: createPerimeterTraveler(),
        t: 0,
      };
    },

    draw(ctx, state, width, height, dt) {
      state.t += dt;
      ctx.clearRect(0, 0, width, height);

      state.timer += dt;
      if (state.phase === 'hold' && state.timer >= state.holdDuration) {
        state.phase = 'morph';
        state.timer = 0;
      } else if (state.phase === 'morph' && state.timer >= state.morphDuration) {
        state.shapeIndex = state.nextIndex;
        state.nextIndex = (state.nextIndex + 1) % state.shapesData.length;
        state.phase = 'hold';
        state.timer = 0;
      }

      let localPoints;
      if (state.phase === 'hold') {
        localPoints = state.shapesData[state.shapeIndex];
      } else {
        const rawT = state.timer / state.morphDuration;
        const t = smoothstep(Math.min(1, Math.max(0, rawT)));
        localPoints = lerpShapes(
          state.shapesData[state.shapeIndex],
          state.shapesData[state.nextIndex],
          t
        );
      }

      // Gentle Lissajous-style drift, bounded so the shape stays clear of the edges.
      const cx =
        state.margin +
        state.radius +
        (state.rangeX > 0
          ? (0.5 + 0.5 * Math.sin(state.t * 0.15 + state.driftPhaseX)) * state.rangeX
          : state.rangeX / 2);
      const cy =
        state.margin +
        state.radius +
        (state.rangeY > 0
          ? (0.5 + 0.5 * Math.sin(state.t * 0.11 + state.driftPhaseY)) * state.rangeY
          : state.rangeY / 2);

      const worldPoints = localPoints.map((p) => ({
        x: cx + p.x * state.radius,
        y: cy + p.y * state.radius,
      }));

      ctx.beginPath();
      ctx.moveTo(worldPoints[0].x, worldPoints[0].y);
      for (let i = 1; i < worldPoints.length; i++) {
        ctx.lineTo(worldPoints[i].x, worldPoints[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(${state.hue}, 85%, 68%, 0.5)`;
      ctx.lineWidth = 2.6;
      ctx.shadowColor = `hsla(${state.hue}, 90%, 65%, 0.35)`;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      updatePerimeterTraveler(state.traveler, dt);
      drawPerimeterGlow(ctx, state.traveler, worldPoints, state.hue);
    },
  };

  // ---------- contact: particle constellation ----------

  const contact = {
    init(width, height) {
      const area = width * height;
      const count = Math.min(18, Math.max(8, Math.round(area / 45000)));
      const hues = [255, 200, 280];

      const particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 8,
        radius: 1.5 + Math.random() * 2,
        hue: hues[Math.floor(Math.random() * hues.length)],
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.5 + Math.random() * 0.6,
      }));

      return { particles, t: 0 };
    },

    draw(ctx, state, width, height, dt) {
      state.t += dt;
      ctx.clearRect(0, 0, width, height);

      const { particles } = state;

      particles.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      });

      // faint constellation lines between nearby particles
      const maxDist = Math.min(width, height) * 0.3;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(220, 80%, 70%, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // twinkling glow particles (their "flare" stands in for the reflection effect)
      particles.forEach((p) => {
        const twinkle = 0.5 + 0.5 * Math.sin(state.t * p.twinkleSpeed + p.twinklePhase);
        const alpha = 0.35 + twinkle * 0.5;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 82%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 70%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 92%, ${Math.min(alpha + 0.3, 1)})`;
        ctx.fill();
      });
    },
  };

  return { hero, about, projects, contact };
})();