from flask import Blueprint, jsonify, request, send_from_directory
from datetime import datetime, timedelta
import os

hr_routes = Blueprint('hr_routes', __name__)

# Mock contractor database
CONTRACTORS = [
    {"id": "C-001", "name": "Azril Rahman", "position": "Senior Software Engineer", "contract_expiry": "2025-12-31"},
    {"id": "C-002", "name": "Sharifah Aminah", "position": "Project Manager", "contract_expiry": "2025-08-15"},
    {"id": "C-003", "name": "Ahmad Hassan", "position": "DevOps Engineer", "contract_expiry": "2025-07-30"},
    {"id": "C-004", "name": "Siti Nurhaliza", "position": "UX Designer", "contract_expiry": "2025-09-20"},
    {"id": "C-005", "name": "Rahman Ali", "position": "Data Analyst", "contract_expiry": "2025-11-15"},
    {"id": "C-006", "name": "Fatimah Zahra", "position": "HR Specialist", "contract_expiry": "2025-08-05"},
    {"id": "C-007", "name": "Omar Ibrahim", "position": "Security Consultant", "contract_expiry": "2026-02-28"},
    {"id": "C-008", "name": "Aisha Mohamed", "position": "Quality Assurance", "contract_expiry": "2025-07-28"}
]

@hr_routes.route("/contracts", methods=["GET"])
def list_contracts():
    return jsonify({"contracts": CONTRACTORS})

@hr_routes.route("/contracts/expiring", methods=["GET"])
def expiring_contracts():
    today = datetime.now().date()
    thirty_days = today + timedelta(days=30)
    
    expiring = []
    for contractor in CONTRACTORS:
        expiry_date = datetime.strptime(contractor["contract_expiry"], "%Y-%m-%d").date()
        if expiry_date <= thirty_days:
            expiring.append(contractor)
    
    return jsonify({"contracts": expiring})

# Mock onboarding database
ONBOARDING_STAFF = [
    {
        "id": "S-001",
        "name": "John Smith",
        "position": "Software Developer",
        "start_date": "2025-08-01",
        "tasks": [
            {"id": 0, "name": "Complete IT setup and receive laptop", "completed": True},
            {"id": 1, "name": "Sign employment contract and NDA", "completed": True},
            {"id": 2, "name": "Complete security badge photo and access card", "completed": False},
            {"id": 3, "name": "Attend company orientation session", "completed": False},
            {"id": 4, "name": "Meet with direct manager for role overview", "completed": False},
            {"id": 5, "name": "Complete mandatory HR training modules", "completed": False},
            {"id": 6, "name": "Set up development environment and tools", "completed": False}
        ]
    },
    {
        "id": "S-002", 
        "name": "Maria Garcia",
        "position": "Marketing Specialist",
        "start_date": "2025-07-28",
        "tasks": [
            {"id": 0, "name": "Complete IT setup and receive laptop", "completed": True},
            {"id": 1, "name": "Sign employment contract and NDA", "completed": True},
            {"id": 2, "name": "Complete security badge photo and access card", "completed": True},
            {"id": 3, "name": "Attend company orientation session", "completed": True},
            {"id": 4, "name": "Meet with direct manager for role overview", "completed": False},
            {"id": 5, "name": "Complete mandatory HR training modules", "completed": False},
            {"id": 6, "name": "Access marketing tools and platforms", "completed": False},
            {"id": 7, "name": "Review brand guidelines and style guide", "completed": False}
        ]
    },
    {
        "id": "S-003",
        "name": "David Chen", 
        "position": "Data Analyst",
        "start_date": "2025-08-05",
        "tasks": [
            {"id": 0, "name": "Complete IT setup and receive laptop", "completed": False},
            {"id": 1, "name": "Sign employment contract and NDA", "completed": False},
            {"id": 2, "name": "Complete security badge photo and access card", "completed": False},
            {"id": 3, "name": "Attend company orientation session", "completed": False},
            {"id": 4, "name": "Meet with direct manager for role overview", "completed": False},
            {"id": 5, "name": "Complete mandatory HR training modules", "completed": False},
            {"id": 6, "name": "Set up data analysis tools and database access", "completed": False}
        ]
    }
]

@hr_routes.route("/onboarding", methods=["GET"])
def list_onboarding():
    return jsonify({"staff": ONBOARDING_STAFF})

