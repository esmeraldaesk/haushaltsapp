
let entries = JSON.parse(localStorage.getItem("entries") || "[]");
const form = document.getElementById("entryForm");
const list = document.getElementById("entries");
const summary = document.getElementById("summary");
const showAllCheckbox = document.getElementById("showAll");
const exportBtn = document.getElementById("exportCSV");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const note = document.getElementById("note").value;
  const person = document.getElementById("person").value;
  const date = new Date().toISOString().split("T")[0];
  if (!amount || !category || !person) return;

  const entry = { amount, category, note, person, date };
  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));
  form.reset();
  render();
});

function render() {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  const filtered = showAllCheckbox.checked
    ? entries
    : entries.filter(e => e.date.startsWith(currentMonth));

  const grouped = {};
  filtered.forEach(e => {
    const month = e.date.slice(0, 7);
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(e);
  });

  list.innerHTML = "";
  let total = 0;
  for (const month of Object.keys(grouped).sort().reverse()) {
    const header = document.createElement("h2");
    header.textContent = `🗓️ ${month}`;
    list.appendChild(header);
    grouped[month].forEach(e => {
      const item = document.createElement("li");
      item.textContent = `${e.date}: ${e.amount.toFixed(2)} € – ${e.category} (${e.note || ""}) – ${e.person}`;
      list.appendChild(item);
      total += e.amount;
    });
  }

  summary.innerHTML = `💸 Summe: ${total.toFixed(2)} € | Anzahl: ${filtered.length}`;
}

exportBtn.addEventListener("click", () => {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  const filtered = showAllCheckbox.checked
    ? entries
    : entries.filter(e => e.date.startsWith(currentMonth));

  const csv = ["Datum,Betrag (€),Kategorie,Notiz,Person"];
  filtered.forEach(e => {
    csv.push(`${e.date},${e.amount},${e.category},"${e.note}",${e.person}`);
  });

  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "haushaltsdaten.csv";
  a.click();
  URL.revokeObjectURL(url);
});

showAllCheckbox.addEventListener("change", render);
render();
