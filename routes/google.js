const router = require("express").Router;
const OAuth2Client = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
  }
  verify().catch(console.error);

  
router.post("/verify", function (req,res) {
    if (req.query.token){
        verify
    }
});  

module.exports = router;