import os
from api import app, db
import logging

# ロギングの設定
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    port = int(os.environ.get('PORT', 5001))
    logger.info(f"Starting server on port {port}")
    logger.info(f"Available routes:")
    for rule in app.url_map.iter_rules():
        logger.info(f"{rule.endpoint}: {rule.methods} {rule}")
    
    app.run(host='0.0.0.0', port=port, debug=True) 