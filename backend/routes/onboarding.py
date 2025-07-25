from flask import Blueprint, jsonify, request
import json
import os
import time

onboarding_bp = Blueprint('onboarding', __name__)

def load_onboarding_data():
    """Load onboarding data from JSON file with error handling"""
    try:
        mock_path = os.path.join(os.path.dirname(__file__), '..', '..', 'mock', 'onboarding.json')
        with open(mock_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

def save_onboarding_data(data):
    """Save onboarding data to JSON file"""
    try:
        mock_path = os.path.join(os.path.dirname(__file__), '..', '..', 'mock', 'onboarding.json')
        with open(mock_path, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception:
        return False

def check_role_access(user_role, feature='onboarding'):
    """Check if user role has access to onboarding feature"""
    role_permissions = {
        'admin': ['onboarding', 'contracts', 'resources', 'uploads'],
        'hr': ['onboarding', 'contracts'],
        'manager': ['onboarding'],
        'engineer': ['onboarding'],  # Read-only for engineers
        'marketing': ['onboarding'],  # Read-only for marketing
        'intern': ['onboarding']  # Read-only for interns
    }
    
    return feature in role_permissions.get(user_role, [])

@onboarding_bp.route("/onboarding", methods=["GET"])
def list_onboarding():
    """Get onboarding data with role-based access"""
    time.sleep(0.4)  # Simulate API delay
    
    user_role = request.args.get('role', '').lower()
    if not user_role:
        return jsonify({"error": "Role parameter is required"}), 400
    
    if not check_role_access(user_role, 'onboarding'):
        return jsonify({"error": "Access denied - insufficient permissions"}), 403
    
    staff_data = load_onboarding_data()
    if not staff_data:
        return jsonify({"error": "Error loading onboarding data"}), 500
    
    return jsonify({
        "staff": staff_data,
        "role": user_role,
        "total_count": len(staff_data)
    })

@onboarding_bp.route("/onboarding/<staff_id>/toggle", methods=["POST"])
def toggle_onboarding_task(staff_id):
    """Toggle task completion status"""
    time.sleep(0.3)  # Simulate API delay
    
    user_role = request.form.get('role') or request.args.get('role', '').lower()
    if not user_role:
        return jsonify({"error": "Role parameter is required"}), 400
    
    # Only admin and HR can modify onboarding tasks
    if user_role not in ['admin', 'hr']:
        return jsonify({"error": "Access denied - insufficient permissions to modify tasks"}), 403
    
    data = request.get_json()
    task_id = data.get('task_id')
    
    if task_id is None:
        return jsonify({"error": "task_id is required"}), 400
    
    # Load current data
    staff_data = load_onboarding_data()
    if not staff_data:
        return jsonify({"error": "Error loading onboarding data"}), 500
    
    # Find the staff member
    staff_member = None
    for staff in staff_data:
        if staff['id'] == staff_id:
            staff_member = staff
            break
    
    if not staff_member:
        return jsonify({"error": "Staff member not found"}), 404
    
    # Find and toggle the task
    task_found = False
    updated_task = None
    for task in staff_member['tasks']:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            updated_task = task
            task_found = True
            break
    
    if not task_found:
        return jsonify({"error": "Task not found"}), 404
    
    # Save updated data
    if not save_onboarding_data(staff_data):
        return jsonify({"error": "Failed to save changes"}), 500
    
    return jsonify({
        "success": True,
        "staff_id": staff_id,
        "task_id": task_id,
        "completed": updated_task['completed'],
        "message": f"Task {'completed' if updated_task['completed'] else 'marked incomplete'}"
    })