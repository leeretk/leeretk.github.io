## Employer-Ready-Profile
Employer-Ready-Portfolio
Profile for Kamy Leeret

#Live Site: https://leeretk.github.io/Employer-Ready-Profile/

![](https://github.com/leeretk/Employer-Ready-Profile/blob/master/assets/images/er_portfolio.JPG) 

- [] Resume

# Projects: 
- [] Giftastic
- [] Train-Schedule
- [] Trails on Tap

# Sources:
- [] https://www.gstatic.com/firebasejs/6.0.4/firebase-app.js
- [] https://www.gstatic.com/firebasejs/6.0.4/firebase-database.js
- [] https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
- [] https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js
- [] https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js


# css:
- [] https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap.min.css
- [] assets\css\style.css

# Color Scheme: 
-[] #004d40 teal darken-4
-[] #616161 grey darken-2
-[] #37474f blue-grey darken-3
-[] #bcaaa4 brown lighten-3
-[] coral

## Trails on Tap
# Live link to this app: https://skip1113.github.io/class-pro-1/

participants:
Kamy Leeret
Skip Khamvongsa
Tammy Richardson

APIs we intend to use:
1.) Hiker Project Data API: https://www.hikingproject.com/data
2.) Brewerie API: https://www.openbrewerydb.org/
3.) Geocoding API: https://opencagedata.com/api

![](https://github.com/skip1113/class-pro-1/blob/master/assets/images/trailsscreenshot.JPG)

Our Vision
As developers we want to create an app that will allow the user to search for local hiking trails and breweries near by. 

## features

# Trails
search by city
name
location
difficulty level
ratings
summary

# Breweries
search by city
name
address
type
phone number
website

# User Stories

1) Audience: people who like to hike and drink beer
2) Helps people plan their hikes around favorite breweries or restaurants.
3) Geographically connect hiking trails to brewery locations:
    -provide trail directions to trail heads
    -directions to brewery venues
    -trail and brewery ratings
    -difficulty levels
4) Essential User Stories:  As a developer I want to provide...
    a) A website where you can search for hiking and breweries at the same time.
    b) I want to provide menu or beer ratings.
    c) I want to provide difficulty levels for hiking trails
    d) Provide hiking ratings or reviews.
    e) Route planner (bar hopping)
    f) Show maps or provide directions
    g) As a user I want to be able to plan my hiking adventures with one app -- with ease!


## GifTastic
# Live link to this app: https://leeretk.github.io/GifTastic/


![](https://github.com/leeretk/Employer-Ready-Profile/blob/master/assets/images/isnt_that_giftastic_img.jpg)

# What is it? 

Isn't this Giftastic is an app that lets you search Giphy images.  This game has a hockey theme and will allow you search on other topics as as well.

# What problem were we trying to Solve?
1) Create Ajax call to giphy site.
2) Bring back data into app.
3) Format app to arrange images with rating and title beneath each picture. 
    

## Data Connection: 
[ ] "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10";

## Attributes:
[ ] Image
[ ] Image Title
[ ] Image Rating

## Color Scheme: Avalanche Theme
[ ] #6f263d Avalanche Red
[ ] #236192 Avalanche Blue
[ ] #Black
[ ] #White

## Scripts
[ ]  rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap.min.css" 
[ ] src="assets/javascript/app.js"

## Objectives: 
1) create an array of strings, each one related to a topic that interests you. Save it to a variable called topics.
2) Your app should take the topics in this array and create buttons in your HTML.
3) Try using a loop that appends a button for each string in the array.
4) When the user clicks on a button, the page should grab 10 static, non-animated gif images from the getHockeyTopic API and place them on the page.  (note: This occurs with the search button but not the buttons from the array)
5) When the user clicks one of the still getHockeyTopic images, the gif should animate. If the user clicks the gif again, it should stop playing.
6) Under every gif, display its rating (PG, G, so on).  The Title and rating show in the console but they do not appear for every image in the output.  I had this working once but can't figure out what I did to break it.

# Bonus Goals
1) Each Request should add 10 gis to the page, NOT overwrite the existing gifs.
2) I attempted to integrate the search with the movie API. I was able to get the movie API to work for me but was unsuccessful in getting the ajax query to call them at the same time.
3) The queries do persist until you reload the page.

## train-schedule
# Live link to this app: https://leeretk.github.io/train-schedule/


![](https://github.com/leeretk/Employer-Ready-Profile/blob/master/assets/images/train_schedule_img.png)

# What is it? 

The train schedule application allows the user to input new trains and have them appear in the schedule. The expected arrival time adjusts depending on the frequency of the train schedule and the minutes away from arrival. This train application represents Grand Central Station in NYC with a picture of the GCS in the background.

# What problem were we trying to Solve?
    Move data from Firebase into the app.
    Move data from the app into Firebase.
    Calculate Arrival Time.

## Data Connection: 
[ ] Firebase

## Attributes:
[ ] Train Counter
[ ] Train Name
[ ] Train Destination
[ ] Train Frequency
[ ] Minutes Away
[ ] Arrival Time

## Color Scheme: Red, White and Blue
[ ] background-color:#0035AA;
[ ] border-color: red;

## Scripts
[ ] href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap.min.css"
[ ] src="https://www.gstatic.com/firebasejs/6.0.4/firebase-app.js"
[ ] src="https://www.gstatic.com/firebasejs/6.0.4/firebase-database.js"
[ ] src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"
[ ] src="assets/javascript/app.js"
[ ] src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
[ ] src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"
[ ] src="https://cdn.jsdelivr.net/momentjs/2.12.0/moment.min.js"
