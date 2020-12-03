$(() => {
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

  // Copy links to clipboard on COPY button press
  // Admin link
  $('#admin-link-btn').click(() => {
    $('#admin-link').select();
    document.execCommand('copy');
    $('#admin-link-btn').after('<p id="copy-alert">Copied!</p>');
    $('#copy-alert').fadeOut('slow');
  });
  // Submission link
  $('#sub-link-btn').click(() => {
    $('#sub-link').select();
    document.execCommand('copy');
    $('#sub-link-btn').after('<p id="copy-alert2">Copied!</p>');
    $('#copy-alert2').fadeOut('slow');
  });
});
