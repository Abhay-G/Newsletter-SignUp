const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const config = require("./config.json");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get('/', function (req,res)
{
  res.sendFile(__dirname +"/signup.html");
});

app.post('/failure',function(req,res)
{
  res.redirect("/");
});

app.post('/',function(req,res)
{
  const first_name = req.body.firstName;
  const last_name = req.body.lastName;
  const email = req.body.mail;
  const data = {
    members:[
      {
        email_address : email,
        status : "subscribed",
        merge_fields :{
          FNAME:first_name,
          LNAME:last_name,
        }
      }
    ]

  }
    const jsonData = JSON.stringify(data);

const url = "https://us7.api.mailchimp.com/3.0/lists/"+config.list_id;
const options ={
   method: "POST",
   auth:"anystring:"+config.apiKey
}
const request =  https.request(url,options, function(response)
{
    /*response.on("data",function(data)
  {
  });*/
  if(response.statusCode===200)
  {
    res.sendFile(__dirname+"/success.html");
  }
  else{
    res.sendFile(__dirname+"/failure.html");
  }
  console.log(response.statusCode);
});
request.write(jsonData);
request.end();

});

app.listen(process.env.PORT||3000,function(req, res)
{
  console.log("server is running on port 3000");
});
