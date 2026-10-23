import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowDown, X, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import './style.css';

// Media is stored outside src/. New files are discovered by Vite; photo/design files sort numerically.
const photoModules = import.meta.glob('../media/photography/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const designModules = import.meta.glob('../media/graphic-design/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const videoModules = import.meta.glob('../media/videos/*.{mp4,webm,mov}', { eager: true, query: '?url', import: 'default' });
const thumbnailModules = import.meta.glob('../media/thumbnails/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const sortFiles = modules => Object.entries(modules).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([path, src]) => ({ path, src }));
const photos = sortFiles(photoModules);
const designs = sortFiles(designModules);
const fileMap = modules => Object.fromEntries(Object.entries(modules).map(([path, src]) => [path.split('/').pop(), src]));
const videoFiles = fileMap(videoModules);
const thumbnailFiles = fileMap(thumbnailModules);
const getVideo = name => videoFiles[`${name}.mp4`] || videoFiles[`${name}.webm`] || videoFiles[`${name}.mov`];
const getThumb = name => thumbnailFiles[`${name}.jpg`] || thumbnailFiles[`${name}.jpeg`] || thumbnailFiles[`${name}.png`] || thumbnailFiles[`${name}.webp`] || thumbnailFiles[`${name}.avif`];
const videos = [
  { id: 'reel-01', title: 'Reel 01', file: getVideo('reel-01'), thumb: getThumb('reel-01'), kind: 'VIDEO & EDITING' },
  { id: 'reel-02', title: 'Reel 02', file: getVideo('reel-02'), thumb: getThumb('reel-02'), kind: 'VIDEO & EDITING' },
  { id: 'bts-01', title: 'Behind the Scenes', file: getVideo('bts-01'), thumb: getThumb('bts-01'), kind: 'VIDEO & EDITING' },
  { id: 'pujodex-promo', title: 'Pujodex Promo Film', file: getVideo('pujodex-promo'), thumb: getThumb('pujodex-promo'), kind: 'PERSONAL PROJECT' },
];

function App() {
  const [active, setActive] = useState(null);
  const [copied, setCopied] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  async function copyEmail() {
    try { await navigator.clipboard.writeText('biswaspiyas16@gmail.com'); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.location.href = 'mailto:biswaspiyas16@gmail.com'; }
  }
  const imageCard = (item, index, kind = 'photo') => {
    const title = kind === 'photo' ? `Photo ${index + 1}` : `Design ${index + 1}`;
    return <button className={`work-card image-card ${kind}`} key={item.path} onClick={() => setActive({ type: 'image', src: item.src, title })} aria-label={`Open ${title}`}>
      {!failedImages[item.path] ? <img src={item.src} loading="lazy" alt={title} onError={() => setFailedImages(s => ({ ...s, [item.path]: true }))} /> : <div className="media-fallback"><span>{kind === 'photo' ? 'PHOTOGRAPHY' : 'GRAPHIC DESIGN'}</span><b>{String(index + 1).padStart(2, '0')}</b></div>}
      <span className="card-index">{String(index + 1).padStart(2, '0')} <ArrowUpRight size={14}/></span>
    </button>;
  };
  return <>
    <header className="topbar"><a className="wordmark" href="#top" aria-label="Ediotikk home">EDIOTIKK<span className="orange-dot">.</span></a><nav><a href="#work">Work <ArrowDown size={13}/></a><a href="#contact">Contact <ArrowUpRight size={13}/></a></nav></header>
    <main id="top">
      <section className="hero"><div className="hero-top"><span className="eyebrow"><i/> INDEPENDENT CREATIVE PRACTICE</span><span className="hero-number">KOLKATA, IN / 2026</span></div><h1>EDIOTIKK<span className="orange-dot">.</span></h1><div className="hero-bottom"><span className="hero-note">VISUAL PRODUCTION<br/>DIGITAL DESIGN</span><a className="round-link" href="#work" aria-label="Explore work"><ArrowDown size={20}/></a><span className="availability"><i/> AVAILABLE FOR PROJECTS</span></div></section>
      <section id="work" className="work-section"><div className="section-heading"><span className="eyebrow">01 / SELECTED WORK</span><span className="section-note">A collection of things made, tried, and figured out.</span></div>
        <div className="category-heading"><h2>Visual<br/>Production<span className="orange-dot">.</span></h2><span className="eyebrow">IMAGE / MOTION / FORM</span></div>
        <div className="subhead"><span>01</span><h3>Photography</h3><span className="eyebrow">STILLS</span></div>
        {photos.length ? <div className="photo-grid">{photos.map((p, i) => imageCard(p, i, 'photo'))}</div> : <div className="empty-state photo-empty"><span className="empty-mark">✳</span><div><b>Photography goes here.</b><p>Add numbered images to <code>media/photography/</code> — for example, <code>1.jpg</code>, <code>2.jpg</code>, <code>3.webp</code>.</p></div><span className="eyebrow">01—∞</span></div>}
        <div className="subhead"><span>02</span><h3>Video &amp; Editing</h3><span className="eyebrow">MOTION</span></div>
        <div className="video-carousel" aria-label="Video and editing projects">{videos.map((v, i) => <button className="work-card video-card" key={v.id} onClick={() => v.file && setActive({ type: 'video', src: v.file, title: v.title })} aria-label={v.file ? `Play ${v.title}` : `${v.title}, video file not added yet`}><div className={`video-visual ${v.thumb ? 'has-thumb' : ''}`}>
          {v.thumb && <img src={v.thumb} alt="" onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.classList.remove('has-thumb'); }} />}
          <div className="video-fallback"><span className="play">▶</span><span>{v.kind}</span><b>{v.title}</b><small>{v.file ? 'PLAY FILM ↗' : 'VIDEO FILE TO COME'}</small></div><span className="play-button">▶</span></div><div className="video-meta"><span>{v.title}</span><span>{String(i + 1).padStart(2, '0')} <ArrowUpRight size={14}/></span></div></button>)}</div>
        <div className="subhead"><span>03</span><h3>Graphic Design</h3><span className="eyebrow">EXPERIMENTS</span></div>
        {designs.length ? <><div className="design-grid">{designs.map((p, i) => imageCard(p, i, 'design'))}</div><p className="archive-note">SELECTED EXPERIMENTS · MORE TO COME</p></> : <div className="empty-state design-empty"><div className="design-placeholder"><span>G</span><span>—</span><span>D</span></div><div><b>Room for visual experiments.</b><p>Add designs to <code>media/graphic-design/</code>. Artwork opens in a viewer when tapped.</p></div><span className="eyebrow">COMING INTO FOCUS</span></div>}
        <div className="category-heading digital-heading"><h2>Digital<br/>Design<span className="orange-dot">.</span></h2><span className="eyebrow">WEB / PRODUCTS / SYSTEMS</span></div>
        <div className="site-grid">
          <a className="site-card site-pujo" href="https://piyashhh.github.io/Pujodex/" target="_blank" rel="noreferrer"><div className="site-art"><span className="site-stamp">INDEPENDENT PRODUCT</span><span className="pujo-type">PUJO<br/>DEX<span>.</span></span><span className="site-arrow"><ArrowUpRight/></span></div><div className="site-meta"><div><span className="eyebrow">01 / PRODUCT</span><h3>Pujodex</h3><p>A map for finding Durga Puja pandals.</p></div><ArrowUpRight size={18}/></div></a>
          <a className="site-card" href="https://demo-wedmemories.netlify.app/" target="_blank" rel="noreferrer"><div className="site-art wedding-art"><span className="site-stamp">CLIENT DEMO</span><span className="wedding-type">Wed<span>Memories</span></span><span className="site-arrow"><ArrowUpRight/></span></div><div className="site-meta"><div><span className="eyebrow">02 / WEBSITE</span><h3>WedMemories</h3><p>A wedding memories website concept.</p></div><ArrowUpRight size={18}/></div></a>
          <a className="site-card personal-site" href="https://piyashhh.github.io/" target="_blank" rel="noreferrer"><div className="site-art personal-art"><span className="site-stamp">EARLY EXPERIMENT</span><span className="personal-type">PERSONAL<br/>HOMEPAGE<span>↗</span></span><span className="site-arrow"><ArrowUpRight/></span></div><div className="site-meta"><div><span className="eyebrow">03 / WEBSITE</span><h3>Personal Homepage</h3><p>An early experiment in building for the web.</p></div><ArrowUpRight size={18}/></div></a>
        </div>
      </section>
      <section className="contact-section" id="contact"><div className="section-heading"><span className="eyebrow">02 / CONTACT</span><span className="section-note">Good things start somewhere.</span></div><h2>Have something<br/>in mind<span className="orange-dot">?</span></h2><div className="contact-bottom"><p>Let's make it happen.</p><div className="contact-actions"><button onClick={copyEmail} className="email-button">{copied ? 'Copied email' : 'biswaspiyas16@gmail.com'} {copied ? <Check size={16}/> : <Copy size={16}/>}</button><a href="https://www.instagram.com/ediotikk/" target="_blank" rel="noreferrer">Instagram @ediotikk <ArrowUpRight size={16}/></a></div></div></section>
    </main><footer><a className="wordmark" href="#top">EDIOTIKK<span className="orange-dot">.</span></a><span>INDEPENDENT BY DESIGN.</span><span>© 2026</span></footer>
    {active && <div className="viewer" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}><button className="viewer-close" onClick={() => setActive(null)} aria-label="Close viewer"><X/></button><div className="viewer-content" onClick={e => e.stopPropagation()}><span className="eyebrow">{active.title}</span>{active.type === 'video' ? <video src={active.src} controls autoPlay playsInline /> : <img src={active.src} alt={active.title}/>}</div></div>}
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
