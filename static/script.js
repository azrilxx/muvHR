// ==========================================
// ROLE-BASED MODULE ACCESS CONFIGURATION
// ==========================================

const roleModuleAccess = {
    'Admin': ['Contractors', 'Onboarding', 'Resources', 'Upload', 'Time Off', 'Time Tracking', 'Groups', 'Entities', 'Roles & Permissions', 'Billing & Payments'],
    'HR Specialist': ['Contractors', 'Onboarding', 'Resources', 'Upload', 'Time Off', 'Time Tracking', 'Groups'],
    'Manager': ['Contractors', 'Resources', 'Upload', 'Time Off'],
    'Engineer': ['Resources', 'Upload'],
    'Marketing': ['Resources', 'Upload'],
    'Intern': ['Resources']
};

const moduleDefinitions = {
    'Contractors': {
        title: 'Contractors',
        description: 'View contract expiry tracking',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        color: 'blue',
        onClick: 'loadContracts()'
    },
    'Onboarding': {
        title: 'Onboarding',
        description: 'Manage new employee checklists',
        icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
        color: 'green',
        onClick: 'loadOnboarding()'
    },
    'Resources': {
        title: 'Resources',
        description: 'Access role-based documents',
        icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
        color: 'purple',
        onClick: 'loadResources()'
    },
    'Upload': {
        title: 'Upload',
        description: 'Upload and manage files',
        icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
        color: 'orange',
        onClick: 'showUploadModal()'
    },
    'Time Off': {
        title: 'Time Off',
        description: 'View time off policies and calendar',
        icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        color: 'indigo',
        onClick: 'loadTimeOff()'
    },
    'Time Tracking': {
        title: 'Time Tracking',
        description: 'Track hours and project time',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'pink',
        onClick: 'loadTimeTracking()'
    },
    'Groups': {
        title: 'Groups',
        description: 'View department and team structure',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        color: 'teal',
        onClick: 'loadGroups()'
    },
    'Entities': {
        title: 'Entities',
        description: 'Manage company entities and locations',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        color: 'yellow',
        onClick: 'loadEntities()'
    },
    'Roles & Permissions': {
        title: 'Roles & Permissions',
        description: 'Manage user roles and access control',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        color: 'red',
        onClick: 'showLockedFeature("Roles & Permissions")'
    },
    'Billing & Payments': {
        title: 'Billing & Payments',
        description: 'Manage billing and payment processing',
        icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
        color: 'gray',
        onClick: 'showLockedFeature("Billing & Payments")'
    }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function getCurrentRole() {
    const roleSelect = document.getElementById('role-select');
    return roleSelect.value;
}

function formatRoleForAPI(role) {
    const roleMapping = {
        'admin': 'Admin',
        'hr': 'HR Specialist', 
        'manager': 'Manager',
        'engineer': 'Engineer',
        'marketing': 'Marketing',
        'intern': 'Intern'
    };
    return roleMapping[role] || role;
}

function updateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleTimeString();
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function clearAllSections() {
    const sections = ['contracts-table', 'onboarding-section', 'resources-section', 'time-off-section', 'time-tracking-section', 'groups-section', 'entities-section'];
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) element.innerHTML = '';
    });
}

// ==========================================
// ROLE MANAGEMENT
// ==========================================

