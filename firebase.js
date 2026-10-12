function getFbUrl() {
  return localStorage.getItem('fbUrl') || '';
}

function saveFirebase() {
  const url = document.getElementById('fbUrl').value.trim();
  if (!url.startsWith('http')) return alert('آدرس معتبر نیست');
  localStorage.setItem('fbUrl', url.replace(/\/$/, ''));
  document.getElementById('fbMsg').textContent = '✅ اتصال ذخیره شد';
}

async function syncUp() {
  const url = getFbUrl();
  if (!url) return alert('اول آدرس Firebase را ذخیره کنید');
  try {
    const res = await fetch(`${url}/accounting.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db)
    });
    if (res.ok) document.getElementById('fbMsg').textContent = '⬆️ با موفقیت آپلود شد';
    else throw new Error();
  } catch {
    document.getElementById('fbMsg').textContent = '❌ خطا در آپلود';
  }
}

async function syncDown() {
  const url = getFbUrl();
  if (!url) return alert('اول آدرس Firebase را ذخیره کنید');
  try {
    const res = await fetch(`${url}/accounting.json`);
    const data = await res.json();
    if (!data) return alert('داده‌ای در ابر یافت نشد');
    if (!confirm('داده‌های محلی با ابر جایگزین شود؟')) return;
    db = data;
    save();
    document.getElementById('fbMsg').textContent = '⬇️ با موفقیت دانلود شد';
  } catch {
    document.getElementById('fbMsg').textContent = '❌ خطا در دانلود';
  }
}

window.addEventListener('load', () => {
  const u = getFbUrl();
  if (u && document.getElementById('fbUrl')) {
    document.getElementById('fbUrl').value = u;
  }
});
