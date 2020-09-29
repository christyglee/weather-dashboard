//Document ready function
$(document).ready(function() {
    $('#searchBtn').on('click', function() {
        var searchInput = $('searchInput').val();

        // clear search box
        $('searchInput').val('');

        weatherReport(searchInput);
    });



})


