'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { CITIES, PRACTICES, milesBetween, type Practice, type PracticeType } from './practices';

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const TYPES: PracticeType[] = ['Chiropractic', 'Orthopedics', 'MRI / Imaging', 'Telehealth', 'Surgery center'];
const HOME: [number, number] = [-81.9, 27.9];
const CLIENT = CITIES.Kissimmee;
const RADIUS_MI = 15;

function circle(center: { lat: number; lng: number }, miles: number) {
  const pts = 64;
  const km = miles * 1.609;
  const coords: [number, number][] = [];
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * 2 * Math.PI;
    const dx = (km * Math.cos(a)) / (111.32 * Math.cos((center.lat * Math.PI) / 180));
    const dy = (km * Math.sin(a)) / 110.57;
    coords.push([center.lng + dx, center.lat + dy]);
  }
  return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [coords] } } as any;
}

/**
 * A real map (Mapbox GL) of the sample network. Pan and zoom it, filter by
 * practice type, click a pin for the practice card, or switch on "Near your
 * client" to draw a 15-mile radius around Kissimmee and rank the closest
 * three by actual distance. Without a token it falls back to the screenshot.
 */
const REGISTER = 'https://app.medilink.vip/register?type=law_firm';

export default function MapDemo({ gated = false }: { gated?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markers = useRef<Map<string, any>>(new Map());
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(!TOKEN);
  const [types, setTypes] = useState<Set<PracticeType>>(new Set(TYPES));
  const [selected, setSelected] = useState<Practice | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (gated) return; // the gate shows the real directory map as an image; no live map needed
    if (!TOKEN || !box.current) return;
    let cancelled = false;
    let map: any;
    import('mapbox-gl')
      .then((mod) => {
        if (cancelled || !box.current) return;
        const mapboxgl: any = (mod as any).default || mod;
        if (typeof mapboxgl.supported === 'function' && !mapboxgl.supported()) { setFailed(true); return; }
        mapboxgl.accessToken = TOKEN;
        map = new mapboxgl.Map({
          container: box.current,
          style: gated ? 'mapbox://styles/mapbox/streets-v12' : 'mapbox://styles/mapbox/light-v11',
          center: gated ? [-80.6, 27.9] : HOME,
          zoom: gated ? 6.9 : 5.3,
          cooperativeGestures: !gated,
          interactive: !gated,
          attributionControl: true,
        });
        if (!gated) map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
        map.on('load', () => {
          if (cancelled) return;
          PRACTICES.forEach((p) => {
            const el = document.createElement('button');
            el.type = 'button';
            el.className = `lf-mk ${p.statewide ? 'lf-mk-tele' : ''} ${gated ? 'lf-mk-big' : ''}`;
            el.setAttribute('aria-label', `${p.name}, ${p.city}`);
            el.addEventListener('click', (e) => {
              e.stopPropagation();
              setSelected(p);
              map.easeTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 7.2), duration: 650 });
            });
            markers.current.set(p.id, new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat([p.lng, p.lat]).addTo(map));
          });
          map.on('click', () => setSelected(null));
          map.addSource('radius', { type: 'geojson', data: circle(CLIENT, RADIUS_MI) });
          map.addLayer({ id: 'radius-fill', type: 'fill', source: 'radius', paint: { 'fill-color': '#0da7ca', 'fill-opacity': 0 } });
          map.addLayer({ id: 'radius-line', type: 'line', source: 'radius', paint: { 'line-color': '#0da7ca', 'line-width': 1.5, 'line-dasharray': [2, 2], 'line-opacity': 0 } });
          const you = document.createElement('div');
          you.className = 'lf-mk-you';
          you.style.display = 'none';
          markers.current.set('__you', new mapboxgl.Marker({ element: you }).setLngLat([CLIENT.lng, CLIENT.lat]).addTo(map));
          setReady(true);
          // The slide scales in with Framer Motion while the map measures its
          // container, so the first measurement can come up short. Re-measure
          // once the entrance has settled.
          [300, 1200, 2600].forEach((ms) => window.setTimeout(() => { if (!cancelled) map.resize(); }, ms));
        });
        map.on('error', (e: any) => { if (/token|401|403/i.test(String(e?.error?.message || ''))) setFailed(true); });
        mapRef.current = map;
        if (process.env.NODE_ENV !== 'production') (window as any).__lfmap = map; // QA hook, stripped from prod builds
      })
      .catch(() => setFailed(true));
    return () => { cancelled = true; markers.current.clear(); mapRef.current = null; if (map) map.remove(); };
  }, []);

  useEffect(() => {
    PRACTICES.forEach((p) => {
      const m = markers.current.get(p.id);
      if (m) m.getElement().style.display = types.has(p.type) ? '' : 'none';
    });
  }, [types, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || gated) return; // gated map keeps its opening frame
    const you = markers.current.get('__you');
    if (you) you.getElement().style.display = near ? '' : 'none';
    map.setPaintProperty('radius-fill', 'fill-opacity', near ? 0.12 : 0);
    map.setPaintProperty('radius-line', 'line-opacity', near ? 1 : 0);
    map.easeTo(near ? { center: [CLIENT.lng, CLIENT.lat], zoom: 8.3, duration: 900 } : { center: HOME, zoom: 5.3, duration: 900 });
    if (!near) setSelected(null);
  }, [near, ready]);

  const toggle = (t: PracticeType) => setTypes((s) => { const n = new Set(s); if (n.has(t)) { if (n.size > 1) n.delete(t); } else n.add(t); return n; });
  const visible = PRACTICES.filter((p) => types.has(p.type));
  const nearest = near
    ? visible.filter((p) => !p.statewide).map((p) => ({ p, mi: milesBetween(CLIENT, p) })).sort((a, b) => a.mi - b.mi).slice(0, 3)
    : [];
  const tele = near ? visible.find((p) => p.statewide) : undefined;

  if (gated) {
    return (
      <div className="lf-demo lf-demo-map lf-demo-map-gated">
        <div className="lf-demo-bar">
          <span className="lf-demo-title">Directory</span>
          <span className="lf-demo-hint">147 verified practices · members only</span>
        </div>
        <div className="lf-map-wrap">
          <img className="lf-map-real" src="/screens/directory-map-blur.jpg" alt="The MediLink directory map of Florida with every verified practice pinned" decoding="async" />
          <div className="lf-map-veil" />
          <div className="lf-map-gate">
            <span className="lf-map-gate-eyebrow"><i className="lf-dot" />Live network · Florida and growing</span>
            <h3>Join now to view the <em>full network.</em></h3>
            <p>Every practice on this map passed NPI, state-license and identity checks. Members search by specialty, language, distance and coverage, and refer in two minutes.</p>
            <a className="btn btn-cta" href={REGISTER}>Create your free firm account<span className="arrow">→</span></a>
            <span className="lf-map-gate-note">Free for law firms. No card, ever.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lf-demo lf-demo-map">
      <div className="lf-demo-bar">
        <span className="lf-demo-title">Directory</span>
        <span className="lf-demo-hint">{near ? 'Ranked by real distance' : 'Drag the map, click a pin'}</span>
      </div>
      <div className="lf-map-filters">
        {TYPES.map((t) => (
          <button type="button" key={t} className={types.has(t) ? 'is-on' : ''} onClick={() => toggle(t)}>{t}</button>
        ))}
        <button type="button" className={`lf-map-near ${near ? 'is-on' : ''}`} onClick={() => setNear((v) => !v)}>
          <i className="lf-mk-you lf-mk-you-inline" />Near your client
        </button>
      </div>

      <div className="lf-map-wrap">
        {failed ? (
          <img className="lf-map-fallback" src="/screens/directory.jpg" alt="MediLink directory map of Florida with verified practices pinned" />
        ) : (
          <div ref={box} className="lf-map-canvas" aria-label="Map of the sample provider network in Florida" />
        )}

        <aside className="lf-map-side">
          {selected ? (
            <div className="lf-map-card">
              <div className="lf-match-head">
                <span className="lf-match-name">{selected.name}</span>
                <span className="lf-pill lf-pill-verified">✓ Verified</span>
              </div>
              <span className="lf-match-meta">{selected.type} · {selected.statewide ? 'video visits anywhere in FL' : `${selected.city}, FL`}</span>
              <span className="lf-match-meta">{selected.languages.join(' · ')} · accepts {selected.accepts.join(' and ')}</span>
              <div className="lf-match-foot">
                <span className="lf-match-slot"><i className="lf-dot lf-dot-green" />Next opening {selected.nextOpening}</span>
                <span className="lf-btn-mini">Refer</span>
              </div>
              {near && !selected.statewide && <span className="lf-map-dist">{milesBetween(CLIENT, selected).toFixed(1)} mi from your client</span>}
            </div>
          ) : near ? (
            <div className="lf-map-list">
              <span className="lf-map-list-title">Closest to Camila · Kissimmee</span>
              {nearest.map(({ p, mi }, i) => (
                <button type="button" key={p.id} onClick={() => { setSelected(p); mapRef.current?.easeTo({ center: [p.lng, p.lat], zoom: 9, duration: 600 }); }}>
                  <span className="lf-map-rank">{i + 1}</span>
                  <span className="lf-map-list-name">{p.name}<small>{p.type} · {p.city}</small></span>
                  <span className="lf-map-list-mi">{mi.toFixed(1)} mi</span>
                </button>
              ))}
              {tele && (
                <button type="button" className="is-tele" onClick={() => setSelected(tele)}>
                  <span className="lf-map-rank">▶</span>
                  <span className="lf-map-list-name">{tele.name}<small>Video visit · anywhere in Florida</small></span>
                  <span className="lf-map-list-mi">today</span>
                </button>
              )}
            </div>
          ) : (
            <div className="lf-map-legend">
              <b>{visible.length} practices</b>
              <span>in the sample network. Every one passed NPI, license and identity checks before it was listed.</span>
              <span className="lf-map-legend-row"><i className="lf-mk lf-mk-static" />Practice · <i className="lf-mk lf-mk-static lf-mk-tele" />Statewide telehealth</span>
              <span className="lf-map-legend-row"><i className="lf-mk-you lf-mk-you-inline" />Your client</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
