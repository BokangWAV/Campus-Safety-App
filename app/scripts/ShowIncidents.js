import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db } from "../modules/init.js";

const typeDropdown = document.getElementById('Type-Dropdown');
const locationDropdown = document.getElementById('Location-DropDown');
const summaryDiv = document.getElementById('aside-bar');
const PopUpBackgroundDiv = document.getElementById('backgroundDiv');
const PopUpMessageDiv = document.getElementById('PopUp-report-View');
const PopUpCloseButton = document.getElementById('closeButtonDiv');
const PopUpRemoveButton = document.getElementById('ButtonDeleteDiv');
const FullAreYouSure = document.getElementById('FullAreYouSure');


let map;
let incidents = [];
let alerts = [];
let maintenances = [];
var namesOfBuildings  = [];
var currentType = typeDropdown.value;
var currentBuilding = locationDropdown.value;
var APIBuildings;
var buildingMap = {};
var maintanenceMap = {}
var TempReports = [];
var TempAlerts = [];
var currentReport;
var reportIndex;


document.getElementById('target').addEventListener('click', ()=>{
  showPosition();
})


async function displayPoints() {

  if(window.localStorage.getItem('userProfile') != ""){
      document.getElementById('profileDisplay').src = window.localStorage.getItem('userProfile');
  }

  document.getElementById('managerAlert').style.display = 'flex'
  document.getElementById('managerRequests').style.display = 'flex'
  locationDropdown.disabled = true;
  typeDropdown.disabled = true;
    showPosition();
    await getBuildingLocations();
    await showDropDownOptions();


    //First fetch all the incidents
    try {
        await fetch('https://sdp-campus-safety.azurewebsites.net/reports')
        .then(response=>{return response.json()})
        .then(data=>{
            data.forEach(elem=>{
                const temp = {};
                temp['latitude'] = Number(elem.geoLocation.split(" ")[0].split(",")[0]);
                temp['longitude'] = Number(elem.geoLocation.split(" ")[1]);
                temp['image'] = elem.imageUrls[0] || "";
                temp['video'] = elem.videoUrls[0] || "";
                temp['description'] = elem.description;
                //console.log(elem)
                const date = new Date(elem.timestamp._seconds * 1000);
                const dateOptions = { year: 'numeric', month: 'long', day: '2-digit' };
                const formattedDate = date.toLocaleDateString(undefined, dateOptions);  // Date in a human-readable format
                temp['time'] = formattedDate;
                incidents.push(temp);
                if(!elem.removed){
                  const date = new Date(elem.timestamp._seconds * 1000);
                  const dateOptions = { year: 'numeric', month: 'long', day: '2-digit' };
                  const formattedDate = date.toLocaleDateString(undefined, dateOptions);
                  elem['time'] = formattedDate
                  TempReports.push(elem)
                  //console.log(temp)
                }
                
            });

            TempReports.forEach(elem=>{
              //console.log(elem)
                //Add the incident to the buildingMap. To ensure we have a counter of the incidents
                buildingMap[elem.location].push(elem);
                maintanenceMap[elem.location] = [];
                
            });   
        })
        .catch(error=>{
            console.error("Error getting reports, API return with status: ", error);
        })
        
        
    } catch (error) {
        console.error(error);
    }

    //Then fetch all the alerts
    try {
      await fetch('https://sdp-campus-safety.azurewebsites.net/alert')
      .then(response=>{return response.json()})
      .then(data=>{
          data.forEach(elem=>{
            //console.log(elem);
            if(elem.status == "processing"){
              elem.location = `${nearestBuilding(Number(elem.lat), Number(elem.lon))}`
              alerts.push(elem);
            }
          }); 
          /*
          TempAlerts.forEach((elem)=>{
            
          })*/
      })
      .catch(error=>{
          console.error("Error getting reports, API return with status: ", error);
      })
      
      
    } catch (error) {
        console.error(error);
    }


    //API data is declared below the code and is the building data
    APIBuildings.forEach(elem=>{
      namesOfBuildings.push(elem.building_name);
      maintanenceMap[elem.building_name] = [];
      plotBuildings(elem.latitude, elem.longitude, elem.building_name);
    });
    
    
    getMaintanence();
    displayReports();
    plotAlerts();
    showPosition();
    locationDropdown.disabled = false;
  typeDropdown.disabled = false;
};

