/* main.js — スターター基盤
   構成: reveal / ヘッダー状態 / ハンバーガー / フォーム検証 / モーション停止
   GSAP等を足す場合もこのファイルの仕組みは残す(削除禁止箇所はコメント参照) */

document.addEventListener("DOMContentLoaded", () => {
  initTypeSet();
  initReveal();
  initNightfall();
  initHeader();
  initNav();
  initForm();
  initSeasonalDial();
  initMenuDialog();
  initMotionStop();
});

const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
const isMotionReduced = () =>
  reducedMotionMedia.matches || document.documentElement.classList.contains("is-motion-off");

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

  if (isMotionReduced()) {
    targets.forEach((el) => el.classList.add("is-inview"));
    return;
  }

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
  if (isMotionReduced()) {
    targets.forEach((el) => el.classList.add("is-inview"));
    return;
  }
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

/* ---- お品書きの季節限定へ入る一度きりの夜のとばり ----
   スクロール位置を固定せず、境目が視界に入った時だけ濃紺へ沈ませる。 */
function initNightfall() {
  const targets = document.querySelectorAll(".js-nightfall");
  if (!targets.length) return;
  if (isMotionReduced()) {
    targets.forEach((el) => el.classList.add("is-nightfall"));
    return;
  }
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-nightfall"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-nightfall");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -18% 0px" }
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
  const header = btn ? btn.closest(".site-header") : null;
  if (!btn || !nav || !header) return;

  let isOpen = false;
  let savedBodyStyle = "";
  let savedScrollY = 0;

  const homeLink = nav.querySelector('a[href="/"]');
  const menuLink = nav.querySelector('a[href="/#oshinagaki"]');
  const menuSection = document.querySelector("#oshinagaki");

  const syncCurrentLocation = () => {
    if (!homeLink || !menuLink || !menuSection) return;
    const headerOffset = header.getBoundingClientRect().height + 24;
    const sectionStart = menuSection.offsetTop - headerOffset;
    const sectionEnd = sectionStart + menuSection.offsetHeight;
    const isMenuCurrent = window.scrollY >= sectionStart && window.scrollY < sectionEnd;
    if (isMenuCurrent) {
      homeLink.removeAttribute("aria-current");
      menuLink.setAttribute("aria-current", "location");
    } else {
      menuLink.removeAttribute("aria-current");
      homeLink.setAttribute("aria-current", "page");
    }
  };

  syncCurrentLocation();
  window.addEventListener("scroll", syncCurrentLocation, { passive: true });

  const lockPage = () => {
    savedBodyStyle = document.body.getAttribute("style") || "";
    savedScrollY = window.scrollY;
    document.body.classList.add("nav-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
  };

  const unlockPage = () => {
    const root = document.documentElement;
    const savedScrollBehavior = root.style.scrollBehavior;
    document.body.classList.remove("nav-open");
    if (savedBodyStyle) document.body.setAttribute("style", savedBodyStyle);
    else document.body.removeAttribute("style");
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, savedScrollY);
    root.style.scrollBehavior = savedScrollBehavior;
  };

  const openNav = () => {
    if (isOpen) return;
    syncCurrentLocation();
    isOpen = true;
    lockPage();
    header.classList.add("is-nav-open");
    nav.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "メニューを閉じる");
  };

  const closeNav = ({ restoreFocus = true } = {}) => {
    if (!isOpen) return;
    isOpen = false;
    nav.classList.remove("is-open");
    header.classList.remove("is-nav-open");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "メニューを開く");
    unlockPage();
    if (restoreFocus) btn.focus({ preventScroll: true });
  };

  btn.addEventListener("click", () => {
    if (isOpen) closeNav();
    else openNav();
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      closeNav({ restoreFocus: false });
    })
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) closeNav();
  });
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

