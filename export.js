function exportExcel() {
  const wb = XLSX.utils.book_new();

  const stock = Object.entries(db.products).map(([name, p]) => ({
    کالا: name,
    تعداد: p.qty,
    'میانگین خرید': p.qty > 0 ? Math.round(p.totalCost / p.qty) : 0
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(stock), 'انبار');

  const sales = db.sales.map(s => ({
    کالا: s.name, تعداد: s.qty, 'قیمت فروش': s.price,
    تاریخ: new Date(s.date).toLocaleDateString('fa-IR')
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sales), 'فروش');

  const custs = db.customers.map(c => ({ نام: c.name, تلفن: c.phone, بدهی: c.debt }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(custs), 'مشتریان');

  XLSX.writeFile(wb, `hesabdar-${Date.now()}.xlsx`);
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let income = 0, expense = 0;
  db.sales.forEach(s => { income += s.qty * s.price; expense += s.cost; });
  const profit = income - expense;

  doc.setFontSize(16);
  doc.text('Accounting Report', 105, 15, { align: 'center' });

  doc.setFontSize(11);
  let y = 30;
  doc.text(`Total Sales: ${income}`, 15, y); y += 7;
  doc.text(`Total Cost: ${expense}`, 15, y); y += 7;
  doc.text(`Net Profit: ${profit}`, 15, y); y += 12;

  doc.text('Stock:', 15, y); y += 7;
  Object.entries(db.products).forEach(([name, p]) => {
    if (y > 280) { doc.addPage(); y = 20; }
    doc.text(`${name}  x${p.qty}`, 20, y);
    y += 6;
  });

  doc.save(`report-${Date.now()}.pdf`);
}

function resetData() {
  if (!confirm('همه داده‌ها پاک شود؟ غیرقابل بازگشت!')) return;
  localStorage.removeItem('accDB');
  location.reload();
}
