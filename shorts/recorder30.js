// Runs inside rec.html: plays a scripted 30s run of 조삼모사 and records a 1080x1920 Shorts frame + game audio.
async () => {
  const J = window.__josam, sleep = ms => new Promise(r => setTimeout(r, ms));
  await document.fonts.ready;
  J.initAudio(); window.__noBlip = 1;
  for (let i = 0; i < 60 && !J.ctx(); i++) await sleep(50);
  await sleep(600);
  const AC = J.ctx(), dest = AC.createMediaStreamDestination(); J.out().connect(dest);
  const W = 1080, H = 1920, out = document.createElement('canvas'); out.width = W; out.height = H;
  const x = out.getContext('2d'); x.imageSmoothingEnabled = false;
  const GOLD = '#d4923f', INK = '#1b1512', CREAM = '#f2e6cf', DIM = '#a8968a', LEAF = '#7fb069', RED = '#e5484d';
  let caption = ['', ''], capAt = 0, endCard = 0, pressT = -9;
  const $ = id => document.getElementById(id);
  function text(t, cx, y, size, color, font = 'Galmuri14', align = 'center', shadow = true, maxW = 1000) {
    x.font = `${size}px ${font}, sans-serif`; while (size > 20 && x.measureText(t).width > maxW) { size -= 2; x.font = `${size}px ${font}, sans-serif`; }
    x.textAlign = align; x.textBaseline = 'top';
    if (shadow) { x.fillStyle = '#000'; x.fillText(t, cx + 4, y + 4); } x.fillStyle = color; x.fillText(t, cx, y);
  }
  const acorn = (() => { const c = document.createElement('canvas'), rows = ['.kkk.', 'kccck', 'knnnk', 'knNnk', '.knk.', '..k..'], P = { k: '#2a1a12', c: '#5a3a1e', n: '#c98a3e', N: '#a46a2a' }; c.width = 5; c.height = 6; const g = c.getContext('2d'); rows.forEach((r, y) => [...r].forEach((ch, i) => { if (P[ch]) { g.fillStyle = P[ch]; g.fillRect(i, y, 1, 1); } })); return c; })();
  const t0 = performance.now();
  function frame() {
    const now = (performance.now() - t0) / 1000, S = J.S(), D = J.D();
    x.fillStyle = INK; x.fillRect(0, 0, W, H);
    x.fillStyle = '#120e0c'; x.fillRect(0, 0, W, 290); x.fillStyle = '#000'; x.fillRect(0, 290, W, 6);
    text('조삼모사', W / 2, 70, 112, GOLD);
    text('朝三暮四 · 도토리 경제', W / 2, 206, 40, DIM, 'Galmuri11', 'center', false);
    const ca = Math.min(1, (now - capAt) / 0.25); x.globalAlpha = ca;
    text(caption[0], W / 2, 336 - (1 - ca) * 20, 62, CREAM);
    if (caption[1]) text(caption[1], W / 2, 418 - (1 - ca) * 20, 44, LEAF, 'Galmuri11', 'center', false);
    x.globalAlpha = 1;
    // the official payout board
    x.fillStyle = '#271e19'; x.fillRect(60, 500, 960, 210); x.strokeStyle = '#3a2d25'; x.lineWidth = 6; x.strokeRect(63, 503, 954, 204);
    text('오늘의 도토리 지급', W / 2, 520, 34, DIM, 'Galmuri11', 'center', false);
    text($('headline').textContent, W / 2, 572, 72, CREAM, 'Galmuri14', 'center', true, 900);
    text($('fine').textContent, W / 2, 660, 32, '#7d6d62', 'Galmuri11', 'center', false);
    // stage x3
    x.fillStyle = '#000'; x.fillRect(52, 742, 976, 556); x.drawImage(J.cv, 0, 0, 320, 180, 60, 750, 960, 540);
    const lines = [...document.querySelectorAll('#ending .ln')];
    lines.forEach((l, i) => { const big = l.classList.contains('big'); x.font = `${big ? 64 : 44}px Galmuri14`; const w = Math.min(940, x.measureText(l.textContent).width + 40); x.fillStyle = 'rgba(10,8,6,.85)'; x.fillRect(W / 2 - w / 2, 772 + i * 76, w, big ? 76 : 62); text(l.textContent, W / 2, 780 + i * 76, big ? 64 : 44, big ? RED : CREAM, 'Galmuri14', 'center', true, 920); });
    // stats
    text($('cheer').textContent + ' 환호', 1020, 1330, 66, GOLD, 'Galmuri14', 'right', false);
    text('장소 · ' + ['산골', '장터', '백화점', '홈쇼핑', '증권가', '중앙은행', '우주'][D.venue], 60, 1336, 42, DIM, 'Galmuri11', 'left', false);
    text(`원숭이 ${J.fmt(D.mk)}마리 · 인턴 ${D.au}번/초`, 60, 1406, 40, LEAF, 'Galmuri11', 'left', false);
    // the acorn button
    const pd = now - pressT < 0.09 ? 8 : 0;
    x.fillStyle = '#000'; x.fillRect(196, 1500 + pd, 688, 200); x.fillStyle = GOLD; x.fillRect(200, 1504 + pd, 680, 186); x.fillStyle = '#8d5a22'; x.fillRect(200, 1690 + pd - 12, 680, 12);
    x.drawImage(acorn, 0, 0, 5, 6, 270, 1524 + pd, 100, 120);
    text('도토리 주기', 600, 1550 + pd, 64, INK, 'Galmuri14', 'center', false);
    text((S.c >= (D.happy ? 4 : 3) ? '저녁' : '아침') + ' 그릇으로 · ' + (S.c + 1) + '/7', 600, 1630 + pd, 36, '#4a3020', 'Galmuri11', 'center', false);
    if (endCard) {
      const a = Math.min(1, (now - endCard) / 0.6);
      x.fillStyle = `rgba(20,14,10,${0.88 * a})`; x.fillRect(0, 0, W, H); x.globalAlpha = a;
      text('朝三暮四', W / 2, 600, 140, GOLD);
      text('아침에 넷, 저녁에 셋.', W / 2, 820, 60, CREAM);
      text('도토리는 언제나 7개.', W / 2, 900, 60, CREAM);
      text('지금 원숭이에게 나눠 주기', W / 2, 1080, 60, LEAF);
      text('baramutzero-netizen.github.io/josammosa', W / 2, 1180, 40, CREAM, 'Galmuri11', 'center', false);
      x.globalAlpha = 1;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  const stream = out.captureStream(30); dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
  const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 12e6, audioBitsPerSecond: 192e3 });
  const chunks = []; rec.ondataavailable = e => e.data.size && chunks.push(e.data); rec.start(500);

  const setCap = (a, b = '') => { caption = [a, b]; capAt = (performance.now() - t0) / 1000; };
  const tap = () => { J.giveAcorn(false); pressT = (performance.now() - t0) / 1000; };
  const tapFor = async (ms, ps = 5) => { const end = performance.now() + ms; while (performance.now() < end) { tap(); await sleep(1000 / ps); } };
  const get = id => J.NODE[id];
  const buy = n => { if (J.S().owned[n.id]) return; J.S().cheer += n.cost; J.buy(n); };
  const nodesOf = v => J.NODES.filter(n => n.v === v && n.type !== 'venue' && n.type !== 'end');
  const buyAll = async (v, gap) => { for (const n of nodesOf(v)) { buy(n); if (gap) await sleep(gap); } };

  setCap('아침에 셋, 저녁에 넷', '원숭이들이 화가 났다');
  await tapFor(3000, 5);
  setCap('그럼 아침에 넷, 저녁에 셋!', '원숭이들이 기뻐 날뛴다');
  buy(get('josa')); await tapFor(2200, 5);
  setCap('총합은 아무도 묻지 않았다', '원숭이를 더 부르고, 인턴은 무급으로');
  { const tp = tapFor(1700, 4); await buyAll(0, 110); await tp; }
  setCap('장터에선 1+1 행사', '도토리를 반으로 쪼갰다');
  buy(get('v1')); { const tp = tapFor(2400, 4); await buyAll(1, 150); await tp; }
  setCap('백화점, 홈쇼핑, 증권가…', '포장만 바꿔서 팔았다');
  buy(get('v2')); await buyAll(2, 25); await sleep(1000);
  buy(get('v3')); await buyAll(3, 25); await sleep(1300);
  buy(get('v4')); await buyAll(4, 25); await sleep(1100);
  setCap('중앙은행은 증서를 찍고', '결국 우주까지 진출했다');
  buy(get('v5')); await buyAll(5, 25); await sleep(1200);
  buy(get('v6')); await buyAll(6, 25); await sleep(1300);
  setCap('그리고 결산의 날', '');
  window.__endK = 0.6; window.__calcK = 0.45;
  buy(get('end'));
  for (let i = 0; i < 400 && !document.querySelector('#resultBox .result'); i++) await sleep(50);
  endCard = (performance.now() - t0) / 1000;
  await sleep(3000);
  rec.stop(); await new Promise(r => rec.onstop = r);
  const buf = new Uint8Array(await new Blob(chunks, { type: mime }).arrayBuffer());
  let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  return { mime, b64: btoa(s), secs: (performance.now() - t0) / 1000, endAt: endCard };
}
