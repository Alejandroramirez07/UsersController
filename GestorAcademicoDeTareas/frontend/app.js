const API_BASE = 'http://localhost:3000'; // Ajusta según tu puerto

let currentUser = null;
let currentRole = '';

// Utilidades
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 4000);
}

async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        showNotification(error.message, 'error');
        throw error;
    }
}

// Gestión de Roles y Auth
function setRole(role) {
    currentRole = role;
    document.getElementById('selectedRole').textContent = role;
    document.getElementById('roleName').textContent = role;
    document.getElementById('loginForm').style.display = 'block';
    
    // Remover active de todos los botones
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activar el botón seleccionado
    event.target.classList.add('active');
}

function login() {
    // Simulamos login con el rol seleccionado
    currentUser = {
        id: currentRole === 'Professor' ? 1 : 2,
        email: `${currentRole.toLowerCase()}@example.com`,
        role: currentRole
    };

    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('mainPanel').style.display = 'block';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('userRole').textContent = `Rol: ${currentRole}`;

    // Mostrar/ocultar gestión de usuarios según el rol
    if (currentRole === 'Professor') {
        document.getElementById('userManagement').style.display = 'block';
    }

    loadAllUsers();
    loadUserProfile();
    showNotification(`Bienvenido ${currentRole} ${currentUser.email}`, 'success');
}

function logout() {
    currentUser = null;
    currentRole = '';
    
    document.getElementById('loginPanel').style.display = 'block';
    document.getElementById('mainPanel').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    
    showNotification('Sesión cerrada', 'info');
}

// Gestión de Usuarios
async function createUser() {
    const userData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: document.getElementById('userRoleSelect').value
    };

    // Validación simple
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }

    try {
        // En un proyecto real, aquí llamarías a tu API
        // await apiCall('/users', {
        //     method: 'POST',
        //     body: JSON.stringify(userData)
        // });
        
        // Simulación de creación exitosa
        showNotification(`Usuario ${userData.firstName} creado exitosamente`, 'success');
        
        // Limpiar formulario
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        
        // Recargar lista
        loadUsers();
    } catch (error) {
        showNotification('Error al crear usuario', 'error');
    }
}

async function loadUsers() {
    try {
    
        // const users = await apiCall('/users');
        
        // Datos de ejemplo
        const users = [
            { id: 1, firstName: 'Ana', lastName: 'García', email: 'ana@example.com', role: 'Professor' },
            { id: 2, firstName: 'Carlos', lastName: 'López', email: 'carlos@example.com', role: 'Student' },
            { id: 3, firstName: 'María', lastName: 'Rodríguez', email: 'maria@example.com', role: 'Student' }
        ];

        displayUsers(users, 'usersList');
    } catch (error) {
        showNotification('Error al cargar usuarios', 'error');
    }
}

async function loadAllUsers() {
    try {
        
        //const users = await apiCall('/users');
        
        // Datos de ejemplo
        const users = [
            { id: 1, firstName: 'Ana', lastName: 'García', email: 'ana@example.com', role: 'Professor' },
            { id: 2, firstName: 'Carlos', lastName: 'López', email: 'carlos@example.com', role: 'Student' },
            { id: 3, firstName: 'María', lastName: 'Rodríguez', email: 'maria@example.com', role: 'Student' },
            { id: 4, firstName: 'Pedro', lastName: 'Martínez', email: 'pedro@example.com', role: 'Student' }
        ];

        displayUsers(users, 'allUsersList');
    } catch (error) {
        showNotification('Error al cargar usuarios', 'error');
    }
}

function displayUsers(users, containerId) {
    const container = document.getElementById(containerId);
    
    if (users.length === 0) {
        container.innerHTML = '<p>No hay usuarios registrados</p>';
        return;
    }

    container.innerHTML = users.map(user => `
        <div class="user-card ${user.role.toLowerCase()}">
            <div class="user-details">
                <h4>${user.firstName} ${user.lastName}</h4>
                <p>📧 ${user.email}</p>
                <p>🎯 Rol: ${user.role}</p>
                <p>🆔 ID: ${user.id}</p>
            </div>
            <div class="user-actions">
                ${currentRole === 'Professor' ? `
                    <button onclick="editUser(${user.id})" class="btn primary">Editar</button>
                    <button onclick="deleteUser(${user.id})" class="btn danger">Eliminar</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function loadUserProfile() {
    const profileContainer = document.getElementById('userProfile');
    
    profileContainer.innerHTML = `
        <div class="user-info-card">
            <h3>${currentUser.role} ${currentUser.email}</h3>
            <p><strong>ID:</strong> ${currentUser.id}</p>
            <p><strong>Rol:</strong> ${currentUser.role}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <div style="margin-top: 15px;">
                <button onclick="editMyProfile()" class="btn primary">Editar Mi Perfil</button>
            </div>
        </div>
    `;
}

// Funciones de ejemplo para las acciones
function editUser(userId) {
    showNotification(`Editando usuario ID: ${userId}`, 'info');
}

function deleteUser(userId) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        showNotification(`Usuario ${userId} eliminado`, 'success');
        loadUsers();
        loadAllUsers();
    }
}

function editMyProfile() {
    showNotification('Editando perfil...', 'info');
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Cargar usuarios al iniciar (si es Professor)
    if (currentRole === 'Professor') {
        loadUsers();
    }
});