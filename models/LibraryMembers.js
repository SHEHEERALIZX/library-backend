const mongoose = require('mongoose')

const LibraryMemberScheme = new mongoose.Schema({


    FirstName: {
        type: String,
        default:null,
        },

    LastName: {
            type: String,
            default:null
    
            },    

    EmailID:{
        type:String,
        required:true
    },

    AdmNumber: {
        type: Number,
        required: true

   

    }


})



LibraryMemberScheme.index({EmailID: 1, AdmNumber: 1 },{unique:true});



const Library =  mongoose.model('LibraryMember',LibraryMemberScheme)

Library.createIndexes({unique:true});

module.exports = Library



