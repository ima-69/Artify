exports.isValidPassword = password =>
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
