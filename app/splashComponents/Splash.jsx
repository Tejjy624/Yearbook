const React = require('react');

/* import all child components */
const FirstLayer = require('./FirstLayer');
const PhotoLayer = require('./PhotoLayer');
const ThirdLayer = require('./ThirdLayer');
const ClassText = require('./ClassText');

/* the main page for the index route of this app */
const Splash = function() {
  return (
    <div id = "Splash">
      <ClassText></ClassText>
      <FirstLayer></FirstLayer>
      <PhotoLayer></PhotoLayer>
      <ThirdLayer></ThirdLayer>
    </div>
  );
}

module.exports = Splash;