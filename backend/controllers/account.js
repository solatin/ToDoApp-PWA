const express = require('express');
const router = express.Router();
const { verifyToken, generateToken } = require('../utils/jwt');
const accountModel = require('../models/account.model');

const ACCESS_SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
const ACCESS_EXP = parseInt(process.env.JWT_ACCESS_TOKEN_EXP);
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
const REFRESH_EXP = parseInt(process.env.JWT_REFRESH_TOKEN_EXP);

router.post('/register', async (req, res) => {
  const account = req.body;
  const jwtRefreshToken = await generateToken({}, REFRESH_SECRET_KEY, REFRESH_EXP);
  account.refresh_token = jwtRefreshToken;
  const id = await accountModel.add(account);

  const jwtPayload = {id};
  const jwtAccessToken = await generateToken(jwtPayload, ACCESS_SECRET_KEY, ACCESS_EXP);
  return res.status(201).json({
    message: 'Register account successfully',
    jwtAccessToken,
    jwtRefreshToken
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const account = await accountModel.findByEmail(email);
  if (!account) {
    return res.status(401).json({
      message: 'Email does not exist'
    });
  }

  const validate = account.password === password;
  if (!validate) {
    return res.status(401).json({
      message: 'Incorrect password'
    });
  }

  const { id } = account;
  const jwtPayload = { id };
  const jwtAccessToken = await generateToken(jwtPayload, ACCESS_SECRET_KEY, ACCESS_EXP);
  const jwtRefreshToken = await generateToken({}, REFRESH_SECRET_KEY, REFRESH_EXP);

  account.refresh_token = jwtRefreshToken;
  await accountModel.patch(account);

  return res.status(201).json({
    jwtAccessToken,
    jwtRefreshToken,
    email: account.email,
  });
});

router.post('/refresh-token', async(req, res) => {
  const {accessToken, refreshToken} = req.body;
  try{
    await verifyToken(refreshToken, REFRESH_SECRET_KEY);
    const {id} = await verifyToken(accessToken, ACCESS_SECRET_KEY, true);
    const account = await accountModel.findByID(id);

    if(refreshToken !== account.refresh_token){
      throw Error();
    }
    const newAcessToken = await generateToken({id}, ACCESS_SECRET_KEY, ACCESS_EXP);
    const newRefreshToken = await generateToken({}, REFRESH_SECRET_KEY, REFRESH_EXP);
    account.refresh_token = newRefreshToken;
    await accountModel.patch(account);

    res.status(201).json({
      access_token: newAcessToken,
      refresh_token: newRefreshToken
    })
  } catch(e){
    res.status(401).json({
      message: 'error refresh'
    })
  }
})

module.exports = router;