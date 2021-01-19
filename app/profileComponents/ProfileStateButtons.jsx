const React = require('react');

const ProfileStateButton = function (props) {
  
  const updateProfilePage = () => {
      // retrieve handlers for json parsing
      let serverImageListener = document.getElementById('serverImage');
      let profileBioListener = document.getElementById('ProfileBio');
      let profileNameListener = document.getElementById('ProfileQuestionnaireName');
      let profileMajorListener = document.getElementById('ProfileQuestionnaireMajor');
      let profileCollegeListener = document.getElementById('ProfileQuestionnaireCollege');
      let profileGenderListener = document.getElementById('ProfileQuestionnaireGender');
      let profileQuoteListener = document.getElementById('ProfileQuestionnaireQuote');

      // init XMLHttpRequest; make sure this is asynchronous
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/updateProfilePage", true);

      // pack JSON object
      let profileJSON = {
        email: window.location.href.split('?user=')[1],
        name: profileNameListener.value,
        major: profileMajorListener.value,
        quote: profileQuoteListener.value,
        gender: profileGenderListener.value,
        college: profileCollegeListener.value,
        image: serverImageListener.src,
        bio: profileBioListener.value,
      }
      
      console.log(profileJSON.email);

      // callback function for when the HTTP response returns
      xhr.onloadend = function() {
        console.log(xhr.responseText);
        // show user that the profile has been updated
        document.getElementById('UpdateProfileText').textContent = 'Profile Updated!';
        document.getElementById('UpdateProfileText').style.left = '5%';
      }
      // from Eli Gonzalez
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      // send the postcard in JSON form
      xhr.send(JSON.stringify(profileJSON));
  } 
  
  return (
    <div className = "ProfileStateButton" onClick = {updateProfilePage}>
      {props.customText}
    </div>
  );
}

module.exports = ProfileStateButton ;