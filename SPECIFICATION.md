# アプリケーション仕様書 (AI Travel Concierge)

## 1. 概要
本アプリケーションは、ユーザーの曖昧な旅行リクエスト（例：「京都に行きたい」）を解析し、自律的なWebリサーチを行って最適な旅行プランや関連情報を提案するAIコンシェルジュサービスです。

## 2. システム構成

### アーキテクチャ図
```mermaid
graph TD
    User[ユーザー] -->|Webブラウザ| Frontend[Frontend (Next.js)]
    Frontend -->|REST API| Backend[Backend (FastAPI)]
    Backend -->|Browser Automation| SearchEngine[検索エンジン (Yahoo! Japan)]
    Backend -->|REST API| WeatherAPI[Open-Meteo API]
    Frontend -->|Embed| GoogleMaps[Google Maps]
    Frontend -->|Download| ICS[カレンダーファイル (.ics)]
```

### コンテナ構成 (Docker Compose)
1.  **frontend**: Next.jsアプリケーション (Port: 3000)
2.  **backend**: FastAPIアプリケーション + Playwright (Port: 8000)
3.  **db**: PostgreSQL (Port: 5432) ※現在は設定のみで未使用

## 3. 機能要件

### 3.1 チャットインターフェース
*   **メッセージ送信**: ユーザーは自然言語でリクエストを送信可能。
*   **履歴表示**: 会話履歴をチャット形式で表示。
*   **ローディング表示**: バックエンド処理中（リサーチ中）はインジケータを表示。

### 3.2 自律リサーチ機能 (Research Agent)
*   **トリガー**: ユーザーのメッセージに特定のキーワード（「探して」「旅行」「ホテル」等）が含まれる場合、リサーチを実行。
*   **検索実行**: Yahoo! Japanの検索結果から上位のタイトル、概要、リンクを取得。
*   **ロジック**:
    1.  ユーザー入力から検索クエリを生成（例：「{入力} 旅行 おすすめ」）。
    2.  Headless Browser (Chromium) で検索エンジンにアクセス。
    3.  検索結果のDOM要素を解析・抽出。

### 3.3 天気情報連携
*   **場所特定**: メッセージ内から主要な地名（京都, 北海道, 沖縄, etc.）を簡易抽出。
*   **データ取得**: Open-Meteo APIを使用し、特定された場所の現在気温・天気コードを取得。
*   **表示**: チャットレスポンス内に天気情報を付記。

### 3.4 地図連携
*   **場所特定**: メッセージから抽出された場所を使用。
*   **表示**: フロントエンドにて、Google Maps Embed API (iframe) を用いて該当地域を表示。

### 3.5 カレンダー連携
*   **データ生成**: バックエンドで「{場所}旅行」というタイトルのイベントを含むiCalendar形式テキストデータを生成。
*   **ダウンロード**: チャットUI上に「カレンダーに追加 (.ics)」ボタンを表示し、クリックでファイルをダウンロード可能。

## 4. API インターフェース

### `POST /api/chat`

チャットメッセージを送信し、AI/エージェントからの応答を取得します。

**リクエストボディ:**
```json
{
  "messages": [
    {
      "id": "string",
      "role": "user",
      "content": "京都のホテルを探して"
    }
  ]
}
```

**レスポンス:**
```json
{
  "id": "string",
  "role": "assistant",
  "content": "検索結果のサマリーテキスト...",
  "location": "京都",        // (Optional) 特定された場所
  "ics_data": "BEGIN:VCALENDAR..." // (Optional) 生成されたICSデータ
}
```

## 5. 技術スタック詳細

### Frontend
*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **State Management**: React Hooks (`useChat`)

### Backend
*   **Framework**: FastAPI
*   **Language**: Python 3.9
*   **Browser Automation**: Playwright
*   **HTTP Client**: httpx
*   **Calendar**: ics

## 6. 今後の拡張計画 (Roadmap)
1.  **高度な自然言語処理**: キーワードマッチングからLLM (Gemini/OpenAI) への移行による意図理解の向上。
2.  **Booking機能**: ホテル・航空券の予約APIとの連携。
3.  **ユーザー管理**: DBを用いたチャット履歴の永続化とユーザーアカウント管理。
