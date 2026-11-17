(function(){
  const isEnglish=()=>document.body.classList.contains('en');
  const number=(form,name)=>form.elements[name].valueAsNumber;
  const format=(value,digits)=>new Intl.NumberFormat(isEnglish()?'en-US':'pt-BR',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value);

  const messages={
    required:{pt:'Preencha todos os campos com valores válidos.',en:'Complete all fields with valid values.'},
    bmi:{pt:'Informe peso entre 1 e 500 kg e altura entre 50 e 250 cm.',en:'Enter weight between 1 and 500 kg and height between 50 and 250 cm.'},
    fib4:{pt:'Use idade de 18 a 120 anos e valores laboratoriais positivos nas unidades indicadas.',en:'Use age 18 to 120 years and positive laboratory values in the units shown.'},
    ckdepi:{pt:'Use idade de 18 a 120 anos, selecione o sexo da equação e informe creatinina entre 0,1 e 30 mg/dL.',en:'Use age 18 to 120 years, select the sex used by the equation, and enter creatinine between 0.1 and 30 mg/dL.'},
    urinecacr:{pt:'Informe cálcio e creatinina urinários positivos, ambos em mg/dL.',en:'Enter positive urine calcium and creatinine values, both in mg/dL.'},
    uacr:{pt:'Informe valores positivos e confira as unidades de albumina e creatinina urinárias.',en:'Enter positive values and confirm the urine albumin and creatinine units.'}
  };

  const text=(key)=>messages[key][isEnglish()?'en':'pt'];

  const calculators={
    bmi(form){
      const weight=number(form,'weight');
      const height=number(form,'height');
      if(!Number.isFinite(weight)||!Number.isFinite(height)||weight<1||weight>500||height<50||height>250) throw new Error(text('bmi'));
      return {value:weight/Math.pow(height/100,2),digits:1};
    },
    fib4(form){
      const age=number(form,'age');
      const ast=number(form,'ast');
      const alt=number(form,'alt');
      const platelets=number(form,'platelets');
      if(!Number.isInteger(age)||age<18||age>120||!Number.isFinite(ast)||ast<=0||ast>10000||!Number.isFinite(alt)||alt<=0||alt>10000||!Number.isFinite(platelets)||platelets<=0||platelets>2000) throw new Error(text('fib4'));
      return {value:(age*ast)/(platelets*Math.sqrt(alt)),digits:2};
    },
    ckdepi(form){
      const age=number(form,'age');
      const creatinine=number(form,'creatinine');
      const sex=form.elements.sex.value;
      if(!Number.isInteger(age)||age<18||age>120||!Number.isFinite(creatinine)||creatinine<0.1||creatinine>30||!['female','male'].includes(sex)) throw new Error(text('ckdepi'));
      const female=sex==='female';
      const k=female?0.7:0.9;
      const alpha=female?-0.241:-0.302;
      const ratio=creatinine/k;
      const value=142*Math.pow(Math.min(ratio,1),alpha)*Math.pow(Math.max(ratio,1),-1.2)*Math.pow(0.9938,age)*(female?1.012:1);
      return {value,digits:1};
    },
    urinecacr(form){
      const calcium=number(form,'calcium');
      const creatinine=number(form,'creatinine');
      if(!Number.isFinite(calcium)||calcium<=0||calcium>1000||!Number.isFinite(creatinine)||creatinine<=0||creatinine>1000) throw new Error(text('urinecacr'));
      return {value:calcium/creatinine,digits:3};
    },
    uacr(form){
      const albumin=number(form,'albumin');
      const creatinine=number(form,'creatinine');
      const albuminUnit=form.elements.albuminUnit.value;
      const creatinineUnit=form.elements.creatinineUnit.value;
      if(!Number.isFinite(albumin)||albumin<=0||albumin>100000||!Number.isFinite(creatinine)||creatinine<=0||creatinine>10000||!['mgL','mgdL'].includes(albuminUnit)||!['mgdL','gL'].includes(creatinineUnit)) throw new Error(text('uacr'));
      const albuminMgL=albuminUnit==='mgL'?albumin:albumin*10;
      const creatinineGL=creatinineUnit==='gL'?creatinine:creatinine*0.01;
      return {value:albuminMgL/creatinineGL,digits:1};
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
