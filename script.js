import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDy1ouy9yio3hhbKeBfu_UCgvAIOkIa7_I",
  authDomain: "haushaltsapp-9739c.firebaseapp.com",
  projectId: "haushaltsapp-9739c",
  storageBucket: "haushaltsapp-9739c.firebasestorage.app",
  messagingSenderId: "231550305736",
  appId: "1:231550305736:web:c1eb274a090b9dfed32cfd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const eintraegeRef = collection(db, "eintraege");

const form = document.getElementById("entryForm");
const entryList = document.getElementById("entryList");
const totalSpan = document.getElementById("total");
const showAll = document.getElementById("showAll");
const exportBtn = document.getElementById("exportCSV");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const person = document.getElementById("person").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const note = document.getElementById("note").value;
  const date = new Date().toISOString().split("T")[0];

  if (!amount || !category || !person) return;

  await addDoc(eintraegeRef, {
    person,
    amount,
    category,
    note,
    date,
    timestamp: new Date()
  });

  form.reset();
});

let currentEntries = [];

function render(entries) {
  entryList.innerHTML = "";
  const showAllMonths = showAll.checked;
  let total = 0;
  currentEntries = entries;

  const grouped = {};
  entries.forEach(e => {
    const month = e.date.slice(0, 7);
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(e);
  });

  const nowMonth = new Date().toISOString().slice(0, 7);

  for (const [month, items] of Object.entries(grouped).sort().reverse()) {
    if (!showAllMonths && month !== nowMonth) continue;

    const h2 = document.createElement("h2");
    h2.textContent = formatMonth(month);
    entryList.appendChild(h2);

    const ul = document.createElement("ul");
    items.forEach(e => {
      total += e.amount;
      const li = document.createElement("li");
      li.textContent = `${e.date}: ${e.amount.toFixed(2)} € – ${e.category} ${e.note ? "(" + e.note + ")" : ""} [${e.person}]`;
      ul.appendChild(li);
    });
    entryList.appendChild(ul);
  }

  totalSpan.textContent = total.toFixed(2) + " €";
}

function formatMonth(m) {
  const [y, mo] = m.split("-");
  const date = new Date(y, mo - 1);
  return date.toLocaleString("de-DE", { month: "long", year: "numeric" });
}

const q = query(eintraegeRef, orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
  const entries = snapshot.docs.map(doc => doc.data());
  render(entries);
});

showAll.addEventListener("change", () => {
  render(currentEntries);
});

exportBtn.addEventListener("click", () => {
  const showAllMonths = showAll.checked;
  const nowMonth = new Date().toISOString().slice(0, 7);

  let filtered = currentEntries;
  if (!showAllMonths) {
    filtered = filtered.filter(e => e.date.startsWith(nowMonth));
  }

  const csv = ["Datum,Betrag (€),Kategorie,Notiz,Person"];
  filtered.forEach(e => {
    const row = [e.date, e.amount.toFixed(2), e.category, e.note || "", e.person].map(val => `"${val}"`).join(",");
    csv.push(row);
  });

  const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "haushaltsausgaben.csv";
  a.click();
  URL.revokeObjectURL(url);
});
