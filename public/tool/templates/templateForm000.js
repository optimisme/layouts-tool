function getValues () {
    let obj = {
      formText: getForm('formText'),
      formArea: getForm('formArea'),
      formSelect: getForm('formSelect'),
      formCheck1: getForm('formCheck1'),
      formCheck2: getForm('formCheck2'),
      formRadio1: getForm('formRadio1'),
      formRadio2: getForm('formRadio2'),
      formRange: getForm('formRange'),
    }
    document.getElementById('sliderValue').textContent = document.getElementById('formRange').value + '%'
    document.getElementById('formResult').innerText = JSON.stringify(obj, null, 4)
  }

  function setValues () {
    setForm('formText', 'Pau')
    setForm('formArea', 'Lorem ipsum')
    setForm('formSelect', 'Adeu')
    setForm('formCheck1', false)
    setForm('formCheck2', true)
    setForm('formRadio1', false)
    setForm('formRadio2', true)
    setForm('formRange', 25)
    getValues()
  }

  function setSliderValue (ref) {
    document.getElementById('sliderValue').textContent = ref.value + '%'
  }