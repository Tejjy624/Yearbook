const React = require('react');
//import { Dropdown } from 'semantic-ui-react'
const Dropdown = require('semantic-ui-react');

const SearchLayer = function () {
  return (
    <div id = "SearchLayer">
    <div class = "Circle">
      <div class = "Circle2"></div>
    </div>    
    <div class = "text">SEARCH
      <div class = "SearchBar">
          <form action="/result" method="get">
          <input list="browsers" name="browser" id="browser"></input>
          <datalist id="browsers">
            <option value="Name"></option>
            <option value="Major"></option>
            <option value="College"></option>
            <option value="Gender"></option>
            <option value="Quote"></option>
          </datalist>
          <input type="submit"></input>
          </form>
      </div>
    </div>
      
  </div>
  );
}

module.exports = SearchLayer;