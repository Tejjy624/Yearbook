const React = require('react');

const ProfileQuestionnaire = function() {
  return (
    <div id = "ProfileQuestionnaire">
      <div id = "ProfileQuestionnaireTop">
          <h1>Questionnaire</h1>
      </div>
      <div id = "ProfileQuestionnaireBottom">
        <input id = "ProfileQuestionnaireName" contentEditable = {true} placeholder = 'Name'/>
        <input id = "ProfileQuestionnaireMajor" contentEditable = {true} placeholder = 'Major'/>
        <input id = "ProfileQuestionnaireCollege" contentEditable = {true} placeholder = 'College'/>
        <input id = "ProfileQuestionnaireGender" contentEditable = {true} placeholder = 'Gender'/>
        <input id = "ProfileQuestionnaireQuote" contentEditable = {true} placeholder = 'Quote'/>
      </div>
    </div>
  );
}

module.exports = ProfileQuestionnaire;