const uploadForm = document.querySelector('.upload')
uploadForm.addEventListener('submit', function(e) {
  
  e.preventDefault()
  let file = e.target.uploadFile.files[0]
  let fromLang = e.target.fromLang.value
  let target = e.target.target.value
  let formData = new FormData()
  formData.append('file', file)
  formData.append('fromLang', fromLang)
  formData.append('target', target)
  fetch('/translate/stts', {
    method: 'POST',
    body: formData
  }).then(async (res) => {
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(await res.blob());
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  });
})

// holy shit this worked