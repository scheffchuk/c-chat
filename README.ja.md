# C Chat: マルチモデル AI チャット Web アプリ

学生、開発者、研究者向けに設計された、複数の AI モデルを単一インターフェースから操作できるモダンな Web アプリケーション。速度、比較機能、プライバシーを重視するユーザーに最適化されています。

## 背景・目的

マルチモデル AI チャットインターフェースの需要は高いものの、既存のソリューションは高コスト、クローズドエコシステム、パフォーマンスの問題を抱えています。C Chat は、教育価値と実用性を兼ね備えた直感的でベンダーロックインのないプラットフォームを提供することで、これらの制限を解決します。

## 開発状況

**コア機能は完成。** AI Gateway、Convex バックエンド、Convex Auth によるマルチモデルチャットが動作。残作業：設定ページ、可視性 UI、推論コントロール UI、アーティファクトパネル。

### 完了済み

- レスポンシブ UI、サイドバー、テーマ切り替え（ライト/ダーク）
- マルチモーダル入力（テキスト、音声、ファイル添付）
- マルチモデルセレクター（お気に入り、検索、プロバイダーロゴ）
- AI Gateway ストリーミング、再開可能ストリーム（Redis オプション）
- Convex バックエンド：chats、messages、userPreferences、streams、documents
- Convex Auth：Google OAuth + Resend メール OTP
- メッセージアクション（コピー、編集）、推論表示（折りたたみ）
- 使用状況トラッキング（tokenlens）、チャットごとのコスト表示
- 推論パラメータ（バックエンド）：努力レベル・最大ステップをモデルストアから渡す

### 進行中

- チャットアーティファクト（バックエンド + プロンプト準備済み；UI パネル未接続）
- 可視性セレクター（スキーマ + コンポーネント存在；ミューテーション/フック未接続）

### 計画中

- 設定ページ
- 推論コントロール UI（努力レベル、最大ステップ - ストア存在、UI なし）

## 主な機能

- **モダン UI**: サイドバーナビゲーションとテーマ切り替えを備えたクリーンでレスポンシブなインターフェース
- **マルチモーダル入力**: テキスト、音声、ファイル添付のサポート
- **マルチモデル対応準備**: 複数の AI モデル統合のための UI 準備完了
- **リアルタイムバックエンド**: Convex によるリアルタイムデータ同期とバックエンド操作
- **認証**: Google OAuth + Resend（メール OTP）付き Convex Auth
- **開発者フレンドリー**: モダンな Web 技術と TypeScript で構築
- **レスポンシブデザイン**: デスクトップとモバイル体験に最適化
- **推論コントロール**: 設定可能な努力レベルとステップ制限
- **使用状況トラッキング**: チャットごとのトークン使用量とコスト推定

## 対象ユーザー

- AI/ML 概念を学習する学生
- AI 搭載アプリケーションを構築する開発者
- モデル性能を比較する研究者
- 効率的なマルチモデル AI インタラクションを求めるすべての人

## 技術スタック

### フロントエンド

- **Next.js 15.5.9** - App Router 搭載の React フレームワーク
- **React 19.1** - UI ライブラリ
- **TypeScript** - 型安全性と開発者体験
- **Tailwind CSS 4** - ユーティリティファーストのスタイリング
- **Radix UI** - アクセシブルなコンポーネントプリミティブ
- **ai-elements** - AI 専用 UI コンポーネント
- **Motion** - アニメーションライブラリ（Framer Motion）
- **lucide-react** - アイコンライブラリ

### バックエンド・サービス

- **Convex 1.28** - リアルタイムバックエンド（chats、messages、userPreferences、auth）
- **@convex-dev/auth** 0.0.90 - Google OAuth + Resend メール OTP
- **@ai-sdk/gateway** 2.0.12 - AI Gateway（OpenAI、Anthropic 等）
- **@ai-sdk/react** 2.0.76 - useChat、ストリーミング
- **resumable-stream** 2.2.8 - 再開可能ストリーミング
- **tokenlens** 1.3.1 - 使用状況トラッキング、コスト推定
- **@upstash/redis** 1.35.7 - 再開可能ストリーム用オプション Redis

