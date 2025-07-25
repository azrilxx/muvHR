from flask import Blueprint, jsonify, request
import json
import os
import time

resources_bp = Blueprint('resources', __name__)

def load_resources_data():
    """Load resources from JSON file with error handling"""
    try:
        mock_path = os.path.join(os.path.dirname(__file__), '..', '..', 'mock', 'resources.json')
        with open(mock_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

def check_role_access(user_role, feature='resources'):
    """Check if user role has access to resources feature"""
    role_permissions = {
        'admin': ['resources', 'contracts', 'onboarding', 'uploads'],
        'hr': ['resources'],
        'manager': ['resources'],
        'engineer': ['resources'],
        'marketing': ['resources'],
        'intern': ['resources']  # Limited access - filtered by allowed_roles
    }
    
    return feature in role_permissions.get(user_role, [])

@resources_bp.route("/resources", methods=["GET"])
def list_resources():
    """Get resources filtered by user role"""
    time.sleep(0.4)  # Simulate API delay
    
    user_role = request.args.get('role', '').lower()
    
    if not user_role:
        return jsonify({"error": "Role parameter is required"}), 400
    
    if not check_role_access(user_role, 'resources'):
        return jsonify({"error": "Access denied - insufficient permissions"}), 403
    
    resources = load_resources_data()
    if not resources:
        return jsonify({"error": "Error loading resources data"}), 500
    
    # Filter resources based on user role
    accessible_resources = []
    for resource in resources:
        if user_role in resource.get('allowed_roles', []):
            accessible_resources.append(resource)
    
    return jsonify({
        "resources": accessible_resources,
        "role": user_role,
        "total_count": len(accessible_resources)
    })

@resources_bp.route("/files/<filename>", methods=["GET"])
def serve_file(filename):
    """Serve or provide file info with role-based access control"""
    time.sleep(0.3)  # Simulate API delay
    
    user_role = request.args.get('role', '').lower()
    
    if not user_role:
        return jsonify({"error": "Role parameter is required"}), 400
    
    if not check_role_access(user_role, 'resources'):
        return jsonify({"error": "Access denied - insufficient permissions"}), 403
    
    resources = load_resources_data()
    
    # Find the requested file
    requested_file = None
    for resource in resources:
        if resource['filename'] == filename:
            requested_file = resource
            break
    
    if not requested_file:
        return jsonify({"error": "File not found"}), 404
    
    # Check if user role has access to this specific file
    if user_role not in requested_file.get('allowed_roles', []):
        return jsonify({"error": "Access denied - insufficient permissions for this file"}), 403
    
    # In a real implementation, this would serve the actual file
    # For now, return file information as simulation
    return jsonify({
        "message": f"File '{filename}' access granted",
        "file_info": requested_file,
        "access_granted": True,
        "user_role": user_role,
        "note": "In production, this would serve the actual file content"
    })