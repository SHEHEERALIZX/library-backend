const { google } = require("googleapis");
const { spanner } = require("googleapis/build/src/apis/spanner");

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});
const client = auth.getClient();
// Create instance of  Google Sheets api
const googleSheets = google.sheets({
  version: "v4",
  auth: client,
});



module.exports = {
  GetMetaData: async (spreadsheetId) => {
    // Get MetaData about spreadsheet

    const MetaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });

    let objArray = MetaData.data.sheets
    let sheets = objArray.map(a => a.properties.title);


    let obj = {
      sheetID : MetaData.data.spreadsheetId,
      title:MetaData.data.properties.title,
      timezone:MetaData.data.properties.timeZone,
      spreadsheetUrl:MetaData.data.spreadsheetUrl,
      sheettitle:sheets
    }
    return obj;
  },



  GetRowData: async (spreadsheetId, sheetTitle) => {
    try {
      response = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: sheetTitle,
      });
      return {response,status:205}

    } catch (err) {

        reason=err.message
        return {reason,status:500}
    }
  },
};