function updateRoleDisplay() {
    const currentRole = getCurrentRole();
    const roleDisplay = document.getElementById('current-role-display');
    const welcomeHeader = document.getElementById('welcome-header');
    const dashboardModules = document.getElementById('dashboard-modules');
    
    if (currentRole) {
        const roleMap = {
            'admin': 'Admin',
            'hr': 'HR Specialist',
            'manager': 'Manager',
            'engineer': 'Engineer',
            'marketing': 'Marketing',
            'intern': 'Intern'
        };
        
        const roleName = roleMap[currentRole];
        const roleEmoji = {
            'admin': '👑',
            'hr': '👥', 
            'manager': '📊',
            'engineer': '💻',
            'marketing': '📢',
            'intern': '🎓'
        };
        
        const roleDescriptions = {
            'admin': 'System Administrator - Full access to all HR resources',
            'hr': 'HR Specialist - Manage employee records and policies',
            'manager': 'Team Manager - Oversee staff and performance metrics', 
            'engineer': 'Software Engineer - Access technical documentation and resources',
            'marketing': 'Marketing Professional - Brand and campaign materials',
            'intern': 'Intern - Limited access to general company resources'
        };

        const roleIcons = {
            'admin': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            'hr': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            'manager': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            'engineer': 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
            'marketing': 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
            'intern': 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222'
        };

        roleDisplay.innerHTML = `
            <div class="flex items-center space-x-2 px-3 py-2 bg-primary-50 rounded-lg border border-primary-200">
                <span class="text-lg">${roleEmoji[currentRole]}</span>
                <span class="text-primary-700 font-medium">${roleName}</span>
            </div>
        `;
        
        // Show welcome header and dashboard modules
        welcomeHeader.classList.remove('hidden');
        dashboardModules.classList.remove('hidden');
        
        // Update welcome content
        document.getElementById('welcome-message').textContent = `Welcome back, ${roleName}!`;
        document.getElementById('role-description').textContent = roleDescriptions[currentRole];
        
        // Update role icon
        document.getElementById('role-icon').innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${roleIcons[currentRole]}"></path>`;
        
        // Generate dashboard modules
        generateDashboardModules(roleName);
        
    } else {
        roleDisplay.innerHTML = `
            <div class="text-sm text-gray-500 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                Please select your role
            </div>
        `;
        
        // Hide welcome header and dashboard modules
        welcomeHeader.classList.add('hidden');
        dashboardModules.classList.add('hidden');
    }
    
    // Clear all content sections when role changes
    clearAllSections();
}

