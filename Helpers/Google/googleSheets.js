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

    return MetaData.data;
  },

  GetRowData: async (spreadsheetId, sheetTitle) => {
    try {
      response = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: sheetTitle,
      });

      result = {
          response,
          status:205
      }

      return result;
    } catch (err) {

        reason=err.message
        result = {
            reason:reason,
            status:500
        }
      return result;
    }
  },
};
