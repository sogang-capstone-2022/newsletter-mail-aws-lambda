var aws = require("aws-sdk");
var http = require('http');

var ses = new aws.SES({ region: "ses 와 IAM 권한 설정을 한 aws region명. ap-northease-2 등등" });

function getRequest() {
  const url = 'http://test.com/test/api';

  return new Promise((resolve, reject) => {
    const req = http.get(url, res => {
      let rawData = '';

      res.on('data', chunk => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (err) {
          reject(new Error(err));
        }
      });
    });

    req.on('error', err => {
      reject(new Error(err));
    });
  });
}

exports.handler = async function (event) {

  try {
    var res = await getRequest();
    var params = {
      Destination: {
        ToAddresses: res.userEmail,
      },
      Message: {
        Body: {
          Text: { Data: "Test" },
        },

        Subject: { Data: "Test Email" },
      },
      Source: "발신자 이메일 주소",
    };
  
    return ses.sendEmail(params).promise()
  } catch(err){
    console.log(err);
  
  }

};