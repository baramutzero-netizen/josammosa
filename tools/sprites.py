"""Pixel sprites for 조삼모사 — single source of truth.
Writes sprites.json (embedded into the game) and exports .aseprite + .png into ../assets/."""
import json, os
from PIL import Image
from aseprite import write_aseprite

PAL = {
    'k': '#2a1a12', 'b': '#8a5a34', 'f': '#efc49a', 'r': '#e2765a', 'e': '#1b1418', 'm': '#8b2b2b',
    'w': '#f1ece0', 'W': '#cfc6b4', 'g': '#4c6b8a', 'G': '#3a5370', 'o': '#7a4a22', 'O': '#a0683a',
    'c': '#5a3a1e', 'n': '#c98a3e', 'N': '#a46a2a', 'S': '#e8dcc0', 'R': '#d9443a', 'y': '#f3c34f',
    'q': '#c9d7b0', 's': '#9aa3ad',
}
SPR = {
    'monkey_happy': ['...kkkkkk...', '..kbbbbbbk..', '.kbbbbbbbbk.', 'kkbffbbffbkk', 'kfbfeffefbfk', 'kfbffffffbfk',
                     '.kbmffffmbk.', '..kbmmmmbk..', '..kbbbbbbk..', '.kbbffffbbk.', '.kbkffffkbk.', '..k.kkkk.k..'],
    'monkey_angry': ['...kkkkkk...', '..kbbbbbbk..', '.kbbbbbbbbk.', 'kkbrkbbkrbkk', 'krbrerrerbrk', 'krbrrrrrrbrk',
                     '.kbrrmmrrbk.', '..kbmrrmbk..', '..kbbbbbbk..', '.kbbffffbbk.', '.kbkffffkbk.', '..k.kkkk.k..'],
    'jeogong': ['......kkkk......', '.....kwwwwk.....', '....kkwwwwkk....', '...kwwwwwwwwk...', '...kffffffffk...',
                '...kfeffffefk...', '...kffffffffk...', '...kfwffffwfk...', '....kwwwwwwk....', '....kwwwwwwk....',
                '...kgkwwwwkgk...', '..kgggkwwkgggk..', '.kggggGkkGggggk.', '.kgggggGGgggggk.', '.kggggggggggggk.',
                '.kgggggGGgggggk.', '.kggggggggggggk.', 'kggggggggggggggk', 'kGGGGGGGGGGGGGGk', '.kkkkkkkkkkkkkk.'],
    'bowl': ['kkkkkkkkkkkkkkkkkk', 'kOOOOOOOOOOOOOOOOk', '.kooooooooooooook.', '..kooooooooooook..', '...kkkkkkkkkkkk...'],
    'acorn': ['.kkk.', 'kccck', 'knnnk', 'knNnk', '.knk.', '..k..'],
    'rice': ['.kk.', 'kwwk', 'kwwk', 'kwwk', 'kWwk', '.kk.'],
    'sack': ['...kkkk...', '..kSSSSk..', '...kSSk...', '..kSSSSk..', '.kSSSSSSk.', 'kSSSSSSSSk', 'kSRRRRRRSk',
             'kSSSSSSSSk', 'kSSSSSSSSk', '.kSSSSSSk.', '..kkkkkk..'],
    'drum': ['.kkkkkk.', 'kwwwwwwk', 'kWWWWWWk', 'kRRyyRRk', 'kRRRRRRk', 'kRyRRyRk', 'kRRRRRRk', '.kkkkkk.'],
    'flag': ['kkkkkkk.', 'kyyyyyyk', 'kyyyyyyk', 'kkkkkkk.', 'k.......', 'k.......', 'k.......', 'k.......', 'k.......', 'k.......'],
    'calc': ['kkkkkkkk', 'kqqqqqqk', 'kqqqqqqk', 'kkkkkkkk', 'kskskskk', 'kkkkkkkk', 'kskskskk', 'kkkkkkkk'],
}
# monkey breeds = palette swaps of the same body
KINDS = {
    'base':   {},
    'macaque': {'b': '#b8a890', 'f': '#ec8f8f'},   # 일본원숭이
    'gorilla': {'b': '#3a3a42', 'f': '#77707c'},
    'orang':  {'b': '#c0602a', 'f': '#e8a070'},
    'white':  {'b': '#d8d2c6', 'f': '#f2c9b0'},
    'golden': {'b': '#e0a030', 'f': '#9ab4e0'},   # 황금들창코원숭이
    'space':  {'b': '#8a5a34'},                    # helmet drawn in code
    'chimp':  {'b': '#3a2a24', 'f': '#c9a080'},   # 쌀숭이/도숭이 — sack drawn in code
    'wukong': {'b': '#c8862e', 'f': '#f2c79a'},   # 제천대성 (서유기) — headband and cloud drawn in code
}

def img(name, swap=None):
    rows = SPR[name]; im = Image.new('RGBA', (len(rows[0]), len(rows)))
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch == '.': continue
            h = (swap or {}).get(ch) or PAL[ch]
            im.putpixel((x, y), tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) + (255,))
    return im

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    json.dump({'pal': PAL, 'spr': SPR, 'kinds': KINDS}, open(os.path.join(here, 'sprites.json'), 'w'), ensure_ascii=False)
    out = os.path.join(here, '..', 'assets'); os.makedirs(out + '/aseprite', exist_ok=True); os.makedirs(out + '/png', exist_ok=True)
    pal = [tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) + (255,) for h in PAL.values()]
    for n in SPR:
        if n.startswith('monkey'): continue
        im = img(n); write_aseprite(f'{out}/aseprite/{n}.aseprite', [im], palette=pal)
        im.resize((im.width * 4, im.height * 4), Image.NEAREST).save(f'{out}/png/{n}_x4.png')
    # monkeys: one file, frames = breeds, tags = happy/angry
    frames, tags = [], []
    for mood in ('happy', 'angry'):
        start = len(frames)
        for k, sw in KINDS.items(): frames.append(img('monkey_' + mood, sw))
        tags.append((mood, start, len(frames) - 1))
    write_aseprite(f'{out}/aseprite/monkey.aseprite', frames, [200] * len(frames), tags, pal)
    sheet = Image.new('RGBA', (12 * len(frames), 12))
    for i, f in enumerate(frames): sheet.paste(f, (12 * i, 0))
    sheet.resize((sheet.width * 4, 48), Image.NEAREST).save(f'{out}/png/monkey_sheet_x4.png')
    # jeogong turning into a monkey (ending)
    write_aseprite(f'{out}/aseprite/jeogong_reveal.aseprite', [img('jeogong'), img('jeogong', {'w': PAL['b']})], [600, 600], [('reveal', 0, 1)], pal)
    print('sprites ok', len(SPR), 'sprites,', len(frames), 'monkey frames')
