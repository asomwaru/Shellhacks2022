document.getElementById("button").addEventListener("click", post);

async function post() {
  const response = await fetch("/translate", {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      input: document.querySelector("input#translation").value,
      lang: document.querySelector("input#language").value
    })
  });
  
  document.getElementById("output").innerText = JSON.stringify(await response.json());
  // parses JSON response into native JavaScript objects
}