@hr_routes.route("/onboarding/<staff_id>/toggle", methods=["POST"])
def toggle_onboarding_task(staff_id):
    data = request.get_json()
    task_id = data.get('task_id')
    
    if task_id is None:
        return jsonify({"error": "task_id is required"}), 400
    
    # Find the staff member
    staff_member = None
    for staff in ONBOARDING_STAFF:
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
    
    return jsonify({
        "success": True,
        "staff_id": staff_id,
        "task_id": task_id,
        "completed": updated_task['completed']
    })

# Mock resource files database
RESOURCE_FILES = [
    {
        "id": "R-001",
        "title": "Employee Handbook 2025",
        "filename": "employee-handbook-2025.pdf",
        "file_type": "pdf",
        "file_size": "2.4 MB",
        "description": "Complete guide to company policies and procedures",
        "allowed_roles": ["admin", "hr", "manager", "engineer", "marketing"],
        "upload_date": "2025-01-15"
    },
    {
        "id": "R-002", 
        "title": "System Architecture Documentation",
        "filename": "system-architecture.pdf",
        "file_type": "pdf",
        "file_size": "5.1 MB",
        "description": "Technical documentation for system architecture",
        "allowed_roles": ["admin", "engineer", "manager"],
        "upload_date": "2025-01-20"
    },
    {
        "id": "R-003",
        "title": "Salary & Benefits Guide",
        "filename": "salary-benefits-2025.pdf", 
        "file_type": "pdf",
        "file_size": "1.8 MB",
        "description": "Confidential salary scales and benefits information",
        "allowed_roles": ["admin", "hr", "manager"],
        "upload_date": "2025-01-10"
    },
    {
        "id": "R-004",
        "title": "Marketing Campaign Templates",
        "filename": "marketing-templates.zip",
        "file_type": "zip",
        "file_size": "12.3 MB", 
        "description": "Brand templates and marketing materials",
        "allowed_roles": ["admin", "marketing", "manager"],
        "upload_date": "2025-01-22"
    },
    {
        "id": "R-005",
        "title": "Security Protocols",
        "filename": "security-protocols.pdf",
        "file_type": "pdf",
        "file_size": "3.2 MB",
        "description": "Cybersecurity policies and incident response procedures",
        "allowed_roles": ["admin", "engineer", "manager"],
        "upload_date": "2025-01-18"
    },
    {
        "id": "R-006",
        "title": "Public Company Information",
        "filename": "company-info.pdf",
        "file_type": "pdf", 
        "file_size": "950 KB",
        "description": "General company information and public documents",
        "allowed_roles": ["admin", "hr", "manager", "engineer", "marketing", "intern"],
        "upload_date": "2025-01-25"
    },
    {
        "id": "R-007",
        "title": "Development Standards",
        "filename": "dev-standards.docx",
        "file_type": "docx",
        "file_size": "680 KB",
        "description": "Coding standards and development best practices",
        "allowed_roles": ["admin", "engineer", "manager"],
        "upload_date": "2025-01-19"
    },
    {
        "id": "R-008",
        "title": "HR Forms & Templates",
        "filename": "hr-forms.zip",
        "file_type": "zip",
        "file_size": "4.7 MB",
        "description": "Collection of HR forms and document templates",
        "allowed_roles": ["admin", "hr", "manager"],
        "upload_date": "2025-01-12"
    }
]

@hr_routes.route("/resources", methods=["GET"])
def list_resources():
    user_role = request.args.get('role', '').lower()
    
    if not user_role:
        return jsonify({"error": "Role parameter is required"}), 400
    
    # Filter resources based on user role
    accessible_resources = []
    for resource in RESOURCE_FILES:
        if user_role in resource['allowed_roles']:
            accessible_resources.append(resource)
    
    return jsonify({
        "resources": accessible_resources,
        "role": user_role,
        "total_count": len(accessible_resources)
    })

@hr_routes.route("/files/<filename>", methods=["GET"])
def serve_file(filename):
    user_role = request.args.get('role', '').lower()
    
    if not user_role:
        return jsonify({"error": "Role parameter is required"}), 400
    
    # Find the requested file
    requested_file = None
    for resource in RESOURCE_FILES:
        if resource['filename'] == filename:
            requested_file = resource
            break
    
    if not requested_file:
        return jsonify({"error": "File not found"}), 404
    
    # Check if user role has access
    if user_role not in requested_file['allowed_roles']:
        return jsonify({"error": "Access denied - insufficient permissions"}), 403
    
    # In a real implementation, this would serve the actual file
    # For now, return file information as simulation
    return jsonify({
        "message": f"File '{filename}' would be served here",
        "file_info": requested_file,
        "access_granted": True,
        "user_role": user_role
    })
