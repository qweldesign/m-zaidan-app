# M ZAIDAN APP

三谷市民文化振興財団 助成金申請管理システム（デスクトップアプリ）

財団事務局スタッフが申請データを閲覧・管理するための Electron アプリ。

---

## 技術スタック

| 項目 | 技術 |
|---|---|
| デスクトップアプリ | Electron |
| UI フレームワーク | React + TypeScript |
| ビルドツール | Vite |
| スタイリング | Tailwind CSS v4 |
| ルーティング | React Router（HashRouter） |
| 環境変数 | dotenv |
| インストーラー | electron-builder（NSIS） |

---

## ディレクトリ構成

```
m-zaidan-app/
  electron.cjs        メインプロセス（IPC ハンドラ・API 呼び出し）
  preload.cjs         contextBridge（Renderer への橋渡し）
  vite.config.ts      Vite 設定
  index.html          エントリーポイント
  .env                APIトークン・ベースURL（git管理外）
  .env.example        環境変数サンプル
  src/
    index.tsx         React エントリーポイント
    App.tsx           メイン画面（一覧・フィルタ・ページネーション）
    global.d.ts       window.electronAPI の型定義
    types/
      submission.ts   申請データの型定義
    hooks/
      useSubmissions.ts   申請一覧取得フック
      useSubmission.ts    個別申請取得フック
    components/
      SubmissionTable.tsx     一覧テーブル
      Pagination.tsx          ページネーション
      ErrorMessage.tsx        エラー表示
      detail/
        SubmissionDetail.tsx  詳細パネル本体
        Section1Panel.tsx     団体情報・会員構成・助成歴
        Section2Panel.tsx     事業情報・参加人数
        Section3Panel.tsx     収支明細
        Section4Panel.tsx     設立背景・活動内容・実績PR
        Section5Panel.tsx     添付ファイル（写真・書類）
    pages/
      PrintView.tsx   PDF出力用印刷ビュー
```

---

## 環境変数

`.env.example` をコピーして `.env` を作成してください。

```
API_TOKEN=スタッフ用Bearerトークン
API_BASE_URL=https://your-api-server.com
```

---

## 開発環境の起動

ターミナルを2つ開いて実行します。

```bash
# ターミナル1：Vite dev サーバー
npm run dev

# ターミナル2：Electron 起動
npm run electron
```

---

## ビルド・インストーラー生成

```bash
npm run dist
```

`release/` フォルダに Windows 用インストーラー（`.exe`）が生成されます。

### ビルド後の .env の扱い

`electron-builder` の `extraFiles` 設定により、`.env` はインストーラーにバンドルされます。インストール先（`C:/Users/{ユーザー名}/AppData/Local/Programs/助成金申請管理システム/`）に自動的に配置されます。

トークンを変更する場合はインストール先の `.env` を直接編集してください。

---

## アーキテクチャメモ

### メインプロセスと Renderer の分離

Electron のセキュリティ設計として `contextIsolation: true` / `nodeIntegration: false` を採用しています。React 側（Renderer）から Node.js に直接アクセスできない構成にしており、`preload.cjs` の `contextBridge` で許可した関数だけを `window.electronAPI` 経由で呼び出せます。

```
React (Renderer)
  └─ window.electronAPI.fetchAPI(...)
       └─ preload.cjs（contextBridge）
            └─ ipcRenderer.invoke('fetch-api', ...)
                 └─ electron.cjs（ipcMain.handle）
                      └─ fetch() → API サーバー
```

### 環境判定

`app.isPackaged` を使ってビルド済みアプリと開発環境を判定しています。ただし `app.isPackaged` は `app` の初期化前には使えないため、`dotenv` の読み込みには `process.execPath` を使った独自判定を採用しています。

```js
const isPackaged = !process.execPath.includes('electron')
const envPath = isPackaged
  ? path.join(path.dirname(process.execPath), '.env')
  : path.join(__dirname, '.env')
```

`createWindow()` 内など `app` 初期化後の処理では `app.isPackaged` を使用しています。

### PDF 出力

`printToPDF` を使用しています。非表示の `BrowserWindow` を作成して `/print/:id` ルートを読み込み、API からデータを取得した後に PDF 化します。

```
export-pdf IPC
  └─ 非表示ウィンドウを作成
       └─ /#/print/:id を読み込み
            └─ 1500ms 待機（API 取得完了を待つ）
                 └─ printToPDF() → ファイル保存
```

データ量や添付ファイルが多い場合は `setTimeout` の待機時間を延ばすと安定します。

### HashRouter を使う理由

ビルド後は `file://` プロトコルでHTMLを開くため、`BrowserRouter` のパスベースルーティングが動作しません。`HashRouter` を使うことで `/#/print/:id` のようなハッシュベースのルーティングが `file://` 環境でも動作します。

---

## API 仕様

### 主なエンドポイント

| メソッド | パス | 用途 |
|---|---|---|
| GET | /api/submissions | 申請一覧取得 |
| GET | /api/submissions/:id | 個別申請取得 |
| PATCH | /api/submissions/:id | 申請内容修正 |
| GET | /api/submissions/export/csv | CSV エクスポート |
| GET | /api/files | 添付ファイル取得 |

---

## データ仕様

### ステータス

```
審査中 / 承認 / 否決 / 対象外
```

デフォルト値は `審査中`。`対象外` は政治団体・宗教団体など助成対象外の申請に使用。

### 活動カテゴリ

```
ボランティア活動 / スポーツ活動 / その他市民活動
```

### section1〜5 JSON

申請フォームのセクションごとのデータが JSON で保存されています。空のオブジェクト `{}` の場合はフォールバック表示になります。

---

## 既知の制限・今後の課題

- 編集フォーム（PATCH API）は未実装。ステータス変更のみ対応
- 編集履歴（`submission_logs`）の表示は未実装
- PDF 出力の待機時間（1500ms）はハードコード。添付ファイルが多い申請では失敗する場合あり
- Windows のみ動作確認済み（Mac・Linux は未検証）
- インストーラーはコードサイニング署名なし。初回実行時に SmartScreen の警告が出る場合は「詳細情報」→「実行」で進む

---

## 次年度の予定

- Excel マクロから API を直接叩く機能の追加
- 編集フォームの実装
- 編集履歴の表示

---

## 開発履歴

- 2026年7月 初期リリース（閲覧・ステータス変更・CSV/PDF 出力）  

---

## ライセンス

Copyright (c) 2026 QWEL.DESIGN  

本ソフトウェアは三谷市民文化振興財団からの委託により開発されました。  
無断での複製・改変・再配布を禁じます。  

---

## 制作者 | Author

[QWEL.DESIGN](https://qwel.design)  
福井を拠点に活動するフロントエンド開発者  
Front-end developer based in Fukui, Japan  
