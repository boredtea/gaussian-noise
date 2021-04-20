var submit = document.getElementById("submit");
submit.onclick = function () {
  var data = document.getElementById("content").value;
  fetch("/addRoom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: data }),
  })
    //  console.log('hi')
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
