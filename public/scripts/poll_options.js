$(() => {

  //display 3 poll options by default
  $('#poll-choice4').hide();
  $('#poll-choice5').hide();

  //show more option fields if user types into the last field
  $('#poll-choice3').on('input', () => {
    $('#poll-choice4').slideDown();
  })
  $('#poll-choice4').on('input', () => {
    $('#poll-choice5').slideDown();
  })

});

