
(function(){
  let saved='pt';
  try{saved=localStorage.getItem('gem-lang')}catch(error){}
  const setLang=(lang)=>{document.body.classList.toggle('en',lang==='en');document.documentElement.lang=lang==='en'?'en':'pt-BR';try{localStorage.setItem('gem-lang',lang)}catch(error){}document.querySelectorAll('.lang-toggle').forEach(b=>{b.textContent=lang==='en'?'PT':'EN';b.setAttribute('aria-label',lang==='en'?'Switch language to Portuguese':'Alterar idioma para inglês')})};
  setLang(saved==='en'?'en':'pt');
  document.querySelectorAll('.lang-toggle').forEach(b=>b.addEventListener('click',()=>setLang(document.body.classList.contains('en')?'pt':'en')));
})();
