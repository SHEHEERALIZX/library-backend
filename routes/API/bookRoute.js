require("dotenv").config();
var express = require("express");
var router = express.Router();
const { GetBooks, SearchBook, SaveBookToShelf, AddBook } = require("../../Helpers/bookHelpers");


router.post("/addbook", async (req, res) => {

  try {

    AddBook(req.body).then((result) => {
      if (result.statusCode == 200) {
        res.status(200).send(result)
      } else {
        res.send(result)
      }
    })
  } catch (error) {
    console.log(error.message);
    res.send( { error: "interal server error", statusCode: 500 })
  }
  
});


// Retrive all data from the mongo database

router.get("/getbooks", async (req, res) => {
  try {

    GetBooks().then((result) => {
      if (result.statusCode == 200) {
        res.status(200).send(result)
      } else {
        res.send(result)
      }
    })
  } catch (error) {
    console.log(error.message);
    res.send( { error: "interal server error", statusCode: 500 })
  }
});


// Search book based on ISBN number using Google Book API

router.post("/searchbook", async (req, res) => {
  try {

    SearchBook(req.body).then((result) => {

      console.log(result);
      if (result.statusCode == 200) {
        res.status(200).send(result)
      } else {
        res.send(result)
      }
    })


  } catch (error) {
    console.log(error.message);
    res.send( { error: "interal server error", statusCode: 500 })
  }
  
});


router.post("/savebook", async (req, res) => {

  try {

    SaveBookToShelf(req.body).then((result) => {

      console.log(result);
      if (result.statusCode == 200) {
        res.status(200).send(result)
      } else {
        res.send(result)
      }
    })


  } catch (error) {
    console.log(error.message);
    res.send( { error: "interal server error", statusCode: 500 })
  }



});


module.exports = router;
