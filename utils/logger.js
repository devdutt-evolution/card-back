exports.logger = (req, _res, next) => {
  console.log(req.method.toUpperCase(), " ", req.url);
  next();
};
