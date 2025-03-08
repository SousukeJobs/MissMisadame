from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
import logging

# ロギングの設定
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# 環境変数の読み込み
load_dotenv()

# Flaskアプリケーションの初期化
app = Flask(__name__)

# デバッグモードを有効化
app.debug = True

# シークレットキーの設定
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')

# シンプルなCORS設定
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)

# エラーハンドラー
@app.errorhandler(Exception)
def handle_error(error):
    logger.error(f"An error occurred: {str(error)}")
    logger.error(f"Error type: {type(error)}")
    return jsonify({"error": str(error)}), 500

# リクエストのログを記録
@app.before_request
def log_request_info():
    logger.debug('Headers: %s', dict(request.headers))
    logger.debug('Body: %s', request.get_data())
    logger.debug('URL: %s', request.url)
    logger.debug('Method: %s', request.method)

# レスポンスのログを記録とCORSヘッダーの設定
@app.after_request
def after_request(response):
    logger.debug('Response Headers: %s', dict(response.headers))
    logger.debug('Response: %s', response.get_data())
    return response

# データベース設定
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///mistakes.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# SQLAlchemyの初期化
db = SQLAlchemy(app)

# ルートの登録
from api import routes
