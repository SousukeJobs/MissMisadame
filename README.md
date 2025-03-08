# 間違い博物館（Mistakes Museum）

学習中の間違いを記録・分析するためのWebアプリケーション

## 機能

- ユーザー認証（登録・ログイン）
- 問題の登録・編集・削除
- 間違いの種類別の統計
- 問題の検索・フィルタリング
- プロフィール管理

## 技術スタック

### バックエンド
- Python
- Flask
- SQLAlchemy
- JWT認証

### フロントエンド
- Next.js
- TypeScript
- React
- TailwindCSS

## セットアップ

### バックエンド

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python init_db.py
python run.py
```

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

## 使用方法

1. http://localhost:3000 にアクセス
2. アカウントを作成またはログイン
3. 問題を登録
4. 統計を確認
5. 問題を検索・フィルタリング

## 環境変数

バックエンドの`.env`ファイルに以下を設定：

```
FLASK_APP=run.py
FLASK_ENV=development
DATABASE_URL=sqlite:///mistakes.db
SECRET_KEY=your-secret-key
```

## ライセンス

MIT License
