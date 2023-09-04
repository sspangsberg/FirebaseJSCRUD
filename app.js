var config = {
    apiKey: "AIzaSyCxMufNl3wbx8sYyPRF2NkxGi_a0xOtoZ0",
  authDomain: "fir-9-b4d92.firebaseapp.com",
  databaseURL: "https://fir-9-b4d92-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-9-b4d92",
  storageBucket: "fir-9-b4d92.appspot.com",
  messagingSenderId: "746921210041",
  appId: "1:746921210041:web:a71b760c6136e10db02b68"
};

//initialize database and global db ref
firebase.initializeApp(config);

//global DB variables
var db = firebase.database();;
var reviews = document.getElementById("reviews");;
var reviewsRef = db.ref("/reviews");;

setupEventHandlers();


function setupEventHandlers() {

    //user clicks the submit button (create or update)
    reviewForm.addEventListener("submit", e => {
        e.preventDefault(); //prevent page reload

        handleSubmit();
        Materialize.updateTextFields();
    });

    //user updates/deletes a particular review
    reviews.addEventListener("click", e => {
        updateReview(e);
        deleteReview(e);
    });

    //Firebase events
    reviewsRef.on("child_added", data => {
        readReviews(data);
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

//CRUD operations
function handleSubmit() {
    var reviewForm = document.getElementById("reviewForm");
    var fullName = document.getElementById("fullName");
    var message = document.getElementById("message");
    var tags = document.getElementById("tags");
    var hiddenId = document.getElementById("hiddenId");

    //perform simple client-side validation
    if (!fullName.value || !message.value || !tags) return null;

    var id = hiddenId.value || Date.now();

    //create new node / update existing node in Firebase    
    db.ref("reviews/" + id).set({
        fullName: fullName.value,
        message: message.value,
        tags: tags.value,
        createdAt: firebase.database.ServerValue.TIMESTAMP
    });


    clearForm();
}

function readReviews(data) {
    var li = document.createElement("li");
    li.id = data.key;
    li.innerHTML = reviewTemplate(data.val());
    reviews.appendChild(li);
}

function updateReview(e) {
    var reviewNode = e.target.parentNode;

    if (e.target.classList.contains("edit")) {
        fullName.value = reviewNode.querySelector(".fullName").innerText;
        message.value = reviewNode.querySelector(".message").innerText;
        tags.value = reviewNode.querySelector(".tags").innerText;

        hiddenId.value = reviewNode.id;
        Materialize.updateTextFields();
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


function reviewTemplate({ fullName, message, tags, createdAt }) {
    var createdAtFormatted = new Date(createdAt);

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
      <label>Tags:</label>
      <label class="tags">${tags}</label>
    </div>
    <div>
      <label>Created:</label>
     <label class="createdAt">${createdAtFormatted}</label>
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
    tags.value = "";
    hiddenId.value = "";
}
