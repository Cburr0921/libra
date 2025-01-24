const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');


module.exports = {
    signUp,
    logIn
};

async function signUp (req, res) {
   try{
    const user = await User.create(req.body);
    const token = createJWT(user); 
    res.json(token);
   } catch (err){
    console.log(err);
    res.status(400).json({ message: 'Duplicate Email' });
   }
}

async function logIn(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) throw new Error();
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) throw new Error();
      const token = createJWT(user);
      res.json(token);
    } catch (err) {
      res.status(400).json({ message: 'Bad Credentials' });
    }
  }




/* Help Functions */

function createJWT(user){
    return jwt.sign(
        {user},
        process.env.SECRET,
        {expiresIn: '24h'}
    );
}