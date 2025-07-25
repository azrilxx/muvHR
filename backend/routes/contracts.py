from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import json
import os
import time

contracts_bp = Blueprint('contracts', __name__)

def load_contracts():
    """Load contracts from JSON file with error handling"""
    try:
        mock_path = os.path.join(os.path.dirname(__file__), '..', '..', 'mock', 'contracts.json')
        with open(mock_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

def check_role_access(user_role, feature='contracts'):
    """Check if user role has access to contracts feature"""
    role_permissions = {
        'admin': ['contracts', 'onboarding', 'resources', 'uploads'],
        'hr': ['contracts', 'onboarding'],
        'manager': ['contracts'],
        'engineer': [],
        'marketing': [],
        'intern': []
    }
    
    return feature in role_permissions.get(user_role, [])

@contracts_bp.route("/contracts", methods=["GET"])
def list_contracts():
    """Get contracts with role-based filtering"""
    time.sleep(0.3)  # Simulate API delay
    
    user_role = request.args.get('role', '').lower()
    if not user_role:
        return jsonify({"error": "Role parameter is required"}), 400
    
    # Check role permissions
    if not check_role_access(user_role, 'contracts'):
        return jsonify({"error": "Access denied - insufficient permissions"}), 403
    
    contracts = load_contracts()
    if not contracts:
        return jsonify({"error": "Error loading contracts data"}), 500
    
    # Filter based on role (manager sees only their team, others see all)
    if user_role == 'manager':
        # In a real system, this would filter by team/department
        # For demo, showing all but could be filtered
        pass
    
    return jsonify({
        "contracts": contracts,
        "role": user_role,
        "total_count": len(contracts)
    })

@contracts_bp.route("/contracts/expiring", methods=["GET"])
def expiring_contracts():
    """Get contracts expiring within 30 days"""
    time.sleep(0.3)  # Simulate API delay
    
    user_role = request.args.get('role', '').lower()
    if not user_role:
        return jsonify({"error": "Role parameter is required"}), 400
    
    if not check_role_access(user_role, 'contracts'):
        return jsonify({"error": "Access denied - insufficient permissions"}), 403
    
    contracts = load_contracts()
    if not contracts:
        return jsonify({"error": "Error loading contracts data"}), 500
    
    today = datetime.now().date()
    thirty_days = today + timedelta(days=30)
    
    expiring = []
    for contractor in contracts:
        try:
            expiry_date = datetime.strptime(contractor["contract_expiry"], "%Y-%m-%d").date()
            if expiry_date <= thirty_days:
                expiring.append(contractor)
        except ValueError:
            continue
    
    return jsonify({
        "contracts": expiring,
        "role": user_role,
        "total_count": len(expiring)
    })