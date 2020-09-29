//Document ready function
$(document).ready(function() {
    $('#searchBtn').on('click', function() {
        let searchInput = $('searchInput').val();

        // clear search box
        $('searchInput').val('');

        weatherReport(searchInput);
    });

    $('history').on('click', 'li', function() {
        weatherReport($(this).text());
    });

    function searchHistory(text) {
        let li = $('<li>').addClass('list-group-item list-group-item-action').text(text);
        $('.history').append(li);
    }

    //Define weatherReport function
    function weatherReport(searchInput) {
        // AJAX call
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=3f93d38aeb608fadb9535673724748b9&units=imperial",
            method: 'GET',
            success: function(data) {

                if(history.indexOf(searchInput) === -1) {
                    history.pushState(searchInput);
                    localStorage.setItem('history', JSON.stringify(history));

                    searchHistory(searchInput);
                }
                // create variables for weather search
                let title = $('<h3>').addClass('card-title').text(data.name + ' (' + new Date().toLocaleDateString() + ')');
                let card = $('<div>').addClass('card');
                let wind = $('<p>').addClass('card-text').text('Wind Speed: ' + data.wind.speed + ' MPH');
                let humidity = $('<p>').addClass('card-text').text('Humidity: ' + data.main.humidity + "%");
                let tempurature = $('<p>').addClass('card-text').text('Tempurature: ' + data.main.temp + ' °F');
                let cardBody = $('<div').addClass('card-body');
                let image = $('<img>').attr('src', "http://openweathermap.org/img/w/" + data.weather[0].icon + '.png');
                
                //append to the page
                title.append(img);
                cardBody.append(title, temp, humid, wind);
                card.append(cardBody);
                $('#today').append(card);

                forecast(searchInput);
                uvIndex(date.coord.lat, data.cord.lon);
                            
            }


           

        }) 



    }

});


