import xml2js from "xml2js";

const receiverIP = process.argv[2];
const url = `http://${receiverIP}/YamahaRemoteControl/ctrl`;
const getInfoXML = `
    <YAMAHA_AV cmd="GET">
        <Main_Zone>
            <Basic_Status>GetParam</Basic_Status>
        </Main_Zone>
    </YAMAHA_AV>`;


async function makeRequest(xmlData) {

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
    },
    body: xmlData,
  };

  try {

    const response = await fetch(url, requestOptions);
    
    if (response.ok) {
      const xml = await response.text(); 
      return await parseXML(xml);
    } 

  } catch (error) {
    console.error("Error:", error);
  }

}

async function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (error, result) => {
      if (error) {
        console.error(error);
        reject( error );
      }
      else {
        //   console.log( result.YAMAHA_AV );
        resolve( result );
      }
    });
  });
}

const getInfo = await makeRequest(getInfoXML);

console.log( getInfo );

// xml2js.parseString(getInfo, (error, result) => {
//   if (error) {
//     console.error(error);
//   }
//   else {
//     console.log( result.YAMAHA_AV );
//   }
// });
