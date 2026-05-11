# shumiyata.com

ミヤタシュウの個人ブログ兼ポートフォリオサイトです。  
技術発信・制作物の紹介・職務経歴の公開を目的として制作しました。

## 📄 ページ構成

| ページ | URL | 概要 |
| :--- | :--- | :--- |
| Top | `/` | 最新ブログ・制作物のサマリー |
| Blog | `/blogs` | 技術・日常に関するブログ記事一覧（microCMS） |
| Portfolio | `/portfolio` | 制作物・アイコン紹介 |
| Resume | `/resume` | 職務経歴・スキル・保有資格（Notion、Basic認証） |
| Contact | `/contact` | お問い合わせフォーム（Google Apps Script） |

## 🛠 技術スタック

| カテゴリ | 採用技術 | 用途 |
| :--- | :--- | :--- |
| **Framework** | Astro v5 (SSG) | 全ページ静的生成 |
| **Blog CMS** | microCMS | ブログ記事・カテゴリ・タグの管理 |
| **Resume CMS** | Notion | 職務経歴・スキル・資格などの管理 |
| **Styling** | Tailwind CSS | UIスタイリング |
| **Content Processing** | unified / rehype | CMSのHTML解析・目次生成・シンタックスハイライト |
| **Hosting** | Vercel | デプロイ・Edge Middleware（Basic認証） |
| **Form** | Google Apps Script | お問い合わせフォームのバックエンド |

## 🚀 開発の始め方

### 必須要件

- Node.js v20以上

### 環境変数

Vercel にリンク後、下記コマンドで `.env` を取得できます。

```bash
vercel env pull --environment preview
```

### セットアップ手順

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動 (localhost:4321)
npm run dev

# プロダクション用ビルド
npm run build

# Vercel Preview デプロイ
npm run deploy

# Vercel 本番デプロイ
npm run deploy:prod
```

## ✉️ Contact

お問い合わせは下記からお願いします。

https://shumiyata.com/contact
