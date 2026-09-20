const $ = (id) => document.getElementById(id);

guard();

const id = URLSearchParams(location.search).get(id);
const msg = $("msg");
