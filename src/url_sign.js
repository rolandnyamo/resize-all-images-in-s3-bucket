const { HttpRequest } = require("@aws-sdk/protocol-http");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { NodeHttpHandler } = require("@aws-sdk/node-http-handler");
const { Sha256 } = require("@aws-crypto/sha256-browser");

const signedReq = async () => {
  var request = new HttpRequest({
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=0",
      'Authorization':'Bearer ',
      host: "i1njeoxx4c.execute-api.us-east-1.amazonaws.com",
    },
    hostname: "i1njeoxx4c.execute-api.us-east-1.amazonaws.com",
    method: "GET",
    path: '/api' ,
    query: "detail=6e56b122-f75b-4733-a49e-325448bea2f2&param=userId&action=get&sub=user",
  });

  var signer = new SignatureV4({
    credentials: defaultProvider(),
    region: "us-east-1",
    service: "execute-api",
    sha256: Sha256,
  });

  const signedRequest = await signer.sign(request);

  // Send the request
  var client = new NodeHttpHandler();
//   console.log(client)
  var { response } = await client.handle(signedRequest);
//   console.log(response);
  console.log(response.statusCode + " " + response.body.statusMessage);
  var responseBody = "";
  await new Promise(() => {
    response.body.on("data", (chunk) => {
      responseBody += chunk;
    });
    response.body.on("end", () => {
      console.log("Response body: " + responseBody);
    });
  }).catch((error) => {
    console.log("Error: " + error);
  });
};

signedReq()
    .then(a => console.log(a))
    .catch(e => console.log(e))