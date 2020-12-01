$(() => {
  // Make poll choices draggable
  $('#sortable').sortable();

  // Hide and show links on SHARE button press
  $('.share-links').hide();
  $('#share-btn').click(() => {
    const display = $('.share-links').css('display');
    if (display === 'none') {
      $('.share-links').slideDown();
    } else {
      $('.share-links').slideUp();
    }
  });
});
