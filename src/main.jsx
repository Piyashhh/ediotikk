import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowDown, X, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import '@fontsource-variable/manrope/wght.css';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import './style.css';
import { Glow } from './glow.jsx';

const EMAIL = 'biswaspiyas16@gmail.com';

// Media is stored outside src/. New files are discovered by Vite; photo/design files sort numerically.
const photoModules = import.meta.glob('../media/photography/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const designModules = import.meta.glob('../media/graphic-design/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const videoModules = import.meta.glob('../media/videos/*.{mp4,webm,mov}', { eager: true, query: '?url', import: 'default' });
const thumbnailModules = import.meta.glob('../media/thumbnails/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const sortFiles = modules => Object.entries(modules).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([path, src]) => ({ path, src }));
const fileMap = modules => Object.fromEntries(Object.entries(modules).map(([path, src]) => [path.split('/').pop(), src]));
const photos = sortFiles(photoModules);
const designs = sortFiles(designModules);
const videoFiles = fileMap(videoModules);
const thumbnailFiles = fileMap(thumbnailModules);
const pick = (files, name, exts) => exts.map(e => files[`${name}.${e}`]).find(Boolean);
const getVideo = name => pick(videoFiles, name, ['mp4', 'webm', 'mov']);
const getThumb = name => pick(thumbnailFiles, name, ['jpg', 'jpeg', 'png', 'webp', 'avif']);
const videos = [
  { id: 'reel-01', title: 'Reel 01', file: getVideo('reel-01'), thumb: getThumb('reel-01'), kind: 'VIDEO & EDITING' },
  { id: 'reel-02', title: 'Reel 02', file: getVideo('reel-02'), thumb: getThumb('reel-02'), kind: 'VIDEO & EDITING' },
  { id: 'bts-01', title: 'Behind the Scenes', file: getVideo('bts-01'), thumb: getThumb('bts-01'), kind: 'VIDEO & EDITING' },
  { id: 'pujodex-promo', title: 'Pujodex Promo Film', file: getVideo('pujodex-promo'), thumb: getThumb('pujodex-promo'), kind: 'PERSONAL PROJECT' },
];

// What the viewer can step through. One list per gallery.
const galleries = {
  photo: photos.map((p, i) => ({ type: 'image', src: p.src, title: `Photo ${i + 1}` })),
  design: designs.map((p, i) => ({ type: 'image', src: p.src, title: `Design ${i + 1}` })),
  video: videos.filter(v => v.file).map(v => ({ type: 'video', src: v.file, title: v.title, id: v.id })),
};
const pad = n => String(n).padStart(2, '0');

const sites = [
  { id: 'pujo', href: 'https://piyashhh.github.io/Pujodex/', stamp: 'INDEPENDENT PRODUCT', label: '01 / PRODUCT', name: 'Pujodex', blurb: 'A map for finding Durga Puja pandals.',
    art: <span className="pujo-type">PUJO<br />DEX<span>.</span></span> },
  { id: 'wedding', href: 'https://demo-wedmemories.netlify.app/', stamp: 'CLIENT DEMO', label: '02 / WEBSITE', name: 'WedMemories', blurb: 'A wedding memories website concept.',
    art: <span className="wedding-type">Wed<span>Memories</span></span> },
  { id: 'personal', href: 'https://piyashhh.github.io/', stamp: 'EARLY EXPERIMENT', label: '03 / WEBSITE', name: 'Personal Homepage', blurb: 'An early experiment in building for the web.',
    art: <span className="personal-type">PERSONAL<br />HOMEPAGE<span>↗</span></span> },
];

function SiteCard({ site }) {
  return <a className={`site-card site-${site.id}`} href={site.href} target="_blank" rel="noreferrer">
    <div className="site-art">
      <Glow scene={site.id} />
      <span className="site-stamp">{site.stamp}</span>
      {site.art}
      <span className="site-arrow"><ArrowUpRight /></span>
    </div>
    <div className="site-meta">
      <div><span className="eyebrow">{site.label}</span><h3>{site.name}</h3><p>{site.blurb}</p></div>
      <ArrowUpRight size={18} />
    </div>
  </a>;
}

function App() {
  const [view, setView] = useState(null); // { group, index }
  const [copied, setCopied] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const [badThumbs, setBadThumbs] = useState({});
  const opener = useRef(null);
  const closeBtn = useRef(null);
  const swipeStart = useRef(null);
  const isOpen = view !== null;
  const list = isOpen ? galleries[view.group] : [];
  const item = isOpen ? list[view.index] : null;

  const open = (group, index) => { opener.current = document.activeElement; setView({ group, index }); };
  const close = useCallback(() => { setView(null); opener.current?.focus?.(); }, []);
  const step = useCallback(dir => setView(v => v && { ...v, index: (v.index + dir + galleries[v.group].length) % galleries[v.group].length }), []);

  // Viewer: Esc closes, arrows step, page behind stops scrolling.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = e => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [isOpen, close, step]);

  async function copyEmail() {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.location.href = `mailto:${EMAIL}`; }
  }

  const imageCard = (p, index, group) => {
    const title = `${group === 'photo' ? 'Photo' : 'Design'} ${index + 1}`;
    return <button className={`work-card image-card ${group}`} key={p.path} onClick={() => open(group, index)} aria-label={`Open ${title}`}>
      {!failedImages[p.path]
        ? <img src={p.src} loading="lazy" decoding="async" alt={title} onError={() => setFailedImages(s => ({ ...s, [p.path]: true }))} />
        : <div className="media-fallback"><span>{group === 'photo' ? 'PHOTOGRAPHY' : 'GRAPHIC DESIGN'}</span><b>{pad(index + 1)}</b></div>}
      <span className="card-index">{pad(index + 1)} <ArrowUpRight size={14} /></span>
    </button>;
  };

  const swipe = item?.type === 'image' ? {
    onTouchStart: e => { swipeStart.current = e.touches[0].clientX; },
    onTouchEnd: e => { const dx = e.changedTouches[0].clientX - swipeStart.current; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); },
  } : {};

  return <>
    <div className="page" inert={isOpen}>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Ediotikk home">EDIOTIKK<span className="orange-dot">.</span></a>
        <nav aria-label="Primary"><a href="#work">Work <ArrowDown size={13} /></a><a href="#contact">Contact <ArrowUpRight size={13} /></a></nav>
      </header>
      <main id="top">
        <section className="hero">
          <Glow scene="hero" />
          <div className="hero-top"><span className="eyebrow"><i /> INDEPENDENT CREATIVE PRACTICE</span><span className="hero-number">KOLKATA, IN / 2026</span></div>
          <h1>EDIOTIKK<span className="orange-dot">.</span></h1>
          <div className="hero-bottom">
            <span className="hero-note">VISUAL PRODUCTION<br />DIGITAL DESIGN</span>
            <a className="round-link" href="#work" aria-label="Explore work"><ArrowDown size={20} /></a>
            <span className="availability"><i /> AVAILABLE FOR PROJECTS</span>
          </div>
        </section>

        <section id="work" className="work-section">
          <div className="section-heading"><span className="eyebrow">01 / SELECTED WORK</span><span className="section-note">A collection of things made, tried, and figured out.</span></div>
          <div className="category-heading"><h2>Visual<br />Production<span className="orange-dot">.</span></h2><span className="eyebrow">IMAGE / MOTION / FORM</span></div>

          <div className="subhead"><span>01</span><h3>Photography</h3><span className="eyebrow">STILLS</span></div>
          {photos.length
            ? <div className="photo-grid">{photos.map((p, i) => imageCard(p, i, 'photo'))}</div>
            : <div className="empty-state photo-empty"><span className="empty-mark">✳</span><div><b>Photography goes here.</b><p>Add numbered images to <code>media/photography/</code> — for example, <code>1.jpg</code>, <code>2.jpg</code>, <code>3.webp</code>.</p></div><span className="eyebrow">01—∞</span></div>}

          <div className="subhead"><span>02</span><h3>Video &amp; Editing</h3><span className="eyebrow">MOTION</span></div>
          <div className="video-carousel" aria-label="Video and editing projects">
            {videos.map((v, i) => {
              const art = !v.thumb || badThumbs[v.id];
              return <button className="work-card video-card" key={v.id} disabled={!v.file}
                onClick={() => open('video', galleries.video.findIndex(g => g.id === v.id))}
                aria-label={v.file ? `Play ${v.title}` : `${v.title}, video file not added yet`}>
                <div className={`video-visual ${art ? '' : 'has-thumb'}`}>
                  {art && <Glow scene="reel" grain={false} />}
                  {!art && <img src={v.thumb} alt="" decoding="async" onError={() => setBadThumbs(s => ({ ...s, [v.id]: true }))} />}
                  <div className="video-fallback"><span>{v.kind}</span><div><b>{v.title}</b><small>{v.file ? 'PLAY FILM ↗' : 'VIDEO FILE TO COME'}</small></div></div>
                  {v.file && <span className="play-button" aria-hidden="true">▶</span>}
                </div>
                <div className="video-meta"><span>{v.title}</span><span>{pad(i + 1)} <ArrowUpRight size={14} /></span></div>
              </button>;
            })}
          </div>

          <div className="subhead"><span>03</span><h3>Graphic Design</h3><span className="eyebrow">EXPERIMENTS</span></div>
          {designs.length
            ? <><div className="design-grid">{designs.map((p, i) => imageCard(p, i, 'design'))}</div><p className="archive-note">SELECTED EXPERIMENTS · MORE TO COME</p></>
            : <div className="empty-state design-empty"><div className="design-placeholder"><span>G</span><span>—</span><span>D</span></div><div><b>Room for visual experiments.</b><p>Add designs to <code>media/graphic-design/</code>. Artwork opens in a viewer when tapped.</p></div><span className="eyebrow">COMING INTO FOCUS</span></div>}

          <div className="category-heading digital-heading"><h2>Digital<br />Design<span className="orange-dot">.</span></h2><span className="eyebrow">WEB / PRODUCTS / SYSTEMS</span></div>
          <div className="site-grid">{sites.map(s => <SiteCard key={s.id} site={s} />)}</div>
        </section>

        <section className="contact-section" id="contact">
          <Glow scene="contact" />
          <div className="section-heading"><span className="eyebrow">02 / CONTACT</span><span className="section-note">Good things start somewhere.</span></div>
          <h2>Have something<br />in mind<span className="orange-dot">?</span></h2>
          <div className="contact-bottom">
            <p>Let's make it happen.</p>
            <div className="contact-actions">
              <button onClick={copyEmail} className="email-button" aria-live="polite">{copied ? 'Copied email' : EMAIL} {copied ? <Check size={16} /> : <Copy size={16} />}</button>
              <a href="https://www.instagram.com/ediotikk/" target="_blank" rel="noreferrer">Instagram @ediotikk <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>
      </main>
      <footer><a className="wordmark" href="#top">EDIOTIKK<span className="orange-dot">.</span></a><span>INDEPENDENT BY DESIGN.</span><span>© 2026</span></footer>
    </div>

    {item && <div className="viewer" role="dialog" aria-modal="true" aria-label={item.title} onClick={close}>
      <Glow scene="viewer" grain={false} />
      <button ref={closeBtn} className="viewer-close" onClick={close} aria-label="Close viewer"><X /></button>
      <div className="viewer-content" onClick={e => e.stopPropagation()} {...swipe}>
        <span className="eyebrow">{item.title}</span>
        {item.type === 'video' ? <video key={item.src} src={item.src} controls autoPlay playsInline /> : <img key={item.src} src={item.src} alt={item.title} />}
      </div>
      {list.length > 1 && <div className="viewer-nav" onClick={e => e.stopPropagation()}>
        <button onClick={() => step(-1)} aria-label="Previous"><ChevronLeft size={20} /></button>
        <span>{pad(view.index + 1)} / {pad(list.length)}</span>
        <button onClick={() => step(1)} aria-label="Next"><ChevronRight size={20} /></button>
      </div>}
    </div>}
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
