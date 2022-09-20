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
      'Authorization':'Bearer eyJraWQiOiI5a09pYXZhSVZheWJmUGE1cUhlNHlXQTZrVXpncENsOHNkOE01T2NSaDFNPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2ZTU2YjEyMi1mNzViLTQ3MzMtYTQ5ZS0zMjU0NDhiZWEyZjIiLCJldmVudF9pZCI6IjRkZDUwMDAyLWNjZTctNGFlYy1iYTM0LTcyZWU5ZDg5N2MzMiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gY29tLm1pbWJiby5hcGlcL3VybC5zaWduIHBob25lIG9wZW5pZCBwcm9maWxlIGNvbS5taW1iYm8uYXBpXC9tYXJrZXRwbGFjZS5hbGwgY29tLm1pbWJiby5hcGlcL3Nob3djYXNlLmFsbCBlbWFpbCBjb20ubWltYmJvLmFwaVwvcGFnZS5hbGwgY29tLm1pbWJiby5hcGlcL3VzZXIuYWxsIiwiYXV0aF90aW1lIjoxNjUwNzYxNDcyLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV94a01ETkdoN2UiLCJleHAiOjE2NTA3Njg2NzIsImlhdCI6MTY1MDc2MTQ3MiwidmVyc2lvbiI6MiwianRpIjoiMjRjMTcwYjctYzI1NC00YTg3LWI5ZDctYzBhMGRhNzE2NzdkIiwiY2xpZW50X2lkIjoiNDVhOGU1Y2twMTFoOHNqNXY2NjFidjU5am8iLCJ1c2VybmFtZSI6InJvbGFuZCJ9.EZeuj8RBp3NtJQgToGQ4cruK8yBpKgaEnZXIM-_8wchiv6RKGWcUkVLn_lMO327gFm-fI_dVSblvX-Jj37InoEzUVZSYRGeIsbTENLI37_wDRRdDJGqEwDlsQTz8TvpRklciUijKNo-4m6SdlXZ0hMhVa5c2ZGOXYyaXKoG79K7_xbhVP3fIwtGgm9i1ZZK2oYhFAdmEazqbxMcKulSWprTrHsYJO5byrNY0pmve2bg44973BaXfCkbPEQvjtOox1OXqKf94wTd9rHzfbhuB4P9Xs31VL4LiBtUlG-6bn8fowhGZdaBy__g8M_mBqyZnMOj4qGk3w2F785H2UchbOg',
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