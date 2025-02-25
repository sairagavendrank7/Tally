const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const app = express();
const port = 3000;

// Function to send XML request to Tally Web Server to fetch data
async function fetchTallyData() {
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
        // Send the XML request to Tally Web Server (running on localhost at port 9000)
        const response = await axios.post('http://localhost:9000', xmlRequest, {
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

            // Return the parsed JSON response
            res.json(result);
        });
    } catch (error) {
        console.error('Error in /get-tally-data route:', error);
        res.status(500).send({ error: 'Failed to fetch data from Tally' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
