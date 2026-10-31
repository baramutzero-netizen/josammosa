"""rec.html = the game with recording hooks (no purchase blips, faster ending, exposed audio init) + fonts covering the recorder text."""
import base64, subprocess, os, sys
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = open(os.path.join(root, 'game.src.html'), encoding='utf-8').read()
R = [
 ("else { beep(t, 1320, 0.06, 0.06); beep(t + 0.07, 1760, 0.05, 0.08); }", "else if (!window.__noBlip) { beep(t, 1320, 0.06, 0.06); beep(t + 0.07, 1760, 0.05, 0.08); }"),
 ("const sleep = ms => new Promise(r => setTimeout(r, ms));", "const sleep = ms => new Promise(r => setTimeout(r, ms * (window.__endK || 1)));"),
 ("await sleep(30); }", "await sleep(30 * (window.__calcK || 1)); }"),
 ("line(s); calcStr = '7'; await sleep(260);", "line(s); calcStr = '7'; await sleep(260 * (window.__calcK || 1));"),
 ("window.__josam = { S: () => S,", "window.__josam = { initAudio, ctx: () => AC, out: () => master, cv, S: () => S,"),
]
for a, b in R:
    assert a in src, a; src = src.replace(a, b)
extra = ''.join(open(p, encoding='utf-8').read() for p in sys.argv[1:])
chars = set(src) | set(extra) | set('0123456789만억조경해자양구간정재극항하사아승기나유타불가무량대수,.+%×÷=→▲▼#')
tmp = '/tmp/claude-0/_jr.txt'; open(tmp, 'w', encoding='utf-8').write(''.join(sorted(chars)))
css = ''
for fam in ('Galmuri14', 'Galmuri11'):
    out = f'/tmp/claude-0/_jr_{fam}.woff2'
    subprocess.run(['pyftsubset', f'/home/claude/sogwi/package/dist/{fam}.ttf', f'--text-file={tmp}', '--flavor=woff2', f'--output-file={out}'], check=True)
    css += f"@font-face{{font-family:'{fam}';src:url(data:font/woff2;base64,{base64.b64encode(open(out,'rb').read()).decode()}) format('woff2');font-display:block}}\n"
sprites = open(os.path.join(root, 'tools', 'sprites.json'), encoding='utf-8').read()
html = src.replace('/*__FONTS__*/', css).replace('/*__SPRITES__*/null', sprites)
open(os.path.join(root, 'shorts', 'rec.html'), 'w', encoding='utf-8').write('<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>' + html + '</body></html>')
print('rec ok')
