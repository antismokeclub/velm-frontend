
// ─── ICONS ───────────────────────────────────────────────────
const I={
  metric:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 12v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 12v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 12v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 12v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  imperial:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2"/></svg>`,
  wy:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="7" y="5" width="10" height="14" rx="3" fill="currentColor" opacity="0.12"/><rect x="6" y="4" width="12" height="16" rx="4" stroke="currentColor" stroke-width="2"/><path d="M12 8v4l2 2" stroke="currentColor" stroke-width="2"/><path d="M9 4V2h6v2M9 20v2h6v-2" stroke="currentColor" stroke-width="2"/></svg>`,
  wn:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><path d="M9 16c1.5-1 4.5-1 6 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  lbeg:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 22v-8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 14a5 5 0 0 0-5-5M12 14a5 5 0 0 1 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 22h-4M12 22h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  flag:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" stroke-width="2"/></svg>`,
  gs:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 14l6-6 4 4 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="14" r="2" stroke="currentColor" stroke-width="2"/></svg>`,
  gw:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 20l3-6 3 6 3-6 3 6 3-6 3 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  gh:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  gc:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2"/><path d="M12 7v10M7 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  gt:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 12l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  gd:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  male:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="10" cy="14" r="6" stroke="currentColor" stroke-width="2"/><path d="M16 8l4-4M20 4h-5M20 4v5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  female:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="6" stroke="currentColor" stroke-width="2"/><path d="M12 16v6M9 19h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  inj:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  life:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  chk:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  sport_none:`<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"/><path d="M8 8l8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  sport_football:`<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 3.5c0 0-3 3.5-3 8.5s3 8.5 3 8.5M12 3.5c0 0 3 3.5 3 8.5s-3 8.5-3 8.5M3.5 9h17M3.5 15h17" stroke="currentColor" stroke-width="1.4"/></svg>`,
  sport_gym:`<svg viewBox="0 0 24 24" fill="none"><path d="M3 10v4M7 8v8M17 8v8M21 10v4M7 12h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  sport_swim:`<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/><path d="M11 10.5l3 2.5 2-1.5M3 17c1 .8 2 .8 3.5 0 1.3-.8 2.3-.8 3.6 0 1.5.8 2.5.8 4 0 1.3-.8 2.3-.8 3.6 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sport_cycle:`<svg viewBox="0 0 24 24" fill="none"><circle cx="6.5" cy="16.5" r="3.5" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="16.5" r="3.5" stroke="currentColor" stroke-width="1.6"/><path d="M10 7h3l3 6M10 7l-3 6h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sport_tennis:`<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M7.5 6.5c2 1.8 3 4.1 3 5.5s-1 3.7-3 5.5M16.5 6.5c-2 1.8-3 4.1-3 5.5s1 3.7 3 5.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  sport_other:`<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
};
const GI={start:I.gs,walkrun:I.gw,health:I.gh,comeback:I.gc,time:I.gt,distance:I.gd};
const SPORTS=[['none','sport_none_lbl',I.sport_none],['football','sport_football_lbl',I.sport_football],['gym','sport_gym_lbl',I.sport_gym],['swimming','sport_swim_lbl',I.sport_swim],['cycling','sport_cycle_lbl',I.sport_cycle],['tennis','sport_tennis_lbl',I.sport_tennis],['other','sport_other_lbl',I.sport_other]];
const WCOLORS={easy:'#4ade80',long:'#60a5fa',tempo:'#f59e0b',interval:'#f87171',rest:'rgba(15,31,61,.08)'};
const WDAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
// Status pod siatka tygodnia. Kazdy jezyk odmienia sam — polski ma dwa
// rozne przypadki: "brakuje Ci N treningow" (dopelniacz, zawsze tak samo)
// ale "usun N treningi/treningow" (biernik, inny dla 2-4).
const _plAcc=(n)=>{const a=n%10,b=n%100;return n===1?'trening':(a>=2&&a<=4&&!(b>=12&&b<=14))?'treningi':'treningów';};
const MIXED_STATUS={
  pl:{sel:n=>`Brakuje Ci jeszcze ${n} ${n===1?'treningu':'treningów'}`, rem:n=>`Musisz usunąć ${n} ${_plAcc(n)}`, ready:'✓ Gotowe!'},
  en:{sel:n=>`Select ${n} more`,                     rem:n=>`Remove ${n}`,                                  ready:'✓ Ready!'},
  fr:{sel:n=>`Choisis ${n} séance${n===1?'':'s'} de plus`, rem:n=>`Retire ${n} séance${n===1?'':'s'}`, ready:'✓ Prêt !'},
  es:{sel:n=>`Elige ${n} ${n===1?'sesión':'sesiones'} más`,     rem:n=>`Quita ${n} ${n===1?'sesión':'sesiones'}`, ready:'✓ ¡Listo!'},
  de:{sel:n=>`Wähle ${n} weitere Einheit${n===1?'':'en'}`,      rem:n=>`Entferne ${n} Einheit${n===1?'':'en'}`,   ready:'✓ Fertig!'}
};
// Etykiety wierszy w podsumowaniu profilu (bReady).
const READY_LABELS={
  pl:{goal:'Cel',dist:'Dystans',pb:'Obecny rekord',target:'Cel czasowy',raceDate:'Data startu',
      longest:'Najdłuższy bieg',form:'Forma treningu',vol:'Tygodniowa objętość',perWeek:'/ tydzień',
      intervals:'Interwały',run:'bieg',walk:'marsz',comeback:'Powrót',cbInjury:'Po kontuzji',
      cbIllness:'Po chorobie',cbBreak:'Po dłuższej przerwie',run15:'15 min biegu bez przerwy',yes:'Tak, dam radę',
      notYet:'Jeszcze nie',level:'Poziom',adv:'Zaawansowany',beg:'Początkujący',
      days:'Dni treningowe',daysWk:'dni',mileage:'Obecny kilometraż',age:'Wiek',
      years:'lat',weight:'Waga',height:'Wzrost',half:'Półmaraton',marathon:'Maraton',
      twalkrun:'Marsz-bieg',teasy:'Spokojne bieganie',tmixed:'Mieszany tydzień'},
  en:{goal:'Goal',dist:'Distance',pb:'Current PB',target:'Target time',raceDate:'Race date',
      longest:'Longest run',form:'Training form',vol:'Weekly volume',perWeek:'/ week',
      intervals:'Intervals',run:'run',walk:'walk',comeback:'Comeback',cbInjury:'After injury',
      cbIllness:'After illness',cbBreak:'After a break',run15:'15 min non-stop run',yes:'Yes',
      notYet:'Not yet',level:'Level',adv:'Advanced',beg:'Beginner',
      days:'Training days',daysWk:'days',mileage:'Current mileage',age:'Age',
      years:'y/o',weight:'Weight',height:'Height',half:'Half Marathon',marathon:'Marathon',
      twalkrun:'Walk-run',teasy:'Easy running',tmixed:'Mixed week'},
  fr:{goal:'Objectif',dist:'Distance',pb:'Record actuel',target:'Temps visé',raceDate:'Date de course',
      longest:'Plus longue sortie',form:"Type d'entraînement",vol:'Volume hebdomadaire',perWeek:'/ semaine',
      intervals:'Fractionné',run:'course',walk:'marche',comeback:'Retour',cbInjury:'Après blessure',
      cbIllness:'Après maladie',cbBreak:'Après une longue pause',run15:'15 min de course sans arrêt',yes:'Oui, je peux',
      notYet:'Pas encore',level:'Niveau',adv:'Expérimenté',beg:'Débutant',
      days:"Jours d'entraînement",daysWk:'jours',mileage:'Volume actuel',age:'Âge',
      years:'ans',weight:'Poids',height:'Taille',half:'Semi-marathon',marathon:'Marathon',
      twalkrun:'Marche-course',teasy:'Course facile',tmixed:'Semaine mixte'},
  es:{goal:'Objetivo',dist:'Distancia',pb:'Marca actual',target:'Tiempo objetivo',raceDate:'Fecha de carrera',
      longest:'Tirada más larga',form:'Tipo de entrenamiento',vol:'Volumen semanal',perWeek:'/ semana',
      intervals:'Series',run:'carrera',walk:'caminata',comeback:'Regreso',cbInjury:'Tras lesión',
      cbIllness:'Tras enfermedad',cbBreak:'Tras un parón largo',run15:'15 min corriendo sin parar',yes:'Sí, puedo',
      notYet:'Todavía no',level:'Nivel',adv:'Experimentado',beg:'Principiante',
      days:'Días de entrenamiento',daysWk:'días',mileage:'Volumen actual',age:'Edad',
      years:'años',weight:'Peso',height:'Altura',half:'Media maratón',marathon:'Maratón',
      twalkrun:'Caminar-correr',teasy:'Carrera suave',tmixed:'Semana mixta'},
  de:{goal:'Ziel',dist:'Distanz',pb:'Aktuelle Bestzeit',target:'Zielzeit',raceDate:'Wettkampftag',
      longest:'Längster Lauf',form:'Trainingsform',vol:'Wochenumfang',perWeek:'/ Woche',
      intervals:'Intervalle',run:'Laufen',walk:'Gehen',comeback:'Comeback',cbInjury:'Nach Verletzung',
      cbIllness:'Nach Krankheit',cbBreak:'Nach längerer Pause',run15:'15 Min ohne Pause laufen',yes:'Ja, schaffe ich',
      notYet:'Noch nicht',level:'Niveau',adv:'Erfahren',beg:'Anfänger',
      days:'Trainingstage',daysWk:'Tage',mileage:'Aktueller Umfang',age:'Alter',
      years:'Jahre',weight:'Gewicht',height:'Größe',half:'Halbmarathon',marathon:'Marathon',
      twalkrun:'Geh-Lauf',teasy:'Ruhiges Laufen',tmixed:'Gemischte Woche'}
};
// Naglowki kolumn w kalendarzu — 7 kolumn na szerokosc telefonu, wiec 2 znaki,
// a nie 3-literowe c('wdays'), ktore sie nie miesci.
const CAL_SHORT={
  pl:['Pn','Wt','Śr','Cz','Pt','So','Nd'],
  en:['Mo','Tu','We','Th','Fr','Sa','Su'],
  fr:['Lu','Ma','Me','Je','Ve','Sa','Di'],
  es:['Lu','Ma','Mi','Ju','Vi','Sá','Do'],
  de:['Mo','Di','Mi','Do','Fr','Sa','So']
};
// Etykiety w kratkach tygodnia — komorka jest waska, wiec trzymamy je krotkie.
const WTYPE_LABELS={
  easy:    {en:'Easy', pl:'Spokojny',  fr:'Facile',  es:'Suave',    de:'Ruhig'},
  long:    {en:'Long', pl:'Długi',     fr:'Longue',  es:'Larga',    de:'Lang'},
  tempo:   {en:'Tempo',pl:'Progowy',   fr:'Seuil',   es:'Umbral',   de:'Tempo'},
  interval:{en:'Int.', pl:'Interwały', fr:'Frac.',   es:'Series',   de:'Interv.'},
  rest:    {en:'Rest', pl:'Wolne',     fr:'Repos',   es:'Descanso', de:'Frei'}
};
// ─── STATE ───────────────────────────────────────────────────
const D={
  language:'en',unit:null,hasWatch:null,goal_category:null,level:null,goalId:null,name:'',
  run_15min:null,stairs:null,gender:null,age:25,weight:null,height:null,
  daysPerWeek:3,selectedDays:[],sport_history:[],sport_other:'',
  walkrun_run_min:1,walkrun_walk_min:2,walkrun_series:5,walkrun_warmup:5,walkrun_rpe:null,
  health_train_type:null,health_easy_pace_min:6,health_easy_pace_sec:0,health_weekly_km:20,health_rpe:null,health_week_plan:{},
  comeback_reason:null,comeback_injury_area:null,comeback_injury_type:null,comeback_injury_notes:'',
  comeback_doctor:null,comeback_recovery:null,comeback_severity:null,comeback_last_train:null,
  comeback_train_type:null,comeback_week_plan:{},
  current_weekly_mileage:null,workouts_per_week:null,easy_pace_min:null,easy_pace_sec:null,is_structured:null,
  endurance_dist:null,customDist:10,dist_longest_run:null,dist_has_race:null,dist_goal_date:null,dist_cal_month:null,dist_cal_year:null,
  time_distance:null,time_custom_dist:null,time_pb_hours:null,time_pb_mins:null,time_pb_secs:null,
  time_target_hours:null,time_target_mins:null,time_target_secs:null,time_has_race:null,time_goal_date:null,time_cal_month:null,time_cal_year:null
};
const S={step:0,history:[],data:D};

const LANGS=[{code:'en',name:'English',sub:'English',flag:'🇬🇧'},{code:'pl',name:'Polski',sub:'Polish',flag:'🇵🇱'},{code:'fr',name:'Français',sub:'French',flag:'🇫🇷'},{code:'es',name:'Español',sub:'Spanish',flag:'🇪🇸'},{code:'de',name:'Deutsch',sub:'German',flag:'🇩🇪'}];

