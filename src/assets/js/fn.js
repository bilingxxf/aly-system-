import jQuery from 'jquery'

(function ($) {
  $.fn.extend({
    slideBottom (pramas) {
      const slide = this[0].scrollHeight - this.height()
      this.animate({
        scrollTop: slide
      }, pramas.time || 0, pramas.ease || 'swing')
    }
  })
})(jQuery)
