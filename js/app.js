(function ($) {
    'use strict';

    /** MOBILE NAVIGATION **/
    function setupMobileNavigation() {
        var $btn = $('.glyphicon-menu-hamburger'),
            $nav = $('.mobile-nav');
        $nav.hide();

        $btn.on('click touchend', function () {
            $nav.slideDown();
            $btn.hide();
            $('img[src*="logo"]').hide();
        });

        /** SMOOTH SCROLLING TO ANCHORS ON SAME PAGE **/

        $(function () {
            $('a[href*=#]:not([href=#])').click(function () {
                if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top
                        }, 1300);
                        return false;
                    }
                }
            });
        });
    }

    /** Highlight Some Divs On Anchor Click **/
    function setupMailFormFunctions() {
        var $subBtn = $('.subscribe button'),
            $subInput = $('.subscribe input'),
            $mceMail = $('#mce-EMAIL'),
            $mceFname = $('#mce-FNAME');

        $('.directions-anchor').on('click touchend', function () {
            $('#directions-anchor').css('box-shadow', 'inset 0.005em 0.005em 0.8em #0e1b42');
        });

        /** GET INPUT FROM .subscribe AND ADD TO MAILCHIMP FORM ON BUTTON CLICK **/
        $subBtn.on('click touchend', function () {
            var $email = $subInput.val();
            $mceMail.val($email);
        });

        $subInput.keypress(function (e) {
            if (e.which === 13) {
                $subBtn.click();
            }
        });
    }

    /** Auto Fill Parentheses and Hyphen Phone Input **/
    function setupAutoFormatters() {
        var $phone = $('#mce-MMERGE4');

        $phone.on("change keyup paste", function () {
            var output,
                input = $phone.val(),
                area = input.substr(0, 3),
                pre = input.substr(3, 3),
                tel = input.substr(6, 4);

            input = input.replace(/[^0-9]/g, '');
            if (area.length < 3) {
                output = "(" + area;
            } else if (area.length === 3 && pre.length < 3) {
                output = "(" + area + ")" + " " + pre;
            } else if (area.length === 3 && pre.length === 3) {
                output = "(" + area + ")" + " " + pre + "-" + tel;
            }
            $phone.val(output);
        });
    }

    function setupHoursToggle() {
        /** Summer / Winter Hours Toggle & CSS Animation **/
        var $hrs = $('div.hours'),
            $winter = $('.winter-hrs'),
            $summer = $('.summer-hrs'),
            $hrsToggle = $('.hrs-toggle');

        $summer.hide();
        $hrsToggle.text('Summer Hours');

        $hrsToggle.on('click touchend', function () {
            if ($(this).text() === "Summer Hours") {
                $winter.hide();
                $summer.fadeIn();
                $(this).text('Winter Hours');
            } else if ($(this).text() === "Winter Hours") {
                $summer.hide();
                $winter.fadeIn();
                $(this).text('Summer Hours');
            }
        });
    }

    function setupDirections() {

        /** Directions to Farmstand from User's Location **/
        var $getDirections = $('.directions-btn'),
            startingLocation,
            destination = "11 Needham Road, Potsdam NY 13676";

        function goToGoogleMaps(startingLocation, destination) {
            window.location = "https://maps.google.co.uk/maps?saddr=" + startingLocation + "&daddr=" + destination;
        }

        $getDirections.on('click touchend', function () {
            // check if browser supports geolocation
            if (navigator.geolocation) {

                // get user's current position
                navigator.geolocation.getCurrentPosition(function (position) {
                    // get latitude and longitude
                    var latitude = position.coords.latitude,
                        longitude = position.coords.longitude;
                    window.startingLocation = latitude + "," + longitude;

                    // send starting location and destination to goToGoogleMaps function
                    goToGoogleMaps(startingLocation, destination);
                });
            }
        });
    }

    //Wunderground API and Weather Data Implementation
    function setupWeather() {
        $.ajax({
            type: "GET",
            url: "http://api.wunderground.com/api/4cb2a2c2502b2cc6/geolookup/conditions/forecast/date/q/44.670857,-74.904974.json",
            dataType: "jsonp",
            success: function (parsed_json) {

                //Today's weather
                var temp = parsed_json["current_observation"]["temp_f"],
                    feels = parsed_json["current_observation"]["feelslike_f"],
                    forecast = parsed_json['forecast']['simpleforecast']['forecastday'],
                    index, iconCondition, icon, weekday, month, day, conditions, avg, forecastStr

                $('.weather').append("<h3>Current temperature at Martin's Farmstand: " + temp + "&deg;F</h3>");
                $('.weather').append("<h3>Feels like: " + feels + "&deg;F</h3>");

                //Forecast for today and the following three days

                //loop through available weather forecast days
                for (index in forecast) {
                    //set icon based on current weather conditions
                    iconCondition = forecast[index]['icon'];
                    icon = "<img src='http://icons.wxug.com/i/c/f/" + iconCondition + ".gif'></img>";

                    //set date variables
                    weekday = forecast[index]["date"]["weekday"];
                    month = forecast[index]["date"]["monthname"];
                    day = forecast[index]["date"]["day"];

                    //forecast conditions
                    conditions = forecast[index]["conditions"];

                    //find average of the day's high and low
                    avg = parseInt((parseInt(forecast[index]["high"]["fahrenheit"]) + parseInt(forecast[index]["low"]["fahrenheit"])) / 2);

                    //print it all out neatly
                    forecastStr = $("<h3>" + icon + weekday + ", " + month + " " + day + ": " + conditions + ", " + avg + "&deg;F" + "</h3>");

                    //append to body
                    $(".weather").append(forecastStr);
                }

                //Append Wunderground logo
                $(".weather").append("<br />" + "<img src='img/wunderground.png' />");

            }
        });
    }

    /** DISPLAY DATE **/
    /* Are these used??
        var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

        var currentDate = new Date();
        var month = monthNames[currentDate.getMonth()];
        var day = currentDate.getDate();
        var year = currentDate.getFullYear();
        var today = month + ' ' + day + ', ' + year;
    */

    function setupAvailability() {
        /** AVAILABILITY TABS **/

        var $availableNavBtns = $('.available-nav button, .cta'),
            $available = $('.available'),
            $cta = $('.cta'),
            $schedule = $('.schedule'),
            $content = $('.available-content');

        $availableNavBtns.on('click touchend', function () {
            $('.available-content h1, .available-content h2, .available-content ul, .available-content p').hide();
        });

        /** EXTENSIVE AVAILABLE LIST BUTTON **/

        $available.on('click touchend', function () {

            $.ajax({
                type: "GET",
                url: "daniel/EditItems.xml",
                dataType: "xml",
                success: function (xml) {
                    $content.append("<h1>Produce Availability List</h1>");
                    $('.available-content').append("<ul></ul>");

                    $(xml).find('Items').each(function () {
                        var list = parseInt($(this).find("AvailabiltyList").text());
                        var item = $(this).find("ItemName").text();
                        var qty = $(this).find("QtyAvailable").text();

                        if (list === 1 && qty) {
                            $('#available ul').append("<li>" + item + " &mdash; " + qty + "</li>");
                        } else if (list === 1) {
                            $('#available ul').append("<li>" + item + "</li>");
                        }

                    });
                },
                error: function () {
                    $content.append("<p>Unfortunately, we encountered an error trying to get the availability list. Please <a href='mailto:andrew@martinsfarmstand.com'>email Andrew</a> to report the problem.</p>")
                }
            });

            /** SEASON SCHEDULE BUTTON **/
            $schedule.on('click touchend', function () {
                $.get('daniel/seasonschedule.html', function (data) {
                    $content.append("<h1>Our Crop Schedule</h1>");
                    $content.append("<p>" + data + "</p>");
                });

            });
        });

        /** AVAILABILITY LIST PAGE **/

        $.ajax({
            type: "GET",
            url: "daniel/EditItems.xml",
            dataType: "xml",
            success: function (xml) {
                $('.availability-page-list').append("<h1>Produce Availability List</h1>");
                $('.availability-page-list').append("<ul></ul>");

                $(xml).find('Items').each(function () {
                    var list = parseInt($(this).find("AvailabiltyList").text());
                    var item = $(this).find("ItemName").text();
                    var qty = $(this).find("QtyAvailable").text();

                    if (list === 1 && qty) {
                        $('.availability-page-list ul').append("<li>" + item + " &mdash; " + qty + "</li>");
                    } else if (list === 1) {
                        $('.availability-page-list ul').append("<li>" + item + "</li>");
                    }

                });
            },
            error: function () {
                $('.availability-page-list').append("<p>Unfortunately, we encountered an error trying to get the availability list. Please <a href='mailto:andrew@martinsfarmstand.com'>email Andrew</a> to report the problem.</p>");
            }
        });
    }


    setupMobileNavigation();
    setupMailFormFunctions();
    setupAutoFormatters();
    setupHoursToggle();
    setupDirections();
    setupWeather();
    setupAvailability();

}(jQuery));


function initMap() {
    var myLatlng = {
            lat: 44.670491,
            lng: -74.904158
        },
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 10,
            center: myLatlng
        }),
        marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Click to zoom'
        });
    map.addListener('center_changed', function () {
        // 10 seconds after the center of the map has changed, pan back to the
        // marker.
        window.setTimeout(function () {
            map.panTo(marker.getPosition());
        }, 10000);
    });

    marker.addListener('click', function () {
        map.setZoom(8);
        map.setCenter(marker.getPosition());
    });
}