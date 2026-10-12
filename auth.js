function getPass() {
  return localStorage.getItem('appPass') || '1234';
}

function login() {
  const val = document.getElementById('loginPass').value;
  if (val === getPass()) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    sessionStorage.setItem('logged', '1');
  } else {
    document.getElementById('loginMsg').textContent = 'رمز اشتباه است';
  }
}

function logout() {
  sessionStorage.removeItem('logged');
  location.reload();
}

function changePass() {
  const np = document.getElementById('newPass').value.trim();
  if (np.length < 4) return alert('رمز باید حداقل ۴ کاراکتر باشد');
  localStorage.setItem('appPass', np);
  alert('رمز تغییر کرد ✅');
  document.getElementById('newPass').value = '';
}

window.addEventListener('load', () => {
  if (sessionStorage.getItem('logged')) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
  }
});
