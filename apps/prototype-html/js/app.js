// ================================
// JAVASCRIPT: DADOS SIMULADOS
// ================================
// MOCK: dados fixos do pitch, não representam backend real.
const mockData={institutionType:'Instituto Federal',institution:'IFCE — Instituto Federal do Ceará',activeCampus:'IFCE Campus Maracanaú',route:'IFCE Campus Maracanaú ↔ Estação Virgílio Távora',tripStates:['AGENDADA','EM_ANDAMENTO','FINALIZADA','ATRASADA','CANCELADA'],locationStates:['ONLINE','SEM_SINAL','SINAL_INSTAVEL','ULTIMA_POSICAO_CONHECIDA'],vehicleStates:['DISPONIVEL','EM_MOVIMENTO','EM_MANUTENCAO','INDISPONIVEL']};
const state={screen:'welcome',history:['welcome'],profile:null,campus:null,visitor:false,countdown:18,access:{largeText:false,highContrast:false,reduceMotion:false,simpleLanguage:false}};
const screens=[...document.querySelectorAll('.screen')];
const topbarSubtitle=document.querySelector('#topbar-subtitle');
const bottomNav=document.querySelector('.bottom-nav');
const internalTabs=['home','schedules','location','events','accessibility'];

// ================================
// JAVASCRIPT: NAVEGAÇÃO
// ================================
function showScreen(id,addHistory=true){
  const target=document.getElementById(id); if(!target)return;
  screens.forEach(screen=>screen.classList.toggle('active',screen.id===id));
  state.screen=id; if(addHistory&&state.history.at(-1)!==id)state.history.push(id);
  topbarSubtitle.textContent=target.dataset.title||'MinhaJardineira';
  bottomNav.classList.toggle('visible',target.classList.contains('internal'));
  document.querySelector('[data-back]').style.visibility=id==='welcome'?'hidden':'visible';
  updateActiveTab(); target.scrollTop=0;
}
function goBack(){
  if(state.history.length<=1){showScreen('welcome',false);return;}
  state.history.pop(); showScreen(state.history.at(-1),false);
}
function updateActiveTab(){document.querySelectorAll('[data-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab===state.screen));}
function requireProfile(){if(!state.profile){flash('Escolha um perfil para continuar.');return false;}return true;}
function requireCampus(){if(!state.campus){document.querySelector('#campus-alert').textContent='Selecione IFCE Campus Maracanaú para continuar.';return false;}return true;}

// ================================
// JAVASCRIPT: ESTADOS VISUAIS
// ================================
function selectProfile(profile){state.profile=profile;document.querySelectorAll('[data-profile]').forEach(btn=>btn.classList.toggle('selected',btn.dataset.profile===profile));}
function selectCampus(campus){state.campus=campus;document.querySelectorAll('[data-campus]').forEach(btn=>btn.classList.toggle('selected',btn.dataset.campus===campus));document.querySelector('#campus-alert').textContent='';}
function enterApp(visitor=false){
  // FUTURO BACKEND: aqui entraria validação real de matrícula/e-mail institucional.
  state.visitor=visitor; document.querySelector('#home-title').textContent=visitor?'Olá, visitante!':'Olá, aluno!'; showScreen('home');
}
function flash(message){const alert=document.querySelector('#campus-alert'); if(alert){alert.textContent=message;setTimeout(()=>alert.textContent='',2200);}}
function updateCountdown(){document.querySelector('#countdown-minutes').textContent=state.countdown;}
setInterval(()=>{if(state.countdown>1)state.countdown-=1;updateCountdown();},60000);

// ================================
// JAVASCRIPT: ACESSIBILIDADE
// ================================
function toggleAccess(key){
  state.access[key]=!state.access[key];
  document.body.classList.toggle('large-text',state.access.largeText);
  document.body.classList.toggle('high-contrast',state.access.highContrast);
  document.body.classList.toggle('reduce-motion',state.access.reduceMotion);
  document.querySelectorAll(`[data-toggle-access="${key}"]`).forEach(btn=>btn.classList.toggle('selected',state.access[key]));
  document.querySelectorAll('.toggle-list [data-toggle-access]').forEach(btn=>{const active=state.access[btn.dataset.toggleAccess];btn.querySelector('span').textContent=active?'ativado':'desativado';btn.classList.toggle('selected',active);});
  const simple='Não estamos recebendo a localização da jardineira agora. Mostrando a última posição conhecida.';
  document.querySelector('#simple-example').textContent=state.access.simpleLanguage?simple:'SEM_SINAL';
  document.querySelector('[data-simple-status]').textContent=state.access.simpleLanguage?'A jardineira está enviando localização agora.':'Localização recebida normalmente.';
}

// ================================
// JAVASCRIPT: EVENTOS DA INTERFACE
// ================================
document.addEventListener('click',event=>{
  const el=event.target.closest('button'); if(!el)return;
  if(el.dataset.go){showScreen(el.dataset.go);return;}
  if(el.dataset.back!==undefined){goBack();return;}
  if(el.dataset.profile){selectProfile(el.dataset.profile);return;}
  if(el.dataset.campus){selectCampus(el.dataset.campus);return;}
  if(el.dataset.soon!==undefined){document.querySelector('#campus-alert').textContent='Este campus aparece como em breve no piloto.';return;}
  if(el.dataset.continueProfile!==undefined){if(requireProfile())showScreen('campus');return;}
  if(el.dataset.continueCampus!==undefined){if(requireCampus())showScreen('login');return;}
  if(el.dataset.login!==undefined){enterApp(false);return;}
  if(el.dataset.visitor!==undefined){state.profile=state.profile||'Visitante';state.campus=state.campus||mockData.activeCampus;enterApp(true);return;}
  if(el.dataset.helpAccess!==undefined){document.querySelector('#login-help').textContent='No protótipo, o acesso é apenas visual. Toque em Entrar ou Entrar como visitante.';return;}
  if(el.dataset.tab){showScreen(el.dataset.tab);return;}
  if(el.dataset.toggleAccess){toggleAccess(el.dataset.toggleAccess);return;}
});

// BRUNO: este ponto centraliza a inicialização e facilita trocar mocks por API no futuro.
updateCountdown();
showScreen('welcome',false);
