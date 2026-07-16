# よだかの星 手打ちうどん — サイト一式

架空のうどん店「よだかの星」を題材にした、静的なWebサイト制作例です。

公開URL: [https://techuueda-bot.github.io/yodaka-no-hoshi-udon/](https://techuueda-bot.github.io/yodaka-no-hoshi-udon/)

公開ページ内の店名・所在地・営業時間・献立・価格・人物はすべて架空です。実店舗の営業案内、予約窓口、お問い合わせ窓口ではありません。

## 構成

| ページ | パス | 内容 |
|---|---|---|
| トップ | `/` | 星読みの盤、全12品のお品書き、製麺の物語、架空店舗情報 |
| 旧お品書きURL | `/menu/` | 重複画面を持たず、トップの`/#oshinagaki`へ転送 |
| こだわり | `/kodawari/` | 出汁・麺・灯り |
| 店舗案内（架空） | `/access/` | 架空の住所・営業時間・設備、地図未掲載の明示 |
| 制作ノート | `/contact/` | 表現設計・生成写真・架空情報についての説明 |
| サンクス | `/contact/thanks/` | `noindex`・非導線。正式なフォーム有効化後のみ再利用 |

主ナビは「トップ／お品書き／こだわり」の3項目です。「制作ノート」と「店舗案内（架空）」はフッターから案内します。

## デザインと操作

方向性は「活字と丼 — 老舗×文学」。生成り紙 `#f7f2e6`、墨 `#262622`、夜の濃紺 `#1f2d3d`、金茶 `#b8863f`を使った、タイポグラフィ主導のエディトリアルデザインです。

- トップ冒頭の「星読みの盤」で七月・八月・九月を切り替える
- 選択中の星図、一杯の縦書き名、価格、説明、共有3:2写真だけを表示
- 星を選ぶと写真ビューアを開く
- 定番7品・サイド2品は、料理名と価格の行から同じ写真ビューアを開く
- ビューア上端に「前の一杯／写真を閉じる／次の一杯」を常設
- 閉じると選択元へフォーカスとスクロール位置を戻す
- 写真はすべて「イメージ写真（生成）」と明記
- `prefers-reduced-motion`と`motion-stop`に対応

星図・紋・印章・紙グレインは既存の意匠アセットです。料理、人、建物を代理イラストで描かず、料理の視覚情報には生成した写真だけを使っています。

## 生成イメージ写真

`site/assets/img/menu/generated/`に公開用WebPを12点収録しています。

- 季節限定: `seasonal` / `edamame` / `mushroom`
- 定番: `kake` / `zaru` / `kitsune` / `tempura` / `signature` / `kamo-nanban` / `curry`
- サイド: `inari` / `mini-kake`

元PNGは`design/photo-concepts/`に保存しています。実店舗へ転用するときは、権利確認済みの実写真と確定した献立内容へ差し替え、生成表記を外す前に利用許諾を確認してください。

## ローカル確認

```bash
cd site
python3 -m http.server 8420
# http://localhost:8420/
```

## QA

```bash
python3 <web-productionスキル>/scripts/qa_check.py site/
python3 <web-productionスキル>/scripts/visual_qa.py site/
```

`visual_qa.py`は375px・768px・1440pxで全HTMLを撮影し、横スクロール、コンソールエラー、画像読み込み、見切れを検査します。実行後は`visual-qa/`の画像を目視します。

## 実店舗サイトへ転用する場合

公開前に少なくとも次を確定・差し替えてください。

- 全ページの住所、電話番号、営業時間、定休日
- お品書き、価格、季節限定献立
- 店主名とプロフィール
- `access/index.html`の地図
- 正式な送信先、個人情報の利用目的、返信目安、スパム対策
- canonical、OGP、JSON-LD、`sitemap.xml`、`robots.txt`

`contact/thanks/`はフォームを実装して送信・通知テストを完了するまで非導線のまま維持します。

## 公開

`main`へのpushで`.github/workflows/deploy-pages.yml`が`site/`をGitHub Pagesへ配信します。ワークフローがHTML内のルート相対URLへリポジトリのサブパスを付与します。

## 復元ポイント

- 今回の星読みの盤リデザイン直前
  - branch: `backup/pre-star-dial-redesign-20260717`
  - tag: `pre-star-dial-redesign-20260717`
- プロ監査前
  - branch: `backup/pre-professional-audit-20260714`
  - tag: `pre-professional-audit-20260714`

通常作業では、これらのbranchとtagを変更しません。
