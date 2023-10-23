import xml2js from "xml2js";

let status;

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
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  });
}

async function getInfo() {
  return await makeRequest(getInfoXML);
}



setInterval(() => {
  (async () => {
    status = await getInfo();
  })();
  if (status) {
    // console.log( status.YAMAHA_AV.Main_Zone[0].Basic_Status[0].Volume[0].Lvl[0].Val[0] );
  }
}, 1000);