const React = require('react');

/* import all child components */
const ResultDots = require('./ResultDots');
const ResultText = require('./ResultText');

const Result = function() {
  return (
    <div id = "Result">
      <ResultText></ResultText>
      <ResultDots></ResultDots>
      <div id = "ResultRows">
        <span class = "Box one">
        <span class = "Box two"></span>
        </span>
      </div>
      
      <div id = "ResultRows">
        <span class = "Box one">
          <span class = "Box two"></span>
        </span>
      </div>
      
      <div id = "ResultRows">
        <span class = "Box one">
          <span class = "Box two"></span>
        </span>
      </div>
    </div>
  );
}

module.exports = Result;
