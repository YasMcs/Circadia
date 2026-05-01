import { useState, useEffect, useRef } from 'react';
import './index.css';

// Función para simular triggerReaction desde React hacia la Orbe global
const triggerReaction = (type = 'click') => {
  if (window.triggerOrbReaction) window.triggerOrbReaction(type);
};

export default function App() {
  const [currentView, setCurrentView] = useState('auth'); // auth, onboarding, intro, dashboard, agenda, study
  const [authSubState, setAuthSubState] = useState('welcome'); // welcome, login, register
  const [chronotype, setChronotype] = useState(null);
  const [energyLevel, setEnergyLevel] = useState(0.5);
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
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Hola. Soy Lumi. Estoy monitorizando tu pulso cognitivo en tiempo real. Dime qué necesitas revisar hoy y ajustaré mis respuestas de texto a tu energía actual para que puedas leer sin quemarte. Escríbeme cuando estés listo.', status: 'ready' }
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
    triggerReaction('click');
    if (!taskInput.trim()) return;
    setTasks([{ id: Date.now(), title: taskInput, tag: taskTag, deadline: 'Próximamente' }, ...tasks]);
    setTaskInput('');
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
    
    // Loading state
    const loadingId = Date.now();
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
      <div id="global-top-bar" style={{ display: ['auth', 'onboarding', 'intro'].includes(currentView) ? 'none' : 'grid', position: 'absolute', top: 0, left: 0, width: '100%', padding: '25px 50px', zIndex: 100, pointerEvents: 'none', gridTemplateColumns: '1fr auto 1fr', alignItems: 'flex-start' }}>
        <div style={{ pointerEvents: 'all', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div id="dash-time" style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
            {time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div id="dash-chrono" className="mono-text" style={{ color: 'var(--cyan)', marginTop: '5px' }}>{chronotype || 'Calculando...'}</div>
        </div>

        <div style={{ pointerEvents: 'all', display: 'flex', justifyContent: 'center' }}>
          <div className="main-dock">
            <button className={`dock-btn ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => navTo('dashboard')}>ESTADO</button>
            <button className={`dock-btn ${currentView === 'agenda' ? 'active' : ''}`} onClick={() => navTo('agenda')}>AGENDA</button>
            <button className={`dock-btn ${currentView === 'study' ? 'active' : ''}`} onClick={() => navTo('study')}>LUMI</button>
          </div>
        </div>

        <div style={{ pointerEvents: 'all', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '10px 20px 10px 25px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(15px)' }}>
            <div style={{ textAlign: 'right' }}>
              <div id="pomodoro-time" style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: '#888', lineHeight: 1 }}>{renderPomodoroTime()}</div>
              <div id="pomodoro-status" className="mono-text" style={{ fontSize: '0.6rem', color: pomodoro.active ? 'var(--cyan)' : '#555', marginTop: '5px', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {pomodoro.active ? `En curso: ${pomodoro.taskName}` : pomodoro.timeLeft === 0 ? 'Descanso' : pomodoro.timeLeft < 25 * 60 ? 'Pausado' : 'Sin Tarea Activa'}
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
        <div id="mod-dashboard" className="module active">
          <div className="glass-widget" style={{ position: 'absolute', left: '60px', bottom: '80px', width: '350px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Inbox Rápido</h3>
            <p className="mono-text" style={{ fontSize: '0.65rem', marginBottom: '20px' }}>Captura tareas antes de olvidarlas.</p>
            <input type="text" value={taskInput} onChange={e => setTaskInput(e.target.value)} placeholder="Ej: Terminar mapa mental..." className="input-modern" style={{ marginBottom: '10px', fontSize: '0.9rem', padding: '12px 15px' }} />
            <select value={taskTag} onChange={e => setTaskTag(e.target.value)} className="glass-select" style={{ marginBottom: '15px', padding: '12px 15px', fontSize: '0.85rem' }}>
              <option value="alta" style={{ background: '#111' }}>Alta Carga (Matemáticas)</option>
              <option value="creativa" style={{ background: '#111' }}>Carga Media (Leer/Escribir)</option>
              <option value="admin" style={{ background: '#111' }}>Baja Carga (Organizar)</option>
            </select>
            <button className="btn" style={{ padding: '12px' }} onClick={addTask}>Añadir a la Agenda</button>
          </div>

          <div className="glass-widget" style={{ position: 'absolute', right: '60px', bottom: '120px', width: '350px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Próxima Acción</h3>
            <p className="mono-text" style={{ fontSize: '0.65rem', marginBottom: '20px' }}>Sugerida por tu reloj biológico.</p>
            <div>
              {!suggestedTask ? (
                <p style={{ fontSize: '0.9rem', textAlign: 'center', margin: '20px 0' }}>No hay tareas en el Inbox.</p>
              ) : (
                <div className="task-item" style={{ '--task-color': suggestedTask.tag === 'alta' ? 'var(--cyan)' : suggestedTask.tag === 'creativa' ? 'var(--violet)' : '#ffb400', padding: '20px', display: 'block' }} onClick={() => handleTaskClick(suggestedTask.id, suggestedTask.tag, suggestedTask.title)}>
                  <span className="task-tag" style={{ color: suggestedTask.tag === 'alta' ? 'var(--cyan)' : suggestedTask.tag === 'creativa' ? 'var(--violet)' : '#ffb400', display: 'block', marginBottom: '5px' }}>
                    {suggestedTask.tag === 'alta' ? 'Alta Carga' : suggestedTask.tag === 'creativa' ? 'Media Carga' : 'Baja Carga'} - SUGERIDA AHORA
                  </span>
                  <div className="task-title" style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{suggestedTask.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>[ CLIC PARA COMPLETAR ]</div>
                </div>
              )}
            </div>
            <button className="btn" style={{ padding: '12px', marginTop: '15px', borderColor: 'rgba(0, 242, 255, 0.3)' }} onClick={() => navTo('agenda')}>Ver Agenda Completa</button>
          </div>
        </div>
      )}

      {currentView === 'agenda' && (
        <div id="mod-agenda" className="module active" style={{ overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '140px 50px 150px 50px', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
            <div className="glass-widget" style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Perfil Biológico</h2>
              <div style={{ marginBottom: '20px' }}>
                <p className="mono-text">CRONOTIPO</p>
                <p style={{ fontSize: '1.1rem', color: 'var(--cyan)' }}>{chronotype || 'Desconocido'}</p>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <p className="mono-text">ESTADO ENERGÉTICO ACTUAL</p>
                <p style={{ fontSize: '1.1rem' }}>{(energyLevel * 100).toFixed(1)}% ({energyLevel > 0.6 ? 'Pico Activo' : energyLevel < 0.4 ? 'Valle / Fatiga' : 'Intermedio'})</p>
              </div>
            </div>
            <div className="glass-widget" style={{ flex: 2 }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '25px' }}>Auto-Scheduler</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {tasks.length === 0 ? <p style={{ color: '#888' }}>Tu agenda está vacía.</p> : tasks.map(t => {
                  let hexColor = t.tag === 'alta' ? 'var(--cyan)' : t.tag === 'creativa' ? 'var(--violet)' : '#ffb400';
                  let tagLabel = t.tag === 'alta' ? 'Alta (Matemáticas, Proyectos)' : t.tag === 'creativa' ? 'Media (Leer, Escribir)' : 'Baja (Organizar)';
                  return (
                    <div key={t.id} className="task-item" style={{ '--task-color': hexColor }} onClick={() => handleTaskClick(t.id, t.tag, t.title)}>
                      <div className="task-info">
                        <span className="task-title" style={{ display: 'block', color: '#fff' }}>{t.title}</span>
                        <span className="task-tag" style={{ color: hexColor, opacity: 0.8 }}>{tagLabel} | {t.deadline}</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>[ INICIAR POMODORO ]</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'study' && (
        <div id="mod-study" className="module active" style={{ alignItems: 'center', justifyContent: 'center', paddingTop: '100px', paddingBottom: '20px' }}>
          <div className="glass-widget" style={{ width: '100%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '25px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.4)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '5px' }}>Lumi</h2>
                <p className="mono-text" style={{ fontSize: '0.7rem' }}>Tu compañera biológica (Asistencia por texto).</p>
              </div>
              <div className="mono-text" style={{ color: 'var(--cyan)', fontSize: '0.65rem', border: '1px solid rgba(0,242,255,0.2)', padding: '5px 10px', borderRadius: '20px' }}>En Línea</div>
            </div>
            
            <div id="chat-history" style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {chatHistory.map((msg, i) => (
                <div key={i} className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                  {msg.role === 'ai' && (
                    <div className="ai-avatar" style={{ 
                      background: msg.energyLevel > 0.6 ? 'rgba(0, 242, 255, 0.2)' : msg.energyLevel < 0.4 ? 'rgba(255, 0, 80, 0.2)' : msg.energyLevel ? 'rgba(188, 19, 254, 0.2)' : 'rgba(0, 242, 255, 0.2)', 
                      border: msg.energyLevel > 0.6 ? '1px solid rgba(0, 242, 255, 0.4)' : msg.energyLevel < 0.4 ? '1px solid rgba(255, 0, 80, 0.4)' : msg.energyLevel ? '1px solid rgba(188, 19, 254, 0.4)' : '1px solid rgba(0, 242, 255, 0.4)',
                      boxShadow: msg.energyLevel > 0.6 ? '0 0 15px var(--cyan)' : msg.energyLevel < 0.4 ? '0 0 15px var(--red)' : msg.energyLevel ? '0 0 15px var(--violet)' : 'none'
                    }}>
                      <div style={{ 
                        width: '10px', height: '10px', borderRadius: '50%', 
                        background: msg.energyLevel > 0.6 ? 'var(--cyan)' : msg.energyLevel < 0.4 ? 'var(--red)' : msg.energyLevel ? 'var(--violet)' : 'var(--cyan)',
                        boxShadow: msg.energyLevel > 0.6 ? '0 0 10px var(--cyan)' : msg.energyLevel < 0.4 ? '0 0 10px var(--red)' : msg.energyLevel ? '0 0 10px var(--violet)' : '0 0 10px var(--cyan)' 
                      }}></div>
                    </div>
                  )}
                  <div className="chat-text" style={{ whiteSpace: 'pre-line' }}>
                    {msg.status === 'loading' && <span className="ai-spinner" style={{ width: '15px', height: '15px', borderWidth: '2px', display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }}></span>}
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '20px 30px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.4)', display: 'flex', gap: '15px', flexShrink: 0, alignItems: 'center' }}>
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} className="input-modern" style={{ borderRadius: '30px', padding: '16px 25px', background: 'rgba(20,20,20,0.8)', flex: 1, fontSize: '0.95rem' }} placeholder="Ej: Explícame cómo funciona la termodinámica..." onKeyPress={e => e.key === 'Enter' && sendChatMessage()} />
              <button className="btn-icon" style={{ width: '50px', height: '50px', background: 'rgba(0, 242, 255, 0.1)', color: 'var(--cyan)', border: '1px solid var(--cyan)', flexShrink: 0, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={sendChatMessage}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
