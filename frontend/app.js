async function loadContracts() {
  const res = await fetch('/contracts');
  const data = await res.json();
  document.getElementById('output').textContent = JSON.stringify(data, null, 2);
}
