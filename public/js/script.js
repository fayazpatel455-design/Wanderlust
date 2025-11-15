// // Example starter JavaScript for disabling form submissions if there are invalid fields
// <script>
// (() => {
//   'use strict'

//   // Fetch all the forms we want to apply custom Bootstrap validation styles to
//   const forms = document.querySelectorAll('.needs-validation')

//   // Loop over them and prevent submission
//   Array.from(forms).forEach(form => {
//     form.addEventListener('submit', event => {
//       if (!form.checkValidity()) {
//         event.preventDefault()
//         event.stopPropagation()
//       }

//       form.classList.add('was-validated')
//     }, false)
//   })
// })()
// </script>

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

