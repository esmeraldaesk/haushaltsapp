const form = document.getElementById("entryForm");
const entryList = document.getElementById("entryList");
const totalSpan = document.getElementById("total");

let entries = JSON.parse(localStorage.getItem("entries") || "[]");
render();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const person = document.getElementById("person").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const note = document.getElementById("note").value;
  const date = document.getElementById("date").value;

  if (!amount || !category || !date || !person) return;

  const entry = { amount, category, note, date, person };
  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));
  form.reset();
  render();
});

function render() {
  entryList.innerHTML = "";
  let total = 0;
  entries.forEach((e) => {
    total += e.amount;
    const li = document.createElement("li");
    li.textContent = `${e.date}: ${e.amount.toFixed(2)} € – ${e.category} ${e.note ? "(" + e.note + ")" : ""} [${e.person}]`;
    entryList.appendChild(li);
  });
  totalSpan.textContent = total.toFixed(2) + " €";
}