function showPosition() {
    //Initial position in latitude and longitude
    const lat = -26.1906419;
    const lon = 28.0266491;

    initializeMap(lat, lon);  
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function initializeMap(lat, lon) {
    if (map) {
        map.setView([lat, lon], 16.3);
    } else {
        map = L.map('map').setView([lat, lon], 16.3);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }
}

function plotLocation(lat, lon, popupText, icon) {
    L.marker([lat, lon], { icon: icon }).addTo(map)
        .bindPopup(popupText)
        .openPopup();
}

async function plotBuildings(lat, lon, name) {
    try {
        plotLocation(lat, lon, ` <b> ${name} <b><br>
            <br>${buildingMap[name].length} reported incidents in this Building`, 
            L.icon({
            iconUrl: './assets/Undraw/building.png',
            iconSize: [25, 25],
            iconColor: 'blue',
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        }));
    } catch (error) {
        console.error("Error fetching data from Nominatim API:", error);
    }
}

async function plotAlerts(){
    try {
      
      alerts.forEach((elem)=>{
        const lat = Number(elem.lat);
        const lon = Number(elem.lon);
        const date = new Date(elem.alertDate._seconds * 1000);
        const dateOptions = { year: 'numeric', month: 'long', day: '2-digit' };
        const formattedDate = date.toLocaleDateString(undefined, dateOptions);  // Date in a human-readable format
        const formattedTime = date.toLocaleTimeString();
        plotLocation(lat, lon, ` <strong>${elem.firstName} ${elem.lastName}</strong> <br> ${formattedDate} ${formattedTime} `, L.icon({
          iconUrl: './assets/Undraw/alert2.png',
          iconSize: [25, 25],
          iconColor: 'blue',
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
      }));
      })

        
    } catch (error) {
        console.error("Error fetching data from Nominatim API:", error);
    }
}



window.onload = displayPoints;






typeDropdown.addEventListener('change', async ()=>{
  currentType = typeDropdown.value;

  if(typeDropdown.value == "Alerts"){
    locationDropdown.className = "dropDownOptions active";
    locationDropdown.disabled = true;

    displayAlerts();
  }else if(typeDropdown.value == "Reports"){
    locationDropdown.className = "dropDownOptions"
    locationDropdown.disabled = false;
    displayReports();
  }else{
    locationDropdown.className = "dropDownOptions active";
    locationDropdown.disabled = true;
    displayMaintanence()
  }
});

locationDropdown.addEventListener('change', async ()=>{
  currentBuilding = locationDropdown.value;
  displayReports();
});




async function displayAlerts(){
  currentType = typeDropdown.value;
  currentBuilding = locationDropdown.value;

  //First remove Anything that is on the summary
  if(summaryDiv.querySelector('div[id="Summary-Section"]')){
    const temp = document.getElementById("Summary-Section");
    temp.remove();
  }

  //Diplay no ALerts found if there are currently no alerts
  if(alerts.length == 0){
    const tempDiv = document.createElement('div');
    tempDiv.id = "Summary-Section";
    tempDiv.className = "Summary-Section"
    
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'noResults';
    resultsDiv.className = 'noResults';

    const imgTemp = document.createElement('img');
    imgTemp.height = 150;
    imgTemp.width = 150;
    imgTemp.src = "./assets/Undraw/noResults.svg";

    const pTag = document.createElement('p');
    pTag.innerText = "No Alerts Found";

    resultsDiv.appendChild(imgTemp);
    resultsDiv.appendChild(pTag);

    tempDiv.appendChild(resultsDiv);
    summaryDiv.appendChild(tempDiv);
  }

  else{
    const tempDiv = document.createElement('div');
    tempDiv.id = "Summary-Section";
    tempDiv.className = "Summary-Section"

    alerts.forEach((elem, index)=>{
      const alertSummaryDiv = document.createElement('div');
      alertSummaryDiv.id = "alert-Summary";
      alertSummaryDiv.className = "alert-Summary";

      const alertInformationDiv = document.createElement('div');
      alertInformationDiv.id = "information";
      alertInformationDiv.className = "information";

      const alertDetailsDiv = document.createElement('div');
      alertDetailsDiv.id = "details";
      alertDetailsDiv.className = "details";
      alertDetailsDiv.innerHTML = `
        <p id="firstName" class="firstName"> ${elem.firstName}</p>
        <p id="lastName" class="lastName">${elem.lastName}</p>
      `;

      console.log(elem)
      const alertGender = document.createElement('div');
      if(elem.gender !== ""){
        alertGender.id = "details";
        alertGender.className = "details";
        alertGender.innerHTML = `
          <p id="genderDiv" class="locationDiv"> ${elem.gender}</p>
        `;
      }

      const alertLocationDiv = document.createElement('div');
      alertInformationDiv.id = "locationDiv";
      alertLocationDiv.className = "locationDiv";
      alertLocationDiv.innerHTML = `
        <p id="location" class="location"><strong>Location:</strong> ${elem.location}</p>
      `;

      const extraAlertDiv = document.createElement('div');
      extraAlertDiv.id = "extra";
      extraAlertDiv.className = "extra";
      var temp = "";
      if(elem.age>0){
        temp = elem.age +" years";
      }
      extraAlertDiv.innerHTML = `
        <p id="race" class="race">${elem.race}</p>
        <p id="age" class="age"> ${temp}</p>
        <p id="phoneNumber" class="phoneNumber">${elem.phoneNumber}</p>
      `;

      const alertbtnDiv = document.createElement('div');
      alertbtnDiv.id = "seperator";
      alertbtnDiv.className = "seperator";
      alertbtnDiv.innerHTML = `
        <div id="btns" class="btns">
            <button type="button"  data-index="${index}" id="btn-rescued" class="btn-rescued" > Rescued</button>
            <button type="button"  data-index="${index}" id="btn-call" class="btn-call" ><img src="./assets/Undraw/call-Icon.svg" height="13px" width="13px"> Call</button>
            <button type="button"  data-index="${index}" id="btn-zoom" class="btn-zoom" > zoom</button>
        </div>
      `;

      
      alertInformationDiv.appendChild(alertDetailsDiv);
      if(elem.gender!= "") alertInformationDiv.appendChild(alertGender)
      alertInformationDiv.appendChild(alertLocationDiv);
      alertInformationDiv.appendChild(extraAlertDiv);
      alertInformationDiv.appendChild(alertbtnDiv);

      alertSummaryDiv.appendChild(alertInformationDiv);
      tempDiv.appendChild(alertSummaryDiv);

    });

    summaryDiv.appendChild(tempDiv);

  }

}

async function displayReports(){
  currentType = typeDropdown.value;
  currentBuilding = locationDropdown.value;

  buildingMap[currentBuilding].sort((a, b) => {
    if (b.timestamp._seconds !== a.timestamp._seconds) {
        return b.timestamp._seconds - a.timestamp._seconds;
    }

    return b.timestamp._nanoseconds - a.timestamp._nanoseconds;});

  //First remove Anything that is on the summary
  if(summaryDiv.querySelector('div[id="Summary-Section"]')){
    const temp = document.getElementById("Summary-Section");
    temp.remove();
  }

  //If the reports for the current building are not there then show no results thing
  if(buildingMap[currentBuilding].length == 0){
    const tempDiv = document.createElement('div');
    tempDiv.id = "Summary-Section";
    tempDiv.className = "Summary-Section"
    
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'noResults';
    resultsDiv.className = 'noResults';

    const imgTemp = document.createElement('img');
    imgTemp.height = 150;
    imgTemp.width = 150;
    imgTemp.src = "./assets/Undraw/noResults.svg";

    const pTag = document.createElement('p');
    pTag.innerText = "No Reports Found";

    resultsDiv.appendChild(imgTemp);
    resultsDiv.appendChild(pTag);

    tempDiv.appendChild(resultsDiv);
    summaryDiv.appendChild(tempDiv);
  }


  //Now we show the results
  else{
    const tempDiv = document.createElement('div');
    tempDiv.id = "Summary-Section";
    tempDiv.className = "Summary-Section"

    buildingMap[currentBuilding].forEach((elem, index)=>{

      const reportSummaryDiv = document.createElement('div');
      reportSummaryDiv.id ="report-Summary";
      reportSummaryDiv.className = "report-Summary";

      const reportPTag = document.createElement('p');
      reportPTag.id = "description";
      reportPTag.className = "description";
      reportPTag.innerText = elem.description;

      const reportDivSeperator = document.createElement('div');
      reportDivSeperator.id = "seperator";
      reportDivSeperator.className = "seperator";

      console.log(elem)
      console.log(elem.time)
      reportDivSeperator.innerHTML = `
          <p>${elem.time}</p>
          <div id="btns" class="btns">
              <button type="button" data-index="${index}" id="btn-View" class="btn-View" >View</button>
              <button type="button" data-index="${index}" id="btn-delete"  class="btn-delete" >Remove</button>
          </div>
        `;

        reportSummaryDiv.appendChild(reportPTag);
        reportSummaryDiv.appendChild(reportDivSeperator);
        tempDiv.appendChild(reportSummaryDiv);
    });

    summaryDiv.appendChild(tempDiv);
  }
}

async function displayMaintanence(){
  currentType = typeDropdown.value;
  currentBuilding = locationDropdown.value;

  //First remove Anything that is on the summary
  if(summaryDiv.querySelector('div[id="Summary-Section"]')){
    const temp = document.getElementById("Summary-Section");
    temp.remove();
  }

  //If the reports for the current building are not there then show no results thing
  if( maintenances.length == 0){
    const tempDiv = document.createElement('div');
    tempDiv.id = "Summary-Section";
    tempDiv.className = "Summary-Section"
    
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'noResults';
    resultsDiv.className = 'noResults';

    const imgTemp = document.createElement('img');
    imgTemp.height = 150;
    imgTemp.width = 150;
    imgTemp.src = "./assets/Undraw/noResults.svg";

    const pTag = document.createElement('p');
    pTag.innerText = "No Maintenances Found";

    resultsDiv.appendChild(imgTemp);
    resultsDiv.appendChild(pTag);

    tempDiv.appendChild(resultsDiv);
    summaryDiv.appendChild(tempDiv);
  }


  else{
    const tempDiv = document.createElement('div');
    tempDiv.id = "Summary-Section";
    tempDiv.className = "Summary-Section"

    maintenances.forEach((elem)=>{
      const maintenaceSummaryDiv = document.createElement('div');
      maintenaceSummaryDiv.id ="maintenace-Summary";
      maintenaceSummaryDiv.className = "maintenace-Summary";

      const maintenacePTag = document.createElement('p');
      maintenacePTag.id = "MaintenanceBuildingName";
      maintenacePTag.className = "MaintenanceBuildingName";
      maintenacePTag.innerText = elem.buildingName;

      const maintenanceBuildingTag = document.createElement('p');
      maintenanceBuildingTag.id = "MaintenanceBuilding"
      maintenanceBuildingTag.className = "MaintenaceBuilding"
      maintenanceBuildingTag.innerHTML = `The <strong>${elem.venueId}</strong> venue is under maintenance`


      maintenaceSummaryDiv.appendChild(maintenacePTag);
      maintenaceSummaryDiv.appendChild(maintenanceBuildingTag)
      tempDiv.appendChild(maintenaceSummaryDiv);
    });

    summaryDiv.appendChild(tempDiv);
  }

}


async function listenChanges(){
  
}

function showDropDownOptions(){
  buildingMap = {};
  APIBuildings.forEach((elem)=>{
    const opt = document.createElement('option');
    opt.value = elem.building_name;
    opt.innerText = elem.building_name;
    locationDropdown.appendChild(opt);

    //Also append the building maps on the building map 
    buildingMap[elem.building_name] = [];
  });
}


async function getBuildingLocations(){
  await fetch('https://witsgobackend.azurewebsites.net/v1/map/getBuildings')
    .then(response=>{return response.json()})
    .then(data=>{
        APIBuildings = data.data.data;
    })
    .catch(error=>{
      setTempBuildings();
  })
}


async function removeAlertIndex(index){
  //Send a delete request to the API
  currentReport = buildingMap[currentBuilding][index]
  reportIndex = index;
  await removeAlert();
}

async function removeAlert(){
  //Send a delete request to the API
  try {
    console.log("uploaded and updating user details....")
    const uid = currentReport.reportID;
    console.log(uid)
    await fetch(`https://sdp-campus-safety.azurewebsites.net/reports/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      //Show user profile
      //loadData()
      console.log("sucessfully removed")
    }).catch((error)=>{
      console.error(error)
    });
  } catch (error) {
    console.error(error)
  }

  buildingMap[currentBuilding].splice(reportIndex, 1);
  displayReports();
  APIBuildings.forEach(elem=>{
   if(elem.building_name == currentBuilding) plotBuildings(elem.latitude, elem.longitude, elem.building_name);
});
}



// Event delegation for remove buttons
summaryDiv.addEventListener('click', async(event) => {
  if (event.target.classList.contains('btn-delete')) {
      const index = event.target.dataset.index;
      const btnRemove = document.getElementById('btn-delete');
      btnRemove.disabled = true;
      await removeAlertIndex(index);
  }
  else if (event.target.classList.contains('btn-View')) {
    const index = event.target.dataset.index;
    reportIndex = index;
    displayPopUp(index);
  }
  else if (event.target.classList.contains('btn-call')) {
    const index = event.target.dataset.index;
    window.location.href = `tel:${alerts[index].phoneNumber}`;
  }
  else if (event.target.classList.contains('btn-rescued')) {
    const index = event.target.dataset.index;
    await areYouSure(index);
  }
  else if (event.target.classList.contains('btn-zoom')) {
    const index = event.target.dataset.index;
    const lat = Number(alerts[index].lat);
    const lon = Number(alerts[index].lon);
    initializeMap(lat, lon);

  }

});

async function rescuedUser(index){
  console.log(alerts[index].alertID)
  clearInterval(alertInterval);
  try {
    await fetch(`https://sdp-campus-safety.azurewebsites.net/alert/${alerts[index].alertID}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(()=>{
      console.log("rescued")
    }).catch(e=>{
      console.error(e)
    })
  } catch (error) {
    console.error(error);
  }

  alerts.splice(index, 1);
  displayAlerts();

  alertInterval = setInterval(async ()=>{
    //Then fetch all the alerts
    try {
      await fetch('https://sdp-campus-safety.azurewebsites.net/alert')
      .then(response=>{return response.json()})
      .then(data=>{
        var tempData = [];
        data.forEach((elem)=>{
          if(elem.status == "processing"){
            tempData.push(elem)
          }
        })
        
        console.log(tempData.length);
        console.log(alerts.length)
        console.log("Done")
          if(tempData.length > alerts.length && currentType == 'Alerts'){
            alerts = []
            tempData.forEach(elem=>{
              console.log(elem);
              if(elem.status == "processing"){
                console.log("pushing element");
                elem.location = `${nearestBuilding(Number(elem.lat), Number(elem.lon))}`
                alerts.push(elem);
              }
            });
  
            plotAlerts();
            showPosition();
            displayAlerts();
          }
      })
      .catch(error=>{
          console.error("Error getting reports, API return with status: ", error);
      })
      
      
    } catch (error) {
        console.error(error);
    }
  }, 30000)
}


