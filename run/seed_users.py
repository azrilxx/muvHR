import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.models.user import User
from backend.db import db
from backend.app import app
from flask_bcrypt import generate_password_hash

def seed_users():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Check if user already exists
        if not User.query.filter_by(username="azril").first():
            # Create default admin user
            admin_user = User(
                username="azril",
                password_hash=generate_password_hash("muvon123").decode("utf-8"),
                role="admin"
            )
            db.session.add(admin_user)
            db.session.commit()
            print("Default admin user 'azril' created successfully!")
        else:
            print("Default admin user 'azril' already exists.")

if __name__ == "__main__":
    seed_users()