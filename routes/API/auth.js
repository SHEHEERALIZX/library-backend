var express = require("express");
var router = express.Router();
const { LoginHelper, doSignUp } = require("../../Helpers/authenticationHelpers");



router.get("/login", async (req, res) => {
  res.status(200).send({ error:"Page Not Found", statusCode: 404 })
});


router.post("/login", async (req, res) => {
  try {
    const result = await LoginHelper(req.body)
    res.send(result)
  } catch (error) {
    return res.status(500).send({ error, statusCode: 500 })
  }
});



router.get("/signup", async (req, res) => {
  res.send({ error:"Page Not Found", statusCode: 404 })
 });
 
 

router.post("/signup", async (req, res) => {
  try {
    const result = await doSignUp(req.body)
    res.send(result)
  } catch (error) {
    return res.status(500).send({ error, statusCode: 500 })
  }

});





module.exports = router;
