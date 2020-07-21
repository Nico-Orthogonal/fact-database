//var AWS = require('aws-sdk');

var region = 'us-east-2'; // e.g. us-west-1
var domain = 'https://search-fact-test-yz276ecq43nejd37tqjsbioht4.us-east-2.es.amazonaws.com'; // e.g. search-domain.region.es.amazonaws.com
var index = 'fact-test';
var type = '_doc';
var id = '1';

const form = document.querySelector('form');
//var dataToJSON = [];
let post = true;
let errorMsg = "Pipeline failed because: ";

form.addEventListener('submit', (e) => {
  e.preventDefault();
  dataPipeline();
})

//Data pipeline which creates the JSON object and sends it to the elastic search clusters
function dataPipeline() {
  var data = createJsonObject();
  console.log(data);
  dataValidation(data);
  if(post) {
    //dataToJSON.push(data);
    //postJsonObject(data);
    console.log("Logged");
  } else {
    alert(errorMsg);
    console.log("Not Logged");
  }
}

//Checks the text fields for data (In Scope should have ___ filled fields, Out of Scope we have defined what we want)
//todo runs the general logic of the program, contains all the function calls
function dataValidation(dataEntry) {
/*
if dataPoint.scope == "In-Scope" && company name, date of funding, scope,
explanation for scope decision, type of device, purpose of the device, digital therapeutic,
device characteristics, description of company, description of investment, company website
are all not empty then the form can be submitted

if dataPoint.scope == "Out-of-Scope" && company name, date of funding,
editor notes, scope, explanation for scope decision, type of device,
purpose of the device, digital therapeutic, device characteristics, description of company
*/
  if(!validateDate(dataEntry.date)) {
    errorMsg += "Date is incorrectly formatted, ";
    post = false;
  }
  if(dataEntry.scope == "") {
    errorMsg += "Scope is required for all entries.";
    post = false;
  }
  if(dataEntry.scope == "In-Scope") {
    if(dataEntry.companyName == "") {
      errorMsg += "Company Name is required for In-Scope entries.";
      post = false;
    } else if(dataEntry.scopeReason == "") {
      errorMsg += "Explanation for scope decision is required for In-Scope entries.";
      post = false;
    } else if(dataEntry.deviceType == "") {
      errorMsg += "Type of Device is required for In-Scope entries.";
      post = false;
    } else if(dataEntry.devicePurpose == "") {
      errorMsg += "Purpose of the Device is required for In-Scope entries.";
      post = false;
    } else if(dataEntry.digitalTherapeutic == "") {
      errorMsg += "Whether the device is a Digital Therapeutic or not is required for In-Scope entries.";
      post = false;
    } else if(dataEntry.deviceCharacteristics == "") {
      errorMsg += "Characteristics of the Device are required for In-Scope entries.";
      post = false;
    } else if(dataEntry.companyDescription == "") {
      errorMsg += "Company Description is required for In-Scope entries.";
      post = false;
    } else if(dataEntry.investmentDescription == "") {
      errorMsg += "Investment Description is required for In-Scope entries.";
      post = false;
    } else if(dataEntry.website == "") {
      errorMsg += "Company Website is required for In-Scope entries.";
      post = false;
    }
  } else if (dataEntry.scope == "Out-of-Scope") {
      if(dataEntry.companyName == "") {
      errorMsg += "Company Name is required for Out-of-Scope entries.";
      post = false;
    } else if(dataEntry.editorNotes == "") {
      errorMsg += "Editor Notes are required for Out-of-Scope entries.";
      post = false;
    } else if(dataEntry.scopeReason == "") {
      errorMsg += "Explanation for scope decision is required for Out-of-Scope entries.";
      post = false;
    } else if(dataEntry.deviceType == "") {
      errorMsg += "Type of Device is required for In-Scope entries.";
      post = false;
    } else if(dataEntry.devicePurpose == "") {
      errorMsg += "Purpose of the Device is required for Out-of-Scope entries.";
      post = false;
    } else if(dataEntry.digitalTherapeutic == "") {
      errorMsg += "Whether the device is a Digital Therapeutic or not is required for Out-of-Scope entries.";
      post = false;
    } else if(dataEntry.deviceCharacteristics == "") {
      errorMsg += "Characteristics of the Device are required for Out-of-Scope entries.";
      post = false;
    } else if(dataEntry.companyDescription == "") {
      errorMsg += "Company Description is required for Out-of-Scope entries.";
      post = false;
    }
  }
}