/* ---- 星読みの盤: 月の星を選ぶと、一杯と共有写真を切り替える ---- */
function initSeasonalDial() {
  const root = document.querySelector(".js-seasonal-dial");
  if (!root) return;

  const dishes = {
    seasonal: {
      tab: "season-tab-july",
      month: "七月",
      name: "冷やし夏野菜の梅おろしうどん",
      description: "花巻産トマトと茄子、香ばしい焼き茗荷。梅の酸味で夜の暑さをほどきます。",
      price: "¥920",
      map: "assets/img/menu/constellation-july.svg",
      mapAlt: "七月の星図",
      image: "assets/img/menu/generated/seasonal-1536.webp",
      imageAlt: "夏野菜、梅おろし、茗荷を添えた冷やしうどんの生成イメージ",
    },
    edamame: {
      tab: "season-tab-august",
      month: "八月",
      name: "枝豆と生姜の冷麦だしうどん",
      description: "枝豆のすり流しと生姜、氷を浮かべた出汁でひと息つく一杯。",
      price: "¥920",
      map: "assets/img/menu/constellation-august.svg",
      mapAlt: "八月の星図",
      image: "assets/img/menu/generated/edamame-1536.webp",
      imageAlt: "枝豆のすり流し、生姜、氷を添えた冷やしだしうどんの生成イメージ",
    },
    mushroom: {
      tab: "season-tab-september",
      month: "九月",
      name: "きのこと柚子胡椒の温かけうどん",
      description: "近隣の山で採れた三種のきのこを香ばしく炒め、柚子胡椒できりっと。",
      price: "¥950",
      map: "assets/img/menu/constellation-september.svg",
      mapAlt: "九月の星図",
      image: "assets/img/menu/generated/mushroom-1536.webp",
      imageAlt: "三種のきのこと柚子胡椒を添えた温かけうどんの生成イメージ",
    },
  };

  const tabs = Array.from(root.querySelectorAll("[data-season-key]"));
  const panel = root.querySelector("#season-panel");
  const map = root.querySelector("[data-season-map]");
  const image = root.querySelector("[data-season-image]");
  const month = root.querySelector("[data-season-month]");
  const name = root.querySelector("[data-season-name]");
  const price = root.querySelector("[data-season-price]");
  const descriptions = Array.from(root.querySelectorAll("[data-season-description]"));
  const openButton = root.querySelector(".star-dial__star-button");
  const photoButtons = [openButton, root.querySelector("[data-season-photo-cta]")].filter(Boolean);
  if (!tabs.length || !panel || !map || !image || !month || !name || !price || !descriptions.length || !openButton) return;

  let currentKey = "seasonal";
  let changeVersion = 0;

  const preload = (src) => new Promise((resolve) => {
    const next = new Image();
    next.onload = () => resolve(true);
    next.onerror = () => resolve(false);
    next.src = src;
  });

  const commit = (key) => {
    const dish = dishes[key];
    if (!dish) return;
    root.dataset.seasonKey = key;
    map.src = dish.map;
    map.alt = dish.mapAlt;
    image.src = dish.image;
    image.alt = dish.imageAlt;
    month.textContent = dish.month;
    name.textContent = dish.name;
    price.textContent = dish.price;
    descriptions.forEach((description) => {
      description.textContent = dish.description;
    });
    panel.setAttribute("aria-labelledby", dish.tab);
    photoButtons.forEach((button) => {
      button.dataset.menuPhoto = key;
      button.dataset.menuNumber = dish.month;
      button.dataset.menuName = dish.name;
      button.dataset.menuDescription = dish.description;
      button.dataset.menuPrice = dish.price;
      button.setAttribute("aria-label", `${dish.month}限定、${dish.name}、${dish.price.replace("¥", "")}円の生成イメージを大きく見る`);
    });
  };

  const select = async (key) => {
    const dish = dishes[key];
    if (!dish || key === currentKey) return;
    currentKey = key;
    changeVersion += 1;
    const version = changeVersion;
    tabs.forEach((tab) => {
      const selected = tab.dataset.seasonKey === key;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    await preload(dish.image);
    if (version !== changeVersion) return;
    if (!isMotionReduced()) panel.classList.add("is-changing");
    window.setTimeout(() => {
      if (version !== changeVersion) return;
      commit(key);
      panel.classList.remove("is-changing");
    }, isMotionReduced() ? 0 : 160);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab.dataset.seasonKey));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      tabs[nextIndex].focus();
      void select(tabs[nextIndex].dataset.seasonKey);
    });
  });

  root.dataset.seasonKey = currentKey;
}

