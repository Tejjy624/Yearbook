const React = require('react');

const ProfileImage = function() {
  
  const uploadProfileImage = () => {
    // get the file chosen by the file dialog control
    const selectedFile = document.getElementById('fileChooser').files[0];
    // store it in a FormData object
    const formData = new FormData();
    // name of field, the file itself, and its name
    formData.append('newImage',selectedFile, selectedFile.name);

    // build a browser-style HTTP request data structure
    const xhr = new XMLHttpRequest();
    // it will be a POST request, the URL will this page's URL+"/upload" 
    xhr.open("POST", "/uploadProfileImage", true);
  
    // callback function executed when the HTTP response comes back
    xhr.onloadend = function(e) {
        // Get the server's response body
        console.log(xhr.responseText);
        // now that the image is on the server, we can display it!
        let newImage = document.getElementById("serverImage");
        newImage.src = "http://ecs162.org:3000/images/erzhou/"+selectedFile.name;
    }
  
    // actually send the request
    xhr.send(formData);
  }
  
  return (
    <div id = "ProfileImageWrapper">
      <div id = "ProfileImage">
        <img id = "serverImage"/>
      </div>
      <label id = "chooseImageButton" htmlFor = "fileChooser">Upload Image</label>
      <input type = "file" id = "fileChooser" accept = "image/png, .jpeg, .jpg, image/gif" onChange = {uploadProfileImage}/>
    </div>
  );
}

module.exports = ProfileImage;

