const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());  // Middleware to parse JSON body
// Function to send XML request to Tally Web Server to fetch data
async function fetchTallyData() {
    console.log('fetchTallyData');
    const xmlRequest = `
       <ENVELOPE>
        <HEADER>
            <VERSION>1</VERSION>
            <TALLYREQUEST>Export</TALLYREQUEST>
            <TYPE>Collection</TYPE>
            <ID>List of Companies</ID>
        </HEADER>
        <BODY>
            <DESC>
                <STATICVARIABLES>
                    <SVIsSimpleCompany>No</SVIsSimpleCompany>
                </STATICVARIABLES>
                <TDL>
                    <TDLMESSAGE>
                        <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="Yes" ISOPTION="No" ISINTERNAL="No" NAME="List of Companies">
                            <TYPE>Company</TYPE>
                            <NATIVEMETHOD>Name</NATIVEMETHOD>
                        </COLLECTION>
                        <ExportHeader>EmpId:5989</ExportHeader>
                    </TDLMESSAGE>
                </TDL>
            </DESC>
        </BODY>
    </ENVELOPE>
    `;

    try {
        // Send the XML request to Tally Web Server (make sure this is the correct URL)//http://SAIRAGAVENDRAN:9000//http://localhost:9000
        const response = await axios.post('https://f823-106-51-204-135.ngrok-free.app', xmlRequest, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });

        // Log the raw XML response received from Tally
        console.log('Raw Response from Tally Web Server:');
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error('Error in fetching data from Tally:', error);
        throw error;
    }
}

// API endpoint to get data from Tally
app.get('/get-companies', async (req, res) => {
    try {
        console.log('inside get company')
        // Fetch data from Tally
        const tallyData = await fetchTallyData();

        // Log the XML response data before parsing
        console.log('XML Data before parsing:');
        console.log(tallyData);

        // Parse XML response into JSON format
        xml2js.parseString(tallyData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return res.status(500).send({ error: 'Failed to parse XML response' });
            }

            // Log the parsed JSON response
            console.log('Parsed JSON Response from Tally:');
            console.log(result);
             // Log the parsed JSON response
             //console.log('Parsed JSON Response from Tally:');
             //console.log(JSON.stringify(result, null, 2));  // Pretty-print JSON

            // Return the parsed JSON response
           // res.json(result, null, 2);

            // Manually stringify the JSON response before sending
               const jsonResponse = JSON.stringify(result);
               console.log(jsonResponse);
            // Send the stringified JSON response
               res.send(jsonResponse);
        });
    } catch (error) {
        console.log('Error in /get-companies route:', error);
        res.status(500).send({ error: 'Failed to fetch data from Tally - ' +error });
    }
});


//**************get ledgers**********************//


// Function to send XML request to Tally Web Server to fetch data
async function fetchTallyData1() {
    console.log('fetchTallyData');
    const xmlRequest = `
      <ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>EXPORT</TALLYREQUEST>
        <TYPE>COLLECTION</TYPE>
        <ID>List of Ledgers</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
            </STATICVARIABLES>
        </DESC>
    </BODY>
</ENVELOPE>
    `;

    try {
        // Send the XML request to Tally Web Server (make sure this is the correct URL)//http://SAIRAGAVENDRAN:9000//http://localhost:9000
        const response = await axios.post('https://f823-106-51-204-135.ngrok-free.app', xmlRequest, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });

        // Log the raw XML response received from Tally
        console.log('Raw Response from Tally Web Server:');
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error('Error in fetching data from Tally:', error);
        throw error;
    }
}

// API endpoint to get data from Tally
app.get('/get-ledgers', async (req, res) => {
    try {
        console.log('inside get company')
        // Fetch data from Tally
        const tallyData = await fetchTallyData1();

        // Log the XML response data before parsing
        console.log('XML Data before parsing:');
        console.log(tallyData);

        // Parse XML response into JSON format
        xml2js.parseString(tallyData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return res.status(500).send({ error: 'Failed to parse XML response' });
            }

            // Log the parsed JSON response
            console.log('Parsed JSON Response from Tally:');
            console.log(result);
             // Log the parsed JSON response
             //console.log('Parsed JSON Response from Tally:');
             //console.log(JSON.stringify(result, null, 2));  // Pretty-print JSON

            // Return the parsed JSON response
           // res.json(result, null, 2);

            // Manually stringify the JSON response before sending
               const jsonResponse = JSON.stringify(result);
               console.log(jsonResponse);
            // Send the stringified JSON response
               res.send(jsonResponse);
        });
    } catch (error) {
        console.log('Error in /get-companies route:', error);
        res.status(500).send({ error: 'Failed to fetch data from Tally - ' +error });
    }
});


//**********************************************//





//**************Create Ledger**********************//

