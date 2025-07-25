from flask import Flask, render_template, jsonify
from flask_cors import CORS
from flask_login import LoginManager
import json
import os
from datetime import datetime, timedelta
import random
import logging
from backend.db import init_db, db
from backend.utils.auth import role_required
from backend.models.contract import Contract
from backend.models.user import User

app = Flask(__name__, template_folder='../templates', static_folder='../static')
app.config['SECRET_KEY'] = 'muvhr-secret-key-change-in-production'
CORS(app)

# Initialize database
init_db(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==========================================
# MOCK DATA FOR ALL MODULES
# ==========================================

# Mock data for contractors (existing)
mock_contractors = [
    {"id": "C001", "name": "John Smith", "position": "Senior Developer", "contract_expiry": "2025-08-15"},
    {"id": "C002", "name": "Sarah Johnson", "position": "UX Designer", "contract_expiry": "2025-07-30"},
    {"id": "C003", "name": "Mike Davis", "position": "DevOps Engineer", "contract_expiry": "2025-09-12"},
    {"id": "C004", "name": "Lisa Chen", "position": "Project Manager", "contract_expiry": "2025-06-05"},
    {"id": "C005", "name": "Alex Rodriguez", "position": "Marketing Specialist", "contract_expiry": "2025-10-20"}
]

# Mock data for onboarding (existing)
mock_onboarding_staff = [
    {
        "id": "S001",
        "name": "Emma Wilson",
        "position": "Frontend Developer",
        "start_date": "2025-07-01",
        "tasks": [
            {"id": 1, "name": "Complete IT setup and security training", "completed": True},
            {"id": 2, "name": "Review company handbook and policies", "completed": True},
            {"id": 3, "name": "Meet with direct manager and team", "completed": False},
            {"id": 4, "name": "Set up development environment", "completed": False},
            {"id": 5, "name": "Complete first week orientation program", "completed": False}
        ]
    },
    {
        "id": "S002", 
        "name": "James Parker",
        "position": "Data Analyst",
        "start_date": "2025-07-15",
        "tasks": [
            {"id": 1, "name": "Complete IT setup and security training", "completed": True},
            {"id": 2, "name": "Review company handbook and policies", "completed": False},
            {"id": 3, "name": "Meet with direct manager and team", "completed": False},
            {"id": 4, "name": "Access data systems and tools", "completed": False},
            {"id": 5, "name": "Complete compliance training", "completed": False}
        ]
    }
]

# Mock data for resources (existing/enhanced)
mock_resources = {
    "Admin": [
        {"title": "HR Policy Manual", "description": "Complete HR policies and procedures", "file_type": "pdf", "file_size": "2.5MB", "upload_date": "2025-01-15", "filename": "hr_policy_manual.pdf", "allowed_roles": ["Admin", "HR Specialist"]},
        {"title": "Employee Handbook", "description": "Company rules and guidelines", "file_type": "pdf", "file_size": "1.8MB", "upload_date": "2025-01-10", "filename": "employee_handbook.pdf", "allowed_roles": ["Admin", "HR Specialist", "Manager", "Engineer", "Marketing", "Intern"]},
        {"title": "Salary Structure Guide", "description": "Confidential salary bands and structure", "file_type": "docx", "file_size": "850KB", "upload_date": "2025-01-20", "filename": "salary_structure.docx", "allowed_roles": ["Admin"]},
        {"title": "Legal Compliance Documents", "description": "Legal requirements and compliance", "file_type": "zip", "file_size": "5.2MB", "upload_date": "2025-01-12", "filename": "legal_compliance.zip", "allowed_roles": ["Admin", "HR Specialist"]}
    ],
    "HR Specialist": [
        {"title": "HR Policy Manual", "description": "Complete HR policies and procedures", "file_type": "pdf", "file_size": "2.5MB", "upload_date": "2025-01-15", "filename": "hr_policy_manual.pdf", "allowed_roles": ["Admin", "HR Specialist"]},
        {"title": "Employee Handbook", "description": "Company rules and guidelines", "file_type": "pdf", "file_size": "1.8MB", "upload_date": "2025-01-10", "filename": "employee_handbook.pdf", "allowed_roles": ["Admin", "HR Specialist", "Manager", "Engineer", "Marketing", "Intern"]},
        {"title": "Recruitment Guidelines", "description": "Hiring process and procedures", "file_type": "docx", "file_size": "1.2MB", "upload_date": "2025-01-18", "filename": "recruitment_guide.docx", "allowed_roles": ["Admin", "HR Specialist", "Manager"]}
    ],
    "Manager": [
        {"title": "Employee Handbook", "description": "Company rules and guidelines", "file_type": "pdf", "file_size": "1.8MB", "upload_date": "2025-01-10", "filename": "employee_handbook.pdf", "allowed_roles": ["Admin", "HR Specialist", "Manager", "Engineer", "Marketing", "Intern"]},
        {"title": "Management Best Practices", "description": "Team leadership guidelines", "file_type": "pdf", "file_size": "1.5MB", "upload_date": "2025-01-22", "filename": "management_guide.pdf", "allowed_roles": ["Admin", "Manager"]},
        {"title": "Performance Review Templates", "description": "Annual review templates", "file_type": "docx", "file_size": "750KB", "upload_date": "2025-01-14", "filename": "performance_templates.docx", "allowed_roles": ["Admin", "HR Specialist", "Manager"]}
    ],
    "Engineer": [
        {"title": "Employee Handbook", "description": "Company rules and guidelines", "file_type": "pdf", "file_size": "1.8MB", "upload_date": "2025-01-10", "filename": "employee_handbook.pdf", "allowed_roles": ["Admin", "HR Specialist", "Manager", "Engineer", "Marketing", "Intern"]},
        {"title": "Technical Documentation", "description": "Development standards and practices", "file_type": "pdf", "file_size": "3.2MB", "upload_date": "2025-01-16", "filename": "tech_docs.pdf", "allowed_roles": ["Admin", "Manager", "Engineer"]}
    ],
    "Marketing": [
        {"title": "Employee Handbook", "description": "Company rules and guidelines", "file_type": "pdf", "file_size": "1.8MB", "upload_date": "2025-01-10", "filename": "employee_handbook.pdf", "allowed_roles": ["Admin", "HR Specialist", "Manager", "Engineer", "Marketing", "Intern"]},
        {"title": "Brand Guidelines", "description": "Company branding standards", "file_type": "pdf", "file_size": "4.1MB", "upload_date": "2025-01-19", "filename": "brand_guidelines.pdf", "allowed_roles": ["Admin", "Manager", "Marketing"]}
    ],
    "Intern": [
        {"title": "Employee Handbook", "description": "Company rules and guidelines", "file_type": "pdf", "file_size": "1.8MB", "upload_date": "2025-01-10", "filename": "employee_handbook.pdf", "allowed_roles": ["Admin", "HR Specialist", "Manager", "Engineer", "Marketing", "Intern"]},
        {"title": "Intern Orientation Guide", "description": "Getting started as an intern", "file_type": "pdf", "file_size": "900KB", "upload_date": "2025-01-21", "filename": "intern_guide.pdf", "allowed_roles": ["Admin", "HR Specialist", "Intern"]}
    ]
}

# NEW: Mock data for Time Off
mock_time_off = {
    "policies": [
        {"type": "Annual Leave", "days_per_year": 25, "carryover_limit": 5, "description": "Standard vacation days"},
        {"type": "Sick Leave", "days_per_year": 10, "carryover_limit": 0, "description": "Medical leave for illness"},
        {"type": "Personal Days", "days_per_year": 3, "carryover_limit": 0, "description": "Personal emergency days"},
        {"type": "Maternity/Paternity", "days_per_year": 90, "carryover_limit": 0, "description": "Parental leave"},
        {"type": "Bereavement", "days_per_year": 5, "carryover_limit": 0, "description": "Family bereavement leave"}
    ],
    "upcoming_time_off": [
        {"employee": "John Smith", "type": "Annual Leave", "start_date": "2025-08-01", "end_date": "2025-08-05", "status": "Approved"},
        {"employee": "Sarah Johnson", "type": "Personal Days", "start_date": "2025-07-28", "end_date": "2025-07-28", "status": "Pending"},
        {"employee": "Mike Davis", "type": "Annual Leave", "start_date": "2025-08-10", "end_date": "2025-08-15", "status": "Approved"}
    ]
}

# NEW: Mock data for Time Tracking
mock_time_tracking = {
    "current_week": [
        {"date": "2025-07-21", "hours": 8.5, "project": "MuvHR Development", "description": "Frontend implementation"},
        {"date": "2025-07-22", "hours": 8.0, "project": "MuvHR Development", "description": "Backend API work"},
        {"date": "2025-07-23", "hours": 7.5, "project": "Client Meeting", "description": "Project review and planning"},
        {"date": "2025-07-24", "hours": 8.0, "project": "MuvHR Development", "description": "Testing and debugging"},
        {"date": "2025-07-25", "hours": 6.0, "project": "MuvHR Development", "description": "Documentation and review"}
    ],
    "weekly_summary": {
        "total_hours": 38.0,
        "expected_hours": 40.0,
        "projects": ["MuvHR Development", "Client Meeting"],
        "status": "In Progress"
    }
}

# NEW: Mock data for Groups
mock_groups = {
    "departments": [
        {"name": "Engineering", "members": ["John Smith", "Emma Wilson", "Mike Davis"], "manager": "Sarah Tech", "budget": "$250,000"},
        {"name": "Marketing", "members": ["Alex Rodriguez", "Lisa Chen"], "manager": "Mark Brand", "budget": "$150,000"},
        {"name": "Human Resources", "members": ["Anna HR", "Bob People"], "manager": "Carol Chief", "budget": "$120,000"},
        {"name": "Operations", "members": ["Dave Ops", "Eve Logistics"], "manager": "Frank Execute", "budget": "$180,000"}
    ],
    "teams": [
        {"name": "Frontend Team", "members": ["Emma Wilson", "Jake React"], "lead": "Emma Wilson", "focus": "User Interface"},
        {"name": "Backend Team", "members": ["John Smith", "Mike Davis"], "lead": "John Smith", "focus": "Server & APIs"},
        {"name": "DevOps Team", "members": ["Mike Davis", "Sam Cloud"], "lead": "Mike Davis", "focus": "Infrastructure"}
    ]
}

# NEW: Mock data for Entities
mock_entities = [
    {"id": "ENT001", "name": "Muvon Energy Corp", "type": "Parent Company", "location": "New York, USA", "employees": 150, "status": "Active"},
    {"id": "ENT002", "name": "Muvon Energy Europe", "type": "Subsidiary", "location": "London, UK", "employees": 45, "status": "Active"},
    {"id": "ENT003", "name": "Muvon Tech Solutions", "type": "Division", "location": "San Francisco, USA", "employees": 80, "status": "Active"},
    {"id": "ENT004", "name": "Muvon Energy APAC", "type": "Regional Office", "location": "Singapore", "employees": 25, "status": "Active"}
]

# NEW: Mock data for uploaded files
mock_uploaded_files = [
    {"id": "F001", "title": "Q1 Financial Report", "original_filename": "q1_finance.pdf", "file_type": "pdf", "file_size": "2.1MB", "category": "hr-documents", "uploaded_by": "Admin", "upload_date": "2025-01-15", "upload_time": "14:30"},
    {"id": "F002", "title": "Team Building Photos", "original_filename": "team_photos.zip", "file_type": "zip", "file_size": "15.6MB", "category": "other", "uploaded_by": "HR Specialist", "upload_date": "2025-01-20", "upload_time": "10:15"}
]

# ==========================================
# ROLE-BASED ACCESS CONTROL
# ==========================================

role_module_access = {
    "Admin": ["Contractors", "Onboarding", "Resources", "Upload", "Time Off", "Time Tracking", "Groups", "Entities", "Roles & Permissions", "Billing & Payments"],
    "HR Specialist": ["Contractors", "Onboarding", "Resources", "Upload", "Time Off", "Time Tracking", "Groups"],
    "Manager": ["Contractors", "Resources", "Upload", "Time Off"],
    "Engineer": ["Resources", "Upload"],
    "Marketing": ["Resources", "Upload"],
    "Intern": ["Resources"]
}

# ==========================================
# ROUTES
# ==========================================

@app.route("/")
def index():
    return render_template("index.html")

def format_role_name(role):
    """Convert role keys to proper format"""
    role_mapping = {
        'Admin': 'Admin',
        'Hr Specialist': 'HR Specialist',
        'Manager': 'Manager',
        'Engineer': 'Engineer',
        'Marketing': 'Marketing',
        'Intern': 'Intern'
    }
    return role_mapping.get(role, role)

@app.route("/api/role-access/<role>")
def get_role_access(role):
    role_formatted = format_role_name(role)
    if role_formatted in role_module_access:
        return jsonify({
            "role": role_formatted,
            "modules": role_module_access[role_formatted],
            "success": True
        })
    return jsonify({"error": "Invalid role", "success": False}), 400

@app.route("/api/contractors/<role>")
@role_required("contracts")
def get_contractors(role):
    logger.info(f"Fetching contractors for role: {role}")
    try:
        # Fetch contractors from database
        contracts = Contract.query.all()
        contractors_data = [contract.to_dict() for contract in contracts]
        
        logger.info(f"Successfully returned {len(contractors_data)} contractors from database")
        return jsonify({"contractors": contractors_data, "success": True})
    except Exception as e:
        logger.error(f"Database error fetching contractors: {str(e)}")
        return jsonify({"error": "Failed to fetch contractors", "success": False}), 500

@app.route("/api/onboarding/<role>")
@role_required("onboarding")
def get_onboarding(role):
    logger.info(f"Fetching onboarding data for role: {role}")
    role_formatted = format_role_name(role)
    if "Onboarding" in role_module_access.get(role_formatted, []):
        logger.info(f"Successfully returned {len(mock_onboarding_staff)} onboarding staff")
        return jsonify({"staff": mock_onboarding_staff, "success": True})
    logger.warning(f"Access denied for role: {role}")
    return jsonify({"error": "Access denied for this role", "success": False}), 403

@app.route("/api/resources/<role>")
@role_required("resources")
def get_resources(role):
    logger.info(f"Fetching resources for role: {role}")
    role_formatted = format_role_name(role)
    if "Resources" in role_module_access.get(role_formatted, []):
        resources_count = len(mock_resources.get(role_formatted, []))
        logger.info(f"Successfully returned {resources_count} resources for {role}")
        return jsonify({"resources": mock_resources.get(role_formatted, []), "success": True})
    logger.warning(f"Access denied for role: {role}")
    return jsonify({"error": "Access denied for this role", "success": False}), 403

@app.route("/api/time-off/<role>")
def get_time_off(role):
    role_formatted = format_role_name(role)
    if "Time Off" in role_module_access.get(role_formatted, []):
        return jsonify({"time_off": mock_time_off, "success": True})
    return jsonify({"error": "Access denied for this role", "success": False}), 403

@app.route("/api/time-tracking/<role>")
def get_time_tracking(role):
    role_formatted = format_role_name(role)
    if "Time Tracking" in role_module_access.get(role_formatted, []):
        return jsonify({"time_tracking": mock_time_tracking, "success": True})
    return jsonify({"error": "Access denied for this role", "success": False}), 403

@app.route("/api/groups/<role>")
def get_groups(role):
    role_formatted = format_role_name(role)
    if "Groups" in role_module_access.get(role_formatted, []):
        return jsonify({"groups": mock_groups, "success": True})
    return jsonify({"error": "Access denied for this role", "success": False}), 403

@app.route("/api/entities/<role>")
def get_entities(role):
    role_formatted = format_role_name(role)
    if "Entities" in role_module_access.get(role_formatted, []):
        return jsonify({"entities": mock_entities, "success": True})
    return jsonify({"error": "Access denied for this role", "success": False}), 403

@app.route("/api/upload", methods=["POST"])
@role_required("uploads")
def mock_upload():
    logger.info("File upload attempt")
    # Mock upload endpoint - just returns success
    logger.info("File uploaded successfully (mock)")
    return jsonify({
        "success": True,
        "message": "File uploaded successfully (mock)",
        "file_info": {
            "title": "Mock Upload",
            "filename": "mock_file.pdf"
        }
    })

@app.route("/api/files")
def get_uploaded_files():
    return jsonify({"files": mock_uploaded_files, "success": True})

# Register auth blueprint
from backend.routes.auth import auth_bp
app.register_blueprint(auth_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)