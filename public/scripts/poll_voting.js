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

  // Submit votes to backend to create choice_rankings
  $('#submit-btn').click(() => {
    let rankedChoices = [];

    // Add each choice name to the array
    $('ul li').each(function() {
      rankedChoices.push($(this).text())
    });

    // Get pollKey
    const pollKey = rankedChoices.slice(-1);
    rankedChoices = rankedChoices.slice(0, rankedChoices.length - 1).reverse();
    const dataObj = {};
    for (let i = 0; i < rankedChoices.length; i++) {
      dataObj[rankedChoices[i]] = i + 1;
    }
    console.log("rankedChoices", rankedChoices);
    console.log("pollKey", pollKey);
    console.log("dataObj", dataObj);
    $.post(`/polls/${pollKey}`, dataObj)
      .then((data) => {
        if (data === "Redirect") {
          window.location = `/polls/${pollKey}/result`
        }
      });
  });
});
