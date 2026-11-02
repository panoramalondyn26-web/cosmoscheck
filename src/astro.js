import * as A from 'astronomy-engine';
import {Solar} from 'lunar-javascript';

export const norm = x => ((x % 360) + 360) % 360;
export const signOf = lon => Math.floor(norm(lon) / 30);
export const ayanamsa = d => 23.853 + ((d.getTime() - Date.UTC(2000, 0, 1, 12)) / 31557600000) * 0.013969; // Lahiri

export function moonInfo(date, obs) {
  const angle = A.MoonPhase(date), illum = A.Illumination('Moon', date).phase_fraction;
  const nn = A.SearchMoonPhase(0, date, 40), nf = A.SearchMoonPhase(180, date, 40);
  let rise = null, set = null;
  if (obs) {
    const o = new A.Observer(obs.lat, obs.lon, 0);
    const r = A.SearchRiseSet('Moon', o, +1, date, 2), s = A.SearchRiseSet('Moon', o, -1, date, 2);
    rise = r && r.date; set = s && s.date;
  }
  let el = null, es = null;
  try { el = A.SearchLunarEclipse(date); es = A.SearchGlobalSolarEclipse(date); } catch (e) {}
  return {angle, illum, idx: Math.floor(((angle + 22.5) % 360) / 45), sign: signOf(A.EclipticGeoMoon(date).lon),
    nn: nn && nn.date, nf: nf && nf.date, rise, set,
    el: el && {d: el.peak.date, k: el.kind}, es: es && {d: es.peak.date, k: es.kind}};
}
export const phaseBucket = date => Math.floor(((A.MoonPhase(date) + 45) % 360) / 90); // 0 new,1 waxing,2 full,3 waning

export function chart(date) {
  const sun = A.SunPosition(date).elon, moon = A.EclipticGeoMoon(date).lon, ay = ayanamsa(date);
  const sm = norm(moon - ay), seg = 360 / 27;
  return {sunT: signOf(sun), moonT: signOf(moon), sunS: signOf(sun - ay), moonS: signOf(sm),
    nak: Math.floor(sm / seg), pada: Math.floor((sm % seg) / (seg / 4)) + 1, ay, moonLon: moon % 30, sunLon: sun % 30};
}
export const NAK = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];

const GAN = '甲乙丙丁戊己庚辛壬癸', ZHI = '子丑寅卯辰巳午未申酉戌亥';
export function chinese(y, m, d) {
  const l = Solar.fromYmd(y, m, d).getLunar(), g = GAN.indexOf(l.getYearGan()), z = ZHI.indexOf(l.getYearZhi());
  return {animal: z, element: Math.floor(g / 2), yang: g % 2 === 0, ly: l.getYear(), lm: l.getMonth(), ld: l.getDay()};
}

// ---- numerology ----
const PY = {}, CH = {};
'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((c, i) => PY[c] = i % 9 + 1);
Object.assign(CH, {A:1,B:2,C:3,D:4,E:5,F:8,G:3,H:5,I:1,J:1,K:2,L:3,M:4,N:5,O:7,P:8,Q:1,R:2,S:3,T:4,U:6,V:6,W:6,X:5,Y:1,Z:7});
export const clean = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'L').toUpperCase().replace(/[^A-Z]/g, '');
export function red(n) { const ch = [n]; while (n > 9 && ![11, 22, 33].includes(n)) { n = String(n).split('').reduce((a, c) => a + +c, 0); ch.push(n); } return {n, chain: ch.join(' → ')}; }
export function numerology(b, name, sys) {
  const map = sys === 'chal' ? CH : PY, out = {};
  if (b) {
    const [y, m, d] = b;
    const ry = red(y).n, rm = red(m).n, rd = red(d).n;
    out.life = red(ry + rm + rd); out.life.how = `${y}→${ry}, ${m}→${rm}, ${d}→${rd}`; out.bday = red(d);
  }
  const L = clean(name);
  if (L) {
    const cs = L.split('').filter(c => !'AEIOU'.includes(c));
    const sum = arr => red(arr.reduce((a, c) => a + map[c], 0));
    out.expr = sum(L.split('')); out.soul = sum(L.split('').filter(c => 'AEIOU'.includes(c))); out.pers = sum(cs);
  }
  return out;
}
export function personal(b, y, m, d) {
  const py = red(red(b[1]).n + red(b[2]).n + red(y).n).n, pm = red(py + m).n, pd = red(pm + d).n;
  return {py, pm, pd};
}

// ---- biorhythms ----
export const BIO = [['phys', 23], ['emo', 28], ['int', 33]];
export const bio = (b, y, m, d, off = 0) => {
  const days = Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(b[0], b[1] - 1, b[2])) / 86400000) + off;
  return BIO.map(([k, p]) => ({k, v: Math.sin(2 * Math.PI * days / p) * 100, days}));
};
export const spark = (b, y, m, d, p) => Array.from({length: 22}, (_, i) => {
  const v = Math.sin(2 * Math.PI * (Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(b[0], b[1] - 1, b[2])) / 86400000) + i - 7) / p);
  return '▁▂▃▄▅▆▇█'[Math.round((v + 1) / 2 * 7)];
}).join('');

