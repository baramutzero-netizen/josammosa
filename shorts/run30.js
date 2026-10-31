const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 420, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { localStorage.clear(); localStorage.setItem('josam-full-v1', JSON.stringify({ item: 'acorn' })); });
  await p.goto('file:///home/claude/josam/shorts/rec.html'); await p.waitForTimeout(800);
  await p.mouse.click(5, 5);
  const r = await p.evaluate(`(${fs.readFileSync('/home/claude/josam/shorts/recorder30.js', 'utf8')})()`);
  fs.writeFileSync('/home/claude/josam/shorts/raw30.webm', Buffer.from(r.b64, 'base64'));
  console.log(r.mime, r.secs.toFixed(1), 'end card at', r.endAt.toFixed(1), errs); await b.close();
})();
