const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const db = require("../models/db");

exports.register = async (req, res, next) => {
  const { FirstName, LastName, PhoneNumber, email,password, Address } = req.body;
  try {
    // validation
    if (!(FirstName && LastName && PhoneNumber && email && password && Address)) {
      return next(new Error("Fulfill all inputs"));
    }
    

    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);
    const data = {
      FirstName,
      LastName,
      PhoneNumber,
      email,
      password : hashedPassword,
      Address,
    };

    const rs = await db.user.create({ data  })
    console.log(rs)

    res.json({ msg: 'Register successful' })
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body; 
  try {
      const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
      if (!(email && email.trim() !== '' && emailRegex.test(email) && password.trim())) {
          throw new Error('Email or password must not be blank'); 
      }

      const user = await db.user.findFirstOrThrow({ where: { email } }); 
      const pwOk = await bcrypt.compare(password, user.password);
      if (!pwOk) {
          throw new Error('Invalid login');
      }

      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '30d'
      });
      console.log(token);
      res.json({ token: token });

  } catch (err) {
      next(err);
  }
};

exports.getme = (req,res,next) => {
  res.json(req.user)
}