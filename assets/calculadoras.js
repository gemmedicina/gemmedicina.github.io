(function(){
  const form = document.getElementById('anthropometric-form');
  if (!form) return;

  const isEnglish = () => document.body.classList.contains('en');
  const messages = {
    invalidMeasurements: {
      pt: 'Revise os campos destacados. Use medidas positivas e informe o peso entre 1 e 500 kg.',
      en: 'Check the marked fields. Use positive measurements and enter a weight between 1 and 500 kg.'
    },
    bmiMeasurements: {
      pt: 'Informe peso e estatura.',
      en: 'Enter weight and height.'
    },
    bmiHeight: {
      pt: 'Para o IMC, informe uma estatura entre 50 e 250 cm.',
      en: 'For BMI, enter a height between 50 and 250 cm.'
    },
    bmiUnderweight: {pt: 'Baixo peso.', en: 'Underweight.'},
    bmiHealthy: {pt: 'Faixa de peso adequada.', en: 'Healthy weight range.'},
    bmiOverweight: {pt: 'Sobrepeso.', en: 'Overweight.'},
    bmiObesity: {pt: 'Obesidade.', en: 'Obesity.'},
    waistHeightMeasurements: {
      pt: 'Informe cintura e estatura.',
      en: 'Enter waist circumference and height.'
    },
    waistHipMeasurements: {
      pt: 'Informe cintura e quadril.',
      en: 'Enter waist and hip circumferences.'
    },
    bmiMissing: {
      pt: 'O IMC é necessário para classificar esta relação.',
      en: 'BMI is needed to classify this ratio.'
    },
    bmiOutsideRange: {
      pt: 'A classificação do NICE se aplica a adultos com IMC abaixo de 35 kg/m².',
      en: 'The NICE classification applies to adults with a BMI below 35 kg/m².'
    },
    waistHeightBelowRange: {
      pt: 'Abaixo das faixas de classificação do NICE.',
      en: 'Below the NICE classification ranges.'
    },
    waistHeightHealthy: {
      pt: 'Adiposidade central na faixa saudável.',
      en: 'Central adiposity in the healthy range.'
    },
    waistHeightIncreased: {
      pt: 'Adiposidade central aumentada.',
      en: 'Increased central adiposity.'
    },
    waistHeightHigh: {
      pt: 'Adiposidade central alta.',
      en: 'High central adiposity.'
    },
    sexMissing: {
      pt: 'Informe o sexo para ver a classificação.',
      en: 'Select sex to see the classification.'
    },
    waistHipBelowCutoff: {
      pt: 'Abaixo do ponto de corte de referência.',
      en: 'Below the reference cutoff.'
    },
    waistHipHigh: {
      pt: 'Relação elevada, associada a maior risco de complicações metabólicas.',
      en: 'Elevated ratio, associated with higher risk of metabolic complications.'
    },
    ratioOutOfRange: {
      pt: 'Revise as medidas informadas.',
      en: 'Check the measurements entered.'
    }
  };

  const text = key => messages[key][isEnglish() ? 'en' : 'pt'];
  const format = (value, digits) => new Intl.NumberFormat(isEnglish() ? 'en-US' : 'pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);

  const fields = ['weight', 'height', 'waist', 'hip'];
  const classificationTones = {
    bmiUnderweight: 'neutral',
    bmiOverweight: 'attention',
    bmiObesity: 'elevated',
    waistHeightIncreased: 'elevated',
    waistHeightHigh: 'elevated',
    waistHipHigh: 'elevated'
  };
  const cards = [...document.querySelectorAll('.anthropometric-results [data-index]')];
  const error = form.querySelector('.calculator-error');
  const guide = document.querySelector('.measurement-guide');
  const figure = guide.querySelector('.measurement-figure');
  const illustration = figure.querySelector('img');
  let results;
  let invalidMeasurements = false;

  function bmiIndex(weight, height) {
    if (weight === undefined || height === undefined) return {message: 'bmiMeasurements'};
    if (height < 50 || height > 250) return {message: 'bmiHeight'};
    const value = weight / Math.pow(height / 100, 2);
    let message = 'bmiHealthy';
    if (value >= 30) message = 'bmiObesity';
    else if (value >= 25) message = 'bmiOverweight';
    else if (value < 18.5) message = 'bmiUnderweight';
    return {value, digits: 1, message};
  }

  function waistHeightIndex(waist, height, bmi) {
    if (waist === undefined || height === undefined) return {message: 'waistHeightMeasurements'};
    const value = waist / height;
    if (!Number.isFinite(value)) return {message: 'ratioOutOfRange'};

    let message = 'waistHeightBelowRange';
    if (bmi === undefined) message = 'bmiMissing';
    else if (bmi >= 35) message = 'bmiOutsideRange';
    else if (value >= 0.60) message = 'waistHeightHigh';
    else if (value >= 0.50) message = 'waistHeightIncreased';
    else if (value >= 0.40) message = 'waistHeightHealthy';

    return {value, digits: 3, message};
  }

  function waistHipIndex(waist, hip, sex) {
    if (waist === undefined || hip === undefined) return {message: 'waistHipMeasurements'};
    const value = waist / hip;
    if (!Number.isFinite(value)) return {message: 'ratioOutOfRange'};

    const cutoff = {female: 0.85, male: 0.90}[sex];
    let message = 'sexMissing';
    if (cutoff !== undefined) message = value >= cutoff ? 'waistHipHigh' : 'waistHipBelowCutoff';
    return {value, digits: 3, message};
  }

  function renderResults() {
    error.textContent = invalidMeasurements ? text('invalidMeasurements') : '';
    for (const card of cards) {
      const result = results?.[card.dataset.index];
      const value = card.querySelector('.result-value');
      const unit = card.querySelector('.result-unit');
      const message = card.querySelector('.result-classification');
      const hasValue = result?.value !== undefined;
      const tone = classificationTones[result?.message];
      if (tone) card.dataset.tone = tone;
      else delete card.dataset.tone;
      value.textContent = hasValue ? format(result.value, result.digits) : '—';
      if (unit) unit.hidden = !hasValue;
      message.hidden = !result?.message;
      message.textContent = result?.message ? text(result.message) : '';
    }
  }

  function clearResults() {
    if (!results) return;
    for (const name of fields) form.elements[name].removeAttribute('aria-invalid');
    invalidMeasurements = false;
    results = undefined;
    renderResults();
  }

  function showMeasurementModel(sex) {
    if (sex !== 'female' && sex !== 'male') {
      delete guide.dataset.model;
      figure.hidden = true;
      return;
    }
    guide.dataset.model = sex;
    figure.hidden = false;
    if (!illustration.hasAttribute('src')) illustration.src = illustration.dataset.src;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    invalidMeasurements = false;
    const measurements = {};
    for (const name of fields) {
      const input = form.elements[name];
      if (!input.validity.valid) {
        input.setAttribute('aria-invalid', 'true');
        invalidMeasurements = true;
      } else if (Number.isFinite(input.valueAsNumber)) {
        measurements[name] = input.valueAsNumber;
      }
    }

    const {weight, height, waist, hip} = measurements;
    const bmi = bmiIndex(weight, height);
    results = {
      bmi,
      waistHeight: waistHeightIndex(waist, height, bmi.value),
      waistHip: waistHipIndex(waist, hip, form.elements.sex.value)
    };
    renderResults();
  });
  form.addEventListener('input', clearResults);
  form.addEventListener('reset', clearResults);
  form.addEventListener('reset', () => showMeasurementModel(''));
  form.elements.sex.addEventListener('change', () => showMeasurementModel(form.elements.sex.value));
  form.querySelector('button[type="submit"]').disabled = false;

  function translateSexOptions() {
    const language = isEnglish() ? 'en' : 'pt';
    for (const option of form.elements.sex.options) {
      option.textContent = option.getAttribute('data-label-' + language);
    }
  }

  showMeasurementModel(form.elements.sex.value);
  translateSexOptions();
  document.querySelectorAll('.lang-toggle').forEach(button => button.addEventListener('click', () => {
    translateSexOptions();
    renderResults();
  }));
})();