// ---- gematria ----
const HEB = {א:1,ב:2,ג:3,ד:4,ה:5,ו:6,ז:7,ח:8,ט:9,י:10,כ:20,ך:20,ל:30,מ:40,ם:40,נ:50,ן:50,ס:60,ע:70,פ:80,ף:80,צ:90,ץ:90,ק:100,ר:200,ש:300,ת:400};
const STD = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:10,K:20,L:30,M:40,N:50,O:60,P:70,Q:80,R:90,S:100,T:200,U:300,V:400,W:500,X:600,Y:700,Z:800};
export function gematria(text) {
  const heb = [...String(text || '')].filter(c => HEB[c]).reduce((a, c) => a + HEB[c], 0);
  const L = clean(text).split('');
  return {heb, ord: L.reduce((a, c) => a + c.charCodeAt(0) - 64, 0), std: L.reduce((a, c) => a + STD[c], 0)};
}

// ---- Maya (GMT correlation 584283) ----
export const TZ = ['Imix','Ik','Akbal','Kan','Chikchan','Kimi','Manik','Lamat','Muluk','Ok','Chuwen','Eb','Ben','Ix','Men','Kib','Kaban','Etznab','Kawak','Ajaw'];
export const HAAB = ['Pop','Wo','Sip','Sotz','Sek','Xul','Yaxkin','Mol','Chen','Yax','Sak','Keh','Mak','Kankin','Muwan','Pax','Kayab','Kumku','Wayeb'];
export function maya(y, m, d) {
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
  const jdn = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  const days = jdn - 584283, pos = (((days + 348) % 365) + 365) % 365;
  const lc = []; let r = days; for (const u of [144000, 7200, 360, 20, 1]) { lc.push(Math.floor(r / u)); r -= lc[lc.length - 1] * u; }
  return {num: (((days + 3) % 13) + 13) % 13 + 1, sign: (((days + 19) % 20) + 20) % 20, hd: pos % 20, hm: Math.floor(pos / 20), lc: lc.join('.')};
}

// ---- Inca (month names after Guaman Poma, c. 1615, mapped to Gregorian months – sources differ) ----
export const INKA = ['Kamay Killa','Hatun Puquy','Pacha Puquy','Inka Raymi','Aymuray','Inti Raymi','Chakra Kunakuy','Chakra Yapuy','Quya Raymi','Uma Raymi','Aya Marqay','Qhapaq Raymi'];
export function inca(y, m, d) {
  const t = Date.UTC(y, m - 1, d, 12), day = 86400000, sol = [];
  for (const yy of [y - 1, y, y + 1]) { const q = A.Seasons(yy); sol.push([0, q.jun_solstice.date.getTime()], [1, q.dec_solstice.date.getTime()]); }
  const prev = sol.filter(x => x[1] <= t).pop(), next = sol.find(x => x[1] > t);
  return {month: m - 1, prev: {k: prev[0], days: Math.floor((t - prev[1]) / day)}, next: {k: next[0], days: Math.ceil((next[1] - t) / day)}};
}

// ---- lucky days (Vedic Chandra Bala + Tara Bala), planetary hours, Rahu Kalam, Abhijit ----
export const TARA = ['Janma','Sampat','Vipat','Kshema','Pratyak','Sadhana','Naidhana','Mitra','Parama Mitra'];
export const moonIdx = date => Math.floor(((A.MoonPhase(date) + 22.5) % 360) / 45);
export function dayScore(natal, date) {
  const c = chart(date), h = ((c.moonS - natal.moonS + 12) % 12) + 1, n = ((c.nak - natal.nak + 27) % 27) + 1, t = n % 9 || 9;
  return {score: ([1, 3, 6, 7, 10, 11].includes(h) ? 1 : 0) + ([2, 4, 6, 8, 9].includes(t) ? 1 : 0), h, t: t - 1};
}
const DAY = [3, 6, 2, 5, 1, 4, 0]; // Chaldean index (Saturn,Jupiter,Mars,Sun,Venus,Mercury,Moon) of the day ruler, Sun..Sat
export function hours(y, m, d, lat, lon) {
  const o = new A.Observer(lat, lon, 0), wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const rs = (dir, from) => { const r = A.SearchRiseSet('Sun', o, dir, from, 1.5); return r && r.date; };
  const rise = rs(+1, new Date(Date.UTC(y, m - 1, d) - lon / 15 * 3600000)); if (!rise) return null;
  const set = rs(-1, rise); if (!set) return null; const next = rs(+1, set); if (!next) return null;
  const dl = (set - rise) / 12, nl = (next - set) / 12, hrs = [];
  for (let k = 0; k < 24; k++) { const day = k < 12, f = day ? rise.getTime() + k * dl : set.getTime() + (k - 12) * nl;
    hrs.push({from: new Date(f), to: new Date(f + (day ? dl : nl)), ruler: (DAY[wd] + k) % 7, night: !day}); }
  const p8 = (set - rise) / 8, rp = [7, 1, 6, 4, 5, 3, 2][wd], p15 = (set - rise) / 15;
  return {rise, set, hrs, rahu: {from: new Date(rise.getTime() + rp * p8), to: new Date(rise.getTime() + (rp + 1) * p8)},
    abh: {from: new Date(rise.getTime() + 7 * p15), to: new Date(rise.getTime() + 8 * p15)}};
}

