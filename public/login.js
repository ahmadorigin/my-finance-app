const $ = (id) => document.getElementById(id);

if (token()) location.href = "/dashboard/transaction.html";

$("btn-login").onclick = async () => {
  const res = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username: $("username").value,
      password: $("password").value,
    }),
  });

  if (res.ok) {
    const data = await res.json();

    localStorage.setItem("token", data.token);
    location.href = "/dashboard/transaction.html";
  } else {
    $("status").textContent = "Login Gagal... Error: " + res.json();
    console.log(res.json());
  }
};
