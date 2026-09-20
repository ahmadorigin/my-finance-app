const $ = (id) => document.getElementById(id);

guard();

const id = new URLSearchParams(location.search).get("id");
const msg = $("msg");

async function init() {
  if (!id) {
    msg.textContent = "ID transaksi tidak ditemukan...";
    return;
  }

  const res = await api("/api/transaction/" + id);
  guardRes(res);
  if (res.status === 401) return;

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    msg.textContent = err.error || "Gagal memuat transaksi...";
    return;
  }

  const t = await res.json();
  console.log(t);

  $("type").value = t.type;
  $("amount").value = t.amount;
  $("description").value = t.description || "";
  $("tx_date").value = t.tx_date ? t.tx_date.slice(0, 10) : "";
}

init();
