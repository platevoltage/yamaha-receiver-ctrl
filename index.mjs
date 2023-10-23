const receiverIP = process.argv[2];
const url = `http://${receiverIP}/YamahaRemoteControl/ctrl`;
const getInfo = `
    <YAMAHA_AV cmd="GET">
        <Main_Zone>
            <Basic_Status>GetParam</Basic_Status>
        </Main_Zone>
    </YAMAHA_AV>`;


function makeRequest(xmlData) {

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "text/xml", // Set the content type to XML
    },
    body: xmlData, // Set the XML data as the request body
  };

  // Make the fetch request
  fetch(url, requestOptions)
    .then(response => {
      if (response.ok) {
        return response.text(); // Assuming you expect a text response
      } else {
        throw new Error("Request failed");
      }
    })
    .then(data => {
      console.log(data); // Handle the response data here
    })
    .catch(error => {
      console.error("Error:", error);
    });

}


makeRequest(getInfo);