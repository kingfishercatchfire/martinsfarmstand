/** MOBILE NAVIGATION **/

var $btn = $('.glyphicon-menu-hamburger');
var $nav = $('.mobile-nav');
$nav.hide();

$btn.on('click touchend', function(){
  $nav.slideDown();
  $btn.hide();
  $('img[src*="logo"]').hide();
});

/** SMOOTH SCROLLING TO ANCHORS ON SAME PAGE **/

$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1300);
        return false;
      }
    }
  });
});

/** Highlight Some Divs On Anchor Click **/

$('.directions-anchor').on('click touchend', function(){
  $('#directions-anchor').css('box-shadow', 'inset 0.005em 0.005em 0.8em #0e1b42');
});

/** GET INPUT FROM .subscribe AND ADD TO MAILCHIMP FORM ON BUTTON CLICK **/

var $subBtn = $('.subscribe button');
var $subInput = $('.subscribe input');
var $mceMail = $('#mce-EMAIL');
var $mceFname = $('#mce-FNAME');

$subBtn.on('click touchend', function(){
  var $email = $subInput.val();

  $mceMail.val($email);

});

$subInput.keypress(function (e) {
  if (e.which == 13) {
    $subBtn.click();
  };
});

/** Auto Fill Parentheses and Hyphen Phone Input **/

$phone = $('#mce-MMERGE4');

$phone.on("change keyup paste", function () {
    var output;
    var input = $phone.val();
    input = input.replace(/[^0-9]/g, '');
    var area = input.substr(0, 3);
    var pre = input.substr(3, 3);
    var tel = input.substr(6, 4);
    if (area.length < 3) {
        output = "(" + area;
    } else if (area.length == 3 && pre.length < 3) {
        output = "(" + area + ")" + " " + pre;
    } else if (area.length == 3 && pre.length == 3) {
        output = "(" + area + ")" + " " + pre + "-" + tel;
    }
    $phone.val(output);
});

/** Summer / Winter Hours Toggle & CSS Animation **/

var $hrs = $('div.hours');
var $winter = $('.winter-hrs');
var $summer = $('.summer-hrs');
var $hrsToggle = $('.hrs-toggle');

$summer.hide();
$hrsToggle.text('Summer Hours');

$hrsToggle.on('click touchend', function(){

    if ($(this).text() == "Summer Hours"){
    $winter.hide();
    $summer.fadeIn()
    $(this).text('Winter Hours');
  } else if ($(this).text() == "Winter Hours"){
    $summer.hide();
    $winter.fadeIn()
    $(this).text('Summer Hours');
  }
});

/** GOOGLE MAPS API **/

function initMap() {
  var myLatlng = {lat: 44.670491, lng:-74.904158};
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 10,
    center: myLatlng
  }); 

  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: 'Click to zoom'
  });
 map.addListener('center_changed', function() {
    // 10 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(function() {
      map.panTo(marker.getPosition());
    }, 10000);
  });

  marker.addListener('click', function() {
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  });
}


$getDirections = $('.directions-btn');

/** Directions to Farmstand from User's Location **/

var startingLocation;
var destination = "11 Needham Road, Potsdam NY 13676";

function goToGoogleMaps(startingLocation, destination) {
    window.location = "https://maps.google.co.uk/maps?saddr=" + startingLocation + "&daddr=" + destination;
}

$getDirections.on('click touchend', function(){
  // check if browser supports geolocation
if (navigator.geolocation) { 
     
    // get user's current position
    navigator.geolocation.getCurrentPosition(function (position) {   
         
        // get latitude and longitude
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        window.startingLocation = latitude + "," + longitude;
         
        // send starting location and destination to goToGoogleMaps function
        goToGoogleMaps(startingLocation, destination);
     });    
    };
});

