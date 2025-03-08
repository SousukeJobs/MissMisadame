from api import app, db
from api.routes import User, Problem

def init_db():
    with app.app_context():
        # データベースを作成
        db.drop_all()
        db.create_all()

        # テストユーザーを作成
        test_user = User(username='test', email='test@example.com')
        test_user.set_password('password')
        db.session.add(test_user)
        db.session.commit()

        print("データベースを初期化しました。")
        print("テストユーザーを作成しました:")
        print("ユーザー名: test")
        print("パスワード: password")

if __name__ == '__main__':
    init_db() 