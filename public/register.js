const $ = (id) => document.getElementById(id);

if (token()) location.href = "/dashboard/transaktion.html";

$("btn-register").onclick = async () => {
  const res = await api("/api/auth/register", {
    method: POST,
    body: JSON.stringify({ username: $("username"), password: $("password") }),
  });

  if (res.ok) {
    $("status").textContent =
      "Berhasil mendaftar... (Mengalihkan ke login page)";
    setTimeout(() => {
      location.href = "/login.html";
    }, 800);
  } else {
    $("status").textContent =
      "Gagal mendaftar -- Mungkin username sudah di pakai";
  }
};
