import xml2js from "xml2js";
import express from "express"; 

const app = express();

let status;
let volume = -40;
let allowVolumeVarUpdate = true;

const port = 6666;
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
  status =  await makeRequest(getInfoXML);
}

app.get("/info", async (req, res) => {
  res.json(status);
});

let timeout;

app.get("/volume/:direction", async (req, res) => {
  if (req.params.direction === "up") {
    volume++;
  } 
  else if (req.params.direction === "down") {
    volume--;
  }
  else {
    res.status(404);
    return;
  }
  
  if (timeout) clearTimeout(timeout);
  allowVolumeVarUpdate = false;
  timeout = setTimeout(() => {
    allowVolumeVarUpdate = true;
  }, 20000);

  const volumeXML = `
    <YAMAHA_AV cmd="PUT">
        <Main_Zone>
            <Volume>
                <Lvl>
                    <Val>${volume * 10}</Val>
                    <Exp>1</Exp>
                    <Unit>dB</Unit>
                </Lvl>
            </Volume>
        </Main_Zone>
    </YAMAHA_AV>`;

  const response = await makeRequest(volumeXML);
  console.log(response);
  res.json(volume);
});

setInterval(() => {
  getInfo();

  if (status && allowVolumeVarUpdate) {
    volume = Math.floor((+status.YAMAHA_AV.Main_Zone[0].Basic_Status[0].Volume[0].Lvl[0].Val[0]) / 10); 
    console.log("VOLUME", volume);
  }
}, 60000);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

