# C Chat: マルチモデル AI チャット Web アプリ

学生、開発者、研究者向けに設計された、複数の AI モデルを単一インターフェースから操作できるモダンな Web アプリケーション。速度、比較機能、プライバシーを重視するユーザーに最適化されています。

## 背景・目的

マルチモデル AI チャットインターフェースの需要は高いものの、既存のソリューションは高コスト、クローズドエコシステム、パフォーマンスの問題を抱えています。C Chat は、教育価値と実用性を兼ね備えた直感的でベンダーロックインのないプラットフォームを提供することで、これらの制限を解決します。

## 開発状況

**🚧 現在アクティブに開発中**

このプロジェクトは卒業課題としてアクティブに開発されています。コアチャット機能は動作しており、AI モデル統合、メッセージ永続化、認証が機能しています。UI の改善と追加機能は進行中です。

### ✅ 完了した機能

- サイドバーナビゲーションを備えたモダンなレスポンシブ UI
- マルチモーダル入力インターフェース（テキスト、音声、ファイル添付）
- テーマ切り替えサポート（ライト/ダークモード）
- バックエンド統合済みマルチモデルセレクター UI
- チャットインターフェースレイアウトとコンポーネント
- グリーティングコンポーネント付きホームページ
- サインイン/サインアウト機能（Convex Auth 統合）
- AI Gateway API エンドポイントとストリーミングサポート
- メッセージ永続化とストレージ（Convex バックエンド）
- レンダリング付きメッセージ表示コンポーネント
- メッセージアクション（コピー、編集）
- Convex バックエンドスキーマ（Users、Messages、Chats、UserPreferences、Streams）
- Convex クライアントと React の統合
- Convex Auth と Google OAuth + Resend（メール OTP）の統合
- リアルタイムメッセージ同期
- お気に入りの検索機能を備えたモデルセレクター UI
- 推論コントロール（努力レベル、最大ステップ数）
- ユーザープリファレンスシステム（Convex バックエンド + localStorage 同期）
- Redis バックエンドを使用した再開可能なストリーミング
- tokenlens を使用した使用状況トラッキング

### 🚧 進行中

- 個別チャットページ（ルートはスキャフォールド済み、実装保留中）
- チャットアーティファクトとファイル処理

### 📋 計画中の機能

- 個別チャットの完全なルーティングシステム
- 設定ページとユーザープリファレンス
- パブリック/プライベートチャット可視性コントロール UI

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

- **Convex 1.28** - リアルタイムバックエンドプラットフォーム（スキーマとクライアント統合済み）
- **@convex-dev/auth** 0.0.90 - 認証システム（Convex Auth）
- **@ai-sdk/gateway** 2.0.12 - モデル統合用の AI Gateway
- **@ai-sdk/openai** 2.0.65 - OpenAI プロバイダー
- **@ai-sdk/anthropic** 2.0.44 - Anthropic プロバイダー
- **@ai-sdk/react** 2.0.76 - React 統合
- **resumable-stream** 2.2.8 - ストリーミングチャット応答
- **tokenlens** 1.3.1 - 使用状況トラッキングとコスト推定
- **@upstash/redis** 1.35.7 - 再開可能なストリーミング用の Redis 統合

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

## セットアップ

### 前提条件

- Node.js 18 以上
- pnpm

### 環境変数

以下の必須変数を含む`.env.local`ファイルを作成：

```bash
# Convex バックエンド
NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>
CONVEX_DEPLOYMENT=<your-convex-dev-deployment-id>
NEXT_PUBLIC_CONVEX_SITE_URL=<your-convex-site-url>
NEXT_PUBLIC_SITE_URL=<your-site-url>

# Convex Auth
AI_GATEWAY_API_KEY=<your-ai-gateway-api-key>
AUTH_EMAIL_FROM=<your-email-from-address>
```

**注意**: Convex は`npx convex dev`でローカル実行するか、Convex Cloud デプロイメント URL を使用できます。

### インストール

1. リポジトリをクローン

```bash
git clone <repository-url>
cd c-chat
```

2. 依存関係をインストール

```bash
pnpm install
```

3. 上記の通り環境変数を設定

4. 開発サーバーを起動

```bash
pnpm dev
```

5. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

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
│   ├── ai-elements/       # AI 専用 UI コンポーネント
│   ├── ui/               # 再利用可能な UI コンポーネント（Radix ベース）
│   ├── app-sidebar.tsx   # メインサイドバーナビゲーション
│   ├── chat.tsx          # メインチャットインターフェース
│   ├── chat-header.tsx   # コントロール付きチャットヘッダー
│   ├── messages.tsx      # メッセージ表示コンポーネント
│   ├── multimodal-input.tsx # 添付ファイル/音声付き入力
│   ├── greeting.tsx      # ランディングページグリーティング
│   ├── model-selector.tsx # モデル選択 UI
│   ├── reasoning-controls.tsx # 推論設定
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
├── _generated/           # 自動生成 API & 型
├── schema.ts             # データベーススキーマ（users、chats、messages、userPreferences、streams）
├── chats.ts              # チャットクエリ & ミューテーション
├── messages.ts          # メッセージクエリ & ミューテーション
├── users.ts             # ユーザークエリ & ミューテーション
├── auth.config.ts       # Convex Auth 設定
└── preferences.ts       # ユーザープリファレンスクエリ & ミューテーション
```

## 現在の制限事項

⚠️ **重要**: これは開発版で、以下の制限があります：

- **個別チャットページ**: ルートは存在するがページ実装は未完了
- **チャットアーティファクト**: ファイル処理と表示が完全に実装されていない
- **設定ページ**: まだ実装されていない
- **可視性コントロール**: バックエンドサポートは存在するが UI は限定的

## 開発

- **開発**: `pnpm dev` - Turbopack で開発サーバーを起動
- **ビルド**: `pnpm build` - 本番ビルドを作成
- **リント**: `pnpm lint` - Biome リンターを実行
- **フォーマット**: `pnpm format` - Biome でコードをフォーマット
- **チェック**: `pnpm knip` - 未使用の依存関係を見つける

## 貢献

このプロジェクトは現在卒業課題としてアクティブに開発されています。フロントエンド UI はほぼ完成しており、次のフェーズではバックエンド統合と AI モデル接続が含まれます。
