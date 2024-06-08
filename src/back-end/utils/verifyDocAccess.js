const AppError = require('./appError');
// Check if the user is able to perform operations with the document ID
// that the user claims to have access to

// NOTE: WE ASSUME EACH DOCUMENT WOULD HAVE A LIST OF RATERS AND RESEARCHERS
// TO IDENTIFY THEIR ACCESSABILITY.
module.exports = (req, res, next, doc) => {
  if (req.user.role == 'admin') {
    return false;
  }
  const isUnauthorised = (role, users) =>
    req.user.role === role &&
    users != null &&
    (users.length == 0 ||
      (users.length !== 0 && !users.some((user) => user._id == req.user.id)));
  const unauthRater = isUnauthorised('rater', doc.raters);
  const unauthResearcher = isUnauthorised('researcher', doc.researchers);
  return unauthRater || unauthResearcher;
};
