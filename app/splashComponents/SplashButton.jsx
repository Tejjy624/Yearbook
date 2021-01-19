const React = require('react');
const {Link} = require('react-router-dom');

const SplashButton = function (props) {
  
  const loginButton = () => {
    if (props.customText == 'Graduate Login') {
      window.location.href = '/auth/google';
    }
    else {
      window.location.href = "/search";
    }
  }
  
  return (
    <div className = "SplashButton" onClick = {loginButton}>    
      {props.customText}
    </div>
  );
}

module.exports = SplashButton;