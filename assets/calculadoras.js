(function(){
  const isEnglish=()=>document.body.classList.contains('en');
  const number=(form,name)=>form.elements[name].valueAsNumber;
  const format=(value,digits)=>new Intl.NumberFormat(isEnglish()?'en-US':'pt-BR',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value);
  const bmiForm=document.querySelector('.calculator[data-calculator="bmi"]');

  const messages={
    required:{pt:'Preencha todos os campos com valores válidos.',en:'Complete all fields with valid values.'},
    bmi:{pt:'Informe peso entre 1 e 500 kg e altura entre 50 e 250 cm.',en:'Enter weight between 1 and 500 kg and height between 50 and 250 cm.'},
    bmiMissing:{pt:'Preencha peso e estatura na calculadora de IMC acima para ver a classificação.',en:'Enter weight and height in the BMI calculator above to see the classification.'},
    bmiHeightMismatch:{pt:'Use a mesma estatura nas duas calculadoras para ver a classificação.',en:'Use the same height in both calculators to see the classification.'},
    bmiOutsideRange:{pt:'A classificação do NICE se aplica a adultos com IMC abaixo de 35 kg/m².',en:'The NICE classification applies to adults with a BMI below 35 kg/m².'},
    waistHeightBelowRange:{pt:'Abaixo das faixas de classificação do NICE.',en:'Below the NICE classification ranges.'},
    waistHeightHealthy:{pt:'Adiposidade central na faixa saudável.',en:'Central adiposity in the healthy range.'},
    waistHeightIncreased:{pt:'Adiposidade central aumentada.',en:'Increased central adiposity.'},
    waistHeightHigh:{pt:'Adiposidade central alta.',en:'High central adiposity.'},
    sexMissing:{pt:'Informe o sexo para obter a classificação.',en:'Select sex to see the classification.'},
    waistHipBelowCutoff:{pt:'Abaixo do ponto de corte de referência.',en:'Below the reference cutoff.'},
    waistHipHigh:{pt:'Relação elevada, associada a maior risco de complicações metabólicas.',en:'Elevated ratio, associated with higher risk of metabolic complications.'}
  };

  const text=(key)=>messages[key][isEnglish()?'en':'pt'];

  function measurement(form,name){
    const input=form.elements[name];
    if(!input.validity.valid||!Number.isFinite(input.valueAsNumber)) throw new Error(text('required'));
    return input.valueAsNumber;
  }

  function bmiValue(form){
    const weight=number(form,'weight');
    const height=number(form,'height');
    if(!Number.isFinite(weight)||!Number.isFinite(height)||weight<1||weight>500||height<50||height>250) return NaN;
    return weight/Math.pow(height/100,2);
  }

  function waistHeightClassification(value,height){
    const bmi=bmiValue(bmiForm);
    if(!Number.isFinite(bmi)) return 'bmiMissing';
    if(number(bmiForm,'height')!==height) return 'bmiHeightMismatch';
    if(bmi>=35) return 'bmiOutsideRange';
    if(value>=0.60) return 'waistHeightHigh';
    if(value>=0.50) return 'waistHeightIncreased';
    if(value>=0.40) return 'waistHeightHealthy';
    return 'waistHeightBelowRange';
  }

  const calculators={
    bmi(form){
      const value=bmiValue(form);
      if(!Number.isFinite(value)) throw new Error(text('bmi'));
      return {value,digits:1};
    },
    waistHeight(form){
      const waist=measurement(form,'waist');
      const height=measurement(form,'height');
      const value=waist/height;
      return {value,digits:3,classification:waistHeightClassification(value,height)};
    },
    waistHip(form){
      const waist=measurement(form,'waist');
      const hip=measurement(form,'hip');
      const value=waist/hip;
      const sex=form.elements.sex.value;
      const cutoff={female:0.85,male:0.90}[sex];
      const classification=cutoff===undefined?'sexMissing':value>=cutoff?'waistHipHigh':'waistHipBelowCutoff';
      return {value,digits:3,classification};
    }
  };

  document.querySelectorAll('.calculator').forEach(form=>{
    const result=form.querySelector('.calculator-result');
    const value=result.querySelector('.result-value');
    const classification=result.querySelector('.result-classification');
    const error=form.querySelector('.calculator-error');

    function showClassification(key){
      result.dataset.classification=key;
      classification.textContent=text(key);
    }

    form.addEventListener('submit',event=>{
      event.preventDefault();
      error.textContent='';
      result.hidden=true;
      try{
        const output=calculators[form.dataset.calculator](form);
        if(!Number.isFinite(output.value)) throw new Error(text('required'));
        value.textContent=format(output.value,output.digits);
        result.dataset.raw=String(output.value);
        result.dataset.digits=String(output.digits);
        if(classification) showClassification(output.classification);
        result.hidden=false;
      }catch(problem){
        delete result.dataset.raw;
        delete result.dataset.digits;
        delete result.dataset.classification;
        error.textContent=problem.message||text('required');
      }
    });

    function clearResult(){
      error.textContent='';
      result.hidden=true;
      value.textContent='';
      delete result.dataset.raw;
      delete result.dataset.digits;
      delete result.dataset.classification;
      if(classification) classification.textContent='';
    }

    form.addEventListener('reset',clearResult);

    if(form===bmiForm) form.addEventListener('input',clearResult);
    if(form.dataset.calculator==='waistHeight'){
      form.addEventListener('input',clearResult);
      bmiForm.addEventListener('input',()=>{
        if(result.hidden) return;
        showClassification(waistHeightClassification(Number(result.dataset.raw),number(form,'height')));
      });
      bmiForm.addEventListener('reset',()=>{
        if(!result.hidden) showClassification('bmiMissing');
      });
    }

    form.querySelector('button[type="submit"]').disabled=false;
  });

  function translateSexOptions(){
    const language=isEnglish()?'en':'pt';
    document.querySelectorAll('option[data-label-pt]').forEach(option=>{
      option.textContent=option.getAttribute('data-label-'+language);
    });
  }

  translateSexOptions();
  document.querySelectorAll('.lang-toggle').forEach(button=>button.addEventListener('click',()=>{
    translateSexOptions();
    document.querySelectorAll('.calculator-result[data-raw]').forEach(result=>{
      result.querySelector('.result-value').textContent=format(Number(result.dataset.raw),Number(result.dataset.digits));
      if(result.dataset.classification){
        result.querySelector('.result-classification').textContent=text(result.dataset.classification);
      }
    });
  }));
})();