async function fetchTallyData2(ledgerData) {
    console.log('fetchTallyData');
    
    // Dynamically create XML request using data from the request body
    const xmlRequest = `
  <ENVELOPE>
    <HEADER>
        <TALLYREQUEST>Import Data</TALLYREQUEST>
    </HEADER>
    <BODY>
        <IMPORTDATA>
            <REQUESTDESC>
                <REPORTNAME>All Masters</REPORTNAME>
            </REQUESTDESC>
            <REQUESTDATA>
                <TALLYMESSAGE xmlns:UDF="TallyUDF">
                    <LEDGER Action="Create">
                        <NAME>{ledgerData.name}</NAME>
                        <PARENT>{ledgerData.parent}</PARENT>
                        <ADDRESS>{ledgerData.address}</ADDRESS>
                        <COUNTRYOFRESIDENCE>{ledgerData.countryOfResidence}</COUNTRYOFRESIDENCE>
                        <LEDSTATENAME>{ledgerData.state}</LEDSTATENAME>
                        <LEDGERMOBILE>{ledgerData.mobile}</LEDGERMOBILE>
                        <PARTYGSTIN>{ledgerData.gstin}</PARTYGSTIN>
                    </LEDGER>
                </TALLYMESSAGE>
            </REQUESTDATA>
        </IMPORTDATA>
    </BODY>
</ENVELOPE>
    `;

    try {
        // Send the XML request to Tally Web Server
        const response = await axios.post('https://f823-106-51-204-135.ngrok-free.app', xmlRequest, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });

        // Log the raw XML response received from Tally
        console.log('Raw Response from Tally Web Server:');
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error('Error in fetching data from Tally:', error);
        throw error;
    }
}

// API endpoint to create ledgers dynamically
app.post('/create-ledgers', async (req, res) => {
    try {
       
        console.log(JSON.stringify(req.body));
        // Get ledger data from the request body
        const ledgerData = req.body;
        
        console.log('Received data to create ledger:', ledgerData);

        // Fetch data from Tally with dynamic ledger data
        const tallyData = await fetchTallyData2(JSON.stringify(ledgerData));

        // Log the XML response data before parsing
        console.log('XML Data before parsing:');
        console.log(tallyData);

        // Parse XML response into JSON format
        xml2js.parseString(tallyData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return res.status(500).send({ error: 'Failed to parse XML response' });
            }

            // Log the parsed JSON response
            console.log('Parsed JSON Response from Tally:');
            console.log(result);

            // Return the parsed JSON response
            const jsonResponse = JSON.stringify(result);
            console.log(jsonResponse);
            res.send(jsonResponse);
        });
    } catch (error) {
        console.log('Error in /create-ledgers route:', error);
        res.status(500).send({ error: 'Failed to create ledger - ' + error });
    }
});


//**********************************************//





// Enable CORS for all routes if you're calling this from a browser
const cors = require('cors');
app.use(cors());  // Allow all origins, you can configure it for more security if needed


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


/*To make Tally available on your local system and deploy it on Render.com, follow these steps:
Step 1: Set Up Tally on Your Local System
Install Tally: If you haven't installed Tally ERP 9 or Tally Prime, download and install it on your local system.
Enable ODBC & HTTP Access:
Open Tally → F12 (Configure) → Advanced Configuration.
Enable HTTP Access and note down the port number (default: 9000).
If using Tally Prime, enable Tally API from the settings.
Verify Local API Access:
Open a browser and enter:
arduino
http://localhost:9000
If configured correctly, it should show a response from the Tally API.
Step 2: Expose Tally to the Internet
Since Tally runs locally, you need to expose it to the internet using ngrok or a similar service.
Method 1: Using Ngrok
Install ngrok (Download from ngrok.com).
Run ngrok to expose your Tally API:
sh
ngrok http 9000
It will generate a public URL like:
arduino
https://randomstring.ngrok.io
This URL can now be used to access
Tally API
 remotely.
Step 3: Deploy an API Proxy on Render
Since Render doesn't support direct access to localhost, you need to create a proxy API that interacts with your Tally instance.
1. Create a Simple Node.js Proxy Server
Install Node.js on your system and create a basic Express server to forward requests.
javascript
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const TALLY_URL = "
http://localhost:9000";  // Replace with ngrok URL if needed

app.use(express.json());

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(`${TALLY_URL}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send("Error connecting to Tally");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
2. Deploy on Render
Sign up on Render.com
Create a New Web Service → Select Node.js
Connect your GitHub Repository (or upload your project manually)
Set Environment Variables (e.g., PORT=3000)
Deploy the Service
Step 4: Access Tally via Render
Once deployed, you will get a public Render URL (e.g., https://your-tally-api.onrender.com).
Now you can access Tally data from anywhere using the Render proxy URL.
Alternative: Use a Cloud VPS
If you want a direct connection without ngrok, you can install Tally on a VPS like AWS, DigitalOcean, or Linode.
Let me know if you need help with any step! :rocket:*/