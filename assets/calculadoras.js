(function(){
  const isEnglish=()=>document.body.classList.contains('en');
  const number=(form,name)=>form.elements[name].valueAsNumber;
  const format=(value,digits)=>new Intl.NumberFormat(isEnglish()?'en-US':'pt-BR',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value);

  const messages={
    required:{pt:'Preencha todos os campos com valores válidos.',en:'Complete all fields with valid values.'},
    bmi:{pt:'Informe peso entre 1 e 500 kg e altura entre 50 e 250 cm.',en:'Enter weight between 1 and 500 kg and height between 50 and 250 cm.'}
  };

  const text=(key)=>messages[key][isEnglish()?'en':'pt'];

  const calculators={
    bmi(form){
      const weight=number(form,'weight');
      const height=number(form,'height');
      if(!Number.isFinite(weight)||!Number.isFinite(height)||weight<1||weight>500||height<50||height>250) throw new Error(text('bmi'));
      return {value:weight/Math.pow(height/100,2),digits:1};
    }
  };

  document.querySelectorAll('.calculator').forEach(form=>{
    const result=form.querySelector('.calculator-result');
    const value=result.querySelector('.result-value');
    const error=form.querySelector('.calculator-error');

    form.addEventListener('submit',event=>{
      event.preventDefault();
      error.textContent='';
      result.hidden=true;
      try{
        const output=calculators[form.dataset.calculator](form);
        value.textContent=format(output.value,output.digits);
        result.dataset.raw=String(output.value);
        result.dataset.digits=String(output.digits);
        result.hidden=false;
      }catch(problem){
        error.textContent=problem.message||text('required');
      }
    });

    form.addEventListener('reset',()=>{
      error.textContent='';
      result.hidden=true;
      value.textContent='';
      delete result.dataset.raw;
      delete result.dataset.digits;
    });
  });

  document.querySelectorAll('.lang-toggle').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('.calculator-result[data-raw]').forEach(result=>{
      result.querySelector('.result-value').textContent=format(Number(result.dataset.raw),Number(result.dataset.digits));
    });
  }));
})();
