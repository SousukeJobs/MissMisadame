from api import app, db
from api.routes import User, Problem

def show_db_contents():
    with app.app_context():
        print("\n=== ユーザー一覧 ===")
        users = User.query.all()
        for user in users:
            print(f"\nユーザーID: {user.id}")
            print(f"ユーザー名: {user.username}")
            print(f"メールアドレス: {user.email}")

        print("\n=== 問題一覧 ===")
        problems = Problem.query.all()
        for problem in problems:
            print(f"\n問題ID: {problem.id}")
            print(f"問題文: {problem.question}")
            print(f"解答: {problem.answer}")
            print(f"ミスの理由: {problem.mistake_reason}")
            print(f"ミスの種類: {problem.mistake_type}")
            print(f"作成日時: {problem.created_at}")
            print(f"ユーザーID: {problem.user_id}")

if __name__ == '__main__':
    show_db_contents() 