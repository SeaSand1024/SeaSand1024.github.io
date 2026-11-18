(function () {
  const ROBX = [1, 0.9986, 0.9954, 0.9900, 0.9822, 0.9730, 0.9600, 0.9427, 0.9216, 0.8962, 0.8679, 0.8350, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322];
  const ROBY = [0, 0.0620, 0.1240, 0.1860, 0.2480, 0.3100, 0.3720, 0.4340, 0.4958, 0.5571, 0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1];

  const VIEWS = {
    world: null,
    med: [-12, 22, 48, 48],
    europe: [-12, 34, 42, 64],
    eastasia: [95, 18, 145, 52],
    indianocean: [30, -28, 115, 32],
    americas: [-130, -40, -34, 55]
  };

  const CITIES = [
    { n: "孟菲斯", x: 31.25, y: 29.85, a: -3200, b: -500, p: 1 },
    { n: "乌尔", x: 46.1, y: 30.96, a: -3000, b: -500, p: 1 },
    { n: "摩亨佐-达罗", x: 68.14, y: 27.33, a: -3000, b: -1700, p: 1 },
    { n: "巴比伦", x: 44.42, y: 32.54, a: -1800, b: 600, p: 1 },
    { n: "尼尼微", x: 43.16, y: 36.36, a: -900, b: -612, p: 2 },
    { n: "雅典", x: 23.73, y: 37.98, a: -800, b: 2010, p: 2 },
    { n: "罗马", x: 12.5, y: 41.89, a: -700, b: 2010, p: 1 },
    { n: "亚历山大", x: 29.92, y: 31.2, a: -331, b: 2010, p: 2 },
    { n: "长安", x: 108.94, y: 34.26, a: -200, b: 907, p: 1 },
    { n: "洛阳", x: 112.45, y: 34.62, a: -1000, b: 1200, p: 2 },
    { n: "巴格达", x: 44.37, y: 33.34, a: 762, b: 2010, p: 1 },
    { n: "君士坦丁堡", x: 28.98, y: 41.01, a: 330, b: 1453, p: 1 },
    { n: "伊斯坦布尔", x: 28.98, y: 41.01, a: 1453, b: 2010, p: 1 },
    { n: "开封", x: 114.35, y: 34.8, a: 960, b: 1200, p: 2 },
    { n: "杭州", x: 120.16, y: 30.25, a: 1127, b: 2010, p: 2 },
    { n: "大都", x: 116.4, y: 39.9, a: 1271, b: 1368, p: 1 },
    { n: "北京", x: 116.4, y: 39.9, a: 1403, b: 2010, p: 1 },
    { n: "德里", x: 77.21, y: 28.61, a: 1200, b: 2010, p: 1 },
    { n: "廷巴克图", x: -3.0, y: 16.77, a: 1100, b: 2010, p: 1 },
    { n: "特诺奇蒂特兰", x: -99.13, y: 19.43, a: 1325, b: 1521, p: 1 },
    { n: "墨西哥城", x: -99.13, y: 19.43, a: 1521, b: 2010, p: 2 },
    { n: "库斯科", x: -71.97, y: -13.52, a: 1200, b: 1533, p: 1 },
    { n: "伦敦", x: -0.13, y: 51.51, a: 1000, b: 2010, p: 2 },
    { n: "巴黎", x: 2.35, y: 48.86, a: 500, b: 2010, p: 2 },
    { n: "京都", x: 135.77, y: 35.01, a: 794, b: 2010, p: 1 },
    { n: "埃多", x: 139.69, y: 35.68, a: 1603, b: 1868, p: 2 },
    { n: "东京", x: 139.69, y: 35.68, a: 1868, b: 2010, p: 2 },
    { n: "开罗", x: 31.24, y: 30.04, a: 969, b: 2010, p: 1 },
    { n: "萨马尔罕", x: 66.97, y: 39.65, a: -500, b: 2010, p: 2 },
    { n: "广州", x: 113.26, y: 23.13, a: -200, b: 2010, p: 2 },
    { n: "吴哥", x: 103.87, y: 13.41, a: 802, b: 1431, p: 2 },
    { n: "麦加", x: 39.83, y: 21.39, a: 600, b: 2010, p: 2 },
    { n: "瓦拉纳西", x: 83.0, y: 25.32, a: -800, b: 2010, p: 2 },
    { n: "华氏城", x: 85.14, y: 25.61, a: -500, b: 600, p: 2 },
    { n: "大津巴布韦", x: 30.93, y: -20.27, a: 1100, b: 1500, p: 2 },
    { n: "基辅", x: 30.52, y: 50.45, a: 800, b: 2010, p: 2 },
    { n: "威尼斯", x: 12.32, y: 45.44, a: 800, b: 1797, p: 2 },
    { n: "里斯本", x: -9.14, y: 38.72, a: 1200, b: 2010, p: 2 },
    { n: "莫斯科", x: 37.62, y: 55.75, a: 1147, b: 2010, p: 2 },
    { n: "马德里", x: -3.7, y: 40.42, a: 1561, b: 2010, p: 2 }
  ];

  const NOTES = {
    "Sui Empire": "隋在618年灭亡。公元700年的底图仍用这个名字，范围更接近唐初。",
    "Sasanian Empire": "萨珊王室在651年已经结束。较晚断面上若仍出现这个名字，是底图滞后。",
    "Mauryan Empire": "孔雀王朝大约在公元前185年结束。",
    "Zhoa": "这是底图对「周」的拼写。",
    "central Asian khanates": "这块颜色一直铺到东西伯利亚，不能当成某一个中亚汗国的实控。",
    "Manchu Empire": "清帝在1912年退位。1914年的底图仍写着清帝国。",
    "Quechua": "克丘亚是印加帝国的主要语言人群。底图没有单独画出印加国家。",
    "Mexihcah (Triple Alliance)": "墨西卡与特斯科科、特拉科潘的同盟，通常称为阿兹特克。",
    "Castille": "卡斯蒂利亚。底图的拼写是 Castille。",
    "Denmark-Norway": "公元1000年的图把格陵兰画进了丹麦-挪威，那只是诺斯人开始定居。",
    "Canada": "1815年前后的底图已经画成接近今天的加拿大，当时并没有这个国家。",
    "Khoisan": "科伊桑是非洲南部的人群，不是一个王国。",
    "Fatimid Caliphate": "法蒂玛王朝在1171年结束。1200年的底图若仍画出它，是断面误差。"
  };

  const $ = (id) => document.getElementById(id);
  const canvas = $("map");
  const ctx = canvas.getContext("2d");

  const state = {
    catalog: null,
    names: {},
    land: [],
    features: [],
    era: 0,
    cx: 0,
    cy: 0,
    scale: 120,
    userMoved: false,
    selected: null,
    hover: null,
    showCulture: true,
    showCities: true,
    playing: false,
    timer: 0,
    drag: null
  };

  function project(lon, lat) {
    const alat = Math.max(-90, Math.min(90, lat));
    const sign = alat < 0 ? -1 : 1;
    const a = Math.abs(alat);
    const i = Math.min(17, Math.floor(a / 5));
    const t = (a - i * 5) / 5;
    const X = ROBX[i] * (1 - t) + ROBX[i + 1] * t;
    const Y = ROBY[i] * (1 - t) + ROBY[i + 1] * t;
    return [0.8487 * X * (lon * Math.PI / 180), 1.3523 * Y * sign];
  }

  function projectMulti(multi) {
    let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
    const pg = multi.map((poly) => poly.map((ring) => ring.map(([lon, lat]) => {
      const p = project(lon, lat);
      if (p[0] < minx) minx = p[0];
      if (p[1] < miny) miny = p[1];
      if (p[0] > maxx) maxx = p[0];
      if (p[1] > maxy) maxy = p[1];
      return p;
    })));
    return { pg, pb: [minx, miny, maxx, maxy] };
  }

function refineKind(ft) {
  const z = state.names[ft.n] || "";
  if (ft.k === 1 && /(?:人群|诸部|文化|人)$/.test(z)) ft.k = 0;
}

function prepareFeature(ft) {
  refineKind(ft);
  const proj = projectMulti(ft.g);
  ft.pg = proj.pg;
  ft.pb = proj.pb;
  ft.pc = project(ft.c[0], ft.c[1]);
  return ft;
}

  function labelOf(name) {
    return state.names[name] || name;
  }

  function formatYear(y) {
    if (y < 0) return "公元前" + (-y) + "年";
    return "公元" + y + "年";
  }

  function era() {
    return state.catalog.eras[state.era];
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!state.userMoved) fitWorld();
    draw();
  }

  function size() {
    const r = canvas.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  function fitBounds(b, pad) {
    const { w, h } = size();
    const samples = [];
    for (let i = 0; i <= 8; i++) {
      samples.push(project(b[0] + (b[2] - b[0]) * i / 8, b[1]));
      samples.push(project(b[0] + (b[2] - b[0]) * i / 8, b[3]));
      samples.push(project(b[0], b[1] + (b[3] - b[1]) * i / 8));
      samples.push(project(b[2], b[1] + (b[3] - b[1]) * i / 8));
    }
    let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
    samples.forEach(([x, y]) => {
      minx = Math.min(minx, x); miny = Math.min(miny, y);
      maxx = Math.max(maxx, x); maxy = Math.max(maxy, y);
    });
    const bw = Math.max(0.05, maxx - minx);
    const bh = Math.max(0.05, maxy - miny);
    const m = pad || 28;
    state.scale = Math.min((w - m * 2) / bw, (h - m * 2) / bh);
    state.cx = (minx + maxx) / 2;
    state.cy = (miny + maxy) / 2;
  }

  function fitWorld() {
    fitBounds([-180, -58, 180, 78], 18);
  }

  function projToScreen(x, y) {
    const { w, h } = size();
    return [(x - state.cx) * state.scale + w / 2, (state.cy - y) * state.scale + h / 2];
  }

  function screenToProj(sx, sy) {
    const { w, h } = size();
    return [(sx - w / 2) / state.scale + state.cx, state.cy - (sy - h / 2) / state.scale];
  }

  function traceMulti(pg) {
    ctx.beginPath();
    pg.forEach((poly) => {
      poly.forEach((ring) => {
        ring.forEach((p, i) => {
          const s = projToScreen(p[0], p[1]);
          if (i === 0) ctx.moveTo(s[0], s[1]);
          else ctx.lineTo(s[0], s[1]);
        });
        ctx.closePath();
      });
    });
  }

  function pip(x, y, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      if (((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-12) + xi)) inside = !inside;
    }
    return inside;
  }

  function hits(ft, x, y) {
    const b = ft.pb;
    if (x < b[0] || x > b[2] || y < b[1] || y > b[3]) return false;
    for (let p = 0; p < ft.pg.length; p++) {
      const poly = ft.pg[p];
      if (!pip(x, y, poly[0])) continue;
      let hole = false;
      for (let h = 1; h < poly.length; h++) if (pip(x, y, poly[h])) hole = true;
      if (!hole) return true;
    }
    return false;
  }

  function visibleFeatures() {
    return state.features.filter((ft) => state.showCulture || ft.k === 1);
  }

  function drawGraticule() {
    ctx.save();
    ctx.strokeStyle = "rgba(36,28,22,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let lon = -180; lon <= 180; lon += 30) {
      for (let lat = -80; lat <= 80; lat += 4) {
        const s = projToScreen.apply(null, project(lon, lat));
        if (lat === -80) ctx.moveTo(s[0], s[1]);
        else ctx.lineTo(s[0], s[1]);
      }
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -180; lon <= 180; lon += 4) {
        const s = projToScreen.apply(null, project(lon, lat));
        if (lon === -180) ctx.moveTo(s[0], s[1]);
        else ctx.lineTo(s[0], s[1]);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    const { w, h } = size();
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#c5d3cf";
    ctx.fillRect(0, 0, w, h);
    if (!state.catalog) return;
    drawGraticule();
    ctx.fillStyle = "#f3e6cf";
    ctx.strokeStyle = "rgba(36,28,22,0.18)";
    ctx.lineWidth = 1;
    state.land.forEach((poly) => {
      traceMulti([poly]);
      ctx.fill();
    });
    const selected = state.selected;
    const list = visibleFeatures();
    list.forEach((ft) => {
      if (selected && ft === selected) return;
      traceMulti(ft.pg);
      if (ft.k === 1) {
        ctx.globalAlpha = selected ? 0.4 : 0.84;
        ctx.fillStyle = ft.fill;
        ctx.fill("evenodd");
        ctx.globalAlpha = 0.55;
        ctx.strokeStyle = "rgba(36,28,22,0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = ft.fill;
        ctx.fill("evenodd");
      }
      ctx.globalAlpha = 1;
    });
    if (selected && list.indexOf(selected) >= 0) {
      traceMulti(selected.pg);
      ctx.globalAlpha = 0.94;
      ctx.fillStyle = selected.fill;
      ctx.fill("evenodd");
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#f6f0e4";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.strokeStyle = "#241c16";
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
    const boxes = drawLabels(list);
    if (state.showCities) drawCities(boxes);
  }

  function drawLabels(list) {
    const boxes = [];
    const ranked = list.filter((ft) => ft.k === 1 && state.names[ft.n]).slice().sort((a, b) => b.a - a.a);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ranked.forEach((ft) => {
      if (boxes.length >= (state.scale > 220 ? 28 : 18)) return;
      const s0 = projToScreen(ft.pb[0], ft.pb[1]);
      const s1 = projToScreen(ft.pb[2], ft.pb[3]);
      const bw = Math.abs(s1[0] - s0[0]);
      const bh = Math.abs(s1[1] - s0[1]);
      if (bw < 28 || bh < 16) return;
      const text = labelOf(ft.n);
      const font = Math.max(11, Math.min(16, Math.min(bw, bh) / 7));
      ctx.font = "600 " + font + "px WenQuanYi Micro Hei, sans-serif";
      const tw = ctx.measureText(text).width;
      const at = projToScreen(ft.pc[0], ft.pc[1]);
      const box = { x: at[0] - tw / 2 - 2, y: at[1] - font / 2 - 1, w: tw + 4, h: font + 2 };
      if (box.x < 0 || box.y < 0) return;
      const { w, h } = size();
      if (box.x + box.w > w || box.y + box.h > h) return;
      if (boxes.some((b) => !(box.x > b.x + b.w || b.x > box.x + box.w || box.y > b.y + b.h || b.y > box.y + box.h))) return;
      boxes.push(box);
      ctx.strokeStyle = "rgba(246,240,228,0.92)";
      ctx.lineWidth = 3;
      ctx.strokeText(text, at[0], at[1]);
      ctx.fillStyle = "#241c16";
      ctx.fillText(text, at[0], at[1]);
    });
    return boxes;
  }

  function drawCities(boxes) {
    if (state.scale < 95) return;
    const year = era().year;
    const { w, h } = size();
    ctx.font = "12px WenQuanYi Micro Hei, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    CITIES.forEach((city) => {
      if (year < city.a || year > city.b) return;
      if (city.p > 1 && state.scale < 150) return;
      const s = projToScreen.apply(null, project(city.x, city.y));
      if (s[0] < 8 || s[1] < 8 || s[0] > w - 8 || s[1] > h - 8) return;
      ctx.fillStyle = "#9c3b32";
      ctx.beginPath();
      ctx.arc(s[0], s[1], 2.5, 0, Math.PI * 2);
      ctx.fill();
      const tw = ctx.measureText(city.n).width;
      const box = { x: s[0] + 4, y: s[1] - 7, w: tw + 4, h: 14 };
      const blocked = boxes.some((b) => !(box.x > b.x + b.w || b.x > box.x + box.w || box.y > b.y + b.h || b.y > box.y + box.h));
      if (blocked) return;
      boxes.push(box);
      ctx.strokeStyle = "rgba(246,240,228,0.9)";
      ctx.lineWidth = 3;
      ctx.strokeText(city.n, s[0] + 5, s[1]);
      ctx.fillStyle = "#241c16";
      ctx.fillText(city.n, s[0] + 5, s[1]);
    });
  }

  function renderPanel() {
    const e = era();
    $("year-label").textContent = formatYear(e.year);
    $("era-title").textContent = e.title;
    $("story").textContent = e.story;
    const caveat = $("caveat");
    if (e.caveat) {
      caveat.hidden = false;
      caveat.textContent = e.caveat;
    } else caveat.hidden = true;
    const events = $("events");
    events.replaceChildren();
    e.events.forEach((ev) => {
      const li = document.createElement("li");
      const strong = document.createElement("strong");
      strong.textContent = ev.t;
      li.append(strong, document.createTextNode("　" + ev.d));
      events.append(li);
    });
    const counts = { 1: 0, 0: 0, 2: 0 };
    state.features.forEach((ft) => { counts[ft.k] = (counts[ft.k] || 0) + 1; });
    $("counts").textContent = "这个断面有 " + counts[1] + " 个政权，" + counts[0] + " 个文化区，" + counts[2] + " 块粗略范围。";
    const legend = $("legend");
    legend.replaceChildren();
    const legendPool = state.features.filter((ft) => ft.k === 1 && state.names[ft.n]);
    const legendSource = legendPool.length >= 5 ? legendPool : state.features.filter((ft) => ft.k === 1);
    legendSource.slice(0, 8).forEach((ft) => {
      const btn = document.createElement("button");
      btn.type = "button";
      if (state.selected && state.selected.n === ft.n) btn.className = "active";
      const sw = document.createElement("span");
      sw.className = "swatch";
      sw.style.background = ft.fill;
      btn.append(sw, document.createTextNode(labelOf(ft.n)));
      btn.addEventListener("click", () => selectFeature(ft, true));
      legend.append(btn);
    });
    const chips = $("chips");
    [...chips.children].forEach((btn, i) => btn.setAttribute("aria-selected", i === state.era ? "true" : "false"));
    const active = chips.children[state.era];
    if (active) active.scrollIntoView({ inline: "center", block: "nearest" });
    document.title = formatYear(e.year) + " · " + e.title + " — 寰宇时序";
    renderPicked();
    const url = new URL(location.href);
    url.searchParams.set("year", String(e.year));
    history.replaceState(null, "", url);
  }

  function renderPicked() {
    const box = $("picked");
    const ft = state.selected;
    if (!ft) { box.hidden = true; box.replaceChildren(); return; }
    box.hidden = false;
    box.replaceChildren();
    const h = document.createElement("h3");
    h.textContent = labelOf(ft.n);
    const orig = document.createElement("p");
    orig.className = "orig";
    orig.textContent = ft.n + (ft.s && ft.s !== ft.n ? " · 宗主 " + labelOf(ft.s) : "");
    box.append(h, orig);
    const kind = ft.k === 1 ? "政权" : ft.k === 0 ? "文化区或人群，不是统一国家" : "底图上的粗略范围";
    const meta = document.createElement("p");
    meta.textContent = kind;
    box.append(meta);
    const noteText = noteFor(ft);
    if (noteText) {
      const note = document.createElement("p");
      note.textContent = noteText;
      box.append(note);
    }
  }

  function noteFor(ft) {
    const y = era().year;
    const n = ft.n;
    if (n === "Sui Empire" && y <= 618) return "";
    if (n === "Manchu Empire" && y < 1912) return "";
    if (n === "Mauryan Empire" && y <= -185) return "";
    if (n === "Denmark-Norway" && y >= 1200) return "";
    if (n === "Canada" && y >= 1867) return "";
    if (n === "Fatimid Caliphate" && y <= 1171) return "";
    if (n === "Sasanian Empire" && y <= 651) return "";
    return NOTES[n] || "";
  }

  function selectFeature(ft, zoom) {
    state.selected = ft;
    if (zoom && ft.b[2] - ft.b[0] < 180) {
      state.userMoved = true;
      fitBounds(ft.b, 48);
    }
    renderPanel();
    draw();
  }

  function setEra(index, keepView) {
    const eras = state.catalog.eras;
    const keepName = state.selected && state.selected.n;
    state.era = (index + eras.length) % eras.length;
    const year = eras[state.era].year;
    return loadYear(year).then(() => {
      state.selected = keepName ? (state.features.find((ft) => ft.n === keepName) || null) : null;
      if (!keepView && !state.userMoved) fitWorld();
      renderPanel();
      draw();
    });
  }

  const yearCache = new Map();
  function loadYear(year) {
    if (yearCache.has(year)) {
      state.features = yearCache.get(year);
      return Promise.resolve();
    }
    return fetch("data/years/" + year + ".json").then((r) => r.json()).then((data) => {
      const features = data.features.map(prepareFeature);
      yearCache.set(year, features);
      state.features = features;
    });
  }

  function buildChips() {
    const chips = $("chips");
    chips.replaceChildren();
    state.catalog.eras.forEach((e, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "tab");
      const small = document.createElement("small");
      small.textContent = formatYear(e.year);
      btn.append(document.createTextNode(e.short), small);
      btn.addEventListener("click", () => { stopPlay(); setEra(i, true); });
      chips.append(btn);
    });
  }

  function stopPlay() {
    state.playing = false;
    clearInterval(state.timer);
    const play = $("play");
    play.textContent = "播放";
    play.setAttribute("aria-pressed", "false");
  }

  function togglePlay() {
    if (state.playing) { stopPlay(); return; }
    state.playing = true;
    const play = $("play");
    play.textContent = "暂停";
    play.setAttribute("aria-pressed", "true");
    state.timer = setInterval(() => setEra(state.era + 1, true), 1700);
  }

  function search(q) {
    const box = $("results");
    const query = q.trim().toLowerCase();
    if (!query) { box.hidden = true; box.replaceChildren(); return; }
    const hits = state.catalog.search.filter((row) => {
      return row.n.toLowerCase().indexOf(query) >= 0 || (row.z && row.z.toLowerCase().indexOf(query) >= 0);
    }).sort((a, b) => {
      const score = (row) => {
        const z = (row.z || "").toLowerCase();
        const n = row.n.toLowerCase();
        if (z === query || n === query) return 0;
        if (z.startsWith(query) || n.startsWith(query)) return 1;
        return 2;
      };
      return score(a) - score(b);
    }).slice(0, 8);
    const cityHits = CITIES.filter((c) => c.n.indexOf(q.trim()) >= 0).slice(0, 4);
    box.replaceChildren();
    if (!hits.length && !cityHits.length) {
      const empty = document.createElement("button");
      empty.type = "button";
      empty.textContent = "没有找到";
      empty.disabled = true;
      box.append(empty);
      box.hidden = false;
      return;
    }
    hits.forEach((row) => {
      const btn = document.createElement("button");
      btn.type = "button";
      const title = document.createElement("span");
      title.textContent = (row.z || row.n);
      const small = document.createElement("small");
      small.textContent = row.n + " · " + row.years.map(formatYear).slice(0, 4).join("、");
      btn.append(title, small);
      btn.addEventListener("click", () => {
        const current = era().year;
        let best = row.years[0];
        row.years.forEach((y) => { if (Math.abs(y - current) < Math.abs(best - current)) best = y; });
        const index = state.catalog.eras.findIndex((e) => e.year === best);
        box.hidden = true;
        $("q").value = "";
        setEra(index, true).then(() => {
          const ft = state.features.find((f) => f.n === row.n);
          if (ft) selectFeature(ft, true);
        });
      });
      box.append(btn);
    });
    cityHits.forEach((city) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = city.n + " · 城市";
      btn.addEventListener("click", () => {
        state.userMoved = true;
        fitBounds([city.x - 12, city.y - 8, city.x + 12, city.y + 8], 40);
        box.hidden = true;
        draw();
      });
      box.append(btn);
    });
    box.hidden = false;
  }

  function pointerPos(ev) {
    const r = canvas.getBoundingClientRect();
    return [ev.clientX - r.left, ev.clientY - r.top];
  }

  function onMove(ev) {
    const [sx, sy] = pointerPos(ev);
    if (state.drag) {
      const dx = sx - state.drag.x;
      const dy = sy - state.drag.y;
      state.cx = state.drag.cx - dx / state.scale;
      state.cy = state.drag.cy + dy / state.scale;
      state.userMoved = true;
      draw();
      return;
    }
    const p = screenToProj(sx, sy);
    const list = visibleFeatures();
    let found = null;
    for (let i = list.length - 1; i >= 0; i--) {
      if (hits(list[i], p[0], p[1])) { found = list[i]; break; }
    }
    state.hover = found;
    const tip = $("tip");
    if (!found) { tip.hidden = true; return; }
    tip.hidden = false;
    tip.textContent = labelOf(found.n) + (found.n !== labelOf(found.n) ? "  " + found.n : "");
    tip.style.left = Math.min(sx + 12, size().w - 200) + "px";
    tip.style.top = (sy + 14) + "px";
  }

  function boot() {
    Promise.all([
      fetch("data/catalog.json").then((r) => r.json()),
      fetch("data/names.json").then((r) => r.json()),
      fetch("data/land.json").then((r) => r.json())
    ]).then(([catalog, names, land]) => {
      state.catalog = catalog;
      state.names = names;
      state.land = land.g.map((poly) => poly.map((ring) => ring.map(([lon, lat]) => project(lon, lat))));
      $("source").textContent = catalog.attribution;
      buildChips();
      const params = new URLSearchParams(location.search);
      const want = Number(params.get("year"));
      let index = state.catalog.eras.findIndex((e) => e.year === 1279);
      if (!Number.isNaN(want)) {
        const exact = state.catalog.eras.findIndex((e) => e.year === want);
        if (exact >= 0) index = exact;
      }
      return setEra(index, false);
    }).catch(() => {
      $("story").textContent = "地图数据没有载入。请从网站打开这个页面，而不是直接打开文件。";
    });
  }

  $("play").addEventListener("click", togglePlay);
  $("prev").addEventListener("click", () => { stopPlay(); setEra(state.era - 1, true); });
  $("next").addEventListener("click", () => { stopPlay(); setEra(state.era + 1, true); });
  $("toggle-culture").addEventListener("change", (ev) => { state.showCulture = ev.target.checked; draw(); });
  $("toggle-cities").addEventListener("change", (ev) => { state.showCities = ev.target.checked; draw(); });
  $("q").addEventListener("input", (ev) => search(ev.target.value));
  $("views").addEventListener("click", (ev) => {
    const btn = ev.target.closest("button");
    if (!btn) return;
    [...$("views").children].forEach((b) => b.classList.toggle("active", b === btn));
    const box = VIEWS[btn.dataset.view];
    state.userMoved = btn.dataset.view !== "world";
    if (!box) fitWorld();
    else fitBounds(box, 24);
    if (btn.dataset.view === "world") state.userMoved = false;
    draw();
  });

  canvas.addEventListener("pointerdown", (ev) => {
    canvas.setPointerCapture(ev.pointerId);
    const [sx, sy] = pointerPos(ev);
    state.drag = { x: sx, y: sy, cx: state.cx, cy: state.cy, moved: false };
    canvas.classList.add("dragging");
  });
  canvas.addEventListener("pointermove", (ev) => {
    if (state.drag) {
      const [sx, sy] = pointerPos(ev);
      if (Math.hypot(sx - state.drag.x, sy - state.drag.y) > 4) state.drag.moved = true;
    }
    onMove(ev);
  });
  canvas.addEventListener("pointerup", (ev) => {
    canvas.classList.remove("dragging");
    const drag = state.drag;
    state.drag = null;
    if (drag && !drag.moved) {
      const [sx, sy] = pointerPos(ev);
      const p = screenToProj(sx, sy);
      const list = visibleFeatures();
      let found = null;
      for (let i = list.length - 1; i >= 0; i--) if (hits(list[i], p[0], p[1])) { found = list[i]; break; }
      state.selected = found;
      renderPanel();
      draw();
    }
  });
  canvas.addEventListener("pointerleave", () => { $("tip").hidden = true; });
  canvas.addEventListener("wheel", (ev) => {
    ev.preventDefault();
    const [sx, sy] = pointerPos(ev);
    const before = screenToProj(sx, sy);
    const factor = ev.deltaY < 0 ? 1.12 : 0.89;
    state.scale = Math.max(40, Math.min(1400, state.scale * factor));
    const after = screenToProj(sx, sy);
    state.cx += before[0] - after[0];
    state.cy += before[1] - after[1];
    state.userMoved = true;
    draw();
  }, { passive: false });

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", (ev) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT") {
      if (ev.key === "Escape") { $("q").value = ""; $("results").hidden = true; }
      return;
    }
    if (ev.key === "ArrowRight") { stopPlay(); setEra(state.era + 1, true); }
    else if (ev.key === "ArrowLeft") { stopPlay(); setEra(state.era - 1, true); }
    else if (ev.key === " ") { ev.preventDefault(); togglePlay(); }
    else if (ev.key === "/") { ev.preventDefault(); $("q").focus(); }
    else if (ev.key === "Escape") { state.selected = null; renderPanel(); draw(); }
  });

  resize();
  boot();
})();
