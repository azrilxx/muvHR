from flask import Blueprint, jsonify

hr_routes = Blueprint('hr_routes', __name__)

@hr_routes.route("/contracts", methods=["GET"])
def list_contracts():
    return jsonify({
        "contracts": [
            {"id": "C-001", "name": "Azril", "expires": "2025-12-31"},
            {"id": "C-002", "name": "Sharifah", "expires": "2025-09-15"}
        ]
    })