function displayPopUp(index){
  currentReport = buildingMap[currentBuilding][index];
  const PopUpDate = document.getElementById('PopUp-Date');
  PopUpDate.innerHTML = `
      <h2>Report at ${currentBuilding}</h2>
  `;

  const PopUpDescription = document.getElementById('PopUp-Description');
  PopUpDescription.innerHTML = `
      <h3>Description</h3>
      <p>${currentReport.description}
      </p>
  `;

  const PopUpExtra = document.getElementById('PopUp-Extra');
  PopUpExtra.innerHTML = `
    <p><strong>Location:</strong>&nbsp   ${currentReport.location}</p>
    <p><strong>Date:</strong>&nbsp  ${currentReport.time}</p>
    <p><strong>status:</strong>&nbsp  ${currentReport.status}</p>
    <p><strong>Urgency Level:</strong>&nbsp  ${currentReport.urgencyLevel}</p>
  `;


  const videoDiv = document.getElementById('videoDiv');
  const imgDiv = document.getElementById('imageDiv');
  const noMediaDiv = document.getElementById('noMedia');


  if(currentReport.imageUrls.length == 0 && currentReport.videoUrls.length == 0){
    videoDiv.className = 'videoDiv imageOnly';
    imgDiv.className = 'imageDiv videoOnly';
    noMediaDiv.style.display = 'flex';
  }else{
    noMediaDiv.style.display = 'none';
    videoDiv.className = 'videoDiv imageOnly';
    imgDiv.className = 'imageDiv videoOnly';

    if(!currentReport.imageUrls.length == 0){
      imgDiv.className = 'imageDiv';
      imgDiv.innerHTML = `
        <img src="${currentReport.imageUrls[0]}">
      `;
    }

    if(!currentReport.videoUrls.length == 0){
      videoDiv.className = 'videoDiv';
      videoDiv.innerHTML = `
        <video autoplay controls>
            <source src="${currentReport.videoUrls[0]}">
        </video>
      `;
    }
  }

  PopUpBackgroundDiv.style.display = 'flex';
  PopUpMessageDiv.style.display = 'flex';
}


