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

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const person = document.getElementById("person").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const note = document.getElementById("note").value;
  const date = document.getElementById("date").value;

  if (!amount || !category || !date || !person) return;

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

function render(entries) {
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

const q = query(eintraegeRef, orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
  const entries = snapshot.docs.map(doc => doc.data());
  render(entries);
});
