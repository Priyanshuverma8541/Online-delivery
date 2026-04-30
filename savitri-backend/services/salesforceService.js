/**
 * salesforceService.js
 *
 * Stub service for Salesforce integration.
 * When you are ready to connect Salesforce:
 *
 *  1. npm install jsforce
 *  2. Add to .env:
 *       SF_LOGIN_URL=https://login.salesforce.com
 *       SF_USERNAME=your@org.com
 *       SF_PASSWORD=yourPassword
 *       SF_SECURITY_TOKEN=yourToken
 *  3. Uncomment the code below and remove the stub functions.
 *
 * The paymentController.verifyRazorpayPayment and confirmQrPayment
 * both have a clearly-marked "Salesforce hook" comment where you call
 * these functions once they are wired up.
 */

// const jsforce = require("jsforce");
//
// let conn = null;
//
// const getConnection = async () => {
//   if (conn) return conn;
//   conn = new jsforce.Connection({ loginUrl: process.env.SF_LOGIN_URL });
//   await conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN);
//   return conn;
// };
//
// const createContact = async (user) => {
//   const sf = await getConnection();
//   const result = await sf.sobject("Contact").create({
//     FirstName: user.fullName.split(" ")[0],
//     LastName:  user.fullName.split(" ").slice(1).join(" ") || user.fullName,
//     Email:     user.email,
//   });
//   return result.id;
// };
//
// const createOrder = async (order) => {
//   const sf = await getConnection();
//   const result = await sf.sobject("Order").create({
//     // Map your order fields to Salesforce Order fields
//     Status:      "Draft",
//     EffectiveDate: new Date().toISOString().split("T")[0],
//     // AccountId: ... (link to account if needed)
//   });
//   return result.id;
// };

// ─── Stub exports (safe no-ops until you enable the real code) ───────────────
const createContact = async (user) => {
  console.log("[Salesforce stub] createContact called for:", user.email);
  return null;
};

const createOrder = async (order) => {
  console.log("[Salesforce stub] createOrder called for:", order._id);
  return null;
};

module.exports = { createContact, createOrder };
