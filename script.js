
const OFFICE = {
  phone: "01121624714",          // رقم الموبايل (محلي)
  whatsapp: "201121624714",      // نفس الرقم بكود الدولة بدون + أو أصفار
  address: "القاهرة،المعادى الجديده شارع الجزائر",
  hours: "من السبت إلى الخميس، 10 ص - 6 م"
};

const $ = id => document.getElementById(id);

$("phoneLink").textContent = OFFICE.phone;
$("phoneLink").href = "tel:" + OFFICE.phone;
$("addr").textContent = OFFICE.address;
$("hours").textContent = OFFICE.hours;
$("year").textContent = new Date().getFullYear().toLocaleString("ar-EG", { useGrouping: false });

/* الوضع الليلي */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  $("themeBtn").textContent = t === "dark" ? "الوضع النهاري" : "الوضع الليلي";
  try { localStorage.setItem("theme", t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || "light");
$("themeBtn").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");

/* قائمة الموبايل */
$("menuBtn").onclick = () => {
  const open = $("menu").classList.toggle("open");
  $("menuBtn").setAttribute("aria-expanded", open);
};
$("menu").addEventListener("click", e => {
  if (e.target.tagName === "A") { $("menu").classList.remove("open"); $("menuBtn").setAttribute("aria-expanded", false); }
});

/* نموذج التواصل: يفتح واتساب برسالة جاهزة */
$("form").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("fName").value.trim(), phone = $("fPhone").value.trim();
  const msg = $("formMsg");
  msg.className = "formMsg";
  if (!name || !phone) { msg.textContent = "اكتب اسمك ورقم موبايلك أولًا."; return; }
  const text = `السلام عليكم، أنا ${name}\nرقمي: ${phone}\nنوع القضية: ${$("fType").value}\n${$("fMsg").value.trim()}`;
  window.open(`https://wa.me/${OFFICE.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  msg.className = "formMsg ok";
  msg.textContent = "تم فتح واتساب، اضغط إرسال لإتمام الرسالة.";
});


/* ===== الحركة والتفاعل ===== */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
$("wa").href = "https://wa.me/" + OFFICE.whatsapp;

/* ظهور العناصر تدريجيًا عند النزول */
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll("main > section:not(.hero)").forEach(sec => {
    sec.querySelectorAll("h2, .about > p, .facts li, .card, .steps li, .qa, .info li, form").forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--d", Math.min(i % 6, 5) * 0.08 + "s");
      io.observe(el);
    });
  });
}

/* شريط التقدم + الهيدر + القسم النشط + زر الأعلى */
const links = [...document.querySelectorAll("#menu a")];
const secs = links.map(a => document.querySelector(a.getAttribute("href")));
let ticking = false;
function onScroll() {
  const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
  $("progress").style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
  document.querySelector(".nav").classList.toggle("scrolled", y > 30);
  $("toTop").classList.toggle("show", y > 600);
  let cur = -1;
  secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.35) cur = i; });
  links.forEach((a, i) => a.classList.toggle("active", i === cur));
  ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();
$("toTop").onclick = () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

/* الأسئلة الشائعة: واحد مفتوح في كل مرة */
document.querySelectorAll(".qa .q").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement, willOpen = !item.classList.contains("open");
    document.querySelectorAll(".qa.open").forEach(o => { o.classList.remove("open"); o.querySelector(".q").setAttribute("aria-expanded", "false"); });
    if (willOpen) { item.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
  });
});

/* حركة خفيفة للصورة مع الماوس (على الكمبيوتر فقط) */
if (!reduce && matchMedia("(hover: hover)").matches) {
  const hero = document.querySelector(".hero"), pic = document.querySelector(".portrait");
  hero.addEventListener("mousemove", e => pic.style.setProperty("--px", (e.clientX / innerWidth - 0.5).toFixed(3)));
  hero.addEventListener("mouseleave", () => pic.style.setProperty("--px", 0));
}
