_primero.Views.RequiredFields = _primero.Views.Base.extend({
  el: 'body',

  events: {
    "forminvalid.zf.abide form": "show_errors",
  },

  show_errors: function(e) {
    var self = this,
      $invalid_fields = $(e.target).find('[data-invalid]'),
      error_container = JST['templates/form_error_message'],
      errors = [];

    $('.errorExplanation').remove();
    $('.side-tab a span.label').remove();

    _.each($invalid_fields, function(field) {
      var $field = $(field);
      var $fieldset = $field.parents('fieldset.tab'),
        group = $fieldset.data('form-section-group-name'),
        form = $fieldset.data('form-name'),
        required_text = _primero.form_error_messages.required,
        label = $("label[for='"+$field.attr('id')+"']").text(),
        has_group = group ? group + " - " : "",
        message = "<li><span>" + has_group + form + " " + "</span><span>" + label + "</span>" +  " " + required_text + "</li>";

      errors.push(message);

      if (group) {
        self.show_tab_errors(group);
      }

      if (form) {
        self.show_tab_errors(form);
      }
    });

    if (errors.length > 0) {
      $('.side-tab-content').prepend(error_container({errors: errors}));
    }
  },

  show_tab_errors: function(tab) {
    var anchor = $('.side-tab a').filter(function(){
      var re = new RegExp("^" + tab + "\\d*$");
      return $(this).text().match(re);
    });
    var $jewel = anchor.find('.label');
    var $jewel_container = $('<span class="label alert"></span>');

    if ($jewel.length > 0) {
      var count = parseInt($jewel.text());
      count++
      $jewel.text(count);
    } else {
      anchor.append($jewel_container.text(1));
    }
  }
});