//Wunderground API and Weather Data Implementation
$.ajax({
  type: "GET",
  url : "http://api.wunderground.com/api/4cb2a2c2502b2cc6/geolookup/conditions/forecast/date/q/44.670857,-74.904974.json",
  dataType : "jsonp",
  success : function(parsed_json) {

    //Today's weather
    var temp = parsed_json["current_observation"]["temp_f"];
    var feels = parsed_json["current_observation"]["feelslike_f"];

    $('.weather').append("<h3>Current temperature at Martin's Farmstand: " + temp + "&deg;F</h3>");
    $('.weather').append("<h3>Feels like: " + feels + "&deg;F</h3>");

    //Forecast for today and the following three days
    var forecast = parsed_json['forecast']['simpleforecast']['forecastday'];

        //loop through available weather forecast days
             for (index in forecast){
              //set icon based on current weather conditions
              var iconCondition = forecast[index]['icon'];
              var icon = "<img src='http://icons.wxug.com/i/c/f/" + iconCondition + ".gif'></img>";

              //define date variables
              var weekday = forecast[index]["date"]["weekday"];
              var month = forecast[index]["date"]["monthname"];
              var day = forecast[index]["date"]["day"];

              //forecast conditions
              var conditions = forecast[index]["conditions"];

              //find average of the day's high and low
          var avg = parseInt((parseInt(forecast[index]["high"]["fahrenheit"]) + parseInt(forecast[index]["low"]["fahrenheit"])) / 2);

          //print it all out neatly
              var forecastStr = $("<h3>" + icon + weekday + ", " + month + " " + day + ": " + conditions + ", " + avg + "&deg;F" + "</h3>");
              
              //append to body
              $(".weather").append(forecastStr);
             }

             //Append Wunderground logo
             $(".weather").append("<br />" + "<img src='img/wunderground.png' />");

    }
});


/** DISPLAY DATE **/

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

  var currentDate = new Date();
  var month = monthNames[currentDate.getMonth()];
  var day = currentDate.getDate();
  var year = currentDate.getFullYear();
  var today = month + ' ' + day + ', ' + year;


/** AVAILABILITY TABS **/



var $availableNavBtns = $('.available-nav button, .cta');
var $available = $('.available');
var $cta = $('.cta');
var $schedule = $('.schedule');
var $content = $('.available-content');

$availableNavBtns.on('click touchend', function(){
    $('.available-content h1, .available-content h2, .available-content ul, .available-content p').hide();
});

/** EXTENSIVE AVAILABLE LIST BUTTON **/

$available.on('click touchend', function(){

$.ajax({
    type: "GET",
    url: "daniel/EditItems.xml",
    dataType: "xml",
    success: function(xml){
    $content.append("<h1>Produce Availability List</h1>");
    $('.available-content').append("<ul></ul>");

    $(xml).find('Items').each(function(){
      var list = parseInt($(this).find("AvailabiltyList").text());
      var item = $(this).find("ItemName").text();
      var qty = $(this).find("QtyAvailable").text();
      
      if (list == 1 && qty){
      $('#available ul').append("<li>" + item + " &mdash; " + qty + "</li>");
    } else if (list == 1){
      $('#available ul').append("<li>" + item + "</li>");
    }

    });
  },
  error: function() {
    $content.append("<p>Unfortunately, we encountered an error trying to get the availability list. Please <a href='mailto:andrew@martinsfarmstand.com'>email Andrew</a> to report the problem.</p>")
  }
  });

});

/** AVAILABILITY LIST PAGE **/

$.ajax({
    type: "GET",
    url: "daniel/EditItems.xml",
    dataType: "xml",
    success: function(xml){
    $('.availability-page-list').append("<h1>Produce Availability List</h1>");
    $('.availability-page-list').append("<ul></ul>");

    $(xml).find('Items').each(function(){
      var list = parseInt($(this).find("AvailabiltyList").text());
      var item = $(this).find("ItemName").text();
      var qty = $(this).find("QtyAvailable").text();
      
      if (list == 1 && qty){
      $('.availability-page-list ul').append("<li>" + item + " &mdash; " + qty + "</li>");
    } else if (list == 1){
      $('.availability-page-list ul').append("<li>" + item + "</li>");
    }

    });
  },
  error: function() {
    $('.availability-page-list').append("<p>Unfortunately, we encountered an error trying to get the availability list. Please <a href='mailto:andrew@martinsfarmstand.com'>email Andrew</a> to report the problem.</p>")
  }
  });

/** SEASON SCHEDULE BUTTON **/

$schedule.on('click touchend', function(){

$.get('daniel/seasonschedule.html', function(data){
    $content.append("<h1>Our Crop Schedule</h1>");
  $content.append("<p>" + data + "</p>");
});

});