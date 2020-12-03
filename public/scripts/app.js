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
const postReq = function() {
  $.post('/polls', data);
};


const checkDuplicate = function() {
    const first = $('#poll-choice1').val();
    const second = $('#poll-choice2').val();
    const third = $('#poll-choice3').val();
    const fourth = $('#poll-choice4').val();
    const fifth = $('#poll-choice5').val();
    let arr = [first, second, third, fourth, fifth];
    let result = false;
    // iterate over the array
    for(let i = 0; i < arr.length;i++) {
      // compare the first and last index of an element
      if(arr.indexOf(arr[i]) !== arr.lastIndexOf(arr[i])){
        result = true;
        // terminate the loop
        break;
        }
      }
      if(result) {
        event.preventDefault();
        $('#alert_prompt').slideDown('fast');
        $('#alert_prompt').text('You have a duplicate choice!');
      } else {
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
        postReq();
      }
   }

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

    console.log(arr);


    // iterate over the array
    for(let i = 0; i < arr.length;i++) {
      console.log('Index of: ', arr.indexOf(arr[i]));
      console.log('Last index of: ', arr.lastIndexOf(arr[i]));
      // compare the first and last index of an element
      if(arr.indexOf(arr[i]) !== arr.lastIndexOf(arr[i])){
        result = true;
        // terminate the loop
        break;
        }
      }
      if(result) {
        event.preventDefault();
        $('#alert_prompt').slideDown('fast');
        $('#alert_prompt').text('You have a duplicate choice!');
      } else {
        $('#alert_prompt').slideUp('fast');
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
        postReq();
      }
})
};

$(() => {
  // Hides alert prompt
  $('#alert_prompt').hide();

  // Pass form data from poll form to POST /polls route
  createPoll();
});



// Before
// event.preventDefault();
// const first = $('#poll-choice1').val();
// const second = $('#poll-choice2').val();
// const third = $('#poll-choice3').val();
// const fourth = $('#poll-choice4').val();
// const fifth = $('#poll-choice5').val();
// let tmp = [first, second, third, fourth, fifth];
// console.log(tmp);





// if ($(`#poll-choice${tmp}`).val() === $('#poll-choice2').val()) {
//   event.preventDefault();
//   $('#alert_prompt').slideDown('fast');
//   $('#alert_prompt').text('You have a duplicate choice!');
// } else {
//   const title = $("#poll-title").val();
//   const description = $("#poll-description").val();
//   const pollId = generateRandomString();
//   const adminLink = `http://localhost:8080/polls/${pollId}`;
//   const submissionLink = `http://localhost:8080/polls/${pollId}/results`;
//   const data = {
//     title,
//     description,
//     pollId,
//     adminLink,
//     submissionLink
//   };
//   postReq();
//   // $.ajax({
//   //   type: "POST",
//   //   url: `/polls/${pollId}`,
//   //   data: pollData
//   // }).then(function(data) {
//   //   $('#alert_prompt').slideUp('fast');
//   //   postReq();
//   //   generateRandomString();
//   // }).catch(function(data) {
//   //   console.log('Error: ', data);
//   // });
// }