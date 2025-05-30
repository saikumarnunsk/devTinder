const valodator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!valodator.isEmail(emailId)) {
    throw new Error("Email is not valid!!");
  } else if (!valodator.isStrongPassword(password)) {
    throw new Error("please enter a strog password!");
  }
};

const validateProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoURL",
    "age",
    "gender",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((key) => {
    return allowedEditFields.includes(key);
  });

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateProfileData };
