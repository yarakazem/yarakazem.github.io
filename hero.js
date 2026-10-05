// Hero whiteboard: an AI cursor proposes a grouping, Yara edits and accepts it,
// and the stickies settle into two labelled clusters. Plays once when the board
// is in view; Replay runs it again. Stickies can be dragged; visitors can add their own.
(() => {
  const board = document.getElementById("board");
  if (!board || !window.gsap) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);
  const stickies = [...board.querySelectorAll(".note")];
  const groups = {
    a: stickies.filter((s) => s.dataset.group === "a"),
    b: stickies.filter((s) => s.dataset.group === "b"),
  };
  const labels = {
    a: board.querySelector('[data-cluster="a"]'),
    b: board.querySelector('[data-cluster="b"]'),
  };
  const suggestion = $("suggestion");
  const field = $("s-field");
  const caret = $("caret");
  const editBtn = $("s-edit");
  const acceptBtn = $("s-accept");
  const cursorAI = $("cursor-ai");
  const cursorYara = $("cursor-yara");

  const AI_LABEL = '"AI mistakes"';
  const HUMAN_LABEL = '"Show why, allow undo"';
  const CLUSTER_X = { a: 0.02, b: 0.52 };
  const GAP = 12;
  const LABEL_SPACE = 34;

  let tl = null;
  let clustered = false;
  let rearranged = false; // set once a visitor drags something
  let touched = false; // a visitor interacted before the story started: don't override them

  // Geometry, all relative to the board
  const rectIn = (el) => {
    const b = board.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height };
  };

  // Where each note sits once clustered, as x/y offsets from its CSS position.
  // offsetLeft/Top ignore transforms, so this works at any point in the story.
  function clusterLayout() {
    const W = board.clientWidth;
    const targets = new Map();
    const bottoms = {};
    for (const g of ["a", "b"]) {
      let top = W < 480 ? LABEL_SPACE + 18 : LABEL_SPACE;
      const left = CLUSTER_X[g] * W;
      groups[g].forEach((s, i) => {
        targets.set(s, { x: left - s.offsetLeft, y: top - s.offsetTop, r: i % 2 ? "1deg" : "-1deg" });
        top += s.offsetHeight + GAP;
      });
      bottoms[g] = top;
      gsap.set(labels[g], { left, top: 4, width: W * 0.46 });
    }
    return { targets, bottoms };
  }

  function resetScene() {
    stickies.forEach((s) => {
      gsap.set(s, { x: 0, y: 0, "--r": s.dataset.r });
      s.classList.remove("is-selected");
    });
    gsap.set([labels.a, labels.b, suggestion, cursorAI, cursorYara, caret], { opacity: 0 });
    editBtn.classList.remove("is-pressed");
    acceptBtn.classList.remove("is-pressed");
    field.textContent = AI_LABEL;
    clustered = false;
    rearranged = false;
  }

  function settle() {
    const { targets } = clusterLayout();
    stickies.forEach((s) => {
      const t = targets.get(s);
      gsap.set(s, { x: t.x, y: t.y, "--r": t.r });
      s.classList.remove("is-selected");
    });
    gsap.set([labels.a, labels.b], { opacity: 1 });
    clustered = true;
  }

  function typeInto(el, from, to, perChar) {
    const proxy = { i: 0 };
    const total = from.length + to.length;
    return gsap.to(proxy, {
      i: total,
      duration: total * perChar,
      ease: "none",
      onUpdate() {
        const n = Math.round(proxy.i);
        el.textContent = n <= from.length ? from.slice(0, from.length - n) : to.slice(0, n - from.length);
      },
    });
  }

  const press = (btn) =>
    gsap.timeline()
      .add(() => btn.classList.add("is-pressed"))
      .to(btn, { scale: 0.94, duration: 0.08, ease: "power2.out" })
      .to(btn, { scale: 1, duration: 0.16, ease: "power3.out" });

  function buildTimeline() {
    resetScene();
    const W = board.clientWidth;
    const H = board.clientHeight;
    const move = { duration: 0.8, ease: "power3.inOut" };
    const hop = { duration: 0.45, ease: "power3.inOut" };
    const at = (el, fx, fy) => {
      const r = rectIn(el);
      return { x: r.x + r.w * fx, y: r.y + r.h * fy };
    };

    // Suggestion chip sits just under the last selected note, kept inside the board
    const last = rectIn(groups.a[groups.a.length - 1]);
    gsap.set(suggestion, { left: 0, top: 0 });
    const chipW = suggestion.offsetWidth;
    const chipH = suggestion.offsetHeight;
    const chipX = Math.max(8, Math.min(last.x + 24, W - chipW - 8));
    const chipY = Math.max(8, Math.min(last.y + last.h + 10, H - chipH - 8));
    gsap.set(suggestion, { left: chipX, top: chipY });
    gsap.set(cursorAI, { x: W + 24, y: H * 0.2 });
    gsap.set(cursorYara, { x: -40, y: H * 0.55 });

    const { targets, bottoms } = clusterLayout();
    const t = gsap.timeline({ paused: true, delay: 0.3 });

    // 1. The AI picks out three notes that share a theme...
    t.to(cursorAI, { opacity: 1, duration: 0.2, ease: "power2.out" });
    groups.a.forEach((s, i) => {
      t.to(cursorAI, { ...at(s, 0.82, 0.7), ...(i === 0 ? move : hop) }, i === 0 ? "<" : ">")
        .add(() => s.classList.add("is-selected"));
    });
    // 2. ...and suggests a name for the group
    t.fromTo(suggestion, { opacity: 0, y: 6, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power3.out" }, "+=0.1")
      .to(cursorAI, { x: chipX + chipW * 0.3, y: chipY + chipH + 4, duration: 0.5, ease: "power3.inOut" }, "<");

    // 3. Yara steps in, rewrites the name, then accepts
    t.to(cursorYara, { opacity: 1, duration: 0.2, ease: "power2.out" }, "+=0.25")
      .to(cursorYara, { ...at(editBtn, 0.55, 0.6), ...move }, "<")
      .add(press(editBtn))
      .to(caret, { opacity: 1, duration: 0.01 })
      .add(typeInto(field, AI_LABEL, HUMAN_LABEL, 0.035))
      .to(caret, { opacity: 0, duration: 0.01 })
      .add(() => editBtn.classList.remove("is-pressed"))
      .to(cursorYara, { ...at(acceptBtn, 0.5, 0.6), duration: 0.4, ease: "power3.inOut" })
      .add(press(acceptBtn));

    // 4. The board tidies into two clusters: Yara's edited label and an AI-made one
    const order = [...groups.a, ...groups.b];
    t.add("tidy", "+=0.15")
      .to(suggestion, { opacity: 0, duration: 0.18, ease: "power2.out" }, "tidy")
      .add(() => stickies.forEach((s) => s.classList.remove("is-selected")), "tidy")
      .to(order, {
        x: (i) => targets.get(order[i]).x,
        y: (i) => targets.get(order[i]).y,
        "--r": (i) => targets.get(order[i]).r,
        duration: 0.7,
        ease: "power3.inOut",
        stagger: 0.06,
      }, "tidy+=0.05")
      .to(cursorYara, { x: CLUSTER_X.a * W + 110, y: bottoms.a + 10, duration: 0.8, ease: "power3.inOut" }, "tidy+=0.1")
      .to(cursorAI, { x: CLUSTER_X.b * W + 130, y: bottoms.b + 10, duration: 0.8, ease: "power3.inOut" }, "tidy+=0.2")
      .fromTo(labels.a, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.25, ease: "power3.out" }, "tidy+=0.55")
      .fromTo(labels.b, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.25, ease: "power3.out" }, "tidy+=0.75")
      .add(() => { clustered = true; });

    return t;
  }

  function play() {
    if (tl) tl.kill();
    tl = buildTimeline();
    if (reduceMotion) {
      tl.progress(1);
      settle();
      gsap.set([cursorAI, cursorYara, suggestion], { opacity: 0 });
      return;
    }
    tl.play();
  }

  // Finish the story instantly if someone grabs a sticky mid-animation
  function finishNow() {
    if (tl && tl.isActive()) {
      tl.progress(1);
      settle();
    }
  }

  // Dragging
  let zTop = 10;
  function makeDraggable(s) {
    let start = null;
    s.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      touched = true;
      finishNow();
      start = { px: e.clientX, py: e.clientY, x: gsap.getProperty(s, "x"), y: gsap.getProperty(s, "y"), moved: false };
      s.setPointerCapture(e.pointerId);
    });
    s.addEventListener("pointermove", (e) => {
      if (!start) return;
      const dx = e.clientX - start.px;
      const dy = e.clientY - start.py;
      if (!start.moved && Math.hypot(dx, dy) < 4) return;
      if (!start.moved) {
        start.moved = true;
        rearranged = true;
        s.classList.add("is-dragging");
        s.style.zIndex = ++zTop;
        if (document.activeElement === s) s.blur();
      }
      const area = s.parentElement;
      const W = area.clientWidth;
      const H = area.clientHeight;
      const x = Math.max(-s.offsetLeft, Math.min(start.x + dx, W - s.offsetLeft - s.offsetWidth));
      const y = Math.max(-s.offsetTop, Math.min(start.y + dy, H - s.offsetTop - s.offsetHeight));
      gsap.set(s, { x, y });
    });
    const end = (e) => {
      if (!start) return;
      const wasClick = !start.moved;
      start = null;
      s.classList.remove("is-dragging");
      if (wasClick && s.isContentEditable) s.focus();
      if (s.hasPointerCapture?.(e.pointerId)) s.releasePointerCapture(e.pointerId);
    };
    s.addEventListener("pointerup", end);
    s.addEventListener("pointercancel", end);
  }

  stickies.forEach((s) => {
    s.dataset.r = getComputedStyle(s).getPropertyValue("--r").trim() || "0deg";
    makeDraggable(s);
  });

  // Toolbar
  $("tool-replay").addEventListener("click", () => {
    board.querySelectorAll(".note.is-added").forEach((s) => s.remove());
    play();
  });

  // Board tools: add a sticky or a stamp to whichever section is in view
  const colors = ["yellow", "pink", "blue", "green"];
  let added = 0;
  const sectionInView = () => {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    return el?.closest(".fj-section") ?? document.querySelector(".fj-section");
  };

  $("tool-sticky").addEventListener("click", () => {
    touched = true;
    finishNow();
    setStamping(false);
    const section = sectionInView();
    const sr = section.getBoundingClientRect();
    const s = document.createElement("div");
    s.className = "note is-added";
    s.dataset.color = colors[added++ % colors.length];
    s.contentEditable = "true";
    s.spellcheck = false;
    s.setAttribute("role", "textbox");
    s.setAttribute("aria-label", "Your sticky note");
    s.textContent = "Write a note";
    s.style.width = "200px";
    const x = window.innerWidth / 2 - sr.left - 100 + (Math.random() * 60 - 30);
    const y = window.innerHeight / 2 - sr.top - 50 + (Math.random() * 60 - 30);
    s.style.left = `${Math.round(Math.max(8, Math.min(x, sr.width - 208)))}px`;
    s.style.top = `${Math.round(Math.max(8, Math.min(y, sr.height - 120)))}px`;
    s.style.setProperty("--r", `${(Math.random() * 4 - 2).toFixed(1)}deg`);
    s.style.zIndex = ++zTop;
    section.append(s);
    makeDraggable(s);
    if (!reduceMotion) gsap.fromTo(s, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.2, ease: "power3.out" });
    s.focus({ preventScroll: true });
    const range = document.createRange();
    range.selectNodeContents(s);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  });

  // Stamp mode: click anywhere in a section to drop a stamp; click a stamp to remove it
  const stampBtn = $("tool-stamp");
  const stampIcons = [...$("stamp-icons").content.querySelectorAll("svg")];
  let stamping = false;
  let stampKind = 0;
  function setStamping(on) {
    stamping = on;
    stampBtn.setAttribute("aria-pressed", String(on));
    document.body.classList.toggle("is-stamping", on);
  }
  stampBtn.addEventListener("click", () => setStamping(!stamping));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && stamping) setStamping(false);
  });
  document.addEventListener("click", (e) => {
    const stamp = e.target.closest(".stamp");
    if (stamp) {
      stamp.remove();
      return;
    }
    if (!stamping) return;
    const section = e.target.closest(".fj-section");
    if (!section || e.target.closest("a, button, .note, [contenteditable]")) return;
    const r = section.getBoundingClientRect();
    const el = document.createElement("span");
    el.className = "stamp";
    el.dataset.kind = String(stampKind);
    el.setAttribute("aria-hidden", "true");
    el.append(stampIcons[stampKind].cloneNode(true));
    stampKind = (stampKind + 1) % stampIcons.length;
    el.style.left = `${e.clientX - r.left}px`;
    el.style.top = `${e.clientY - r.top}px`;
    section.append(el);
    if (!reduceMotion) gsap.fromTo(el, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(2)" });
  });

  // Keep clusters aligned when the board resizes
  new ResizeObserver(() => {
    if (clustered && !rearranged) settle();
  }).observe(board);

  // Start once fonts are ready (sticky heights depend on them) and the board is visible
  const start = () => {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        if (!touched) play();
      }
    }, { threshold: 0.4 });
    io.observe(board);
  };
  (document.fonts?.ready ?? Promise.resolve()).then(start);
})();