//Turns the data into a JSON format
//todo add the tag hierarchy for the related field, tags on google sheet
function createJsonObject() {
  var dataPoint = {};
  dataPoint.company = document.getElementById("company").value;

  dataPoint.sourceMobi = document.getElementById("sourceMobi").value;
  dataPoint.sourceCipher = document.getElementById("sourceCipher").value;
  dataPoint.sourceRock = document.getElementById("sourceRock").value;
  dataPoint.sourceBiz = document.getElementById("sourceBiz").value;
  dataPoint.sourceMed = document.getElementById("sourceMed").value;
  dataPoint.sourceOther = document.getElementById("sourceOther").value;

  dataPoint.sourceTextMobi = document.getElementById("sourceTextMobi").value;
  dataPoint.sourceTextCipher = document.getElementById("sourceTextCipher").value;
  dataPoint.sourceTextRock = document.getElementById("sourceTextRock").value;
  dataPoint.sourceTextBiz = document.getElementById("sourceTextBiz").value;
  dataPoint.sourceTextMed = document.getElementById("sourceTextMed").value;
  dataPoint.sourceTextOther = document.getElementById("sourceTextOther").value;

  dataPoint.date = document.getElementById("date").value;

  dataPoint.editorNotes = document.getElementById("editorNotes").value;

  var scope = document.getElementsByName("scope");
  dataPoint.scope = "";
  for (i = 0; i < scope.length; i++) {
    if(scope[i].checked) {
      dataPoint.scope = scope[i].value;
    }
  }

  dataPoint.scopeReason = document.getElementById("scopeReason").value;

  var deviceType = document.getElementsByName("deviceType");
  dataPoint.deviceType = "";
  for (i = 0; i < deviceType.length; i++) {
    if(deviceType[i].checked) {
      dataPoint.deviceType = deviceType[i].value;
    }
  }

  var checkboxes = document.getElementsByName("devicePurpose");
  var devicePurpose = [];
  for(var i=0; i<checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        devicePurpose.push(checkboxes[i].value);
      }
  }
  dataPoint.devicePurpose = devicePurpose;

  checkboxes = document.getElementsByName("therapeutic");
  var therapeutic = [];
  for(i=0; i<checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        therapeutic.push(checkboxes[i].value);
      }
  }
  dataPoint.therapeutic = therapeutic;

  var digitalTherapeutic = document.getElementsByName("digitalTherapeutic");
  dataPoint.digitalTherapeutic = "";
  for (i = 0; i < digitalTherapeutic.length; i++) {
    if(digitalTherapeutic[i].checked) {
      dataPoint.digitalTherapeutic = digitalTherapeutic[i].value;
    }
  }

  dataPoint.classification = document.getElementById("classification").value;

  checkboxes = document.getElementsByName("deviceCharacteristics");
  var deviceCharacteristics = [];
  for(i=0; i<checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        deviceCharacteristics.push(checkboxes[i].value);
      }
  }
  dataPoint.deviceCharacteristics = deviceCharacteristics;

  dataPoint.companyDescription = document.getElementById("companyDescription").value;

  var series = document.getElementsByName("series");
  dataPoint.series = "";
  for (i = 0; i < series.length; i++) {
    if(series[i].checked) {
      dataPoint.series = series[i].value;
    }
  }

  dataPoint.investment = document.getElementById("investment").value;
  dataPoint.investmentDescription = document.getElementById("investmentDescription").value;
  dataPoint.leadInvestor = document.getElementById("leadInvestor").value;
  dataPoint.investors = document.getElementById("investors").value;

  var hospital = document.getElementsByName("hospital");
  dataPoint.hospital = "";
  for (i = 0; i < hospital.length; i++) {
    if(hospital[i].checked) {
      dataPoint.hospital = hospital[i].value;
    }
  }

  dataPoint.website = document.getElementById("website").value;

  checkboxes = document.getElementsByName("disease");
  var disease = [];
  for(i=0; i<checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        disease.push(checkboxes[i].value);
      }
  }
  dataPoint.disease = disease;

  checkboxes = document.getElementsByName("specialty");
  var specialty = [];
  for(i=0; i<checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        specialty.push(checkboxes[i].value);
      }
  }
  dataPoint.specialty = specialty;

  checkboxes = document.getElementsByName("informationTechnology");
  var informationTechnology = [];
  for(i=0; i<checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        informationTechnology.push(checkboxes[i].value);
      }
  }
  dataPoint.informationTechnology = informationTechnology;

  checkboxes = document.getElementsByName("medicalTechnology");
  var medicalTechnology = [];
  for(i=0; i<checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        medicalTechnology.push(checkboxes[i].value);
      }
  }
  dataPoint.medicalTechnology = medicalTechnology;

  checkboxes = document.getElementsByName("regions");
  var regions = [];
  for(i=0; i<checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        regions.push(checkboxes[i].value);
      }
  }
  dataPoint.regions = regions;

  checkboxes = document.getElementsByName("bodySystem");
  var bodySystem = [];
  for(i=0; i<checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        bodySystem.push(checkboxes[i].value);
      }
  }
  dataPoint.bodySystem = bodySystem;

  checkboxes = document.getElementsByName("lifecycleStage");
  var lifecycleStage = [];
  for(i=0; i<checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        lifecycleStage.push(checkboxes[i].value);
      }
  }
  dataPoint.lifecycleStage = lifecycleStage;

  checkboxes = document.getElementsByName("other");
  var other = [];
  for(i=0; i<checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        other.push(checkboxes[i].value);
      }
  }
  dataPoint.other = other;



  dataPoint.related = "";

  return dataPoint;
}


