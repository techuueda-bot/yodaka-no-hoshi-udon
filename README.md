# よだかの星 手打ちうどん — サイト一式

架空のうどん店「よだかの星」を題材にしたWebサイト制作例(トップ+下層4ページ+非導線のサンクスページ)。

公開URL: [https://techuueda-bot.github.io/yodaka-no-hoshi-udon/](https://techuueda-bot.github.io/yodaka-no-hoshi-udon/)

公開ページ内の店名・所在地・営業時間・献立・価格・人物はすべて架空の設定です。実店舗の営業案内、予約窓口、お問い合わせ窓口ではありません。

## 確認方法(ローカル)

```bash
cd site
python3 -m http.server 8000
# http://localhost:8000/ をブラウザで開く
```

## ページ構成

| ページ | パス | 内容 |
|---|---|---|
| トップ | `/` | ヒーロー・製麺の物語・季節限定・メニュー抜粋・店主紹介・CTA |
| メニュー | `/menu/` | 定番うどん・今宵の一杯(季節限定)・サイド |
| こだわり | `/kodawari/` | 出汁・麺・灯り(巨大一文字を背景に敷いた3幕) |
| 店舗案内 | `/access/` | 架空の住所・営業時間・設備と、地図掲載待ち案内 |
| お問い合わせ | `/contact/` | 受付停止案内。フォームは表示しない |
| サンクス | `/contact/thanks/` | `noindex`・非導線。正式なフォーム有効化後のみ再利用 |

## デザイン方向

「活字と丼 — 老舗×文学」。宮沢賢治「よだかの星」の世界観を、タイポグラフィ主導のエディトリアルデザインで表現。老舗和食店サイト「菱岩」の思想(**写真がない要素は描かず、文字と余白で語る**)に基づき、食べ物・人・建物の具象イラストは一切使っていません。

- 配色: 生成り紙 `#f7f2e6` × 墨 `#262622` × 夜の濃紺 `#1f2d3d` × 金茶 `#b8863f`(小さな記号のみ)
- フォント: 見出し `Zen Old Mincho`(weight 400・palt詰め組み) / 本文 `Zen Kaku Gothic New`(16px・行間2.0・字間0.04em。可読性優先で調整済み)

### 構成要素

- **縦書きヒーロー**: メインコピーを `writing-mode: vertical-rl` で組む(トップ)
- **縦書き×円環の見出し**(`.vhead`): 「今宵の一杯」「定番の一杯」等
- **星図モチーフ**(`assets/img/menu/constellation-*.svg`): 季節限定うどんを月ごとの星図(点と細線のみ)で表す
- **巨大一文字**(`.craft-section__bg`): こだわりページの「出汁」「麺」「灯」を薄く背景に敷く
- **印章ロゴ**(`assets/img/common/logo-stamp.svg`): 手彫り風の揺らぎを持つ枠+縦書き二列。フッターに使用
- **一筆書きの夜鷹**(`assets/img/common/bird.svg`): サイト全体で1箇所のみ。メニューの山の稜線を横切る
- **紙のグレイン**(`assets/img/common/grain.svg`): body::after で全ページに薄く(opacity 0.03)
- ボタンは透明地+1px罫線。公開導線は「お品書き」「こだわり」「店舗案内」に限定

### 賑わい装置(3体エージェント討論の裁定で追加。守り: FV遅延0秒・一度きり1.2s以内・追加色0)

- **お知らせ欄**(トップのみ・`hero-news`): 日付+一行・最大3件。**月1回の更新が運用前提**(更新が止まるくらいなら欄ごと外すこと)
- **フッター再設計**: 英字一行+紋+店舗情報+曜日帯(「月〜日」で火だけ打ち消し)+全ページナビ+店訓。曜日帯は装飾(aria-hidden)で「火曜定休」テキストを併記
- **地図掲載待ち**(店舗案内): 実在地点の誤認を避けるため、制作例では外部地図を表示しない
- **下層の巨大一文字**: menu「品」/ access「灯」(こだわりページの装置を転用)
- **献番**: お品書きに漢数字「一、二、…」(グループごとに一から)
- **罫線描画**(`rule-draw`): hero__foot・cta-band・footerの境界罫が視界に入った時に一度だけ描かれる(0.8s)。お品書きの罫は対象外
- **巨大一文字のリビール**(`bg-fade`): opacity 0→0.45・1.1s・一度きり
- **星の明滅**: ヒーローの星8個・周期9〜14s・変化幅0.08。サイト唯一の常時動作
- すべて既存のIntersectionObserver+CSS transitionのみで実装。`motion-stop`で全停止

## 実店舗サイトへ転用する場合

架空店のため内容はすべて仮設定です。実店舗として公開する際は実データへ差し替えてください。

| 項目 | 現在の内容 | 差し替え箇所 | 必須度 |
|---|---|---|---|
| 店舗情報(住所・電話・営業時間) | 架空設定。電話番号は非掲載 | 全ページのfooter・`access/index.html`のinfo-table | 必須 |
| 地図 | 掲載準備中の静的表示 | `access/index.html` の`.map-embed`を、確認済みの実住所Googleマップへ差し替え | 必須 |
| お知らせ | 仮の2件(2026年7月時点) | `index.html` の`.hero-news__list`。**月1回更新する運用**とセットで公開 | 必須 |
| メニュー内容・価格・季節限定献立 | 仮の献立例 | `index.html`・`menu/index.html` | 必須 |
| 店主名・プロフィール | 仮名(渡瀬 実)・テキストのみ | `index.html`の店主引用ブロック | 必須 |
| 公開URL | GitHub PagesのURLで設定済み | 移転時は全HTMLの`canonical`・OGP・JSON-LD、`sitemap.xml`、`robots.txt`を一括更新 | 必須 |
| 実写真 | 現在は未使用 | 下記「実写真3点の将来差し替え仕様」を参照。写真なしでも成立するレイアウトを保つ | 任意 |
| favicon / OGP画像 | トークン色から自動生成 | OGPは`python3 scripts/generate_assets.py`で再生成。本番ロゴ決定後に再調整 | 任意 |

### 実写真3点の将来差し替え仕様

AI生成画像や素材サイトの代理写真で実店舗を装わず、店舗から提供された権利確認済みの実写真だけを使います。

| 写真 | 将来の配置 | 推奨構図・品質 |
|---|---|---|
| 看板の一杯 | トップ「今宵の一杯」冒頭 | 横位置3:2、料理全体と器の縁が切れない。長辺2400px以上、WebP quality 82前後、代替テキストに料理名 |
| 製麺風景 | トップ「粉が舞う音だけの、朝五時。」または`/kodawari/`の「麺」 | 横位置3:2、手元と麺を主役にし、人物の顔は許諾がある場合のみ。長辺2400px以上、WebP quality 80〜85 |
| 店構え・入口 | `/access/`の地図掲載位置の直前 | 横位置16:9、道路から見える入口と目印を含める。長辺2400px以上、WebP quality 80〜85、位置情報メタデータは公開方針に合わせて除去 |

- いずれも表示幅に対して約2倍の書き出しを用意し、`width`/`height`を指定してレイアウトシフトを防ぐ
- 原版、撮影者、利用許諾、撮影日を記録する。過度な合成・生成拡張はしない
- 明るさと色温度は3点で揃えるが、料理や店の実物と異なる色に改変しない

### 制作例で使う生成イメージ写真

`/menu/`の全12品に、料理の雰囲気を伝える生成イメージ写真を用意しています。定番・サイドは献立表の料理名・価格の行にある「写真を見る」を選ぶと、写真・料理名・価格・説明を一緒に確認できるビューアが開きます。季節限定の3品は濃紺の夜空、星図、縦書きの料理名で先に見せる主役表現とし、各一杯を選ぶと同じビューアを開きます。

すべての料理行・季節限定の一杯・写真ビューア内に**「イメージ写真（生成）」**を明記し、実在店舗・実在メニューの写真としては扱いません。ビューアは前後の料理へ移動でき、切替時は旧写真をいったん消して、濃紺の背景に星の紋を一度だけ出してから新しい写真と文字をふわっと定着させます。右下の「写真を閉じる」は、カーソルを置いた時だけ下線が一度伸びる主操作です。閉じた後は選んだ献立行の位置へ戻ります。自動送りはせず、モーション停止時は即時に切り替わります。

季節限定の濃紺セクションに入る時は、スクロールを止めずに墨色の「夜のとばり」が一度だけ落ちます。静止時は遠景の広い裾野と手前の低い稜線を残し、夜鷹は旋回の前半で内側へバンクしてから翼を戻し、滑らかな弧で右端へ抜けます。夜鷹だけは滑空の余韻を読めるよう、例外として1.7秒で一度だけ動きます。

| 料理 | 公開用ファイル | 元画像 |
|---|---|---|
| かけうどん | `site/assets/img/menu/generated/kake-1536.webp` | `design/photo-concepts/260714-yodaka-kake-concept.png` |
| ざるうどん | `site/assets/img/menu/generated/zaru-1536.webp` | `design/photo-concepts/260714-yodaka-zaru-concept.png` |
| きつねうどん | `site/assets/img/menu/generated/kitsune-1536.webp` | `design/photo-concepts/260714-yodaka-kitsune-concept.png` |
| 天ぷらうどん | `site/assets/img/menu/generated/tempura-1536.webp` | `design/photo-concepts/260714-yodaka-tempura-concept.png` |
| よだかの星ぶっかけ | `site/assets/img/menu/generated/signature-1536.webp` | `design/photo-concepts/260714-yodaka-signature-concept.png` |
| 鴨南蛮うどん | `site/assets/img/menu/generated/kamo-nanban-1536.webp` | `design/photo-concepts/260714-yodaka-kamo-nanban-concept.png` |
| カレーうどん | `site/assets/img/menu/generated/curry-1536.webp` | `design/photo-concepts/260714-yodaka-curry-concept.png` |
| 冷やし夏野菜の梅おろしうどん | `site/assets/img/menu/generated/seasonal-1536.webp` | `design/photo-concepts/260714-yodaka-seasonal-concept.png` |
| 枝豆と生姜の冷麦だしうどん | `site/assets/img/menu/generated/edamame-1536.webp` | `design/photo-concepts/260714-yodaka-edamame-concept.png` |
| きのこと柚子胡椒の温かけうどん | `site/assets/img/menu/generated/mushroom-1536.webp` | `design/photo-concepts/260714-yodaka-mushroom-concept.png` |
| いなり寿司 | `site/assets/img/menu/generated/inari-1536.webp` | `design/photo-concepts/260714-yodaka-inari-concept.png` |
| 小さなかけうどん | `site/assets/img/menu/generated/mini-kake-1536.webp` | `design/photo-concepts/260714-yodaka-mini-kake-concept.png` |

- `design/photo-concepts/`のPNGは元画像として保全し、公開サイトでは1536pxのWebPを必要な1枚だけ読み込む
- 実写真を用意できたら、料理ごとに生成写真を同じビューア位置・説明形式で差し替える。生成表記を外す前に、利用許諾とメニュー内容を確認する

## お問い合わせフォーム

現在はGitHub Pagesで公開しており、`contact/index.html` は受付停止案内のみです。フォーム要素、架空電話番号、Netlify Forms属性は公開HTMLから外しています。

将来フォームを有効化する場合は、正式な送信先、個人情報の利用目的、返信目安、スパム対策を確定し、送信テストと通知確認を行ってから導線を公開してください。`contact/thanks/`はそれまで`noindex`・非導線のまま維持します。

## SEO / 計測

- 各ページに`title`/`description`/OGP/canonicalを個別設定済み
- トップページに、実店舗と誤認させない`CreativeWork`のJSON-LD、下層ページに`BreadcrumbList`のJSON-LDを設置
- `canonical` / OGP / `sitemap.xml` / `robots.txt` は公開URL基準で設定済み
- OGPは1200×630px。全HTMLに`og:locale`と画像サイズ・代替テキストを設定済み
- GA4/GTMは未設置です。公開後に導入する場合は各ページの`</head>`直前にタグを追加してください

## 公開手順(GitHub Pages)

1. 変更内容と`site/`のローカルQAを確認
2. `main`へpush
3. `.github/workflows/deploy-pages.yml`が`site/`をPages用成果物へ変換して公開
4. 公開URLで全ページ、サブパス付きアセット、OGP、スマホ表示を確認

HTMLのルート相対URLはワークフローが`/yodaka-no-hoshi-udon/`を付与します。CSSから参照するグレイン画像は、サブパスでも壊れない相対URLです。

## QA実施済み

- `qa_check.py`: FAIL 0 / WARN 0
- `visual_qa.py`(Playwright, 6ページ×3幅=18パターン): FAIL 0 / WARN 0(横スクロール・コンソールエラー・画像読み込み失敗・拡大ぼやけ すべてなし)
- 目視レビュー: 375px/768px/1440pxの3幅で崩れ・AI感なしを確認済み(`visual-qa/`フォルダにスクリーンショットあり)
- ライブ確認: コンソールエラーなし、縦書き円見出しのクリップなし、横スクロールなし

## 次の改善候補(3ヶ月後の見直し観点)

- 実店舗化して受付導線を有効にした後、GA4で主要導線の利用状況と流入元を確認
- ヒーローのコピーをA/Bテスト(「湯気の向こうに、一番星が見える一杯を。」の反応を見る)
- 季節限定メニューは3ヶ月に一度、実際の献立に更新
