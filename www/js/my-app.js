"use strict";
/*global navigator, document, Framework7, Dom7 */
// opgelet: app = cordova initialisatie
//          myApp : F7 initialisatie

// ----------- Cordova basis initialisatie ---------------- //
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();

// ----------- Framework7 basis initialisatie ---------------- //
// Initialize your app
var myApp = new Framework7({
    material: true,
    animatePages: true,
    swipeout: true,
    init: false
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: false,
    noAnimate: true,
    domCache: true // enable inline pages
});

var calendarDefault = myApp.calendar({
    input: '#myMonth',
    dateFormat: 'yyyy-mm-dd'
    //rangepicker: True

});




myApp.onPageInit('search', function (page) {
    console.log(page.name + ' initialized');
    Loading();
    $(document.body).css('visibility','hidden');
    $('#btnSave').prop('disabled', true);
    setTimeout(checkSession,500);
    //$('#SaveText').html('');
    $('#profielfoto').attr("src",localStorage.getItem("profilepicture"))
});

$$('.panel-close').on('click', function (e) {
    myApp.closePanel();
});

var user;


$('input:radio[name="themaRadio"]').change(
    function(){
        if (this.checked && this.value == 'Blauw') {
            //changecolor('blue')
            $('.navbar-inner').css('background-color', 'rgb(30,128,240)');
            $('.toolbar-inner').css('background-color', 'rgb(30,128,240)');
            $('#SaveText').html('');
        }


        else if (this.checked && this.value == 'Oranje') {
            //changecolor('orange')
            $('.navbar-inner').css('background-color', 'Orange');
            $('.toolbar-inner').css('background-color', 'Orange');
            $('#SaveText').html('');
        }
        else if (this.checked && this.value == 'Groen') {
            //changecolor('green')
            $('.navbar-inner').css('background-color', 'green');
            $('.toolbar-inner').css('background-color', 'green');
            $('#SaveText').html('');
        }
        $('#btnSave').removeAttr("disabled");
    });

function saveColor (color)
    {
        $('#SaveTextError').html('');
        changecolor(color);

        $.post({
            url:'https://concerttracker.aenterprise.info/Thema.php',
            data: {value: color, user: user},
            success: function(result,e){
                result = JSON.parse(result);
                console.log(result.Thema + " " + e);
                $('#SaveText').html('Theme succesfully changed!');
                $('#btnSave').prop('disabled', true);
            }
        }).fail(function() {
            alert( "error" );
            $('#SaveTextError').html('Controleer uw internetverbinding!');
            $('#btnSave').prop('disabled', false);
        })
    }

$('#btnSave').click(function () {
    console.log('click save');
    if ($("#formThema input[type='radio']:checked").val() == 'Blauw') {
        saveColor('blue');
        console.log('Blauw is geselecteerd');
    }
    if ($("#formThema input[type='radio']:checked").val() == 'Oranje') {
        saveColor('orange');
        console.log('oranje is geselecteerd');
    }
    if ($("#formThema input[type='radio']:checked").val() == 'Groen') {
        saveColor('green');
        console.log('groen is geselecteerd');
    }

    $('#btnSave').prop('disabled', true);


});

function changecolor(value){
    $('#' + value).attr("checked",true);
    //$('#btnSave').removeAttr("disabled");
    $(document).ready(function(){
        if(value == 'blue'){
            $('.navbar-inner').css('background-color', 'rgb(30,128,240)');
            $('.toolbar-inner').css('background-color', 'rgb(30,128,240)');
        } else {
            $('.navbar-inner').css('background-color', value);
            $('.toolbar-inner').css('background-color', value);
        }
    });

}
//https://cdn.rawgit.com/TijsDeBelie/CityNames/master/cities.json

var autocompleteDropdownAjax = myApp.autocomplete({
    input: '#myPlace',
    openIn: 'dropdown',
    preloader: true, //enable preloader
    valueProperty: 'code', //object's "value" property name
    textProperty: 'name', //object's "text" property name
    limit: 20, //limit to 20 results
    dropdownPlaceholderText: 'Try "Belgium"',
    expandInput: true, // expand input
    source: function (autocomplete, query, render) {
        var results = [];
        if (query.length === 0) {
            render(results);
            return;
        }
        // Show Preloader
        autocomplete.showPreloader();
        // Do Ajax request to Autocomplete data
        $$.ajax({
            url: 'Countrylist.json',
            method: 'GET',
            dataType: 'json',
            //send "query" to server. Useful in case you generate response dynamically
            data: {
                query: query
            },
            success: function (data) {
                // Find matched items
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                }
                // Hide Preoloader
                autocomplete.hidePreloader();
                // Render items by passing array with result items
                render(results);
            }
        });
    }
});

$(function () {
   $('#btnSaveAccount').click(function () {
       UpdateAccount(
           user,
           $('#txtVoornaam').val(),
           $('#txtFamilienaam').val(),
           $('#txtEmail').val(),
           $('#txtGeboortedatum').val());
   })
});

function UpdateAccount(user, voornaam, familienaam, email, geboortedatum)
{
    $.post({
        url:'https://concerttracker.aenterprise.info/Account.php',
        data: {User: user, Voornaam: voornaam, Familienaam: familienaam, Email: email, Geboortedatum: geboortedatum},
        success: function(result,e){
            $('#SaveAccount').html('Gegevens werden succesvol gewijzigd!');
        }
    });
}











function checkSession() {

    $.ajax({
        url: "https://concerttracker.aenterprise.info/session.php",
        type: "POST",
        async:false,
        cache:false
    }).done(function(result) {
        result = JSON.parse(result);
        console.log("done");
        console.log(result);
        var thema = result.Thema;
        console.log("themakleur uit session.php:" + thema);
        if (result.admin){
            $(document.body).css('visibility','visible');
            VerbergLoading();
            console.log("admin");
            changecolor(thema);

        }
        else if (result.username){

            $(document.body).css('visibility','visible');
            VerbergLoading();
            console.log("logged in as user")
            changecolor(thema);
        }else if (!result.username) {
            VerbergLoading();
            window.location.href = "login.html";
            console.log("not logged in");
            changecolor(thema);
        }

        user = result.username;

        $('#txtVoornaam').val(result.Voornaam);
        $('#txtFamilienaam').val(result.Familienaam);
        $('#txtEmail').val(result.Email);
        $('#txtGeboortedatum').val(result.Geboortedatum);

        $("#Welcome").html("Welcome back " + user + "!");


    }).fail(function( xhr, status, errorThrown ) {
        alert( "Sorry, there was a problem!" );
        console.log( "Error: " + errorThrown );
        console.log( "Status: " + status );
        console.dir( xhr );
        window.location.href = "login.html";
    });
}
myApp.init();