PopUpCloseButton.addEventListener('click', ()=>{
  PopUpBackgroundDiv.style.display = ' none';
  PopUpMessageDiv.style.display = 'none';
});


PopUpRemoveButton.addEventListener('click', async ()=>{
  PopUpRemoveButton.disabled = true;
  await removeAlert();
  PopUpCloseButton.click();
});



function nearestBuilding( lat, lon) {
  let point = []
  let tempPoint = []
  tempPoint.push(lat);
  tempPoint.push(lon)

  point.push(tempPoint);

  let buildingNear = ""
  let maxDistance = 100000000000000;


  
  APIBuildings.forEach((building)=>{
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat - Number(building.latitude));
    const dLon = toRad(lon - Number(building.longitude));
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat)) * Math.cos(toRad(lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;

    if(distance< maxDistance && distance < 3){
      maxDistance = distance;
      buildingNear = `near ${building.building_name}`
    }
  //console.log(withinDistance);
  })
  if( buildingNear == ""){
    buildingNear = `${lat} ${lon}`
  }

  return buildingNear
}


async function areYouSure(index){
  FullAreYouSure.style.display = 'flex'
  document.getElementById('AreUSureCancel').addEventListener('click', ()=>{
    FullAreYouSure.style.display = 'none'
  })
  document.getElementById('AreUSureChande').addEventListener('click', async ()=>{
    document.getElementById('AreUSureChande').disabled = true;
    document.getElementById('AreUSureCancel').disabled = true;
    await rescuedUser(index);
    FullAreYouSure.click();
    document.getElementById('AreUSureChande').disabled = false;
    document.getElementById('AreUSureCancel').disabled = false;
  })
}