// ─── COPY ─────────────────────────────────────────────────────
const C={
  en:{
    of:'of',cont:'Continue',back:'Back',
    wtag:'AI Running Coach',wh:'Train smarter,\nnot harder.',
    ws:'velm pairs you with a 5-agent AI staff — coach, physio, analyst, psychologist, and head trainer — who collaborate every week to build your perfect plan.',
    wf1:'<strong>4 AI coaches</strong> — analyst, physio, head trainer & psychologist',
    wf2:'<strong>Weekly council</strong> — all 4 review your data and build next week together',
    wf3:'<strong>Always in contact</strong> — your coach adapts the plan when life gets in the way',
    wf4:'<strong>Built for performance</strong> — not a generic app. Every session has a purpose.',
    lh:'Choose your\nlanguage',ls:'You can change this in settings anytime.',
    uh:'Which units\ndo you prefer?',us:'For distances, pace, and body metrics.',
    umet:'Metric',umets:'km · kg · cm',uimp:'Imperial',uimps:'mi · lbs · ft',
    wh2:'Do you use a\nsports watch?',ws2:'With a watch we use heart rate data. Without one, we go by how hard it feels.',
    wyes:'Yes, I have a watch',wyess:'Tracks HR, pace and distance live',
    wno:'No, I run by feel',wnos:'We use effort ratings — just as effective',
    lvh:'Choose your\nrunner level',lvs:"Be honest — your plan is only as good as your starting data.",
    lbeg:'Beginner',lbegs:'New to running, or returning after a break',
    ladv:'Experienced',ladvs:'You run regularly and want to improve',
    gh:"What's your\nmain goal?",gs:'Swipe to browse, tap to select.',
    goals:{
      start:{title:'Start Running',desc:'Go from zero to running 30 minutes non-stop. We use a proven walk-run method — short running intervals that grow each week until you never need to stop. No experience needed, no pressure.'},
      walkrun:{title:'Walk/Run → Run',desc:'Already doing walk-run intervals and want to make the jump to continuous running. We gradually reduce your walk breaks as your fitness improves — at a pace your body can actually handle.'},
      health:{title:'Health & Fitness',desc:'Running for your health, energy, and mood — not for a race. Your plan focuses on building a consistent habit, protecting you from injury, and making running feel good every single week.'},
      comeback:{title:'Comeback',desc:'Returning after injury, illness, or a long break. Your plan is built around safe re-entry — protecting healing tissue, avoiding setbacks, and rebuilding fitness faster than starting from scratch.'},
      distance:{title:'Distance Goal',desc:'Training for a half marathon, full marathon, or ultra. Your plan builds your long run week by week using the 10% rule, with taper and peak weeks calculated back from your race date.'},
      time:{title:'Improve Your Time',desc:'You already run — now you want to run faster. Your plan includes tempo runs, intervals, and race-pace work calibrated to your current best time and your target. Every session has a specific speed purpose.'},
    },
    q15:'Can you run 15 min without stopping?',yes15:'Yes, no problem',no15:'No, I need to stop or walk',
    qstairs:'Do stairs leave you out of breath?',qyes:'Yes, even a few floors',qno:'No, stairs feel easy',
    qsports:'What sports have you done in the last year?',
    qage:'About you',qgender:'Gender',qweight:'Your weight',qheight:'Your height',
    qdays:'How many workouts\nper week can you do?',
    qready:'Your profile is ready',qreadymsg:'We have everything we need. Your AI staff will now build your first week.',
    qgenerate:'Generate My Plan',
    wdays:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    wdaysfull:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    months:['January','February','March','April','May','June','July','August','September','October','November','December'],
    qhtt:'How do you train at the moment?',
    htwalkrun:'Walk/Run intervals',hteasy:'Easy runs',htmixed:'Mixed training',htinterval:'Interval runs',htlong:'Long runs',httempo:'Tempo runs',
    qepace:'At what pace do you run comfortably?',qekm:'How far do you run in one session?',
    qrpe:'How hard does a typical run feel?',
    rpe:['Very easy','Comfortable','Moderately hard','Hard','Exhausting'],
    rpesub:['Could go for hours','Breathing easy, could talk','Slightly breathless','Breathing hard, can\'t talk much','Completely out of breath'],
    qmixweek:'What does your typical week look like?',qmixvol:'How many km per week and at what pace?',
    sessions:'Sessions per week',weekly:'Total km per week',paceUnit_km:'min/km',paceUnit_mi:'min/mi',
    qcbreason:'What caused your break?',cbinj:'Injury or Pain',cbinjs:'Stopped due to a physical injury',cblife:'Life / Got busy',cblifes:'No injury — life got in the way',
    qcbdetails:'Injury Details',qcbd_where:'Where was the injury?',qcbd_where_ph:'e.g. Left knee, shin, Achilles',qcbd_what:'What exactly happened?',qcbd_what_ph:'e.g. Sprain, strain, stress fracture, pain',qcbd_notes:'Additional notes for your coach (optional)',qcbd_notes_ph:'Doctor\'s diagnosis, how you feel now...',
    qcbsev:'How severe was the injury?',
    cbsev:['Very mild','Mild','Moderate','Severe','Very severe'],
    cbsevs:['Slight discomfort, could walk normally','Noticeable pain, activity was limited','Clear pain, had to restrict most movement','Strong pain, difficult to walk normally','Required surgery, cast or crutches'],
    qcbdoc:'Has a doctor or physio cleared you to run?',cbdocyes:'Yes, I have clearance',cbdocno:'No, I will monitor it myself',
    qcbrec:'How recovered are you right now?',cbrec:['Fully recovered (100%)','Still minor discomfort (75%)','Still noticeable (50%)'],
    qcblast:'When was your last regular training?',cblast:['Less than a month ago','1–3 months ago','3–6 months ago','More than a year ago'],
    qcbtrtype:'What did your training look like before the break?',qcb_dynamic_tr:'What kind of training were you doing before the injury?',
    qcb_wrc1:'How did you structure your intervals?',
    qcb_wrc2:'How many cycles did you usually do?',
    qcb_rpe:'How hard were those workouts?',
    qcb_epace:'What was your easy pace back then?',
    qcb_ekm:'How long was your typical run?',
    qcb_mixweek:'What did your typical week look like?',
    qcb_mixvol:'What was your weekly distance and pace?',
    qadvvol:'How many km do you run per week?',qadvpace:'How fast do you run on easy days?',
    qedist:'What is your target distance?',
    dist5k:'5k',dist10k:'10k',disthalf:'Half Marathon',distmarathon:'Marathon',distultra:'50km Ultra',distother:'Other',
    qlongest:'What\'s the longest you\'ve run recently?',qrace:'Do you have a race planned?',
    raceyes:'Yes, I know my race date',raceno:'Not yet — I\'ll set my own target date',
    qracedate:'When is the race?',qgoaldate:'When do you want to reach your goal?',
    qgoaldatehint:'Pick a realistic date — you can always change it later in settings.',
    seldate:'Selected date',
    qwrc1:'How do you structure your intervals?',walk_time:'Walk time',run_time:'Run time',
    qwrc2:'How many times do you repeat the cycle?',qwrc2_sub:'Your cycle: {run} min run / {walk} min walk',
    cycle_count:'Cycles',sessions_per_week:'Current sessions per week',qwr_rpe:'How tired are you after a typical workout?',
    qtdist:'Which distance do you want to run faster?',
    qcurpb:'What is your best time for this distance?',qtarget:'What time do you want to beat?',
    hrs:'hrs',min:'min',sec:'sec',
    errtarget:'Your target must be faster than your current best time',
    male:'Male',female:'Female',gender_other:'Other',
    sport_none_lbl:'None',sport_football_lbl:'Football',sport_gym_lbl:'Gym',sport_swim_lbl:'Swimming',sport_cycle_lbl:'Cycling',sport_tennis_lbl:'Tennis',sport_other_lbl:'Other (write)',whichsport:'Which sport?',
    daysweek:'days/week',selectdays:'Select your training days',perfectdist:'Days selected',
    select:'Select',remove:'Remove',day:'day',days:'days',
  },
  pl:{
    of:'z',cont:'Dalej',back:'Wstecz',
    wtag:'Twój trener AI',wh:'Trenuj mądrzej,\nnie ciężej.',
    ws:'velm łączy Cię z 4-osobowym sztabem AI — trenerem, fizjoterapeutą, analitykiem i psychologiem — którzy wspólnie tworzą Twój idealny plan biegowy.',
    wf1:'<strong>4 trenerów AI</strong> — analityk, fizjo, trener prowadzący i psycholog',
    wf2:'<strong>Cotygodniowa odprawa</strong> — cała czwórka analizuje Twoje dane z poprzedniego tygodnia',
    wf3:'<strong>Stały kontakt</strong> — sztab dopasowuje proces do Twojego harmonogramu',
    wf4:'<strong>Maksymalizacja wyników</strong> — koniec z monotonią, każdy trening ma swój cel',
    lh:'Wybierz\njęzyk',ls:'Możesz zmienić go później w ustawieniach.',
    uh:'Jakie jednostki\npreferujesz?',us:'Dotyczy dystansów, tempa i danych treningowych.',
    umet:'Metryczne',umets:'km · kg · cm',uimp:'Imperialne',uimps:'mile · lbs · stopy',
    wh2:'Czy używasz\nzegarka sportowego?',ws2:'Pulsometr pozwala nam analizować tętno. Bez niego polegamy na odczuwaniu własnego ciała (RPE).',
    wyes:'Tak, mam zegarek',wyess:'Możliwość śledzenia tętna, tempa i dystansu',
    wno:'Nie, biegam na czucie',wnos:'Opieramy treningi na subiektywnej ocenie wysiłku',
    lvh:'Wybierz swój\npoziom',lvs:'Szczerza ocena pomoże nam ułożyć optymalny start.',
    lbeg:'Początkujący',lbegs:'Dopiero zaczynam, lub wracam do biegania po dłuższej przerwie',
    ladv:'Zaawansowany',ladvs:'Biegam regularnie i chcę pobić swoje rekordy',
    gh:'Jaki jest Twój\ngłówny cel?',gs:'Przesuwaj w boki, żeby przeglądać opcje.',
    goals:{
      start:{title:'Zacznij biegać',desc:'Od zera do 30 minut ciągłego biegu. Używamy niezawodnej metody marsz-bieg (Galloway) — zaczynamy od przewagi marszu i płynnie wydłużamy odcinki biegowe aż w ogóle nie będziesz musiał się zatrzymywać.'},
      walkrun:{title:'Marsz-bieg → Bieg',desc:'Już robisz interwały marsz-bieg i chcesz wejść na wyższy obrót? Stopniowo redukujemy przestoje w zgodzie z Twoją obecną formą, aż przejdziesz do swobodnego, bezustannego biegania.'},
      health:{title:'Dla zdrowia i kondycji',desc:'Biegasz, żeby po prostu dobrze się czuć — na luzie. Twój plan ugruntuje zdrowy nawyk, osłoni Cię przed przetrenowaniem i sprawi, że pokochasz swoje treningi na nowo.'},
      comeback:{title:'Wielki powrót',desc:'Wracasz do formy po kontuzji, lub długiej abstynencji. Zaprojektujemy bezpieczny powrót — nałożymy parasol ochronny na wyleczone tkanki biegowe i w mgnieniu oka wyprowadzimy Cię z powrotem na szczyt.'},
      distance:{title:'Podbij swój dystans',desc:'Zbroisz się na pierwszy półmaraton, maraton, lub ultra wyzwanie. Twój plan będzie obudowany na progresji najdłuższego wybiegania z żelazną zasadą objętości 10%, oraz profesjonalnym taperingiem przed dniem startu.'},
      time:{title:'Złam dotychczasowy PB',desc:'Znasz smak rywalizacji, a bieganie we krwi już płynie. Ułożymy mocny reżim startowy — wyżyłowane interwały, tempo-run, siła biegowa, wszystko uszyte miarowo pod Twój cel.'},
    },
    q15: `Czy jesteś w stanie biec 15 minut\nbez przerwy?`,yes15:'Tak, bez problemu',no15:'Nie, muszę się zatrzymać',
    qstairs:'Czy wchodzenie po schodach sprawia Ci trudność?',qyes:'Tak, nawet przy kilku piętrach',qno:'Nie, wchodzę bez problemu',
    qsports: `Jakie sporty uprawiałeś/uprawiałaś w ubiegłym roku?`,
    qage:'O Tobie',qgender:'Płeć',qweight:'Waga (kg)',qheight:'Wzrost (cm)',
    qdays:'Ile treningów w tygodniu\njesteś w stanie realizować?',
    qready:'Twój profil jest gotowy',qreadymsg:'Wszystkie informacje zostały zebrane. Wygenerujemy teraz Twój plan treningowy.',
    qgenerate:'Wygeneruj plan',
    wdays:['Pn','Wt','Śr','Cz','Pt','So','Nd'],
    wdaysfull:['Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela'],
    months:['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
    qhtt:'Jak aktualnie trenujesz?',
    htwalkrun:'Marszobieg',hteasy:'Zwykłe, lekkie wybiegania',htmixed:'Sesje mieszane (spokojne, objętość, akcenty)',htinterval:'Interwały',htlong:'Długie wybiegania',httempo:'Biegi tempowe',
    qepace:'Twoje spokojne tempo (Easy)?',qekm:'Dystans standardowego treningu?',
    qrpe:'Jak bardzo męczący jest Twój typowy trening?',
    rpe:['Bardzo lekki','Komfortowy','Umiarkowany','Wymagający','Wyczerpujący'],
    rpesub:['Dałoby się biec godzinami','Bez zadyszki, swobodnie rozmawiam','Lekko przyspieszony oddech','Zadyszka, trudności w rozmowie','Praktycznie całkowity brak tchu'],
    qmixweek:'Jak wygląda Twój standardowy tydzień?',qmixvol:'Jak wygląda Twoja objętość (dystans)?',
    sessions:'Wyjść w tyg.',weekly:'Tygodniowy kilometraż',paceUnit_km:'min/km',paceUnit_mi:'min/mi',
    qcbreason:'Jaki był powód Twojej przerwy?',cbinj:'Kontuzja lub ból',cbinjs:'Przerwa z powodu urazu fizycznego',cblife:'Brak czasu / Obowiązki',cblifes:'Przerwa z powodu braku czasu lub zdrowia',
    qcbdetails:'Szczegóły kontuzji',qcbd_where:'Gdzie pojawiła się kontuzja?',qcbd_where_ph:'np. lewe kolano, łydka, Achilles',qcbd_what:'Co dokładnie uległo uszkodzeniu?',qcbd_what_ph:'np. skręcenie, naderwanie, ból',qcbd_notes:'Dodatkowe informacje dla trenera (opcjonalnie)',qcbd_notes_ph:'Diagnoza lekarza, ogólne samopoczucie...',
    qcbsev:'Jak poważna była to kontuzja?',
    cbsev:['Bardzo łagodna','Łagodna','Umiarkowana','Poważna','Bardzo poważna'],
    cbsevs:['Lekki dyskomfort, chodzenie bez ograniczeń','Odczuwalny ból, aktywność fizyczna była utrudniona','Wyraźny ból, ograniczenie większości ruchu','Silny ból, trudności w normalnym chodzeniu','Wymagana operacja, gips lub ostre leczenie'],
    qcbdoc:'Czy specjalista wydał zgodę na powrót do sportu?',cbdocyes:'Tak, posiadam zgodę',cbdocno:'Nie byłem/byłam u specjalisty',
    qcbrec:'Na ile sprawnie czujesz się obecnie?',cbrec:['W pełni wyleczony (100%)','Nadal odczuwam lekki dyskomfort (75%)','Dalej widzę wyraźny problem (50%)'],
    qcblast:'Kiedy po raz ostatni regularnie trenowałeś/trenowałaś?',cblast:['W tym miesiącu','1–3 miesiące temu','3–6 miesięcy temu','Ponad rok temu'],
    qcbtrtype:'Jak wyglądał Twój trening przed przerwą?',qcb_dynamic_tr:'Jakie typy treningów wykonywałeś/wykonywałaś przed kontuzją?',
    qcb_wrc1:'Jak dobierałeś/dobierałaś swoje interwały?',
    qcb_wrc2:'Ile razy powtarzałeś/powtarzałaś ten cykl?',
    qcb_rpe:'Jak bardzo męczące były to treningi?',
    qcb_epace:'Jakie było Twoje tempo spokojnych biegów?',
    qcb_ekm:'Opisz więcej swoich dawnych treningów',
    qcb_mixweek:'Jak wyglądał Twój typowy tydzień treningowy?',
    qcb_mixvol:'Powiedz nam więcej o swoim tygodniu',
    qadvvol:'Ile kilometrów biegasz tygodniowo?',qadvpace:'W jakim tempie biegasz w spokojne dni?',
    qedist:'Docelowy dystans startowy',
    dist5k:'5 km',dist10k:'10 km',disthalf:'Półmaraton',distmarathon:'Maraton',distultra:'Ultramaraton',distother:'Niestandardowy',
    qlongest:'Jaki był Twój najdłuższy bieg w ostatnim czasie?',qrace:'Czy masz już zaplanowane zawody?',
    raceyes:'Tak, znam datę startu',raceno:'Jeszcze nie — sam wyznaczę sobie termin',
    qracedate:'Data zawodów',qgoaldate:'Kiedy chcesz osiągnąć swój cel?',
    qgoaldatehint:'Wybierz realny termin — zawsze możesz go zmienić w ustawieniach.',
    seldate:'Wybrano',
    qwrc1:'Jak układasz swoje interwały marszobiegowe?',walk_time:'Marsz (min)',run_time:'Bieg (min)',
    qwrc2:'Ile razy powtarzasz ten cykl w treningu?',qwrc2_sub:'Pętla treningowa: {run} min biegu / {walk} min marszu',
    cycle_count:'Ilość cykli',sessions_per_week:'Treningów w tyg.',qwr_rpe:'Jak bardzo męczą Cię takie serie?',
    qtdist:'Wybierz dystans, na którym chcesz pobić rekord:',
    qcurpb:'Jaki jest Twój aktualny rekord na tym dystansie (PB)?',qtarget:'Jaki czas chcesz osiągnąć?',
    hrs:'godz.',min:'min',sec:'sek',
    errtarget:'Podany czas jest gorszy lub równy Twojemu obecnemu rekordowi.',
    male:'Mężczyzna',female:'Kobieta',gender_other:'Inne',
    sport_none_lbl:'Brak sportu w ostatnim czasie',sport_football_lbl:'Piłka nożna / sporty zespołowe',sport_gym_lbl:'Siłownia i fitness',sport_swim_lbl:'Pływanie',sport_cycle_lbl:'Kolarstwo',sport_tennis_lbl:'Tenis',sport_other_lbl:'Inne (wpisz)',whichsport:'Jakie konkretnie?',
    daysweek:'dni w tygodniu',selectdays:'Wybierz dni treningowe',perfectdist:'Wybrano odpowiednią ilość',
    select:'Wybierz:',remove:'Usuń:',day:'dzień',days:'dni',
  },
  fr:{
    of:'sur',cont:'Continuer',back:'Retour',
    wtag:'Ton coach IA',wh:'Entraîne-toi plus malin,\npas plus dur.',
    ws:"velm t'associe à un staff de 4 experts IA — entraîneur, kiné, analyste et psychologue — qui collaborent chaque semaine pour bâtir ton plan idéal.",
    wf1:'<strong>4 coachs IA</strong> — analyste, kiné, entraîneur principal et psychologue',
    wf2:'<strong>Réunion hebdomadaire</strong> — tous les 4 analysent tes données et construisent la semaine suivante',
    wf3:"<strong>Toujours joignables</strong> — le staff adapte le plan quand la vie s'en mêle",
    wf4:'<strong>Conçu pour la performance</strong> — pas une appli générique. Chaque séance a un but.',
    lh:'Choisis ta\nlangue',ls:'Tu pourras la changer à tout moment dans les réglages.',
    uh:'Quelles unités\npréfères-tu ?',us:"Pour les distances, l'allure et les mesures corporelles.",
    umet:'Métriques',umets:'km · kg · cm',uimp:'Impériales',uimps:'mi · lbs · ft',
    wh2:'Utilises-tu une\nmontre de sport ?',ws2:"Avec une montre, on exploite la fréquence cardiaque. Sans, on se base sur l'effort ressenti.",
    wyes:"Oui, j'ai une montre",wyess:"Suit la FC, l'allure et la distance en direct",
    wno:'Non, je cours au ressenti',wnos:"On utilise l'échelle d'effort — tout aussi efficace",
    lvh:'Choisis ton\nniveau',lvs:'Sois honnête — ton plan ne vaut que ce que valent tes données de départ.',
    lbeg:'Débutant',lbegs:'Nouveau dans la course, ou de retour après une pause',
    ladv:'Expérimenté',ladvs:'Tu cours régulièrement et tu veux progresser',
    gh:'Quel est ton\nobjectif principal ?',gs:'Balaie pour parcourir, touche pour choisir.',
    goals:{
      start:{title:'Commencer à courir',desc:"Passe de zéro à 30 minutes de course sans arrêt. On utilise la méthode marche-course éprouvée — de courts intervalles de course qui s'allongent chaque semaine jusqu'à ce que tu n'aies plus besoin de t'arrêter. Aucune expérience requise, aucune pression."},
      walkrun:{title:'Marche/course → course',desc:"Tu alternes déjà marche et course et tu veux passer à la course continue. On réduit progressivement tes pauses de marche à mesure que ta forme progresse — à un rythme que ton corps peut réellement encaisser."},
      health:{title:'Santé et forme',desc:"Courir pour ta santé, ton énergie et ton moral — pas pour une compétition. Ton plan vise à installer une habitude régulière, à te protéger des blessures et à rendre chaque semaine de course agréable."},
      comeback:{title:'Grand retour',desc:"De retour après une blessure, une maladie ou une longue pause. Ton plan est construit autour d'une reprise en sécurité — protéger les tissus en cours de guérison, éviter les rechutes et retrouver la forme plus vite qu'en repartant de zéro."},
      distance:{title:'Objectif distance',desc:"Préparation d'un semi-marathon, d'un marathon ou d'un ultra. Ton plan développe ta sortie longue semaine après semaine avec la règle des 10 %, avec affûtage et semaines de pic calculés à rebours depuis la date de ta course."},
      time:{title:'Améliorer ton temps',desc:"Tu cours déjà — maintenant tu veux courir plus vite. Ton plan inclut des séances au seuil, du fractionné et du travail à allure de course, calibrés sur ton meilleur temps actuel et ton objectif. Chaque séance a un but précis en termes de vitesse."},
    },
    q15:"Peux-tu courir 15 min sans t'arrêter ?",yes15:'Oui, sans problème',no15:"Non, je dois m'arrêter ou marcher",
    qstairs:'Les escaliers t\'essoufflent-ils ?',qyes:'Oui, même quelques étages',qno:'Non, les escaliers sont faciles',
    qsports:"Quels sports as-tu pratiqués l'an dernier ?",
    qage:'À propos de toi',qgender:'Genre',qweight:'Ton poids',qheight:'Ta taille',
    qdays:"Combien de séances\npar semaine peux-tu faire ?",
    qready:'Ton profil est prêt',qreadymsg:'On a tout ce qu\'il faut. Ton staff IA va maintenant bâtir ta première semaine.',
    qgenerate:'Générer mon plan',
    wdays:['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
    wdaysfull:['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'],
    months:['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    qhtt:'Comment t\'entraînes-tu en ce moment ?',
    htwalkrun:'Intervalles marche/course',hteasy:'Sorties faciles',htmixed:'Entraînement mixte',htinterval:'Fractionné',htlong:'Sorties longues',httempo:'Séances au seuil',
    qepace:'À quelle allure cours-tu confortablement ?',qekm:'Quelle distance parcours-tu par séance ?',
    qrpe:'À quel point une sortie type te demande-t-elle ?',
    rpe:['Très facile','Confortable','Modérément dur','Dur','Épuisant'],
    rpesub:['Je pourrais tenir des heures','Respiration facile, je peux parler','Léger essoufflement','Respiration forte, je parle peu','Complètement à bout de souffle'],
    qmixweek:'À quoi ressemble ta semaine type ?',qmixvol:'Combien de km par semaine et à quelle allure ?',
    sessions:'Séances par semaine',weekly:'Total km par semaine',paceUnit_km:'min/km',paceUnit_mi:'min/mi',
    qcbreason:'Quelle est la cause de ta pause ?',cbinj:'Blessure ou douleur',cbinjs:'Arrêt dû à une blessure physique',cblife:'Vie perso / manque de temps',cblifes:"Pas de blessure — la vie s'en est mêlée",
    qcbdetails:'Détails de la blessure',qcbd_where:'Où se situait la blessure ?',qcbd_where_ph:'ex. genou gauche, tibia, tendon d\'Achille',qcbd_what:"Que s'est-il passé exactement ?",qcbd_what_ph:'ex. entorse, élongation, fracture de fatigue, douleur',qcbd_notes:'Notes complémentaires pour ton coach (facultatif)',qcbd_notes_ph:'Diagnostic du médecin, comment tu te sens maintenant...',
    qcbsev:'Quelle était la gravité de la blessure ?',
    cbsev:['Très légère','Légère','Modérée','Grave','Très grave'],
    cbsevs:['Léger inconfort, marche normale possible','Douleur nette, activité limitée','Douleur franche, la plupart des mouvements restreints','Forte douleur, marche difficile','A nécessité chirurgie, plâtre ou béquilles'],
    qcbdoc:'Un médecin ou un kiné t\'a-t-il autorisé à courir ?',cbdocyes:"Oui, j'ai le feu vert",cbdocno:'Non, je surveille moi-même',
    qcbrec:'Où en est ta récupération aujourd\'hui ?',cbrec:['Totalement rétabli (100 %)','Encore un léger inconfort (75 %)','Encore bien présent (50 %)'],
    qcblast:'À quand remonte ton dernier entraînement régulier ?',cblast:["Il y a moins d'un mois",'Il y a 1 à 3 mois','Il y a 3 à 6 mois',"Il y a plus d'un an"],
    qcbtrtype:'À quoi ressemblait ton entraînement avant la pause ?',qcb_dynamic_tr:'Quel type d\'entraînement faisais-tu avant la blessure ?',
    qcb_wrc1:'Comment structurais-tu tes intervalles ?',
    qcb_wrc2:'Combien de cycles faisais-tu en général ?',
    qcb_rpe:'À quel point ces séances étaient-elles dures ?',
    qcb_epace:'Quelle était ton allure facile à l\'époque ?',
    qcb_ekm:'Quelle était la durée de ta sortie type ?',
    qcb_mixweek:'À quoi ressemblait ta semaine type ?',
    qcb_mixvol:'Quels étaient ton volume et ton allure hebdomadaires ?',
    qadvvol:'Combien de km cours-tu par semaine ?',qadvpace:'À quelle vitesse cours-tu les jours faciles ?',
    qedist:'Quelle est ta distance cible ?',
    dist5k:'5 km',dist10k:'10 km',disthalf:'Semi-marathon',distmarathon:'Marathon',distultra:'Ultra 50 km',distother:'Autre',
    qlongest:'Quelle est la plus longue distance courue récemment ?',qrace:'As-tu une course prévue ?',
    raceyes:'Oui, je connais la date de ma course',raceno:'Pas encore — je fixerai ma propre échéance',
    qracedate:'Quand a lieu la course ?',qgoaldate:'Quand veux-tu atteindre ton objectif ?',
    qgoaldatehint:'Choisis une date réaliste — tu pourras toujours la modifier dans les réglages.',
    seldate:'Date choisie',
    qwrc1:'Comment structures-tu tes intervalles ?',walk_time:'Temps de marche',run_time:'Temps de course',
    qwrc2:'Combien de fois répètes-tu le cycle ?',qwrc2_sub:'Ton cycle : {run} min de course / {walk} min de marche',
    cycle_count:'Cycles',sessions_per_week:'Séances actuelles par semaine',qwr_rpe:'À quel point es-tu fatigué après une séance type ?',
    qtdist:'Sur quelle distance veux-tu aller plus vite ?',
    qcurpb:'Quel est ton meilleur temps sur cette distance ?',qtarget:'Quel temps veux-tu battre ?',
    hrs:'h',min:'min',sec:'sec',
    errtarget:'Ton objectif doit être plus rapide que ton meilleur temps actuel',
    male:'Homme',female:'Femme',gender_other:'Autre',
    sport_none_lbl:'Aucun',sport_football_lbl:'Football',sport_gym_lbl:'Salle de sport',sport_swim_lbl:'Natation',sport_cycle_lbl:'Cyclisme',sport_tennis_lbl:'Tennis',sport_other_lbl:'Autre (à préciser)',whichsport:'Quel sport ?',
    daysweek:'jours/semaine',selectdays:"Choisis tes jours d'entraînement",perfectdist:'Jours sélectionnés',
    select:'Choisis',remove:'Retire',day:'jour',days:'jours',
  },
  es:{
    of:'de',cont:'Continuar',back:'Atrás',
    wtag:'Tu entrenador con IA',wh:'Entrena con cabeza,\nno más duro.',
    ws:'velm te conecta con un equipo de 4 expertos IA — entrenador, fisio, analista y psicólogo — que colaboran cada semana para crear tu plan perfecto.',
    wf1:'<strong>4 entrenadores IA</strong> — analista, fisio, entrenador jefe y psicólogo',
    wf2:'<strong>Reunión semanal</strong> — los 4 revisan tus datos y construyen juntos la semana siguiente',
    wf3:'<strong>Siempre en contacto</strong> — el equipo adapta el plan cuando la vida se cruza',
    wf4:'<strong>Hecho para rendir</strong> — no es una app genérica. Cada sesión tiene un propósito.',
    lh:'Elige tu\nidioma',ls:'Puedes cambiarlo cuando quieras en ajustes.',
    uh:'¿Qué unidades\nprefieres?',us:'Para distancias, ritmo y medidas corporales.',
    umet:'Métricas',umets:'km · kg · cm',uimp:'Imperiales',uimps:'mi · lbs · ft',
    wh2:'¿Usas un\nreloj deportivo?',ws2:'Con reloj usamos los datos de frecuencia cardíaca. Sin él, nos guiamos por el esfuerzo percibido.',
    wyes:'Sí, tengo reloj',wyess:'Registra FC, ritmo y distancia en directo',
    wno:'No, corro por sensaciones',wnos:'Usamos la escala de esfuerzo — igual de eficaz',
    lvh:'Elige tu\nnivel',lvs:'Sé sincero — tu plan vale lo que valgan tus datos de partida.',
    lbeg:'Principiante',lbegs:'Empiezas a correr o vuelves tras un parón',
    ladv:'Experimentado',ladvs:'Corres con regularidad y quieres mejorar',
    gh:'¿Cuál es tu\nobjetivo principal?',gs:'Desliza para explorar, toca para elegir.',
    goals:{
      start:{title:'Empezar a correr',desc:'De cero a correr 30 minutos sin parar. Usamos el método caminar-correr, de eficacia probada — intervalos cortos de carrera que crecen cada semana hasta que ya no necesites detenerte. Sin experiencia previa y sin presión.'},
      walkrun:{title:'Caminar/correr → correr',desc:'Ya haces intervalos de caminar y correr y quieres dar el salto a la carrera continua. Reducimos poco a poco las pausas de caminata a medida que mejora tu forma — a un ritmo que tu cuerpo pueda asumir de verdad.'},
      health:{title:'Salud y forma física',desc:'Correr por tu salud, tu energía y tu ánimo — no por una carrera. Tu plan se centra en construir un hábito constante, protegerte de lesiones y hacer que correr siente bien cada semana.'},
      comeback:{title:'Gran regreso',desc:'Vuelves tras una lesión, una enfermedad o un parón largo. Tu plan se construye en torno a una reincorporación segura — proteger el tejido en recuperación, evitar recaídas y recuperar forma más rápido que empezando de cero.'},
      distance:{title:'Objetivo de distancia',desc:'Preparación de media maratón, maratón o ultra. Tu plan hace crecer tu tirada larga semana a semana con la regla del 10 %, con descarga y semanas pico calculadas hacia atrás desde la fecha de tu carrera.'},
      time:{title:'Mejorar tu marca',desc:'Ya corres — ahora quieres correr más rápido. Tu plan incluye series al umbral, intervalos y trabajo a ritmo de carrera, calibrados según tu mejor marca actual y tu objetivo. Cada sesión tiene un propósito concreto de velocidad.'},
    },
    q15:'¿Puedes correr 15 min sin parar?',yes15:'Sí, sin problema',no15:'No, necesito parar o caminar',
    qstairs:'¿Te quedas sin aliento al subir escaleras?',qyes:'Sí, incluso unos pocos pisos',qno:'No, las escaleras me resultan fáciles',
    qsports:'¿Qué deportes has practicado el último año?',
    qage:'Sobre ti',qgender:'Género',qweight:'Tu peso',qheight:'Tu altura',
    qdays:'¿Cuántos entrenamientos\npor semana puedes hacer?',
    qready:'Tu perfil está listo',qreadymsg:'Ya tenemos todo lo necesario. Tu equipo de IA construirá ahora tu primera semana.',
    qgenerate:'Generar mi plan',
    wdays:['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],
    wdaysfull:['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],
    months:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    qhtt:'¿Cómo entrenas ahora mismo?',
    htwalkrun:'Intervalos caminar/correr',hteasy:'Carreras suaves',htmixed:'Entrenamiento mixto',htinterval:'Series',htlong:'Tiradas largas',httempo:'Series al umbral',
    qepace:'¿A qué ritmo corres cómodo?',qekm:'¿Qué distancia haces en una sesión?',
    qrpe:'¿Cuánto te exige una carrera típica?',
    rpe:['Muy suave','Cómodo','Moderadamente duro','Duro','Agotador'],
    rpesub:['Podría seguir horas','Respiro con calma, puedo hablar','Ligeramente sin aliento','Respiro fuerte, apenas puedo hablar','Completamente sin aliento'],
    qmixweek:'¿Cómo es tu semana típica?',qmixvol:'¿Cuántos km por semana y a qué ritmo?',
    sessions:'Sesiones por semana',weekly:'Total de km por semana',paceUnit_km:'min/km',paceUnit_mi:'min/mi',
    qcbreason:'¿Qué causó tu parón?',cbinj:'Lesión o dolor',cbinjs:'Parón por una lesión física',cblife:'Vida personal / falta de tiempo',cblifes:'Sin lesión — la vida se cruzó',
    qcbdetails:'Detalles de la lesión',qcbd_where:'¿Dónde fue la lesión?',qcbd_where_ph:'p. ej. rodilla izquierda, espinilla, Aquiles',qcbd_what:'¿Qué pasó exactamente?',qcbd_what_ph:'p. ej. esguince, distensión, fractura por estrés, dolor',qcbd_notes:'Notas adicionales para tu entrenador (opcional)',qcbd_notes_ph:'Diagnóstico médico, cómo te sientes ahora...',
    qcbsev:'¿Cómo de grave fue la lesión?',
    cbsev:['Muy leve','Leve','Moderada','Grave','Muy grave'],
    cbsevs:['Molestia ligera, podía caminar con normalidad','Dolor notable, actividad limitada','Dolor claro, tuve que restringir casi todo movimiento','Dolor fuerte, caminar con normalidad era difícil','Requirió cirugía, escayola o muletas'],
    qcbdoc:'¿Un médico o fisio te ha dado el alta para correr?',cbdocyes:'Sí, tengo el alta',cbdocno:'No, lo vigilo por mi cuenta',
    qcbrec:'¿Cómo de recuperado estás ahora mismo?',cbrec:['Totalmente recuperado (100 %)','Aún con molestia leve (75 %)','Aún se nota bastante (50 %)'],
    qcblast:'¿Cuándo entrenaste con regularidad por última vez?',cblast:['Hace menos de un mes','Hace 1–3 meses','Hace 3–6 meses','Hace más de un año'],
    qcbtrtype:'¿Cómo era tu entrenamiento antes del parón?',qcb_dynamic_tr:'¿Qué tipo de entrenamiento hacías antes de la lesión?',
    qcb_wrc1:'¿Cómo estructurabas tus intervalos?',
    qcb_wrc2:'¿Cuántos ciclos solías hacer?',
    qcb_rpe:'¿Cómo de duros eran esos entrenamientos?',
    qcb_epace:'¿Cuál era tu ritmo suave entonces?',
    qcb_ekm:'¿Cuánto duraba tu carrera típica?',
    qcb_mixweek:'¿Cómo era tu semana típica?',
    qcb_mixvol:'¿Cuál era tu volumen y ritmo semanal?',
    qadvvol:'¿Cuántos km corres por semana?',qadvpace:'¿A qué ritmo corres los días suaves?',
    qedist:'¿Cuál es tu distancia objetivo?',
    dist5k:'5 km',dist10k:'10 km',disthalf:'Media maratón',distmarathon:'Maratón',distultra:'Ultra 50 km',distother:'Otra',
    qlongest:'¿Cuál es la distancia más larga que has corrido últimamente?',qrace:'¿Tienes una carrera planeada?',
    raceyes:'Sí, sé la fecha de mi carrera',raceno:'Todavía no — me pondré mi propia fecha',
    qracedate:'¿Cuándo es la carrera?',qgoaldate:'¿Cuándo quieres alcanzar tu objetivo?',
    qgoaldatehint:'Elige una fecha realista — siempre puedes cambiarla en ajustes.',
    seldate:'Fecha elegida',
    qwrc1:'¿Cómo estructuras tus intervalos?',walk_time:'Tiempo caminando',run_time:'Tiempo corriendo',
    qwrc2:'¿Cuántas veces repites el ciclo?',qwrc2_sub:'Tu ciclo: {run} min corriendo / {walk} min caminando',
    cycle_count:'Ciclos',sessions_per_week:'Sesiones actuales por semana',qwr_rpe:'¿Cómo de cansado acabas tras un entrenamiento típico?',
    qtdist:'¿En qué distancia quieres correr más rápido?',
    qcurpb:'¿Cuál es tu mejor marca en esta distancia?',qtarget:'¿Qué tiempo quieres batir?',
    hrs:'h',min:'min',sec:'seg',
    errtarget:'Tu objetivo debe ser más rápido que tu mejor marca actual',
    male:'Hombre',female:'Mujer',gender_other:'Otro',
    sport_none_lbl:'Ninguno',sport_football_lbl:'Fútbol',sport_gym_lbl:'Gimnasio',sport_swim_lbl:'Natación',sport_cycle_lbl:'Ciclismo',sport_tennis_lbl:'Tenis',sport_other_lbl:'Otro (escríbelo)',whichsport:'¿Qué deporte?',
    daysweek:'días/semana',selectdays:'Elige tus días de entrenamiento',perfectdist:'Días elegidos',
    select:'Elige',remove:'Quita',day:'día',days:'días',
  },
  de:{
    of:'von',cont:'Weiter',back:'Zurück',
    wtag:'Dein KI-Coach',wh:'Trainiere klüger,\nnicht härter.',
    ws:'velm stellt dir einen Stab aus 4 KI-Experten zur Seite — Trainer, Physio, Analyst und Psychologe — die jede Woche zusammen deinen perfekten Plan bauen.',
    wf1:'<strong>4 KI-Coaches</strong> — Analyst, Physio, Cheftrainer und Psychologe',
    wf2:'<strong>Wöchentliche Besprechung</strong> — alle 4 werten deine Daten aus und bauen gemeinsam die nächste Woche',
    wf3:'<strong>Immer erreichbar</strong> — der Stab passt den Plan an, wenn das Leben dazwischenkommt',
    wf4:'<strong>Auf Leistung gebaut</strong> — keine Standard-App. Jede Einheit hat einen Zweck.',
    lh:'Wähle deine\nSprache',ls:'Du kannst sie jederzeit in den Einstellungen ändern.',
    uh:'Welche Einheiten\nbevorzugst du?',us:'Für Distanzen, Pace und Körperwerte.',
    umet:'Metrisch',umets:'km · kg · cm',uimp:'Imperial',uimps:'mi · lbs · ft',
    wh2:'Nutzt du eine\nSportuhr?',ws2:'Mit Uhr verwenden wir Herzfrequenzdaten. Ohne Uhr gehen wir nach dem gefühlten Anstrengungsgrad.',
    wyes:'Ja, ich habe eine Uhr',wyess:'Erfasst HF, Pace und Distanz live',
    wno:'Nein, ich laufe nach Gefühl',wnos:'Wir arbeiten mit der Anstrengungsskala — genauso wirksam',
    lvh:'Wähle dein\nLaufniveau',lvs:'Sei ehrlich — dein Plan ist nur so gut wie deine Startdaten.',
    lbeg:'Anfänger',lbegs:'Neu im Laufen oder zurück nach einer Pause',
    ladv:'Erfahren',ladvs:'Du läufst regelmäßig und willst besser werden',
    gh:'Was ist dein\nHauptziel?',gs:'Wischen zum Blättern, tippen zum Auswählen.',
    goals:{
      start:{title:'Mit dem Laufen anfangen',desc:'Von null bis 30 Minuten am Stück laufen. Wir nutzen die bewährte Geh-Lauf-Methode — kurze Laufintervalle, die jede Woche länger werden, bis du gar nicht mehr stehen bleiben musst. Keine Erfahrung nötig, kein Druck.'},
      walkrun:{title:'Geh-Lauf → Laufen',desc:'Du machst schon Geh-Lauf-Intervalle und willst den Sprung zum durchgehenden Laufen schaffen. Wir kürzen deine Gehpausen Schritt für Schritt, während deine Form wächst — in einem Tempo, das dein Körper wirklich verkraftet.'},
      health:{title:'Gesundheit und Fitness',desc:'Laufen für Gesundheit, Energie und gute Laune — nicht für einen Wettkampf. Dein Plan baut eine feste Gewohnheit auf, schützt dich vor Verletzungen und sorgt dafür, dass sich Laufen jede Woche gut anfühlt.'},
      comeback:{title:'Das große Comeback',desc:'Zurück nach Verletzung, Krankheit oder langer Pause. Dein Plan ist auf einen sicheren Wiedereinstieg gebaut — heilendes Gewebe schützen, Rückschläge vermeiden und schneller wieder in Form kommen als beim Start bei null.'},
      distance:{title:'Distanzziel',desc:'Vorbereitung auf Halbmarathon, Marathon oder Ultra. Dein Plan steigert deinen langen Lauf Woche für Woche nach der 10-%-Regel, mit Tapering und Spitzenwochen, rückwärts von deinem Wettkampftag gerechnet.'},
      time:{title:'Deine Zeit verbessern',desc:'Du läufst bereits — jetzt willst du schneller laufen. Dein Plan enthält Tempoläufe, Intervalle und Arbeit im Wettkampftempo, abgestimmt auf deine aktuelle Bestzeit und dein Ziel. Jede Einheit hat einen klaren Tempozweck.'},
    },
    q15:'Kannst du 15 Min ohne Pause laufen?',yes15:'Ja, problemlos',no15:'Nein, ich muss stehen bleiben oder gehen',
    qstairs:'Bringen dich Treppen aus der Puste?',qyes:'Ja, schon nach wenigen Stockwerken',qno:'Nein, Treppen sind leicht für mich',
    qsports:'Welche Sportarten hast du im letzten Jahr gemacht?',
    qage:'Über dich',qgender:'Geschlecht',qweight:'Dein Gewicht',qheight:'Deine Größe',
    qdays:'Wie viele Einheiten\npro Woche schaffst du?',
    qready:'Dein Profil ist fertig',qreadymsg:'Wir haben alles, was wir brauchen. Dein KI-Stab baut jetzt deine erste Woche.',
    qgenerate:'Meinen Plan erstellen',
    wdays:['Mo','Di','Mi','Do','Fr','Sa','So'],
    wdaysfull:['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'],
    months:['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
    qhtt:'Wie trainierst du im Moment?',
    htwalkrun:'Geh-Lauf-Intervalle',hteasy:'Ruhige Läufe',htmixed:'Gemischtes Training',htinterval:'Intervalle',htlong:'Lange Läufe',httempo:'Tempoläufe',
    qepace:'In welcher Pace läufst du bequem?',qekm:'Wie weit läufst du in einer Einheit?',
    qrpe:'Wie anstrengend ist ein typischer Lauf für dich?',
    rpe:['Sehr leicht','Angenehm','Mittelschwer','Hart','Erschöpfend'],
    rpesub:['Ich könnte stundenlang weiterlaufen','Atmung ruhig, ich kann reden','Leicht außer Atem','Schwere Atmung, kaum reden möglich','Völlig außer Atem'],
    qmixweek:'Wie sieht deine typische Woche aus?',qmixvol:'Wie viele km pro Woche und in welcher Pace?',
    sessions:'Einheiten pro Woche',weekly:'km gesamt pro Woche',paceUnit_km:'min/km',paceUnit_mi:'min/mi',
    qcbreason:'Was war der Grund für deine Pause?',cbinj:'Verletzung oder Schmerzen',cbinjs:'Pause wegen einer körperlichen Verletzung',cblife:'Alltag / keine Zeit',cblifes:'Keine Verletzung — das Leben kam dazwischen',
    qcbdetails:'Details zur Verletzung',qcbd_where:'Wo war die Verletzung?',qcbd_where_ph:'z. B. linkes Knie, Schienbein, Achillessehne',qcbd_what:'Was genau ist passiert?',qcbd_what_ph:'z. B. Verstauchung, Zerrung, Ermüdungsbruch, Schmerzen',qcbd_notes:'Zusätzliche Hinweise für deinen Coach (optional)',qcbd_notes_ph:'Ärztliche Diagnose, wie es dir jetzt geht...',
    qcbsev:'Wie schwer war die Verletzung?',
    cbsev:['Sehr leicht','Leicht','Mittel','Schwer','Sehr schwer'],
    cbsevs:['Leichtes Unbehagen, normales Gehen möglich','Deutliche Schmerzen, Aktivität eingeschränkt','Klare Schmerzen, die meisten Bewegungen eingeschränkt','Starke Schmerzen, normales Gehen schwierig','Operation, Gips oder Krücken nötig'],
    qcbdoc:'Hat ein Arzt oder Physio dir das Laufen freigegeben?',cbdocyes:'Ja, ich habe die Freigabe',cbdocno:'Nein, ich beobachte es selbst',
    qcbrec:'Wie erholt fühlst du dich gerade?',cbrec:['Vollständig erholt (100 %)','Noch leichtes Unbehagen (75 %)','Noch deutlich spürbar (50 %)'],
    qcblast:'Wann hast du zuletzt regelmäßig trainiert?',cblast:['Vor weniger als einem Monat','Vor 1–3 Monaten','Vor 3–6 Monaten','Vor über einem Jahr'],
    qcbtrtype:'Wie sah dein Training vor der Pause aus?',qcb_dynamic_tr:'Welche Art von Training hast du vor der Verletzung gemacht?',
    qcb_wrc1:'Wie hast du deine Intervalle aufgebaut?',
    qcb_wrc2:'Wie viele Zyklen hast du meistens gemacht?',
    qcb_rpe:'Wie hart waren diese Einheiten?',
    qcb_epace:'Was war damals deine ruhige Pace?',
    qcb_ekm:'Wie lang war dein typischer Lauf?',
    qcb_mixweek:'Wie sah deine typische Woche aus?',
    qcb_mixvol:'Wie waren dein Wochenumfang und deine Pace?',
    qadvvol:'Wie viele km läufst du pro Woche?',qadvpace:'Wie schnell läufst du an ruhigen Tagen?',
    qedist:'Was ist deine Zieldistanz?',
    dist5k:'5 km',dist10k:'10 km',disthalf:'Halbmarathon',distmarathon:'Marathon',distultra:'Ultra 50 km',distother:'Andere',
    qlongest:'Was ist die längste Strecke, die du zuletzt gelaufen bist?',qrace:'Hast du einen Wettkampf geplant?',
    raceyes:'Ja, ich kenne mein Wettkampfdatum',raceno:'Noch nicht — ich setze mir selbst einen Termin',
    qracedate:'Wann ist der Wettkampf?',qgoaldate:'Wann willst du dein Ziel erreichen?',
    qgoaldatehint:'Wähle einen realistischen Termin — du kannst ihn jederzeit in den Einstellungen ändern.',
    seldate:'Gewähltes Datum',
    qwrc1:'Wie baust du deine Intervalle auf?',walk_time:'Gehzeit',run_time:'Laufzeit',
    qwrc2:'Wie oft wiederholst du den Zyklus?',qwrc2_sub:'Dein Zyklus: {run} Min laufen / {walk} Min gehen',
    cycle_count:'Zyklen',sessions_per_week:'Aktuelle Einheiten pro Woche',qwr_rpe:'Wie müde bist du nach einer typischen Einheit?',
    qtdist:'Auf welcher Distanz willst du schneller werden?',
    qcurpb:'Was ist deine Bestzeit auf dieser Distanz?',qtarget:'Welche Zeit willst du unterbieten?',
    hrs:'Std.',min:'Min',sec:'Sek',
    errtarget:'Dein Ziel muss schneller sein als deine aktuelle Bestzeit',
    male:'Mann',female:'Frau',gender_other:'Divers',
    sport_none_lbl:'Keine',sport_football_lbl:'Fußball',sport_gym_lbl:'Fitnessstudio',sport_swim_lbl:'Schwimmen',sport_cycle_lbl:'Radfahren',sport_tennis_lbl:'Tennis',sport_other_lbl:'Andere (eintragen)',whichsport:'Welche Sportart?',
    daysweek:'Tage/Woche',selectdays:'Wähle deine Trainingstage',perfectdist:'Tage gewählt',
    select:'Wähle',remove:'Entferne',day:'Tag',days:'Tage',
  }
};
function forceLight(){
  document.documentElement.style.colorScheme='light';
  document.documentElement.setAttribute('data-forced-color-adjust','none');
  if(document.querySelector('meta[name="color-scheme"]'))return;
  const m=document.createElement('meta');m.name='color-scheme';m.content='light only';
  document.head.appendChild(m);
}

// ── UI HELPERS ──────────────────────────────────────────────
function card(ico,title,sub,selected,onclick){
  return`<div class="cc ${selected?'s':''}" onclick="${onclick}">
    <div class="ci">${ico}</div>
    <div class="cv"><div class="ct">${e(title)}</div>${sub?`<div class="cs">${e(sub)}</div>`:''}</div>
    <svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  </div>`;
}

function evalNode(v, data){
  if(typeof v === 'function') return v(data);
  if(Array.isArray(v)) return v.map(x => evalNode(x, data));
  return v;
}
function c(k){const d=C[S.data.language]||C.en;let v=d[k]!==undefined?d[k]:(C.en[k]||'');return evalNode(v, S.data);}
function cg(id){const gs=(C[S.data.language]||C.en).goals;return gs[id]||C.en.goals[id]||{};}

// ─── STEPS ───────────────────────────────────────────────────
const STEPS=[
  {id:'welcome',back:false,cta:true},
  {id:'lang',back:false,cta:false},
  {id:'body_units',back:true,cta:true},
  {id:'profile_gender',back:true,cta:false},
  {id:'profile_dob',back:true,cta:true},
  {id:'level',back:true,cta:false},
  {id:'goal',back:true,cta:true},
  {id:'diag_15min',back:true,cta:false,skip:d=>d.level!=='beginner'||d.goalId!=='start'},
  {id:'diag_stairs',back:true,cta:false,skip:d=>d.level!=='beginner'||d.goalId!=='start'},
  {id:'training_history',back:true,cta:true,skip:d=>d.level!=='beginner'||d.goalId==='walkrun'||d.goalId==='health'||d.goalId==='comeback'},
  {id:'health_train_type',back:true,cta:false,skip:d=>d.goalId!=='health'},
  // walkrun path (mirror walkrun goal flow)
  {id:'h_wr_config',  back:true,cta:true, skip:d=>d.goalId!=='health'||d.health_train_type!=='walkrun'},
  {id:'h_wr_rpe',     back:true,cta:false,skip:d=>d.goalId!=='health'||d.health_train_type!=='walkrun'},
  // easy path
  {id:'health_easy_pace',back:true,cta:true,skip:d=>d.goalId!=='health'||d.health_train_type!=='easy'},
  {id:'health_easy_session',back:true,cta:true,skip:d=>d.goalId!=='health'||d.health_train_type!=='easy'},
  {id:'health_easy_rpe',back:true,cta:false,skip:d=>d.goalId!=='health'||d.health_train_type!=='easy'},
  // mixed path
  {id:'health_mixed_week',back:true,cta:true,skip:d=>d.goalId!=='health'||d.health_train_type!=='mixed'},
  {id:'health_mixed_volume',back:true,cta:true,skip:d=>d.goalId!=='health'||d.health_train_type!=='mixed'},
  {id:'comeback_reason',back:true,cta:false,skip:d=>d.goalId!=='comeback'},
  {id:'comeback_injury_details',back:true,cta:true,skip:d=>d.goalId!=='comeback'||d.comeback_reason!=='injury'},
  {id:'comeback_severity',back:true,cta:false,skip:d=>d.goalId!=='comeback'||d.comeback_reason!=='injury'},
  {id:'comeback_doctor',back:true,cta:false,skip:d=>d.goalId!=='comeback'||d.comeback_reason!=='injury'},
  {id:'comeback_recovery',back:true,cta:false,skip:d=>d.goalId!=='comeback'||d.comeback_reason!=='injury'},
  {id:'comeback_last_train',back:true,cta:false,skip:d=>d.goalId!=='comeback'},
  {id:'comeback_train_type',back:true,cta:false,skip:d=>d.goalId!=='comeback'},
  {id:'cb_wr_config',  back:true,cta:true, skip:d=>d.goalId!=='comeback'||d.comeback_train_type!=='walkrun'},
  {id:'cb_wr_rpe',     back:true,cta:false,skip:d=>d.goalId!=='comeback'||d.comeback_train_type!=='walkrun'},
  {id:'comeback_easy_pace',back:true,cta:true,skip:d=>d.goalId!=='comeback'||d.comeback_train_type!=='easy'},
  {id:'comeback_easy_session',back:true,cta:true,skip:d=>d.goalId!=='comeback'||d.comeback_train_type!=='easy'},
  {id:'comeback_easy_rpe',back:true,cta:false,skip:d=>d.goalId!=='comeback'||d.comeback_train_type!=='easy'},
  {id:'comeback_mixed_week',back:true,cta:true,skip:d=>d.goalId!=='comeback'||d.comeback_train_type!=='mixed'},
  {id:'comeback_mixed_volume',back:true,cta:true,skip:d=>d.goalId!=='comeback'||d.comeback_train_type!=='mixed'},
  {id:'time_dist',back:true,cta:d=>d.time_distance==='other',skip:d=>d.goalId!=='time'},
  {id:'time_pb',back:true,cta:true,skip:d=>d.goalId!=='time'||!d.time_distance},
  {id:'time_target',back:true,cta:true,skip:d=>d.goalId!=='time'||!d.time_distance},
  {id:'time_race',back:true,cta:false,skip:d=>d.goalId!=='time'||!d.time_distance},
  {id:'time_race_date',back:true,cta:true,skip:d=>d.goalId!=='time'||!d.time_distance||d.time_has_race==null},
  {id:'time_mixed_week',back:true,cta:true,skip:d=>d.goalId!=='time'},
  {id:'time_mixed_volume',back:true,cta:true,skip:d=>d.goalId!=='time'},
  {id:'distance_dist',back:true,cta:d=>d.distance_distance==='other',skip:d=>d.goalId!=='distance'},
  {id:'distance_pb',back:true,cta:true,skip:d=>d.goalId!=='distance'||!d.distance_distance},
  {id:'distance_race',back:true,cta:false,skip:d=>d.goalId!=='distance'||!d.distance_distance},
  {id:'distance_race_date',back:true,cta:true,skip:d=>d.goalId!=='distance'||!d.distance_distance||d.distance_has_race==null},
  {id:'distance_mixed_week',back:true,cta:true,skip:d=>d.goalId!=='distance'},
  {id:'distance_mixed_volume',back:true,cta:true,skip:d=>d.goalId!=='distance'},
  {id:'walkrun_config',  back:true,cta:true, skip:d=>d.goalId!=='walkrun'},
  {id:'walkrun_rpe',     back:true,cta:false,skip:d=>d.goalId!=='walkrun'},
  {id:'availability',back:true,cta:true},
  {id:'ready',back:true,cta:true},
];
function visSteps(){return STEPS.filter(s=>!s.skip||!s.skip(S.data));}

// ─── NAV ──────────────────────────────────────────────────────
function next(){
  const vs=visSteps();
  const ci=vs.findIndex(s=>s.id===STEPS[S.step].id);
  if(ci<vs.length-1){
    const screen=document.querySelector('.screen');
    if(screen){
      screen.classList.add('leaving');
      setTimeout(()=>{
        S.history.push(S.step);
        S.step=STEPS.indexOf(vs[ci+1]);
        render(true);
      },160);
    } else {
      S.history.push(S.step);
      S.step=STEPS.indexOf(vs[ci+1]);
      render(true);
    }
  } else {done();}
}
function back(){
  if(S.history.length){
    const screen=document.querySelector('.screen');
    if(screen){
      screen.style.animation='sOut .16s cubic-bezier(.4,0,1,1) both';
      screen.style.pointerEvents='none';
      setTimeout(()=>{ S.step=S.history.pop(); render(true); },140);
    } else {
      S.step=S.history.pop(); render(true);
    }
  }
}
function patch(o){Object.assign(S.data,o);render(false);}
function set(k,v){S.data[k]=v;render(false);}

// ═══ FINAŁ ONBOARDINGU: koperta → narada sztabu → plan gotowy ═══════
// velmFinale.start() — overlay + koperta + narada (podczas realnego
// POST /api/onboarding); velmFinale.success() — domyka i czeka na klik
// "Zobacz plan"; velmFinale.fail() — chowa overlay (błąd → alert).
const velmFinale = (() => {
  const AGENTS = [
    { key:'analityk', initial:'A' },
    { key:'fizjo', initial:'F' },
    { key:'psycholog', initial:'P' },
    { key:'szef', initial:'T' }
  ];
  const COLORS = { analityk:'#5B8DB8', fizjo:'#6B8F71', psycholog:'#C9924E', szef:'#111111' };
  // Wariant "pierwszy plan": zero odwołań do historii treningów —
  // tylko procesy na danych z onboardingu (uniwersalnie prawdziwe).
  // `short` jest celowo 2-literowe (kolumna .nrd-dl jest wąska) — nie brać z c('wdays').
  const FIN = {
    pl:{
      days:['Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela'],
      short:['Pn','Wt','Śr','Cz','Pt','So','Nd'],
      agents:{analityk:'Analityk',fizjo:'Fizjo',psycholog:'Psycholog',szef:'Szef'},
      legend:{analityk:'Analityk',fizjo:'Fizjo',psycholog:'Psycholog',szef:'Szef'},
      headCoach:'Szef Sztabu',
      to:'Do',staffName:'Sztab velm',packing:'Pakowanie Twoich danych',kicker:'Narada sztabu',head:'Powstaje Twój pierwszy plan',
      dayReady:'Plan gotowy',doneH:'Twój pierwszy plan gotowy!',
      doneP:'Sztab przygotował tydzień skrojony pod Ciebie. Czas zacząć.',goBtn:'Zobacz plan',
      finalTouches:'Ostatnie szlify',assembling:'Składanie planu w całość — trwa…',
      sealing:'Zamykanie koperty',addressing:'Adresowanie',sending:'Przesyłanie do sztabu',delivered:'Dostarczono ✓',
      approved:'Plan zatwierdzony',weekReady:'Twój pierwszy tydzień — gotowy',
      pools:{
        analityk:['Profil biegacza — utworzony','Tętno maksymalne — oszacowane z wieku','Strefy tętna — wyznaczone','Punkt startowy — ustalony','Kilometraż na start — obliczony','Tempo wyjściowe — oszacowane','Droga do celu — rozpisana','Rezerwy na progres — zaplanowane'],
        fizjo:['Bezpieczny próg obciążenia — ustawiony','Ochrona przed kontuzją — włączona','Progresja — ograniczona na start','Dni regeneracji — zarezerwowane','Rozgrzewki — dobrane do poziomu'],
        psycholog:['Twój cel — przyjęty przez sztab','Pierwszy tydzień — bez presji','Nawyk — zaplanowany małymi krokami','Motywacja startowa — zbudowana'],
        szef:['Typ treningu — wybrany','Intensywność — dobrana do poziomu','Rozkład — dopasowany do Twoich dni','Tempo — ustawione bezpiecznie','Miejsce w tygodniu — potwierdzone']
      }
    },
    en:{
      days:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      short:['Mo','Tu','We','Th','Fr','Sa','Su'],
      agents:{analityk:'Analyst',fizjo:'Physio',psycholog:'Psychologist',szef:'Head Coach'},
      legend:{analityk:'Analyst',fizjo:'Physio',psycholog:'Psych',szef:'Coach'},
      headCoach:'Head Coach',
      to:'To',staffName:'velm staff',packing:'Packing your data',kicker:'Staff meeting',head:'Building your first plan',
      dayReady:'Day ready',doneH:'Your first plan is ready!',
      doneP:'The staff built a week tailored to you. Time to start.',goBtn:'See my plan',
      finalTouches:'Final touches',assembling:'Assembling the plan — in progress…',
      sealing:'Sealing the envelope',addressing:'Addressing',sending:'Sending to the staff',delivered:'Delivered ✓',
      approved:'Plan approved',weekReady:'Your first week — ready',
      pools:{
        analityk:['Runner profile — created','Max heart rate — estimated from age','HR zones — calculated','Starting point — set','Starting mileage — computed','Base pace — estimated','Path to your goal — mapped','Progress reserves — planned'],
        fizjo:['Safe load threshold — set','Injury protection — enabled','Progression — capped for the start','Recovery days — reserved','Warm-ups — matched to level'],
        psycholog:['Your goal — accepted by the staff','First week — pressure-free','Habit — built in small steps','Starting motivation — set up'],
        szef:['Workout type — chosen','Intensity — matched to level','Layout — fitted to your days','Pace — set safely','Weekly slot — confirmed']
      }
    },
    fr:{
      days:['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'],
      short:['Lu','Ma','Me','Je','Ve','Sa','Di'],
      agents:{analityk:'Analyste',fizjo:'Kiné',psycholog:'Psychologue',szef:'Chef coach'},
      legend:{analityk:'Analyste',fizjo:'Kiné',psycholog:'Psycho',szef:'Coach'},
      headCoach:'Entraîneur principal',
      to:'À',staffName:'Staff velm',packing:'Préparation de tes données',kicker:'Réunion du staff',head:'Ton premier plan se construit',
      dayReady:'Jour prêt',doneH:'Ton premier plan est prêt !',
      doneP:"Le staff a bâti une semaine taillée pour toi. C'est parti.",goBtn:'Voir mon plan',
      finalTouches:'Dernières retouches',assembling:'Assemblage du plan — en cours…',
      sealing:"Fermeture de l'enveloppe",addressing:'Adressage',sending:'Envoi au staff',delivered:'Livré ✓',
      approved:'Plan validé',weekReady:'Ta première semaine — prête',
      pools:{
        analityk:["Profil du coureur — créé","Fréquence cardiaque max — estimée selon l'âge",'Zones de FC — calculées','Point de départ — défini','Volume de départ — calculé','Allure de base — estimée',"Chemin vers ton objectif — tracé",'Marges de progression — planifiées'],
        fizjo:['Seuil de charge sûr — défini','Protection contre les blessures — activée','Progression — plafonnée au départ','Jours de récupération — réservés','Échauffements — adaptés au niveau'],
        psycholog:['Ton objectif — validé par le staff','Première semaine — sans pression','Habitude — construite pas à pas','Motivation de départ — installée'],
        szef:['Type de séance — choisi','Intensité — adaptée au niveau','Répartition — calée sur tes jours','Allure — réglée en sécurité','Place dans la semaine — confirmée']
      }
    },
    es:{
      days:['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],
      short:['Lu','Ma','Mi','Ju','Vi','Sá','Do'],
      agents:{analityk:'Analista',fizjo:'Fisio',psycholog:'Psicólogo',szef:'Entrenador jefe'},
      legend:{analityk:'Analista',fizjo:'Fisio',psycholog:'Psico',szef:'Jefe'},
      headCoach:'Entrenador jefe',
      to:'Para',staffName:'Equipo velm',packing:'Empaquetando tus datos',kicker:'Reunión del equipo',head:'Se está creando tu primer plan',
      dayReady:'Día listo',doneH:'¡Tu primer plan está listo!',
      doneP:'El equipo ha creado una semana hecha a tu medida. Es hora de empezar.',goBtn:'Ver mi plan',
      finalTouches:'Últimos retoques',assembling:'Montando el plan — en curso…',
      sealing:'Cerrando el sobre',addressing:'Poniendo la dirección',sending:'Enviando al equipo',delivered:'Entregado ✓',
      approved:'Plan aprobado',weekReady:'Tu primera semana — lista',
      pools:{
        analityk:['Perfil del corredor — creado','Frecuencia cardíaca máxima — estimada por edad','Zonas de FC — calculadas','Punto de partida — fijado','Volumen inicial — calculado','Ritmo base — estimado','Camino hacia tu objetivo — trazado','Margen de progresión — planificado'],
        fizjo:['Umbral de carga seguro — fijado','Protección frente a lesiones — activada','Progresión — limitada al inicio','Días de recuperación — reservados','Calentamientos — ajustados al nivel'],
        psycholog:['Tu objetivo — aceptado por el equipo','Primera semana — sin presión','Hábito — construido paso a paso','Motivación inicial — preparada'],
        szef:['Tipo de sesión — elegido','Intensidad — ajustada al nivel','Reparto — encajado en tus días','Ritmo — fijado con seguridad','Hueco semanal — confirmado']
      }
    },
    de:{
      days:['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'],
      short:['Mo','Di','Mi','Do','Fr','Sa','So'],
      agents:{analityk:'Analyst',fizjo:'Physio',psycholog:'Psychologe',szef:'Cheftrainer'},
      legend:{analityk:'Analyst',fizjo:'Physio',psycholog:'Psycho',szef:'Chef'},
      headCoach:'Cheftrainer',
      to:'An',staffName:'velm Stab',packing:'Deine Daten werden gepackt',kicker:'Stabsbesprechung',head:'Dein erster Plan entsteht',
      dayReady:'Tag fertig',doneH:'Dein erster Plan ist fertig!',
      doneP:"Der Stab hat eine Woche gebaut, die auf dich zugeschnitten ist. Los geht's.",goBtn:'Plan ansehen',
      finalTouches:'Letzter Schliff',assembling:'Plan wird zusammengesetzt — läuft…',
      sealing:'Umschlag wird verschlossen',addressing:'Adressierung',sending:'Wird an den Stab geschickt',delivered:'Zugestellt ✓',
      approved:'Plan freigegeben',weekReady:'Deine erste Woche — fertig',
      pools:{
        analityk:['Läuferprofil — erstellt','Maximale Herzfrequenz — aus dem Alter geschätzt','HF-Zonen — berechnet','Ausgangspunkt — festgelegt','Startumfang — berechnet','Grundpace — geschätzt','Weg zum Ziel — abgesteckt','Reserven für den Fortschritt — eingeplant'],
        fizjo:['Sichere Belastungsgrenze — gesetzt','Verletzungsschutz — aktiviert','Steigerung — zum Start begrenzt','Regenerationstage — reserviert','Aufwärmen — an das Niveau angepasst'],
        psycholog:['Dein Ziel — vom Stab übernommen','Erste Woche — ohne Druck','Gewohnheit — in kleinen Schritten geplant','Startmotivation — aufgebaut'],
        szef:['Trainingsart — gewählt','Intensität — an das Niveau angepasst','Verteilung — auf deine Tage abgestimmt','Pace — sicher eingestellt','Platz in der Woche — bestätigt']
      }
    }
  };
  const TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  // — dźwięk —
  let actx = null, sndOn = true;
  function ac(){ if(!actx) actx = new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==='suspended') actx.resume(); return actx; }
  function blip(f,d,g,t){ if(!sndOn) return; try{ const c=ac(); const o=c.createOscillator(); const gn=c.createGain(); o.type=t||'sine'; o.frequency.value=f; gn.gain.setValueAtTime(g,c.currentTime); gn.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+d); o.connect(gn); gn.connect(c.destination); o.start(); o.stop(c.currentTime+d);}catch(e){} }
  function sweep(f1,f2,d,g){ if(!sndOn) return; try{ const c=ac(); const o=c.createOscillator(); const gn=c.createGain(); o.frequency.setValueAtTime(f1,c.currentTime); o.frequency.exponentialRampToValueAtTime(f2,c.currentTime+d); gn.gain.setValueAtTime(g,c.currentTime); gn.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+d); o.connect(gn); gn.connect(c.destination); o.start(); o.stop(c.currentTime+d);}catch(e){} }
  function paperFold(){ if(!sndOn) return; try{ const c=ac(); const dur=0.28; const buf=c.createBuffer(1,Math.floor(c.sampleRate*dur),c.sampleRate); const dd=buf.getChannelData(0); for(let i=0;i<dd.length;i++) dd[i]=(Math.random()*2-1)*Math.pow(1-i/dd.length,1.6); const src=c.createBufferSource(); src.buffer=buf; const f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=1300; const g=c.createGain(); g.gain.value=0.14; src.connect(f); f.connect(g); g.connect(c.destination); src.start(); }catch(e){} }
  const snd = {
    tick(){blip(1250,0.05,0.04);}, seg(){blip(510,0.1,0.06,'triangle');setTimeout(()=>blip(640,0.1,0.05,'triangle'),75);},
    day(){blip(523,0.13,0.06,'triangle');setTimeout(()=>blip(784,0.18,0.06,'triangle'),115);},
    thunk(){blip(150,0.16,0.1,'sine');setTimeout(()=>blip(95,0.1,0.06,'sine'),30);},
    whoosh(){sweep(240,1400,0.55,0.05);}, pack(){blip(880,0.06,0.035);}, fold(){paperFold();},
    finish(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>blip(f,0.24,0.07,'triangle'),i*125));}
  };

  let ov = null, timers = [], pctTimer = null, running = false, dayIdx = 0, startedAt = 0, speed = 1;
  let FT = FIN.en, POOLS = FIN.en.pools, DAYS = FIN.en.days, SHORT = FIN.en.short;
  const later = (fn,ms)=>timers.push(setTimeout(fn,ms));
  const clearAll = ()=>{timers.forEach(clearTimeout);timers=[];clearInterval(pctTimer);};
  const q = (s)=>ov.querySelector(s);
  const qa = (s)=>ov.querySelectorAll(s);
  const pickN = (a,n)=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).slice(0,n).map(p=>p[1]);

  function buildOverlay(){
    document.getElementById('finale')?.remove();
    ov = document.createElement('div');
    ov.id = 'finale';
    ov.setAttribute('role','dialog');
    ov.setAttribute('aria-modal','true');
    ov.innerHTML =
      '<div id="fin-env-act">' +
        '<div id="env-scene"><div class="dshadow"></div><div id="env">' +
          '<div id="flap"></div><div class="env-back"></div>' +
          '<div id="letter"><div class="lh">velm</div></div>' +
          '<div class="env-front"></div><div id="seal-ring"></div><div id="seal">v</div>' +
          '<div id="stamp"><i style="background:#5B8DB8"></i><i style="background:#6B8F71"></i><i style="background:#C9924E"></i><i style="background:#111111"></i></div>' +
          '<div id="addr"><div class="a1">' + FT.to + '</div><div class="a2">' + FT.staffName + '</div></div>' +
        '</div></div>' +
        '<div id="send-label"><span class="t"><span class="txt">' + FT.packing + '</span><span class="dots"></span></span></div>' +
      '</div>' +
      '<div id="fin-narada"><div class="nrd-wrap">' +
        '<div class="nrd-head"><div class="nrd-kicker">' + FT.kicker + '</div><h1>' + FT.head + '</h1></div>' +
        '<div class="nrd-staff">' + AGENTS.map(a=>'<div class="nrd-chip" data-agent="'+a.key+'"><div class="nrd-ava">'+a.initial+'<div class="nrd-badge">'+TICK+'</div></div><div class="nrd-nm">'+FT.agents[a.key]+'</div></div>').join('') + '</div>' +
        '<div class="nrd-bench" aria-live="polite"><div class="nrd-bench-head"><span class="nrd-bench-day"></span><span class="nrd-bench-agent"></span></div><div class="nrd-tasks"></div></div>' +
        '<div class="nrd-week">' + SHORT.map((s,d)=>'<div class="nrd-day-row" data-day="'+d+'"><div class="nrd-dl">'+s+'</div><div class="nrd-fields"><span class="nrd-f"><b>A</b></span><span class="nrd-f"><b>F</b></span><span class="nrd-f"><b>P</b></span><span class="nrd-f"><b>T</b></span></div><div class="nrd-status">'+FT.dayReady+'</div><div class="nrd-dcheck">'+TICK+'</div></div>').join('') + '</div>' +
        '<div class="nrd-legend" aria-hidden="true"><div class="nrd-dl sp"></div><div class="nrd-fields">' +
          '<span><i style="background:#5B8DB8"></i>' + FT.legend.analityk + '</span><span><i style="background:#6B8F71"></i>' + FT.legend.fizjo + '</span>' +
          '<span><i style="background:#C9924E"></i>' + FT.legend.psycholog + '</span><span><i style="background:#111111"></i>' + FT.legend.szef + '</span>' +
        '</div><div class="nrd-status sp">' + FT.dayReady + '</div><div class="nrd-dcheck sp"></div></div>' +
        '<div class="nrd-progress-row"><div class="nrd-progress"><div class="nrd-progress-fill"></div></div><span class="nrd-pct">0%</span></div>' +
      '</div></div>' +
      '<div id="fin-done"><div class="check" aria-hidden="true">' + TICK + '</div>' +
        '<h2>' + FT.doneH + '</h2>' +
        '<p>' + FT.doneP + '</p>' +
        '<button id="fin-go">' + FT.goBtn + '</button></div>';
    document.body.appendChild(ov);
    requestAnimationFrame(()=>requestAnimationFrame(()=>ov.classList.add('visible')));
  }

  // — narada —
  const dayRow = (d)=>q('.nrd-day-row[data-day="'+d+'"]');
  const chip = (k)=>q('.nrd-chip[data-agent="'+k+'"]');
  function chipWorking(k){ qa('.nrd-chip').forEach(x=>x.classList.remove('active')); if(k) chip(k).classList.add('active'); }
  function chipDone(k){ const x=chip(k); x.classList.remove('active'); x.classList.add('ok'); }
  function chipsReset(){ qa('.nrd-chip').forEach(x=>x.classList.remove('active','ok')); }
  function setScan(d,k){ qa('.nrd-day-row').forEach((r,i)=>{ r.classList.toggle('scan',i===d); if(i===d&&k) r.style.setProperty('--nrd-scan-c',COLORS[k]); }); }
  function setBench(title,agent,n){
    const head=q('.nrd-bench-head');
    q('.nrd-bench').style.setProperty('--nrd-agent-c',COLORS[agent]);
    head.classList.add('swap');
    setTimeout(()=>{
      q('.nrd-bench-day').innerHTML=title+(n?'<span class="nrd-daynum">'+n+'/7</span>':'');
      q('.nrd-bench-agent').textContent=agent==='szef'?FT.headCoach:FT.agents[agent];
      head.classList.remove('swap');
    },190);
  }
  function addTask(label){
    const r=document.createElement('div');
    r.className='nrd-task';
    r.innerHTML='<span class="nrd-tick">'+TICK+'</span><span>'+label+'</span>';
    q('.nrd-tasks').appendChild(r);
    requestAnimationFrame(()=>requestAnimationFrame(()=>r.classList.add('in')));
    return r;
  }
  const clearTasks=()=>{q('.nrd-tasks').innerHTML='';};
  function fillSeg(d,i){ const r=dayRow(d); if(!r) return; const f=r.querySelectorAll('.nrd-f')[i]; if(f&&!f.classList.contains('on')){f.classList.add('on');snd.seg();} }
  function buildRow(d){ const r=dayRow(d); if(!r) return; r.classList.remove('scan'); r.classList.add('built'); r.querySelectorAll('.nrd-f').forEach((f,i)=>{ if(!f.classList.contains('on')) setTimeout(()=>f.classList.add('on'),i*130); }); }
  function agentSeg(k,title,tasks,tickMs,cb,n){
    chipWorking(k); setBench(title,k,n); clearTasks();
    let delay=300*speed;
    tasks.forEach(label=>{
      later(()=>{ const r=addTask(label); later(()=>{r.classList.add('done');snd.tick();},(340+Math.random()*180)*speed); },delay);
      delay+=(tickMs+Math.random()*140)*speed;
    });
    later(()=>{ if(!running) return; chipDone(k); later(cb,280*speed); },delay+300*speed);
  }
  function runDay(d){
    if(!running) return;
    chipsReset();
    const title=DAYS[d], n=d+1;
    setScan(d,'analityk');
    agentSeg('analityk',title,pickN(POOLS.analityk,5),580,()=>{ if(!running)return; fillSeg(d,0); setScan(d,'fizjo');
      agentSeg('fizjo',title,pickN(POOLS.fizjo,2),640,()=>{ if(!running)return; fillSeg(d,1); setScan(d,'psycholog');
        agentSeg('psycholog',title,pickN(POOLS.psycholog,2),640,()=>{ if(!running)return; fillSeg(d,2); setScan(d,'szef');
          agentSeg('szef',title,pickN(POOLS.szef,2),640,()=>{ if(!running)return; fillSeg(d,3); buildRow(d); snd.day(); dayIdx++;
            later(()=>{ if(!running)return; dayIdx<7?runDay(dayIdx):waitState(); },620*speed);
          },n);
        },n);
      },n);
    },n);
  }
  function waitState(){
    if(!running) return;
    chipsReset(); chipWorking('szef'); setScan(null);
    setBench(FT.finalTouches,'szef');
    clearTasks();
    addTask(FT.assembling);
  }
  function startNarada(estimateMs){
    startedAt=Date.now();
    speed=Math.min(1.15,Math.max(0.34,(estimateMs*0.88)/81500));
    running=true; dayIdx=0;
    const fillEl=q('.nrd-progress-fill'), pctEl=q('.nrd-pct');
    fillEl.style.transition='none'; fillEl.style.width='0%';
    setTimeout(()=>{ fillEl.style.transition='width '+(estimateMs*0.9)+'ms linear'; fillEl.style.width='90%'; },100);
    pctTimer=setInterval(()=>{ const p=Math.min(90,Math.round((Date.now()-startedAt)/(estimateMs*0.9)*90)); if(pctEl)pctEl.textContent=p+'%'; },250);
    later(()=>runDay(0),500);
  }
  function confetti(){
    const host=q('#fin-done');
    const cols=['#5B8DB8','#6B8F71','#C9924E','#111111','#E63946'];
    for(let i=0;i<26;i++){
      const cf=document.createElement('div');
      cf.className='confetti';
      cf.style.background=cols[Math.floor(Math.random()*cols.length)];
      const ang=Math.random()*Math.PI*2, dist=90+Math.random()*130;
      cf.style.setProperty('--cx',Math.cos(ang)*dist+'px');
      cf.style.setProperty('--cy',(Math.sin(ang)*dist-60)+'px');
      cf.style.setProperty('--cr',(Math.random()*540-270)+'deg');
      host.appendChild(cf);
      requestAnimationFrame(()=>requestAnimationFrame(()=>cf.classList.add('go')));
      setTimeout(()=>cf.remove(),1100);
    }
  }

  return {
    start(){
      FT=FIN[S.data.language||'en']||FIN.en;
      POOLS=FT.pools;
      DAYS=FT.days;
      SHORT=FT.short;
      buildOverlay();
      const scene=q('#env-scene'), label=q('#send-label'), ltx=label.querySelector('.txt');
      let t=350;
      later(()=>{ label.classList.add('show'); scene.classList.add('bob'); },t);
      t+=850;
      later(()=>{ q('#letter').classList.add('in'); snd.fold(); },t);
      t+=920;
      later(()=>{ const f=q('#flap'); f.classList.add('closed'); setTimeout(()=>f.classList.add('front'),430); snd.fold(); ltx.textContent=FT.sealing; },t);
      t+=1000;
      later(()=>{ q('#seal').classList.add('on'); q('#seal-ring').classList.add('go'); snd.thunk(); },t);
      t+=450;
      later(()=>{ q('#stamp').classList.add('on'); snd.pack(); ltx.textContent=FT.addressing; },t);
      t+=400;
      later(()=>{ q('#addr').classList.add('on'); snd.tick(); },t);
      t+=750;
      later(()=>{ scene.classList.remove('bob'); scene.classList.add('lift'); ltx.textContent=FT.sending; },t);
      t+=600;
      later(()=>{
        scene.classList.add('fly'); snd.whoosh();
        for(let i=0;i<3;i++){
          const tr=document.createElement('div');
          tr.className='trail';
          tr.style.width=(26+i*14)+'px';
          tr.style.marginTop=(i*8-8)+'px';
          q('#fin-env-act').appendChild(tr);
          setTimeout(()=>tr.classList.add('go'),i*70);
          setTimeout(()=>tr.remove(),950);
        }
        setTimeout(()=>{ label.classList.add('sent'); ltx.textContent=FT.delivered; label.querySelector('.dots').style.display='none'; },400);
      },t);
      t+=950;
      later(()=>{ q('#fin-env-act').classList.add('away'); q('#fin-narada').classList.add('in'); startNarada(60000); },t);
    },
    // Sukces: domyka naradę, konfetti, resolve po kliknięciu "Zobacz plan"
    success(){
      return new Promise(resolve=>{
        const doFinish=async()=>{
          const minMs=14000, elapsed=Date.now()-startedAt;
          if(startedAt&&elapsed<minMs) await new Promise(r=>setTimeout(r,minMs-elapsed));
          running=false; clearAll();
          if(!q('#fin-narada').classList.contains('in')){ q('#fin-env-act').classList.add('away'); q('#fin-narada').classList.add('in'); }
          const fillEl=q('.nrd-progress-fill'), pctEl=q('.nrd-pct');
          if(fillEl){fillEl.style.transition='width 400ms ease';fillEl.style.width='100%';}
          if(pctEl)pctEl.textContent='100%';
          chipsReset();
          AGENTS.forEach((a,i)=>setTimeout(()=>chip(a.key)?.classList.add('ok'),i*120));
          setScan(null);
          setBench(FT.approved,'szef');
          clearTasks();
          const r=addTask(FT.weekReady);
          setTimeout(()=>r.classList.add('done'),500);
          for(let d=0;d<7;d++){ const row=dayRow(d); if(row&&!row.classList.contains('built')) setTimeout(()=>buildRow(d),250+d*140); }
          snd.finish();
          setTimeout(()=>{ q('#fin-done').classList.add('show'); confetti(); },2400);
          q('#fin-go').addEventListener('click',resolve,{once:true});
        };
        doFinish();
      });
    },
    fail(){
      running=false; clearAll();
      if(ov){ ov.classList.remove('visible'); setTimeout(()=>ov.remove(),360); }
    }
  };
})();

async function done() {
  const _submitOnboarding = async (password) => {
    const btn = document.getElementById('ctab');
    if (btn) { btn.disabled = true; }
    if (!S.data.email)    S.data.email    = 'user_' + Date.now() + '@velm.app';
    if (password)         S.data.password = password;

    // Compute actual age from DOB (was hardcoded 25 in initial state)
    if (S.data.dob_y && S.data.dob_m && S.data.dob_d) {
      const today = new Date();
      const birth = new Date(S.data.dob_y, (S.data.dob_m - 1), S.data.dob_d);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      if (age >= 8 && age <= 120) S.data.age = age;
    }

    // Finał: koperta + narada grają RÓWNOLEGLE z prawdziwym generowaniem
    velmFinale.start();

    // Timeout 150s — narada (Sonnet) potrafi trwać do ~90s + zapas
    const ac = new AbortController();
    const timeoutId = setTimeout(() => ac.abort(), 150000);
    try {
      const response = await fetch(`${API_BASE}/api/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(S.data),
        signal: ac.signal
      });
      clearTimeout(timeoutId);
      let data;
      try { data = await response.json(); } catch (e) { data = {}; }

      if (response.ok && data.success && data.userId) {
        localStorage.setItem('velm_user_id', data.userId);
        if (data.accessToken || data.token) localStorage.setItem('velm_token', data.accessToken || data.token);
        if (data.refreshToken) localStorage.setItem('velm_refresh_token', data.refreshToken);
        try{localStorage.removeItem('velm_theme');}catch(x){}
        // Narada z onboardingu = obejrzana — dashboard nie pokaże jej drugi raz
        const weekKey = data.plan?.tydzien_od || data.plan?.dni?.[0]?.data;
        if (weekKey) localStorage.setItem('velm_narada_seen_week', weekKey);
        await velmFinale.success();   // domyka naradę, konfetti, czeka na "Zobacz plan"
        window.location.href = 'dashboard.html';
      } else if (response.status === 409) {
        velmFinale.fail();
        if (btn) { btn.disabled = false; btn.textContent = c('qgenerate'); }
        alert(data.error || _authT().errDup);
      } else {
        // Server responded with an error — surface its real message instead of a generic one
        const serverErr = new Error(data.error || _authT().errServerCode.replace('{code}', response.status));
        serverErr.isServerError = true;
        throw serverErr;
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Onboarding error:', err);
      velmFinale.fail();
      if (btn) { btn.disabled = false; btn.textContent = c('qgenerate'); }
      const at = _authT();
      let msg;
      if (err.name === 'AbortError') {
        msg = at.errTimeout;
      } else if (err.isServerError) {
        msg = err.message;
      } else {
        msg = at.errOffline.replace('{err}', err.message || at.errUnknown);
      }
      alert(msg);
    }
  };

  // If email+password collected at registration step → submit directly
  if (S.data.email && S.data.password) {
    await _submitOnboarding(null);
  } else {
    showPasswordSetup(async (password) => { await _submitOnboarding(password); });
  }
}

// ─── RENDER ───────────────────────────────────────────────────
function render(scrollTop=false){
  spinStop();
  window._spinCBs = {};
  _spinId = 0;
  const step=STEPS[S.step];
  const vs=visSteps();
  const ci=vs.findIndex(s=>s.id===step.id);
  const total=vs.length;
  const pct=Math.round((ci/(total-1))*100);

  document.getElementById('pf').style.width=pct+'%';
  document.getElementById('bk').classList.toggle('h',!step.back);
  const sp=document.getElementById('spill');
  sp.style.opacity=S.step===0?'0':'1';
  sp.textContent=`${ci} ${c('of')} ${total-1}`;
  const isCta = typeof step.cta==='function'?step.cta(S.data):step.cta;
  ctaf.style.display=isCta?'block':'none';
  const ctab=document.getElementById('ctab');
  if(ctab){ctab.textContent=step.id==='ready'?c('qgenerate'):c('cont');ctab.disabled=cant(step.id);}

  // Save scroll position before re-render
  const appEl=document.getElementById('app');
  const prevScroll=scrollTop?0:appEl.scrollTop;

  appEl.innerHTML=`<div class="screen">${bld(step.id)}</div>`;

  if(scrollTop){
    appEl.scrollTop=0;
  } else if(prevScroll>0){
    // Double rAF: first rAF = after DOM update, second = after layout/paint
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      appEl.scrollTop=prevScroll;
    }));
  }

  if(step.id==='goal'){const tr=document.querySelector('.gtrack');if(tr)tr.addEventListener('scroll',()=>updDots(tr),{passive:true});}
  if(step.id==='welcome')startCounter();
  requestAnimationFrame(()=>requestAnimationFrame(()=>initPickers()));
}

function cant(id){
  if(id==='goal')return !S.data.goalId;
  if(id==='training_history')return S.data.sport_history.length===0||(S.data.sport_history.includes('other')&&!S.data.sport_other.trim());
  if(id==='body_units')return !S.data.weight||!S.data.height;
  if(id==='availability')return S.data.selectedDays.length!==S.data.daysPerWeek;
  if(id==='comeback_injury_details')return !S.data.comeback_injury_area?.trim()||!S.data.comeback_injury_type?.trim();
  if(id==='time_target'){
    const t=(S.data.time_target_hours||0)*3600+(S.data.time_target_mins||0)*60+(S.data.time_target_secs||0);
    if (S.data.time_pb_none) return !t;
    const cur=(S.data.time_pb_hours||0)*3600+(S.data.time_pb_mins||0)*60+(S.data.time_pb_secs||0);
    return !t||!cur||t>cur;
  }
  if(id==='distance_target'){
    const t=(S.data.distance_target_km||0)*1000+(S.data.distance_target_m||0);
    if (S.data.distance_pb_none) return !t;
    const cur=(S.data.distance_pb_km||0)*1000+(S.data.distance_pb_m||0);
    return !t||!cur||t<cur;
  }
  if(id==='health_mixed_week'||id==='comeback_mixed_week'||id==='time_mixed_week'||id==='distance_mixed_week'){
    const pl=id==='health_mixed_week'?S.data.health_week_plan:id==='time_mixed_week'?S.data.time_week_plan:id==='distance_mixed_week'?S.data.distance_week_plan:S.data.comeback_week_plan;
    if (!pl) return true;
    const filled=Object.values(pl).filter(v=>v&&v!=='rest').length;
    return filled!==S.data.daysPerWeek;
  }
  return false;
}
function updDots(tr){const i=Math.round(tr.scrollLeft/(tr.clientWidth*.78+12));document.querySelectorAll('.gd').forEach((d,n)=>d.classList.toggle('on',n===i));}

// ─── SCREEN BUILDERS ─────────────────────────────────────────
function bld(id){
  switch(id){
    case 'welcome':        return bWelcome();
    case 'lang':           return bLang();
    case 'body_units':     return bBodyUnits();
    case 'profile_gender': return bProfileGender();
    case 'profile_dob':    return bDob();
    case 'level':          return bLevel();
    case 'goal':           return bGoal();
    case 'diag_15min':     return bYesNo(c('q15'),c('yes15'),c('no15'),'run_15min','diag_15min');
    case 'diag_stairs':    return bYesNo(c('qstairs'),c('qyes'),c('qno'),'stairs','diag_stairs');
    case 'training_history':return bSports();
    case 'health_train_type':return bHealthTrainType();
    case 'h_wr_config':      return bWalkrunConfig(false);
    case 'h_wr_rpe':         return bRpe('health_rpe');
    case 'health_easy_session':return bEasySession();
    case 'health_easy_pace':return bEasyPace('health_easy_pace_min','health_easy_pace_sec');
    case 'health_easy_km': return bEasyKm();
    case 'health_easy_rpe':return bRpe('health_rpe');
    case 'health_mixed_week':return bMixedWeek('health_week_plan');
    case 'health_mixed_volume':return bMixedVolume();
    case 'comeback_reason':return bComebackReason();
    case 'comeback_injury_details':return bInjuryDetails();
    case 'comeback_severity':return bSeverity();
    case 'comeback_doctor':return bYesNo(c('qcbdoc'),c('cbdocyes'),c('cbdocno'),'comeback_doctor','comeback_doctor');
    case 'comeback_recovery':return bComebackRec();
    case 'comeback_last_train':return bLastTrain();
    case 'comeback_train_type':return bHealthTrainType(true);
    case 'cb_wr_config':       return bWalkrunConfig(true);
    case 'cb_wr_rpe':          return bWalkrunRpe(true);
    case 'comeback_easy_pace':return bEasyPace('health_easy_pace_min','health_easy_pace_sec',true);
    case 'comeback_easy_session':return bEasySession(true);
    case 'comeback_easy_rpe':return bRpe('health_rpe', true);
    case 'comeback_mixed_week':return bMixedWeek('comeback_week_plan', true);
    case 'comeback_mixed_volume':return bMixedVolume(true);
    case 'time_dist':      return bTimeDist();
    case 'time_pb':        return bTimePb();
    case 'time_target':    return bTimeTarget();
    case 'time_race':      return bTimeRace();
    case 'time_race_date': return bCalendar('time_race_target','tr_m','tr_y',S.data.time_has_race?c('qracedate'):c('qgoaldate'),S.data.time_has_race?null:c('qgoaldatehint'));
    case 'time_mixed_week':return bMixedWeek('time_week_plan');
    case 'time_mixed_volume':return bMixedVolume(false, 'time');
    case 'distance_dist':      return bDistanceDist();
    case 'distance_pb':        return bDistancePb();
    case 'distance_race':      return bDistanceRace();
    case 'distance_race_date': return bCalendar('distance_race_target','dr_m','dr_y',S.data.distance_has_race?c('qracedate'):c('qgoaldate'),S.data.distance_has_race?null:c('qgoaldatehint'));
    case 'distance_mixed_week':return bMixedWeek('distance_week_plan');
    case 'distance_mixed_volume':return bMixedVolume(false, 'distance');
    case 'endurance_target':return bEnduranceTarget();
    case 'dist_longest_run':return bLongestRun();
    case 'dist_race':      return bDistRace();
    case 'dist_race_date': return bCalendar('dist_goal_date','dist_cal_month','dist_cal_year',S.data.dist_has_race?c('qracedate'):c('qgoaldate'),S.data.dist_has_race?null:c('qgoaldatehint'));

    case 'walkrun_config':    return bWalkrunConfig();
    case 'walkrun_rpe':       return bWalkrunRpe();
    case 'availability':   return bAvailability();
    case 'ready':          return bReady();
    default: return `<p>Step: ${id}</p>`;
  }
}

// ── WELCOME ──
function bWelcome(){
  return`<div class="htag"><span class="hdot"></span>${e(c('wtag'))}</div>
<h1 class="hl">${e(c('wh')).replace('\n','<br>')}</h1>
<p class="sh">${e(c('ws'))}</p>
${buildChart()}
<div class="flist">
  <div class="frow"><div class="fdot"></div><div class="ftxt">${c('wf1')}</div></div>
  <div class="frow"><div class="fdot"></div><div class="ftxt">${c('wf2')}</div></div>
  <div class="frow"><div class="fdot"></div><div class="ftxt">${c('wf3')}</div></div>
  <div class="frow"><div class="fdot"></div><div class="ftxt">${c('wf4')||c('wf3')}</div></div>
</div>`;
}

// ─── POLISHED CHART ───────────────────────────────────────────
function buildChart(){
  // Wk:  0   1   2   3   4   5   6   7   8   9  10  11  12
  // velm:0  10  22  36  48  60  70  78  84  88  91  94  96
  // other:0   3   5   7   9  11  12  13  14  15  15  15  15
  //
  // SVG coords: viewBox 0 0 320 130, y=130 is 0%, y=0 is 100%
  // Scale: 1% = 1.3px  =>  y = 130 - pct*1.3
  //        x: wk 0=0, wk 12=320  => x = wk*(320/12)
  function vy(pct){ return (130 - pct*1.3).toFixed(1); }
  function vx(wk) { return (wk*(320/12)).toFixed(1); }

  // velm path (through all 13 points)
  const vPts = [
    [0,0],[1,10],[2,22],[3,36],[4,48],[5,60],[6,70],[7,78],[8,84],[9,88],[10,91],[11,94],[12,96]
  ];
  // other path
  const oPts = [
    [0,0],[1,3],[2,5],[3,7],[4,9],[5,11],[6,12],[7,13],[8,14],[9,15],[10,15],[11,15],[12,15]
  ];

  function buildPath(pts){
    let d = `M ${vx(pts[0][0])},${vy(pts[0][1])}`;
    for(let i=1;i<pts.length;i++){
      const prev=pts[i-1], cur=pts[i];
      const cpx=(parseFloat(vx(prev[0]))+parseFloat(vx(cur[0])))/2;
      d += ` C ${cpx},${vy(prev[1])} ${cpx},${vy(cur[1])} ${vx(cur[0])},${vy(cur[1])}`;
    }
    return d;
  }
  const pVelm = buildPath(vPts);
  const pOther= buildPath(oPts);

  // milestone labels: wk1 +10%, wk3 +36%, wk6 +70%, wk12 +96%
  const milestones = [
    {wk:1, pct:10, lbl:'+10%'},
    {wk:3, pct:36, lbl:'+36%'},
    {wk:6, pct:70, lbl:'+70%'},
  ];

  const mDots = milestones.map(m=>`
    <circle cx="${vx(m.wk)}" cy="${vy(m.pct)}" r="3.5" fill="rgba(255,255,255,.55)" class="dot-e"/>
    <text x="${vx(m.wk)}" y="${(parseFloat(vy(m.pct))-8).toFixed(1)}" font-size="8" fill="rgba(255,255,255,.6)" font-family="sans-serif" font-weight="700" text-anchor="middle" class="lbl-e">${m.lbl}</text>
  `).join('');

  return`<div class="chart-card"><div class="chart-card-inner">
  <div class="ch-top">
    <span class="ch-logo">velm</span>
    <div class="ch-ey">12-week performance gain</div>
    <div class="ch-num"><span class="ch-num-val" id="ctr">0</span><sup>%</sup></div>
    <div class="ch-sub">average improvement with velm vs no plan</div>
    <div class="ch-badges">
      <div class="ch-badge cb-g"><span class="cbd"></span>with velm</div>
      <div class="ch-badge cb-b"><span class="cbd"></span>no plan</div>
    </div>
  </div>
  <div class="ch-svg-w" style="padding-top:8px;overflow:visible">
    <svg class="ch-svg" viewBox="0 0 320 130" xmlns="http://www.w3.org/2000/svg" style="height:130px;overflow:visible">
      <defs>
        <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="white" stop-opacity=".18"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <!-- % labels on y-axis -->
      <text x="4" y="${parseFloat(vy(75))+3}" font-size="7.5" fill="rgba(255,255,255,.22)" font-family="sans-serif">75%</text>
      <text x="4" y="${parseFloat(vy(50))+3}" font-size="7.5" fill="rgba(255,255,255,.22)" font-family="sans-serif">50%</text>
      <text x="4" y="${parseFloat(vy(25))+3}" font-size="7.5" fill="rgba(255,255,255,.22)" font-family="sans-serif">25%</text>
      <!-- grid horizontals -->
      <line x1="22" y1="${vy(75)}" x2="320" y2="${vy(75)}" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
      <line x1="22" y1="${vy(50)}" x2="320" y2="${vy(50)}" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
      <line x1="22" y1="${vy(25)}" x2="320" y2="${vy(25)}" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
      <!-- grid verticals at each milestone week -->
      <line x1="${vx(3)}"  y1="0" x2="${vx(3)}"  y2="130" stroke="rgba(255,255,255,.04)" stroke-width="1" stroke-dasharray="3 3"/>
      <line x1="${vx(6)}"  y1="0" x2="${vx(6)}"  y2="130" stroke="rgba(255,255,255,.04)" stroke-width="1" stroke-dasharray="3 3"/>
      <line x1="${vx(9)}"  y1="0" x2="${vx(9)}"  y2="130" stroke="rgba(255,255,255,.04)" stroke-width="1" stroke-dasharray="3 3"/>
      <line x1="${vx(12)}" y1="0" x2="${vx(12)}" y2="130" stroke="rgba(255,255,255,.04)" stroke-width="1" stroke-dasharray="3 3"/>
      <!-- no plan fill + line -->
      <path d="${pOther} L${vx(12)},130 L0,130 Z" fill="rgba(255,255,255,.04)"/>
      <path d="${pOther}" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1.6" stroke-dasharray="5 4" class="p-other"/>
      <!-- velm fill + line -->
      <path d="${pVelm} L${vx(12)},130 L0,130 Z" fill="url(#gv)"/>
      <path d="${pVelm}" fill="none" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" class="p-velm" filter="url(#glow)"/>
      <!-- start dot -->
      <circle cx="0" cy="130" r="4" fill="rgba(255,255,255,.35)" class="dot-s"/>
      <!-- milestone dots + labels -->
      ${mDots}
      <!-- week 12 end dots -->
      <circle cx="${vx(12)}" cy="${vy(96)}" r="10" fill="rgba(255,255,255,.1)" class="dot-e"/>
      <circle cx="${vx(12)}" cy="${vy(96)}" r="4.5" fill="white" class="dot-e"/>
      <circle cx="${vx(12)}" cy="${vy(15)}" r="3.5" fill="rgba(255,255,255,.28)" class="dot-e"/>
      <!-- final labels -->
      <text x="${(parseFloat(vx(12))-5).toFixed(1)}" y="${(parseFloat(vy(96))-10).toFixed(1)}" font-size="9.5" fill="rgba(255,255,255,.85)" font-family="sans-serif" font-weight="800" text-anchor="end" class="lbl-e">+96%</text>
      <text x="${(parseFloat(vx(12))-5).toFixed(1)}" y="${(parseFloat(vy(15))-7).toFixed(1)}"  font-size="8.5" fill="rgba(255,255,255,.32)" font-family="sans-serif" text-anchor="end" class="lbl-e">+15%</text>
    </svg>
  </div>
  <div class="ch-wks">
    <span class="ch-wk">Wk 1</span><span class="ch-wk">Wk 3</span><span class="ch-wk">Wk 6</span><span class="ch-wk">Wk 9</span><span class="ch-wk">Wk 12</span>
  </div>
  <div class="ch-stats">
    <div class="ch-stat"><div class="sv">+10%</div><div class="sl">Week 1</div></div>
    <div class="ch-stat"><div class="sv">+36%</div><div class="sl">Week 3</div></div>
    <div class="ch-stat"><div class="sv">+70%</div><div class="sl">Week 6</div></div>
    <div class="ch-stat"><div class="sv">+96%</div><div class="sl">Week 12</div></div>
  </div>
  <div class="ch-leg">
    <div class="ch-li"><div class="ch-ll ll-s"></div>with velm</div>
    <div class="ch-li"><div class="ch-ll ll-d"></div>no structured plan</div>
  </div>
</div></div>`;
}
function startCounter(){
  setTimeout(()=>{
    const el=document.getElementById('ctr');
    if(!el)return;
    let v=0;const target=96;const dur=2200;const start=performance.now();
    function tick(now){
      const prog=Math.min((now-start)/dur,1);
      const ease=1-Math.pow(1-prog,3);
      v=Math.round(ease*target);
      el.textContent='+'+v;
      if(prog<1)requestAnimationFrame(tick);
      else el.textContent='+96';
    }
    requestAnimationFrame(tick);
  },600);
}

// ── LANG ──
// Per-step agent introductions
const AGENTS = {
  analyst:     { key:'analyst',     ico:'gt',   nameEN:'Analyst',      namePL:'Analityk',    nameFR:'Analyste',    nameES:'Analista',    nameDE:'Analyst',       tagEN:'Data',         tagPL:'Dane',         tagFR:'Données',     tagES:'Datos',       tagDE:'Daten',       color:'#E8EDF7', accent:'#2A4A8A' },
  coach:       { key:'coach',       ico:'lbeg', nameEN:'Coach',        namePL:'Trener',      nameFR:'Coach',       nameES:'Entrenador',  nameDE:'Trainer',       tagEN:'Training',     tagPL:'Trening',      tagFR:'Entraîn.',    tagES:'Entreno',     tagDE:'Training',    color:'#F0F7EE', accent:'#3B6D11' },
  physio:      { key:'physio',      ico:'wy',   nameEN:'Physio',       namePL:'Fizjoterapeuta', nameFR:'Kiné',     nameES:'Fisio',       nameDE:'Physio',        tagEN:'Recovery',     tagPL:'Regeneracja',  tagFR:'Récup.',      tagES:'Recuper.',    tagDE:'Erholung',    color:'#FFF0EE', accent:'#993C1D' },
  headtrainer: { key:'headtrainer', ico:'flag', nameEN:'Head Trainer', namePL:'Szef Sztabu', nameFR:'Chef Coach',  nameES:'Jefe Técnico',nameDE:'Cheftrainer',   tagEN:'Strategy',     tagPL:'Strategia',    tagFR:'Stratégie',   tagES:'Estrategia',  tagDE:'Strategie',   color:'#EDE8DC', accent:'#5C6B85' },
  psychologist:{ key:'psychologist',ico:'gh',   nameEN:'Psychologist', namePL:'Psycholog',   nameFR:'Psychologue', nameES:'Psicólogo',   nameDE:'Psychologe',    tagEN:'Mindset',      tagPL:'Nastawienie',  tagFR:'Mental',      tagES:'Mentalidad',  tagDE:'Mentalität',  color:'#F5F0FF', accent:'#6D28D9' },
};

// Speaking badge translations
// Tab labels per language
const MEET_TAB = {
  en:'Meet your training staff', pl:'Poznaj swoich trenerów',
  fr:'Rencontre ton équipe',  es:'Conoce a tu equipo', de:'Dein Trainerstab'
};
const INTRO_ORDER = ['headtrainer','physio','analyst','psychologist'];
const AGENT_INTRO = {
  analyst:{
    en:"I'm your Analyst. Every week I read your watch data, pace, heart rate, and training load — then compare it against your targets. I spot the trends you'd miss and flag when you're approaching overload.",
    pl:"Jestem Twoim Analitykiem. Co tydzień czytam dane z zegarka, tempo, tętno i obciążenie treningowe — i porównuję z Twoimi celami. Wychwytam trendy, które byś przeoczył.",
    fr:"Je suis ton Analyste. Chaque semaine je lis tes données de montre, allure et fréquence cardiaque — et je les compare à tes objectifs. Je repère les tendances qui t'échapperaient.",
    es:"Soy tu Analista. Cada semana leo tus datos del reloj, ritmo y frecuencia cardíaca — y los comparo con tus objetivos. Detecto las tendencias que pasarías por alto.",
    de:"Ich bin dein Analyst. Jede Woche lese ich Uhrdaten, Pace und Herzfrequenz — und vergleiche mit deinen Zielen. Ich erkenne Trends, die du übersehen würdest."
  },
  coach:{
    en:"I'm your Coach. I design each training session, manage your weekly progression, and adjust when life gets in the way. Nothing is wasted — every run has a purpose.",
    pl:"Jestem Twoim Trenerem. Projektuję każdą sesję treningową, zarządzam tygodniową progresją i dostosuję gdy życie wchodzi w grę. Nic nie jest zmarnowane — każdy bieg ma cel.",
    fr:"Je suis ton Coach. Je conçois chaque séance, gère la progression hebdomadaire et m'adapte quand la vie s'invite. Chaque course a un objectif.",
    es:"Soy tu Entrenador. Diseño cada sesión, gestiono la progresión semanal y me adapto cuando la vida interfiere. Nada se desperdicia — cada carrera tiene un propósito.",
    de:"Ich bin dein Trainer. Ich gestalte jede Einheit, manage die wöchentliche Progression und passe mich an wenn das Leben dazwischenkommt."
  },
  physio:{
    en:"I'm your Physio. I monitor injury signals, recovery time, and fatigue every single week. My job is to catch problems before they become injuries — and keep you training consistently.",
    pl:"Jestem Twoim Fizjoterapeutą. Co tydzień monitoruję sygnały kontuzji, czas regeneracji i zmęczenie. Moim zadaniem jest wykryć problemy zanim staną się kontuzjami.",
    fr:"Je suis ton Kiné. Je surveille les signaux de blessure, la récupération et la fatigue chaque semaine. Mon rôle est d'anticiper les problèmes avant qu'ils ne deviennent des blessures.",
    es:"Soy tu Fisio. Monitoreo señales de lesión, recuperación y fatiga cada semana. Mi trabajo es detectar problemas antes de que se conviertan en lesiones.",
    de:"Ich bin dein Physio. Jede Woche überwache ich Verletzungssignale, Erholung und Ermüdung — und greife ein bevor Probleme zu Verletzungen werden."
  },
  headtrainer:{
    en:"I'm your Head Trainer. I run the weekly staff meeting — I take input from everyone, make the final call on your plan, and take responsibility for every session. The buck stops with me.",
    pl:"Jestem Twoim Szefem Sztabu. Prowadzę cotygodniową naradę — zbieram input od wszystkich, podejmuję finalną decyzję o Twoim planie i biorę odpowiedzialność za każdą sesję.",
    fr:"Je suis ton Chef Coach. Je dirige la réunion hebdomadaire — je reçois tous les inputs, prends la décision finale et suis responsable de chaque séance.",
    es:"Soy tu Jefe Técnico. Dirijo la reunión semanal del equipo — recibo todos los aportes, tomo la decisión final y soy responsable de cada sesión.",
    de:"Ich bin dein Cheftrainer. Ich leite das wöchentliche Teammeeting — sammle alle Inputs, treffe die finale Entscheidung und trage Verantwortung für jede Einheit."
  },
  psychologist:{
    en:"I'm your Psychologist. I read your mood, motivation, and mental state each week — and adjust how the team communicates with you. Hard week? I soften the plan. Peak week? I push harder.",
    pl:"Jestem Twoim Psychologiem. Co tydzień czytam Twój nastrój, motywację i stan psychiczny — i dostosowuję sposób, w jaki sztab się z Tobą komunikuje. Ciężki tydzień? Łagodzę plan. Szczytowy tydzień? Dociskam mocniej.",
    fr:"Je suis ton Psychologue. Je lis ton humeur et ta motivation chaque semaine — et j'ajuste la façon dont l'équipe communique avec toi. Semaine difficile ? J'adoucis le plan. Semaine de pointe ? Je pousse plus fort.",
    es:"Soy tu Psicólogo. Leo tu estado de ánimo y motivación cada semana — y ajusto cómo el equipo se comunica contigo. ¿Semana difícil? Suavizo el plan. ¿Semana pico? Aprieto más.",
    de:"Ich bin dein Psychologe. Jede Woche lese ich deine Stimmung und Motivation — und passe an, wie das Team mit dir kommuniziert. Schwere Woche? Ich mildere den Plan. Spitzenwoche? Ich drücke härter."
  }
};

// ══════════════════════════════════════════════
// COLOR THEMES
// ══════════════════════════════════════════════
// Kolory zastępują granat — tło zawsze kremowe
// ── 6 themes, each with 4 levels:
//   a     = dark  → text, buttons, selected cards
//   m     = mid   → borders, secondary accents
//   p     = pale  → icon backgrounds, info boxes
//   icon  = washed→ icon SVG color (baby-blue style)
//   paint = blob animation color

// (motywy kolorystyczne usunięte — jeden bazowy wygląd)

function meetOneAgent(idx){
  return '';
  const key = INTRO_ORDER[idx] || 'analyst';
  const ag = AGENTS[key];
  const lang = S.data.language || 'en';
  const cap = s => s.charAt(0).toUpperCase()+s.slice(1);
  const name = ag['name'+cap(lang)] || ag.nameEN;
  const tag  = ag['tag' +cap(lang)] || ag.tagEN;
  const intro = (AGENT_INTRO[key]||{})[lang] || (AGENT_INTRO[key]||{}).en || '';
  const icon = I[ag.ico] || '';
  const tabTitle = MEET_TAB[lang] || MEET_TAB.en;
  const tabSub = {
    en:'Your personal AI training staff',
    pl:'Twój osobisty sztab treningowy AI',
    fr:'Ton équipe d\'entraînement IA personnelle',
    es:'Tu equipo personal de entrenamiento IA',
    de:'Dein persönliches KI-Trainerstab'
  }[lang] || 'Your personal AI training staff';
  const dots = INTRO_ORDER.map((_,i)=>`<div class="meet-dot ${i===idx?'on':''}"></div>`).join('');
  return`<div class="meet-staff">
    <div class="meet-staff-header">
      <div class="meet-tab">${tabTitle}</div>
      <div class="meet-tab-sub">${tabSub}</div>
    </div>
    <div class="meet-staff-body">
      <div class="meet-agent-wrap">
        <div class="meet-agent-ico" style="background:${ag.accent}18;color:${ag.accent}">${icon}</div>
        <div class="meet-agent-right">
          <div class="meet-agent-name" style="color:${ag.accent}">${name}</div>
          <div class="meet-agent-tag">${tag}</div>
        </div>
      </div>
      <div class="meet-agent-bio">${intro}</div>
      <div class="meet-dots">${dots}</div>
    </div>
  </div>`;
}

function bLang(){
  return`<h1 class="hl">${e(c('lh')).replace('\n','<br>')}</h1><p class="sh">${e(c('ls'))}</p>
<div class="llist">${LANGS.map(l=>`<div class="li ${S.data.language===l.code?'s':''}" onclick="selLang('${l.code}')">
  <div class="lang-code">${l.code.toUpperCase()}</div><span class="ln">${e(l.name)}</span><span class="lsb">${e(l.sub)}</span>
  <svg class="lc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
</div>`).join('')}</div>
`;
}
function selLang(code){S.data.language=code;try{localStorage.setItem('velm_lang',code);}catch(x){}setTimeout(next,170);}

// ── UNITS ──
function pickUnit(u){
  S.data.unit=u;
  if(!S.data.current_weekly_mileage)S.data.current_weekly_mileage=u==='mi'?35:60;
  if(!S.data.easy_pace_min)S.data.easy_pace_min=u==='mi'?9:6;
  if(!S.data.easy_pace_sec)S.data.easy_pace_sec=0;
  // Re-render body_units with new unit (pickers change)
  render(false);
}

function bBodyUnits(){
  const lang=S.data.language||'en';
  const isImp=S.data.unit==='mi';

  // Set defaults for current unit
  if(isImp){
    if(!S.data.weight||S.data.weight<=0) S.data.weight=165;   // avg 165lb
    if(!S.data.height||S.data.height<=0) S.data.height=69;    // 5ft 9in
    if(S.data.height_ft===undefined) S.data.height_ft=Math.floor(S.data.height/12)||5;
    if(S.data.height_in===undefined) S.data.height_in=S.data.height%12;
  } else {
    if(!S.data.weight||S.data.weight<=0) S.data.weight=75;   // avg 75kg
    if(!S.data.height||S.data.height<=0) S.data.height=175;  // avg 175cm
  }

  const h  ={en:'Height & Weight',pl:'Wzrost i waga',fr:'Taille & poids',es:'Altura y peso',de:'Größe & Gewicht'}[lang]||'Height & Weight';
  const sub={en:'Used to calculate your training load and pace zones.',pl:'Służy do obliczania obciążenia treningowego i stref tempa.',fr:'Pour calculer ta charge et tes zones de rythme.',es:'Para calcular tu carga de entrenamiento y zonas de ritmo.',de:'Zur Berechnung deiner Trainingsbelastung und Tempozonen.'}[lang]||'';
  const impLbl={en:'Imperial',pl:'Imperialne',fr:'Impérial',es:'Imperial',de:'Imperial'}[lang]||'Imperial';
  const metLbl={en:'Metric',  pl:'Metryczne', fr:'Métrique', es:'Métrico', de:'Metrisch'}[lang]||'Metric';
  const htLbl ={en:'Height',  pl:'Wzrost',    fr:'Taille',   es:'Altura',  de:'Größe'}[lang]||'Height';
  const wtLbl ={en:'Weight',  pl:'Waga',      fr:'Poids',    es:'Peso',    de:'Gewicht'}[lang]||'Weight';

  const pickers = isImp
    ? `<div class="pk-row">
        ${picker(S.data.height_ft||5, 3, 8, 1, 'height_ft', 'ft')}
        ${picker(S.data.height_in||7, 0, 11, 1, 'height_in', 'in')}
        <div class="pk-col-wrap" style="flex:1.8">${picker(S.data.weight||160, 66, 440, 1, 'weight', 'lb').replace('<div class="pk-col-wrap">','')}</div>
      </div>`
    : `<div class="pk-row">
        ${picker(S.data.height||170, 100, 220, 1, 'height', 'cm')}
        ${picker(S.data.weight||70,  30,  200, 1, 'weight', 'kg')}
      </div>`;

  return`<h1 class="hl">${e(h)}</h1>
<p class="sh">${e(sub)}</p>
<div class="unit-toggle">
  <span class="ut-lbl ${!isImp?'':'ut-lbl-dim'}" onclick="pickUnit('km')">${metLbl}</span>
  <div class="ut-switch ${isImp?'imp':''}" onclick="pickUnit(S.data.unit==='mi'?'km':'mi')">
    <div class="ut-knob"></div>
  </div>
  <span class="ut-lbl ${isImp?'':'ut-lbl-dim'}" onclick="pickUnit('mi')">${impLbl}</span>
</div>
<div class="pk-heads" style="${isImp?'display:flex':'display:grid;grid-template-columns:1fr 1fr'}">
  ${isImp
    ? `<div class="pk-head" style="flex:2;text-align:center">${htLbl}</div><div class="pk-head" style="flex:1.8;text-align:center">${wtLbl}</div>`
    : `<div class="pk-head">${htLbl}</div><div class="pk-head">${wtLbl}</div>`
  }
</div>
${pickers}`;
}

// ── WATCH ──
// ── LEVEL ──
function bLevel(){
  const lang = S.data.language||'en';

  const begTitle = {en:'Beginner',         pl:'Początkujący',     fr:'Débutant',       es:'Principiante',   de:'Anfänger'}[lang]||'Beginner';
  const advTitle = {en:'Experienced',      pl:'Zaawansowany',     fr:'Expérimenté',    es:'Experimentado',  de:'Erfahren'}[lang]||'Experienced';

  const begSub = {
    en:"You're new to running, coming back after a long break, or starting completely from scratch. We build your base carefully — no shortcuts, no injury risk.",
    pl:"Dopiero zaczynasz biegać, wracasz po długiej przerwie lub zaczynasz całkowicie od nowa. Budujemy Twoją bazę ostrożnie — bez skrótów, bez ryzyka kontuzji.",
    fr:"Tu débutes en course, tu reviens après une longue pause ou tu recommences de zéro. On construit ta base avec soin — sans raccourcis, sans risque de blessure.",
    es:"Eres nuevo en el running, vuelves tras un largo descanso o empiezas desde cero. Construimos tu base con cuidado — sin atajos, sin riesgo de lesión.",
    de:"Du bist neu beim Laufen, kommst nach langer Pause zurück oder fängst von vorn an. Wir bauen deine Basis sorgfältig auf — keine Abkürzungen, kein Verletzungsrisiko."
  }[lang]||'';

  const advSub = {
    en:"You run regularly — at least once a week — and you're ready to take performance seriously. Whether it's a faster race time or a longer distance, we build a structured plan that pushes you forward without breaking you down.",
    pl:"Biegasz regularnie — przynajmniej raz w tygodniu — i jesteś gotowy traktować swoje wyniki poważnie. Niezależnie czy to szybszy czas czy dłuższy dystans, budujemy plan który pcha Cię do przodu bez przeciążeń.",
    fr:"Tu cours régulièrement — au moins une fois par semaine — et tu es prêt à prendre la performance au sérieux. Que ce soit un temps plus rapide ou une distance plus longue, on construit un plan structuré qui te fait progresser sans t'épuiser.",
    es:"Corres regularmente — al menos una vez a la semana — y estás listo para tomarte en serio el rendimiento. Ya sea un tiempo más rápido o una distancia más larga, construimos un plan estructurado que te impulsa sin agotarte.",
    de:"Du läufst regelmäßig — mindestens einmal pro Woche — und bist bereit, Leistung ernst zu nehmen. Ob schnellere Rennzeit oder längere Distanz, wir bauen einen strukturierten Plan der dich vorwärtsbringt ohne dich auszubrennen."
  }[lang]||'';

  function goalDots(goals){
    return goals.map(g=>`<div class="lc-goal"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>${g}</div>`).join('');
  }

  const goalsLabel = {en:'Goals available:',pl:'Dostępne cele:',fr:'Objectifs :',es:'Objetivos:',de:'Verfügbare Ziele:'}[lang]||'Goals:';

  const begGoals = {
    en:  ['Start running from zero','Walk/run → continuous run','Health & fitness habit','Return from injury or break'],
    pl:  ['Zacznij biegać od zera','Marsz/bieg → ciągły bieg','Zdrowie i nawyk treningowy','Powrót po kontuzji lub przerwie'],
    fr:  ['Commencer à courir de zéro','Marche/course → course continue','Habitude santé & fitness','Retour après blessure ou pause'],
    es:  ['Empezar a correr desde cero','Caminar/correr → carrera continua','Hábito de salud y fitness','Vuelta tras lesión o descanso'],
    de:  ['Laufen von null beginnen','Gehen/Laufen → kontinuierliches Laufen','Gesundheit & Fitness-Gewohnheit','Rückkehr nach Verletzung oder Pause'],
  }[lang]||[];

  const advGoals = {
    en:  ['Beat your personal best time','Train for a specific race distance','Health & maintenance running','Return to peak form after injury'],
    pl:  ['Pobij swój rekord życiowy','Trening do konkretnego dystansu','Zdrowie i biegi podtrzymujące','Powrót do formy szczytowej po kontuzji'],
    fr:  ['Battre ton record personnel','S\'entraîner pour une distance de course','Course santé & entretien','Retour à la forme après blessure'],
    es:  ['Batir tu mejor marca personal','Entrenar para una distancia de carrera','Carreras de salud y mantenimiento','Volver a la mejor forma tras lesión'],
    de:  ['Persönliche Bestzeit brechen','Für eine Renndistanz trainieren','Gesundheit & Erhaltungsläufe','Nach Verletzung zur Höchstform zurück'],
  }[lang]||[];

  const cards = [
    {title:begTitle, sub:begSub, goals:begGoals, key:'beginner', ico:I.lbeg},
    {title:advTitle, sub:advSub, goals:advGoals, key:'advanced',  ico:I.flag},
  ].map((item,i)=>{
    const sel = S.data.goal_category===item.key;
    return`<div class="level-card ${sel?'s':''}" onclick="pickLevel('${item.key}')">
      <div class="lc-head">
        <div class="lc-ico">${item.ico}</div>
        <div class="lc-right">
          <div class="lc-title">${item.title}</div>
        </div>
        <svg class="lc-chk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="lc-desc">${item.sub}</div>
      <div class="lc-divider"></div>
      <div class="lc-goals-label">${goalsLabel}</div>
      <div class="lc-goals">${goalDots(item.goals)}</div>
    </div>`;
  }).join('');

  const dots = [0,1].map(i=>`<div class="gd ${i===0?'on':''}"></div>`).join('');

  return`<h1 class="hl">${e(c('lvh')).replace('\n','<br>')}</h1><p class="sh">${e(c('lvs'))}</p>
<div class="gtrack level-track" id="lvtrack" onscroll="syncLevelDots(this)">${cards}</div>
<div class="gdots">${dots}</div>
${meetOneAgent(2)}`;
}
function syncLevelDots(el){
  const idx=Math.round(el.scrollLeft/el.clientWidth);
  document.querySelectorAll('#lvtrack ~ .gdots .gd').forEach((d,i)=>d.classList.toggle('on',i===idx));
}
function pickLevel(v){S.data.goal_category=v;S.data.level=v;setTimeout(next,190);}

// ── GOAL ──
function bGoal(){
  const ids=S.data.goal_category==='advanced'?['time','distance','health','comeback']:['start','walkrun','health','comeback'];
  const cards=ids.map((id,i)=>{
    const g=cg(id);
    const selMark=S.data.goalId===id?`<div class="gc-sel"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Selected</div>`:`<div class="gc-hint">Tap to select</div>`;
    return`<div class="gc ${S.data.goalId===id?'s':''}" onclick="pickGoal('${id}')">
      <div class="gico">${GI[id]||''}</div>
      <div class="gtit">${e(g.title)}</div>
      <div class="gdes">${e(g.desc)}</div>
      ${selMark}
    </div>`;
  }).join('');
  const dots=ids.map((_,i)=>`<div class="gd ${i===0?'on':''}"></div>`).join('');
  return`<h1 class="hl">${e(c('gh')).replace('\n','<br>')}</h1><p class="sh">${e(c('gs'))}</p>
<div class="gtrack" id="gt" onscroll="syncGoalDots(this,${ids.length})">${cards}</div>
<div class="gdots">${dots}</div>
${meetOneAgent(3)}`;
}
function pickGoal(id){
  const gt=document.getElementById('gt');
  const sv=gt?gt.scrollLeft:0;
  S.data.goalId=id;
  render(false);
  if(sv>0) requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const g=document.getElementById('gt');
    if(g){g.style.scrollBehavior='auto';g.scrollLeft=sv;g.style.scrollBehavior='';}
  }));
}
function syncGoalDots(el,total){
  const w=el.clientWidth;
  const idx=Math.round(el.scrollLeft/w);
  document.querySelectorAll('.gd').forEach((d,i)=>d.classList.toggle('on',i===idx));
}

// ── YES/NO ──
function bYesNo(q,yes,no,key,sid=''){
  return`<h1 class="hl">${e(q)}</h1>
<div class="clist" style="margin-top:8px">
  ${card(I.chk,yes,'',S.data[key]===true,`pickYesNo('${key}',true)`)}
  ${card(I.chk,no,'',S.data[key]===false,`pickYesNo('${key}',false)`)}
</div>
`;
}
function pickYesNo(key,val){S.data[key]=val;setTimeout(next,190);}

// ── SPORTS ──
function bSports(){
  const arr=S.data.sport_history;
  const ok=arr.length>0&&(!arr.includes('other')||!!S.data.sport_other.trim());
  return`<h1 class="hl">${e(c('qsports'))}</h1>
<div class="sport-grid" style="margin-top:8px">${SPORTS.map(([id,labelKey,ico])=>`<div class="cc ${arr.includes(id)?'s':''}" onclick="toggleSport('${id}')"><div class="ci">${ico}</div><div class="cp"><div class="ct">${e(c(labelKey))}</div></div><svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>`).join('')}</div>
${arr.includes('other')?`<input class="txt" style="margin-top:10px" placeholder="${e(c('whichsport'))}" value="${e(S.data.sport_other)}" oninput="setSportOther(this.value)">`:''}`;
}
function toggleSport(id){let a=[...S.data.sport_history];if(id==='none')a=a.includes('none')?[]:['none'];else{a=a.filter(x=>x!=='none');a=a.includes(id)?a.filter(x=>x!==id):a.concat(id);}const p={sport_history:a};if(!a.includes('other'))p.sport_other='';patch(p);}
function setSportOther(v){S.data.sport_other=v;const ctab=document.getElementById('ctab');if(ctab)ctab.disabled=cant('training_history');}

// ── HEALTH TRAIN TYPE ──
function bHealthTrainType(isComeback=false){
  const key=isComeback?'comeback_train_type':'health_train_type';
  const lang=S.data.language||'en';
  const SUB={
    walkrun:{en:'Walk/run intervals that alternate',pl:'Naprzemienne odcinki marszu i biegu',fr:'Alternance de marche et de course',es:'Intervalos alternos de caminata y carrera',de:'Abwechselnd Gehen und Laufen'},
    easy:   {en:'Steady comfortable runs',pl:'Spokojne, komfortowe biegi',fr:'Sorties régulières et confortables',es:'Carreras suaves y constantes',de:'Ruhige, angenehme Läufe'},
    mixed:  {en:'Easy, intervals, long runs & tempo',pl:'Easy, interwały, long runy i tempo',fr:'Endurance, fractionné, sorties longues et tempo',es:'Suaves, series, tiradas largas y tempo',de:'Ruhige Läufe, Intervalle, lange Läufe und Tempo'}
  };
  const walkrunSub=SUB.walkrun[lang]||SUB.walkrun.en;
  const easySub   =SUB.easy[lang]   ||SUB.easy.en;
  const mixedSub  =SUB.mixed[lang]  ||SUB.mixed.en;
  
  let dynamicTitle = c('qhtt');
  if(isComeback){
    dynamicTitle = c('qcb_dynamic_tr') || c('qcbtrtype');
  }

  return`<h1 class="hl" style="font-size:26px; line-height:1.2; margin-bottom:16px;">${e(dynamicTitle)}</h1>
<div class="clist">
  ${card(I.gw,c('htwalkrun'),walkrunSub,S.data[key]==='walkrun',`setTrainType('${key}','walkrun')`)}
  ${card(I.gs,c('hteasy'),   easySub,   S.data[key]==='easy',   `setTrainType('${key}','easy')`)}
  ${card(I.gt,c('htmixed'),  mixedSub,  S.data[key]==='mixed',  `setTrainType('${key}','mixed')`)}
</div>`;
}
function setTrainType(key,val){S.data[key]=val;setTimeout(next,190);}

// ── EASY PACE ──
function bEasyPace(mKey,sKey,isComeback=false){
  const pu=S.data.unit==='mi'?c('paceUnit_mi'):c('paceUnit_km');
  if(!S.data[mKey]) S.data[mKey]=6;
  if(S.data[sKey]===undefined||S.data[sKey]===null) S.data[sKey]=0;
  const pm=S.data[mKey], ps=S.data[sKey];
  const unknown=S.data.easy_pace_unknown===true;
  const lang=S.data.language||'en';
  const unknownLbl={en:"I don't know",pl:'Nie wiem',fr:'Je ne sais pas',es:'No sé',de:'Weiß ich nicht'}[lang]||"I don't know";
  const unknownSub={en:'We will estimate it from your diagnostics',pl:'Oszacujemy je z Twoich danych diagnostycznych',fr:'On l\'estimera à partir de tes données',es:'Lo estimaremos desde tus datos',de:'Wir schätzen es aus deinen Daten'}[lang]||'';
  const minLbl={en:'MIN',pl:'MIN',fr:'MIN',es:'MIN',de:'MIN'}[lang]||'MIN';
  const secLbl={en:'SEC',pl:'SEK',fr:'SEC',es:'SEG',de:'SEK'}[lang]||'SEC';
  return`<h1 class="hl">${e(isComeback?c('qcb_epace'):c('qepace'))}</h1>
<p class="sh" style="margin-bottom:24px">${pu}</p>
<div class="wr-blocks" style="${unknown?'opacity:.35;pointer-events:none':''}">
  <div class="wr-block">
    <div class="wr-label">${minLbl}</div>
    <div class="days-sel">
      <button class="round-btn" onclick="easyPaceAdj('${mKey}',-1,3,20)">−</button>
      <div><div class="days-big" id="ep_min">${pm}</div></div>
      <button class="round-btn" onclick="easyPaceAdj('${mKey}',1,3,20)">+</button>
    </div>
  </div>
  <div class="wr-block">
    <div class="wr-label">${secLbl}</div>
    <div class="days-sel">
      <button class="round-btn" onclick="easyPaceAdj('${sKey}',-5,0,55)">−</button>
      <div><div class="days-big" id="ep_sec">${String(ps).padStart(2,'0')}</div></div>
      <button class="round-btn" onclick="easyPaceAdj('${sKey}',5,0,55)">+</button>
    </div>
  </div>
</div>
<div style="margin-top:20px">
  ${card(I.q||I.gh,unknownLbl,unknownSub,unknown,"toggleEasyUnknown()")}
</div>
<div class="pace-display" id="pace-display" data-mkey="${mKey}" data-skey="${sKey}" data-pu="${pu}" style="${unknown?'opacity:.4':''}">${pm}:${String(ps).padStart(2,'0')} ${pu}</div>`;
}

function easyPaceAdj(key,dir,mn,mx){
  const v=Math.max(mn,Math.min(mx,(S.data[key]||mn)+dir));
  S.data[key]=v;
  const isMin=key.includes('min');
  const id=isMin?'ep_min':'ep_sec';
  const el=document.getElementById(id);if(el)el.textContent=isMin?v:String(v).padStart(2,'0');
  const pd=document.getElementById('pace-display');
  if(pd){
    const mStr=S.data[pd.dataset.mkey]||3;
    const sStr=String(S.data[pd.dataset.skey]||0).padStart(2,'0');
    pd.textContent=`${mStr}:${sStr} ${pd.dataset.pu}`;
  }
}

function toggleEasyUnknown(){
  S.data.easy_pace_unknown=!S.data.easy_pace_unknown;
  render(false);
}

function bEasyKm(isComeback=false){
  // kept for comeback flow compatibility — redirects to same UI
  return bEasySession(isComeback);
}

function bEasySession(isComeback=false){
  const lang=S.data.language||'en';
  if(!S.data.easy_sessions_per_week) S.data.easy_sessions_per_week=3;
  if(!S.data.easy_session_duration)  S.data.easy_session_duration=40;
  if(!S.data.easy_session_distance)  S.data.easy_session_distance=5;
  const ses=S.data.easy_sessions_per_week, dur=S.data.easy_session_duration, dist=S.data.easy_session_distance;
  const u=S.data.unit==='mi'?'mi':'km';
  let h = {en:'How do your easy runs look?',pl:'Jak wyglądają Twoje spokojne biegi?',fr:'À quoi ressemblent tes sorties faciles ?',es:'¿Cómo son tus carreras tranquilas?',de:'Wie sehen deine lockeren Läufe aus?'}[lang]||'How do your easy runs look?';
  if (isComeback) h = c('qcb_ekm');
  const sesLbl={en:'Sessions / week',pl:isComeback?'Opisz ile było treningów (treningi / tydzień)':'Treningi / tydzień',fr:'Séances / sem.',es:'Sesiones / sem.',de:'Einheiten / Woche'}[lang]||'Sessions / week';
  const durLbl={en:'Avg. duration (min)',pl:isComeback?'Ile trwał typowy trening (min)':'Śr. czas trwania (min)',fr:'Durée moy. (min)',es:'Duración media (min)',de:'Ø Dauer (Min)'}[lang]||'Duration (min)';
  const distLbl={en:`Avg. distance (${u})`,pl:isComeback?(u==='km'?'Ile kilometrów średnio na jednym treningu?':'Ile mil średnio na jednym treningu?'):`Śr. dystans (${u})`,fr:`Dist. moy (${u})`,es:`Distancia media (${u})`,de:`Ø Distanz (${u})`}[lang]||`Avg. distance (${u})`;

  return`<h1 class="hl">${e(h)}</h1>
<div class="wr-blocks">
  <div class="wr-block" style="${isComeback?'flex-direction:column;align-items:flex-start;height:auto;gap:12px;padding:20px;':''}">
    <div class="wr-label" style="${isComeback?'margin-bottom:4px;':''}">${sesLbl}</div>
    <div class="days-sel" style="${isComeback?'align-self:stretch;justify-content:space-between;':''}">
      <button class="round-btn" onclick="easyAdj('easy_sessions_per_week',-1,1,7)">−</button>
      <div><div class="days-big" id="es_ses">${ses}</div></div>
      <button class="round-btn" onclick="easyAdj('easy_sessions_per_week',1,1,7)">+</button>
    </div>
  </div>
  <div class="wr-block" style="${isComeback?'flex-direction:column;align-items:flex-start;height:auto;gap:12px;padding:20px;margin-top:16px;':''}">
    <div class="wr-label" style="${isComeback?'margin-bottom:4px;':''}">${durLbl}</div>
    <div class="days-sel" style="${isComeback?'align-self:stretch;justify-content:space-between;':''}">
      <button class="round-btn" onclick="easyAdj('easy_session_duration',-5,10,120)">−</button>
      <div><div class="days-big" id="es_dur">${dur}</div></div>
      <button class="round-btn" onclick="easyAdj('easy_session_duration',5,10,120)">+</button>
    </div>
  </div>
  ${isComeback ? `
  <div class="wr-block" style="flex-direction:column;align-items:flex-start;height:auto;gap:12px;padding:20px;margin-top:16px;">
    <div class="wr-label" style="margin-bottom:4px;">${distLbl}</div>
    <div class="days-sel" style="align-self:stretch;justify-content:space-between;">
      <button class="round-btn" onclick="easyAdj('easy_session_distance',-1,1,50)">−</button>
      <div><div class="days-big" id="es_dist">${dist}</div></div>
      <button class="round-btn" onclick="easyAdj('easy_session_distance',1,1,50)">+</button>
    </div>
  </div>
  ` : ''}
</div>`;
}
function easyAdj(key,dir,mn,mx){
  const v=Math.max(mn,Math.min(mx,(S.data[key]||mn)+dir));
  S.data[key]=v;
  const idMap={easy_sessions_per_week:'es_ses',easy_session_duration:'es_dur',easy_session_distance:'es_dist'};
  const el=document.getElementById(idMap[key]);
  if(el) el.textContent=v;
}

// ── RPE ──
const RFACE=[
  `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>`,
  `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M9 14.5s1 1.5 3 1.5 3-1.5 3-1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>`,
  `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>`,
  `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M9 16s1-1.5 3-1.5 3 1.5 3 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8.5 9.5c.5-.5 1.5-.5 2 0M13.5 9.5c.5-.5 1.5-.5 2 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M8 17s1.5-2 4-2 4 2 4 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 9c.7-.7 2-.7 2.5 0M13.5 9c.7-.7 2-.7 2.5 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
];
function bRpe(key, isComeback=false){
  const rpes=c('rpe'),rpesub=c('rpesub');
  return`<h1 class="hl">${e(isComeback?c('qcb_rpe'):c('qrpe'))}</h1>
<div class="rpe-list" style="margin-top:8px">${[1,2,3,4,5].map((v,i)=>card(RFACE[i],rpes[i],rpesub[i],S.data[key]===v,`pickRpe('${key}',${v})`)).join('')}</div>`;
}
function pickRpe(key,v){S.data[key]=v;setTimeout(next,190);}

// ── MIXED WEEK ──
function bMixedWeek(planKey, isComeback=false){
  if (!S.data.daysPerWeek) S.data.daysPerWeek = 4;
  const plan=S.data[planKey]||{};const sh=c('wdays');
  const need=S.data.daysPerWeek;
  const lang=S.data.language||'en';
  const typeLabels=WTYPE_LABELS;
  function dayBtn(d,i){
    const wt=plan[d];const bg=wt&&WCOLORS[wt]?WCOLORS[wt]:'';const isSel=!!wt&&wt!=='rest';
    const style=isSel?`border-color:${bg};background:${bg}18`:'';
    const lbl=wt?(typeLabels[wt]?.[lang]||typeLabels[wt]?.en||wt):'';
    return`<div onclick="cyclePlanDayDom('${planKey}','${d}',this.querySelector('.day-btn'))">
      <div style="font-size:12px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:.06em;color:#3A4A5A;margin-bottom:4px">${sh[i]||d.slice(0,2)}</div>
      <div class="day-btn ${isSel?'':'sel-empty'}" style="${style}">
        <span style="font-size:11px;font-weight:700;color:${bg||'#8A97AD'}">${lbl||'+'}</span>
      </div></div>`;
  }
  
  const numLbl = ({pl:'Ilość treningów w tygodniu',en:'Sessions per week',fr:'Séances par semaine',es:'Sesiones por semana',de:'Einheiten pro Woche'})[lang]||'Sessions per week';
  const typeLbl = ({pl:'Typy treningów w tygodniu',en:'Training types per week',fr:'Types de séances par semaine',es:'Tipos de sesión por semana',de:'Trainingsarten pro Woche'})[lang]||'Training types per week';

  // call once to build status text but don't inject
  const statusHtml = getMixedWeekStatusHtml(planKey, lang);

  return`<h1 class="hl">${e(isComeback?c('qcb_mixweek'):c('qmixweek'))}</h1>
<div style="margin-top:32px; padding:0 12px;">
  <div style="font-size:13.5px;font-weight:700;color:var(--navy);margin-bottom:12px;">${e(numLbl)}</div>
  <div class="days-sel" style="margin-bottom:32px">
    <button class="round-btn" onclick="adjMixedDays(-1, '${planKey}')">−</button>
    <div><div class="days-big" id="mix_days">${need}</div></div>
    <button class="round-btn" onclick="adjMixedDays(1, '${planKey}')">+</button>
  </div>
  <div style="font-size:13.5px;font-weight:700;color:var(--navy);margin-bottom:16px;">${e(typeLbl)}</div>
  <div class="week-grid">${WDAYS.slice(0,4).map((d,i)=>dayBtn(d,i)).join('')}</div>
  <div class="week-grid-3" style="margin-bottom:24px">${WDAYS.slice(4).map((d,i)=>dayBtn(d,i+4)).join('')}</div>
</div>
<div class="status-bar" id="mix_status">${e(statusHtml)}</div>`;
}

function getMixedWeekStatusHtml(planKey, lang) {
  const plan=S.data[planKey]||{};
  const need=S.data.daysPerWeek;
  const filled=Object.values(plan).filter(v=>v&&v!=='rest').length;
  const diff=need-filled;
  
  const m1 = c('selectdays');
  const n = Math.abs(diff);
  const st = MIXED_STATUS[lang] || MIXED_STATUS.en;
  const mSelect = st.sel(n);
  const mRemove = st.rem(n);
  const mReady = st.ready;
  
  return filled===0?m1:diff>0?mSelect:diff<0?mRemove:mReady;
}

function updateMixedWeekStatus(planKey){
  const lang=S.data.language||'en';
  const st=document.getElementById('mix_status');
  if(st) st.textContent = getMixedWeekStatusHtml(planKey, lang);
  
  const plan=S.data[planKey]||{};
  const need=S.data.daysPerWeek;
  const filled=Object.values(plan).filter(v=>v&&v!=='rest').length;
  const ctab=document.getElementById('ctab');
  if(ctab) ctab.disabled = (filled !== need);
}

function adjMixedDays(dir, planKey){
  const v=Math.max(1,Math.min(7,S.data.daysPerWeek+dir));
  S.data.daysPerWeek=v;
  const el=document.getElementById('mix_days');if(el)el.textContent=v;
  updateMixedWeekStatus(planKey);
}

function cyclePlanDayDom(planKey,d,btnEl){
  const types=['easy','long','tempo','interval','rest'];
  const plan=S.data[planKey]||{};const cur=plan[d];const idx=cur?types.indexOf(cur):-1;
  const nx=types[(idx+1)%types.length];
  const p={...S.data[planKey]};p[d]=nx;S.data[planKey]=p;
  const lang=S.data.language||'en';
  const typeLabels=WTYPE_LABELS;
  const bg=WCOLORS[nx]||'';const isSel=nx!=='rest';
  const lbl=typeLabels[nx]?.[lang]||typeLabels[nx]?.en||nx;
  if(btnEl){
    btnEl.style.borderColor=isSel?bg:'';btnEl.style.background=isSel?bg+'18':'';
    btnEl.className='day-btn '+(isSel?'':'sel-empty');
    btnEl.innerHTML=`<span style="font-size:11px;font-weight:700;color:${bg||'#8A97AD'}">${lbl||'+'}</span>`;
  }
  updateMixedWeekStatus(planKey);
}
function bMixedVolume(isComeback=false, prefix='health'){
  const u=S.data.unit==='mi'?'mi':'km';const pu=S.data.unit==='mi'?c('paceUnit_mi'):c('paceUnit_km');
  const lang=S.data.language||'en';
  if(!S.data[`${prefix}_sessions_per_week`])S.data[`${prefix}_sessions_per_week`]=3;
  if(!S.data[`${prefix}_weekly_km`])S.data[`${prefix}_weekly_km`]=40;
  if(!S.data[`${prefix}_easy_pace_min`])S.data[`${prefix}_easy_pace_min`]=6;
  if(!S.data[`${prefix}_easy_pace_sec`])S.data[`${prefix}_easy_pace_sec`]=0;
  const ses=S.data[`${prefix}_sessions_per_week`], v=S.data[`${prefix}_weekly_km`],pm=S.data[`${prefix}_easy_pace_min`],ps=S.data[`${prefix}_easy_pace_sec`];
  const sesLbl={en:'Sessions / week',pl:'Sesje / tydzień',fr:'Séances / sem.',es:'Sesiones / sem.',de:'Einheiten / Woche'}[lang]||'Sessions / week';
  const kmLbl={en:`Weekly distance (${u})`,pl:`Tygodniowy kilometraż (${u})`,fr:`Dist. hebd. (${u})`,es:`Distancia sem. (${u})`,de:`Wochendistanz (${u})`}[lang]||`Weekly distance (${u})`;
  const pminLbl={en:'Pace (min)',pl:'Spokojne tempo (min)',fr:'Allure (min)',es:'Ritmo (min)',de:'Tempo (min)'}[lang]||'Pace (min)';
  const psecLbl={en:'Pace (sec)',pl:'Spokojne tempo (sek)',fr:'Allure (sec)',es:'Ritmo (seg)',de:'Tempo (sek)'}[lang]||'Pace (sec)';
  
  return`<h1 class="hl" style="margin-top:0">${e(isComeback?c('qcb_mixvol'):c('qmixvol'))}</h1>
<div class="wr-blocks">
  <div class="wr-block" style="display:none;flex-direction:column;align-items:flex-start;height:auto;gap:12px;padding:20px;">
    <div class="wr-label" style="margin-bottom:4px;">${sesLbl}</div>
    <div class="days-sel" style="align-self:stretch;justify-content:space-between;">
      <button class="round-btn" onclick="mixVolAdj('${prefix}_sessions_per_week',-1,1,14)">−</button>
      <div><div class="days-big" id="${prefix}_mv_ses">${ses}</div></div>
      <button class="round-btn" onclick="mixVolAdj('${prefix}_sessions_per_week',1,1,14)">+</button>
    </div>
  </div>
  <div class="wr-block" style="flex-direction:column;align-items:flex-start;height:auto;gap:12px;padding:20px;margin-top:16px;">
    <div class="wr-label" style="margin-bottom:4px;">${kmLbl}</div>
    <div class="days-sel" style="align-self:stretch;justify-content:space-between;">
      <button class="round-btn" onclick="mixVolAdj('${prefix}_weekly_km',-5,1,200)">−</button>
      <div><div class="days-big" id="${prefix}_mv_km">${v}</div></div>
      <button class="round-btn" onclick="mixVolAdj('${prefix}_weekly_km',5,1,200)">+</button>
    </div>
  </div>
  <div class="wr-block" style="flex-direction:column;align-items:flex-start;height:auto;gap:12px;padding:20px;margin-top:16px;">
    <div class="wr-label" style="margin-bottom:4px;">${pminLbl}</div>
    <div class="days-sel" style="align-self:stretch;justify-content:space-between;">
      <button class="round-btn" onclick="mixVolAdj('${prefix}_easy_pace_min',-1,3,20)">−</button>
      <div><div class="days-big" id="${prefix}_mv_pmin">${pm}</div></div>
      <button class="round-btn" onclick="mixVolAdj('${prefix}_easy_pace_min',1,3,20)">+</button>
    </div>
  </div>
  <div class="wr-block" style="flex-direction:column;align-items:flex-start;height:auto;gap:12px;padding:20px;margin-top:16px;">
    <div class="wr-label" style="margin-bottom:4px;">${psecLbl}</div>
    <div class="days-sel" style="align-self:stretch;justify-content:space-between;">
      <button class="round-btn" onclick="mixVolAdj('${prefix}_easy_pace_sec',-5,0,55)">−</button>
      <div><div class="days-big" id="${prefix}_mv_psec">${String(ps).padStart(2,'0')}</div></div>
      <button class="round-btn" onclick="mixVolAdj('${prefix}_easy_pace_sec',5,0,55)">+</button>
    </div>
  </div>
</div>
<div class="pace-display" id="${prefix}-mv-pace-display" style="margin-top:20px;">${pm}:${String(ps).padStart(2,'0')} ${pu}</div>`;
}

function mixVolAdj(key,dir,mn,mx){
  const v=Math.max(mn,Math.min(mx,(S.data[key]||mn)+dir));
  S.data[key]=v;
  let kpfx = 'health';
  if(key.startsWith('time_')) kpfx='time';
  else if(key.startsWith('distance_')) kpfx='distance';
  else if(key.startsWith('comeback_')) kpfx='comeback';
  const elStr=key.includes('_sessions_per_week')?`${kpfx}_mv_ses`:key.includes('_weekly_km')?`${kpfx}_mv_km`:key.includes('_min')?`${kpfx}_mv_pmin`:`${kpfx}_mv_psec`;
  
  const el=document.getElementById(elStr);
  if(el) el.textContent=key.includes('_sec')?String(v).padStart(2,'0'):v;

  if(key.includes('pace')){
    const pd=document.getElementById(`${kpfx}-mv-pace-display`);
    if(pd){
      const pm=S.data[`${kpfx}_easy_pace_min`]||3;
      const ps=String(S.data[`${kpfx}_easy_pace_sec`]||0).padStart(2,'0');
      const pu=S.data.unit==='mi'?c('paceUnit_mi'):c('paceUnit_km');
      pd.textContent=`${pm}:${ps} ${pu}`;
    }
  }
}

// ── WALKRUN CONFIG (reused for health) ──
function bWalkrunConfig(isComeback=false){
  if(!S.data.walkrun_walk_min)S.data.walkrun_walk_min=2;
  if(!S.data.walkrun_run_min)S.data.walkrun_run_min=1;
  if(!S.data.walkrun_series)S.data.walkrun_series=5;
  const walk=S.data.walkrun_walk_min,run=S.data.walkrun_run_min,cyc=S.data.walkrun_series;
  const lang=S.data.language||'en';
  const runLbl={en:'Run (min)',pl:'Bieg (min)',fr:'Course (min)',es:'Correr (min)',de:'Laufen (min)'}[lang]||'Run';
  const wlkLbl={en:'Walk (min)',pl:'Marsz (min)',fr:'Marche (min)',es:'Caminar (min)',de:'Gehen (min)'}[lang]||'Walk';
  const cycleLbl={en:'Series',pl:'Serie',fr:'Séries',es:'Series',de:'Serien'}[lang]||'Series';
  const total=cyc*(run+walk);
  const sub=c('qwrc2_sub').replace('{run}',run).replace('{walk}',walk);
  return`
<h2 class="hl" style="font-size: 28px; line-height:1.1; margin:0 0 16px; text-align:left">${e(isComeback?c('qcb_wrc1'):c('qwrc1'))}</h2>
<div class="wr-blocks" style="margin:0 0 24px">
  <div class="wr-block">
    <div class="wr-label">${runLbl}</div>
    <div class="days-sel">
      <button class="round-btn" onclick="wrAdj('walkrun_run_min',-1,1,30)">−</button>
      <div><div class="days-big" id="wr_run">${run}</div></div>
      <button class="round-btn" onclick="wrAdj('walkrun_run_min',1,1,30)">+</button>
    </div>
  </div>
  <div class="wr-block">
    <div class="wr-label">${wlkLbl}</div>
    <div class="days-sel">
      <button class="round-btn" onclick="wrAdj('walkrun_walk_min',-1,1,30)">−</button>
      <div><div class="days-big" id="wr_walk">${walk}</div></div>
      <button class="round-btn" onclick="wrAdj('walkrun_walk_min',1,1,30)">+</button>
    </div>
  </div>
</div>

<h2 class="hl" style="font-size: 22px; line-height:1.2; margin:0 0 4px; text-align:left">${e(isComeback?c('qcb_wrc2'):c('qwrc2'))}</h2>
<p class="sh" id="wr_sub_hint" style="margin:0 0 10px; text-align:left; font-size:13px">${e(sub)}</p>
<div class="wr-blocks">
  <div class="wr-block">
    <div class="wr-label">${cycleLbl}<div class="wr-total" id="wr_total" style="font-weight:500; font-size:11px; margin-left:6px; background:var(--navy-pale); color:var(--navy); padding:2px 6px; border-radius:4px; display:inline-block">~ ${total} min</div></div>
    <div class="days-sel">
      <button class="round-btn" onclick="wrAdj('walkrun_series',-1,1,40)">−</button>
      <div><div class="days-big" id="wr_series">${cyc}</div></div>
      <button class="round-btn" onclick="wrAdj('walkrun_series',1,1,40)">+</button>
    </div>
  </div>
</div>`;
}

function bWalkrunRpe(isComeback=false){
  return`<h1 class="hl">${e(isComeback?c('qcb_rpe'):c('qwr_rpe'))}</h1>
<div class="rpe-list" style="margin-top:8px">${[1,2,3,4,5].map((v,i)=>card(RFACE[i],c('rpe')[i],c('rpesub')[i],S.data.walkrun_rpe===v,`pickRpe('walkrun_rpe',${v})`)).join('')}</div>`;
}

function wrAdj(key,dir,mn,mx){
  mn=mn||1;mx=mx||99;
  const v=Math.max(mn,Math.min(mx,(S.data[key]||mn)+dir));
  S.data[key]=v;
  const idMap={walkrun_run_min:'wr_run',walkrun_walk_min:'wr_walk',walkrun_series:'wr_series'};
  const el=document.getElementById(idMap[key]);if(el)el.textContent=v;
  const r=S.data.walkrun_run_min||1,w=S.data.walkrun_walk_min||2,s=S.data.walkrun_series||5;
  const tot=document.getElementById('wr_total');
  if(tot) tot.textContent='~ '+(s*(r+w))+' min';
  const hint=document.getElementById('wr_sub_hint');
  if(hint) hint.textContent=c('qwrc2_sub').replace('{run}',r).replace('{walk}',w);
}

// ── ADVANCED ──
// ── ENDURANCE ──
function bEnduranceTarget(){
  const lang=S.data.language||'en';
  const dk=c('dist10k'),dh=c('disthalf'),dm=c('distmarathon'),du=c('distultra'),doth=c('distother');
  const opts=[['10k',dk,'#60a5fa'],['half',dh,'#818cf8'],['marathon',dm,'#a78bfa'],['ultra50',du,'#c084fc'],['other_dist',doth,'#e879f9']];
  const cards=opts.map(([id,title])=>`<div class="gc ${S.data.endurance_dist===id?'s':''}" onclick="pickEndDist('${id}')"><div class="gico">${I.gd}</div><div class="gtit">${e(title)}</div></div>`).join('');
  const dots=opts.map((_,i)=>`<div class="gd ${i===0?'on':''}"></div>`).join('');
  return`<h1 class="hl">${e(c('qedist'))}</h1><p class="sh">${e(c('gs'))}</p><div class="gtrack" id="etrack">${cards}</div><div class="gdots">${dots}</div>
${S.data.endurance_dist==='other_dist'?`<div style="margin-top:12px">${picker(S.data.customDist||10,1,200,1,'customDist',S.data.unit==='mi'?'mi':'km')}</div>`:''}`;
}
function pickEndDist(id){
  const et=document.getElementById('etrack');const sv=et?et.scrollLeft:0;
  S.data.endurance_dist=id;
  if(id==='other_dist'){S.data.customDist=S.data.customDist||10;render(false);requestAnimationFrame(()=>requestAnimationFrame(()=>{const e2=document.getElementById('etrack');if(e2){e2.style.scrollBehavior='auto';e2.scrollLeft=sv;e2.style.scrollBehavior='';}}));}
  else setTimeout(next,190);
}

function bLongestRun(){
  const u=S.data.unit==='mi'?'mi':'km';
  const lang=S.data.language||'en';
  if(!S.data.dist_longest_run)S.data.dist_longest_run=S.data.unit==='mi'?6:10;
  const h={en:"What's the longest you've run recently?",pl:'Jaki jest najdłuższy bieg który ostatnio ukończyłeś?',fr:'Quelle est ta plus longue course récente ?',es:'¿Cuál es tu carrera más larga reciente?',de:'Was ist dein längster Lauf zuletzt?'}[lang]||'Longest run';
  return`<h1 class="hl">${e(h)}</h1>
<div style="max-width:260px;margin:16px auto 0">${picker(S.data.dist_longest_run,1,S.data.unit==='mi'?100:160,1,'dist_longest_run',u)}</div>`;
}

function bDistRace(){
  const lang=S.data.language||'en';
  const h={en:'Do you have a race planned?',pl:'Masz już zaplanowane konkretne zawody?',fr:'As-tu une course prévue ?',es:'¿Tienes una carrera planeada?',de:'Hast du ein Rennen geplant?'}[lang]||'Race planned?';
  return`<h1 class="hl">${e(h)}</h1>
<div class="clist">
  ${card(I.flag,c('raceyes'),'',S.data.dist_has_race===true,"pickDistRace(true)")}
  ${card(I.gt,c('raceno'),'',S.data.dist_has_race===false,"pickDistRace(false)")}
</div>`;
}
function pickDistRace(v){S.data.dist_has_race=v;setTimeout(next,190);}

function bTimeDist(){
  const opts=[['5k',c('dist5k')||'5k'],['10k',c('dist10k')||'10k'],['half',c('disthalf')||'Half Marathon'],['marathon',c('distmarathon')||'Marathon'],['other',c('distother')||'Other']];
  const cards=opts.map(([id,title])=>`<div class="cc ${S.data.time_distance===id?'s':''}" onclick="pickTimeDist('${id}')">
    <div class="ci">${I.gt}</div>
    <div class="cp"><div class="ct">${e(title)}</div></div>
    <svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  </div>`).join('');
  return`<h1 class="hl">${e(c('qtdist'))}</h1><div class="clist" style="margin-top:16px">${cards}</div>
${S.data.time_distance==='other'?`<div style="margin-top:24px">${picker(S.data.time_custom_dist||10,1,200,1,'time_custom_dist',S.data.unit==='mi'?'mi':'km')}</div>`:''}`;
}
function pickTimeDist(id){
  if(id==='other'){
    S.data.time_distance=id;
    render(false);
    setTimeout(() => {
      const scr = document.querySelector('#app');
      if (scr) scr.scrollTo({top: scr.scrollHeight, behavior: 'smooth'});
    }, 50);
  } else {
    S.data.time_distance=id;
    const def={time_pb_hours:0,time_pb_mins:25,time_pb_secs:0,time_target_hours:0,time_target_mins:23,time_target_secs:0};
    if(id==='10k'){def.time_pb_mins=52;def.time_target_mins=48;}
    else if(id==='half'){def.time_pb_hours=1;def.time_pb_mins=55;def.time_target_hours=1;def.time_target_mins=50;}
    else if(id==='marathon'){def.time_pb_hours=4;def.time_pb_mins=10;def.time_target_hours=3;def.time_target_mins=55;}
    Object.assign(S.data,def);
    setTimeout(next,190);
  }
}

// Zwraca FRAGMENT wstawiany w zdanie ("...rekord na dystansie X?"), wiec musi
// niesc przypadek wymagany przez ramke zdania w bTimePb / bTimeTarget.
// pl: obie ramki uzywaja "na dystansie" -> dopelniacz.
// de: obie ramki uzywaja "uber" -> biernik (dlatego bTimeTarget nie moze wrocic do "fur").
const TIME_DIST_TITLE = {
  pl:{'5k':'5 km','10k':'10 km',half:'półmaratonu',marathon:'maratonu',unit:u=>u==='mi'?'mil':'km'},
  en:{'5k':'5k','10k':'10k',half:'the half marathon',marathon:'the marathon',unit:u=>u},
  fr:{'5k':'5 km','10k':'10 km',half:'le semi-marathon',marathon:'le marathon',unit:u=>u==='mi'?'mi':'km'},
  es:{'5k':'5 km','10k':'10 km',half:'la media maratón',marathon:'el maratón',unit:u=>u==='mi'?'mi':'km'},
  de:{'5k':'5 km','10k':'10 km',half:'den Halbmarathon',marathon:'den Marathon',unit:u=>u==='mi'?'mi':'km'}
};
function formatTimeDistTitle(){
  const dst = S.data.time_distance;
  const T = TIME_DIST_TITLE[S.data.language||'en'] || TIME_DIST_TITLE.en;
  if(dst==='other') return `${S.data.time_custom_dist} ${T.unit(S.data.unit)}`;
  return T[dst] || '';
}

function renderTimeAdjUI(pbt, title){
  const lang=S.data.language||'en';
  const hLbl=c('hrs')||'hrs';
  const mLbl=c('min')||'min';
  const sLbl=c('sec')||'sec';
  
  const h=S.data[`time_${pbt}_hours`]||0;
  const m=S.data[`time_${pbt}_mins`]||0;
  const s=S.data[`time_${pbt}_secs`]||0;
  
  const hasHours = timeHasHours(pbt);

  let html = `<h1 class="hl">${e(title)}</h1>
  <div class="wr-blocks" style="gap:8px; margin-top:24px; flex-wrap:nowrap; justify-content:center;">`;

  const btnStyle = "width:50px;height:50px;font-size:28px;border:none;background:#f3f6fa;border-radius:14px;user-select:none;-webkit-user-select:none;touch-action:manipulation;outline:none;";
  const attrs = (p, c, dir, mn, mx) => `onpointerdown="startAdj('${p}','${c}',${dir},${mn},${mx})" onpointerup="stopAdj()" onpointerleave="stopAdj()" onpointercancel="stopAdj()" oncontextmenu="return false;"`;

  if(hasHours) {
    html += `
    <div class="wr-block" style="flex:1; min-width:30%; flex-direction:column; padding:10px 4px; height:auto;">
      <div class="wr-label" style="margin-bottom:8px;font-size:13px;">${hLbl}</div>
      <div class="days-sel" style="width:100%; justify-content:space-between; gap:2px;">
        <button style="${btnStyle}" ${attrs(pbt,'hours',-1,0,24)}>−</button>
        <div><div class="days-big" style="font-size:30px;" id="td_${pbt}_hours">${h}</div></div>
        <button style="${btnStyle}" ${attrs(pbt,'hours',1,0,24)}>+</button>
      </div>
    </div>`;
  }
  
  html += `
    <div class="wr-block" style="flex:1; min-width:30%; flex-direction:column; padding:10px 4px; height:auto;">
      <div class="wr-label" style="margin-bottom:8px;font-size:13px;">${mLbl}</div>
      <div class="days-sel" style="width:100%; justify-content:space-between; gap:2px;">
        <button style="${btnStyle}" ${attrs(pbt,'mins',-1,0,59)}>−</button>
        <div><div class="days-big" style="font-size:30px;" id="td_${pbt}_mins">${String(m).padStart(2,'0')}</div></div>
        <button style="${btnStyle}" ${attrs(pbt,'mins',1,0,59)}>+</button>
      </div>
    </div>
    
    <div class="wr-block" style="flex:1; min-width:30%; flex-direction:column; padding:10px 4px; height:auto;">
      <div class="wr-label" style="margin-bottom:8px;font-size:13px;">${sLbl}</div>
      <div class="days-sel" style="width:100%; justify-content:space-between; gap:2px;">
        <button style="${btnStyle}" ${attrs(pbt,'secs',-5,0,55)}>−</button>
        <div><div class="days-big" style="font-size:30px;" id="td_${pbt}_secs">${String(s).padStart(2,'0')}</div></div>
        <button style="${btnStyle}" ${attrs(pbt,'secs',5,0,55)}>+</button>
      </div>
    </div>
  </div>`;

  html += `<div class="pace-display" id="td_disp_${pbt}" style="margin-top:24px; font-size:20px;">
    ${hasHours ? h+':' : ''}${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}
  </div>`;
  
  return html;
}

function timeHasHours(pbt) {
  const d = S.data.time_distance;
  const u = S.data.unit;
  const c = S.data.time_custom_dist || (u==='mi'?6.2:10);
  const is10kPlus = d==='10k' || d==='half' || d==='marathon' || (d === 'other' && ((u==='mi' && c>=6) || (u!=='mi' && c>=10)));
  const h = S.data[`time_${pbt}_hours`] || 0;
  return is10kPlus || h > 0;
}

let adjInt, adjTo;
function startAdj(pbt, component, dir, mn, mx) {
  stopAdj();
  timeAdj(pbt, component, dir, mn, mx);
  adjTo = setTimeout(() => {
    adjInt = setInterval(() => {
      timeAdj(pbt, component, dir, mn, mx);
    }, 70);
  }, 400);
}
function stopAdj() {
  clearTimeout(adjTo);
  clearInterval(adjInt);
}

function timeAdj(pbt, component, dir, mn, mx) {
  if (pbt === 'pb') S.data.time_pb_none = false;
  const key = `time_${pbt}_${component}`;
  const v = Math.max(mn, Math.min(mx, (S.data[key]||0)+dir));
  S.data[key] = v;
  const el = document.getElementById(`td_${pbt}_${component}`);
  if(el) el.textContent = component==='hours' ? v : String(v).padStart(2,'0');
  
  const h=S.data[`time_${pbt}_hours`]||0;
  const m=String(S.data[`time_${pbt}_mins`]||0).padStart(2,'0');
  const s=String(S.data[`time_${pbt}_secs`]||0).padStart(2,'0');
  const d=document.getElementById(`td_disp_${pbt}`);
  
  const hasHours = timeHasHours(pbt);
  if(d) d.textContent = hasHours ? `${h}:${m}:${s}` : `${m}:${s}`;
  
  const pbOk=S.data.time_pb_hours*3600+S.data.time_pb_mins*60+S.data.time_pb_secs;
  const tgOk=S.data.time_target_hours*3600+S.data.time_target_mins*60+S.data.time_target_secs;
  const errEl = document.getElementById('td_err_target');
  if(errEl) errEl.style.display = (pbOk>0 && tgOk>pbOk && pbt==='target') ? 'block' : 'none';

  const ctab=document.getElementById('ctab');
  if(ctab) ctab.disabled = cant(S.step === STEPS.findIndex(st=>st.id==='time_target') ? 'time_target' : '');
}

function bTimePb(){
  const lang=S.data.language||'en';
  if(!S.data.time_pb_hours)S.data.time_pb_hours=0;
  if(S.data.time_pb_mins===undefined||S.data.time_pb_mins===null)S.data.time_pb_mins=25;
  if(!S.data.time_pb_secs)S.data.time_pb_secs=0;
  const dStr = formatTimeDistTitle();
  const h={en:`What is your best time for ${dStr}?`,pl:`Ile wynosi Twój rekord na dystansie ${dStr} (PB)?`,fr:`Quel est ton meilleur temps sur ${dStr} ?`,es:`¿Cuál es tu mejor tiempo en ${dStr}?`,de:`Was ist deine Bestzeit über ${dStr}?`}[lang]||'Your best time';
  const noLbl = ({pl:'Nie mam rekordu / Pierwszy start',en:'I do not have a record yet',fr:"Je n'ai pas encore de record",es:'Todavía no tengo marca',de:'Ich habe noch keine Bestzeit'})[lang]||'I do not have a record yet';
  const noBtnHtml = `<div style="margin-top:24px; text-align:center;">
    <button class="cta-btn" style="background:#f3f6fa;color:#8A97AD;border:1px solid #d4deea;width:100%;font-size:18px;font-weight:700;" onclick="noTimePb()">${e(noLbl)}</button>
  </div>`;
  return renderTimeAdjUI('pb', h) + noBtnHtml;
}
function noTimePb() {
  S.data.time_pb_none = true;
  S.data.time_pb_hours = 0;
  S.data.time_pb_mins = 0;
  S.data.time_pb_secs = 0;
  next();
}

function bTimeTarget(){
  const lang=S.data.language||'en';
  if(!S.data.time_target_hours)S.data.time_target_hours=0;
  if(!S.data.time_target_mins)S.data.time_target_mins=23;
  if(!S.data.time_target_secs)S.data.time_target_secs=0;
  const dStr = formatTimeDistTitle();
  const h={en:`What time do you want to achieve for ${dStr}?`,pl:`W jaki czas celujesz na dystansie ${dStr}?`,fr:`Quel temps veux-tu atteindre sur ${dStr} ?`,es:`¿Qué tiempo quieres conseguir en ${dStr}?`,de:`Welche Zeit möchtest du über ${dStr} erreichen?`}[lang]||'Target time';
  const pbOk=S.data.time_pb_hours*3600+S.data.time_pb_mins*60+S.data.time_pb_secs;
  const tgOk=S.data.time_target_hours*3600+S.data.time_target_mins*60+S.data.time_target_secs;
  const err=pbOk>0&&tgOk>pbOk?`<div id="td_err_target" style="color:#ef4444;font-size:13px;margin-top:20px;text-align:center;font-weight:600;">${e(c('errtarget'))}</div>`:`<div id="td_err_target" style="display:none;color:#ef4444;font-size:13px;margin-top:20px;text-align:center;font-weight:600;">${e(c('errtarget'))}</div>`;
  return renderTimeAdjUI('target', h) + err;
}

function bTimeRace(){
  const lang=S.data.language||'en';
  const h={en:'Do you have a race planned?',pl:'Masz już zaplanowane zawody?',fr:'As-tu une course prévue ?',es:'¿Tienes una carrera planeada?',de:'Hast du ein Rennen geplant?'}[lang]||'Race planned?';
  return`<h1 class="hl">${e(h)}</h1>
<div class="clist">
  ${card(I.flag,c('raceyes'),'',S.data.time_has_race===true,"pickTimeRace(true)")}
  ${card(I.gt,c('raceno'),'',S.data.time_has_race===false,"pickTimeRace(false)")}
</div>`;
}
function pickTimeRace(v){S.data.time_has_race=v;setTimeout(next, 190);}

// ── CALENDAR ──
function bCalendar(dk,mk,yk,title,subtitle){
  const lang=S.data.language||'en';
  const months=c('months');const now=new Date();
  if(!S.data[mk])S.data[mk]=now.getMonth();
  if(!S.data[yk])S.data[yk]=now.getFullYear();
  const cm=S.data[mk],cy=S.data[yk];
  const first=new Date(cy,cm,1).getDay();const days=new Date(cy,cm+1,0).getDate();
  const sel=S.data[dk];
  let cells='';const startDay=(first+6)%7;
  for(let i=0;i<startDay;i++)cells+=`<div></div>`;
  for(let d=1;d<=days;d++){
    const iso=`${cy}-${String(cm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isSel=sel===iso;const isPast=new Date(cy,cm,d)<new Date();
    cells+=`<div class="cal-day${isSel?' sel':''}${isPast?' past':''}" data-iso="${iso}" onclick="${isPast?'':`pickDate('${dk}','${mk}','${yk}','${iso}', this)`}">${d}</div>`;
  }
  return`<h1 class="hl">${e(title)}</h1>
${subtitle?`<p class="sh">${e(subtitle)}</p>`:''}
<div class="cal" style="margin-top:${subtitle?'20px':'40px'};">
  <div class="cal-nav">
    <button class="cal-nav-btn" onclick="shiftCal('${mk}','${yk}',-1)">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>
    <div class="cal-month-yr">${months[cm]} ${cy}</div>
    <button class="cal-nav-btn" onclick="shiftCal('${mk}','${yk}',1)">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>
  </div>
  <div class="cal-head">${(CAL_SHORT[lang]||CAL_SHORT.en).map(d=>`<div>${d}</div>`).join('')}</div>
  <div class="cal-grid">${cells}</div>
</div>
${sel?`<div class="sel-date">${c('seldate')}: ${sel}</div>`:''}`;
}
function pickDate(dk,mk,yk,iso, el){
  S.data[dk]=iso;
  const cals = document.querySelectorAll('.cal-day');
  cals.forEach(c => c.classList.remove('sel'));
  if (el) el.classList.add('sel');
  const ctab=document.getElementById('ctab');
  if(ctab) ctab.disabled = cant(S.step === STEPS.findIndex(st=>st.id==='time_race_date'||st.id==='dist_race_date') ? STEPS[S.step].id : '');
}
function shiftCal(mk,yk,d){let m=S.data[mk]+d,y=S.data[yk];while(m<0){m+=12;y--;}while(m>11){m-=12;y++;}S.data[mk]=m;S.data[yk]=y;render(false);}
// ── DISTANCE GOAL ──
function bDistanceDist(){
  const lang=S.data.language||'en';
  const qh={en:'What distance do you want to achieve?',pl:'Jaki docelowy dystans chcesz osiągnąć?',fr:'Quelle distance veux-tu atteindre ?',es:'¿Qué distancia quieres lograr?',de:'Welche Distanz möchtest du erreichen?'}[lang]||'What distance do you want to achieve?';
  const opts=[['10k',c('dist10k')||'10k'],['half',c('disthalf')||'Half Marathon'],['marathon',c('distmarathon')||'Marathon'],['ultra','Ultramaraton 50km'],['other',c('distother')||'Other']];
  const cards=opts.map(([id,title])=>`<div class="cc ${S.data.distance_distance===id?'s':''}" onclick="pickDistanceDist('${id}')">
    <div class="ci">${I.gt}</div>
    <div class="cp"><div class="ct">${e(title)}</div></div>
    <svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  </div>`).join('');
  return`<h1 class="hl">${e(qh)}</h1><div class="clist" style="margin-top:16px">${cards}</div>
${S.data.distance_distance==='other'?`<div style="margin-top:24px">${picker(S.data.distance_custom_dist||10,1,200,1,'distance_custom_dist',S.data.unit==='mi'?'mi':'km')}</div>`:''}`;
}
function pickDistanceDist(id){
  if(id==='other'){
    S.data.distance_distance=id;
    render(false);
    setTimeout(() => {
      const scr = document.querySelector('#app');
      if (scr) scr.scrollTo({top: scr.scrollHeight, behavior: 'smooth'});
    }, 50);
  } else {
    S.data.distance_distance=id;
    const def={distance_pb_km:0,distance_pb_m:0};
    if(id==='10k'){def.distance_pb_km=5;}
    else if(id==='half'){def.distance_pb_km=10;}
    else if(id==='marathon'){def.distance_pb_km=20;}
    else if(id==='ultra'){def.distance_pb_km=30;}
    Object.assign(S.data,def);
    setTimeout(next,190);
  }
}

function renderDistanceAdjUI(pbt, title){
  const lang=S.data.language||'en';
  const isMi = S.data.unit === 'mi';
  const kmLbl=isMi?'mi':'km';
  const mLbl='m';
  
  const km=S.data[`distance_${pbt}_km`]||0;
  const m=S.data[`distance_${pbt}_m`]||0;
  
  let html = `<h1 class="hl">${e(title)}</h1>
  <div class="wr-blocks" style="gap:8px; margin-top:24px; flex-wrap:nowrap; justify-content:center;">`;

  const btnStyle = "width:60px;height:60px;font-size:32px;border:none;background:#f3f6fa;border-radius:16px;user-select:none;-webkit-user-select:none;touch-action:manipulation;outline:none;";
  const attrs = (p, c, dir, mn, mx) => `onpointerdown="startDistAdj('${p}','${c}',${dir},${mn},${mx})" onpointerup="stopDistAdj()" onpointerleave="stopDistAdj()" onpointercancel="stopDistAdj()" oncontextmenu="return false;"`;

  html += `
    <div class="wr-block" style="flex:1; flex-direction:column; padding:16px 8px; height:auto;">
      <div class="wr-label" style="margin-bottom:12px;font-size:14px;text-transform:uppercase;">${kmLbl}</div>
      <div class="days-sel" style="width:100%; justify-content:space-between; gap:2px;">
        <button style="${btnStyle}" ${attrs(pbt,'km',-1,0,250)}>−</button>
        <div><div class="days-big" style="font-size:36px;" id="dd_${pbt}_km">${km}</div></div>
        <button style="${btnStyle}" ${attrs(pbt,'km',1,0,250)}>+</button>
      </div>
    </div>`;
  
  if(!isMi) {
    html += `
    <div class="wr-block" style="flex:1; flex-direction:column; padding:16px 8px; height:auto;">
      <div class="wr-label" style="margin-bottom:12px;font-size:14px;text-transform:uppercase;">${mLbl}</div>
      <div class="days-sel" style="width:100%; justify-content:space-between; gap:2px;">
        <button style="${btnStyle}" ${attrs(pbt,'m',-100,0,900)}>−</button>
        <div><div class="days-big" style="font-size:36px;" id="dd_${pbt}_m">${m}</div></div>
        <button style="${btnStyle}" ${attrs(pbt,'m',100,0,900)}>+</button>
      </div>
    </div>`;
  }
  
  html += `</div>`;
  html += `<div class="pace-display" id="dd_disp_${pbt}" style="margin-top:24px; font-size:20px;">
    ${km}${!isMi && m>0 ? '.'+String(m/100) : ''} ${kmLbl}
  </div>`;
  
  return html;
}

let distAdjInt, distAdjTo;
function startDistAdj(pbt, component, dir, mn, mx) {
  stopDistAdj();
  distAdj(pbt, component, dir, mn, mx);
  distAdjTo = setTimeout(() => {
    distAdjInt = setInterval(() => {
      distAdj(pbt, component, dir, mn, mx);
    }, 70);
  }, 400);
}
function stopDistAdj() {
  clearTimeout(distAdjTo);
  clearInterval(distAdjInt);
}

function distAdj(pbt, component, dir, mn, mx) {
  if (pbt === 'pb') S.data.distance_pb_none = false;
  const key = `distance_${pbt}_${component}`;
  const v = Math.max(mn, Math.min(mx, (S.data[key]||0)+dir));
  S.data[key] = v;
  const el = document.getElementById(`dd_${pbt}_${component}`);
  if(el) el.textContent = v;
  
  const km=S.data[`distance_${pbt}_km`]||0;
  const m=S.data[`distance_${pbt}_m`]||0;
  const d=document.getElementById(`dd_disp_${pbt}`);
  
  const isMi = S.data.unit === 'mi';
  if(d) d.textContent = `${km}${!isMi && m>0 ? '.'+String(m/100) : ''} ${isMi?'mi':'km'}`;
  
  const ctab=document.getElementById('ctab');
  if(ctab) ctab.disabled = cant(S.step === STEPS.findIndex(st=>st.id==='distance_target') ? 'distance_target' : '');
}

function bDistancePb(){
  const lang=S.data.language||'en';
  if(S.data.distance_pb_km===undefined||S.data.distance_pb_km===null)S.data.distance_pb_km=5;
  if(S.data.distance_pb_m===undefined||S.data.distance_pb_m===null)S.data.distance_pb_m=0;
  
  const h={en:`What is your longest run so far?`,pl:`Jaki jest Twój najdłuższy dotychczasowy bieg?`,fr:`Quelle est ta plus longue course à ce jour ?`,es:`¿Cuál es tu carrera más larga hasta ahora?`,de:`Was ist dein bisher längster Lauf?`}[lang]||'Your longest run';
  const noLbl = ({pl:'Jeszcze nie biegałem',en:'I have not run yet',fr:"Je n'ai pas encore couru",es:'Todavía no he corrido',de:'Ich bin noch nicht gelaufen'})[lang]||'I have not run yet';
  const noBtnHtml = `<div style="margin-top:24px; text-align:center;">
    <button class="cta-btn" style="background:#f3f6fa;color:#8A97AD;border:1px solid #d4deea;width:100%;font-size:18px;font-weight:700;" onclick="noDistPb()">${e(noLbl)}</button>
  </div>`;
  return renderDistanceAdjUI('pb', h) + noBtnHtml;
}
function noDistPb() {
  S.data.distance_pb_none = true;
  S.data.distance_pb_km = 0;
  S.data.distance_pb_m = 0;
  next();
}

function bDistanceRace(){
  const lang=S.data.language||'en';
  const h={en:'Do you have a race planned?',pl:'Masz już zaplanowane zawody?',fr:'As-tu une course prévue ?',es:'¿Tienes una carrera planeada?',de:'Hast du ein Rennen geplant?'}[lang]||'Race planned?';
  return`<h1 class="hl">${e(h)}</h1>
<div class="clist">
  ${card(I.flag,c('raceyes'),'',S.data.distance_has_race===true,"pickDistanceRace(true)")}
  ${card(I.gt,c('raceno'),'',S.data.distance_has_race===false,"pickDistanceRace(false)")}
</div>`;
}
function pickDistanceRace(v){S.data.distance_has_race=v;setTimeout(next, 190);}


// ── COMEBACK ──
function bComebackReason(){
  return`<h1 class="hl">${e(c('qcbreason'))}</h1>
<div class="clist" style="margin-top:8px">
  ${card(I.inj,c('cbinj'),c('cbinjs'),S.data.comeback_reason==='injury',"setCbReason('injury')")}
  ${card(I.life,c('cblife'),c('cblifes'),S.data.comeback_reason==='burnout',"setCbReason('burnout')")}
</div>`;
}
function setCbReason(v){S.data.comeback_reason=v;setTimeout(next,190);}

function bInjuryDetails(){
  const hd = c('qcbdetails')||'Injury details';
  const w1 = c('qcbd_where')||'Where...';
  const p1 = c('qcbd_where_ph')||'e.g. left knee';
  const w2 = c('qcbd_what')||'What...';
  const p2 = c('qcbd_what_ph')||'e.g. sprain';
  const w3 = c('qcbd_notes')||'Notes';
  const p3 = c('qcbd_notes_ph')||'...';

  return`<div style="display:flex;flex-direction:column;height:100%;padding-bottom:12px;">
<h1 class="hl" style="flex-shrink:0;">${e(hd)}</h1>
<div style="flex:1; display:flex; flex-direction:column; margin-top:8px; background:#FDFBF7; border: 1.5px solid #D8D2C4; border-radius: 18px; padding: 20px;">
  <label style="display:block;font-size:13.5px;font-weight:700;margin-bottom:8px;color:var(--navy);letter-spacing:0.02em;flex-shrink:0;">${e(w1)}</label>
  <input class="txt" style="margin-bottom:24px;background:#fff;flex-shrink:0;" placeholder="${e(p1)}" value="${e(S.data.comeback_injury_area||'')}" oninput="setCbDet('comeback_injury_area',this.value)">
  
  <label style="display:block;font-size:13.5px;font-weight:700;margin-bottom:8px;color:var(--navy);letter-spacing:0.02em;flex-shrink:0;">${e(w2)}</label>
  <input class="txt" style="margin-bottom:24px;background:#fff;flex-shrink:0;" placeholder="${e(p2)}" value="${e(S.data.comeback_injury_type||'')}" oninput="setCbDet('comeback_injury_type',this.value)">

  <label style="display:block;font-size:13.5px;font-weight:700;margin-bottom:8px;color:var(--navy);letter-spacing:0.02em;flex-shrink:0;">${e(w3)}</label>
  <textarea class="txt" style="background:#fff; flex:1; min-height:220px; resize:none;" placeholder="${e(p3)}" oninput="setCbDet('comeback_injury_notes',this.value)">${e(S.data.comeback_injury_notes||'')}</textarea>
</div>
</div>`;
}

function setCbDet(key,val){
  S.data[key]=val;
  const ctab=document.getElementById('ctab');
  if(ctab)ctab.disabled=cant('comeback_injury_details');
}

function bSeverity(){
  const sevs=c('cbsev');const sevsl=c('cbsevs');
  return`<h1 class="hl" style="font-size:32px;line-height:1.15;margin-bottom:16px">${e(c('qcbsev'))}</h1>
<div class="clist">${[1,2,3,4,5].map((v,i)=>card(I.inj,sevs[i],sevsl[i],S.data.comeback_severity===v,`pickSev(${v})`)).join('')}</div>`;
}
function pickSev(v){S.data.comeback_severity=v;setTimeout(next,190);}

function bComebackRec(){
  const pcts=['0%','25%','50%','75%','100%'];
  return`<h1 class="hl" style="font-size:32px;line-height:1.15;margin-bottom:16px">${e(c('qcbrec'))}</h1>
<div class="clist">${pcts.map(p=>card(I.gh,p,'',S.data.comeback_recovery===p,`pickRec('${p}')`)).join('')}</div>`;
}
function pickRec(v){S.data.comeback_recovery=v;setTimeout(next,190);}

function bLastTrain(){
  const opts=c('cblast')||['< 1 month','1-3 months','3-6 months','> 1 year'];
  return`<h1 class="hl">${e(c('qcblast'))}</h1>
<div class="clist" style="margin-top:24px">${opts.map(o=>card(I.gt,o,'',S.data.comeback_last_train===o,`pickLastTrain('${o}')`)).join('')}</div>`;
}
function pickLastTrain(v){S.data.comeback_last_train=v;setTimeout(next,190);}

// ── PROFILE ──
function bProfileGender(){
  const lang=S.data.language||'en';
  const h={en:'What is your gender?',pl:'Jaka jest Twoja płeć?',fr:'Quel est ton genre ?',es:'¿Cuál es tu género?',de:'Was ist dein Geschlecht?'}[lang]||"What is your gender?";
  const sub={en:'Used to calibrate your recovery time and training load.',pl:'Służy do kalibracji czasu regeneracji i obciążenia treningowego.',fr:'Pour calibrer ta récupération et ta charge.',es:'Para calibrar tu recuperación y carga.',de:'Zur Kalibrierung von Erholung und Trainingsbelastung.'}[lang]||'';
  return`<h1 class="hl">${e(h)}</h1><p class="sh">${e(sub)}</p>
<div class="clist" style="margin-top:32px;">
  ${card(I.male,c('male'),'',S.data.gender==='male',"pickGender('male')")}
  ${card(I.female,c('female'),'',S.data.gender==='female',"pickGender('female')")}
  ${card(I.chk,c('gender_other'),'',S.data.gender==='other',"pickGender('other')")}
</div>`;
}
function pickGender(v){S.data.gender=v;setTimeout(next,190);}

function bDob(){
  const lang=S.data.language||'en';
  const h={en:'When is your birthday?',pl:'Kiedy masz urodziny?',fr:'Quelle est ta date de naissance ?',es:'¿Cuándo es tu cumpleaños?',de:'Wann hast du Geburtstag?'}[lang]||"When is your birthday?";
  if(!S.data.dob_d)S.data.dob_d=15;
  if(!S.data.dob_m)S.data.dob_m=c('months')[6];
  if(!S.data.dob_y)S.data.dob_y=2000;
  return`<h1 class="hl">${e(h)}</h1>
<div class="pk-row" style="margin-top:64px; padding: 0 16px;">
  ${picker(S.data.dob_d,1,31,1,'dob_d','')}
  <div style="flex:1.5">${pickerStr('dob_m',c('months'),S.data.dob_m).replace('<div class="pk-col-wrap">','<div class="pk-col-wrap" style="flex:1.5">')}</div>
  ${picker(S.data.dob_y,1940,2012,1,'dob_y','')}
</div>`;
}

// ── AVAILABILITY ──
function bAvailability(){
  const sh=c('wdays');const need=S.data.daysPerWeek;const sel=S.data.selectedDays;
  const diff=need-sel.length;
  const msg=sel.length===0?c('selectdays'):diff===0?c('perfectdist'):diff>0?`${c('select')} ${diff} ${diff===1?c('day'):c('days')}`:`${c('remove')} ${Math.abs(diff)} ${Math.abs(diff)===1?c('day'):c('days')}`;
  return`<h1 class="hl">${e(c('qdays')).replace('\n','<br>')}</h1>
<div class="days-sel">
  <button class="round-btn" onclick="availDaySpin(-1)">−</button>
  <div><div class="days-big" id="avail_days_big">${need}</div><div class="days-lbl">${c('daysweek')}</div></div>
  <button class="round-btn" onclick="availDaySpin(1)">+</button>
</div>
<div class="day-dots-top">${WDAYS.slice(0,4).map((d,i)=>`<button class="day-dot ${sel.includes(d)?'on':''}" id="day_${d}" onclick="toggleDay('${d}')">${sh[i]||d.slice(0,2)}</button>`).join('')}</div>
<div class="day-dots-bot">${WDAYS.slice(4).map((d,i)=>`<button class="day-dot ${sel.includes(d)?'on':''}" id="day_${d}" onclick="toggleDay('${d}')">${sh[i+4]||d.slice(0,2)}</button>`).join('')}</div>
<div class="status-bar" id="avail_status" style="margin-top:12px">${e(msg)}</div>`;
}

function availDaySpin(dir){
  const nv = Math.max(1, Math.min(7, S.data.daysPerWeek + dir));
  S.data.daysPerWeek = nv;
  const d = document.getElementById('avail_days_big');
  if(d) d.textContent = nv;
  updateAvailStatus();
}

function toggleDay(d){
  let a=[...S.data.selectedDays];
  if(a.includes(d)){
    a=a.filter(x=>x!==d);
    document.getElementById('day_'+d).classList.remove('on');
  }else{
    a.push(d);
    document.getElementById('day_'+d).classList.add('on');
  }
  S.data.selectedDays=a;
  updateAvailStatus();
}

function updateAvailStatus(){
  const need=S.data.daysPerWeek;const sel=S.data.selectedDays;
  const diff=need-sel.length;
  const msg=sel.length===0?c('selectdays'):diff===0?c('perfectdist'):diff>0?`${c('select')} ${diff} ${diff===1?c('day'):c('days')}`:`${c('remove')} ${Math.abs(diff)} ${Math.abs(diff)===1?c('day'):c('days')}`;
  const st=document.getElementById('avail_status');if(st)st.textContent=msg;
  const ctab=document.getElementById('ctab');if(ctab)ctab.disabled=cant('availability');
}

// ── READY — podsumowanie WSZYSTKICH odpowiedzi z onboardingu ──
// Wiersze budują się z S.data lustrzanie do rozgałęzień STEPS:
// inna ścieżka = inne pozycje (pokazujemy tylko to, co user wypełnił).
function bReady(){
  const lang=S.data.language||'en';
  const L = READY_LABELS[lang] || READY_LABELS.en;
  const d=S.data;
  const u=d.unit==='mi'?'mi':'km';
  const wd=c('wdays');
  const selShort=(d.selectedDays||[]).map(n=>{const i=WDAYS.indexOf(n);return i>=0?(wd[i]||n.slice(0,2)):n;});
  const DIST={'5k':'5 km','10k':'10 km','half':L.half,'marathon':L.marathon,'ultra50':'Ultra 50 km','ultra':'Ultra 50 km'};
  const fmtT=(h,m,s)=>{const p=[];if(h)p.push(h);p.push(String(m??0).padStart(h?2:1,'0'));p.push(String(s??0).padStart(2,'0'));return p.join(':');};
  const rows=[];
  const add=(lb,vl,small)=>{if(vl!==null&&vl!==undefined&&vl!=='')rows.push({lb,vl:String(vl),small:small||''});};

  add(L.goal, cg(d.goalId||'start').title||'');
  if(d.goalId==='time'){
    add(L.dist, DIST[d.time_distance]||(d.time_custom_dist?d.time_custom_dist+' '+u:null));
    if(d.time_pb_hours!=null||d.time_pb_mins!=null)add(L.pb,fmtT(d.time_pb_hours,d.time_pb_mins,d.time_pb_secs));
    if(d.time_target_hours!=null||d.time_target_mins!=null)add(L.target,fmtT(d.time_target_hours,d.time_target_mins,d.time_target_secs));
    if(d.time_has_race&&d.time_goal_date)add(L.raceDate,d.time_goal_date);
  }
  if(d.goalId==='distance'){
    add(L.dist, DIST[d.endurance_dist]||(d.customDist?d.customDist+' '+u:null));
    if(d.dist_longest_run!=null)add(L.longest,d.dist_longest_run+' '+u);
    if(d.dist_has_race&&d.dist_goal_date)add(L.raceDate,d.dist_goal_date);
  }
  if(d.goalId==='health'){
    add(L.form,{walkrun:L.twalkrun,easy:L.teasy,mixed:L.tmixed}[d.health_train_type]||null);
    if(d.health_weekly_km)add(L.vol,d.health_weekly_km+' '+u,L.perWeek);
  }
  if(d.goalId==='walkrun'){
    add(L.intervals,L.run+' '+d.walkrun_run_min+' min / '+L.walk+' '+d.walkrun_walk_min+' min × '+d.walkrun_series);
  }
  if(d.goalId==='comeback'){
    add(L.comeback,{injury:L.cbInjury,illness:L.cbIllness}[d.comeback_reason]||L.cbBreak);
    if(d.comeback_train_type)add(L.form,{walkrun:L.twalkrun,easy:L.teasy,mixed:L.tmixed}[d.comeback_train_type]||null);
  }
  if(d.goalId==='start'&&d.run_15min!=null)add(L.run15,d.run_15min?L.yes:L.notYet);
  add(L.level, d.goal_category==='advanced'?L.adv:L.beg);
  if(d.daysPerWeek)add(L.days, d.daysPerWeek+' '+L.daysWk, selShort.join(', '));
  if(d.current_weekly_mileage!=null)add(L.mileage,d.current_weekly_mileage+' '+u,L.perWeek);
  if(d.age)add(L.age,d.age+' '+L.years);
  if(d.weight)add(L.weight,d.weight+(d.unit==='mi'?' lb':' kg'));
  if(d.height)add(L.height,d.height+(d.unit==='mi'?' in':' cm'));

  return`<h1 class="hl">${e(c('qready'))}</h1>
<p class="sh">${e(c('qreadymsg'))}</p>
<div class="sum-card">
${rows.map(r=>`<div class="sum-row"><span class="sum-lb">${e(r.lb)}</span><span class="sum-vl">${e(r.vl)}${r.small?` <small>${e(r.small)}</small>`:''}</span></div>`).join('')}
</div>`;
}

// ── PICKER HELPERS ──
function pickerStr(key, options, current){
  const selIdx=Math.max(0,options.indexOf(current));
  const pid='pk_'+(++_spinId)+'_'+key;
  if(S.data[key]===undefined)S.data[key]=current;
  const items=[...Array(PK_PAD).fill(null),...options,...Array(PK_PAD).fill(null)].map((v,i)=>{
    if(v===null)return'<div class="pk-item pk-pad"></div>';
    const dist=Math.abs((i-PK_PAD)-selIdx);
    const cls=dist===0?'sel':dist===1?'near1':dist===2?'near2':'far';
    return`<div class="pk-item ${cls}">${v}</div>`;
  }).join('');
  return`<div class="pk-col-wrap"><div class="pk-highlight"></div><div class="pk-col" id="${pid}" data-key="${key}" data-options="${encodeURIComponent(JSON.stringify(options))}" data-type="str" onscroll="onPkScrollStr(this)" data-init="${selIdx*PK_H}">${items}</div></div>`;
}
function onPkScrollStr(el){
  const options=JSON.parse(decodeURIComponent(el.dataset.options));
  const containerH=el.offsetHeight||260;const offset=containerH/2-PK_H/2;
  const idx=Math.max(0,Math.min(options.length-1,Math.round((el.scrollTop+offset)/PK_H)-PK_PAD));
  el.querySelectorAll('.pk-item:not(.pk-pad)').forEach((item,i)=>{const d=Math.abs(i-idx);item.className='pk-item '+(d===0?'sel':d===1?'near1':d===2?'near2':'far');});
  S.data[el.dataset.key]=options[idx];
  const ctab=document.getElementById('ctab');if(ctab)ctab.disabled=cant(STEPS[S.step].id);
}

function e(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

// ═══ PICKER ENGINE ═══════════════════════════════════════════
const PK_H=52,PK_PAD=3;
let _spinId=0;
window._spinCBs={};

function picker(val,min,max,step,setKey,suf){
  suf=suf||'';step=step||1;
  if(S.data[setKey]===undefined||S.data[setKey]===null)S.data[setKey]=Number(val);
  val=Number(val);
  const values=[];for(let v=min;v<=max+0.0001;v+=step)values.push(+(v.toFixed(4)));
  const selIdx=Math.max(0,Math.min(values.length-1,Math.round((val-min)/step)));
  const pid='pk_'+(++_spinId)+'_'+setKey;
  const items=[...Array(PK_PAD).fill(null),...values,...Array(PK_PAD).fill(null)].map((v,i)=>{
    if(v===null)return'<div class="pk-item pk-pad"></div>';
    const dist=Math.abs((i-PK_PAD)-selIdx);
    const cls=dist===0?'sel':dist===1?'near1':dist===2?'near2':'far';
    return'<div class="pk-item '+cls+'">'+v+(suf?' '+suf:'')+'</div>';
  }).join('');
  return'<div class="pk-col-wrap"><div class="pk-highlight"></div><div class="pk-col" id="'+pid+'" data-key="'+setKey+'" data-min="'+min+'" data-max="'+max+'" data-step="'+step+'" data-suf="'+suf+'" onscroll="onPkScroll(this)" data-init="'+((selIdx+1)*PK_H)+'">'+items+'</div></div>';
}

function onPkScroll(el){
  const containerH=el.offsetHeight||260;const offset=containerH/2-PK_H/2;
  const idx=Math.round((el.scrollTop+offset)/PK_H)-PK_PAD;
  const min=parseFloat(el.dataset.min),step=parseFloat(el.dataset.step)||1,max=parseFloat(el.dataset.max);
  const clampedIdx=Math.max(0,Math.min(Math.round((max-min)/step),idx));
  const val=+(Math.min(max,Math.max(min,min+clampedIdx*step)).toFixed(4));
  el.querySelectorAll('.pk-item:not(.pk-pad)').forEach((item,i)=>{const d=Math.abs(i-clampedIdx);item.className='pk-item '+(d===0?'sel':d===1?'near1':d===2?'near2':'far');});
  S.data[el.dataset.key]=val;
  if(el.dataset.key==='height_ft'||el.dataset.key==='height_in'){S.data.height=(S.data.height_ft||5)*12+(S.data.height_in||0);}
  const pd=document.getElementById('pace-display');
  if(pd){const mk=pd.dataset.mkey,sk=pd.dataset.skey,pu=pd.dataset.pu;if(mk&&sk)pd.textContent=(S.data[mk]||0)+':'+String(Math.round(S.data[sk]||0)).padStart(2,'0')+' '+pu;}
  const ctab=document.getElementById('ctab');if(ctab)ctab.disabled=cant(STEPS[S.step].id);
}

function initPickers(){
  document.querySelectorAll('.pk-col').forEach(el=>{
    el.style.scrollBehavior='auto';
    el.scrollTop=parseInt(el.dataset.init||0);
    setTimeout(()=>{el.style.scrollBehavior='';},50);
  });
}

let HOLD_T=null,HOLD_I=null;
function spinStop(){if(HOLD_T){clearTimeout(HOLD_T);HOLD_T=null;}if(HOLD_I){clearInterval(HOLD_I);HOLD_I=null;}}
window.addEventListener('pointerup',spinStop);
window.addEventListener('pointercancel',spinStop);
window.addEventListener('blur',spinStop);

// ─── AUTH ─────────────────────────────────────────────────────
function isLocalHostLike(hostname) {
  if (!hostname) return true;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
  return /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname);
}

const API_BASE = isLocalHostLike(window.location.hostname)
  ? 'http://' + (window.location.hostname || 'localhost') + ':3000'
  : 'https://velm-backend-production.up.railway.app';

function showAuthScreen() {
  const overlay = document.getElementById('auth-overlay');
  overlay.style.display = 'flex';
  _renderAuthChoice();
}

// Multi-language auth strings — keyed off S.data.language (set by language picker)
const AUTH_T = {
  pl: { title:'Zacznij trenować', subtitle:'Utwórz konto lub zaloguj się do istniejącego.', create:'Utwórz konto', haveAccount:'Mam już konto',
        regTitle:'Utwórz konto', regSubtitle:'Podaj email i hasło — użyjesz ich do logowania.',
        namePh:'Imię i nazwisko', errName:'Wpisz swoje imię', emailPh:'Twój email', pwdPh:'Hasło (min. 8 znaków)', pwd2Ph:'Powtórz hasło', next:'Dalej →',
        loginTitle:'Zaloguj się', loginSubtitle:'Wpisz dane konta, którym się rejestrowałeś', loginPwdPh:'Hasło', loginBtn:'Zaloguj', back:'← Wróć',
        forgot:'Zapomniałeś hasła?', resetTitle:'Reset hasła', resetSubtitle:'Wyślemy link do resetu na podany adres email.', resetBtn:'Wyślij link', resetSent:'Jeśli konto istnieje, wysłaliśmy instrukcje na podany adres email.',
        errEmail:'Wpisz prawidłowy adres email', errPwd:'Hasło musi mieć min. 8 znaków', errMatch:'Hasła nie są zgodne',
        errPwdEmpty:'Wpisz hasło', loginLoading:'Logowanie…', errBadCreds:'Nieprawidłowy email lub hasło',
        errNoServer:'Serwer nie odpowiada — sprawdź połączenie', errConn:'Błąd połączenia: ', errServer:'Błąd serwera', errConnServer:'Błąd połączenia z serwerem',
        pmTitle:'Utwórz hasło', pmSub:'Będziesz go używać przy następnym logowaniu', pmBtn:'Utwórz konto i wygeneruj plan', pmLoading:'Generuję plan…',
        errDup:'Konto z tym emailem już istnieje. Zaloguj się, by kontynuować.', errTimeout:'Połączenie trwało zbyt długo. Sprawdź internet i spróbuj ponownie.',
        errOffline:'Brak połączenia z serwerem ({err}). Sprawdź internet i spróbuj ponownie.', errUnknown:'nieznany błąd', errServerCode:'Błąd serwera ({code})' },
  en: { title:'Start training', subtitle:'Create an account or sign in to an existing one.', create:'Create account', haveAccount:'I have an account',
        regTitle:'Create account', regSubtitle:'Enter email and password — you\'ll use them to sign in.',
        namePh:'Full name', errName:'Enter your name', emailPh:'Your email', pwdPh:'Password (min. 8 chars)', pwd2Ph:'Repeat password', next:'Next →',
        loginTitle:'Sign in', loginSubtitle:'Enter the account details you registered with', loginPwdPh:'Password', loginBtn:'Sign in', back:'← Back',
        forgot:'Forgot password?', resetTitle:'Reset password', resetSubtitle:'We\'ll send a reset link to your email.', resetBtn:'Send link', resetSent:'If an account exists, we\'ve sent reset instructions to your email.',
        errEmail:'Enter a valid email address', errPwd:'Password must be at least 8 characters', errMatch:'Passwords don\'t match',
        errPwdEmpty:'Enter your password', loginLoading:'Signing in…', errBadCreds:'Incorrect email or password',
        errNoServer:'The server is not responding — check your connection', errConn:'Connection error: ', errServer:'Server error', errConnServer:'Could not reach the server',
        pmTitle:'Create a password', pmSub:'You\'ll use it the next time you sign in', pmBtn:'Create account and build my plan', pmLoading:'Building your plan…',
        errDup:'An account with this email already exists. Sign in to continue.', errTimeout:'The connection took too long. Check your internet and try again.',
        errOffline:'Could not reach the server ({err}). Check your internet and try again.', errUnknown:'unknown error', errServerCode:'Server error ({code})' },
  fr: { title:'Commencer à courir', subtitle:'Crée un compte ou connecte-toi à un compte existant.', create:'Créer un compte', haveAccount:'J\'ai déjà un compte',
        regTitle:'Créer un compte', regSubtitle:'Saisis ton email et ton mot de passe — tu les utiliseras pour te connecter.',
        namePh:'Nom et prénom', errName:'Saisis ton nom', emailPh:'Ton email', pwdPh:'Mot de passe (min. 8 car.)', pwd2Ph:'Répéter le mot de passe', next:'Suivant →',
        loginTitle:'Se connecter', loginSubtitle:'Saisis les identifiants de ton compte', loginPwdPh:'Mot de passe', loginBtn:'Se connecter', back:'← Retour',
        forgot:'Mot de passe oublié ?', resetTitle:'Réinitialiser le mot de passe', resetSubtitle:'On envoie un lien de réinitialisation à ton adresse email.', resetBtn:'Envoyer le lien', resetSent:'Si un compte existe, on a envoyé les instructions à cette adresse email.',
        errEmail:'Saisis une adresse email valide', errPwd:'Le mot de passe doit comporter au moins 8 caractères', errMatch:'Les mots de passe ne correspondent pas',
        errPwdEmpty:'Saisis ton mot de passe', loginLoading:'Connexion…', errBadCreds:'Email ou mot de passe incorrect',
        errNoServer:'Le serveur ne répond pas — vérifie ta connexion', errConn:'Erreur de connexion : ', errServer:'Erreur du serveur', errConnServer:'Impossible de joindre le serveur',
        pmTitle:'Crée un mot de passe', pmSub:'Tu l\'utiliseras lors de ta prochaine connexion', pmBtn:'Créer le compte et générer mon plan', pmLoading:'Génération du plan…',
        errDup:'Un compte avec cet email existe déjà. Connecte-toi pour continuer.', errTimeout:'La connexion a pris trop de temps. Vérifie ton internet et réessaie.',
        errOffline:'Impossible de joindre le serveur ({err}). Vérifie ton internet et réessaie.', errUnknown:'erreur inconnue', errServerCode:'Erreur du serveur ({code})' },
  es: { title:'Empieza a entrenar', subtitle:'Crea una cuenta o inicia sesión en una existente.', create:'Crear cuenta', haveAccount:'Ya tengo cuenta',
        regTitle:'Crear cuenta', regSubtitle:'Introduce email y contraseña — los usarás para iniciar sesión.',
        namePh:'Nombre y apellido', errName:'Introduce tu nombre', emailPh:'Tu email', pwdPh:'Contraseña (mín. 8 caracteres)', pwd2Ph:'Repite la contraseña', next:'Siguiente →',
        loginTitle:'Iniciar sesión', loginSubtitle:'Introduce los datos con los que te registraste', loginPwdPh:'Contraseña', loginBtn:'Iniciar sesión', back:'← Atrás',
        forgot:'¿Olvidaste tu contraseña?', resetTitle:'Restablecer contraseña', resetSubtitle:'Te enviaremos un enlace de restablecimiento a tu email.', resetBtn:'Enviar enlace', resetSent:'Si la cuenta existe, hemos enviado las instrucciones a ese email.',
        errEmail:'Introduce un email válido', errPwd:'La contraseña debe tener al menos 8 caracteres', errMatch:'Las contraseñas no coinciden',
        errPwdEmpty:'Introduce tu contraseña', loginLoading:'Iniciando sesión…', errBadCreds:'Email o contraseña incorrectos',
        errNoServer:'El servidor no responde — comprueba tu conexión', errConn:'Error de conexión: ', errServer:'Error del servidor', errConnServer:'No se pudo conectar con el servidor',
        pmTitle:'Crea una contraseña', pmSub:'La usarás la próxima vez que inicies sesión', pmBtn:'Crear cuenta y generar mi plan', pmLoading:'Generando tu plan…',
        errDup:'Ya existe una cuenta con este email. Inicia sesión para continuar.', errTimeout:'La conexión tardó demasiado. Comprueba tu internet e inténtalo de nuevo.',
        errOffline:'No se pudo conectar con el servidor ({err}). Comprueba tu internet e inténtalo de nuevo.', errUnknown:'error desconocido', errServerCode:'Error del servidor ({code})' },
  de: { title:'Mit dem Training beginnen', subtitle:'Erstelle ein Konto oder melde dich bei einem bestehenden an.', create:'Konto erstellen', haveAccount:'Ich habe bereits ein Konto',
        regTitle:'Konto erstellen', regSubtitle:'Gib E-Mail und Passwort ein — damit meldest du dich an.',
        namePh:'Vor- und Nachname', errName:'Gib deinen Namen ein', emailPh:'Deine E-Mail', pwdPh:'Passwort (mind. 8 Zeichen)', pwd2Ph:'Passwort wiederholen', next:'Weiter →',
        loginTitle:'Anmelden', loginSubtitle:'Gib deine Anmeldedaten ein', loginPwdPh:'Passwort', loginBtn:'Anmelden', back:'← Zurück',
        forgot:'Passwort vergessen?', resetTitle:'Passwort zurücksetzen', resetSubtitle:'Wir senden dir einen Link zum Zurücksetzen an deine E-Mail.', resetBtn:'Link senden', resetSent:'Falls ein Konto existiert, haben wir die Anleitung an diese E-Mail geschickt.',
        errEmail:'Gib eine gültige E-Mail-Adresse ein', errPwd:'Das Passwort muss mindestens 8 Zeichen lang sein', errMatch:'Passwörter stimmen nicht überein',
        errPwdEmpty:'Gib dein Passwort ein', loginLoading:'Anmeldung…', errBadCreds:'E-Mail oder Passwort ist falsch',
        errNoServer:'Der Server antwortet nicht — prüfe deine Verbindung', errConn:'Verbindungsfehler: ', errServer:'Serverfehler', errConnServer:'Server nicht erreichbar',
        pmTitle:'Erstelle ein Passwort', pmSub:'Damit meldest du dich beim nächsten Mal an', pmBtn:'Konto erstellen und Plan generieren', pmLoading:'Dein Plan wird erstellt…',
        errDup:'Ein Konto mit dieser E-Mail existiert bereits. Melde dich an, um fortzufahren.', errTimeout:'Die Verbindung hat zu lange gedauert. Prüfe dein Internet und versuche es erneut.',
        errOffline:'Server nicht erreichbar ({err}). Prüfe dein Internet und versuche es erneut.', errUnknown:'unbekannter Fehler', errServerCode:'Serverfehler ({code})' }
};
function _authT() { return AUTH_T[S.data.language] || AUTH_T.en; }

function _renderAuthChoice() {
  const t = _authT();
  document.getElementById('auth-card').innerHTML = `
    <h2 style="font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:20px;color:#111;margin-bottom:6px;">${t.title}</h2>
    <p style="font-size:13px;color:#5C6B85;line-height:1.5;margin-bottom:22px;">${t.subtitle}</p>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <button class="btn-p" onclick="showRegisterForm()">${t.create}</button>
      <button onclick="showLoginForm()" style="width:100%;padding:17px;border-radius:99px;border:1.5px solid #D8D2C4;background:transparent;color:#111;font-family:var(--font);font-size:16px;font-weight:600;cursor:pointer;transition:all .18s;">${t.haveAccount}</button>
    </div>`;
}

function showRegisterForm() {
  const t = _authT();
  document.getElementById('auth-card').innerHTML = `
    <h2 style="font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:20px;color:#111;margin-bottom:6px;">${t.regTitle}</h2>
    <p style="font-size:13px;color:#5C6B85;line-height:1.5;margin-bottom:22px;">${t.regSubtitle}</p>
    <input class="auth-inp" id="reg-name" type="text" placeholder="${t.namePh}" autocomplete="name" onkeydown="if(event.key==='Enter')document.getElementById('reg-email').focus()"/>
    <input class="auth-inp" id="reg-email" type="email" placeholder="${t.emailPh}" autocomplete="email" onkeydown="if(event.key==='Enter')document.getElementById('reg-pwd').focus()"/>
    <input class="auth-inp" id="reg-pwd" type="password" placeholder="${t.pwdPh}" autocomplete="new-password" onkeydown="if(event.key==='Enter')document.getElementById('reg-pwd2').focus()"/>
    <input class="auth-inp" id="reg-pwd2" type="password" placeholder="${t.pwd2Ph}" autocomplete="new-password" onkeydown="if(event.key==='Enter')_confirmRegister()"/>
    <button class="btn-p" id="reg-btn" onclick="_confirmRegister()" style="margin-top:4px;">${t.next}</button>
    <div class="auth-err" id="reg-err"></div>
    <span class="auth-link" onclick="_renderAuthChoice()">${t.back}</span>`;
  document.getElementById('reg-name').focus();
}

function _confirmRegister() {
  const t = _authT();
  const name  = document.getElementById('reg-name')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim();
  const p1    = document.getElementById('reg-pwd')?.value;
  const p2    = document.getElementById('reg-pwd2')?.value;
  const err   = document.getElementById('reg-err');
  const btn   = document.getElementById('reg-btn');
  err.textContent = '';
  if (!name)                         { err.textContent = t.errName;  return; }
  if (!email || !email.includes('@')) { err.textContent = t.errEmail; return; }
  if (p1.length < 8) { err.textContent = t.errPwd; return; }
  if (p1 !== p2)     { err.textContent = t.errMatch; return; }
  btn.disabled = true;
  S.data.name     = name;
  S.data.email    = email;
  S.data.password = p1;
  _startOnboarding();
}

function showLoginForm() {
  const t = _authT();
  document.getElementById('auth-card').innerHTML = `
    <h2>${t.loginTitle}</h2>
    <p>${t.loginSubtitle}</p>
    <input class="auth-inp" id="li-email" type="email" placeholder="${t.emailPh}" autocomplete="email" onkeydown="if(event.key==='Enter')document.getElementById('li-pwd').focus()"/>
    <input class="auth-inp" id="li-pwd" type="password" placeholder="${t.loginPwdPh}" autocomplete="current-password" onkeydown="if(event.key==='Enter')handleLogin()"/>
    <button class="btn-p" id="li-btn" onclick="handleLogin()" style="margin-top:4px;">${t.loginBtn}</button>
    <div class="auth-err" id="li-err"></div>
    <span class="auth-link" onclick="showPasswordResetForm()" style="display:block;margin-top:6px;font-size:13px;">${t.forgot}</span>
    <span class="auth-link" onclick="_renderAuthChoice()">${t.back}</span>`;
  document.getElementById('li-email').focus();
}

function showPasswordResetForm() {
  const t = _authT();
  document.getElementById('auth-card').innerHTML = `
    <h2>${t.resetTitle}</h2>
    <p>${t.resetSubtitle}</p>
    <input class="auth-inp" id="pr-email" type="email" placeholder="${t.emailPh}" autocomplete="email" onkeydown="if(event.key==='Enter')handlePasswordResetRequest()"/>
    <button class="btn-p" id="pr-btn" onclick="handlePasswordResetRequest()" style="margin-top:4px;">${t.resetBtn}</button>
    <div class="auth-err" id="pr-err"></div>
    <div class="auth-ok" id="pr-ok" style="color:#2A7F4F;font-size:13px;line-height:1.45;margin-top:6px;display:none;"></div>
    <span class="auth-link" onclick="showLoginForm()">${t.back}</span>`;
  document.getElementById('pr-email').focus();
}

async function handlePasswordResetRequest() {
  const t = _authT();
  const emailEl = document.getElementById('pr-email');
  const errEl = document.getElementById('pr-err');
  const okEl = document.getElementById('pr-ok');
  const btn = document.getElementById('pr-btn');
  const email = emailEl?.value.trim();
  errEl.textContent = '';
  okEl.style.display = 'none';
  if (!email || !email.includes('@')) { errEl.textContent = t.errEmail; return; }
  btn.disabled = true; btn.textContent = '…';
  try {
    const res = await fetch(`${API_BASE}/api/password-reset/request`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email })
    });
    let data = {};
    try { data = await res.json(); } catch(e) {}
    if (res.ok) {
      okEl.textContent = t.resetSent;
      okEl.style.display = 'block';
      emailEl.disabled = true;
      btn.style.display = 'none';
    } else {
      errEl.textContent = data.error || t.errServer;
      btn.disabled = false; btn.textContent = t.resetBtn;
    }
  } catch (e) {
    errEl.textContent = t.errConnServer;
    btn.disabled = false; btn.textContent = t.resetBtn;
  }
}

async function handleLogin() {
  const t     = _authT();
  const email = document.getElementById('li-email')?.value.trim();
  const pwd   = document.getElementById('li-pwd')?.value;
  const errEl = document.getElementById('li-err');
  const btn   = document.getElementById('li-btn');
  errEl.textContent = '';

  if (!email || !email.includes('@')) { errEl.textContent = t.errEmail; return; }
  if (!pwd) { errEl.textContent = t.errPwdEmpty; return; }

  btn.disabled = true; btn.textContent = t.loginLoading;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res  = await fetch(`${API_BASE}/api/login`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password: pwd }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok || !data.success) {
      errEl.textContent = data.error || t.errBadCreds;
      btn.disabled = false; btn.textContent = t.loginBtn;
      return;
    }
    localStorage.setItem('velm_user_id', data.userId);
    if (data.accessToken || data.token) localStorage.setItem('velm_token', data.accessToken || data.token);
    if (data.refreshToken) localStorage.setItem('velm_refresh_token', data.refreshToken);
    if (data.name) localStorage.setItem('velm_user_name', data.name);
    const overlay = document.getElementById('auth-overlay');
    overlay.classList.add('out');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 380);
  } catch(e) {
    console.error('[LOGIN] Fetch error:', e);
    errEl.textContent = e.name === 'AbortError' ? t.errNoServer : t.errConn + e.message;
    btn.disabled = false; btn.textContent = t.loginBtn;
  }
}

function _startOnboarding() {
  const overlay = document.getElementById('auth-overlay');
  overlay.classList.add('out');
  setTimeout(() => { overlay.style.display = 'none'; }, 360);
}

// Password setup modal — shown before onboarding submit
function showPasswordSetup(onConfirm) {
  const t = _authT();
  const modal = document.createElement('div');
  modal.id = 'pwd-modal';
  modal.innerHTML = `
    <div class="pwd-card">
      <h2>${e(t.pmTitle)}</h2>
      <p>${e(t.pmSub)}</p>
      <input class="auth-inp" id="pm-pwd" type="password" placeholder="${e(t.pwdPh)}" autocomplete="new-password" onkeydown="if(event.key==='Enter')document.getElementById('pm-pwd2').focus()"/>
      <input class="auth-inp" id="pm-pwd2" type="password" placeholder="${e(t.pwd2Ph)}" autocomplete="new-password" onkeydown="if(event.key==='Enter')_confirmPwd()"/>
      <button class="btn-p" id="pm-btn" onclick="_confirmPwd()" style="margin-top:4px;">${e(t.pmBtn)}</button>
      <div class="auth-err" id="pm-err"></div>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById('pm-pwd').focus();
  window._pwdOnConfirm = onConfirm;
}

function _confirmPwd() {
  const t   = _authT();
  const p1  = document.getElementById('pm-pwd').value;
  const p2  = document.getElementById('pm-pwd2').value;
  const err = document.getElementById('pm-err');
  const btn = document.getElementById('pm-btn');
  err.textContent = '';
  if (p1.length < 8) { err.textContent = t.errPwd; return; }
  if (p1 !== p2)     { err.textContent = t.errMatch; return; }
  btn.disabled = true; btn.textContent = t.pmLoading;
  document.getElementById('pwd-modal').remove();
  window._pwdOnConfirm(p1);
}

// ─── INIT ─────────────────────────────────────────────────────
try{const sv=localStorage.getItem('velm_lang');if(sv&&C[sv]){S.data.language=sv;}else{const nav=(navigator.language||navigator.userLanguage||'en').slice(0,2).toLowerCase();if(C[nav])S.data.language=nav;}}catch(x){}
// Motywy kolorystyczne usunięte — apka ma jeden bazowy wygląd (czerń).
// Sprzątamy zapisany motyw ze starych sesji, żeby nic go nie wskrzesiło.
try{localStorage.removeItem('velm_theme');}catch(x){}

// Check login state
const _existingUserId = localStorage.getItem('velm_user_id');
if (_existingUserId) {
  // Already logged in → go directly to dashboard
  window.location.replace('dashboard.html');
} else {
  // Not logged in → show auth screen (onboarding hidden behind it)
  render(true);
  showAuthScreen();
}
