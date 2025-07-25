from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, current_user
from backend.models.user import User
from backend.db import db
from flask_bcrypt import check_password_hash
from functools import wraps

auth_bp = Blueprint("auth", __name__)

# Role permissions mapping
role_permissions = {
    "admin": ["Contractors", "Onboarding", "Resources", "Upload", "Time Off", "Time Tracking", "Groups", "Entities", "Roles & Permissions", "Billing & Payments"],
    "hr": ["Contractors", "Onboarding", "Resources", "Upload", "Time Off", "Time Tracking", "Groups"],
    "manager": ["Contractors", "Resources", "Upload", "Time Off"],
    "engineer": ["Resources", "Upload"],
    "marketing": ["Resources", "Upload"],
    "intern": ["Resources"]
}

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password required"}), 400
        
    user = User.query.filter_by(username=data["username"]).first()
    if user and user.check_password(data["password"]):
        login_user(user)
        return jsonify({"success": True, "role": user.role})
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"success": True})

@auth_bp.route("/me")
def me():
    if not current_user.is_authenticated:
        return jsonify({"role": None, "authenticated": False})
    return jsonify({"role": current_user.role, "username": current_user.username, "authenticated": True})

def role_required(feature):
    """Wrapper to secure any endpoint based on feature access"""
    def wrapper(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                return jsonify({"error": "Not logged in"}), 401
            
            role = current_user.role.lower()
            if role not in role_permissions or feature not in role_permissions[role]:
                return jsonify({"error": "Access denied"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return wrapper