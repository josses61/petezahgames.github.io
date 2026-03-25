const AUTH_USERS_KEY = 'petezahgames_users';
const AUTH_CURRENT_USER = 'petezahgames_current_user';
const AUTH_ADMIN_LOGGED_IN = 'petezahgames_admin_logged_in';
const ADMIN_USERNAME = 'jossedagoatatsoccer';
const ADMIN_PASSWORD = 'MessiRules1!';

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function setUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createVerificationCode() {
  const code = generateCode();
  localStorage.setItem('petezahgames_last_code', code);
  return code;
}

function sendVerificationEmail(email, username, code) {
  const subject = encodeURIComponent('Your Pete Zah account code');
  const body = encodeURIComponent(`Hi ${username},\n\nYour verification code is: ${code}\n\nUse this code to activate features on the site.`);
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
  window.location.href = mailto;
}

function signUp() {
  const username = (document.getElementById('signup-name').value || '').trim();
  const email = (document.getElementById('signup-email').value || '').trim();
  const password = (document.getElementById('signup-password').value || '');
  const msg = document.getElementById('signup-message');

  if (!username || !email || !password) {
    msg.textContent = 'Please complete all fields.';
    msg.style.color = 'red';
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email === email || u.username === username)) {
    msg.textContent = 'This username or email is already registered.';
    msg.style.color = 'red';
    return;
  }

  const code = createVerificationCode();
  users.push({username, email, password, code, registeredAt: new Date().toISOString()});
  setUsers(users);

  msg.textContent = `Signed up! Use code ${code} (or check email).`; 
  msg.style.color = 'green';

  // build an email link to send
  sendVerificationEmail(email, username, code);
}

function loginUser() {
  const userinput = (document.getElementById('login-user').value || '').trim();
  const password = (document.getElementById('login-password').value || '');
  const msg = document.getElementById('login-message');
  const users = getUsers();

  const user = users.find(u => u.email === userinput || u.username === userinput);
  if (!user || user.password !== password) {
    msg.textContent = 'Invalid username/email or password.';
    msg.style.color = 'red';
    return;
  }

  localStorage.setItem(AUTH_CURRENT_USER, JSON.stringify(user));
  msg.textContent = 'Login successful. Redirecting...';
  msg.style.color = 'green';
  setTimeout(() => {
    window.location.href = '/settings.html';
  }, 800);
}

function adminLogin() {
  const username = (document.getElementById('admin-user').value || '').trim();
  const password = (document.getElementById('admin-password').value || '').trim();
  const msg = document.getElementById('admin-message');
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_ADMIN_LOGGED_IN, 'true');
    window.location.href = '/admin.html';
  } else {
    msg.textContent = 'Invalid admin credentials.';
    msg.style.color = 'red';
  }
}

function requireAdmin() {
  if (localStorage.getItem(AUTH_ADMIN_LOGGED_IN) !== 'true') {
    window.location.href = '/admin-login.html';
  }
}

function renderAdminUsers() {
  requireAdmin();
  const users = getUsers();
  const table = document.getElementById('admin-user-table');
  if (!table) return;
  table.innerHTML = '<tr><th>Username</th><th>Email</th><th>Code</th><th>Registered</th></tr>';
  users.forEach(u => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${u.username}</td><td>${u.email}</td><td>${u.code}</td><td>${u.registeredAt || ''}</td>`;
    table.appendChild(row);
  });
}

function sendCodeToAll() {
  requireAdmin();
  const users = getUsers();
  const msg = document.getElementById('admin-send-message');
  if (!users.length) {
    msg.textContent = 'No users to send.';
    msg.style.color = 'red';
    return;
  }
  users.forEach(u => {
    const code = createVerificationCode();
    u.code = code;
    sendVerificationEmail(u.email, u.username, code);
  });
  setUsers(users);
  msg.textContent = 'Verification emails have been triggered (mailto windows).';
  msg.style.color = 'green';
  renderAdminUsers();
}

function adminLogout() {
  localStorage.removeItem(AUTH_ADMIN_LOGGED_IN);
  window.location.href = '/admin-login.html';
}

function logoutUser() {
  localStorage.removeItem(AUTH_CURRENT_USER);
  window.location.href = '/login.html';
}
