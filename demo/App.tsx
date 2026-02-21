import React, { useState, useCallback, useRef, useEffect } from 'react';
import { LivePhoto } from 'motion-photo/react';
import './App.css';

// --- Icons ---
const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2"/>
    <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.065 1.815 2.805 1.29 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.545 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.92 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

// --- Placeholders ---
const DEFAULT_IMAGE = 
  'data:image/svg+xml,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#111"/>
    <rect x="2" y="2" width="596" height="396" fill="none" stroke="#222" stroke-width="2" stroke-dasharray="10 10"/>
    <text x="300" y="200" text-anchor="middle" fill="#555" font-family="system-ui" font-size="16">No Motion Photo Loaded</text>
    <text x="300" y="230" text-anchor="middle" fill="#333" font-family="system-ui" font-size="14">Upload a file to begin</text>
  </svg>
`);

// Use a reliable public video for the default state
// const DEFAULT_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const DEFAULT_VIDEO = undefined;

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [badgeStyle, setBadgeStyle] = useState<'concentric' | 'ring' | 'icon' | 'text'>('concentric');
  const [trigger, setTrigger] = useState<'hover' | 'click'>('click');
  const [isDragOver, setIsDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'vanilla'>('react');
  const [playOnce, setPlayOnce] = useState(true);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'image/jpeg' || droppedFile.name.toLowerCase().endsWith('.jpg') || droppedFile.name.toLowerCase().endsWith('.jpeg')) {
        setFile(droppedFile);
        setPreviewUrl(URL.createObjectURL(droppedFile));
        setPlayOnce(true); // Reset play once for new file
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const selectedFile = e.target.files[0];
       setFile(selectedFile);
       setPreviewUrl(URL.createObjectURL(selectedFile));
       setPlayOnce(true); // Reset play once for new file
    }
  };

  const copyInstall = () => {
    navigator.clipboard.writeText('npm install motion-photo');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Syntax highlighting helper
  const Highlight = ({ code }: { code: string }) => {
    const parts = code.split(/('.*?'|".*?"|\b(?:import|from|function|return|const|let|var|if|else)\b)/g);
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith("'") || part.startsWith('"')) return <span key={i} style={{ color: '#a5d6ff' }}>{part}</span>;
          if (['import', 'from', 'function', 'return', 'const', 'let', 'var', 'if', 'else'].includes(part)) return <span key={i} style={{ color: '#ff7b72' }}>{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  const getCodeSnippet = () => {
    switch (activeTab) {
      case 'react':
        return `import { LivePhoto } from 'motion-photo/react';

function MyGallery() {
  return (
    <LivePhoto 
      src={file} 
      config={{ 
        trigger: '${trigger}',
        showLiveBadge: true 
      }} 
    />
  );
}`;
      case 'vue':
        return `<script setup>
import { LivePhoto } from 'motion-photo/vue';
</script>

<template>
  <LivePhoto 
    :src="file" 
    :config="{ 
      trigger: '${trigger}',
      showLiveBadge: true 
    }" 
  />
</template>`;
      case 'vanilla':
        return `import { LivePhotoPlayer } from 'motion-photo';

const player = new LivePhotoPlayer({
  src: file,
  config: {
    trigger: '${trigger}',
    showLiveBadge: true
  }
});

