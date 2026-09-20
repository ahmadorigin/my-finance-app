const $ = (id) => document.getElementById(id);

guard();

// default tanggal hari ini (pakai waktu lokal, bukan UTC)
function todayLocal() {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;

  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
}

$("tx_date").value = todayLocal();

$("btn-add").onclick = async () => {
  const msg = $("msg");
  msg.textContent = "";

  const amount = Number($("amount").value);
  if (!amount || amount < 0) {
    msg.textContent = "Nominal harus di isi dan lebih dari 0 Rupiah.";
    return;
  }

  const res = await api("/api/transaction", {
    method: "POST",
    body: JSON.stringify({
      type: $("type").value,
      amount,
      description: $("description").value || null,
      tx_date: $("tx_date").value || null,
    }),
  });

  guardRes(res);
  if (res.status === 401) return;

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    msg.textContent = err.error || "Gagal menyimpan transaksi...";
    return;
  }

  location.href = "/dashboard/transaction.html";
};
