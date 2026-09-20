const token = () => localStorage.getItem("token");

const api = (url, opts = {}) =>
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token() ? { Authorization: "Bearer " + token() } : {}),
    },
    ...opts,
  });

function guard() {
  if (!token()) location.href = "/login.html";
}

function guardRes(res) {
  if (res.status === 401) {
    localStorage.removeItem("token");
    location.href = "/login.html";
  }
}
