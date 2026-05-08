import { useState, useEffect, useRef } from 'react';
import './index.css';

// Función para simular triggerReaction desde React hacia la Orbe global
const triggerReaction = (type = 'click') => {
  if (window.triggerOrbReaction) window.triggerOrbReaction(type);
};

const taskOptions = [
  { value: 'alta', label: 'Alta Carga Cognitiva', desc: 'Análisis profundo, lógica compleja, o creación desde cero.', color: 'var(--cyan)' },
  { value: 'creativa', label: 'Carga Media', desc: 'Lectura de comprensión, redacción, o diseño visual.', color: 'var(--violet)' },
  { value: 'admin', label: 'Baja Carga', desc: 'Organización, correos, tareas rutinarias.', color: '#ffb400' }
];

const CustomDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="custom-dropdown" ref={dropdownRef} style={{ position: 'relative', marginBottom: '20px', width: '100%' }}>
      <div 
        className={`dropdown-header ${isOpen ? 'open' : ''}`}
        onClick={() => {
          triggerReaction('click');
          setIsOpen(!isOpen);
        }}
        style={{
          padding: '15px',
          background: 'rgba(20,20,20,0.8)',
          border: isOpen ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          transition: 'all 0.3s ease'
        }}
      >
        <span style={{ color: selectedOption ? selectedOption.color : '#fff', fontWeight: 500 }}>
          {selectedOption ? selectedOption.label : 'Seleccionar...'}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {isOpen && (
        <div className="dropdown-options glass-widget" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          padding: '8px',
          zIndex: 50,
          background: 'rgba(15,15,15,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          {options.map((opt) => (
            <div 
              key={opt.value}
              className="dropdown-option"
              onClick={() => {
                triggerReaction('click');
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: '12px 15px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span style={{ color: opt.color, fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1px' }}>{opt.label.toUpperCase()}</span>
              <span style={{ fontSize: '0.7rem', color: '#999' }}>{opt.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomDatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date()); // Fecha para navegar el calendario
  const containerRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const monthNames = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

  const changeMonth = (offset) => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + offset);
    setViewDate(next);
  };

  return (
    <div ref={containerRef} style={{ flex: 1.5, position: 'relative' }}>
      <label className="mono-text" style={{ fontSize: '0.65rem', position: 'absolute', top: '8px', left: '15px', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none', zIndex: 5 }}>FECHA</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="input-modern" 
        style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '22px 15px 10px 15px', background: 'rgba(255,255,255,0.02)', color: value ? '#fff' : '#555' }}
      >
        {value || 'Seleccionar'}
      </div>

      {isOpen && (
        <div className="dropdown-options glass-widget" style={{ 
          position: 'absolute', top: '100%', left: 0, width: '300px', marginTop: '8px', zIndex: 100, padding: '20px', 
          background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(15px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', color: '#fff', opacity: 0.5, cursor: 'pointer', fontSize: '1rem' }}>&lt;</button>
            <div className="mono-text" style={{ fontSize: '0.6rem', color: 'var(--cyan)' }}>{monthNames[month]} {year}</div>
            <button onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', color: '#fff', opacity: 0.5, cursor: 'pointer', fontSize: '1rem' }}>&gt;</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
            {['D','L','M','X','J','V','S'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '0.5rem', color: '#fff', opacity: 0.3 }}>{d}</div>)}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const dateStr = `${year}-${(month+1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
              const isActive = value === dateStr;
              return (
                <div 
                  key={d} 
                  onClick={() => { onChange(dateStr); setIsOpen(false); }}
                  style={{ 
                    padding: '8px 0', textAlign: 'center', fontSize: '0.75rem', borderRadius: '5px', cursor: 'pointer',
                    background: isActive ? 'var(--cyan)' : 'transparent',
                    color: isActive ? '#000' : '#fff',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => !isActive && (e.target.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => !isActive && (e.target.style.background = 'transparent')}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomTimePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 4 }, (_, i) => (i * 15).toString().padStart(2, '0'));

  const [hVal, mVal] = value ? value.split(':') : ['12', '00'];

  return (
    <div ref={containerRef} style={{ flex: 1, position: 'relative' }}>
      <label className="mono-text" style={{ fontSize: '0.65rem', position: 'absolute', top: '8px', left: '15px', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none', zIndex: 5 }}>HORA</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="input-modern" 
        style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '22px 15px 10px 15px', background: 'rgba(255,255,255,0.02)', color: value ? '#fff' : '#555' }}
      >
        {value || 'HH:MM'}
      </div>

      {isOpen && (
        <div className="dropdown-options glass-widget" style={{ 
          position: 'absolute', top: '100%', right: 0, width: '220px', marginTop: '8px', zIndex: 100, padding: '10px 0', 
          background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(15px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
          display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '260px' 
        }}>
          <div style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '5px' }}>
            <div className="mono-text" style={{ flex: 1, fontSize: '0.6rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>HORARIO</div>
            <div className="mono-text" style={{ flex: 1, fontSize: '0.6rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>MINUTERO</div>
          </div>
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '0 5px' }}>
              {hours.map(h => (
                <div key={h} onClick={() => onChange(`${h}:${mVal}`)} style={{ padding: '12px 0', textAlign: 'center', fontSize: '0.85rem', borderRadius: '8px', cursor: 'pointer', background: hVal === h ? 'var(--violet)' : 'transparent', color: hVal === h ? '#000' : '#fff', margin: '2px 0' }}>{h}</div>
              ))}
            </div>
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '0 5px' }}>
              {minutes.map(m => (
                <div key={m} onClick={() => onChange(`${hVal}:${m}`)} style={{ padding: '12px 0', textAlign: 'center', fontSize: '0.85rem', borderRadius: '8px', cursor: 'pointer', background: mVal === m ? 'var(--violet)' : 'transparent', color: mVal === m ? '#000' : '#fff', margin: '2px 0' }}>{m}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BioAvatar = ({ type }) => {
  const isWolf = type?.toLowerCase().includes('lobo') || type?.toLowerCase().includes('wolf');
  const isLion = type?.toLowerCase().includes('león') || type?.toLowerCase().includes('lion');
  const isDolphin = type?.toLowerCase().includes('delfín') || type?.toLowerCase().includes('dolphin');
  
  const finalColor = isWolf ? 'var(--red)' : isLion ? 'var(--cyan)' : isDolphin ? 'var(--cyan)' : 'var(--violet)';
  const bgColor = isWolf ? '#2a0a10' : isLion ? '#0a252a' : '#1a0a2a';

  return (
    <div className="bio-avatar-thumbs" style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 35px auto' }}>
      {/* Fondo Circular con Cristal */}
      <div style={{ 
        position: 'absolute', inset: 0, borderRadius: '50%', 
        background: bgColor,
        border: '2px solid rgba(255,255,255,0.1)',
        boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px ${finalColor}22`,
        overflow: 'hidden'
      }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', marginTop: '15px' }}>
          {/* Cuerpo Sólido estilo Thumbs */}
          <path 
            d="M25,100 Q25,20 50,20 Q75,20 75,100" 
            fill={finalColor}
          />
          
          {/* Rasgos según animal (Simplificados estilo Thumbs) */}
          {isLion && (
            <path d="M20,40 Q10,15 50,10 Q90,15 80,40" fill="rgba(255,255,255,0.2)" />
          )}
          {isWolf && (
            <>
              <path d="M25,30 L15,10 L40,25" fill={finalColor} />
              <path d="M75,30 L85,10 L60,25" fill={finalColor} />
            </>
          )}
          
          {/* Cara Expresiva Thumbs */}
          <g fill="#000" opacity="0.8">
            {/* Ojos */}
            <circle cx="40" cy="48" r="3.5" />
            <circle cx="60" cy="48" r="3.5" />
            {/* Sonrisa amigable */}
            <path d="M42,62 Q50,68 58,62" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          
          {/* Brillo de superficie (Lujo) */}
          <path d="M35,30 Q40,25 45,30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      
      {/* Glow externo */}
      <div style={{ position: 'absolute', inset: '-10px', borderRadius: '50%', border: `1px solid ${finalColor}33`, filter: 'blur(5px)', pointerEvents: 'none' }}></div>
    </div>
  );
};

const MindMapMock = ({ topic }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // MOCK DATA: Esto vendría de la IA. Podrían ser 3 o 7 temas y se ajustaría igual.
  const rawData = [
    { label: 'Principios', items: ['Entropía', 'Equilibrio'] },
    { label: 'Leyes', items: ['Conservación', 'Degradación'] },
    { label: 'Sistemas', items: ['Abiertos', 'Cerrados'] },
    { label: 'Variables', items: ['P, V, T', 'Entalpía'] },
    { label: 'Procesos', items: ['Isotérmicos', 'Adiabáticos'] }
  ];

  // Motor de Layout Radial: Calcula posiciones automáticamente
  const centerX = 500;
  const centerY = 500;
  const radius = 350;

  const branches = rawData.map((b, i) => {
    const angle = (i * 2 * Math.PI) / rawData.length - Math.PI / 2;
    return {
      ...b,
      id: i,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      delay: `${i * 0.1}s`
    };
  });

  const onMouseDown = (e) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const onMouseUp = () => setIsDragging(false);

  return (
    <div 
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ 
        position: 'relative', width: '100%', height: '100%', overflow: 'hidden', 
        cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none'
      }}
    >
      <div style={{ 
        position: 'absolute', width: '1000px', height: '1000px',
        left: '50%', top: '50%',
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
        transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Dynamic Connections */}
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <filter id="miniGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {branches.map(b => (
            <g key={b.id}>
              <line 
                x1="500" y1="500" x2={b.x} y2={b.y} 
                stroke="rgba(0, 242, 255, 0.15)" strokeWidth="1" filter="url(#miniGlow)" 
              />
              <circle r="2" fill="var(--cyan)">
                <animateMotion dur="3s" repeatCount="indefinite" path={`M500,500 L${b.x},${b.y}`} />
              </circle>
            </g>
          ))}
        </svg>

        {/* Minimal Core */}
        <div style={{
          position: 'absolute', top: '500px', left: '500px', transform: 'translate(-50%, -50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5, pointerEvents: 'none'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)', marginBottom: '12px', boxShadow: '0 0 15px var(--cyan)' }}></div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '4px' }}>{topic}</h3>
        </div>

        {/* Adaptive Nodes */}
        {branches.map(b => (
          <div key={b.id} style={{
            position: 'absolute', left: `${b.x}px`, top: `${b.y}px`, transform: 'translate(-50%, -50%)',
            width: '180px', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid var(--cyan)',
            padding: '10px 15px', zIndex: 10, animation: 'revealIn 0.8s ease forwards', 
            animationDelay: b.delay, opacity: 0
          }}>
            <div className="mono-text" style={{ color: 'var(--cyan)', fontSize: '0.55rem', marginBottom: '6px' }}>{b.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {b.items.map((item, idx) => (
                <div key={idx} style={{ fontSize: '0.8rem', color: '#777', fontWeight: 300 }}>{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FlashcardsMock = ({ topic }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ 
          width: '450px', height: '280px', cursor: 'pointer', perspective: '1200px',
          position: 'relative'
        }}
      >
        <div style={{
          width: '100%', height: '100%', transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          position: 'relative'
        }}>
          {/* Front */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, rgba(188, 19, 254, 0.1) 0%, rgba(188, 19, 254, 0.05) 100%)',
            border: '1px solid rgba(188, 19, 254, 0.3)', borderRadius: '30px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)'
          }}>
            <div className="mono-text" style={{ color: 'var(--violet)', fontSize: '0.65rem', marginBottom: '25px', letterSpacing: '4px' }}>CONCEPTO</div>
            <p style={{ fontSize: '1.6rem', textAlign: 'center', fontWeight: 300, lineHeight: 1.4 }}>¿Cómo afecta el aumento de entropía al orden de un sistema?</p>
          </div>

          {/* Back */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            background: 'rgba(15, 15, 15, 0.98)', transform: 'rotateY(180deg)',
            border: '1px solid var(--violet)', borderRadius: '30px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px',
            boxShadow: '0 0 50px rgba(188, 19, 254, 0.15)', backdropFilter: 'blur(20px)'
          }}>
            <div className="mono-text" style={{ color: 'var(--violet)', fontSize: '0.65rem', marginBottom: '25px', letterSpacing: '4px' }}>RESPUESTA</div>
            <p style={{ fontSize: '1.1rem', textAlign: 'center', lineHeight: 1.8, color: '#bbb', fontWeight: 300 }}>
              El aumento de entropía implica que el sistema pasa de un estado más ordenado a uno de mayor desorden estadístico, disipando energía útil.
            </p>
          </div>
        </div>
      </div>
      <p className="mono-text" style={{ marginTop: '50px', color: '#555', fontSize: '0.6rem', letterSpacing: '3px' }}>CLIC PARA GIRAR • 01 / 12 TARJETAS</p>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('auth'); // auth, onboarding, intro, dashboard, agenda, study
  const [authSubState, setAuthSubState] = useState('welcome'); // welcome, login, register
  const [chronotype, setChronotype] = useState(null);
  const [energyLevel, setEnergyLevel] = useState(0.5);
  const [energyOverride, setEnergyOverride] = useState(5); // Escala 1-10, donde 5 es neutral
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Entregar proyecto de React', tag: 'alta', deadline: 'Hoy 23:59' },
    { id: 2, title: 'Repaso para examen de Física', tag: 'creativa', deadline: 'Mañana' },
    { id: 3, title: 'Organizar apuntes', tag: 'admin', deadline: 'Sin urgencia' }
  ]);
  const [onbStep, setOnbStep] = useState(0);
  const [scores, setScores] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [taskTag, setTaskTag] = useState('alta');
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState('chat'); // chat, mindmap, flashcards
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [panelContent, setPanelContent] = useState(null);
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Hola. Soy Lumi. Estoy monitorizando tu pulso cognitivo en tiempo real. Selecciona cómo quieres aprender hoy (Chat, Mapa Mental o Flashcards) y dime qué necesitas revisar.', status: 'ready' }
  ]);
  
  const [pomodoro, setPomodoro] = useState({ active: false, timeLeft: 25 * 60, taskName: 'Sesión Libre' });
  const pomodoroInterval = useRef(null);

  const [time, setTime] = useState(new Date());

  // Sincronizar el estado con el objeto window.app para que orb.js funcione correctamente
  useEffect(() => {
    window.app = {
      state: currentView,
      authSubState: authSubState,
      energyLevel: energyLevel,
      orbState: ['auth', 'onboarding', 'intro'].includes(currentView) ? 'neutral' : currentView === 'study' ? 'study' : 'dashboard'
    };
  }, [currentView, authSubState, energyLevel]);

  // Manejo del historial del navegador (gesto atrás / botones nativos)
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        if (event.state.view) {
          triggerReaction('transition');
          setCurrentView(event.state.view);
          if (event.state.subState) setAuthSubState(event.state.subState);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    
    // Configurar estado inicial
    window.history.replaceState({ view: currentView, subState: authSubState }, '', `?view=${currentView}&auth=${authSubState}`);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Engine de tiempo
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      updateEnergy(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [chronotype]);

  const updateEnergy = (d) => {
    let h = d.getHours() + d.getMinutes() / 60;
    let peakShift = chronotype === 'León (Matutino)' ? -2 : chronotype === 'Lobo (Nocturno)' ? 4 : 0;
    let effectiveHour = (h - peakShift + 24) % 24;

    let e = 0.5;
    if (chronotype === 'Delfín (Adaptable)') {
      e = 0.5 + (Math.sin(effectiveHour * 1.5) * 0.2);
    } else {
      const mapScale = (val, inMin, inMax, outMin, outMax) => (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
      if (effectiveHour >= 6 && effectiveHour < 10) e = mapScale(effectiveHour, 6, 10, 0.3, 1.0);
      else if (effectiveHour >= 10 && effectiveHour < 14) e = mapScale(effectiveHour, 10, 14, 1.0, 0.2);
      else if (effectiveHour >= 14 && effectiveHour < 18) e = mapScale(effectiveHour, 14, 18, 0.2, 0.8);
      else if (effectiveHour >= 18 && effectiveHour < 22) e = mapScale(effectiveHour, 18, 22, 0.8, 0.3);
      else if (effectiveHour >= 22) e = mapScale(effectiveHour, 22, 24, 0.3, 0.0);
      else if (effectiveHour < 6) e = mapScale(effectiveHour, 0, 6, 0.0, 0.3);
    }

    // Aplicar overrides manuales basados en escala 1-10
    // 5 es neutro (1x). <5 baja energía. >5 sube energía.
    const multiplier = energyOverride / 5;
    e = Math.min(1, e * multiplier);

    setEnergyLevel(e);
  };

  const changeAuthSubState = (newSubState, replace = false) => {
    setAuthSubState(newSubState);
    const stateObj = { view: currentView, subState: newSubState };
    const url = `?view=${currentView}&auth=${newSubState}`;
    if (replace) {
      window.history.replaceState(stateObj, '', url);
    } else {
      window.history.pushState(stateObj, '', url);
    }
  };

  const navTo = (newState, replace = false) => {
    triggerReaction('transition');
    setCurrentView(newState);

    let sub = authSubState;
    if (newState === 'auth') {
      if(window.app) window.app.orbState = 'neutral';
      sub = 'welcome';
      setAuthSubState('welcome');
    } else if (newState === 'dashboard' || newState === 'agenda') {
      if(window.app) window.app.orbState = 'dashboard';
    } else if (newState === 'study') {
      if(window.app) window.app.orbState = 'study';
    }

    const stateObj = { view: newState, subState: sub };
    const url = `?view=${newState}` + (newState === 'auth' ? `&auth=${sub}` : '');
    if (replace) {
      window.history.replaceState(stateObj, '', url);
    } else {
      window.history.pushState(stateObj, '', url);
    }

    const overlay = document.getElementById('global-overlay');
    if (newState === 'auth' || newState === 'onboarding' || newState === 'intro') {
      if (overlay) overlay.style.opacity = (newState === 'onboarding' || newState === 'intro') ? '1' : '0';
    } else {
      if (overlay) overlay.style.opacity = newState === 'dashboard' ? '0' : '1';
    }
  };

  const login = () => {
    triggerReaction('transition');
    setTimeout(() => {
      if (!chronotype) setChronotype('Oso (Intermedio)');
      navTo('intro');
    }, 300);
  };

  const startRegistrationFlow = () => {
    triggerReaction('transition');
    setTimeout(() => {
      navTo('onboarding');
      setOnbStep(0);
      setScores([]);
    }, 300);
  };

  const answerOnb = (val) => {
    triggerReaction('click');
    const newScores = [...scores, val === 'V' ? 'V' : parseInt(val)];
    setScores(newScores);
    
    if (onbStep + 1 >= questions.length) {
      let varCount = newScores.filter(v => v === 'V').length;
      if (varCount >= 3) setChronotype('Delfín (Adaptable)');
      else {
        let nScores = newScores.map(v => v === 'V' ? 2 : v);
        let sum = nScores.reduce((a, b) => a + b, 0);
        if (sum <= 7) setChronotype('León (Matutino)');
        else if (sum <= 11) setChronotype('Oso (Intermedio)');
        else setChronotype('Lobo (Nocturno)');
      }
      navTo('auth');
      changeAuthSubState('register', true);
    } else {
      setOnbStep(onbStep + 1);
    }
  };

  const finishRegistration = () => {
    triggerReaction('transition');
    setTimeout(() => {
      navTo('intro');
    }, 300);
  };

  const addTask = () => {
    if (!taskInput.trim()) return;
    const newTask = {
      id: Date.now(),
      title: taskInput,
      tag: taskTag,
      deadline: (taskDate && taskTime) ? `${taskDate} | ${taskTime}` : taskDate || taskTime || 'Próximamente'
    };
    setTasks([...tasks, newTask]);
    setTaskInput('');
    setTaskDate('');
    setTaskTime('');
    triggerReaction('click');
  };

  const handleTaskClick = (id, tag, title) => {
    triggerReaction('click');
    if (tag === 'alta' && energyLevel < 0.4) {
      alert("SISTEMA SATURADO: Estás en un Valle Energético. Iniciar tareas de 'Alta Carga' puede causar burnout.");
    } else {
      setTasks(tasks.filter(t => t.id !== id));
      startPomodoro(title);
    }
  };

  const startPomodoro = (taskName = 'Sesión Libre') => {
    setPomodoro(p => ({ ...p, active: true, timeLeft: 25 * 60, taskName }));
    clearInterval(pomodoroInterval.current);
    pomodoroInterval.current = setInterval(() => {
      setPomodoro(prev => {
        if (!prev.active) return prev;
        const newTime = prev.timeLeft - 1;
        if (newTime <= 0) {
          clearInterval(pomodoroInterval.current);
          alert("¡Sesión completada! Es hora de tu Check-in de fatiga.");
          return { ...prev, active: false, timeLeft: 0 };
        }
        return { ...prev, timeLeft: newTime };
      });
    }, 1000);
  };

  const togglePomodoro = () => {
    triggerReaction('click');
    if (!pomodoro.active && pomodoro.timeLeft === 25 * 60) {
      startPomodoro(pomodoro.taskName);
      return;
    }
    setPomodoro(p => ({ ...p, active: !p.active }));
  };

  const sendChatMessage = () => {
    triggerReaction('transition');
    const topic = chatInput.trim();
    if (!topic) return;

    setChatHistory(h => [...h, { role: 'user', content: topic }]);
    setChatInput('');
    
    const loadingId = Date.now();
    
    if (chatMode === 'chat') {
      setChatHistory(h => [...h, { role: 'ai', content: 'Lumi procesando tu estado...', status: 'loading', id: loadingId }]);
      setTimeout(() => {
        triggerReaction('click');
        setChatHistory(h => h.map(msg => {
          if (msg.id === loadingId) {
            let reply = '';
            if (energyLevel > 0.6) {
              reply = `[ ESTADO ÓPTIMO DETECTADO ]\nEstás en tu pico cognitivo. Para el tema de ${topic}, te recomiendo enfocarnos en la lógica profunda. ¿Quieres que te escriba el desglose completo de la teoría o prefieres hacer un ejercicio práctico?`;
            } else if (energyLevel < 0.4) {
              reply = `[ FATIGA DETECTADA ]\nNoto que tu energía está muy baja ahora. No intentemos asimilar nada pesado sobre ${topic}. Te he preparado un resumen textual rápido de 3 puntos clave para leer sin esfuerzo. ¿Te lo muestro?`;
            } else {
              reply = `[ ESTADO ESTABLE ]\nTu energía está en niveles medios. Vamos a repasar ${topic} a un ritmo tranquilo. Te daré la teoría general por texto y tú me dices si quieres profundizar en alguna parte.`;
            }
            return { ...msg, content: reply, status: 'ready', energyLevel: energyLevel };
          }
          return msg;
        }));
      }, 1500);
    } else {
      setChatHistory(h => [...h, { role: 'ai', content: `Iniciando síntesis visual: ${chatMode === 'mindmap' ? 'Mapa Mental' : 'Flashcards'} sobre "${topic}"...`, status: 'loading', id: loadingId }]);
      setIsPanelOpen(true);
      setPanelContent({ type: chatMode, topic: topic, status: 'loading' });

      setTimeout(() => {
        triggerReaction('click');
        setChatHistory(h => h.map(msg => {
          if (msg.id === loadingId) {
            return { ...msg, content: `¡Listo! He estructurado la información a la derecha para que la repases. Puedes seguir preguntándome detalles por aquí.`, status: 'ready', energyLevel: energyLevel };
          }
          return msg;
        }));
        setPanelContent(prev => ({ ...prev, status: 'ready' }));
      }, 2500);
    }
  };

  // Onboarding Data
  const questions = [
    { title: "Inercia Cognitiva", desc: "Mide el tiempo de 'arranque' de tu cerebro.", q: "En un día libre de clases, al despertar, ¿cuánto tiempo necesitas antes de sentir que tu mente está lista para resolver un problema complejo?", opts: [{ text: "Menos de 15 min (Despierto alerta)", val: 1 }, { text: "Entre 30 y 60 min (Necesito mi tiempo)", val: 2 }, { text: "Más de 2 horas (Las mañanas me cuestan)", val: 3 }, { text: "Depende totalmente del día", val: 'V' }] },
    { title: "Pico de Retención", desc: "Ventana de máxima absorción natural.", q: "Si tuvieras que estudiar para el examen más difícil del semestre, ¿en qué momento del día sientes que te concentras mejor?", opts: [{ text: "En la mañana (8:00 AM - 12:00 PM)", val: 1 }, { text: "A media tarde (3:00 PM - 7:00 PM)", val: 2 }, { text: "Tarde en la noche o madrugada", val: 3 }, { text: "Mis picos de atención son irregulares", val: 'V' }] },
    { title: "Ventana de Descanso", desc: "El reloj biológico dicta tu cierre operativo.", q: "Durante las vacaciones, cuando no tienes que madrugar para ir a la escuela, ¿a qué hora prefieres irte a dormir de forma natural?", opts: [{ text: "Temprano (Antes de las 10:30 PM)", val: 1 }, { text: "Intermedio (11:00 PM a 12:30 AM)", val: 2 }, { text: "Muy tarde (Después de la 1:00 AM)", val: 3 }, { text: "No tengo un patrón de sueño fijo", val: 'V' }] },
    { title: "Reloj Metabólico", desc: "La sincronía gástrica con el enfoque.", q: "¿Cómo es tu nivel de apetito durante la primera hora después de despertar para ir a clases?", opts: [{ text: "Alto, necesito desayunar de inmediato", val: 1 }, { text: "Bajo, prefiero empezar con solo líquidos", val: 2 }, { text: "Nulo, no me da hambre tan temprano", val: 3 }, { text: "A veces me levanto con hambre y otras no", val: 'V' }] },
    { title: "Recuperación Post-Estudio", desc: "Liberación de saturación del sistema nervioso.", q: "Después de presentar una semana de exámenes finales agotadora, ¿cuál es tu forma preferida de reiniciar tu mente?", opts: [{ text: "Hacer actividad física o salir al aire libre", val: 1 }, { text: "Aislarme, descansar en silencio y dormir", val: 2 }, { text: "Quedarme hasta tarde en algo creativo/ocio", val: 3 }, { text: "Cambio de método constantemente", val: 'V' }] }
  ];

  // Helper renderers
  const renderPomodoroTime = () => {
    let m = Math.floor(pomodoro.timeLeft / 60);
    let s = pomodoro.timeLeft % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getSuggestedTask = () => {
    if (tasks.length === 0) return null;
    let suggestedTask = tasks[0];
    if (energyLevel > 0.6) {
      let highLoad = tasks.find(t => t.tag === 'alta');
      if (highLoad) suggestedTask = highLoad;
    } else {
      let lowLoad = tasks.find(t => t.tag === 'admin' || t.tag === 'creativa');
      if (lowLoad) suggestedTask = lowLoad;
    }
    return suggestedTask;
  };

  const suggestedTask = getSuggestedTask();

  return (
    <>
      {/* GLOBAL TOP BAR */}
      <div id="global-top-bar" style={{ 
        display: ['auth', 'onboarding', 'intro'].includes(currentView) ? 'none' : 'grid', 
        position: 'absolute', top: 0, left: 0, width: '100%', padding: '25px 50px', 
        zIndex: 100, pointerEvents: 'none', gridTemplateColumns: '1fr auto 1fr', alignItems: 'flex-start',
        opacity: isNavbarCollapsed ? 0 : 1, transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isNavbarCollapsed ? 'translateY(-20px)' : 'translateY(0)'
      }}>
        <div style={{ pointerEvents: isNavbarCollapsed ? 'none' : 'all', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div id="dash-time" style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
            {time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div id="dash-chrono" className="mono-text" style={{ color: 'var(--cyan)', marginTop: '5px', fontSize: '0.7rem', opacity: 0.7 }}>{chronotype || 'OSO (INTERMEDIO)'}</div>
          
          {/* NEURO-STATUS INDICATOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ 
              width: '6px', height: '6px', borderRadius: '50%', 
              background: energyLevel > 0.6 ? 'var(--cyan)' : energyLevel < 0.4 ? '#ff2d55' : 'var(--violet)',
              boxShadow: `0 0 12px ${energyLevel > 0.6 ? 'var(--cyan)' : energyLevel < 0.4 ? '#ff2d55' : 'var(--violet)'}`,
              animation: 'pulse 2s infinite ease-in-out'
            }}></div>
            <div className="mono-text" style={{ fontSize: '0.55rem', letterSpacing: '1px', color: energyLevel > 0.6 ? 'var(--cyan)' : energyLevel < 0.4 ? '#ff2d55' : 'var(--violet)' }}>
              {energyLevel > 0.6 ? 'EN TRANCE (FLOW)' : energyLevel < 0.4 ? 'NIVEL DE FATIGA ALTO' : 'EQUILIBRIO COGNITIVO'}
            </div>
          </div>
        </div>

        <div style={{ pointerEvents: 'all', display: 'flex', justifyContent: 'center' }}>
          <div className="main-dock" style={{ 
            padding: isNavbarCollapsed ? '10px 15px' : '10px 40px', 
            borderRadius: isNavbarCollapsed ? '20px' : '40px',
            gap: isNavbarCollapsed ? '10px' : '30px',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <button className={`dock-btn ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => navTo('dashboard')} style={{ padding: isNavbarCollapsed ? '10px' : '10px' }}>
              {isNavbarCollapsed ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> : 'ESTADO'}
            </button>
            <button className={`dock-btn ${currentView === 'agenda' ? 'active' : ''}`} onClick={() => navTo('agenda')} style={{ padding: isNavbarCollapsed ? '10px' : '10px' }}>
              {isNavbarCollapsed ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> : 'AGENDA'}
            </button>
            <button className={`dock-btn ${currentView === 'study' ? 'active' : ''}`} onClick={() => navTo('study')} style={{ padding: isNavbarCollapsed ? '10px' : '10px' }}>
              {isNavbarCollapsed ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg> : 'LUMI'}
            </button>
            <button className={`dock-btn ${currentView === 'profile' ? 'active' : ''}`} onClick={() => navTo('profile')} style={{ padding: '0 10px', display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: currentView === 'profile' ? 1 : 0.6 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </button>
          </div>
        </div>

        <div style={{ pointerEvents: 'all', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '10px 20px 10px 25px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(15px)' }}>
            <div style={{ textAlign: 'right' }}>
              <div id="pomodoro-time" style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: '#888', lineHeight: 1 }}>{renderPomodoroTime()}</div>
              <div id="pomodoro-status" className="mono-text" style={{ fontSize: '0.6rem', color: pomodoro.active ? 'var(--cyan)' : '#555', marginTop: '5px', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {pomodoro.active ? `EN CURSO: ${pomodoro.taskName}` : pomodoro.timeLeft === 0 ? 'DESCANSO' : pomodoro.timeLeft < 25 * 60 ? 'PAUSADO' : 'SIN TAREA ACTIVA'}
              </div>
            </div>
            <button className="btn-icon" onClick={togglePomodoro} style={{ width: '45px', height: '45px', borderColor: 'rgba(255,255,255,0.1)' }}>
              {pomodoro.active ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MODULES */}
      {currentView === 'auth' && (
        <div id="mod-auth" className="module active" style={{ zIndex: 15 }}>
          {/* WELCOME VIEW */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transition: 'all 0.8s ease', overflowY: 'auto', overflowX: 'hidden', opacity: authSubState === 'welcome' ? 1 : 0, pointerEvents: authSubState === 'welcome' ? 'all' : 'none', transform: authSubState === 'welcome' ? 'translateY(0)' : 'translateY(-20px)' }}>
            <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '40px', right: '50px', display: 'flex', gap: '30px', zIndex: 20 }}>
                <button className="nav-link" onClick={() => document.getElementById('about-scroll-target')?.scrollIntoView({ behavior: 'smooth' })} style={{ color: '#ccc' }}>¿CÓMO FUNCIONA?</button>
                <button className="nav-link" onClick={() => changeAuthSubState('login')} style={{ color: '#ccc' }}>INICIAR SESIÓN</button>
              </div>

              <div style={{ textAlign: 'center', width: '100%', maxWidth: '950px', zIndex: 10 }}>
                <h1 style={{ fontSize: '6.5rem', letterSpacing: '25px', marginBottom: '20px' }}>CIRCADIA</h1>
                <p className="mono-text" style={{ fontSize: '1rem', letterSpacing: '10px', marginBottom: '80px' }}>Gestor Biológico Estudiantil</p>
                <button className="btn" style={{ width: 'auto', padding: '20px 60px', fontSize: '1rem', letterSpacing: '4px' }} onClick={startRegistrationFlow}>INICIAR DIAGNÓSTICO</button>
              </div>
              <div className="mono-text" style={{ position: 'absolute', bottom: '40px', letterSpacing: '4px' }}>↓ Descubre el sistema ↓</div>
            </div>

            <div id="about-scroll-target" style={{ minHeight: '100vh', padding: '120px 50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7), rgba(0,0,0,0.95))' }}>
              <div style={{ textAlign: 'center', marginBottom: '70px' }}>
                <p className="mono-text" style={{ color: 'var(--cyan)', marginBottom: '20px', letterSpacing: '4px' }}>LA CIENCIA DETRÁS DEL RENDIMIENTO</p>
                <h2 style={{ fontSize: '4rem', marginBottom: '30px', lineHeight: 1.1 }}>Sincronía Estudiantil.</h2>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.8, color: '#bbb' }}>Circadia rompe el modelo lineal de estudio: no se trata de estudiar más horas, sino de estudiar en las horas correctas. Evaluamos tu reloj biológico para reorganizar tus proyectos justo cuando tu cerebro está en su pico de máxima absorción natural.</p>
              </div>

              <div style={{ display: 'flex', gap: '40px', maxWidth: '1200px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                {/* Feature cards simplified for brevity in React implementation */}
                <div style={{ flex: 1, minWidth: '320px' }}>
                  <div className="glass-widget card-feature" style={{ height: '100%', textAlign: 'left', padding: '40px' }}>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '15px' }}>Lumi: Tu Biomarcador</h3>
                    <p style={{ fontSize: '0.95rem', color: '#aaa', lineHeight: 1.6 }}>Tu identidad digital visualizada en una Orbe interactiva. Lumi respira, se acelera y muestra signos de fatiga en tiempo real, reflejando tu nivel de energía exacto.</p>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: '320px' }}>
                  <div className="glass-widget card-feature" style={{ height: '100%', textAlign: 'left', padding: '40px' }}>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '15px' }}>Auto-Scheduler</h3>
                    <p style={{ fontSize: '0.95rem', color: '#aaa', lineHeight: 1.6 }}>Olvídate de organizar tu agenda. El sistema sincronizado con Lumi distribuye automáticamente tus tareas más pesadas justo en tus picos de máxima concentración.</p>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: '320px' }}>
                  <div className="glass-widget card-feature" style={{ height: '100%', textAlign: 'left', padding: '40px' }}>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '15px' }}>Neuro-Asistencia Textual</h3>
                    <p style={{ fontSize: '0.95rem', color: '#aaa', lineHeight: 1.6 }}>Lumi también es tu compañera de estudio. Adapta la longitud y complejidad de sus explicaciones según tu nivel de energía.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LOGIN VIEW */}
          <div style={{ position: 'absolute', top: '50%', left: '10%', transform: authSubState === 'login' ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(-50px)', opacity: authSubState === 'login' ? 1 : 0, pointerEvents: authSubState === 'login' ? 'all' : 'none', transition: 'all 0.8s ease', width: '450px', zIndex: 20 }}>
            <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button className="btn-icon" onClick={() => window.history.back()}>←</button>
              <p className="mono-text" style={{ color: 'var(--cyan)', margin: 0 }}>Acceso</p>
            </div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '40px', lineHeight: 1.1 }}>Iniciar Sesión.</h2>
            <div className="input-group"><label>CORREO INSTITUCIONAL</label><input className="input-modern" type="email" placeholder="alumno@universidad.edu" /></div>
            <div className="input-group"><label>CONTRASEÑA</label><input className="input-modern" type="password" placeholder="••••••••" /></div>
            <button className="btn" onClick={login}>ENTRAR</button>
          </div>

          {/* REGISTER VIEW */}
          <div style={{ position: 'absolute', top: '50%', left: '10%', transform: authSubState === 'register' ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(-50px)', opacity: authSubState === 'register' ? 1 : 0, pointerEvents: authSubState === 'register' ? 'all' : 'none', transition: 'all 0.8s ease', width: '450px', zIndex: 20 }}>
            <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button className="btn-icon" onClick={() => window.history.back()}>←</button>
              <p className="mono-text" style={{ color: 'var(--cyan)', margin: 0 }}>Registro de Cronotipo</p>
            </div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '40px', lineHeight: 1.1 }}>Crear Cuenta.</h2>
            <div className="input-group"><label>NOMBRE</label><input className="input-modern" type="text" placeholder="Ej. Alex..." /></div>
            <div className="input-group"><label>CORREO</label><input className="input-modern" type="email" placeholder="tu@correo.com" /></div>
            <div className="input-group"><label>CONTRASEÑA</label><input className="input-modern" type="password" placeholder="Crea tu clave" /></div>
            <button className="btn" onClick={finishRegistration}>COMPLETAR PERFIL</button>
          </div>
        </div>
      )}

      {currentView === 'onboarding' && questions[onbStep] && (
        <div id="mod-onboarding" className="module active" style={{ zIndex: 15, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '850px', textAlign: 'center', position: 'relative', zIndex: 20 }}>
            <p className="mono-text" style={{ color: 'var(--cyan)', marginBottom: '20px' }}>Fase {onbStep + 1}</p>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>{questions[onbStep].title}</h2>
            <p className="mono-text" style={{ marginBottom: '60px' }}>{questions[onbStep].desc}</p>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '50px' }}>{questions[onbStep].q}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
              {questions[onbStep].opts.map((opt, i) => (
                <button key={i} className="btn" style={{ textTransform: 'none', padding: '20px', background: 'rgba(18,18,18,0.3)', maxWidth: '600px', textAlign: 'center' }} onClick={() => answerOnb(opt.val)}>{opt.text}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentView === 'intro' && (
        <div id="mod-intro" className="module active" style={{ zIndex: 15, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-widget" style={{ width: '100%', maxWidth: '1000px', textAlign: 'center', position: 'relative', zIndex: 20, padding: '60px' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Conoce a Lumi.</h2>
            <p style={{ fontSize: '1.1rem', color: '#aaa', marginBottom: '50px', lineHeight: 1.6, maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
              Antes de empezar, necesitas saber cómo interpretar a Lumi. Como tu biomarcador visual, su color y su pulso te dirán en tiempo real el estado exacto de tu energía para que sepas qué tareas puedes realizar sin agotarte.
            </p>
            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginBottom: '60px', textAlign: 'left' }}>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(0, 242, 255, 0.1)' }}>
                <h4 style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '10px' }}>ESTADO ÓPTIMO</h4>
                <p style={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.6 }}>Lumi palpita rápido en tonos <b>Cyan</b>. Estás en tu pico máximo de energía.</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(188, 19, 254, 0.1)' }}>
                <h4 style={{ color: 'var(--violet)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '10px' }}>ESTADO ESTABLE</h4>
                <p style={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.6 }}>Lumi tiene un pulso normal en tonos <b>Violeta</b>. Tu energía es media.</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255, 0, 80, 0.1)' }}>
                <h4 style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '10px' }}>FATIGA / VALLE</h4>
                <p style={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.6 }}>Lumi respira lento en tonos <b>Rojos</b>. Tu cerebro necesita descansar.</p>
              </div>
            </div>
            <button className="btn" style={{ maxWidth: '350px', padding: '20px', fontSize: '0.9rem' }} onClick={() => navTo('dashboard')}>ENTENDIDO, IR A MI ESTADO</button>
          </div>
        </div>
      )}

      {currentView === 'dashboard' && (
        <div id="mod-dashboard" className="module active" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100vh', width: '100%', padding: '0 80px', boxSizing: 'border-box', pointerEvents: 'none', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
          <div className="glass-widget" style={{ width: '380px', pointerEvents: 'all' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Inbox Rápido</h3>
            <p className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '25px', letterSpacing: '1px' }}>CAPTURA TAREAS ANTES DE OLVIDARLAS.</p>
            <input type="text" value={taskInput} onChange={e => setTaskInput(e.target.value)} placeholder="¿Qué tarea tienes pendiente?" className="input-modern" style={{ marginBottom: '12px', fontSize: '0.9rem', padding: '15px' }} />
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <CustomDatePicker value={taskDate} onChange={setTaskDate} />
              <CustomTimePicker value={taskTime} onChange={setTaskTime} />
            </div>

            <CustomDropdown value={taskTag} onChange={setTaskTag} options={taskOptions} />
            <button className="btn" style={{ padding: '15px', width: '100%', fontSize: '0.85rem', letterSpacing: '2px' }} onClick={addTask}>AÑADIR A LA AGENDA</button>
          </div>

          <div className="glass-widget" style={{ width: '380px', pointerEvents: 'all' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Próxima Acción</h3>
            <p className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '25px', letterSpacing: '1px' }}>SUGERIDA POR TU RELOJ BIOLÓGICO.</p>
            <div>
              {!suggestedTask ? (
                <div style={{ padding: '30px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.9rem', color: '#888', margin: 0 }}>No hay tareas en el Inbox.</p>
                </div>
              ) : (
                <div className="task-item" style={{ '--task-color': suggestedTask.tag === 'alta' ? 'var(--cyan)' : suggestedTask.tag === 'creativa' ? 'var(--violet)' : '#ffb400', padding: '25px', display: 'block', cursor: 'pointer' }} onClick={() => handleTaskClick(suggestedTask.id, suggestedTask.tag, suggestedTask.title)}>
                  <span className="task-tag" style={{ color: suggestedTask.tag === 'alta' ? 'var(--cyan)' : suggestedTask.tag === 'creativa' ? 'var(--violet)' : '#ffb400', display: 'block', marginBottom: '8px', fontSize: '0.7rem', letterSpacing: '1px' }}>
                    {taskOptions.find(opt => opt.value === suggestedTask.tag)?.label.toUpperCase()} - SUGERIDA AHORA
                  </span>
                  <div className="task-title" style={{ fontSize: '1.15rem', marginBottom: '15px' }}>{suggestedTask.title}</div>
                  <div style={{ color: 'var(--cyan)', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>[ INICIAR SESIÓN ]</div>
                </div>
              )}
            </div>
            <button className="btn" style={{ padding: '15px', marginTop: '20px', width: '100%', borderColor: 'rgba(0, 242, 255, 0.3)', fontSize: '0.85rem', letterSpacing: '2px', background: 'rgba(0,242,255,0.05)' }} onClick={() => navTo('agenda')}>VER AGENDA COMPLETA</button>
          </div>
        </div>
      )}

      {currentView === 'agenda' && (
        <div id="mod-agenda" className="module active" style={{ overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '140px 50px 150px 50px' }}>
            {/* AGENDA HEADER / SELECTORS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Auto-Scheduler</h2>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {['DÍA', 'SEMANA', 'MES'].map(mode => (
                  <button key={mode} className="mono-text" style={{ background: mode === 'DÍA' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '2px' }}>{mode}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
              {/* MAIN TASKS AREA */}
              <div style={{ flex: 3 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {tasks.length === 0 ? (
                    <div className="glass-widget" style={{ textAlign: 'center', padding: '100px 0' }}>
                      <p style={{ color: '#555', fontSize: '1.2rem' }}>Tu agenda está despejada.</p>
                      <button className="btn" style={{ width: 'auto', padding: '10px 30px' }} onClick={() => navTo('dashboard')}>CAPTURAR TAREA</button>
                    </div>
                  ) : tasks.map(t => {
                    let hexColor = t.tag === 'alta' ? 'var(--cyan)' : t.tag === 'creativa' ? 'var(--violet)' : '#ffb400';
                    let tagLabel = taskOptions.find(opt => opt.value === t.tag)?.label || 'Desconocido';
                    return (
                      <div key={t.id} className="task-item" style={{ '--task-color': hexColor, background: 'rgba(255,255,255,0.02)' }} onClick={() => handleTaskClick(t.id, t.tag, t.title)}>
                        <div className="task-info">
                          <span className="task-title" style={{ display: 'block', color: '#fff', fontSize: '1.1rem' }}>{t.title}</span>
                          <span className="task-tag" style={{ color: hexColor, opacity: 0.8 }}>{tagLabel} • {t.deadline}</span>
                        </div>
                        <div style={{ color: hexColor, fontSize: '0.65rem', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>[ INICIAR SESIÓN ]</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* URGENT SIDEBAR */}
              <div style={{ flex: 1.2 }}>
                <div className="glass-widget" style={{ padding: '30px', border: '1px solid rgba(255,0,80,0.1)' }}>
                  <h3 className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--red)', marginBottom: '20px', letterSpacing: '2px' }}>TAREAS URGENTES</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {tasks.filter(t => t.tag === 'alta').slice(0, 3).map(t => (
                      <div key={t.id} style={{ borderLeft: '2px solid var(--red)', paddingLeft: '15px' }}>
                        <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>{t.title}</div>
                        <div className="mono-text" style={{ fontSize: '0.55rem', color: '#555' }}>ENTREGA: {t.deadline}</div>
                      </div>
                    ))}
                    {tasks.filter(t => t.tag === 'alta').length === 0 && (
                      <p style={{ fontSize: '0.8rem', color: '#444' }}>No hay alertas críticas detectadas.</p>
                    )}
                  </div>
                </div>
                
                <div className="glass-widget" style={{ marginTop: '20px', padding: '30px' }}>
                  <h3 className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--cyan)', marginBottom: '20px', letterSpacing: '2px' }}>CONSEJO BIOLÓGICO</h3>
                  <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.6 }}>
                    {energyOverride === 'fatigue' ? 
                      'Corrección por desvelo activa: Tu energía está limitada. Prioriza el descanso y tareas de baja carga hoy.' :
                      `Tu energía está en ${energyLevel > 0.6 ? 'Pico' : 'Fase estable'}. Es un buen momento para ${energyLevel > 0.6 ? 'enfrentar las tareas de Alta Carga' : 'gestionar tareas administrativas'}.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'profile' && (
        <div id="mod-profile" className="module active" style={{ overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '140px 50px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Identidad Biológica</h2>
              <p className="mono-text" style={{ color: 'var(--cyan)', letterSpacing: '4px' }}>NIVEL 1</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'stretch' }}>
              {/* PANEL PRINCIPAL: ESTADO Y CALIBRACIÓN */}
              <div className="glass-widget" style={{ padding: '50px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 className="mono-text" style={{ fontSize: '0.9rem', color: 'var(--violet)', marginBottom: '40px', letterSpacing: '4px' }}>MONITOREO NEURAL ACTIVO</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '7rem', fontWeight: 700, lineHeight: 1 }}>{(energyLevel * 100).toFixed(0)}%</div>
                    <div>
                      <div className="mono-text" style={{ fontSize: '1rem', color: 'var(--cyan)', marginBottom: '5px', letterSpacing: '2px' }}>ESTADO ACTUAL</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 300 }}>
                        {energyLevel > 0.75 ? "Lógica Máxima" : energyLevel > 0.45 ? "Foco Creativo" : "Gestión Rutinaria"}
                      </div>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '1.1rem', color: '#bbb', maxWidth: '600px', marginBottom: '60px', lineHeight: 1.6 }}>
                    Tu cerebro está listo para <b>{energyLevel > 0.75 ? 'resolver problemas complejos y análisis' : energyLevel > 0.45 ? 'diseñar, escribir y crear' : 'organizar correos y tareas administrativas'}</b>.
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                      <h4 className="mono-text" style={{ fontSize: '0.9rem', color: '#888', margin: 0 }}>SINTONIZACIÓN MANUAL</h4>
                      <div style={{ fontSize: '1.2rem', color: energyOverride > 5 ? 'var(--cyan)' : energyOverride < 5 ? 'var(--red)' : '#fff', fontWeight: 700 }}>
                        {energyOverride}/10
                      </div>
                    </div>
                    
                    <input 
                      type="range" min="1" max="10" step="1" 
                      value={energyOverride}
                      onChange={(e) => setEnergyOverride(parseInt(e.target.value))}
                      style={{ 
                        width: '100%', height: '8px', borderRadius: '10px', appearance: 'none', cursor: 'pointer',
                        background: `linear-gradient(to right, var(--red) 0%, var(--violet) 50%, var(--cyan) 100%)`
                      }}
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                      <span className="mono-text" style={{ fontSize: '0.6rem', color: 'var(--red)' }}>1 - AGOTADO</span>
                      <span className="mono-text" style={{ fontSize: '0.6rem', color: '#555' }}>5 - NEUTRAL</span>
                      <span className="mono-text" style={{ fontSize: '0.6rem', color: 'var(--cyan)' }}>10 - ÓPTIMO</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '25px', lineHeight: 1.5 }}>
                      Ajusta este valor si sientes que tu capacidad actual no coincide con tu ciclo circadiano.
                    </p>
                  </div>
                </div>
              </div>

              {/* COLUMNA LATERAL: CRONOTIPO Y NIVEL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className="glass-widget" style={{ padding: '40px' }}>
                  <h3 className="mono-text" style={{ fontSize: '0.9rem', color: 'var(--cyan)', marginBottom: '25px', letterSpacing: '2px' }}>CRONOTIPO</h3>
                  <div style={{ fontSize: '1.8rem', marginBottom: '20px', fontWeight: 600 }}>{chronotype?.split(' ')[0] || 'Oso'}</div>
                  <p style={{ fontSize: '1rem', color: '#999', lineHeight: 1.6, margin: 0 }}>
                    {chronotype?.includes('Lobo') ? "Productividad nocturna. Tu pico de dopamina es al anochecer." :
                     chronotype?.includes('León') ? "Madrugador eficiente. Energía máxima al amanecer." :
                     chronotype?.includes('Delfín') ? "Adaptable. Ráfagas de alta intensidad cognitiva." :
                     "Ciclo solar. Productividad máxima a media mañana."}
                  </p>
                </div>

                <div className="glass-widget" style={{ padding: '40px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                  <div className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--cyan)', marginBottom: '20px', letterSpacing: '6px' }}>ESTADO</div>
                  <div style={{ fontSize: '3rem', fontWeight: 700 }}>NIVEL 1</div>
                  <div style={{ marginTop: '30px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '30%', height: '100%', background: 'var(--cyan)', boxShadow: '0 0 15px var(--cyan)' }}></div>
                  </div>
                  <p className="mono-text" style={{ fontSize: '0.65rem', color: '#555', marginTop: '15px' }}>PRÓXIMO RANGO: 750 PTS</p>
                </div>
              </div>
            </div>

            <button className="btn" style={{ marginTop: '50px', borderColor: 'rgba(255,255,255,0.1)', color: '#666' }} onClick={() => { setChronotype(''); navTo('auth'); }}>REINICIAR DIAGNÓSTICO MCTQ</button>
          </div>
        </div>
      )}

      {currentView === 'study' && (
        <div id="mod-study" className="module active" style={{ 
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          zIndex: 10, overflow: 'hidden', padding: 0
        }}>
          
          {/* RIGHT CANVAS LAYER: Floating content (Flashcards, etc.) */}
          <div style={{ 
            position: 'absolute', 
            right: '40px', 
            top: '120px', 
            bottom: '80px', 
            left: (isChatCollapsed || !isPanelOpen) ? '40px' : '460px', 
            zIndex: 1, 
            opacity: isPanelOpen ? 1 : 0, 
            pointerEvents: isPanelOpen ? 'all' : 'none',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {panelContent?.status === 'loading' ? (
              <div style={{ textAlign: 'center' }}>
                <div className="ai-spinner" style={{ width: '60px', height: '60px', marginBottom: '30px' }}></div>
                <p className="mono-text" style={{ color: 'var(--cyan)', letterSpacing: '5px' }}>GENERANDO FLASHCARDS...</p>
              </div>
            ) : (isPanelOpen && panelContent) && (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FlashcardsMock topic={panelContent.topic} />
              </div>
            )}
          </div>

          {/* HUD LAYER: Floating Chat Console */}
          {!isChatCollapsed && (
            <div className="glass-widget" style={{ 
              position: 'absolute', 
              left: isPanelOpen ? '40px' : '50%', 
              top: isPanelOpen ? '120px' : '50%',
              transform: isPanelOpen ? 'none' : 'translate(-50%, -50%)',
              bottom: '40px', 
              width: isPanelOpen ? '380px' : '850px', 
              height: isPanelOpen ? 'auto' : '650px',
              maxWidth: '92vw',
              zIndex: 50, display: 'flex', flexDirection: 'column',
              padding: 0, overflow: 'hidden', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              background: 'rgba(10,10,12,0.85)', backdropFilter: 'blur(40px)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05)'
            }}>
              <div style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: isPanelOpen ? '1.1rem' : '1.8rem', marginBottom: '2px', transition: 'all 0.5s' }}>Lumi</h2>
                  <p className="mono-text" style={{ fontSize: '0.5rem', opacity: 0.5, letterSpacing: '2px' }}>NEURO-ASISTENTE</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div className="mono-text" style={{ color: 'var(--cyan)', fontSize: '0.55rem', border: '1px solid rgba(0,242,255,0.3)', padding: '4px 10px', borderRadius: '20px' }}>SYNC</div>
                  {isPanelOpen && <button onClick={() => setIsChatCollapsed(true)} className="btn-icon" style={{ width: '28px', height: '28px', opacity: 0.3, border: 'none' }}>✕</button>}
                </div>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: isPanelOpen ? '20px' : '40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {chatHistory.map((msg, i) => (
                  <div key={i} className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                    {msg.role === 'ai' && (
                      <div className="ai-avatar" style={{ 
                        width: '30px', height: '30px', fontSize: '0.55rem',
                        background: 'rgba(0, 242, 255, 0.1)', border: '1px solid rgba(0,242,255,0.3)'
                      }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--cyan)' }}></div>
                      </div>
                    )}
                    <div className="chat-text" style={{ fontSize: isPanelOpen ? '0.85rem' : '1rem' }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* COMPACT INPUT STYLE */}
              <div style={{ padding: isPanelOpen ? '15px 20px' : '25px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                {!isPanelOpen && (
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
                    {['chat', 'flashcards'].map(mode => (
                      <button key={mode} onClick={() => setChatMode(mode)} style={{ 
                        padding: '6px 15px', borderRadius: '10px', fontSize: '0.6rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', transition: 'all 0.3s',
                        background: chatMode === mode ? 'rgba(0, 242, 255, 0.1)' : 'transparent',
                        border: chatMode === mode ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.05)',
                        color: chatMode === mode ? 'var(--cyan)' : '#666', letterSpacing: '1px'
                      }}>
                        {mode.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', maxWidth: isPanelOpen ? '100%' : '800px', margin: '0 auto' }}>
                  <input 
                    type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} 
                    className="input-modern" style={{ flex: 1, borderRadius: '30px', background: 'rgba(255,255,255,0.03)', padding: isPanelOpen ? '10px 20px' : '15px 25px', fontSize: isPanelOpen ? '0.85rem' : '1rem' }} 
                    placeholder="¿Qué aprenderemos hoy?" onKeyPress={e => e.key === 'Enter' && sendChatMessage()}
                  />
                  <button className="btn-icon" style={{ width: '40px', height: '40px', background: 'var(--cyan)', color: '#000', border: 'none', boxShadow: '0 0 20px rgba(0,242,255,0.3)' }} onClick={sendChatMessage}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* HUD CONTROLS: Floating Buttons */}
          <div style={{ position: 'absolute', top: '110px', right: '40px', zIndex: 100, display: 'flex', gap: '15px', alignItems: 'center' }}>
            {(isChatCollapsed || !isPanelOpen) && isPanelOpen && (
              <button onClick={() => setIsChatCollapsed(false)} className="btn-icon" style={{ width: '45px', height: '45px', background: 'rgba(0,242,255,0.1)', color: 'var(--cyan)', border: '1px solid var(--cyan)', backdropFilter: 'blur(10px)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
            )}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '30px', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => setIsNavbarCollapsed(!isNavbarCollapsed)} className="btn-icon" style={{ width: '40px', height: '40px', background: isNavbarCollapsed ? 'var(--cyan)' : 'transparent', color: isNavbarCollapsed ? '#000' : '#fff', border: 'none' }}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></svg>
              </button>
              {isPanelOpen && (
                <button onClick={() => setIsPanelOpen(false)} className="btn-icon" style={{ width: '40px', height: '40px', border: 'none', opacity: 0.5 }}>
                   ✕
                </button>
              )}
            </div>
          </div>

        </div>
      )}
    </>
  );
}