console.log(window.localStorage.getItem('uid'))
const q = query(collection(db, "alert"), where("status", "==", "processing"));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  querySnapshot.forEach((doc) => {
      alert.push(doc.data());
  });
  
  displayAlerts();
});

FullAreYouSure.addEventListener('click', ()=>{
  FullAreYouSure.style.display = 'none'
})




function setTempBuildings(){
  APIBuildings = [
    {
      "_id": "66e748ae307946e74d850268",
      "building_name": "OLS",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1909492,
      "longitude": 28.0287961,
      "building_id": "011673db",
      "created_at": "2024-09-16T18:02:20.712Z",
      "__v": 0,
      "code": "OLS"
    },
    {
      "code": null,
      "_id": "66e74910307946e74d85026e",
      "building_name": "Wits Science Stadium",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1912742,
      "longitude": 28.0274903,
      "building_id": "5519b211",
      "created_at": "2024-09-15T20:52:32.910Z",
      "__v": 0
    },
    {
      "_id": "66e74933307946e74d850271",
      "building_name": "Faculty of Commerce, Law and Management",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1898124,
      "longitude": 28.0257656,
      "building_id": "56272f69",
      "created_at": "2024-09-16T21:01:41.900Z",
      "__v": 0,
      "code": "CLM"
    },
    {
      "code": null,
      "_id": "66e7495e307946e74d850274",
      "building_name": "WITS Entrance 9",
      "campus": [
        "west_campus"
      ],
      "type": [
        "gatehouse"
      ],
      "latitude": -26.1929038,
      "longitude": 28.0269152,
      "building_id": "9775fafe",
      "created_at": "2024-09-15T20:53:50.521Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e866ab8f15fe213a17f40a",
      "building_name": "Commerce library",
      "campus": [
        "west_campus"
      ],
      "type": [
        "library"
      ],
      "latitude": -26.1894572,
      "longitude": 28.025734,
      "building_id": "2c9ba499",
      "created_at": "2024-09-16T17:11:07.041Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e89940edf9137f7c42f5d8",
      "building_name": "MSL",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1906419,
      "longitude": 28.0266491,
      "building_id": "a8658eca",
      "created_at": "2024-09-16T20:46:56.432Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e899dcedf9137f7c42f5da",
      "building_name": "NCB",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.189887,
      "longitude": 28.0260583,
      "building_id": "fca9e12b",
      "created_at": "2024-09-16T20:49:32.024Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e89a17edf9137f7c42f5dc",
      "building_name": "MSB",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.189887,
      "longitude": 28.0260583,
      "building_id": "47384ede",
      "created_at": "2024-09-16T20:50:31.265Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e89a3cedf9137f7c42f5de",
      "building_name": "CCDU",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1899953,
      "longitude": 28.0255647,
      "building_id": "255f9557",
      "created_at": "2024-09-16T20:51:08.240Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e89adbedf9137f7c42f5e0",
      "building_name": "FNB Building",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1888117,
      "longitude": 28.0250411,
      "building_id": "3c1d5cec",
      "created_at": "2024-09-16T20:53:47.242Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e89b17edf9137f7c42f5e2",
      "building_name": "Wits Law School",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1886721,
      "longitude": 28.0247376,
      "building_id": "934e3c6f",
      "created_at": "2024-09-16T20:54:47.895Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e89b3cedf9137f7c42f5e4",
      "building_name": "DJ Du Plessis",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1886347,
      "longitude": 28.0240738,
      "building_id": "4f129d19",
      "created_at": "2024-09-16T20:55:24.360Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e89b6dedf9137f7c42f5e6",
      "building_name": "Wits Law Clinic",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1889716,
      "longitude": 28.0254356,
      "building_id": "2f2534bc",
      "created_at": "2024-09-16T20:56:13.095Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e89e9f8515e58447d79195",
      "building_name": "Chemistry Labs",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1907534,
      "longitude": 28.02586,
      "building_id": "aded2776",
      "created_at": "2024-09-16T21:09:51.139Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e89eea8515e58447d79197",
      "building_name": "Flower Hall",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.191644,
      "longitude": 28.026033,
      "building_id": "e608ef1b",
      "created_at": "2024-09-16T21:11:06.087Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e89f358515e58447d79199",
      "building_name": "Chamber of Mines",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1914761,
      "longitude": 28.0269351,
      "building_id": "50df0bf3",
      "created_at": "2024-09-16T21:12:21.132Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e89f4a8515e58447d7919b",
      "building_name": "ARM Building",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1914761,
      "longitude": 28.0269351,
      "building_id": "46c532de",
      "created_at": "2024-09-16T21:12:42.295Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e89ff28515e58447d7919d",
      "building_name": "WITS 3rd+ Year Parking",
      "campus": [
        "west_campus"
      ],
      "type": [
        "parking"
      ],
      "latitude": -26.1924677,
      "longitude": 28.0262417,
      "building_id": "6e081697",
      "created_at": "2024-09-16T21:15:30.896Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a0658515e58447d7919f",
      "building_name": "Vida Amic Deck",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1843267,
      "longitude": 28.0239573,
      "building_id": "dd1cad09",
      "created_at": "2024-09-16T21:17:25.440Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a06d8515e58447d791a1",
      "building_name": "Amic Deck",
      "campus": [
        "west_campus"
      ],
      "type": [
        "walkway"
      ],
      "latitude": -26.1843267,
      "longitude": 28.0239573,
      "building_id": "ad218d56",
      "created_at": "2024-09-16T21:17:33.297Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a0ba8515e58447d791a3",
      "building_name": "2nd+ Year Parking",
      "campus": [
        "west_campus"
      ],
      "type": [
        "parking"
      ],
      "latitude": -26.1875746,
      "longitude": 28.0245301,
      "building_id": "d445b32d",
      "created_at": "2024-09-16T21:18:50.743Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a0e98515e58447d791a5",
      "building_name": "Law Lawns",
      "campus": [
        "west_campus"
      ],
      "type": [
        "lawns"
      ],
      "latitude": -26.18741,
      "longitude": 28.0249324,
      "building_id": "939ecc63",
      "created_at": "2024-09-16T21:19:37.649Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a1368515e58447d791a7",
      "building_name": "Hall 29",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1867963,
      "longitude": 28.0243886,
      "building_id": "a52e2156",
      "created_at": "2024-09-16T21:20:54.276Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a1588515e58447d791a9",
      "building_name": "Olives and Plates Wits",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1867963,
      "longitude": 28.0243886,
      "building_id": "31969ab7",
      "created_at": "2024-09-16T21:21:28.458Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a1f98515e58447d791ab",
      "building_name": "Barnato Hall",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1867963,
      "longitude": 28.0243886,
      "building_id": "2b4144fc",
      "created_at": "2024-09-16T21:24:09.034Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a2198515e58447d791ad",
      "building_name": "David Webster",
      "campus": [
        "west_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1867963,
      "longitude": 28.0243886,
      "building_id": "26171747",
      "created_at": "2024-09-16T21:24:41.009Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a2598515e58447d791af",
      "building_name": "Wits Anglo American Digital Dome",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1877409,
      "longitude": 28.0287539,
      "building_id": "fcc2e1a1",
      "created_at": "2024-09-16T21:25:45.667Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a2a88515e58447d791b1",
      "building_name": "Bozzoli",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1866592,
      "longitude": 28.030159,
      "building_id": "0b609d90",
      "created_at": "2024-09-16T21:27:04.940Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a32f8515e58447d791b3",
      "building_name": "Wits Musalla",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1881858,
      "longitude": 28.028996,
      "building_id": "734e33ae",
      "created_at": "2024-09-16T21:29:19.865Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a35b8515e58447d791b5",
      "building_name": "Mens Halls Of Residence",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1887975,
      "longitude": 28.0295616,
      "building_id": "8f5f348c",
      "created_at": "2024-09-16T21:30:03.890Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a3778515e58447d791b7",
      "building_name": "College House",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1888696,
      "longitude": 28.0303059,
      "building_id": "4a9ab404",
      "created_at": "2024-09-16T21:30:31.578Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a3958515e58447d791b9",
      "building_name": "Wits University Jubilee Hall",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1880709,
      "longitude": 28.0311215,
      "building_id": "9921cffe",
      "created_at": "2024-09-16T21:31:01.274Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a3b38515e58447d791bb",
      "building_name": "Wits Rugby Stadium",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1880709,
      "longitude": 28.0311215,
      "building_id": "a122cc65",
      "created_at": "2024-09-16T21:31:31.971Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a3d78515e58447d791bd",
      "building_name": "Old Mutual Sports Hall",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1895047,
      "longitude": 28.0290692,
      "building_id": "a26dd49f",
      "created_at": "2024-09-16T21:32:07.553Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a4308515e58447d791bf",
      "building_name": "The Matrix",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1899,
      "longitude": 28.0295217,
      "building_id": "8a0cc984",
      "created_at": "2024-09-16T21:33:36.603Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a4668515e58447d791c1",
      "building_name": "William Cullen Library",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1906694,
      "longitude": 28.0288162,
      "building_id": "7c20046b",
      "created_at": "2024-09-16T21:34:30.464Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a4998515e58447d791c3",
      "building_name": "Wits Inter Campus Bus Service",
      "campus": [
        "east_campus"
      ],
      "type": [
        "parking"
      ],
      "latitude": -26.1914707,
      "longitude": 28.0288787,
      "building_id": "4407a9b6",
      "created_at": "2024-09-16T21:35:21.760Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a4c28515e58447d791c5",
      "building_name": "North West Engineering Building",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1914707,
      "longitude": 28.0288787,
      "building_id": "5df50cfd",
      "created_at": "2024-09-16T21:36:02.585Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a4ed8515e58447d791c7",
      "building_name": "chool of Mechanical, Industrial and Aeronautical Engineering",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1917993,
      "longitude": 28.028837,
      "building_id": "4653dee9",
      "created_at": "2024-09-16T21:36:45.015Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a53c8515e58447d791c9",
      "building_name": "Solomon Mahlangu House",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1918288,
      "longitude": 28.0299226,
      "building_id": "639380dd",
      "created_at": "2024-09-16T21:38:04.592Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a56e8515e58447d791cb",
      "building_name": "Main Hall",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1919539,
      "longitude": 28.0298139,
      "building_id": "395b0863",
      "created_at": "2024-09-16T21:38:54.451Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a5768515e58447d791cd",
      "building_name": "RS Exam Hall",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1919539,
      "longitude": 28.0298139,
      "building_id": "c3e8f358",
      "created_at": "2024-09-16T21:39:02.237Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a5cf8515e58447d791cf",
      "building_name": "Wartenweiler Library",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1911185,
      "longitude": 28.0303412,
      "building_id": "e12c3107",
      "created_at": "2024-09-16T21:40:31.056Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a6028515e58447d791d1",
      "building_name": "Physics Building",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1914172,
      "longitude": 28.0311313,
      "building_id": "07a23e28",
      "created_at": "2024-09-16T21:41:22.865Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a6288515e58447d791d3",
      "building_name": "Biology Building",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1911103,
      "longitude": 28.0312252,
      "building_id": "fa145529",
      "created_at": "2024-09-16T21:42:00.103Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a65a8515e58447d791d5",
      "building_name": "Wits School of Arts",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1921308,
      "longitude": 28.0324523,
      "building_id": "0de6d1b8",
      "created_at": "2024-09-16T21:42:50.215Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a6838515e58447d791d7",
      "building_name": "Wits Theatre Complex",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1925313,
      "longitude": 28.0307648,
      "building_id": "0bdb22ab",
      "created_at": "2024-09-16T21:43:31.943Z",
      "__v": 0
    },
    {
      "code": null,
      "_id": "66e8a6ad8515e58447d791d9",
      "building_name": "Wits Journalism Department",
      "campus": [
        "east_campus"
      ],
      "type": [
        "building"
      ],
      "latitude": -26.1925313,
      "longitude": 28.0307648,
      "building_id": "8669ecbc",
      "created_at": "2024-09-16T21:44:13.783Z",
      "__v": 0
    }
  ]

  APIBuildings.sort((a, b) => a.building_name.localeCompare(b.building_name));
}

TempReports = []

TempAlerts = [
  {
    "surname": "Mahlangu",
    "name": "Njabulo",
    "details": "EMERGENCY",
    "alert_date": "2024-09-09T16:19:18.531Z",
    "geoLocation": "-25.7565723, 28.1913815",
    "race":"Indian",
    "age":21,
    "phoneNumber":"0729546348",
    "alert_no": 1
  },
  {
    "surname": "Unknown",
    "name": "Unknown",
    "details": "RESCUED",
    "geoLocation": "-25.7565723, 28.1913815",
    "alert_date": "2024-09-02T22:40:00.913Z",
    "race":"Indian",
    "age":21,
    "phoneNumber":"0729546348",
    "alert_no": 1
  },
  {
    "surname": "Harps",
    "name": "Finn",
    "details": "EMERGENCY",
    "geoLocation": "-25.7565723, 28.1913815",
    "alert_date": "2024-08-22T22:51:18.469Z",
    "race":"Indian",
    "age":21,
    "phoneNumber":"0729546348",
    "alert_no": 1
  },
  {
    "surname": "Doe",
    "name": "John",
    "details": "EMERGENCY",
    "geoLocation": "-25.7565723, 28.1913815",
    "alert_date": "2024-08-22T22:50:19.838Z",
    "race":"Indian",
    "age":21,
    "phoneNumber":"0729546348",
    "alert_no": 1
  },
  {
    "details": "EMERGENCY",
    "geoLocation": "-25.7565723, 28.1913815",
    "alert_date": "2024-09-17T12:24:24.749Z",
    "alert_no": 1,
    "name": "Daniel",
    "race":"Indian",
    "age":21,
    "phoneNumber":"0729546348",
    "surname": "Mokone"
  },
  {
    "surname": "Unknown",
    "name": "Unknown",
    "details": "RESCUED",
    "geoLocation": "-25.7565723, 28.1913815",
    "alert_date": "2024-09-20T15:57:29.957Z",
    "race":"Indian",
    "age":21,
    "phoneNumber":"0729546348",
    "alert_no": 1
  },
  {
    "surname": "Mahlangu",
    "name": "Njabulo",
    "details": "EMERGENCY",
    "geoLocation": "-25.7565723, 28.1913815",
    "alert_date": "2024-09-08T23:50:26.761Z",
    "race":"Indian",
    "age":21,
    "phoneNumber":"0729546348",
    "alert_no": 1
  },
  {
    "surname": "Siphosethu",
    "name": "Njabulo",
    "details": "RESCUED",
    "geoLocation": "-25.7565723, 28.1913815",
    "alert_date": "2024-09-17T12:27:15.465Z",
    "race":"Indian",
    "age":21,
    "phoneNumber":"0729546348",
    "alert_no": 1
  }
]


let alertInterval;
alertInterval = setInterval(async ()=>{
  //Then fetch all the alerts
  try {
    await fetch('https://sdp-campus-safety.azurewebsites.net/alert')
    .then(response=>{return response.json()})
    .then(data=>{
      var tempData = [];
      data.forEach((elem)=>{
        if(elem.status == "processing"){
          tempData.push(elem)
        }
      })
      
      console.log(tempData.length);
      console.log(alerts.length)
        if(tempData.length > alerts.length && currentType == 'Alerts'){
          alerts = []
          tempData.forEach(elem=>{
            console.log(elem);
            if(elem.status == "processing"){
              console.log("pushing element");
              elem.location = `${nearestBuilding(Number(elem.lat), Number(elem.lon))}`
              alerts.push(elem);
            }
          });

          plotAlerts();
          showPosition();
          displayAlerts();
        }
    })
    .catch(error=>{
        console.error("Error getting reports, API return with status: ", error);
    })
    
    
  } catch (error) {
      console.error(error);
  }
}, 30000)



async function plotBuildingMaintenance() {
  APIBuildings.forEach((elem)=>{
    const lat = Number(elem.latitude);
    const lon = Number(elem.longitude);
    const mapPopUp = document.createElement('div');
    mapPopUp.innerHTML = ` <strong> ${elem.building_name} </strong><br>
           <br><strong>${buildingMap[elem.building_name].length}</strong> reported incidents in this Building
          `;
    maintanenceMap[elem.building_name].forEach((m)=>{
      if(m.isUnderMaintenance){
        const warning = document.createElement('div');
        warning.innerHTML = `
        <div style="width: 100%; height:7dvh; display:flex; box-shadow: 0px 2px 2px rgba(51, 51, 51, 0.4); border-radius:8px; align-items: center; padding-left:10px; padding-right:5px margin-top:10px; margin-bottom:0px">
          <img src="./assets/Undraw/maintenace.png" style="width:20px; height:20px; margin-right:10px;">
          <p> <strong>${m.venueId}</strong> under maintenace</p>
        </div>
        `;
        mapPopUp.innerHTML = mapPopUp.innerHTML + `<br> ${warning.innerHTML}`

        try {
          plotLocation(lat, lon,`${mapPopUp.innerHTML}` , 
              L.icon({
              iconUrl: './assets/Undraw/building.png',
              iconSize: [25, 25],
              iconColor: 'blue',
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
          }));
        } catch (error) {
            console.error("Error fetching data from Nominatim API:", error);
        }
      }
    })
    
  })
  
}


async function getMaintanence(){
  const url = 'http://localhost:8080/maintenance'; 


  fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())  // Convert response to JSON
  .then(data => {
    //console.log(namesOfBuildings)
    //console.log(data);
    data.forEach((elem)=>{
      
      if(namesOfBuildings.includes(elem.buildingName)){
        maintanenceMap[elem.buildingName].push(elem);
        
      }else{
        console.log("Building not shown:", elem.buildingName)
      }

      if(elem.isUnderMaintenance){
        maintenances.push(elem)
      }
    })
    
  }).then(()=>{
    plotBuildingMaintenance();
  })
  .catch(error => console.error('Error:', error));  // Handle errors
}