player.mount(document.getElementById('container'));`;
    }
  };

  // Determine source for LivePhoto component
  const livePhotoSrc = file ? file : { imgSrc: DEFAULT_IMAGE, videoSrc: DEFAULT_VIDEO };

  // Logic for playback:
  // - On mount (or file change), play once (using `playOnceOnLoad: true` in config).
  // - Loop is FALSE, so it stops at end or goes back to poster.
  // - "Only when clicked again play once" -> this is the default behavior if loop=false and trigger=click.
  
  return (
    <div className="app">
      <header className="header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo" style={{ gap: '16px' }}>
            <div className="logo-mark"></div>
            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>motion-photo</span>
          </div>
          <nav className="nav-links">
            <a href="https://github.com/wjsoj/motion-photo" target="_blank" rel="noopener noreferrer" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GithubIcon />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-badge">v0.1.0 • Now Available</div>
          <h1 className="hero-title">Bring your photos<br />to life.</h1>
          <p className="hero-subtitle">
            A headless, lightweight library for displaying Google Motion Photos and supporting Samsung, Xiaomi and other Android vendors' Motion Photos on the web.
          </p>
          
          <button className="install-cmd" onClick={copyInstall}>
            <span style={{ color: 'var(--primary)' }}>$</span> npm install motion-photo
            <div className="copy-icon" style={{ marginLeft: 'auto' }}>
                {copied ? <span style={{fontSize: '0.8rem', color: 'var(--primary)'}}>Copied!</span> : <CopyIcon />}
            </div>
          </button>
        </section>

        <section className="playground">
          <div className="preview-panel">
            {/* 
               Container for the LivePhoto. 
               User requested: Fixed height, adapt width to image aspect ratio.
               To achieve this, we set a fixed height on the container and let flex/inline-block handle width.
               The LivePhoto component needs to inherit this height and set width to auto.
            */}
            <div style={{ 
                position: 'relative', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)', 
                background: '#000',
                height: '500px', // Fixed height as requested
                width: 'auto', // Let width be determined by child content aspect ratio
                display: 'inline-flex', // Important: shrinks to fit content
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <LivePhoto 
                    key={file ? file.name : 'default'} // Remount on file change to re-trigger auto-play
                    src={livePhotoSrc}
                    config={{
                        trigger,
                        showLiveBadge: true,
                        liveBadgeStyle: { style: badgeStyle, size: 'md' },
                        // Badge position: Bottom-Left is standard for social media (e.g. Instagram)
                        liveBadgePosition: 'bottom-left',
                        showMuteButton: true, // User requested mute button
                        crossFade: true,
                        loop: false, // User requested: play once then stop
                        playOnceOnLoad: true, // User requested: play once on mount
                    }}
                    // We need to override the default width: 100% behavior of .live-photo class
                    // AND set height to 100% of parent (500px)
                    // AND make the image inside drive the aspect ratio
                    style={{ 
                        height: '100%', 
                        width: 'auto',
                        aspectRatio: 'auto' 
                    }}
                    // We might need to target the internal image to ensure it respects height
                />
            </div>
            
            <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                {!file ? (
                  <>
                    <span style={{ color: 'var(--primary)', fontWeight: 500 }}>Demo Mode:</span> Upload a Motion Photo to test.
                  </>
                ) : (
                  <>
                    <span style={{ color: 'var(--text-main)' }}>{file.name}</span> loaded. {trigger === 'hover' ? 'Hover' : 'Click'} to replay.
                  </>
                )}
            </div>
          </div>

          <aside className="control-panel">
            <div className="panel-header">Configuration</div>
            
            <div className="control-group">
              <label className="control-label">Badge Style</label>
              <select 
                className="control-select" 
                value={badgeStyle} 
                onChange={(e) => setBadgeStyle(e.target.value as any)}
              >
                <option value="concentric">Concentric</option>
                <option value="ring">Ring</option>
                <option value="icon">Icon Only</option>
                <option value="text">Text Badge</option>
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">Trigger Event</label>
              <select 
                className="control-select" 
                value={trigger} 
                onChange={(e) => setTrigger(e.target.value as any)}
              >
                <option value="click">Click / Tap</option>
                <option value="hover">Hover</option>
              </select>
            </div>

            <div className="control-group">
                <label className="control-label">Test Your Photo</label>
                <div 
                    className={`upload-area ${isDragOver ? 'active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input')?.click()}
                >
                    <input 
                        type="file" 
                        id="file-input" 
                        accept="image/jpeg" 
                        style={{ display: 'none' }} 
                        onChange={handleFileSelect}
                    />
                    <div style={{ marginBottom: '8px', color: 'var(--primary)' }}>
                        <UploadIcon />
                    </div>
                    <div className="upload-text">
                        {file ? file.name : "Drop Motion Photo (JPG)"}
                    </div>
                </div>
            </div>
          </aside>
        </section>

        <section className="features">
            <div className="feature-card">
                <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
                <h3 className="feature-title">Zero Dependencies</h3>
                <p className="feature-desc">
                    Core logic is written in pure TypeScript with no runtime dependencies. Extremely lightweight (~3KB gzip).
                </p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                </div>
                <h3 className="feature-title">Framework Agnostic</h3>
                <p className="feature-desc">
                    Includes adapters for React, Vue, and a Vanilla JS web component. Use it anywhere.
                </p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
                </div>
                <h3 className="feature-title">Universal Format</h3>
                <p className="feature-desc">
                    Parses Google & Samsung Motion Photos (JPG embedded video) and iPhone Live Photos (Side-by-side) automatically.
                </p>
            </div>
        </section>

        <section className="features" style={{ marginBottom: '100px' }}>
             <div style={{ gridColumn: '1 / -1', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '32px' }}>
                <h3 className="feature-title" style={{ marginBottom: '24px' }}>Integration</h3>
                <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
                    {(['react', 'vue', 'vanilla'] as const).map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)', 
                          padding: '0 0 12px 0', 
                          borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent', 
                          cursor: 'pointer', 
                          fontWeight: activeTab === tab ? 600 : 400,
                          fontSize: '1rem',
                          textTransform: 'capitalize',
                          transition: 'all 0.2s'
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                </div>
                <pre style={{ background: '#0d1117', padding: '24px', borderRadius: '12px', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#c9d1d9', lineHeight: '1.6' }}>
                  <code>
                    {getCodeSnippet().split('\n').map((line, i) => (
                      <div key={i}><Highlight code={line} /></div>
                    ))}
                  </code>
                </pre>
             </div>
        </section>

        <footer className="footer">
            <p>© {new Date().getFullYear()} Motion Photo Library. Open Source MIT License.</p>
        </footer>
      </main>
    </div>
  );
}
