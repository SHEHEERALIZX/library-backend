require("dotenv").config();
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");


const tokenVerify = require("../../Helpers/json_webtoken");
const Book = require("../..//models/booksID");
const LibraryShelf = require("../../models/LibraryShelf");


router.post("/addbook", async (req, res) => {
    try {
      const { bookID } = req.body;
      console.log("BookID " + bookID);
  
      if (bookID == "") {
        return res.status(200).send({ status: 422, error: "BookID required" });
        throw "Something Happened in server ";
      }
  
      const oldBook = await Book.findOne({ bookID: bookID });
  
      if (oldBook) {
        return res
          .status(200)
          .send({ status: 409, error: "Book already exists" });
      } else {
        let result = await Book.create({ bookID });
        return res.status(200).send({ status: 200, result });
      }
  
      throw "Something Happened in server ";
    } catch (error) {
      console.log(error);
    }
  });
  
  router.get("/getbooks", async (req, res) => {
    let lists = await LibraryShelf.find().lean();
  
    res.status(200).send(lists);
  });
  
  router.post("/searchbook", async (req, res) => {
    const { bookID } = req.body;
  
    console.log(bookID);
  
    try {
      if (bookID.length == 10 || bookID.length == 13) {
        axios
          .get(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${bookID}&key=AIzaSyB-QlMlotYmsLV0s8oSxUfgzXc-5hizT1g`
          )
          .then((result) => {
            console.log(result.data);
  
            if (result.data.totalItems == 0) {
              res
                .status(200)
                .send({ info: { queryStatus: "Book Not Found", status: 422 } });
            } else {
              res
                .status(200)
                .send({
                  result: result.data.items[0].volumeInfo,
                  info: { queryStatus: "Book Found", status: 200 },
                });
            }
          });
      } else {
        res
          .status(200)
          .send({ info: { queryStatus: "Query Cannot be Empty", status: 422 } });
  
        throw "Condition not met creates internal error";
      }
    } catch (error) {
      console.log(error);
    }
  });
  
  router.post("/savebook", async (req, res) => {

    console.log(req.body);


    let oldBookAvailable  = await LibraryShelf.findOne({ $or: [{ISBN10:req.body.ISBN10},{ISBN13:req.body.ISBN13}]})

    if(oldBookAvailable){
        return res.status(200).send({response:{StatusCode:409,info:"Book Already Exists"}})

    } else {



  
    let result = await LibraryShelf.create(req.body);
  
    res.status(200).send({response:{StatusCode:200,info:"Book added to Shelf",result:result}});


    }


  });
  

module.exports = router;
