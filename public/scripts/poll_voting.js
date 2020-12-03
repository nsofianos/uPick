$(() => {
  // Make poll choices draggable
  $('#sortable').sortable();

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
