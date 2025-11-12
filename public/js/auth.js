const authCard = document.getElementById('authCard');
document.getElementById('showRegister').onclick = () => authCard.classList.add('active');
document.getElementById('showLogin').onclick = () => authCard.classList.remove('active');

// Password strength
const passwordField = document.getElementById('registerPassword');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

passwordField.addEventListener('input', () => {
  const val = passwordField.value;
  let strength = 0;
  if (val.length >= 6) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;

  if (val.length === 0) {
    strengthBar.className = 'strength';
    strengthText.textContent = '';
  } else if (strength <= 1) {
    strengthBar.className = 'strength weak';
    strengthText.textContent = 'Kekuatan: Lemah';
    strengthText.style.color = 'red';
  } else if (strength <= 3) {
    strengthBar.className = 'strength medium';
    strengthText.textContent = 'Kekuatan: Sedang';
    strengthText.style.color = 'orange';
  } else {
    strengthBar.className = 'strength strong';
    strengthText.textContent = 'Kekuatan: Kuat';
    strengthText.style.color = 'green';
  }
});

// REGISTER FORM
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phone = document.getElementById('registerPhone').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirm = document.getElementById('confirmPassword').value;

  // Validasi email dan nomor HP
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/;

  if (!gmailRegex.test(email)) {
    alert("Gunakan hanya email Gmail (contoh: nama@gmail.com)");
    return;
  }

  if (!phoneRegex.test(phone)) {
    alert("Nomor HP tidak valid! Gunakan format +628xx atau 08xx");
    return;
  }

  if (password !== confirm) {
    alert("❌ Password tidak cocok!");
    return;
  }

  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify({ name, email, phone, password, password_confirmation: confirm })
  });

  const result = await response.json();
  if (result.success) {
    alert('✅ ' + result.message);
    authCard.classList.remove('active');
    e.target.reset();
  } else {
    alert('❌ ' + (result.message || 'Coba lagi.'));
  }
});

// LOGIN FORM
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify({ email, password })
  });

  const result = await response.json();
  if (result.success) {
    alert('🚆 ' + result.message);
    window.location.href = '/dashboard';
  } else {
    alert('❌ ' + result.message);
  }
});
