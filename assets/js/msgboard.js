
var firebaseConfig = {
  apiKey: "AIzaSyBxhsSVuUdpKqx6EQXdwGupeOFyss6D3YU",
  authDomain: "portfolio-contacts-599f4.firebaseapp.com",
  databaseURL: "https://portfolio-contacts-599f4.firebaseio.com",
  projectId: "portfolio-contacts-599f4",
  storageBucket: "portfolio-contacts-599f4.appspot.com",
  messagingSenderId: "810458093542",
  appId: "1:810458093542:web:22e37d66c4fc5fc9afe827"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

///// ADD RECORDS TO THE FIREBASE DATABASE //////

//set variables//
var clickCounter = 0;
var name = 0;
var email = 0;
var message = "";
var date = 0;

///// ADD RECORDS TO THE DATABASE //////

$("#add-new-contact-btn").on("click", function () {
  event.preventDefault();

  clickCounter++;
  console.log(clickCounter)
  console.log();

  //grabs user input//
  // clickCounter = $("#counter-input").val().trim();
  name = $("#name-input").val().trim();
  email = $("#email-input").val().trim();
  message = $("#message-input").val().trim();
  date = $("#date-input").val().trim();

  //creates local "temporary" object for holding train data//
  var contactPush = {
    clickCounter: clickCounter,
    name: name,
    email: email,
    message: message,
    date: date,
  };

  //uploads data to the database
  database.ref().push(contactPush);

  console.log("got a Lead" + contactPush);

  console.log(contactPush.name);
  console.log(clickCounter);
  console.log(contactPush.email);
  console.log(contactPush.message);
  console.log(contactPush.date);

  // Alert
  alert("Message Added");

  // Clears all of the text-boxes
  $("#name-input").val("");
  $("#email-input").val("");
  $("#message-input").val("");
  $("#date-input").val("");

  console.log("data received")
});

///// CREATE A FIREBASE EVENT //////

//create a firebase event

database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  //store everything into a variable
  var contactCounter = childSnapshot.val().clickCounter;
  var contactName = childSnapshot.val().name;
  var contactEmail = childSnapshot.val().email;
  var contactMessage = childSnapshot.val().message;
  var contactDate = childSnapshot.val().date;

  console.log("Copied to Database" + contactCounter);

  // Add each contacts's data into the table
  $("#contacts-table > tbody").append(
    $("<tr>").append(
      $("<td>").text(contactCounter),
      $("<td>").text(contactName),
      $("<td>").text(contactEmail),
      $("<td>").text(contactMessage),
      $("<td>").text(contactDate),
    )
  );
  console.log("added to contacts table")

  // Append the new row to the table
  $("#contacts-table > tbody").append(newRow);
});

