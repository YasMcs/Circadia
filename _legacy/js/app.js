const app = {
  state: 'auth', 
  history: [],
  orbState: 'neutral', 
  user: null,
  chronotype: null, 
  energyLevel: 0.5,
  tasks: [
    { id: 1, title: 'Entregar proyecto de React', tag: 'alta', deadline: 'Hoy 23:59' },
    { id: 2, title: 'Repaso para examen de Física', tag: 'creativa', deadline: 'Mañana' },
    { id: 3, title: 'Organizar apuntes', tag: 'admin', deadline: 'Sin urgencia' }
  ],
  onbStep: 0,
  scores: [], 
  
  pomodoro: {
    active: false,
    interval: null,
    timeLeft: 25 * 60,
    taskId: null
  },

  triggerReaction: function(type = 'click') {
    if(window.triggerOrbReaction) window.triggerOrbReaction(type);
  },

  navTo: function(newState) {
    this.triggerReaction('transition');
    
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    document.getElementById(`mod-${newState}`).classList.add('active');
    this.state = newState;
    
    // Configurar visibilidad del Top Bar y Overlay según la vista
    const topBar = document.getElementById('global-top-bar');
    const overlay = document.getElementById('global-overlay');

    if (newState === 'auth' || newState === 'onboarding' || newState === 'intro') {
      if (topBar) topBar.style.display = 'none';
      if (overlay) overlay.style.opacity = (newState === 'onboarding' || newState === 'intro') ? '1' : '0';
    } else {
      if (topBar) topBar.style.display = 'grid';
      // Solo mostramos overlay fuerte en vistas que no necesitan la Orbe central libre
      if (newState === 'dashboard') {
        if (overlay) overlay.style.opacity = '0';
      } else {
        if (overlay) overlay.style.opacity = '1';
      }

      // Update Dock UI (ahora dentro del top bar)
      document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
      let activeBtn = document.getElementById(`nav-btn-${newState}`);
      if(activeBtn) activeBtn.classList.add('active');
    }

    // Configurar estado específico
    if (newState === 'auth') {
      this.orbState = 'neutral';
      this.toggleAuth('welcome');
    }
    else if (newState === 'dashboard') {
      this.orbState = 'dashboard';
      this.renderQuickDashboard();
      document.getElementById('dash-chrono').innerText = `${this.chronotype || 'Calculando...'}`;
    }
    else if (newState === 'agenda') {
      this.orbState = 'dashboard'; // Mantener orbe girando detrás
      this.renderFullAgenda();
      document.getElementById('agenda-chrono').innerText = this.chronotype || 'Desconocido';
    }
    else if (newState === 'study') {
      this.orbState = 'study';
      document.getElementById('ai-output').innerHTML = '<p style="text-align:center; color: #666; font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 1px;">SISTEMA EN ESPERA...</p>';
    }
  },

  // --- MÓDULO: AUTH ---
  authSubState: 'welcome',
  toggleAuth: function(view) {
    this.triggerReaction('transition');
    this.authSubState = view;

    const welcomeV = document.getElementById('auth-welcome-view');
    const loginV = document.getElementById('auth-login-view');
    const registerV = document.getElementById('auth-register-view');

    if(welcomeV) { welcomeV.style.opacity = '0'; welcomeV.style.transform = 'translateY(-20px)'; welcomeV.style.pointerEvents = 'none'; }
    if(loginV) { loginV.style.opacity = '0'; loginV.style.transform = 'translateY(-50%) translateX(-50px)'; loginV.style.pointerEvents = 'none'; }
    if(registerV) { registerV.style.opacity = '0'; registerV.style.transform = 'translateY(-50%) translateX(-50px)'; registerV.style.pointerEvents = 'none'; }

    if(view === 'welcome' && welcomeV) { welcomeV.style.opacity = '1'; welcomeV.style.transform = 'translateY(0)'; welcomeV.style.pointerEvents = 'all'; }
    else if(view === 'login' && loginV) { loginV.style.opacity = '1'; loginV.style.transform = 'translateY(-50%) translateX(0)'; loginV.style.pointerEvents = 'all'; }
    else if(view === 'register' && registerV) { registerV.style.opacity = '1'; registerV.style.transform = 'translateY(-50%) translateX(0)'; registerV.style.pointerEvents = 'all'; }
  },
  login: function() {
    this.triggerReaction('transition');
    setTimeout(() => {
      if(!this.chronotype) this.chronotype = 'Oso (Intermedio)'; 
      this.navTo('intro');
    }, 300);
  },
  startRegistrationFlow: function() {
    this.triggerReaction('transition');
    setTimeout(() => {
      this.navTo('onboarding');
      this.onbStep = 0;
      this.scores = [];
      this.renderOnboarding();
    }, 300);
  },
  finishRegistration: function() {
    this.triggerReaction('transition');
    setTimeout(() => {
      this.navTo('intro');
    }, 300);
  },

  // --- MÓDULO: CRONOTIPO ESTUDIANTIL ---
  questions: [
    { title: "Inercia Cognitiva", desc: "Mide el tiempo de 'arranque' de tu cerebro.", q: "En un día libre de clases, al despertar, ¿cuánto tiempo necesitas antes de sentir que tu mente está lista para resolver un problema complejo?", opts: [{ text: "Menos de 15 min (Despierto alerta)", val: 1 }, { text: "Entre 30 y 60 min (Necesito mi tiempo)", val: 2 }, { text: "Más de 2 horas (Las mañanas me cuestan)", val: 3 }, { text: "Depende totalmente del día", val: 'V' }] },
    { title: "Pico de Retención", desc: "Ventana de máxima absorción natural.", q: "Si tuvieras que estudiar para el examen más difícil del semestre, ¿en qué momento del día sientes que te concentras mejor?", opts: [{ text: "En la mañana (8:00 AM - 12:00 PM)", val: 1 }, { text: "A media tarde (3:00 PM - 7:00 PM)", val: 2 }, { text: "Tarde en la noche o madrugada", val: 3 }, { text: "Mis picos de atención son irregulares", val: 'V' }] },
    { title: "Ventana de Descanso", desc: "El reloj biológico dicta tu cierre operativo.", q: "Durante las vacaciones, cuando no tienes que madrugar para ir a la escuela, ¿a qué hora prefieres irte a dormir de forma natural?", opts: [{ text: "Temprano (Antes de las 10:30 PM)", val: 1 }, { text: "Intermedio (11:00 PM a 12:30 AM)", val: 2 }, { text: "Muy tarde (Después de la 1:00 AM)", val: 3 }, { text: "No tengo un patrón de sueño fijo", val: 'V' }] },
    { title: "Reloj Metabólico", desc: "La sincronía gástrica con el enfoque.", q: "¿Cómo es tu nivel de apetito durante la primera hora después de despertar para ir a clases?", opts: [{ text: "Alto, necesito desayunar de inmediato", val: 1 }, { text: "Bajo, prefiero empezar con solo líquidos", val: 2 }, { text: "Nulo, no me da hambre tan temprano", val: 3 }, { text: "A veces me levanto con hambre y otras no", val: 'V' }] },
    { title: "Recuperación Post-Estudio", desc: "Liberación de saturación del sistema nervioso.", q: "Después de presentar una semana de exámenes finales agotadora, ¿cuál es tu forma preferida de reiniciar tu mente?", opts: [{ text: "Hacer actividad física o salir al aire libre", val: 1 }, { text: "Aislarme, descansar en silencio y dormir", val: 2 }, { text: "Quedarme hasta tarde en algo creativo/ocio", val: 3 }, { text: "Cambio de método constantemente", val: 'V' }] }
  ],
  renderOnboarding: function() {
    if(this.onbStep >= this.questions.length) {
      let varCount = this.scores.filter(v => v === 'V').length;
      if (varCount >= 3) this.chronotype = 'Delfín (Adaptable)';
      else {
        let nScores = this.scores.map(v => v === 'V' ? 2 : v);
        let sum = nScores.reduce((a,b)=>a+b,0);
        if(sum <= 7) this.chronotype = 'León (Matutino)';
        else if(sum <= 11) this.chronotype = 'Oso (Intermedio)';
        else this.chronotype = 'Lobo (Nocturno)';
      }
      this.navTo('auth');
      this.toggleAuth('register');
      return;
    }
    const qData = this.questions[this.onbStep];
    document.getElementById('onb-step-num').innerText = (this.onbStep + 1);
    document.getElementById('onb-question-title').innerText = qData.title;
    document.getElementById('onb-question-desc').innerText = qData.desc;
    document.getElementById('onb-question').innerText = qData.q;
    
    document.getElementById('onb-options').innerHTML = qData.opts.map(opt => `
      <button class="btn" style="text-transform:none; padding:20px; background:rgba(18,18,18,0.3); max-width:600px; text-align:center;" onclick="app.answerOnb('${opt.val}')">${opt.text}</button>
    `).join('');
  },
  answerOnb: function(val) {
    this.triggerReaction('click');
    this.scores.push(val === 'V' ? 'V' : parseInt(val));
    this.onbStep++;
    this.renderOnboarding();
  },
  backOnb: function() {
    if(this.onbStep === 0) this.navTo('auth');
    else { this.scores.pop(); this.onbStep--; this.renderOnboarding(); }
  },

  // --- MÓDULO: TAREAS (DASHBOARD & AGENDA) ---
  addTask: function() {
    this.triggerReaction('click');
    const title = document.getElementById('task-input').value.trim();
    const tag = document.getElementById('task-tag').value;
    if(!title) return;
    this.tasks.unshift({ id: Date.now(), title, tag, deadline: 'Próximamente' });
    document.getElementById('task-input').value = '';
    
    if (this.state === 'dashboard') this.renderQuickDashboard();
    if (this.state === 'agenda') this.renderFullAgenda();
  },
  
  handleTaskClick: function(id, tag, title) {
    this.triggerReaction('click');
    if (tag === 'alta' && this.energyLevel < 0.4) {
      alert("SISTEMA SATURADO: Estás en un Valle Energético. Iniciar tareas de 'Alta Carga' puede causar burnout.");
    } else {
      this.tasks = this.tasks.filter(t => t.id !== id);
      if (this.state === 'dashboard') this.renderQuickDashboard();
      if (this.state === 'agenda') this.renderFullAgenda();
      
      // Iniciar el pomodoro automáticamente
      this.startPomodoro(title);
    }
  },

  startPomodoro: function(taskName) {
    this.pomodoro.active = true;
    this.pomodoro.timeLeft = 25 * 60;
    this.pomodoro.taskName = taskName || 'Sesión Libre';
    
    document.getElementById('pomodoro-status').innerText = 'En curso: ' + this.pomodoro.taskName;
    document.getElementById('pomodoro-status').style.color = 'var(--cyan)';
    document.getElementById('pomodoro-toggle').innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    
    clearInterval(this.pomodoro.interval);
    this.pomodoro.interval = setInterval(() => {
      if(!this.pomodoro.active) return;
      this.pomodoro.timeLeft--;
      if (this.pomodoro.timeLeft <= 0) {
        clearInterval(this.pomodoro.interval);
        alert("¡Sesión completada! Es hora de tu Check-in de fatiga.");
        this.pomodoro.active = false;
        document.getElementById('pomodoro-toggle').innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
        document.getElementById('pomodoro-status').innerText = 'Descanso';
        document.getElementById('pomodoro-status').style.color = '#ffb400';
      }
      this.renderPomodoroTime();
    }, 1000);
    this.renderPomodoroTime();
  },

  togglePomodoro: function() {
    this.triggerReaction('click');
    if (!this.pomodoro.interval && !this.pomodoro.active && this.pomodoro.timeLeft === 25*60) {
      this.startPomodoro('Sesión Libre');
      return;
    }
    
    this.pomodoro.active = !this.pomodoro.active;
    if (this.pomodoro.active) {
      document.getElementById('pomodoro-toggle').innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
      document.getElementById('pomodoro-status').innerText = 'En curso: ' + this.pomodoro.taskName;
      document.getElementById('pomodoro-status').style.color = 'var(--cyan)';
    } else {
      document.getElementById('pomodoro-toggle').innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
      document.getElementById('pomodoro-status').innerText = 'Pausado';
      document.getElementById('pomodoro-status').style.color = '#888';
    }
  },

  renderPomodoroTime: function() {
    let m = Math.floor(this.pomodoro.timeLeft / 60);
    let s = this.pomodoro.timeLeft % 60;
    document.getElementById('pomodoro-time').innerText = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  },

  renderQuickDashboard: function() {
    const nextTaskContainer = document.getElementById('quick-next-task');
    if(this.tasks.length === 0) {
      nextTaskContainer.innerHTML = '<p style="font-size: 0.9rem; text-align:center; margin: 20px 0; color:#888;">Todo limpio. Nada en el Inbox.</p>';
      return;
    }
    
    // Sugerir la primera tarea basada en energía
    let suggestedTask = this.tasks[0];
    if (this.energyLevel > 0.6) {
      let highLoad = this.tasks.find(t => t.tag === 'alta');
      if (highLoad) suggestedTask = highLoad;
    } else {
      let lowLoad = this.tasks.find(t => t.tag === 'admin' || t.tag === 'creativa');
      if (lowLoad) suggestedTask = lowLoad;
    }

    let hexColor = suggestedTask.tag === 'alta' ? 'var(--cyan)' : suggestedTask.tag === 'creativa' ? 'var(--violet)' : '#ffb400';
    let tagLabel = suggestedTask.tag === 'alta' ? 'Alta Carga' : suggestedTask.tag === 'creativa' ? 'Media Carga' : 'Baja Carga';

    nextTaskContainer.innerHTML = `
      <div class="task-item" style="--task-color: ${hexColor}; padding: 20px; display: block;" onclick="app.handleTaskClick(${suggestedTask.id}, '${suggestedTask.tag}', '${suggestedTask.title}')">
        <span class="task-tag" style="color:${hexColor}; display:block; margin-bottom:5px;">${tagLabel} - SUGERIDA AHORA</span>
        <div class="task-title" style="font-size: 1.1rem; margin-bottom: 10px;">${suggestedTask.title}</div>
        <div style="color:var(--text-muted); font-size:0.75rem; font-family:var(--font-mono);">[ CLIC PARA COMPLETAR ]</div>
      </div>
    `;
  },

  renderFullAgenda: function() {
    this.renderWeeklyCalendar();
    const list = document.getElementById('full-task-list');
    if (this.tasks.length === 0) {
      list.innerHTML = '<p style="color:#888;">Tu agenda está vacía.</p>';
      return;
    }
    
    list.innerHTML = this.tasks.map(t => {
      let hexColor = t.tag === 'alta' ? 'var(--cyan)' : t.tag === 'creativa' ? 'var(--violet)' : '#ffb400';
      let tagLabel = t.tag === 'alta' ? 'Alta (Matemáticas, Proyectos)' : t.tag === 'creativa' ? 'Media (Leer, Escribir)' : 'Baja (Organizar)';
      return `
        <div class="task-item" style="--task-color: ${hexColor};" onclick="app.handleTaskClick(${t.id}, '${t.tag}', '${t.title}')">
          <div class="task-info">
            <span class="task-title">${t.title}</span>
            <span class="task-tag" style="color:${hexColor}; opacity:0.8;">${tagLabel} | ${t.deadline}</span>
          </div>
          <div style="color:var(--text-muted); font-size:0.7rem; font-family:var(--font-mono);">[ INICIAR POMODORO ]</div>
        </div>
      `;
    }).join('');
  },

  renderWeeklyCalendar: function() {
    const container = document.getElementById('weekly-calendar-container');
    if(!container) return;

    const days = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
    let today = new Date();
    // Ajustar para obtener el Lunes de esta semana
    let dayOfWeek = today.getDay() || 7; 
    let monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);

    let html = '';
    for(let i=0; i<7; i++) {
      let d = new Date(monday);
      d.setDate(monday.getDate() + i);
      let isToday = (d.getDate() === today.getDate() && d.getMonth() === today.getMonth());
      
      let bg = isToday ? 'rgba(0, 242, 255, 0.1)' : 'rgba(255,255,255,0.02)';
      let border = isToday ? '1px solid rgba(0, 242, 255, 0.3)' : '1px solid rgba(255,255,255,0.05)';
      let colorDay = isToday ? 'var(--cyan)' : '#888';
      let colorNum = isToday ? '#fff' : '#aaa';
      
      html += `
        <div class="calendar-day" style="flex:1; text-align:center; padding: 15px 0; background: ${bg}; border-radius: 12px; border: ${border}; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='${bg}'">
          <div class="mono-text" style="font-size: 0.65rem; color:${colorDay};">${days[i]}</div>
          <div style="font-size: 1.2rem; color: ${colorNum}; margin-top:5px; font-weight:${isToday?'bold':'normal'};">${d.getDate()}</div>
          ${isToday ? '<div style="width: 4px; height: 4px; background: var(--cyan); border-radius: 50%; margin: 5px auto 0;"></div>' : ''}
        </div>
      `;
    }
    container.innerHTML = html;
  },

  // --- MÓDULO: STUDY (NEUROTUTOR CHAT) ---
  sendChatMessage: function() {
    this.triggerReaction('transition');
    const inputEl = document.getElementById('chat-input');
    const topic = inputEl.value.trim();
    if (!topic) return;
    
    const history = document.getElementById('chat-history');
    
    // Burbuja del usuario
    history.innerHTML += `
      <div class="chat-bubble-user">
        <div class="chat-text">${topic}</div>
      </div>
    `;
    inputEl.value = '';
    history.scrollTop = history.scrollHeight;

    // Loading IA
    const loadingId = 'loading-' + Date.now();
    history.innerHTML += `
      <div class="chat-bubble-ai" id="${loadingId}">
        <div class="ai-avatar" style="background: rgba(0, 242, 255, 0.2); border: 1px solid rgba(0, 242, 255, 0.4);"><div style="width: 10px; height: 10px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 10px var(--cyan);"></div></div>
        <div class="chat-text"><span class="ai-spinner" style="width:15px; height:15px; border-width:2px; display:inline-block; vertical-align:middle; margin-right:10px;"></span> Lumi procesando tu estado...</div>
      </div>
    `;
    history.scrollTop = history.scrollHeight;
    
    setTimeout(() => {
      this.triggerReaction('click');
      const loadingEl = document.getElementById(loadingId);
      if (!loadingEl) return;

      if (this.energyLevel > 0.6) {
        loadingEl.innerHTML = `
          <div class="ai-avatar" style="box-shadow: 0 0 15px var(--cyan); background: rgba(0, 242, 255, 0.2); border: 1px solid rgba(0, 242, 255, 0.4);"><div style="width: 10px; height: 10px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 10px var(--cyan);"></div></div>
          <div class="chat-text">
            <span style="color:var(--cyan); font-family:var(--font-mono); font-size:0.7rem; display:block; margin-bottom:5px;">[ ESTADO ÓPTIMO DETECTADO ]</span>
            Estás en tu pico cognitivo. Para el tema de <b>${topic}</b>, te recomiendo enfocarnos en la lógica profunda. ¿Quieres que te escriba el desglose completo de la teoría o prefieres hacer un ejercicio práctico?
          </div>
        `;
      } else if (this.energyLevel < 0.4) {
        loadingEl.innerHTML = `
          <div class="ai-avatar" style="box-shadow: 0 0 15px var(--red); background: rgba(255, 0, 80, 0.2); border: 1px solid rgba(255, 0, 80, 0.4);"><div style="width: 10px; height: 10px; background: var(--red); border-radius: 50%; box-shadow: 0 0 10px var(--red);"></div></div>
          <div class="chat-text">
            <span style="color:var(--red); font-family:var(--font-mono); font-size:0.7rem; display:block; margin-bottom:5px;">[ FATIGA DETECTADA ]</span>
            Noto que tu energía está muy baja ahora. No intentemos asimilar nada pesado sobre <b>${topic}</b>. Te he preparado un resumen textual rápido de 3 puntos clave para leer sin esfuerzo. ¿Te lo muestro?
          </div>
        `;
      } else {
        loadingEl.innerHTML = `
          <div class="ai-avatar" style="box-shadow: 0 0 15px var(--violet); background: rgba(188, 19, 254, 0.2); border: 1px solid rgba(188, 19, 254, 0.4);"><div style="width: 10px; height: 10px; background: var(--violet); border-radius: 50%; box-shadow: 0 0 10px var(--violet);"></div></div>
          <div class="chat-text">
            <span style="color:var(--violet); font-family:var(--font-mono); font-size:0.7rem; display:block; margin-bottom:5px;">[ ESTADO ESTABLE ]</span>
            Tu energía está en niveles medios. Vamos a repasar <b>${topic}</b> a un ritmo tranquilo. Te daré la teoría general por texto y tú me dices si quieres profundizar en alguna parte.
          </div>
        `;
      }
      history.scrollTop = history.scrollHeight;
    }, 1500);
  },

  // --- ENGINE DE TIEMPO ---
  updateTime: function() {
    const d = new Date();
    const timeEl = document.getElementById('dash-time');
    if(timeEl) timeEl.innerText = d.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'});
    
    let h = d.getHours() + d.getMinutes()/60;
    let peakShift = this.chronotype === 'León (Matutino)' ? -2 : this.chronotype === 'Lobo (Nocturno)' ? 4 : 0;  
    let effectiveHour = (h - peakShift + 24) % 24;

    let e = 0.5;
    if (this.chronotype === 'Delfín (Adaptable)') {
      e = 0.5 + (Math.sin(effectiveHour * 1.5) * 0.2); 
    } else {
      if (effectiveHour >= 6 && effectiveHour < 10) e = mapScale(effectiveHour, 6, 10, 0.3, 1.0);     
      else if (effectiveHour >= 10 && effectiveHour < 14) e = mapScale(effectiveHour, 10, 14, 1.0, 0.2);   
      else if (effectiveHour >= 14 && effectiveHour < 18) e = mapScale(effectiveHour, 14, 18, 0.2, 0.8);   
      else if (effectiveHour >= 18 && effectiveHour < 22) e = mapScale(effectiveHour, 18, 22, 0.8, 0.3);   
      else if (effectiveHour >= 22) e = mapScale(effectiveHour, 22, 24, 0.3, 0.0);             
      else if (effectiveHour < 6) e = mapScale(effectiveHour, 0, 6, 0.0, 0.3);                 
    }
    
    this.energyLevel = e;
    if (document.getElementById('agenda-energy')) {
      let phase = e > 0.6 ? 'Pico Activo' : e < 0.4 ? 'Valle / Fatiga' : 'Intermedio';
      document.getElementById('agenda-energy').innerText = `${(e * 100).toFixed(1)}% (${phase})`;
    }
  }
};

function mapScale(val, inMin, inMax, outMin, outMax) {
  return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
setInterval(() => app.updateTime(), 1000);
app.updateTime();
