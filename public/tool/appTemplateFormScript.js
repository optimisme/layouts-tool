function getValues () {
    let obj = {
      text: getFormValue('formText'),
      textarea: getFormValue('formArea'),
      select: getFormValue('formSelect'),
      check1: getFormValue('formCheck1'),
      check2: getFormValue('formCheck2'),
      radio1: getFormValue('formRadio1'),
      radio2: getFormValue('formRadio2'),
      range: getFormValue('formRange'),
    }
    document.getElementById('formResult').innerText = JSON.stringify(obj, null, 4)
  }

  function setValues () {
    setFormValue('formText', 'Pau')
    setFormValue('formArea', 'Lorem ipsum')
    setFormValue('formSelect', 'Adeu')
    setFormValue('formCheck1', false)
    setFormValue('formCheck2', true)
    setFormValue('formRadio1', false)
    setFormValue('formRadio2', true)
    setFormValue('formRange', 25)
  }