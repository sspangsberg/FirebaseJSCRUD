// Initialize Firebase
var config = {
  apiKey: "AIzaSyBExVuy9v_5_1ZVOC22EFMGyl0WBeVHO7M",
  authDomain: "firejs-crud.firebaseapp.com",
  databaseURL: "https://firejs-crud.firebaseio.com",
  projectId: "firejs-crud",
  storageBucket: "",
  messagingSenderId: "881060798996"
};

//global DB variables
var db;
var reviews;
var reviewsRef;

initializeApplication();

function initializeApplication() {
  firebase.initializeApp(config);
  db = firebase.database();

  reviews = document.getElementById("reviews");
  reviewsRef = db.ref("/reviews");

  createReview();
  readReviews();

  reviews.addEventListener("click", e => {
    updateReview(e);
    deleteReview(e);
  });
}

//CRUD operations
function createReview() {
  var reviewForm = document.getElementById("reviewForm");
  var fullName = document.getElementById("fullName");
  var message = document.getElementById("message");
  var hiddenId = document.getElementById("hiddenId");

  reviewForm.addEventListener("submit", e => {
    e.preventDefault();

    if (!fullName.value || !message.value) return null;

    var id = hiddenId.value || Date.now();

    db.ref("reviews/" + id).set({
      fullName: fullName.value,
      message: message.value,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });

    clearForm();
    Materialize.updateTextFields();
  });
}

function readReviews() {

  reviewsRef.on("child_added", data => {
    var li = document.createElement("li");
    li.id = data.key;
    li.innerHTML = reviewTemplate(data.val());
    reviews.appendChild(li);
  });

  reviewsRef.on("child_changed", data => {
    var reviewNode = document.getElementById(data.key);
    reviewNode.innerHTML = reviewTemplate(data.val());
  });

  reviewsRef.on("child_removed", data => {
    var reviewNode = document.getElementById(data.key);
    reviewNode.parentNode.removeChild(reviewNode);
  });

}

function updateReview(e) {
  var reviewNode = e.target.parentNode;

  if (e.target.classList.contains("edit")) {
    fullName.value = reviewNode.querySelector(".fullName").innerText;
    message.value = reviewNode.querySelector(".message").innerText;
  
    Materialize.updateTextFields();
    hiddenId.value = reviewNode.id;
  }
}

function deleteReview(e) {
  var reviewNode = e.target.parentNode;

  if (e.target.classList.contains("delete")) {
    var id = reviewNode.id;
    db.ref("reviews/" + id).remove(); //Delete node at Firebase
    clearForm();
  }
}

function reviewTemplate({ fullName, message, createdAt }) {
  var dateFormatted = new Date(createdAt);

  return `
    <div>
      <label>Full Name:</label>
      <label class="fullName"><strong>${fullName}</strong></label>
    </div>
    <div>
      <label>Message:</label>
      <label class="message">${message}</label>
    </div>
    <div>
      <label>Created:</label>
     <label class="createdAt">${dateFormatted}</label>
    </div>
    <br>
    <button class="waves-effect waves-light btn delete">Delete</button>
    <button class="waves-effect waves-light btn edit">Edit</button>
    <br><br><br><br>
  `;
}

// Utility method to clear the form
function clearForm() {
  fullName.value = "";
  message.value = "";
  hiddenId.value = "";
}
