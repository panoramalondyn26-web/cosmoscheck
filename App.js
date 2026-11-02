import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, Platform, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {S, N} from './src/i18n';
import * as X from './src/astro';

function useStored(key, init) {
  const [v, setV] = useState(init); const ready = useRef(false);
  useEffect(() => { AsyncStorage.getItem(key).then(r => { if (r) setV({...init, ...JSON.parse(r)}); ready.current = true; }); }, []);
  useEffect(() => { if (ready.current) AsyncStorage.setItem(key, JSON.stringify(v)); }, [v]);
  return [v, setV];
}
const pd = s => { const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec((s || '').trim()); return m ? [+m[1], +m[2], +m[3]] : null; };
const pt = s => { const m = /^(\d{1,2}):(\d{2})$/.exec((s || '').trim()); return m ? [+m[1], +m[2]] : null; };
const iso = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
function offsetAt(tz, y, m, d, h, mi) {
  try {
    const u = Date.UTC(y, m - 1, d, h, mi), p = {};
    new Intl.DateTimeFormat('en-US', {timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'})
      .formatToParts(new Date(u)).forEach(x => p[x.type] = +x.value);
    return (Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - u) / 3600000;
  } catch (e) { return null; }
}
const Sec = ({t, children}) => <View style={s.card}><Text style={s.h}>{t}</Text>{children}</View>;
const R = ({k, v, n}) => <View style={s.row}><Text style={s.k}>{k}</Text><View style={{flex: 1, alignItems: 'flex-end'}}><Text style={s.v}>{v}</Text>{n ? <Text style={s.n}>{n}</Text> : null}</View></View>;
const Chip = ({t, on, sel}) => <TouchableOpacity onPress={on} style={[s.chip, sel && s.chipOn]}><Text style={{color: sel ? '#0d1226' : '#e9ecff'}}>{t}</Text></TouchableOpacity>;
const Amer = ({T, Nm, my, ic}) => {
  const [w, setW] = useState(0);
  return (
    <Sec t={w ? '☀️ ' + T.inca : '🗿 ' + T.maya}>
      <View style={{flexDirection: 'row', gap: 8, marginBottom: 8}}><Chip t={'🗿 ' + T.mayaT} sel={!w} on={() => setW(0)} /><Chip t={'☀️ ' + T.incaT} sel={!!w} on={() => setW(1)} /></View>
      {!w ? <View><R k={T.tz} v={`${my.num} ${X.TZ[my.sign]}`} /><R k={T.haab} v={`${my.hd} ${X.HAAB[my.hm]}`} /><R k={T.lc} v={my.lc} /></View> : <View>
        <R k={T.imonth} v={X.INKA[ic.month]} n={Nm.incaM[ic.month]} />
        <R k={T.isunP} v={Nm.sol[ic.prev.k]} n={`${ic.prev.days} ${T.ago}`} /><R k={T.isunN} v={Nm.sol[ic.next.k]} n={`${T.inD} ${ic.next.days} ${T.dd}`} />
        <Text style={[s.n, {marginTop: 6}]}>{Nm.dark}</Text><Text style={[s.n, {marginTop: 6}]}>{T.incaNote}</Text>
      </View>}
    </Sec>
  );
};
const signTxt = (Nm, i, lon) => `${Nm.signs[i]}${lon != null ? ' ' + lon.toFixed(0) + '°' : ''}`;
const westTxt = (Nm, i) => `${Nm.signs[i]} · ${Nm.el[i % 4]} · ${Nm.mod[i % 3]}`;

function Today({T, Nm, set, p}) {
  const now = new Date();
  const [dt, setDt] = useState({y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate()});
  const date = useMemo(() => new Date(Date.UTC(dt.y, dt.m - 1, dt.d, 12)), [dt]);
  const mi = useMemo(() => X.moonInfo(date, p.lat != null ? {lat: p.lat, lon: p.lon} : null), [date, p.lat, p.lon]);
  const ch = useMemo(() => X.chart(date), [date]);
  const cn = X.chinese(dt.y, dt.m, dt.d), my = X.maya(dt.y, dt.m, dt.d), b = pd(p.bdate);
  const loc = set.lang === 'pl' ? 'pl-PL' : 'en-GB';
  const fd = (x, y) => x ? x.toLocaleString(loc, y ? {day: 'numeric', month: 'short', year: 'numeric'} : {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'}) : '–';
  const shift = n => { const u = new Date(Date.UTC(dt.y, dt.m - 1, dt.d + n)); setDt({y: u.getUTCFullYear(), m: u.getUTCMonth() + 1, d: u.getUTCDate()}); };
  const pn = b ? X.personal(b, dt.y, dt.m, dt.d) : null, bi = b ? X.bio(b, dt.y, dt.m, dt.d) : null;
  return (
    <ScrollView contentContainerStyle={{padding: 14}}>
      <View style={s.nav}>
        <Chip t="◀" on={() => shift(-1)} /><Text style={s.date}>{iso(dt.y, dt.m, dt.d)}</Text><Chip t="▶" on={() => shift(1)} />
        <Chip t={T.up} on={() => setDt({y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate()})} />
      </View>
      <Sec t={'🌙 ' + T.moon}>
        <R k={T.moon} v={Nm.ph[mi.idx]} n={`${T.illum} ${(mi.illum * 100).toFixed(0)}%`} />
        <R k={T.msign} v={Nm.signs[mi.sign]} />
        <R k={T.nnew} v={fd(mi.nn)} /><R k={T.nfull} v={fd(mi.nf)} />
        {p.lat != null && <R k={T.rise} v={fd(mi.rise)} />}{p.lat != null && <R k={T.set} v={fd(mi.set)} />}
        <R k={T.elL} v={mi.el ? fd(mi.el.d, 1) : '–'} n={mi.el ? Nm.ek[mi.el.k] || mi.el.k : ''} />
        <R k={T.elS} v={mi.es ? fd(mi.es.d, 1) : '–'} n={mi.es ? Nm.ek[mi.es.k] || mi.es.k : ''} />
      </Sec>
      <Sec t={'♈ ' + T.west}><R k={T.sun} v={westTxt(Nm, ch.sunT)} /><R k={T.msign} v={westTxt(Nm, ch.moonT)} /></Sec>
      <Sec t={'🕉 ' + T.vedic}>
        <R k={T.ssun} v={Nm.signs[ch.sunS]} /><R k={T.smoon} v={Nm.signs[ch.moonS]} />
        <R k={T.nak} v={X.NAK[ch.nak]} n={`pada ${ch.pada}`} /><R k={T.ay} v={ch.ay.toFixed(2) + '°'} />
      </Sec>
      <Sec t={'🐉 ' + T.cn}>
        <R k={T.animal} v={Nm.ani[cn.animal]} n={`${Nm.cel[cn.element]} · ${Nm.yy[cn.yang ? 1 : 0]}`} />
        <R k={T.lunar} v={`${cn.ly}-${Math.abs(cn.lm)}-${cn.ld}`} />
      </Sec>
      <Amer T={T} Nm={Nm} my={my} ic={X.inca(dt.y, dt.m, dt.d)} />
      <Sec t={'🔢 ' + T.num + ' / ' + T.bio}>
        {b ? <View>
          <R k={T.pyear} v={pn.py} /><R k={T.pday} v={pn.pd} />
          {bi.map((x, i) => <R key={x.k} k={T[x.k === 'int' ? 'intel' : x.k]} v={`${x.v.toFixed(0)}%`} n={X.spark(b, dt.y, dt.m, dt.d, X.BIO[i][1])} />)}
        </View> : <Text style={s.n}>{T.needBirth}</Text>}
      </Sec>
    </ScrollView>
  );
}

function Me({T, Nm, set, p, setP}) {
  const [f, setF] = useState(p); const [busy, setBusy] = useState(false);
  useEffect(() => setF(p), [p]);
  const up = (k, v) => setF(o => ({...o, [k]: v}));
  async function find() {
    if (!f.place.trim()) return; setBusy(true);
    try {
      const r = await (await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&format=json&name=' + encodeURIComponent(f.place))).json();
      const g = r.results && r.results[0]; if (!g) throw new Error('not found');
      const b = pd(f.bdate), t = pt(f.btime), off = b ? offsetAt(g.timezone, b[0], b[1], b[2], t ? t[0] : 12, t ? t[1] : 0) : null;
      setF(o => ({...o, lat: g.latitude, lon: g.longitude, tz: g.timezone, place: `${g.name}, ${g.country || ''}`, off: off != null ? off : o.off}));
    } catch (e) { Alert.alert('Place', String(e.message || e)); }
    setBusy(false);
  }
  const b = pd(p.bdate), tm = pt(p.btime), now = new Date();
  const inst = b ? new Date(Date.UTC(b[0], b[1] - 1, b[2], tm ? tm[0] : 12, tm ? tm[1] : 0) - (tm ? (+p.off || 0) * 3600000 : 0)) : null;
  const ch = inst ? X.chart(inst) : null, cn = b ? X.chinese(b[0], b[1], b[2]) : null, my = b ? X.maya(b[0], b[1], b[2]) : null;
  const nu = X.numerology(b, p.name, set.sys), gm = X.gematria(p.name);
  const bi = b ? X.bio(b, now.getFullYear(), now.getMonth() + 1, now.getDate()) : null;
  const In = (k, label, kb) => (<View style={{marginBottom: 8}}><Text style={s.n}>{label}</Text><TextInput style={s.in} value={String(f[k] ?? '')} keyboardType={kb} placeholderTextColor="#667" onChangeText={v => up(k, k === 'off' ? v.replace(',', '.') : v)} /></View>);
  return (
    <ScrollView contentContainerStyle={{padding: 14}} keyboardShouldPersistTaps="handled">
      <Sec t={'👤 ' + T.me}>
        {In('name', T.name)}{In('bdate', T.bdate, 'numbers-and-punctuation')}{In('btime', T.btime, 'numbers-and-punctuation')}{In('place', T.bplace)}
        <TouchableOpacity style={s.btn} onPress={find}><Text style={s.btnT}>{busy ? '…' : T.find}</Text></TouchableOpacity>
        {In('off', T.utc, 'numbers-and-punctuation')}
        <TouchableOpacity style={s.btn} onPress={() => { setP({...f, off: parseFloat(f.off) || 0}); Alert.alert(T.saved); }}><Text style={s.btnT}>{T.save}</Text></TouchableOpacity>
        <Text style={s.n}>Geocoding: Open-Meteo.com</Text>
      </Sec>
      {!b ? <Text style={s.n}>{T.needBirth}</Text> : <View>
        <Sec t={'♈ ' + T.west}>
          <R k={T.sun} v={westTxt(Nm, ch.sunT)} /><R k={T.msign} v={westTxt(Nm, ch.moonT)} n={tm ? '' : T.needTime} />
        </Sec>
        <Sec t={'🕉 ' + T.vedic}>
          <R k={T.ssun} v={Nm.signs[ch.sunS]} /><R k={T.smoon} v={Nm.signs[ch.moonS]} n={tm ? '' : T.needTime} /><R k={T.nak} v={X.NAK[ch.nak]} n={`pada ${ch.pada}`} />
        </Sec>
        <Sec t={'🐉 ' + T.cn}><R k={T.animal} v={Nm.ani[cn.animal]} n={`${Nm.cel[cn.element]} · ${Nm.yy[cn.yang ? 1 : 0]}`} /></Sec>
        <Sec t={'🔢 ' + T.num}>
          <R k={T.life} v={nu.life.n} n={`${T.how}: ${nu.life.how}; ${nu.life.chain}`} /><R k={T.bday} v={nu.bday.n} n={nu.bday.chain} />
          {nu.expr && <View><R k={T.expr} v={nu.expr.n} n={nu.expr.chain} /><R k={T.soul} v={nu.soul.n} n={nu.soul.chain} /><R k={T.pers} v={nu.pers.n} n={nu.pers.chain} /></View>}
        </Sec>
        <Sec t={'📈 ' + T.bio}>
          {bi.map((x, i) => <R key={x.k} k={T[x.k === 'int' ? 'intel' : x.k]} v={`${x.v.toFixed(0)}%`} n={X.spark(b, now.getFullYear(), now.getMonth() + 1, now.getDate(), X.BIO[i][1])} />)}
        </Sec>
        <Amer T={T} Nm={Nm} my={my} ic={X.inca(b[0], b[1], b[2])} />
      </View>}
      {p.name ? <Sec t={'✡ ' + T.gem}><R k={T.heb} v={gm.heb} /><R k={T.ord} v={gm.ord} /><R k={T.std} v={gm.std} /></Sec> : null}
    </ScrollView>
  );
}

function Journal({T, Nm}) {
  const [list, setList] = useStored('cc-journal', {items: []});
  const now = new Date(), today = iso(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const [mood, setMood] = useState(3), [energy, setEnergy] = useState(3), [sleep, setSleep] = useState('');
  const save = () => setList({items: [{date: today, mood, energy, sleep: parseFloat(sleep) || null}, ...list.items.filter(x => x.date !== today)]});
  const bk = [0, 1, 2, 3].map(i => { const a = list.items.filter(x => X.phaseBucket(new Date(x.date + 'T12:00:00Z')) === i); return {n: a.length, m: a.length ? a.reduce((t, x) => t + x.mood, 0) / a.length : null}; });
  return (
    <ScrollView contentContainerStyle={{padding: 14}}>
      <Sec t={'📓 ' + today}>
        <Text style={s.n}>{T.mood}</Text><View style={s.nav}>{[1, 2, 3, 4, 5].map(i => <Chip key={i} t={String(i)} sel={mood === i} on={() => setMood(i)} />)}</View>
        <Text style={s.n}>{T.energy}</Text><View style={s.nav}>{[1, 2, 3, 4, 5].map(i => <Chip key={i} t={String(i)} sel={energy === i} on={() => setEnergy(i)} />)}</View>
        <Text style={s.n}>{T.sleep}</Text><TextInput style={s.in} value={sleep} onChangeText={setSleep} keyboardType="numeric" />
        <TouchableOpacity style={s.btn} onPress={save}><Text style={s.btnT}>{T.add}</Text></TouchableOpacity>
      </Sec>
      <Sec t={'🌙 ' + T.avg}>
        {bk.map((x, i) => <R key={i} k={T.nphase[i]} v={x.m != null ? x.m.toFixed(1) : '–'} n={`${T.entries}: ${x.n}`} />)}
        {list.items.length < 14 && <Text style={s.n}>{T.few} ({list.items.length}/14)</Text>}
      </Sec>
      <Sec t={T.entries}>{list.items.slice(0, 14).map(x => <R key={x.date} k={x.date} v={`${T.mood} ${x.mood} · ${T.energy} ${x.energy}`} n={x.sleep ? `${T.sleep}: ${x.sleep}` : ''} />)}</Sec>
    </ScrollView>
  );
}

const tm_ = (x, loc) => x.toLocaleTimeString(loc, {hour: '2-digit', minute: '2-digit'});
const GOODH = [1, 5, 3, 4]; // Jupiter, Mercury, Sun, Venus (Chaldean idx)
function Plan({T, Nm, set, p}) {
  const b = pd(p.bdate), tm = pt(p.btime), now = new Date(), loc = set.lang === 'pl' ? 'pl-PL' : 'en-GB';
  const [sel, setSel] = useState(iso(now.getFullYear(), now.getMonth() + 1, now.getDate()));
  const natal = useMemo(() => b ? X.chart(new Date(Date.UTC(b[0], b[1] - 1, b[2], tm ? tm[0] : 12, tm ? tm[1] : 0) - (tm ? (+p.off || 0) * 3600000 : 0))) : null, [p.bdate, p.btime, p.off]);
  const days = useMemo(() => natal ? Array.from({length: 14}, (_, i) => { const u = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + i, 12));
    return {iso: iso(u.getUTCFullYear(), u.getUTCMonth() + 1, u.getUTCDate()), ...X.dayScore(natal, u), ph: X.moonIdx(u)}; }) : [], [natal]);
  const s3 = pd(sel), lat = p.lat != null ? p.lat : 51.5074, lon = p.lon != null ? p.lon : -0.1278;
  const hr = useMemo(() => s3 ? X.hours(s3[0], s3[1], s3[2], lat, lon) : null, [sel, lat, lon]);
  const dot = x => x === 2 ? '🟢' : x === 1 ? '🟡' : '🔴', lab = x => x === 2 ? T.fav : x === 1 ? T.mix : T.hard;
  const inR = (h, r) => h.from < r.to && h.to > r.from;
  return (
    <ScrollView contentContainerStyle={{padding: 14}}>
      <Sec t={'📅 ' + T.ldays}>
        {!natal ? <Text style={s.n}>{T.needBirth}</Text> : days.map(x => (
          <TouchableOpacity key={x.iso} onPress={() => setSel(x.iso)}>
            <R k={`${dot(x.score)} ${x.iso}${x.iso === sel ? ' ◀' : ''}`} v={lab(x.score)} n={`${Nm.ph[x.ph]} · ${X.TARA[x.t]} · ${x.h}`} />
          </TouchableOpacity>))}
        {natal && !tm ? <Text style={s.n}>{T.needTime}</Text> : null}
      </Sec>
      <Sec t={'⏰ ' + T.hrsFor + ' ' + sel}>
        {p.lat == null ? <Text style={s.n}>{T.where}: London</Text> : <Text style={s.n}>{T.where}: {p.place}</Text>}
        {!hr ? <Text style={s.n}>–</Text> : <View>
          <R k={T.sunriseSet} v={`${tm_(hr.rise, loc)} / ${tm_(hr.set, loc)}`} />
          <R k={T.rahu} v={`${tm_(hr.rahu.from, loc)}–${tm_(hr.rahu.to, loc)}`} />
          <R k={T.abh} v={`${tm_(hr.abh.from, loc)}–${tm_(hr.abh.to, loc)}`} />
          <Text style={[s.h, {marginTop: 10}]}>{T.errands}</Text>
          {hr.hrs.filter(h => !h.night).map((h, i) => { const good = GOODH.includes(h.ruler) && !inR(h, hr.rahu);
            return <R key={i} k={`${good ? '✅' : '▫️'} ${tm_(h.from, loc)}–${tm_(h.to, loc)}`} v={Nm.ch7[h.ruler]} n={Nm.use[h.ruler]} />; })}
        </View>}
      </Sec>
      <Text style={s.n}>{T.about}</Text>
    </ScrollView>
  );
}

function Places({T, Nm, set, p}) {
  const b = pd(p.bdate), tm = pt(p.btime), [q, setQ] = useState(''), [chk, setChk] = useState(null);
  const res = useMemo(() => b ? X.places(new Date(Date.UTC(b[0], b[1] - 1, b[2], tm ? tm[0] : 12, tm ? tm[1] : 0) - (tm ? (+p.off || 0) * 3600000 : 0))) : null, [p.bdate, p.btime, p.off]);
  const ln = o => o.length ? o.map(x => `${Nm.bod[X.BODIES.indexOf(x.b)]} ${x.a}`).join(', ') : T.none;
  async function check() {
    if (!q.trim() || !res) return;
    try {
      const r = await (await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&format=json&name=' + encodeURIComponent(q))).json();
      const g = r.results && r.results[0]; if (!g) throw new Error('not found');
      setChk({n: `${g.name}, ${g.country || ''}`, ...X.placeScore(res.L, g.latitude, g.longitude)});
    } catch (e) { Alert.alert('Place', String(e.message || e)); }
  }
  const List = ({data}) => data.map(x => <R key={x.n} k={`${x.n} (${x.c})`} v={x.score.toFixed(1)} n={ln(x.out)} />);
  return (
    <ScrollView contentContainerStyle={{padding: 14}} keyboardShouldPersistTaps="handled">
      <Text style={s.n}>{T.pdisc}</Text>
      {!res ? <Text style={[s.n, {marginTop: 10}]}>{T.needTime2}</Text> : <View>
        {!tm && <Text style={[s.n, {marginVertical: 6}]}>{T.needTime}</Text>}
        <Sec t={'🌍 ' + T.topP}><List data={res.top} /></Sec>
        <Sec t={'⚠️ ' + T.lowP}><List data={res.low} /></Sec>
        <Sec t={'🔎 ' + T.chk}>
          <TextInput style={s.in} value={q} onChangeText={setQ} placeholder="London" placeholderTextColor="#667" />
          <TouchableOpacity style={s.btn} onPress={check}><Text style={s.btnT}>{T.chkB}</Text></TouchableOpacity>
          {chk && <R k={chk.n} v={chk.score.toFixed(1)} n={ln(chk.out)} />}
        </Sec>
        <Text style={s.n}>{T.pnote}</Text>
      </View>}
    </ScrollView>
  );
}

function Settings({T, set, setSet}) {
  return (
    <ScrollView contentContainerStyle={{padding: 14}}>
      <Sec t={T.lang}><View style={s.nav}><Chip t="English" sel={set.lang === 'en'} on={() => setSet({...set, lang: 'en'})} /><Chip t="Polski" sel={set.lang === 'pl'} on={() => setSet({...set, lang: 'pl'})} /></View></Sec>
      <Sec t={T.sys}><View style={s.nav}><Chip t={T.pyth} sel={set.sys === 'pyth'} on={() => setSet({...set, sys: 'pyth'})} /><Chip t={T.chal} sel={set.sys === 'chal'} on={() => setSet({...set, sys: 'chal'})} /></View></Sec>
      <Text style={s.n}>{T.about}</Text>
    </ScrollView>
  );
}

export default function App() {
  const [set, setSet] = useStored('cc-set', {lang: 'en', sys: 'pyth'});
  const [p, setP] = useStored('cc-profile', {name: '', bdate: '', btime: '', place: '', lat: null, lon: null, tz: '', off: 0});
  const [tab, setTab] = useState(0);
  const T = S[set.lang], Nm = N[set.lang], props = {T, Nm, set, p, setP, setSet};
  const tabs = [['🌙', T.today], ['👤', T.me], ['📅', T.plan], ['🌍', T.places], ['📓', T.journal], ['⚙️', T.settings]];
  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" />
      <Text style={s.disc}>{T.disc}</Text>
      <View style={{flex: 1}}>{tab === 0 ? <Today {...props} /> : tab === 1 ? <Me {...props} /> : tab === 2 ? <Plan {...props} /> : tab === 3 ? <Places {...props} /> : tab === 4 ? <Journal {...props} /> : <Settings {...props} />}</View>
      <View style={s.tabs}>{tabs.map(([e, l], i) => <TouchableOpacity key={l} style={s.tab} onPress={() => setTab(i)}><Text style={{fontSize: 20}}>{e}</Text><Text style={[s.tl, tab === i && {color: '#f5c451'}]}>{l}</Text></TouchableOpacity>)}</View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#0d1226', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0},
  disc: {color: '#8e96c0', fontSize: 11, textAlign: 'center', paddingVertical: 6},
  card: {backgroundColor: '#171d38', borderRadius: 14, padding: 14, marginBottom: 12},
  h: {color: '#f5c451', fontSize: 16, fontWeight: '800', marginBottom: 8},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#2a3157'},
  k: {color: '#8e96c0', fontSize: 14, flex: 1.1}, v: {color: '#e9ecff', fontSize: 15, fontWeight: '600', textAlign: 'right'}, n: {color: '#8e96c0', fontSize: 12, textAlign: 'right', marginTop: 2},
  nav: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginVertical: 6}, date: {color: '#e9ecff', fontSize: 16, fontWeight: '700'},
  chip: {paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#232a4d'}, chipOn: {backgroundColor: '#f5c451'},
  in: {backgroundColor: '#232a4d', color: '#e9ecff', borderRadius: 10, padding: 10, fontSize: 15},
  btn: {backgroundColor: '#f5c451', borderRadius: 10, padding: 12, alignItems: 'center', marginVertical: 6}, btnT: {color: '#0d1226', fontWeight: '800'},
  tabs: {flexDirection: 'row', backgroundColor: '#171d38', paddingBottom: Platform.OS === 'android' ? 24 : 0}, tab: {flex: 1, alignItems: 'center', padding: 8}, tl: {color: '#8e96c0', fontSize: 10}
});
