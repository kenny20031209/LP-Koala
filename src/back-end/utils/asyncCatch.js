// Take a callback function, add a catching mechanism,
// and encapsulate all to a function that is to be returned.
module.exports = (f) => {
  return (req, res, next) => {
    f(req, res, next).catch(next);
  };
};