/* ---- お品書き: 料理行から生成イメージ写真を開く ----
   写真は共有dialogへ必要な1枚だけ読み込む。自動送りはせず、Esc/背景/閉じるで戻る。 */
function initMenuDialog() {
  const dialog = document.querySelector("#menu-photo-dialog");
  const triggers = Array.from(document.querySelectorAll("[data-menu-photo]"));
  if (!dialog || !triggers.length || !("showModal" in dialog)) return;

  const photos = {
    kake: { src: "assets/img/menu/generated/kake-1536.webp", alt: "澄んだ出汁と刻み葱を添えたかけうどんの生成イメージ" },
    zaru: { src: "assets/img/menu/generated/zaru-1536.webp", alt: "ざるに盛った手打ちうどんとつけ汁の生成イメージ" },
    kitsune: { src: "assets/img/menu/generated/kitsune-1536.webp", alt: "油揚げと刻み葱を添えたきつねうどんの生成イメージ" },
    tempura: { src: "assets/img/menu/generated/tempura-1536.webp", alt: "海老天とかき揚げを添えた天ぷらうどんの生成イメージ" },
    signature: { src: "assets/img/menu/generated/signature-1536.webp", alt: "半熟卵、揚げ玉、刻み葱を添えたぶっかけうどんの生成イメージ" },
    "kamo-nanban": { src: "assets/img/menu/generated/kamo-nanban-1536.webp", alt: "炙った鴨と九条葱を添えた鴨南蛮うどんの生成イメージ" },
    curry: { src: "assets/img/menu/generated/curry-1536.webp", alt: "出汁を効かせた和風カレーうどんの生成イメージ" },
    seasonal: { src: "assets/img/menu/generated/seasonal-1536.webp", alt: "夏野菜、梅おろし、茗荷を添えた冷やしうどんの生成イメージ" },
    edamame: { src: "assets/img/menu/generated/edamame-1536.webp", alt: "枝豆のすり流し、生姜、氷を添えた冷やしだしうどんの生成イメージ" },
    mushroom: { src: "assets/img/menu/generated/mushroom-1536.webp", alt: "三種のきのこと柚子胡椒を添えた温かけうどんの生成イメージ" },
    inari: { src: "assets/img/menu/generated/inari-1536.webp", alt: "二個のいなり寿司の生成イメージ" },
    "mini-kake": { src: "assets/img/menu/generated/mini-kake-1536.webp", alt: "小さな器のかけうどんの生成イメージ" },
  };

  const image = dialog.querySelector("#menu-dialog-image");
  const number = dialog.querySelector("#menu-dialog-number");
  const title = dialog.querySelector("#menu-dialog-title");
  const description = dialog.querySelector("#menu-dialog-description");
  const price = dialog.querySelector("#menu-dialog-price");
  const mediaStatus = dialog.querySelector("#menu-dialog-media-status");
  const closeButton = dialog.querySelector("[data-menu-dialog-close]");
  const prevButton = dialog.querySelector("[data-menu-dialog-prev]");
  const nextButton = dialog.querySelector("[data-menu-dialog-next]");
  let currentIndex = 0;
  let opener = null;
  let savedBodyStyle = "";
  let savedScrollY = 0;
  let isTransitioning = false;
  let isClosing = false;
  let sessionVersion = 0;
  let processingIndex = null;
  let pendingIndexes = [];
  let closeUnderlineTimer = 0;

  const getItem = (trigger) => {
    const key = trigger.dataset.menuPhoto;
    const photo = photos[key];
    if (!photo) return null;
    const name = trigger.querySelector(".menu-item__name, .seasonal-card__name");
    const desc = trigger.querySelector(".menu-item__desc, .seasonal-card__desc");
    const itemPrice = trigger.querySelector(".menu-item__price, .seasonal-card__price");
    const itemNumber = trigger.querySelector(".menu-item__num, .seasonal-card__month");
    return {
      ...photo,
      name: trigger.dataset.menuName || (name ? name.textContent.replace(itemNumber ? itemNumber.textContent : "", "").trim() : ""),
      description: trigger.dataset.menuDescription || (desc ? desc.textContent.trim() : ""),
      price: trigger.dataset.menuPrice || (itemPrice ? itemPrice.textContent.trim() : ""),
      number: trigger.dataset.menuNumber || (itemNumber ? itemNumber.textContent.trim() : ""),
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
    const scrollPosition = savedScrollY;
    const root = document.documentElement;
    const savedScrollBehavior = root.style.scrollBehavior;
    document.body.classList.remove("menu-dialog-open");
    if (savedBodyStyle) document.body.setAttribute("style", savedBodyStyle);
    else document.body.removeAttribute("style");
    // 通常のページ内リンク用の smooth scroll を、復帰時だけ無効化する。
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, scrollPosition);
    root.style.scrollBehavior = savedScrollBehavior;
  };

  const preloadPhoto = (src) => new Promise((resolve) => {
    const preload = new Image();
    let settled = false;
    const finish = (loaded) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      resolve(loaded);
    };
    // モバイル回線で応答自体が止まった時も、操作全体を待たせ続けない。
    const timeoutId = window.setTimeout(() => finish(false), 10000);
    preload.onload = () => {
      if (typeof preload.decode !== "function") {
        finish(true);
        return;
      }
      preload.decode().then(() => finish(true)).catch(() => finish(preload.naturalWidth > 0));
    };
    preload.onerror = () => finish(false);
    preload.src = src;
  });

  const decodeImage = (target) => {
    if (typeof target.decode !== "function") return Promise.resolve(target.naturalWidth > 0);
    return new Promise((resolve) => {
      let settled = false;
      const finish = (decoded) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        resolve(decoded);
      };
      // 同じ画像でもSafari側の表示デコードが返らない場合に備える。
      const timeoutId = window.setTimeout(() => finish(false), 10000);
      target.decode().then(() => finish(true)).catch(() => finish(target.naturalWidth > 0));
    });
  };

  const getGroupContext = (index) => {
    const trigger = triggers[index];
    if (!trigger) return null;
    if (trigger.closest(".star-dial")) {
      return { groupTriggers: [trigger], groupIndex: 0 };
    }
    const group = trigger.closest(".menu-seasonal, .menu-list__group");
    const groupTriggers = triggers.filter((item) => item.closest(".menu-seasonal, .menu-list__group") === group);
    return { groupTriggers, groupIndex: groupTriggers.indexOf(trigger) };
  };

  const getPlannedIndex = () => pendingIndexes.at(-1) ?? processingIndex ?? currentIndex;

  const updateNavigation = () => {
    const context = getGroupContext(getPlannedIndex());
    if (!context) return;
    prevButton.disabled = context.groupIndex <= 0;
    nextButton.disabled = context.groupIndex >= context.groupTriggers.length - 1;
  };

  const clearVisibleItem = () => {
    image.removeAttribute("src");
    image.alt = "";
    number.textContent = "";
    title.textContent = "";
    description.textContent = "";
    price.textContent = "";
    mediaStatus.hidden = true;
    mediaStatus.textContent = "";
  };

  const beginLoading = () => {
    dialog.classList.remove("is-error");
    dialog.classList.add("is-loading", "is-transitioning");
    dialog.setAttribute("aria-busy", "true");
    clearVisibleItem();
  };

  const populateCopy = (index, item) => {
    currentIndex = index;
    opener = triggers[index];
    number.textContent = item.number;
    title.textContent = item.name;
    description.textContent = item.description;
    price.textContent = item.price;
    updateNavigation();
  };

  const commitPhoto = (index, item) => {
    populateCopy(index, item);
    dialog.classList.remove("is-loading", "is-transitioning", "is-error");
    dialog.removeAttribute("aria-busy");
  };

  const commitPhotoError = (index, item) => {
    populateCopy(index, item);
    mediaStatus.textContent = "写真を読み込めませんでした。通信を確認して、もう一度お試しください。";
    mediaStatus.hidden = false;
    dialog.classList.remove("is-loading", "is-transitioning");
    dialog.classList.add("is-error");
    dialog.removeAttribute("aria-busy");
  };

  const loadAndCommit = async (index, version) => {
    const item = getItem(triggers[index]);
    if (!item) return false;
    const loaded = await preloadPhoto(item.src);
    if (version !== sessionVersion || !dialog.open) return false;
    if (!loaded) {
      commitPhotoError(index, item);
      return true;
    }
    image.src = item.src;
    image.alt = item.alt;
    const decoded = await decodeImage(image);
    if (version !== sessionVersion || !dialog.open) return false;
    if (!decoded) {
      commitPhotoError(index, item);
      return true;
    }
    commitPhoto(index, item);
    return true;
  };

  const processQueue = async (version) => {
    if (isTransitioning && processingIndex !== null) return;
    isTransitioning = true;
    while (version === sessionVersion && dialog.open && pendingIndexes.length) {
      processingIndex = pendingIndexes.shift();
      beginLoading();
      updateNavigation();
      const completed = await loadAndCommit(processingIndex, version);
      if (!completed || version !== sessionVersion || !dialog.open) break;
      processingIndex = null;
      updateNavigation();
    }
    if (version === sessionVersion) {
      processingIndex = null;
      isTransitioning = false;
      updateNavigation();
    }
  };

  const openDialog = (index, trigger) => {
    if (dialog.open || isClosing) return;
    sessionVersion += 1;
    const version = sessionVersion;
    opener = trigger;
    closeButton.classList.remove("is-underline-drawn");
    pendingIndexes = [index];
    processingIndex = null;
    isTransitioning = false;
    beginLoading();
    lockScroll();
    dialog.showModal();
    dialog.classList.add("is-open");
    updateNavigation();
    closeButton.focus();
    void processQueue(version);
  };

  const drawCloseUnderline = () => {
    if (!dialog.open || isMotionReduced()) return;
    window.clearTimeout(closeUnderlineTimer);
    closeButton.classList.remove("is-underline-drawn");
    // 同じ操作でも毎回左から描き直す。
    requestAnimationFrame(() => {
      closeButton.classList.add("is-underline-drawn");
      closeUnderlineTimer = window.setTimeout(() => {
        closeButton.classList.remove("is-underline-drawn");
      }, 380);
    });
  };

  const closeDialog = () => {
    if (!dialog.open || isClosing) return;
    isClosing = true;
    sessionVersion += 1;
    pendingIndexes = [];
    processingIndex = null;
    isTransitioning = false;
    const finish = () => {
      dialog.close();
      dialog.classList.remove("is-open", "is-closing", "is-transitioning", "is-loading", "is-error");
      dialog.removeAttribute("aria-busy");
      unlockScroll();
      if (opener) opener.focus({ preventScroll: true });
      isClosing = false;
    };
    if (isMotionReduced()) {
      finish();
      return;
    }
    dialog.classList.add("is-closing");
    window.setTimeout(finish, 180);
  };

  const moveDialog = (direction) => {
    if (!dialog.open || isClosing) return;
    const context = getGroupContext(getPlannedIndex());
    if (!context) return;
    const nextTrigger = context.groupTriggers[context.groupIndex + direction];
    if (!nextTrigger) return;
    const nextIndex = triggers.indexOf(nextTrigger);
    pendingIndexes.push(nextIndex);
    updateNavigation();
    void processQueue(sessionVersion);
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => openDialog(index, trigger));
  });
  closeButton.addEventListener("click", closeDialog);
  closeButton.addEventListener("pointerenter", drawCloseUnderline);
  prevButton.addEventListener("click", () => moveDialog(-1));
  nextButton.addEventListener("click", () => moveDialog(1));
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
