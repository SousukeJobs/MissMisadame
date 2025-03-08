from flask import jsonify, request
from api import app, db
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps

# モデルの定義
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    problems = db.relationship('Problem', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Problem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    mistake_reason = db.Column(db.Text, nullable=False)
    mistake_type = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# JWT認証用のデコレータ
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'トークンがありません'}), 401

        try:
            token = token.split(' ')[1]  # Bearer トークンから実際のトークンを取得
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': '無効なトークンです'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# ユーザー登録API
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'このユーザー名は既に使用されています'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'このメールアドレスは既に使用されています'}), 400

    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'ユーザーが登録されました'}), 201

# ログインAPI
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'username': user.username,
            'message': 'ログインに成功しました'
        })
    
    return jsonify({'message': 'ユーザー名またはパスワードが間違っています'}), 401

# 問題の作成
@app.route('/api/problems', methods=['POST'])
@token_required
def create_problem(current_user):
    data = request.json
    new_problem = Problem(
        question=data['question'],
        answer=data['answer'],
        mistake_reason=data['mistake_reason'],
        mistake_type=data['mistake_type'],
        user_id=current_user.id
    )
    db.session.add(new_problem)
    db.session.commit()
    return jsonify({'message': '問題が作成されました', 'id': new_problem.id}), 201

# 全ての問題を取得
@app.route('/api/problems', methods=['GET'])
@token_required
def get_problems(current_user):
    problems = Problem.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': p.id,
        'question': p.question,
        'answer': p.answer,
        'mistake_reason': p.mistake_reason,
        'mistake_type': p.mistake_type,
        'created_at': p.created_at.isoformat()
    } for p in problems])

# 特定の問題を取得
@app.route('/api/problems/<int:id>', methods=['GET'])
@token_required
def get_problem(current_user, id):
    problem = Problem.query.filter_by(id=id, user_id=current_user.id).first_or_404()
    return jsonify({
        'id': problem.id,
        'question': problem.question,
        'answer': problem.answer,
        'mistake_reason': problem.mistake_reason,
        'mistake_type': problem.mistake_type,
        'created_at': problem.created_at.isoformat()
    })

# 問題の更新
@app.route('/api/problems/<int:id>', methods=['PUT'])
@token_required
def update_problem(current_user, id):
    problem = Problem.query.filter_by(id=id, user_id=current_user.id).first_or_404()
    data = request.json
    
    if 'question' in data:
        problem.question = data['question']
    if 'answer' in data:
        problem.answer = data['answer']
    if 'mistake_reason' in data:
        problem.mistake_reason = data['mistake_reason']
    if 'mistake_type' in data:
        problem.mistake_type = data['mistake_type']
    
    db.session.commit()
    return jsonify({
        'message': '問題が更新されました',
        'problem': {
            'id': problem.id,
            'question': problem.question,
            'answer': problem.answer,
            'mistake_reason': problem.mistake_reason,
            'mistake_type': problem.mistake_type,
            'created_at': problem.created_at.isoformat()
        }
    })

# 問題の削除
@app.route('/api/problems/<int:id>', methods=['DELETE'])
@token_required
def delete_problem(current_user, id):
    problem = Problem.query.filter_by(id=id, user_id=current_user.id).first_or_404()
    db.session.delete(problem)
    db.session.commit()
    return jsonify({'message': '問題が削除されました'})

# ミスの種類ごとの集計を取得
@app.route('/api/statistics', methods=['GET'])
@token_required
def get_statistics(current_user):
    stats = db.session.query(
        Problem.mistake_type,
        db.func.count(Problem.id)
    ).filter_by(user_id=current_user.id).group_by(Problem.mistake_type).all()
    
    return jsonify([{
        'mistake_type': type_,
        'count': count
    } for type_, count in stats])

# パスワード変更API
@app.route('/api/auth/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    data = request.json
    
    if not current_user.check_password(data['current_password']):
        return jsonify({'message': '現在のパスワードが間違っています'}), 400
        
    current_user.set_password(data['new_password'])
    db.session.commit()
    
    return jsonify({'message': 'パスワードが変更されました'})

# プロフィール更新API
@app.route('/api/auth/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.json
    
    if 'email' in data:
        if User.query.filter(User.id != current_user.id, User.email == data['email']).first():
            return jsonify({'message': 'このメールアドレスは既に使用されています'}), 400
        current_user.email = data['email']
    
    if 'username' in data:
        if User.query.filter(User.id != current_user.id, User.username == data['username']).first():
            return jsonify({'message': 'このユーザー名は既に使用されています'}), 400
        current_user.username = data['username']
    
    db.session.commit()
    return jsonify({
        'message': 'プロフィールが更新されました',
        'user': {
            'username': current_user.username,
            'email': current_user.email
        }
    })

# 問題の検索API
@app.route('/api/problems/search', methods=['GET'])
@token_required
def search_problems(current_user):
    query = request.args.get('query', '').strip()
    mistake_type = request.args.get('mistake_type', '').strip()
    sort_by = request.args.get('sort_by', 'created_at')
    order = request.args.get('order', 'desc')
    
    # 基本のクエリ
    problems_query = Problem.query.filter_by(user_id=current_user.id)
    
    # 検索条件を適用
    if query:
        problems_query = problems_query.filter(
            db.or_(
                Problem.question.ilike(f'%{query}%'),
                Problem.answer.ilike(f'%{query}%'),
                Problem.mistake_reason.ilike(f'%{query}%')
            )
        )
    
    if mistake_type:
        problems_query = problems_query.filter(Problem.mistake_type == mistake_type)
    
    # ソート順を適用
    if sort_by == 'created_at':
        problems_query = problems_query.order_by(
            Problem.created_at.desc() if order == 'desc' else Problem.created_at.asc()
        )
    
    problems = problems_query.all()
    return jsonify([{
        'id': p.id,
        'question': p.question,
        'answer': p.answer,
        'mistake_reason': p.mistake_reason,
        'mistake_type': p.mistake_type,
        'created_at': p.created_at.isoformat()
    } for p in problems])