// ---- astrocartography (traditional planetary lines) ----
export const BODIES = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];
const WT = {Sun: 2, Moon: 1, Mercury: 1, Venus: 3, Mars: -2, Jupiter: 3, Saturn: -3, Uranus: -1, Neptune: -1, Pluto: -2};
export function lines(inst) {
  const o = new A.Observer(0, 0, 0), gm = A.SiderealTime(inst);
  return BODIES.map(b => { const e = A.Equator(b, inst, o, true, true); return {b, ra: e.ra, dec: e.dec, gm}; });
}
export function placeScore(L, lat, lon) {
  const out = []; let score = 0;
  for (const p of L) {
    const H = ((((p.gm + lon / 15) % 24 - p.ra) % 24) + 24) % 24 * 15, tg = [['MC', 0], ['IC', 180]];
    const c = -Math.tan(lat * Math.PI / 180) * Math.tan(p.dec * Math.PI / 180);
    if (Math.abs(c) <= 1) { const h0 = Math.acos(c) * 180 / Math.PI; tg.push(['DSC', h0], ['ASC', 360 - h0]); }
    for (const [a, t] of tg) { const d = Math.abs(((H - t + 540) % 360) - 180); if (d < 5) { score += WT[p.b] * (1 - d / 5); out.push({b: p.b, a, d}); } }
  }
  return {score, out};
}
export const CITIES = 'London,GB,51.51,-0.13;Manchester,GB,53.48,-2.24;Edinburgh,GB,55.95,-3.19;Dublin,IE,53.35,-6.26;Warsaw,PL,52.23,21.01;Krakow,PL,50.06,19.94;Gdansk,PL,54.35,18.65;Wroclaw,PL,51.11,17.04;Berlin,DE,52.52,13.41;Paris,FR,48.86,2.35;Madrid,ES,40.42,-3.70;Barcelona,ES,41.39,2.17;Lisbon,PT,38.72,-9.14;Rome,IT,41.90,12.50;Milan,IT,45.46,9.19;Amsterdam,NL,52.37,4.90;Brussels,BE,50.85,4.35;Vienna,AT,48.21,16.37;Prague,CZ,50.08,14.44;Budapest,HU,47.50,19.04;Zurich,CH,47.38,8.54;Copenhagen,DK,55.68,12.57;Stockholm,SE,59.33,18.07;Oslo,NO,59.91,10.75;Helsinki,FI,60.17,24.94;Athens,GR,37.98,23.73;Istanbul,TR,41.01,28.98;Reykjavik,IS,64.15,-21.94;Dubai,AE,25.20,55.27;Tel Aviv,IL,32.09,34.78;Cairo,EG,30.04,31.24;Marrakech,MA,31.63,-8.01;Lagos,NG,6.52,3.38;Nairobi,KE,-1.29,36.82;Cape Town,ZA,-33.92,18.42;Mumbai,IN,19.08,72.88;Delhi,IN,28.61,77.21;Bangkok,TH,13.76,100.50;Singapore,SG,1.35,103.82;Hong Kong,HK,22.32,114.17;Shanghai,CN,31.23,121.47;Beijing,CN,39.90,116.41;Tokyo,JP,35.68,139.69;Seoul,KR,37.57,126.98;Bali,ID,-8.65,115.22;Sydney,AU,-33.87,151.21;Melbourne,AU,-37.81,144.96;Auckland,NZ,-36.85,174.76;New York,US,40.71,-74.01;Boston,US,42.36,-71.06;Washington,US,38.91,-77.04;Miami,US,25.76,-80.19;Chicago,US,41.88,-87.63;Toronto,CA,43.65,-79.38;Vancouver,CA,49.28,-123.12;San Francisco,US,37.77,-122.42;Los Angeles,US,34.05,-118.24;Honolulu,US,21.31,-157.86;Mexico City,MX,19.43,-99.13;Rio de Janeiro,BR,-22.91,-43.17;Sao Paulo,BR,-23.55,-46.63;Buenos Aires,AR,-34.60,-58.38;Santiago,CL,-33.45,-70.67;Lima,PE,-12.05,-77.04'.split(';').map(s => { const a = s.split(','); return [a[0], a[1], +a[2], +a[3]]; });
export function places(inst) {
  const L = lines(inst), r = CITIES.map(([n, c, la, lo]) => ({n, c, ...placeScore(L, la, lo)})).sort((a, b) => b.score - a.score);
  return {L, top: r.slice(0, 8), low: [...r].reverse().slice(0, 5)};
}
