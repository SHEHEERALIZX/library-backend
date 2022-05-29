var express = require("express");
const { reseller } = require("googleapis/build/src/apis/reseller");
var router = express.Router();
const {
  GetMetaData,
  GetRowData,
} = require("../../Helpers/googleSheetHelpers");
const LibraryMembers = require("../../models/LibraryMembers");


router.post('/metadata', async function(req, res, next) {

  try {
    let { sheetURL } = req.body;
    spreadsheetId = sheetURL.slice(39, 83);
    const datas = await GetMetaData(spreadsheetId);

    res.send(datas)

    
  } catch (error) {

    console.log(error.message);
    return {error:"internal server error ",status:500}
    
  }

});




/* GET users listing. */
router.post("/getsheetdata", async function (req, res, next) {
  try {
    let { sheetURL, sheetTitle } = req.body;
    spreadsheetId = sheetURL.slice(39, 83);
    const datas = await GetRowData(spreadsheetId, sheetTitle);

    if (datas.reason) {
      return res.send(datas.reason);
    }
    let data = datas.response.data.values;

    const map = (k, v) =>
      v.map((i) => i.reduce((m, v, j) => ({ ...m, [k[j]]: v }), {}));

    let result = map(data[0], data.slice(1));
    res.send(result);
  } catch (err) {
    console.log(err);
    return {error:"internal server error ",status:500}
  }
});



router.post('/savebulkusers',async (req,res)=>{

  try {

    let result = await LibraryMembers.insertMany(req.body,{unique:true,ordered:false})

    console.log(result);

    res.send(result)

  }catch(error){
    console.log(error.writeErrors);
    res.send({error:"internal server error",status:500,info:error.writeErrors})
  }


})

module.exports = router;


