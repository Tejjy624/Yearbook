const React = require('react');

const ProfileBio = function() {
  return (
    <textarea id = "ProfileBio" contentEditable = {true} placeholder = {'Tell us something about yourself!'}/>
  );
}

module.exports = ProfileBio;