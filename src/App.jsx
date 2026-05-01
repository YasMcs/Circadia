import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [currentView, setCurrentView] = useState('welcome');

  return (
    <>
      {/* Background container for the p5.js Orb (Lumi) */}
      <div id="p5-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
        {/* We will migrate p5 logic here later */}
      </div>

      <div className="noise-overlay"></div>

      {/* Global Navbar */}
      {currentView !== 'welcome' && (
        <nav id="global-top-bar" className="glass-widget" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '95%', maxWidth: '1200px', zIndex: 100, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '10px 30px' }}>
          <div style={{ justifySelf: 'start', fontSize: '1.2rem', fontWeight: 600, letterSpacing: '2px' }}>CIRCADIA</div>
          <div className="main-dock">
            <button className={`dock-btn ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}>ESTADO</button>
            <button className={`dock-btn ${currentView === 'agenda' ? 'active' : ''}`} onClick={() => setCurrentView('agenda')}>AGENDA</button>
            <button className={`dock-btn ${currentView === 'study' ? 'active' : ''}`} onClick={() => setCurrentView('study')}>LUMI</button>
          </div>
          <div style={{ justifySelf: 'end', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span className="mono-text" style={{ fontSize: '0.9rem', color: 'var(--cyan)' }}>10:30 AM</span>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}></div>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <div style={{ position: 'relative', zIndex: 10, height: '100vh', width: '100vw', overflowY: 'auto', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          {currentView === 'welcome' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="module" 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
            >
              <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>Bienvenido a <span style={{ color: 'var(--cyan)' }}>Circadia</span></h1>
              <p style={{ color: '#aaa', marginBottom: '40px' }}>Tu gestor biológico inteligente</p>
              <button className="btn" onClick={() => setCurrentView('dashboard')}>INICIAR SESIÓN</button>
            </motion.div>
          )}

          {currentView === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="module" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
            >
              <div className="glass-widget" style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Dashboard</h2>
                <p>Aquí irá el estado biológico actual y el resumen de la agenda.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
