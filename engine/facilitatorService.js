// /**
//  * A simple client to send signed transactions to the Facilitator.
//  */
// export class FacilitatorService {
//   /**
//    * @param {string} facilitatorUrl - The endpoint Yash provides (e.g., "https://yash-api.com/broadcast")
//    * @param {string} serializedTx_base64 - The base64-encoded signed transaction
//    */
//   async submitToFacilitator(facilitatorUrl, serializedTx_base64) {
//     try {
//       const response = await fetch(facilitatorUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           signedTransaction: serializedTx_base64,
//         }),
//       });
//       return response;
//     } catch (err) {
//       console.error(`[FacilitatorError] ${err.message}`);
//       // Return a fake response object to standardize error handling
//       return {
//         ok: false,
//         status: 503, // Service Unavailable
//         message: err.message,
//       };
//     }
//   }
// }