(() => {
  'use strict';

  // sabhi forms select karo jinke paas needs-validation class hai
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();  // form submit rok do
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

