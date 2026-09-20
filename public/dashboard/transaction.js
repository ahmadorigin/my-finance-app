const $ = (id) => document.getElementById(id);

guard();

const fmt = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 2,
});

const formatRp = (n) => fmt.format(Number(n) || 0);

// default ke bulan berjalan (pakai waktu lokal, bukan UTC)
function todayLocal() {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;

  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
}

$("month").value = todayLocal().slice(0, 7);

async function load() {
  const month = $("month").value;
  const res = await api(
    month ? `/api/transaction?month=${month}` : "/api/transaction",
  );

  console.log(res);

  guardRes(res);
  if (res.status === 401) return;

  const rows = await res.json();
  const income = rows
    .filter((r) => r.type === "income")
    .reduce((s, r) => s + Number(r.amount), 0);
  const expense = rows
    .filter((r) => r.type === "expense")
    .reduce((s, r) => s + Number(r.amount), 0);

  $("totals").textContent =
    `Pemasukan ${formatRp(income)} · Pengeluaran ${formatRp(expense)} · Saldo ${formatRp(income - expense)}`;

  const list = $("list");
  list.innerHTML = "";

  if (!rows.length) {
    list.innerHTML = `<li class='muted'>Belum ada transaksi untuk periode ini...</li>`;
    return;
  }

  rows.forEach((r) => {
    const li = createElement("li");
    li.innerHTML = `
      <span>
        <span class="${r.type}">${r.type === "income" ? "+" : "-"} ${formatRp(r.amount)}</span>
        <span class="muted">${r.description || ""} ${r.tx_date ? r.tx_date.slice(0, 10) : ""}</span>
      </span>
      <a class="edit" href="/dashboard/edit-transaction.html?id=${r.id}">edit</a>
    `;
    list.appendChild(li);
  });
}

$("btn-filter").onclick = load;
load();
