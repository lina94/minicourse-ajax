
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    var streetString = $('#street').val();
    var cityString = $('#city').val();

    var address = streetString + ', ' + cityString;

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    $greeting.text('So, you want to live at ' + address + '?');
    // load streetview

    var streetViewUrl =  'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetViewUrl + '" />');


    var nytURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nytURL += '?' + $.param({
      'api-key': "8c6291b560ce44c383e49265a76bb35d",
      'q': cityString
  });


    var currentUrl = '';
    var currentHeadline = '';
    var currentPar = '';
    $.getJSON(nytURL, function(data)
    {
        $nytHeaderElem.text('New York Times Articles about ' + cityString);

        var articles = [];
        for (var i = 0; i < data.response.docs.length; i++)
        {
            currentUrl = data.response.docs[i].web_url;
            currentHeadline = data.response.docs[i].headline.main;
            currentPar = data.response.docs[i].snippet;

            articles.push( "<li class='article'> <a href='" + currentUrl + "'>" + currentHeadline + "</a> <p> " + currentPar + "</p> </li>" )

        }

        $( "<ul/>", {
            "id": "nytimes-articles",
            html: articles.join( "" )
        }).appendTo( ".nytimes-container" );
    }).error(function(){ $nytHeaderElem.text('New York Times Articles Could Not Be Loaded') });



    var wikiRequestTimeout = setTimeout(function (){
        $wikiElem.text("Failed to get Wikipedia resourses.");
    }, 8000);

    var wikiAjaxUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + cityString + '&format=json';

    var wikiTitle = '';
    var wikiArticleUrl = '';
    $.ajax({
        type: "GET",
        url: wikiAjaxUrl,      
        dataType : 'jsonp'
    }).done(function(data){
        console.log(data);
        var wikiPages = [];
        for (var i = 0; i < data.query.search.length; i++)
        {
            wikiTitle = data.query.search[i].title;
            wikiArticleUrl = 'http://en.wikipedia.org/wiki/' + wikiTitle;
            wikiPages.push( "<li> <a href='" + wikiArticleUrl + "'>" + wikiTitle + "</a></li>" );
        }
        $( "<ul/>", {
            "id": "wikipedia-links",
            html: wikiPages.join( "" )
        }).appendTo( ".wikipedia-container" );

        clearTimeout(wikiRequestTimeout);
    });

    return false;
};

$('#form-container').submit(loadData);
