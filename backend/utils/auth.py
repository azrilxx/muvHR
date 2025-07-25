from functools import wraps
from flask import request, jsonify
import logging

logger = logging.getLogger(__name__)

# Role-based permissions mapping
role_permissions = {
    'admin': ['contracts', 'onboarding', 'uploads', 'resources', 'time-off', 'time-tracking', 'groups', 'entities'],
    'hr': ['contracts', 'onboarding', 'uploads', 'resources', 'time-off', 'time-tracking', 'groups'],
    'manager': ['contracts', 'uploads', 'resources', 'time-off'],
    'engineer': ['uploads', 'resources'],
    'marketing': ['uploads', 'resources'],
    'intern': ['resources'],
}

def role_required(feature):
    """
    Decorator to enforce role-based access control
    
    Args:
        feature (str): The feature/module being accessed
    
    Returns:
        function: Decorator function
    """
    def wrapper(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get role from request parameters (temporary for testing)
            # In production, this would come from JWT token or session
            role = request.args.get("role", "").lower()
            
            logger.info(f"Access attempt: role={role}, feature={feature}")
            
            if not role:
                logger.warning("No role provided in request")
                return jsonify({"error": "Role is required", "success": False}), 401
            
            # Check if role exists and has permission for the feature
            if role not in role_permissions:
                logger.warning(f"Invalid role: {role}")
                return jsonify({"error": "Invalid role", "success": False}), 401
            
            if feature not in role_permissions[role]:
                logger.warning(f"Access denied: role={role}, feature={feature}")
                return jsonify({"error": "Access denied for this role", "success": False}), 403
            
            logger.info(f"Access granted: role={role}, feature={feature}")
            return f(*args, **kwargs)
        
        return decorated_function
    return wrapper

def get_user_permissions(role):
    """
    Get all permissions for a given role
    
    Args:
        role (str): User role
    
    Returns:
        list: List of permissions for the role
    """
    return role_permissions.get(role.lower(), [])