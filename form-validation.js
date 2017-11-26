$('document').ready(function() {
  // Initialize form validation on the registration form.
  // It has the name attribute "registration"
  $("form[name='add-quote-form']").validate({
    // Specify validation rules
    rules: {
      quote: {
        required: true,
        minlength: 5
      }
    },

    // Specify validation error messages
    messages: {
      quote: {
        required: "Please enter your quote.",
        minlength: "Enter at least 5 characters."
        }
      },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      form.submit();
    }
  });
});
