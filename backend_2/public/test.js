const uploadForm = document.querySelector('.upload')
uploadForm.addEventListener('submit', function(e) {
  
  e.preventDefault()
  let file = e.target.uploadFile.files[0]
  let lang = e.target.lang.value
  let formData = new FormData()
  formData.append('file', file)
  formData.append('lang', lang)
  fetch('/translate', {
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