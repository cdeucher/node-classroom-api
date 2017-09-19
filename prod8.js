/* --example: configuration.js --
var configuration = {
    'SCOPES': ['https://www.googleapis.com/auth/classroom.courses'],
    'path_key': './pathOfJsonKeyOAuth',
    'subject': 'email_subject@gmail.com' };
module.exports = configuration;
*/
const google = require('googleapis');
var configuration = require('./configuration');
const google_key = require(configuration.path_key); //download from google API console

const jwtClient = new google.auth.JWT(
  google_key.client_email,
  null,
  google_key.private_key,
  ["https://www.googleapis.com/auth/classroom.courses"],
  configuration.subject
);
jwtClient.authorize((err, tokens) => (err
  ? console.log(err)
  : (() => {
    console.log("Google-API Authed!");
    listCourses(jwtClient);
  })()
));

function listCourses(auth) {
  var classroom = google.classroom('v1');
  classroom.courses.list({
    auth: auth,
    pageSize: 10
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var courses = response.courses;
    if (!courses || courses.length == 0) {
      console.log('No courses found.');
    } else {
      console.log('Courses:');
      for (var i = 0; i < courses.length; i++) {
        var course = courses[i];
        console.log('%s (%s)', course.name, course.id);
      }
    }
  });
}
