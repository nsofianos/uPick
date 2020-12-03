// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

// FUNCTIONS ------------------------------
// Generate random string for unique poll id
const generateRandomString = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomString;
};

// Make POST request to /polls


// Creates a poll
const createPoll = function() {
$("#poll-form").submit((event) => {
  const first = $('#poll-choice1').val();
    const second = $('#poll-choice2').val();
    const third = $('#poll-choice3').val();
    const fourth = $('#poll-choice4').val();
    const fifth = $('#poll-choice5').val();
    let tmp = [first, second, third, fourth, fifth];
    let arr = [];
    let result = false;

      if (first !== '') {
        arr.push(first);
      }
      if (second !== '') {
        arr.push(second);
      }
      if (third !== '') {
        arr.push(third);
      }
      if (fourth !== '') {
        arr.push(fourth);
      }
      if (fifth !== '') {
        arr.push(fifth);
      }

    for(let i = 0; i < arr.length; i++) {
      console.log('Index of: ', arr.indexOf(arr[i]));
      console.log('Last index of: ', arr.lastIndexOf(arr[i]));
      if(arr.indexOf(arr[i]) !== arr.lastIndexOf(arr[i])){
        result = true;
        break;
        }
      }
      if(result) {
        event.preventDefault();
        $('#alert_prompt').text('You have a duplicate choice!').css({"color": "red"});
        $('#alert_prompt').slideDown('fast');
      } else {
        if (arr.length >= 2) {
        $('#alert_prompt').hide();
        const title = $("#poll-title").val();
        const description = $("#poll-description").val();
        const pollId = generateRandomString();
        const adminLink = `http://localhost:8080/polls/${pollId}`;
        const submissionLink = `http://localhost:8080/polls/${pollId}/results`;
        const data = {
          title,
          description,
          pollId,
          adminLink,
          submissionLink
        };
        $.post('/polls', data);
      } else {
        event.preventDefault();
        $('#alert_prompt').text('You don\'t have enough choices!').css({"color": "red"});
        $('#alert_prompt').slideDown('fast');
      }
    }
})
};

$(() => {
  // Hides alert prompt
  $('#alert_prompt').hide();

  // Pass form data from poll form to POST /polls route
  createPoll();
});