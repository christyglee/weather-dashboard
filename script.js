//Document ready function
$(document).ready(function () {
    $('#searchBtn').on('click', function () {
        let searchInput = $('#searchInput').val();

        // clear search box
        $('#searchInput').val('');

        weatherReport(searchInput);
    });

    //event listener for history
    $(document).on('click', '.list-group-item', function () {
        // console.log('Clicked history!');
        weatherReport($(this).text());
    });

    // $('history').on('click', 'li', function() {
    //     weatherReport($(this).text());
    // });

    function searchHistory(text) {
        let li = $('<li>').addClass('list-group-item list-group-item-action').text(text);
        $('.history').append(li);
    }

    //Define weatherReport function
    function weatherReport(searchInput) {
        // AJAX call
        $.ajax({
            //Updated url to https:// to try to fix deployed link error
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=3f93d38aeb608fadb9535673724748b9&units=imperial",
            method: 'GET',

        }).then(function (data) {
            // console.log(data);

            // empty out old data
            $('#today').empty();

            if (history.indexOf(searchInput) === -1) {
                history.push(searchInput);
                localStorage.setItem('history', JSON.stringify(history));

                searchHistory(searchInput);
            }
       
            // create variables for weather search
            let title = $('<h3>').addClass('card-title').text(data.name + ' (' + new Date().toLocaleDateString() + ')');
            let card = $('<div>').addClass('card');
            let wind = $('<p>').addClass('card-text').text('Wind Speed: ' + data.wind.speed + ' MPH');
            let humidity = $('<p>').addClass('card-text').text('Humidity: ' + data.main.humidity + "%");
            let tempurature = $('<p>').addClass('card-text').text('Tempurature: ' + data.main.temp + ' °F');
            let cardBody = $('<div>').addClass('card-body');
                                                //updated to https:// due to deployed link error
            let image = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png');

            //append to the page
            title.append(image);
            cardBody.append(title, tempurature, humidity, wind);
            card.append(cardBody);

            // console.log(card);

            $('#today').append(card);

            forecast(searchInput);
            console.log(data.coord.lat)
            console.log(data.coord.lon)
            uvIndex(data.coord.lat, data.coord.lon);
            
        });
    }
    //define forecast function
    function forecast(searchInput) {
        // AJAX call
        $.ajax({
            //Updated url to https:// to try to fix deployed link error
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&appid=3f93d38aeb608fadb9535673724748b9&units=imperial",
            method: 'GET',
            
        }).then(function (data) {
            console.log(data);
            //create divs in html and append
            $('#forecast').html('<h4 class=\"mt-3\">5-Day Forecast:</h4>').append('<div class=\'row\'>');

            //for loop
            for (let i = 0; i < data.list.length; i++) {

                if (data.list[i].dt_txt.indexOf('15:00:00') !== -1) {
                    
                    // html elements
                    let column = $('<div>').addClass('col-md-2');
                    let card = $('<div>').addClass('card bg-primary text-white');
                    let body = $('<div>').addClass('card-body p-2');
                    let title = $('<h5>').addClass('card-title').text(new Date(data.list[i].dt_txt).toLocaleDateString());
                                                        //updated to https:// due to deployed link error
                    let image = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png');
                    let tempurature = $('<p>').addClass('card-text').text('Tempurature: ' + data.list[i].main.temp_max + ' °F');
                    let humidity = $('<p>').addClass('card-text').text('Humidity: ' + data.list[i].main.humidity + "%");

                    column.append(card.append(body.append(title, image, tempurature, humidity)));
                    //create new frow for colmun to append to
                    $('#forecast .row').append(column);
                }
            }
        });
    }
    //define uv index
    function uvIndex(lat, lon) {
        // console.log(`${lat} ${lon}`)
        // AJAX call
        $.ajax({
            //Updated url to https:// to try to fix deployed link error
            url: "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=3f93d38aeb608fadb9535673724748b9&units=imperial",
            method: 'GET',

        }).then(function (data) {
            console.log(data)

            let uv = $('<div>').text('UV Index: ');
            let button = $('<span>').addClass('btn btn sm').text(data.value);

            // color change 
            if (data.value < 3) {
                button.addClass('btn-success');
            }
            else if (data.value < 7) {
                button.addClass('btn-warning');
            }
            else {
                button.addClass('btn-danger');
            }

            $('#today .card-body').append(uv.append(button));

        });
    }

    // history 
    let history = JSON.parse(localStorage.getItem('history')) || [];
    
    for (let i = 0; i < history.length; i++) {
        searchHistory(history[i]);
    }

});


