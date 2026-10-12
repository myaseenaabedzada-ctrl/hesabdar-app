let db = JSON.parse(localStorage.getItem('accDB')) || {
  products: {},
  purchases: [],
  sales: [],
  customers: []
};

function save() {
  localStorage.setItem('accDB', JSON.stringify(db));
  renderAll();
}

document.querySelectorAll('.tab').forEach(t => {
  t.onclick = () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById(t.dataset.tab).classList.add('active');
  };
});

function addBuy() {
  const name = buyName.value.trim();
  const qty = +buyQty.value;
  const price = +buyPrice.value;

  if (!name || qty <= 0 || price <= 0) return alert('همه فیلدها را پر کنید');

  if (!db.products[name]) db.products[name] = { qty: 0, totalCost: 0 };
  db.products[name].qty += qty;
  db.products[name].totalCost += qty * price;

  db.purchases.unshift({ name, qty, price, date: new Date().toISOString() });

  buyName.value = buyQty.value = buyPrice.value = '';
  save();
}

function addSell() {
  const name = sellName.value.trim();
  const qty = +sellQty.value;
  const price = +sellPrice.value;

  if (!name || qty <= 0 || price <= 0) return alert('همه فیلدها را پر کنید');
  if (!db.products[name] || db.products[name].qty < qty) return alert('موجودی کافی نیست');

  const avgCost = db.products[name].totalCost / db.products[name].qty;
  const cost = avgCost * qty;

  db.products[name].qty -= qty;
  db.products[name].totalCost -= cost;

  db.sales.unshift({ name, qty, price, cost, date: new Date().toISOString() });

  sellName.value = sellQty.value = sellPrice.value = '';
  save();
}

function addCustomer() {
  const name = custName.value.trim();
  const phone = custPhone.value.trim();
  if (!name) return alert('نام مشتری را وارد کنید');
  db.customers.push({ name, phone, debt: 0 });
  custName.value = custPhone.value = '';
  save();
}

function renderAll() {
  renderStock();
  renderCustomers();
  renderReport();
}

function renderStock() {
  const tbody = document.querySelector('#stockTable tbody');
  tbody.innerHTML = '';
  for (const [name, p] of Object.entries(db.products)) {
    const avg = p.qty > 0 ? (p.totalCost / p.qty).toFixed(0) : 0;
    tbody.innerHTML += `<tr><td>${name}</td><td>${p.qty}</td><td>${(+avg).toLocaleString()}</td></tr>`;
  }
}

function renderCustomers() {
  const tbody = document.querySelector('#custTable tbody');
  tbody.innerHTML = '';
  db.customers.forEach(c => {
    tbody.innerHTML += `<tr><td>${c.name}</td><td>${c.phone || '-'}</td><td>${c.debt.toLocaleString()}</td></tr>`;
  });
}

function renderReport() {
  let income = 0, expense = 0;
  db.sales.forEach(s => {
    income += s.qty * s.price;
    expense += s.cost;
  });
  const profit = income - expense;
  const stockValue = Object.values(db.products).reduce((a, p) => a + p.totalCost, 0);

  reportBox.innerHTML = `
    <div>🧾 تعداد فروش: <b>${db.sales.length}</b></div>
    <div>💵 درآمد کل: <b>${income.toLocaleString()}</b></div>
    <div>📉 هزینه کالای فروخته‌شده: <b>${expense.toLocaleString()}</b></div>
    <div>🏦 ارزش انبار: <b>${stockValue.toLocaleString()}</b></div>
    <hr>
    <div style="font-size:18px;color:${profit>=0?'green':'red'}">
      سود خالص: <b>${profit.toLocaleString()}</b>
    </div>
  `;
}

renderAll();
