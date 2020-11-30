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

$(() => {
  // Pass form data from poll form to POST /polls route
  $("#poll-form").submit((event) => {
    // const creatorId = $();
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

    // Make POST request to /polls
    $.post('/polls', data)

    // HELPER FUNCTIONS

    // Generate random string for unique poll id
    const generateRandomString = () => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let randomString = "";
      for (let i = 0; i < 6; i++) {
        randomString += chars[Math.floor(Math.random() * chars.length)];
      }
      return randomString;
    };

  });
});
