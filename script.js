let users = JSON.parse(localStorage.getItem('users')) || {};
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let currentUser = localStorage.getItem('currentUser');
let currentRole = currentUser ? users[currentUser]?.role : null;

const ADMIN_USERNAME = 'DuyZyren';
const ADMIN_PASSWORD = 'baoduy2012';

function register(username, password) {
    username = username.trim();
    if (users[username]) return alert('Tên đã tồn tại!'), false;
    if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
        alert('Tên này đã được bảo vệ cho admin!');
        return false;
    }
    users[username] = { password, role: 'user', avatar: '', type: 'Khách thường' };
    saveData();
    return true;
}

function login(username, password) {
    username = username.trim();
    password = password.trim();
    if (users[username] && users[username].password === password) {
        currentUser = username;
        currentRole = users[username].role;
        localStorage.setItem('currentUser', username);
        return true;
    }
    if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase() && password === ADMIN_PASSWORD) {
        if (!users[ADMIN_USERNAME]) {
            users[ADMIN_USERNAME] = { password: ADMIN_PASSWORD, role: 'admin', avatar: '', type: 'VIP' };
            saveData();
        }
        currentUser = ADMIN_USERNAME;
        currentRole = 'admin';
        localStorage.setItem('currentUser', ADMIN_USERNAME);
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('orders', JSON.stringify(orders));
}

function getMyOrders() { return orders.filter(o => o.createdBy === currentUser); }
function getAllOrders() { return [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)); }
function getOrderById(id) { return orders.find(o => o.id === id); }

function addOrder(data) {
    const order = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2,5),
        createdBy: currentUser,
        createdAt: new Date().toISOString(),
        status: 'Pending',
        ...data
    };
    orders.push(order);
    saveData();
}

function updateOrder(id, updates) {
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) orders[idx] = {...orders[idx], ...updates}, saveData();
}

function deleteOrder(id) {
    orders = orders.filter(o => o.id !== id);
    saveData();
}

function changeStatus(id, status) { updateOrder(id, { status }); }

function updateAvatar(url) {
    if (currentUser && users[currentUser]) users[currentUser].avatar = url, saveData();
}

function findUser(username) {
    username = username.trim().toLowerCase();
    for (let u in users) if (u.toLowerCase() === username) return { username: u, ...users[u], orderCount: orders.filter(o => o.createdBy === u).length };
    return null;
}

function deleteUser(username) {
    if (username === ADMIN_USERNAME) return alert('Không xóa admin chính!'), false;
    if (confirm(`Xóa ${username} và đơn của họ?`)) {
        delete users[username];
        orders = orders.filter(o => o.createdBy !== username);
        saveData();
        return true;
    }
    return false;
}