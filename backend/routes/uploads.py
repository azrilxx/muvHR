from flask import Blueprint, jsonify, request
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import uuid
import json
import time

uploads_bp = Blueprint('uploads', __name__)

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

def load_uploads_data():
    """Load uploads from JSON file with error handling"""
    try:
        mock_path = os.path.join(os.path.dirname(__file__), '..', '..', 'mock', 'uploads.json')
        with open(mock_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

def save_uploads_data(data):
    """Save uploads data to JSON file"""
    try:
        mock_path = os.path.join(os.path.dirname(__file__), '..', '..', 'mock', 'uploads.json')
        with open(mock_path, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception:
        return False

def check_role_access(user_role, feature='uploads'):
    """Check if user role has access to uploads feature"""
    role_permissions = {
        'admin': ['uploads', 'contracts', 'onboarding', 'resources'],
        'hr': ['uploads'],
        'manager': ['uploads'],
        'engineer': ['uploads'],
        'marketing': ['uploads'],
        'intern': []  # Interns cannot upload files
    }
    
    return feature in role_permissions.get(user_role, [])

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def format_file_size(size_bytes):
    """Convert bytes to human readable format"""
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f} {size_names[i]}"

@uploads_bp.route("/upload", methods=["POST"])
def upload_file():
    """Handle file upload with role-based access control"""
    time.sleep(0.5)  # Simulate upload processing delay
    
    user_role = request.form.get('uploaded_by', '').lower()
    
    if not user_role:
        return jsonify({"error": "User role is required"}), 400
    
    # Check if user role can upload files
    if not check_role_access(user_role, 'uploads'):
        return jsonify({"error": "Access denied - insufficient permissions to upload files"}), 403
    
    # Check if file is in request
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    title = request.form.get('title', '').strip()
    category = request.form.get('category', '').strip()
    
    # Validate inputs
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not title:
        return jsonify({"error": "Title is required"}), 400
    
    if not category:
        return jsonify({"error": "Category is required"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400
    
    try:
        # Create uploads directory if it doesn't exist
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Generate unique filename
        original_filename = secure_filename(file.filename)
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        # For demo purposes, simulate file save without actually saving
        # In production, you would: file.save(file_path)
        
        # Simulate file size (in production, get actual size after saving)
        simulated_size = len(file.read())
        file.seek(0)  # Reset file pointer
        file_size_str = format_file_size(simulated_size)
        
        # Create file metadata
        file_metadata = {
            "id": str(uuid.uuid4()),
            "title": title,
            "original_filename": original_filename,
            "stored_filename": unique_filename,
            "category": category,
            "uploaded_by": user_role,
            "upload_date": datetime.now().strftime("%Y-%m-%d"),
            "upload_time": datetime.now().strftime("%H:%M:%S"),
            "file_size": file_size_str,
            "file_type": file_extension,
            "file_path": file_path
        }
        
        # Load current uploads and add new file
        uploads_data = load_uploads_data()
        uploads_data.append(file_metadata)
        
        # Save updated uploads data
        if not save_uploads_data(uploads_data):
            return jsonify({"error": "Failed to save file metadata"}), 500
        
        return jsonify({
            "success": True,
            "message": "File uploaded successfully",
            "file_info": {
                "id": file_metadata["id"],
                "title": file_metadata["title"],
                "filename": file_metadata["original_filename"],
                "category": file_metadata["category"],
                "uploaded_by": file_metadata["uploaded_by"],
                "upload_date": file_metadata["upload_date"],
                "file_size": file_metadata["file_size"]
            }
        }), 201
    
    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500

@uploads_bp.route("/files", methods=["GET"])
def list_uploaded_files():
    """Get list of all uploaded files (archive view)"""
    time.sleep(0.3)  # Simulate API delay
    
    uploads_data = load_uploads_data()
    
    # Return file metadata without sensitive file paths
    files_info = []
    for file_meta in uploads_data:
        files_info.append({
            "id": file_meta["id"],
            "title": file_meta["title"],
            "original_filename": file_meta["original_filename"],
            "category": file_meta["category"],
            "uploaded_by": file_meta["uploaded_by"],
            "upload_date": file_meta["upload_date"],
            "upload_time": file_meta["upload_time"],
            "file_size": file_meta["file_size"],
            "file_type": file_meta["file_type"]
        })
    
    return jsonify({
        "files": files_info,
        "total_count": len(files_info)
    })

@uploads_bp.route("/files/download/<file_id>", methods=["GET"])
def download_uploaded_file(file_id):
    """Download uploaded file by ID"""
    time.sleep(0.3)  # Simulate API delay
    
    uploads_data = load_uploads_data()
    
    # Find file by ID
    file_meta = None
    for f in uploads_data:
        if f["id"] == file_id:
            file_meta = f
            break
    
    if not file_meta:
        return jsonify({"error": "File not found"}), 404
    
    # For demo purposes, return file info (in production, would serve actual file)
    return jsonify({
        "message": f"Download started: {file_meta['title']}",
        "file_info": {
            "title": file_meta["title"],
            "original_filename": file_meta["original_filename"],
            "category": file_meta["category"],
            "file_size": file_meta["file_size"],
            "uploaded_by": file_meta["uploaded_by"],
            "upload_date": file_meta["upload_date"]
        },
        "download_url": f"/files/download/{file_id}",
        "note": "In production, this would trigger an actual file download"
    })