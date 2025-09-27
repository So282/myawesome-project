// --- Модальное окно ---
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

// Открытие
if (openBtn && dlg) {
  openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal();
    dlg.querySelector('input, select, textarea')?.focus();
  });
}

// Закрытие по кнопке
if (closeBtn && dlg) {
  closeBtn.addEventListener('click', () => dlg.close('cancel'));
}

// Восстановление фокуса и сброс формы
if (dlg) {
  dlg.addEventListener('close', () => {
    if (lastActive?.focus) lastActive.focus();
    if (form) {
      form.reset();
      form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    }
  });
}

// --- Валидация ---
if (form) {
  form.addEventListener('submit', (e) => {
    // Сброс кастомных ошибок
    [...form.elements].forEach(el => {
      if (typeof el.setCustomValidity === 'function') {
        el.setCustomValidity('');
      }
    });

    if (!form.checkValidity()) {
      e.preventDefault();

      // Кастомное сообщение для email
      const email = form.elements.email;
      if (email?.validity.typeMismatch) {
        email.setCustomValidity('Введите корректный e-mail, например name@example.com');
      }

      form.reportValidity();

      // Подсветка ошибок для скринридеров
      [...form.elements].forEach(el => {
        if (el.willValidate) {
          el.toggleAttribute('aria-invalid', !el.checkValidity());
        }
      });
      return;
    }

    // Успешная отправка
    e.preventDefault();
    alert('Спасибо! Ваше сообщение отправлено.');
    dlg.close('success');
  });
}

// --- Маска телефона ---
const phone = document.getElementById('phone');
if (phone) {
  phone.addEventListener('input', () => {
    let digits = phone.value.replace(/\D/g, '').slice(0, 11);
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);

    let formatted = '';
    if (digits.length > 0) formatted = '+7';
    if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ')';
    if (digits.length > 4) formatted += ' ' + digits.slice(4, 7);
    if (digits.length > 7) formatted += '-' + digits.slice(7, 9);
    if (digits.length > 9) formatted += '-' + digits.slice(9, 11);

    phone.value = formatted;
  });

  phone.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');
}