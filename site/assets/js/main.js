/* main.js — スターター基盤
   構成: reveal / ヘッダー状態 / ハンバーガー / フォーム検証 / モーション停止
   GSAP等を足す場合もこのファイルの仕組みは残す(削除禁止箇所はコメント参照) */

document.addEventListener("DOMContentLoaded", () => {
  initTypeSet();
  initReveal();
  initHeader();
  initNav();
  initForm();
  initMenuDialog();
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

/* ---- お品書き: 料理行から生成イメージ写真を開く ----
   写真は共有dialogへ必要な1枚だけ読み込む。自動送りはせず、Esc/背景/閉じるで戻る。 */
function initMenuDialog() {
  const dialog = document.querySelector("#menu-photo-dialog");
  const triggers = Array.from(document.querySelectorAll("[data-menu-photo]"));
  if (!dialog || !triggers.length || !("showModal" in dialog)) return;

  const photos = {
    kake: { src: "../assets/img/menu/generated/kake-1536.webp", alt: "澄んだ出汁と刻み葱を添えたかけうどんの生成イメージ" },
    zaru: { src: "../assets/img/menu/generated/zaru-1536.webp", alt: "ざるに盛った手打ちうどんとつけ汁の生成イメージ" },
    kitsune: { src: "../assets/img/menu/generated/kitsune-1536.webp", alt: "油揚げと刻み葱を添えたきつねうどんの生成イメージ" },
    tempura: { src: "../assets/img/menu/generated/tempura-1536.webp", alt: "海老天とかき揚げを添えた天ぷらうどんの生成イメージ" },
    signature: { src: "../assets/img/menu/generated/signature-1536.webp", alt: "半熟卵、揚げ玉、刻み葱を添えたぶっかけうどんの生成イメージ" },
    "kamo-nanban": { src: "../assets/img/menu/generated/kamo-nanban-1536.webp", alt: "炙った鴨と九条葱を添えた鴨南蛮うどんの生成イメージ" },
    curry: { src: "../assets/img/menu/generated/curry-1536.webp", alt: "出汁を効かせた和風カレーうどんの生成イメージ" },
    seasonal: { src: "../assets/img/menu/generated/seasonal-1536.webp", alt: "夏野菜、梅おろし、茗荷を添えた冷やしうどんの生成イメージ" },
    edamame: { src: "../assets/img/menu/generated/edamame-1536.webp", alt: "枝豆のすり流し、生姜、氷を添えた冷やしだしうどんの生成イメージ" },
    mushroom: { src: "../assets/img/menu/generated/mushroom-1536.webp", alt: "三種のきのこと柚子胡椒を添えた温かけうどんの生成イメージ" },
    inari: { src: "../assets/img/menu/generated/inari-1536.webp", alt: "二個のいなり寿司の生成イメージ" },
    "mini-kake": { src: "../assets/img/menu/generated/mini-kake-1536.webp", alt: "小さな器のかけうどんの生成イメージ" },
  };

  const image = dialog.querySelector("#menu-dialog-image");
  const number = dialog.querySelector("#menu-dialog-number");
  const title = dialog.querySelector("#menu-dialog-title");
  const description = dialog.querySelector("#menu-dialog-description");
  const price = dialog.querySelector("#menu-dialog-price");
  const closeButton = dialog.querySelector("[data-menu-dialog-close]");
  const prevButton = dialog.querySelector("[data-menu-dialog-prev]");
  const nextButton = dialog.querySelector("[data-menu-dialog-next]");
  let currentIndex = 0;
  let opener = null;
  let savedBodyStyle = "";
  let savedScrollY = 0;

  const getItem = (trigger) => {
    const key = trigger.dataset.menuPhoto;
    const photo = photos[key];
    if (!photo) return null;
    const name = trigger.querySelector(".menu-item__name");
    const desc = trigger.querySelector(".menu-item__desc");
    const itemPrice = trigger.querySelector(".menu-item__price");
    const itemNumber = trigger.querySelector(".menu-item__num");
    return {
      ...photo,
      name: name ? name.textContent.replace(itemNumber ? itemNumber.textContent : "", "").trim() : "",
      description: desc ? desc.childNodes[0].textContent.trim() : "",
      price: itemPrice ? itemPrice.textContent.trim() : "",
      number: itemNumber ? itemNumber.textContent.trim() : "",
    };
  };

  const lockScroll = () => {
    savedBodyStyle = document.body.getAttribute("style") || "";
    savedScrollY = window.scrollY;
    document.body.classList.add("menu-dialog-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = "100%";
  };

  const unlockScroll = () => {
    document.body.classList.remove("menu-dialog-open");
    if (savedBodyStyle) document.body.setAttribute("style", savedBodyStyle);
    else document.body.removeAttribute("style");
    window.scrollTo(0, savedScrollY);
  };

  const populate = (index) => {
    const item = getItem(triggers[index]);
    if (!item) return;
    currentIndex = index;
    image.src = item.src;
    image.alt = item.alt;
    number.textContent = item.number;
    title.textContent = item.name;
    description.textContent = item.description;
    price.textContent = item.price;
    prevButton.disabled = index === 0;
    nextButton.disabled = index === triggers.length - 1;
  };

  const openDialog = (index, trigger) => {
    opener = trigger;
    populate(index);
    lockScroll();
    dialog.showModal();
    requestAnimationFrame(() => dialog.classList.add("is-open"));
    closeButton.focus();
  };

  const closeDialog = () => {
    if (!dialog.open) return;
    const finish = () => {
      dialog.close();
      dialog.classList.remove("is-open", "is-closing", "is-switching");
      unlockScroll();
      if (opener) opener.focus();
    };
    if (document.documentElement.classList.contains("is-motion-off")) {
      finish();
      return;
    }
    dialog.classList.add("is-closing");
    window.setTimeout(finish, 180);
  };

  const moveDialog = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= triggers.length) return;
    dialog.classList.add("is-switching");
    window.setTimeout(() => {
      populate(nextIndex);
      requestAnimationFrame(() => dialog.classList.remove("is-switching"));
    }, document.documentElement.classList.contains("is-motion-off") ? 0 : 90);
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => openDialog(index, trigger));
  });
  closeButton.addEventListener("click", closeDialog);
  prevButton.addEventListener("click", () => moveDialog(currentIndex - 1));
  nextButton.addEventListener("click", () => moveDialog(currentIndex + 1));
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
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
