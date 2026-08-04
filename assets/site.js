
(function(){
  const saved=localStorage.getItem('gem-lang');
  const setLang=(lang)=>{document.body.classList.toggle('en',lang==='en');document.documentElement.lang=lang==='en'?'en':'pt-BR';localStorage.setItem('gem-lang',lang);document.querySelectorAll('.lang-toggle').forEach(b=>b.textContent=lang==='en'?'PT':'EN')};
  setLang(saved==='en'?'en':'pt');
  document.querySelectorAll('.lang-toggle').forEach(b=>b.addEventListener('click',()=>setLang(document.body.classList.contains('en')?'pt':'en')));
})();
