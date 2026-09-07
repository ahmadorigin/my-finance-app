const $ = (id) => document.getElementById(id);

if (token()) location.href = "/dashboard/transaktion.html";

$("btn-register").onclick = async () => {
  const res = await api("/api/auth/register", {
    method: POST,
    body: JSON.stringify({ username: $("username"), password: $("password") }),
  });
};
