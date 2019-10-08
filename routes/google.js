const router = require("express").Router();
const bodyParser = require("body-parser");
const {OAuth2Client} = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log("PAYLOAD:\n"+payload.name);
    const userid = payload['sub'];
    console.log("USERID:\n"+userid);
    return payload.name;
}
router.use(bodyParser.json());


router.post("/verify", function (req,res) {
    console.log("Verify Connection!")
    console.log("req.body: "+req.body);
    if (req.body && req.body.token){
        console.log("req.body.token: "+req.body.token)
        verify(req.body.token).then((name)=>{res.send("200:"+name)}).catch(console.error);
    }
    else {
        res.send("400:No token");
    }
});  

module.exports = router;