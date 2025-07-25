# MuvHR - Human Resources Management System

A complete HR management system with role-based access control, built with Flask backend and vanilla JavaScript frontend.

## 🌟 Features

### ✅ Implemented Features
- **Contracts Management**: Track contractor agreements and expiry dates
- **Onboarding System**: Manage new employee checklists with progress tracking
- **Resources Library**: Role-based document access and management
- **File Upload System**: Upload and manage organizational files
- **Archive Viewer**: View all uploaded files across the organization
- **Role-Based Access Control**: Different permissions for each role

### 👥 User Roles & Permissions

| Role | Contracts | Onboarding | Resources | Upload | Modify Tasks |
|------|-----------|------------|-----------|---------|--------------|
| 👑 **Admin** | ✅ Full | ✅ Full | ✅ Full | ✅ Yes | ✅ Yes |
| 👥 **HR** | ✅ Full | ✅ Full | ✅ Limited | ✅ Yes | ✅ Yes |
| 📊 **Manager** | ✅ Full | ✅ View | ✅ Limited | ✅ Yes | ❌ No |
| 💻 **Engineer** | ❌ No | ✅ View | ✅ Limited | ✅ Yes | ❌ No |
| 📢 **Marketing** | ❌ No | ✅ View | ✅ Limited | ✅ Yes | ❌ No |
| 🎓 **Intern** | ❌ No | ✅ View | ✅ Very Limited | ❌ No | ❌ No |

## 🏗️ Project Structure

```
muvHR/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── routes/
│   │   ├── contracts.py       # Contract management routes
│   │   ├── onboarding.py      # Onboarding system routes
│   │   ├── resources.py       # Resource library routes
│   │   └── uploads.py         # File upload routes
│   └── uploads/               # File storage directory
├── frontend/
│   ├── index.html             # Main UI interface
│   └── app.js                 # Frontend JavaScript logic
├── mock/
│   ├── contracts.json         # Mock contractor data
│   ├── onboarding.json        # Mock onboarding data
│   ├── resources.json         # Mock resource files data
│   └── uploads.json           # Uploaded files metadata
├── requirements.txt           # Python dependencies
├── run_server.py             # Server startup script
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Modern web browser

### Installation & Setup

1. **Clone or navigate to the project directory**
   ```bash
   cd muvHR
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the backend server**
   ```bash
   python run_server.py
   ```
   
   The server will start at `http://localhost:8080`

4. **Open the frontend**
   - Open `frontend/index.html` in your web browser
   - Or serve it with a simple HTTP server:
   ```bash
   # Using Python
   cd frontend
   python -m http.server 3000
   
   # Using Node.js
   npx serve frontend -p 3000
   ```

5. **Access the application**
   - Backend API: `http://localhost:8080`
   - Frontend UI: `http://localhost:3000` or `file:///path/to/frontend/index.html`

## 🎯 Usage Guide

### Getting Started
1. **Select Your Role**: Choose your role from the dropdown to access appropriate features
2. **Explore Features**: Click on the feature buttons to access different sections
3. **Role Testing**: Switch between roles to see different access levels

### Feature Walkthrough

#### 📋 Contracts Management
- **Access**: Admin, HR, Manager
- **Features**: View contractor information, track contract expiry dates
- **Highlights**: Visual indicators for contracts expiring within 30 days

#### ✅ Onboarding System
- **Access**: All roles (Admin/HR can modify)
- **Features**: Track new employee onboarding progress
- **Interaction**: Admin and HR can toggle task completion status

#### 📚 Resources Library
- **Access**: Role-based filtering
- **Features**: Download and view documents based on permissions
- **Security**: Files filtered by role access levels

#### 📤 Upload System
- **Access**: All roles except Intern
- **Features**: Upload files with metadata (title, category)
- **Security**: Interns receive 403 Forbidden error

#### 🗃️ Archive Viewer
- **Access**: All roles
- **Features**: View all uploaded files with metadata
- **Function**: Download simulation for all uploaded content

## 🔧 API Endpoints

### Contracts
- `GET /contracts?role={role}` - Get contracts list
- `GET /contracts/expiring?role={role}` - Get expiring contracts

### Onboarding
- `GET /onboarding?role={role}` - Get onboarding data
- `POST /onboarding/{staff_id}/toggle` - Toggle task completion

### Resources
- `GET /resources?role={role}` - Get accessible resources
- `GET /files/{filename}?role={role}` - Access specific file

### Uploads
- `POST /upload` - Upload new file
- `GET /files` - Get uploaded files list
- `GET /files/download/{file_id}` - Download file by ID

## 🔒 Security Features

- **Role-Based Access Control**: Each endpoint validates user role
- **Permission Validation**: Features disabled for unauthorized roles
- **File Upload Security**: Type validation and size limits
- **Error Handling**: Graceful handling of access denied scenarios

## 📊 Mock Data

The system uses JSON files for mock data:
- **contracts.json**: 8 sample contractors with varying expiry dates
- **onboarding.json**: 3 employees in different onboarding stages
- **resources.json**: 8 role-filtered documents
- **uploads.json**: Initially empty, populated with user uploads

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Feedback**: Toast notifications for all actions
- **Role Indicators**: Visual role badges and permission indicators
- **Modern Interface**: Tailwind CSS with custom animations
- **Interactive Elements**: Hover effects and smooth transitions

## 🔄 System Behaviors

- **API Delays**: 300-500ms simulation for realistic experience
- **Error Responses**: 404 for missing resources, 403 for unauthorized access
- **State Management**: In-memory data persistence during session
- **File Simulation**: Mock file operations with realistic responses

## 🚧 Next Steps (Production Ready)

1. **Database Integration**: Replace JSON files with SQL/NoSQL database
2. **Authentication**: Implement proper user login system
3. **File Storage**: Replace mock uploads with cloud storage
4. **Real Downloads**: Implement actual file serving
5. **Deployment**: Configure for production environment

## 🎯 Testing Role Scenarios

### Admin Testing
1. Select "Admin" role
2. Access all features - should work perfectly
3. Try modifying onboarding tasks - should work
4. Upload files - should work

### Intern Testing  
1. Select "Intern" role
2. Try accessing contracts - should show access denied
3. Try uploading files - should show 403 error
4. View onboarding and resources - should show limited content

### Manager Testing
1. Select "Manager" role  
2. Access contracts and resources - should work
3. Try modifying onboarding tasks - should be disabled
4. Upload files - should work

## 📞 Support

For issues or questions about the MuvHR system:
1. Check the browser console for detailed error messages
2. Verify the backend server is running on port 8080
3. Ensure all dependencies are installed correctly

---

**Built with ❤️ for Muvon Energy HR Department**