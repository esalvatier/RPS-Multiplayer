$(document).ready(function () {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBqe4-O9TKhNFQmvww3YG_h33CFC-uQVX8",
    authDomain: "realtime-rps-d10cb.firebaseapp.com",
    databaseURL: "https://realtime-rps-d10cb.firebaseio.com",
    projectId: "realtime-rps-d10cb",
    storageBucket: "",
    messagingSenderId: "95393753032"
  };

  firebase.initializeApp(config);
  var database = firebase.database();
  var player;

  function playerSelected(player, displayArea) {
    console.log(player);
    database.ref().on("value", function(snapshot) {
      console.log(snapshot.val()[player]);
      var title = $("<h1>").text(snapshot.val()[player].name);
      $("form").hide();
      var score = $("<div>").html("<p>Wins: "+ snapshot.val()[player].wins + "</p><p>Losses: " + snapshot.val()[player].losses + "</p><p>Ties: "+ snapshot.val()[player].ties + "</p>");
      $(displayArea).append(title, score);
    }, function(error){
      console.log("Error: " + error.code);
    });
  }
  
  function submitNewPlayer(playerNum) {
    var newForm = $("<form>");
    var divGrp = $("<div>").addClass("form-group")
    var lbl = $("<label>").attr("for", "user" + playerNum + "Name");
    var inpt = $("<input>").attr({"type": "text", "id": "user" + playerNum + "Name"}).addClass("form-control newUserName");
    divGrp.append(lbl, inpt);
    var sbmtBtn = $("<button>").attr("type", "submit").addClass("btn btn-default submitNewUser").text("Submit");
    newForm.append(divGrp, sbmtBtn);
    return newForm;
  }

  if (localStorage.getItem("rpsUWABootcampMES") !== null) {
    var localPlayers = JSON.parse(localStorage.getItem("rpsUWABootcampMES"));
    $("form").hide();
    localPlayers.forEach(function (current){
      var btn = $("<button>").text(current.player).addClass("playerSelect").attr("id", current.key);
      console.log(current.key);
      $(".returningPlayers").append(btn);
    });
    var newPlyr = $("<button>").text("New Player").addClass("newPlayer");
    $(".returningPlayers").append(newPlyr);
  } else {
    $(".player1Area").append(submitNewPlayer(1));
    $(".player2Area").append(submitNewPlayer(2));
  }

  $(document.body).on("click", ".submitNewUser", function (event) {
    event.preventDefault();
    var userName = $(".newUserName").val().trim();
    var userRef = database.ref().push();
    userRef.update({name: userName, wins: 0, losses: 0, ties: 0, readyToPlay: true});
    player = userRef.key;
    console.log(userRef.key);
    var pastPlayers = JSON.parse(localStorage.getItem("rpsUWABootcampMES"));
    if (pastPlayers === null) {
      pastPlayers = [];
    }
    console.log(pastPlayers);
    pastPlayers.push({key: userRef.key, player: userName});
    localStorage.setItem("rpsUWABootcampMES", JSON.stringify(pastPlayers));
    console.log(localStorage.getItem("rpsUWABootcampMES"));
    playerSelected(player, ".player1Area");
    $(this).parent().remove();
    console.log(player);
  });

  $(document.body).on("click", ".playerSelect", function (event) {
    player = $(this).attr("id");
    database.ref(player).update({readyToPlay: true});
    playerSelected(player, ".player1Area")
    $(".returningPlayers").empty();
  });

  $(document.body).on("click", ".newPlayer", function (event) {
    $(".player1Area").append(submitNewPlayer(1));
    $(".returningPlayers").empty();
  });

  $(window).on("unload", function (){
    database.ref(player).update({readyToPlay: false});
  });

});