const React = require('react');

/* import splash */
const Splash = require('../splashComponents/Splash');

/* import all child components */
const UpdateProfileText = require('./UpdateProfileText');
const ProfileLogo = require('./ProfileLogo');
const ProfileDots = require('./ProfileDots');
const ProfileImage = require('./ProfileImage');
const ProfileBio = require('./ProfileBio');
const ProfileQuestionnaire = require('./ProfileQuestionnaire');
const ProfileStateButtons = require('./ProfileStateButtons');

const Profile = function() {
  
          let xhr = new XMLHttpRequest();
          let query = window.location.href.split('user=')[1];

          xhr.open("GET", '/displayProfilePage?user=' + query, true);
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

          // set up callback function that will run when the HTTP response comes back
          xhr.onloadend = function(e) {

            if (xhr.responseText != 'new user') {
              // responseText is a string
              let data = JSON.parse(xhr.responseText);

              // get the postcard data out of the object "data" and display profile page
              document.getElementById("serverImage").src = data.image;
              document.getElementById('ProfileBio').value = data.bio;
              document.getElementById('ProfileQuestionnaireName').value = data.name;
              document.getElementById('ProfileQuestionnaireMajor').value = data.major;
              document.getElementById('ProfileQuestionnaireCollege').value = data.college;
              document.getElementById('ProfileQuestionnaireGender').value = data.gender;
              document.getElementById('ProfileQuestionnaireQuote').value = data.quote;
            }
          }  

        // send off request
        xhr.send(null); 

        return (
          <div id = "Profile">
            <ProfileStateButtons customText = 'update profile'/>
            <UpdateProfileText/>
            <ProfileLogo/>
            <ProfileDots/>
            <div id = "ProfileLeft">
                  <ProfileImage/>
            </div>
            <div id = "ProfileRight">
                  <ProfileBio/>
                  <ProfileQuestionnaire/>
            </div>

          </div>
        );
}

module.exports = Profile;
