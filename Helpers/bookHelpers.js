const Book = require("../models/booksID");
const LibraryShelf = require("../models/LibraryShelf");
const axios = require("axios");

module.exports = {
    GetBooks: async () => {
        try {
            let lists = await LibraryShelf.find().lean();
            return { data: lists, statusCode: 200 };
        } catch (error) {
            console.log(error.message);
            return { error: "interal server error", statusCode: 500 };
        }
    },




    SearchBook: async (searchData) => {
        const { bookID } = searchData;
        try {
            if (bookID.length == 10 || bookID.length == 13) {
                console.log(bookID);
                let result = await axios.get(
                    `https://www.googleapis.com/books/v1/volumes?q=isbn:${bookID}&key=AIzaSyB-QlMlotYmsLV0s8oSxUfgzXc-5hizT1g`
                );
                if (result.data.totalItems == 0) {
                    return { info: "Book Not Found", statusCode: 422 };
                } else {
                    return { data: result.data.items[0].volumeInfo, statusCode: 200 };
                }
            } else {
                return {
                    info: "Query doest not meet the requirement",
                    statusCode: 422,
                };
            }
        } catch (error) {
            console.log(error);
            return { error: "internal server error", statusCode: 500 };
        }
    },



    SaveBookToShelf: async (BookData) => {
        try {

            const {  AuthorName,BookSubtitle,
                BookTitle,ISBN10,ISBN13,
                Language,PageCount,PublishedDate,
                BookCount,thumbnail,PreviewImage} = BookData


            const oldBookAvailable = await LibraryShelf.findOne({
                $or: [{ ISBN10:ISBN10 }, { ISBN13:ISBN13 }],
            });

            if (oldBookAvailable) {
                return { statusCode: 409, info: "Book Already Exists" }
            } else {
                


                if((ISBN10 || ISBN13  ) && BookTitle && BookCount){


                let obj = {
                    AuthorName,BookSubtitle,
                    BookTitle,ISBN10,ISBN13,
                    Language,PageCount,PublishedDate,
                    BookCount,thumbnail,PreviewImage
                }
                let newBook = await LibraryShelf.create(obj);

                

                return {
                    statusCode: 200,
                    data: {
                        info: "Book added to Shelf",
                        result: newBook,
                    },
                }
            } else {
                return { error: "Some of the Required parameter is missing", statusCode: 422 };


            }

            }
        } catch (error) {
            console.log(error);
            return { error: "internal server error", statusCode: 500 };
        }
    },

    AddBook: async (data)=>{

        try {
            const { bookID } = data;
            console.log("BookID " + bookID);
        
            if (bookID == "" || bookID == undefined) {
              return { statusCode: 422, error: "BookID required" }
            }
        
            const oldBook = await Book.findOne({ bookID: bookID });
        
            if (oldBook) {
              return { status: 409, error: "Book already exists" }
            } else {
              let result = await Book.create({ bookID });
              return { statusCode: 200, result };
            }
        
          } catch (error) {
            console.log(error);
            return { error: "internal server error", statusCode: 500 };        
          }

    }

};