### ユーティリティ

- **usehooks-ts** - TypeScript React フック
- **nanoid** - ユニーク ID 生成
- **class-variance-authority** - コンポーネントバリアント管理
- **next-themes** - テーマ切り替え
- **zustand** 5.0.11 - ローカルステート管理

### 開発ツール

- **Biome** 2.3.4 - リンティングとフォーマット
- **knip** 5.80.1 - 未使用の依存関係チェック

### デプロイ

- **Vercel** - ホスティングとデプロイメントプラットフォーム

## セットアップ（Getting Started）

**前提条件:** Node.js 18 以上、pnpm

```bash
git clone <repository-url>
cd c-chat
pnpm install
cp .env.example .env.local
```

`.env.local` に値を入力。各変数の取得先：

| 変数 | 取得方法 |
|------|----------|
| `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_SITE_URL` | `npx convex dev` を1回実行すると Convex プロジェクトが作成され、これらが `.env.local` に書き込まれる。または [dashboard.convex.dev](https://dashboard.convex.dev) → デプロイメント → Settings からコピー。 |
| `NEXT_PUBLIC_SITE_URL` | アプリの URL。ローカル開発では `http://localhost:3000`。 |
| `AI_GATEWAY_API_KEY` | [Vercel ダッシュボード](https://vercel.com) → AI Gateway → API Keys → Create key。 |
| `AUTH_EMAIL_FROM` | [Resend](https://resend.com) – 検証済み送信元アドレス（例: `noreply@yourdomain.com`）。メール OTP サインインに必要。 |

その後：

```bash
npx convex dev    # ターミナル 1: Convex バックエンド
pnpm dev          # ターミナル 2: Next.js
```

[http://localhost:3000](http://localhost:3000) を開く。Google またはメール OTP でサインイン。

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── (chat)/            # チャットルートグループ
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts  # AI ストリーミングエンドポイント
│   │   ├── layout.tsx     # サイドバー付きチャットレイアウト
│   │   ├── page.tsx       # メインチャットページ
│   │   └── chat/[id]/     # 個別チャットページ
│   ├── layout.tsx         # ルートレイアウト（Convex + Convex Auth + Theme プロバイダー）
│   ├── page.tsx           # ホームページリダイレクト
│   └── globals.css        # グローバルスタイル
├── components/             # React コンポーネント
│   ├── ai-elements/       # AI 専用 UI（推論、コンテキスト、サジェスト）
│   ├── sidebar/           # app-sidebar、sidebar-provider 等
│   ├── ui/                # Radix プリミティブ
│   ├── chat.tsx          # メインチャットインターフェース
│   ├── messages.tsx      # メッセージ表示コンポーネント
│   ├── multimodal-input.tsx # 添付ファイル/音声付き入力
│   ├── greeting.tsx      # ランディングページグリーティング
│   ├── model-selector.tsx # モデル選択 UI
│   ├── message.tsx       # 個別メッセージコンポーネント
│   ├── message-actions.tsx # メッセージアクションボタン
│   ├── message-editor.tsx # メッセージ編集 UI
│   ├── message-reasoning.tsx # 推論表示
│   ├── preview-attachment.tsx # 添付ファイルプレビュー
│   └── visibility-selector.tsx # 可視性コントロール
├── hooks/                 # カスタム React フック
│   └── use-favorite-models.ts # お気に入りのプリファレンス同期
├── stores/                # Zustand ストア
│   └── model-store.ts    # モデル、推論設定ストア
├── lib/                   # ユーティリティ関数
└── providers/
    ├── convex-client-provider.tsx  # Convex React クライアント
    └── theme-provider.tsx          # テーマコンテキスト
convex/                    # Convex バックエンド
├── _generated/            # 自動生成 API & 型
├── schema.ts              # データベーススキーマ
├── chats.ts               # チャット CRUD、一覧
├── messages.ts            # メッセージクエリ & ミューテーション
├── userPreferences.ts    # ユーザープリファレンス
├── auth.config.ts         # Convex Auth 設定
├── auth.ts                # 認証ヘルパー
└── files.ts               # ファイルストレージ
```

## 現在の制限事項

- **設定ページ**: 未実装
- **可視性セレクター**: コンポーネント存在；Convex ミューテーション・フック未接続
- **推論コントロール**: ストア + API で effort/maxSteps 対応；変更用 UI なし（デフォルト使用）

## 開発

- **開発**: `pnpm dev` - Turbopack で開発サーバーを起動
- **ビルド**: `pnpm build` - 本番ビルドを作成
- **リント**: `pnpm lint` - Biome リンターを実行
- **フォーマット**: `pnpm format` - Biome でコードをフォーマット
- **チェック**: `pnpm knip` - 未使用の依存関係を見つける

## テスト

このプロジェクトは**Vitest**によるユニットテストと**Playwright**によるエンドツーエンド（E2E）テストを使用したデュアルテスト戦略を採用しています。

### ユニットテスト（Vitest）

ユニットテストは分離されたビジネスロジックとユーティリティに焦点を当てています：

| ファイル | 目的 |
|----------|------|
| `src/lib/ai/model-config.test.ts` | `getModelById()`、プロバイダーフィルタリング、人気モデル、デフォルトモデル選択を含むAIモデル設定のテスト |
| `src/lib/errors.test.ts` | エラーメッセージ生成、ステータスコード、APIレスポンスフォーマットを含む`ChatSDKError`クラスのテスト |
| `src/lib/utils.test.ts` | classNameマージ用の`cn()`、テキストサニタイゼーション、メッセージ変換ユーティリティを含むユーティリティ関数のテスト |

**目的**: コアビジネスロジック、AIモデル設定、エラーハンドリング、ユーティリティ関数が様々なシナリオで正しく動作することを保証する。

### E2Eテスト（Playwright）

E2Eテストは異なるブラウザ間で完全なユーザーワークフローを検証します：

| ファイル | 目的 |
|----------|------|
| `e2e/landing.spec.ts` | ランディングページの読み込み、コンソールエラー検出、レスポンシブデザインの検証をテスト |
| `e2e/chat.spec.ts` | チャットページの表示、メタタグ、チャットビュー間のナビゲーションハンドリングをテスト |
| `e2e/auth.spec.ts` | サインインページ、認証プロバイダーボタン、メールOTPフォーム、エラー状態を含む認証フローをテスト |
| `e2e/example.spec.ts` | 参照用のPlaywrightテスト例（外部サイトをテスト） |

**目的**: ランディングページ体験、チャット機能、認証フローを含む重要なユーザージャーニーが実際のブラウザ環境（Chromium、Firefox、WebKit）で正しく機能することを検証する。

### テストの実行

```bash
# ユニットテスト
pnpm test              # Vitestユニットテストを実行
pnpm test:ui           # インタラクティブUIでVitestを実行

# E2Eテスト（開発サーバーが必要）
pnpm test:e2e          # Playwright E2Eテストを実行
pnpm test:e2e:ui       # UIでPlaywright E2Eテストを実行
```

### テストカバレッジ領域

- ✅ **AIモデル設定** - モデル検索、フィルタリング、設定検証
- ✅ **エラーハンドリング** - カスタムエラークラスとAPIエラーレスポンス
- ✅ **ユーティリティ関数** - テキスト処理、classNameマージ、データ変換
- ✅ **ランディングページ** - ページ読み込み、コンソールエラー、レスポンシブデザイン
- ✅ **チャット機能** - ページレンダリング、メタタグ、ナビゲーション
- ✅ **認証** - サインインフロー、認証オプション、フォーム検証

## 貢献

コアチャット、バックエンド、認証は本番利用可能。設定、可視性 UI、推論コントロール、アーティファクトパネルへの貢献を歓迎します。