function generateDashboardModules(roleName) {
    const dashboardModules = document.getElementById('dashboard-modules');
    const allowedModules = roleModuleAccess[roleName] || [];
    
    let modulesHTML = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 slide-in">';
    
    Object.keys(moduleDefinitions).forEach(moduleKey => {
        const module = moduleDefinitions[moduleKey];
        const isAllowed = allowedModules.includes(moduleKey);
        const isLocked = !isAllowed;
        
        // Style based on access
        const cardClass = isLocked 
            ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed' 
            : 'bg-white border-gray-200 hover:shadow-md hover:border-primary-300 card-hover cursor-pointer';
        
        const colorClass = isLocked ? 'gray' : module.color;
        const colorMapping = {
            'blue': 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
            'green': 'bg-green-100 text-green-600 group-hover:bg-green-200',
            'purple': 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
            'orange': 'bg-orange-100 text-orange-600 group-hover:bg-orange-200',
            'indigo': 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
            'pink': 'bg-pink-100 text-pink-600 group-hover:bg-pink-200',
            'teal': 'bg-teal-100 text-teal-600 group-hover:bg-teal-200',
            'yellow': 'bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200',
            'red': 'bg-red-100 text-red-600 group-hover:bg-red-200',
            'gray': 'bg-gray-100 text-gray-400'
        };
        
        const iconColor = colorMapping[colorClass];
        const titleColor = isLocked ? 'text-gray-400' : 'text-gray-900 group-hover:text-primary-700';
        const descriptionColor = isLocked ? 'text-gray-400' : 'text-gray-600';
        
        const onClickHandler = isLocked ? '' : `onclick="${module.onClick}"`;
        const tooltip = isLocked ? `title="Restricted – Login required"` : '';
        
        modulesHTML += `
            <div class="group ${cardClass} rounded-xl shadow-sm border p-6 transition-all duration-200 text-left" 
                 ${onClickHandler} ${tooltip}>
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${module.icon}"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold ${titleColor} transition-colors">${module.title}</h3>
                        <p class="${descriptionColor} text-sm">${module.description}</p>
                        ${isLocked ? '<p class="text-xs text-gray-400 mt-1">🔒 Login required</p>' : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    modulesHTML += '</div>';
    dashboardModules.innerHTML = modulesHTML;
}

// ==========================================
// MODULE LOADING FUNCTIONS
// ==========================================

async function loadContracts() {
    const currentRole = getCurrentRole();
    if (!currentRole) {
        showNotification('error', 'Role Required', 'Please select your role first');
        return;
    }
    
    clearAllSections();
    const roleFormatted = formatRoleForAPI(currentRole);
    
    try {
        const res = await fetch(`/api/contractors/${roleFormatted}`);
        const data = await res.json();
        
        if (res.ok) {
            renderContractsTable(data.contractors);
        } else {
            showErrorMessage('contracts-table', 'Access Denied', data.error);
        }
    } catch (error) {
        console.error('Error loading contracts:', error);
        showErrorMessage('contracts-table', 'Connection Error', 'Unable to connect to server');
    }
}

async function loadOnboarding() {
    const currentRole = getCurrentRole();
    if (!currentRole) {
        showNotification('error', 'Role Required', 'Please select your role first');
        return;
    }
    
    clearAllSections();
    const roleFormatted = currentRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    try {
        const res = await fetch(`/api/onboarding/${roleFormatted}`);
        const data = await res.json();
        
        if (res.ok) {
            renderOnboardingSection(data.staff, currentRole);
        } else {
            showErrorMessage('onboarding-section', 'Access Denied', data.error);
        }
    } catch (error) {
        console.error('Error loading onboarding:', error);
        showErrorMessage('onboarding-section', 'Connection Error', 'Unable to connect to server');
    }
}

async function loadResources() {
    const currentRole = getCurrentRole();
    if (!currentRole) {
        showNotification('error', 'Role Required', 'Please select your role first');
        return;
    }
    
    clearAllSections();
    const roleFormatted = currentRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    try {
        const res = await fetch(`/api/resources/${roleFormatted}`);
        const data = await res.json();
        
        if (res.ok) {
            renderResourcesSection(data.resources, currentRole);
        } else {
            showErrorMessage('resources-section', 'Access Denied', data.error);
        }
    } catch (error) {
        console.error('Error loading resources:', error);
        showErrorMessage('resources-section', 'Connection Error', 'Unable to connect to server');
    }
}

async function loadTimeOff() {
    const currentRole = getCurrentRole();
    if (!currentRole) {
        showNotification('error', 'Role Required', 'Please select your role first');
        return;
    }
    
    clearAllSections();
    const roleFormatted = currentRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    try {
        const res = await fetch(`/api/time-off/${roleFormatted}`);
        const data = await res.json();
        
        if (res.ok) {
            renderTimeOffSection(data.time_off);
        } else {
            showErrorMessage('time-off-section', 'Access Denied', data.error);
        }
    } catch (error) {
        console.error('Error loading time off:', error);
        showErrorMessage('time-off-section', 'Connection Error', 'Unable to connect to server');
    }
}

async function loadTimeTracking() {
    const currentRole = getCurrentRole();
    if (!currentRole) {
        showNotification('error', 'Role Required', 'Please select your role first');
        return;
    }
    
    clearAllSections();
    const roleFormatted = currentRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    try {
        const res = await fetch(`/api/time-tracking/${roleFormatted}`);
        const data = await res.json();
        
        if (res.ok) {
            renderTimeTrackingSection(data.time_tracking);
        } else {
            showErrorMessage('time-tracking-section', 'Access Denied', data.error);
        }
    } catch (error) {
        console.error('Error loading time tracking:', error);
        showErrorMessage('time-tracking-section', 'Connection Error', 'Unable to connect to server');
    }
}

async function loadGroups() {
    const currentRole = getCurrentRole();
    if (!currentRole) {
        showNotification('error', 'Role Required', 'Please select your role first');
        return;
    }
    
    clearAllSections();
    const roleFormatted = currentRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    try {
        const res = await fetch(`/api/groups/${roleFormatted}`);
        const data = await res.json();
        
        if (res.ok) {
            renderGroupsSection(data.groups);
        } else {
            showErrorMessage('groups-section', 'Access Denied', data.error);
        }
    } catch (error) {
        console.error('Error loading groups:', error);
        showErrorMessage('groups-section', 'Connection Error', 'Unable to connect to server');
    }
}

async function loadEntities() {
    const currentRole = getCurrentRole();
    if (!currentRole) {
        showNotification('error', 'Role Required', 'Please select your role first');
        return;
    }
    
    clearAllSections();
    const roleFormatted = currentRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    try {
        const res = await fetch(`/api/entities/${roleFormatted}`);
        const data = await res.json();
        
        if (res.ok) {
            renderEntitiesSection(data.entities);
        } else {
            showErrorMessage('entities-section', 'Access Denied', data.error);
        }
    } catch (error) {
        console.error('Error loading entities:', error);
        showErrorMessage('entities-section', 'Connection Error', 'Unable to connect to server');
    }
}

function showLockedFeature(featureName) {
    showNotification('warning', 'Feature Locked', `${featureName} is locked. Please login to access this feature.`);
}

// ==========================================
// RENDERING FUNCTIONS
// ==========================================

function showErrorMessage(containerId, title, message) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">${title}</h3>
            <p class="text-gray-600">${message}</p>
        </div>
    `;
}

function renderContractsTable(contracts) {
    const tableContainer = document.getElementById('contracts-table');
    
    if (!contracts || contracts.length === 0) {
        tableContainer.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
                <p class="text-gray-500">There are currently no contractor records to display.</p>
            </div>
        `;
        return;
    }

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const expiringCount = contracts.filter(c => new Date(c.contract_expiry) <= thirtyDaysFromNow).length;

    let tableHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900">Contractor Directory</h2>
                        <p class="text-sm text-gray-600 mt-1">Manage contractor agreements and track expiry dates</p>
                    </div>
                    <div class="text-right">
                        <div class="flex items-center space-x-4">
                            <div class="text-sm">
                                <span class="text-gray-500">Total: </span>
                                <span class="font-semibold text-gray-900">${contracts.length}</span>
                            </div>
                            ${expiringCount > 0 ? `
                                <div class="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                    </svg>
                                    <span class="font-medium">${expiringCount} expiring soon</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contractor</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Expiry</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
    `;

    contracts.forEach(contractor => {
        const expiryDate = new Date(contractor.contract_expiry);
        const isExpiring = expiryDate <= thirtyDaysFromNow;
        const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        const rowClass = isExpiring ? 'bg-red-50' : '';
        
        let statusBadge, daysDisplay;
        if (daysLeft < 0) {
            statusBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>';
            daysDisplay = '<span class="text-red-600 font-medium">Expired</span>';
        } else if (daysLeft <= 30) {
            statusBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Expiring Soon</span>';
            daysDisplay = `<span class="text-yellow-600 font-medium">${daysLeft} days</span>`;
        } else {
            statusBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>';
            daysDisplay = `<span class="text-gray-500">${daysLeft} days</span>`;
        }

        tableHTML += `
            <tr class="${rowClass} hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-600">${contractor.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${contractor.name}</div>
                            <div class="text-sm text-gray-500">${contractor.id}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${contractor.position}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${contractor.contract_expiry}</td>
                <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${daysDisplay}</td>
            </tr>
        `;
    });

    tableHTML += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    tableContainer.innerHTML = tableHTML;
}

function renderOnboardingSection(staff, currentRole) {
    const onboardingContainer = document.getElementById('onboarding-section');
    
    if (!staff || staff.length === 0) {
        onboardingContainer.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No onboarding staff found</h3>
                <p class="text-gray-500">There are currently no employees in the onboarding process.</p>
            </div>
        `;
        return;
    }

    let staffHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900">Onboarding Checklists</h2>
                        <p class="text-sm text-gray-600 mt-1">Track new employee progress and task completion</p>
                    </div>
                    <div class="text-sm text-gray-500">
                        <span class="font-semibold text-gray-900">${staff.length}</span> employees onboarding
                    </div>
                </div>
                
                <div class="grid gap-6">
    `;
    
    staff.forEach(staffMember => {
        const completedTasks = staffMember.tasks.filter(task => task.completed).length;
        const totalTasks = staffMember.tasks.length;
        const progressPercent = Math.round((completedTasks / totalTasks) * 100);
        
        let progressColor = 'bg-red-500';
        if (progressPercent >= 75) progressColor = 'bg-green-500';
        else if (progressPercent >= 50) progressColor = 'bg-yellow-500';
        else if (progressPercent >= 25) progressColor = 'bg-orange-500';
        
        staffHTML += `
            <div class="bg-gray-50 rounded-lg p-6 card-hover">
                <div class="flex items-start justify-between mb-6">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <span class="text-lg font-semibold text-primary-700">${staffMember.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">${staffMember.name}</h3>
                            <p class="text-gray-600">${staffMember.position}</p>
                            <p class="text-sm text-gray-500">Started: ${staffMember.start_date}</p>
                        </div>
                    </div>
                    
                    <div class="text-right">
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-2xl font-bold text-gray-900">${progressPercent}%</span>
                            <span class="text-sm text-gray-500">complete</span>
                        </div>
                        <div class="w-24 bg-gray-200 rounded-full h-2">
                            <div class="${progressColor} h-2 rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">${completedTasks}/${totalTasks} tasks</p>
                    </div>
                </div>
                
                <div class="space-y-3">
        `;
        
        staffMember.tasks.forEach(task => {
            const isCompleted = task.completed;
            const iconColor = isCompleted ? 'text-green-600' : 'text-gray-400';
            const textColor = isCompleted ? 'text-gray-900' : 'text-gray-600';
            const bgColor = isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200';
            
            staffHTML += `
                <div class="flex items-center justify-between p-3 ${bgColor} border rounded-lg transition-all duration-200">
                    <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                            ${isCompleted 
                                ? '<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                                : '<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                            }
                        </div>
                        <span class="text-sm font-medium ${textColor} ${isCompleted ? 'line-through' : ''}">${task.name}</span>
                    </div>
                    
                    <button class="px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        isCompleted 
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                            : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    } opacity-50 cursor-not-allowed" disabled>
                        ${isCompleted ? 'Completed' : 'Pending'}
                    </button>
                </div>
            `;
        });
        
        staffHTML += `
                </div>
            </div>
        `;
    });
    
    staffHTML += `
                </div>
            </div>
        </div>
    `;
    
    onboardingContainer.innerHTML = staffHTML;
}

function renderResourcesSection(resources, currentRole) {
    const resourcesContainer = document.getElementById('resources-section');
    
    if (!resources || resources.length === 0) {
        resourcesContainer.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No resources available</h3>
                <p class="text-gray-500">No resources are accessible for the <strong>${currentRole}</strong> role.</p>
            </div>
        `;
        return;
    }

    const fileTypeIcons = {
        pdf: { color: 'bg-red-100 text-red-600', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        zip: { color: 'bg-yellow-100 text-yellow-600', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        docx: { color: 'bg-blue-100 text-blue-600', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
    };

    let resourcesHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900">Resources Library</h2>
                        <p class="text-sm text-gray-600 mt-1">Access documents and files for your role</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="text-sm text-gray-500">
                            <span class="font-semibold text-gray-900">${resources.length}</span> accessible resources
                        </div>
                        <div class="flex items-center space-x-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                            <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
                            <span class="font-medium">${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="p-6">
                <div class="grid gap-4">
    `;
    
    resources.forEach(resource => {
        const fileType = fileTypeIcons[resource.file_type] || fileTypeIcons.pdf;
        
        resourcesHTML += `
            <div class="bg-gray-50 rounded-lg p-6 card-hover">
                <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4 flex-1">
                        <div class="w-12 h-12 ${fileType.color} rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${fileType.icon}"></path>
                            </svg>
                        </div>
                        
                        <div class="flex-1 min-w-0">
                            <h3 class="text-lg font-semibold text-gray-900 mb-1">${resource.title}</h3>
                            <p class="text-gray-600 text-sm mb-3">${resource.description}</p>
                            
                            <div class="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                                <span class="flex items-center space-x-1">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                    </svg>
                                    <span>${resource.file_type.toUpperCase()}</span>
                                </span>
                                <span class="flex items-center space-x-1">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                                    </svg>
                                    <span>${resource.file_size}</span>
                                </span>
                                <span class="flex items-center space-x-1">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <span>${resource.upload_date}</span>
                                </span>
                            </div>
                            
                            <div class="flex flex-wrap gap-1">
                                ${resource.allowed_roles.map(role => {
                                    const isCurrentRole = role === currentRole;
                                    return `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        isCurrentRole 
                                            ? 'bg-primary-100 text-primary-800 ring-1 ring-primary-600' 
                                            : 'bg-gray-100 text-gray-600'
                                    }">${role}</span>`;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2 ml-4">
                        <button onclick="showNotification('info', 'File Preview', 'Mock file preview for ${resource.title}')" 
                                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            View
                        </button>
                        <button onclick="showNotification('success', 'Download Started', 'Mock download started for ${resource.title}')" 
                                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Download
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    resourcesHTML += `
                </div>
            </div>
        </div>
    `;
    
    resourcesContainer.innerHTML = resourcesHTML;
}

function renderTimeOffSection(timeOff) {
    const timeOffContainer = document.getElementById('time-off-section');
    
    let timeOffHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">Time Off Policies</h2>
                    <p class="text-sm text-gray-600">Company time off policies and allowances</p>
                </div>
                
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    `;
    
    timeOff.policies.forEach(policy => {
        timeOffHTML += `
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">${policy.type}</h3>
                    <span class="text-2xl font-bold text-primary-600">${policy.days_per_year}</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">${policy.description}</p>
                <div class="text-xs text-gray-500">
                    <span>Carryover limit: ${policy.carryover_limit} days</span>
                </div>
            </div>
        `;
    });
    
    timeOffHTML += `
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">Upcoming Time Off</h2>
                    <p class="text-sm text-gray-600">Scheduled time off for team members</p>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
    `;
    
    timeOff.upcoming_time_off.forEach(timeOffEntry => {
        const statusColor = timeOffEntry.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
        
        timeOffHTML += `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span class="text-xs font-medium text-gray-600">${timeOffEntry.employee.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">${timeOffEntry.employee}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${timeOffEntry.type}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${timeOffEntry.start_date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${timeOffEntry.end_date}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}">
                        ${timeOffEntry.status}
                    </span>
                </td>
            </tr>
        `;
    });
    
    timeOffHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    timeOffContainer.innerHTML = timeOffHTML;
}

function renderTimeTrackingSection(timeTracking) {
    const timeTrackingContainer = document.getElementById('time-tracking-section');
    
    let timeTrackingHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900 mb-2">Time Tracking</h2>
                        <p class="text-sm text-gray-600">Track your hours and project time</p>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-gray-900">${timeTracking.weekly_summary.total_hours}h</div>
                        <div class="text-sm text-gray-500">of ${timeTracking.weekly_summary.expected_hours}h this week</div>
                    </div>
                </div>
                
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Weekly Progress</span>
                        <span class="text-sm text-gray-500">${Math.round((timeTracking.weekly_summary.total_hours / timeTracking.weekly_summary.expected_hours) * 100)}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-primary-600 h-2 rounded-full transition-all duration-300" style="width: ${Math.min((timeTracking.weekly_summary.total_hours / timeTracking.weekly_summary.expected_hours) * 100, 100)}%"></div>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
    `;
    
    timeTracking.current_week.forEach(entry => {
        timeTrackingHTML += `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${entry.date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${entry.hours}h</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${entry.project}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${entry.description}</td>
            </tr>
        `;
    });
    
    timeTrackingHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    timeTrackingContainer.innerHTML = timeTrackingHTML;
}

function renderGroupsSection(groups) {
    const groupsContainer = document.getElementById('groups-section');
    
    let groupsHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">Departments</h2>
                    <p class="text-sm text-gray-600">Company departments and organizational structure</p>
                </div>
                
                <div class="grid gap-4 md:grid-cols-2">
    `;
    
    groups.departments.forEach(dept => {
        groupsHTML += `
            <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">${dept.name}</h3>
                    <span class="text-sm font-medium text-gray-500">${dept.members.length} members</span>
                </div>
                
                <div class="mb-3">
                    <p class="text-sm text-gray-600 mb-2">Manager: <span class="font-medium text-gray-900">${dept.manager}</span></p>
                    <p class="text-sm text-gray-600 mb-2">Budget: <span class="font-medium text-gray-900">${dept.budget}</span></p>
                </div>
                
                <div>
                    <p class="text-sm text-gray-600 mb-2">Members:</p>
                    <div class="flex flex-wrap gap-1">
                        ${dept.members.map(member => `
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                ${member}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    groupsHTML += `
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">Teams</h2>
                    <p class="text-sm text-gray-600">Cross-functional teams and project groups</p>
                </div>
                
                <div class="grid gap-4 md:grid-cols-3">
    `;
    
    groups.teams.forEach(team => {
        groupsHTML += `
            <div class="bg-gray-50 rounded-lg p-6">
                <div class="mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">${team.name}</h3>
                    <p class="text-sm text-gray-600">${team.focus}</p>
                </div>
                
                <div class="mb-3">
                    <p class="text-sm text-gray-600 mb-2">Team Lead: <span class="font-medium text-gray-900">${team.lead}</span></p>
                </div>
                
                <div>
                    <p class="text-sm text-gray-600 mb-2">Members:</p>
                    <div class="flex flex-wrap gap-1">
                        ${team.members.map(member => `
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ${member}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    groupsHTML += `
                </div>
            </div>
        </div>
    `;
    
    groupsContainer.innerHTML = groupsHTML;
}

function renderEntitiesSection(entities) {
    const entitiesContainer = document.getElementById('entities-section');
    
    let entitiesHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-2">Company Entities</h2>
                <p class="text-sm text-gray-600">Manage company entities and locations</p>
            </div>
            
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
    `;
    
    entities.forEach(entity => {
        entitiesHTML += `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span class="text-sm font-medium text-primary-700">${entity.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${entity.name}</div>
                            <div class="text-sm text-gray-500">${entity.id}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${entity.type}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${entity.location}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${entity.employees}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ${entity.status}
                    </span>
                </td>
            </tr>
        `;
    });
    
    entitiesHTML += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    entitiesContainer.innerHTML = entitiesHTML;
}

// ==========================================
// UPLOAD MODAL FUNCTIONS
// ==========================================

function showUploadModal() {
    const currentRole = getCurrentRole();
    if (!currentRole) {
        showNotification('error', 'Role Required', 'Please select your role first');
        return;
    }
    document.getElementById('upload-modal').classList.remove('hidden');
}

function hideUploadModal() {
    document.getElementById('upload-modal').classList.add('hidden');
    document.getElementById('upload-form').reset();
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

function showNotification(type, title, message) {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 
                   type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                   type === 'info' ? 'bg-blue-50 border-blue-200' :
                   'bg-red-50 border-red-200';
    const iconColor = type === 'success' ? 'text-green-400' : 
                     type === 'warning' ? 'text-yellow-400' :
                     type === 'info' ? 'text-blue-400' :
                     'text-red-400';
    const textColor = type === 'success' ? 'text-green-800' : 
                     type === 'warning' ? 'text-yellow-800' :
                     type === 'info' ? 'text-blue-800' :
                     'text-red-800';
    const icon = type === 'success' 
        ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        : type === 'warning'
        ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
        : type === 'info'
        ? 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        : 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';

    notification.className = `${bgColor} border rounded-lg p-4 max-w-sm shadow-lg slide-in`;
    notification.innerHTML = `
        <div class="flex">
            <div class="flex-shrink-0">
                <svg class="h-5 w-5 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon}"></path>
                </svg>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium ${textColor}">${title}</h3>
                <div class="mt-2 text-sm ${textColor} opacity-90">
                    <p style="white-space: pre-line;">${message}</p>
                </div>
            </div>
            <div class="ml-auto pl-3">
                <div class="-mx-1.5 -my-1.5">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="inline-flex rounded-md p-1.5 ${textColor} hover:bg-gray-100 focus:outline-none">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize time
    updateTime();
    setInterval(updateTime, 1000);
    
    // Role selector event listener
    const roleSelect = document.getElementById('role-select');
    roleSelect.addEventListener('change', updateRoleDisplay);
    updateRoleDisplay();
    
    // Upload form handler
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('success', 'Upload Successful', 'File uploaded successfully (mock functionality)');
            hideUploadModal();
        });
    }
});