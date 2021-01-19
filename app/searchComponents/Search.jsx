const React = require('react');
const SearchLayer = require('./SearchLayer');
const SearchLogo = require('./SearchLogo');


const Search = function() {
  return (
    <div id = "Search">
      <SearchLayer></SearchLayer>
      <SearchLogo></SearchLogo>
    </div>
  );
}

module.exports = Search;