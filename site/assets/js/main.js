/* main.js — スターター基盤
   構成: reveal / ヘッダー状態 / ハンバーガー / フォーム検証 / モーション停止
   GSAP等を足す場合もこのファイルの仕組みは残す(削除禁止箇所はコメント参照) */

document.addEventListener("DOMContentLoaded", () => {
  initTypeSet();
  initReveal();
  initHeader();
  initNav();
  initForm();
  initMotionStop();
});

/* ---- 活字が組まれる演出(.type-set): 1文字ずつspan化してstagger reveal ----
   シグネチャー要素。ヒーロー見出しにのみ使う(多用すると読みにくくなるため) */
function initTypeSet() {
  const targets = document.querySelectorAll(".type-set");
  if (!targets.length) return;

  targets.forEach((el) => {
    const text = el.textContent;
    el.setAttribute("aria-label", text.replace(/\s+/g, " ").trim());
    el.innerHTML = "";
    let i = 0;
    text.split("").forEach((ch) => {
      if (ch === "\n") {
        el.appendChild(document.createElement("br"));
        return;
      }
      const span = document.createElement("span");
      span.className = "char";
      span.setAttribute("aria-hidden", "true");
      span.style.transitionDelay = `${Math.min(i * 28, 600)}ms`;
      span.textContent = ch;
      el.appendChild(span);
      i++;
    });
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-inview"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-inview");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );
  targets.forEach((el) => io.observe(el));
}

/* ---- スクロールリビール(.is-inview を付与)
   .rule-draw(罫線描画)と .bg-fade(巨大一文字)も同じ観測に載せる ---- */
function initReveal() {
  const targets = document.querySelectorAll(".js-reveal, .rule-draw, .bg-fade");
  if (!targets.length) return;
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-inview"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-inview");
          io.unobserve(e.target); // 一度きり。繰り返すならこの行を消す
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px" }
  );
  targets.forEach((el) => io.observe(el));
}

/* ---- ヘッダー: スクロールで背景を付ける ---- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---- ハンバーガー(aria-expanded連動。a11y構造は削除禁止) ---- */
function initNav() {
  const btn = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".global-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = open ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    })
  );
}

/* ---- フォーム: 送信前検証+ハニーポット+二重送信防止 ----
   送信手段(action)は references/forms.md で決めて実装する */
function initForm() {
  const form = document.querySelector(".js-contact-form");
  if (!form) return;

  const showError = (field, msg) => {
    const err = form.querySelector(`[data-error-for="${field.id}"]`);
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg;
  };

  const validators = {
    name: (v) => (v.trim() ? "" : "お名前を入力してください"),
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? ""
        : "メールアドレスの形式が正しくありません",
    message: (v) => (v.trim() ? "" : "お問い合わせ内容を入力してください"),
  };

  form.addEventListener("submit", (e) => {
    // ハニーポット(削除禁止): botが埋めたら静かに中断
    const hp = form.querySelector(".form__hp input");
    if (hp && hp.value) {
      e.preventDefault();
      return;
    }
    let firstBad = null;
    Object.keys(validators).forEach((id) => {
      const field = form.querySelector(`#${id}`);
      if (!field) return;
      const msg = validators[id](field.value);
      showError(field, msg);
      if (msg && !firstBad) firstBad = field;
    });
    if (firstBad) {
      e.preventDefault();
      firstBad.focus();
      return;
    }
    // 二重送信防止
    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = "送信しています…";
    }
  });
}

/* ---- モーション停止(SKILL.mdのポリシー実装。削除禁止) ----
   reduced-motion環境にのみボタンが表示され(CSS側)、押した場合だけ全停止 */
function initMotionStop() {
  const btn = document.querySelector(".motion-stop");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const off = document.documentElement.classList.toggle("is-motion-off");
    btn.textContent = off ? "アニメーションを再生する" : "アニメーションを停止する";
    // GSAP使用時はここで gsap.globalTimeline.paused(off) 等も呼ぶ
  });
}
