from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    """Initialize SQLAlchemy with Flask app"""
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///muvhr.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        from backend.models.contract import Contract
        db.create_all()
        print("Database tables created successfully!")