//todo Send the JSON to Elastic Search via API request (POST, PUT)
function postJsonObject(factData) {
  /*var endpoint = new AWS.Endpoint(domain);
  var request = new AWS.HttpRequest(endpoint, region);

  request.method = 'PUT';
  request.path += index + '/' + type + '/' + id;
  id++;
  request.body = JSON.stringify(factData);
  request.headers['host'] = domain;
  request.headers['Content-Type'] = 'application/json';
  // Content-Length is only needed for DELETE requests that include a request
  // body, but including it for all requests doesn't seem to hurt anything.
  request.headers['Content-Length'] = Buffer.byteLength(request.body);

  var credentials = new AWS.EnvironmentCredentials('AWS');
  var signer = new AWS.Signers.V4(request, 'es');
  signer.addAuthorization(credentials, new Date());
  console.log('Testing');
  var client = new AWS.HttpClient();
  client.handleRequest(request, null, function(response) {
    console.log('Testing1');
    console.log(response.statusCode + ' ' + response.statusMessage);
    var responseBody = '';
    response.on('data', function (chunk) {
      responseBody += chunk;
    });
    response.on('end', function (chunk) {
      console.log('Testing2');
      console.log('Response body: ' + responseBody);
    });
  }, function(error) {
    console.log('Testing3');
    console.log('Error: ' + error);
  });
  */

  /*$.ajax({
        type: 'POST',
        url: 'https://search-fact-test-yz276ecq43nejd37tqjsbioht4.us-east-2.es.amazonaws.com',
        contentType: 'application/json',
        data: factData,
        success: function(res) {
          console.log(res);

        },
        error: function(jqxhr, status, exception) {
          console.log(jqxhr, status, exception);

        }
      });*/
}

//Validates the date format
//todo if incorrect an error message is output to the html
function validateDate(date) {
  if(date == "") {
    return false;
  }
  const dateRegExp = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/;
  const valid = dateRegExp.test(date);
  return valid;
}

//todo Query the Elastic Search domain
function queryElastic(query) {
  return query;
}



/**
CURL Commands:




JSON Schema:
Test Data Point {
  "properties" : {
    "companyName" : "string",
    "scope" : "string",
    "scopeReason" : "string"
  }
}


Data Point {
"properties": {
      "companyName" : {
        "type": "text"
      },
      "sourceMobi" : {
        "type": "text"
      },
      "sourceCipher" : {
        "type": "text"
      },
      "sourceRock" : {
        "type": "text"
      },
      "sourceBiz" : {
        "type": "text"
      },
      "sourceMed" : {
        "type": "text"
      },
      "sourceOther" : {
        "type": "text"
      },
      "sourceTextMobi" : {
        "type": "text"
      },
      "sourceTextCipher" : {
        "type": "text"
      },
      "sourceTextRock" : {
        "type": "text"
      },
      "sourceTextBiz" : {
        "type": "text"
      },
      "sourceTextMed" : {
        "type": "text"
      },
      "sourceTextOther" : {
        "type": "text"
      },
      "date" : {
        "type": "date"
      },
      "editorNotes" : {
        "type": "text"
      },
      "scope" : {
        "type": "keyword"
      },
      "scopeReason" : {
        "type": "text"
      },
      "deviceType" : {
        "type": "object"
      },
      "devicePurpose" : {
        "type": "object"
      },
      "therapeutic" : {
        "type": "object"
      },
      "digitalTherapeutic" : {
        "type": "keyword"
      },
      "classification" : {
        "type": "text"
      },
      "deviceCharacteristics" : {
        "type": "object"
      },
      "companyDescription" : {
        "type": "text"
      },
      "series" : {
        "type": "object"
      },
      "investment" : {
        "type": "double"
      },
      "investmentDescription" : {
        "type": "text"
      },
      "leadInvestor" : {
        "type": "text"
      },
      "investors" : {
        "type": "text"
      },
      "hospital" : {
        "type": "keyword"
      },
      "website" : {
        "type": "text"
      },
      "disease" : {
        "type": "object"
      },
      "specialty" : {
        "type": "object"
      },
      "informationTechnology" : {
        "type": "object"
      },
      "medicalTechnology" : {
        "type": "object"
      },
      "regions" : {
        "type": "object"
      },
      "bodySystem" : {
        "type": "object"
      },
      "lifecycleStage" : {
        "type": "keyword"
      },
      "other" : {
        "type": "object"
      },
      "related" : {
        "type": "object"
      }
    }
  }




**/
