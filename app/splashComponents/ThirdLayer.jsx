const React = require('react');
const SplashButton = require('./SplashButton');

const ThirdLayer = function () {
  return (
    <div id = "ThirdLayer">
      <div id = "ThirdLayerLeft"><SplashButton customText= "Graduate Login" link = '/login'></SplashButton></div>
      <div id = "ThirdLayerRight"><SplashButton customText= "Search" link = '/search'></SplashButton></div>
    </div>
  );
}

module.exports = ThirdLayer;