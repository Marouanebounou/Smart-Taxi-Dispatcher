const prompt = require("prompt-sync")();
let num;
let idCounter = 4;
let reqCounter = 5;
let timeCounter = 5;
let waitingQueue = [
  { reqId: 3, position: 18, duration: 2, time: 2 },
  { reqId: 4, position: 7, duration: 5, time: 3 },
];
let availableTaxis = [];
let theCloseOne = {};
let taxis = [
  { id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 0 },
  { id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 },
  { id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 },
];
let requests = [
  { reqId: 1, position: 10, duration: 3, time: 0 },
  { reqId: 2, position: 3, duration: 4, time: 1 },
];
rapCounteur = 1;
let rapport = [];
let taxiRapport = [];

function start() {
  ValidatePendingRequests();
  while (num != 0) {
    showMenu();
    num = Number(prompt("Please enter your choice: "));
    switch (num) {
      case 1:
        viewTaxis();
        break;
      case 2:
        viewPending();
        break;
      case 3:
        newTaxi();
        break;
      case 4:
        newRequest();
        break;
      case 5:
        step();
        break;
      case 6:
        finalRaport();
        break;

      default:
        if (num !== 0) {
          console.log("Wrong number try again: ");
          start();
        }
        break;
    }
  }
}
function showMenu() {
  console.log("==========================================");
  console.log("      SMART TAXI DISPATCHER SYSTEM");
  console.log("==========================================\n");
  console.log("1. View Taxi Status");
  console.log("2. View Pending Requests");
  console.log("3. Add a New Taxi");
  console.log("4. Add a Ride Request");
  console.log("5. Do a step");
  console.log("6. Show Final Report");
  console.log("0. Exit\n");
  console.log("------------------------------------------");
}
function viewTaxis() {
  for (let i = 0; i < taxis.length; i++) {
    console.log("==========================================");
    console.log(
      "Taxi number " + taxis[i].id + " Availablity : " + taxis[i].available
    );
    console.log("Position : " + taxis[i].position);
    console.log("Total Rides : " + taxis[i].totalRides);
    console.log("Time Remaining : " + taxis[i].timeRemaining);
    console.log("==========================================\n");
  }
  start();
}
function viewPending() {
  if (waitingQueue.length == 0) {
    console.log("No request found.");
  } else {
    for (let i = 0; i < waitingQueue.length; i++) {
      console.log(
        "Request Number : " +
          waitingQueue[i].reqId +
          " : Position " +
          waitingQueue[i].position +
          " - Duration " +
          waitingQueue[i].duration +
          " - Time " +
          waitingQueue[i].time
      );
    }
  }
  start();
}
function newTaxi() {
  let position = Number(prompt("Entre the position of the taxi: "));
  let availability = Number(
    prompt("If the taxi is availble type 1 if not type 2: ")
  );
  if (availability == 1) {
    taxis.push({
      id: idCounter,
      position: position,
      available: true,
      timeRemaining: 0,
      totalRides: 0,
    });
  } else {
    taxis.push({
      id: idCounter,
      position: position,
      available: false,
      timeRemaining: 0,
      totalRides: 0,
    });
  }
  console.log(`Taxi number ${idCounter - 1} added succesfully.`);
  idCounter++;
  start();
}
function newRequest() {
  let position = Number(prompt("Entre your position position: "));
  let duration = Number(prompt("Entre the duration: "));
  availableTaxisFun(taxis);
  if (availableTaxis.length == 0) {
    waitingQueue.push({
      reqId: reqCounter,
      position: position,
      duration: duration,
      time: timeCounter,
    });
    reqCounter++;
    timeCounter++;
    console.log("Reaquest added to pending reaquests.");
  } else {
    closestTaxi(taxis, position);
    requests.push({
      reqId: reqCounter,
      position: position,
      duration: duration,
      time: timeCounter,
    });
    reqCounter++;
    timeCounter++;
    confirmRequest(duration, position, reqCounter - 1);
  }
  step();
}
function availableTaxisFun(taxis) {
  availableTaxis = [];
  for (let i = 0; i < taxis.length; i++) {
    if (taxis[i].available == true) {
      availableTaxis.push(taxis[i]);
    }
  }
}
function confirmRequest(duration, position, requestId) {
  let index = theCloseOne.taxiId - 1;
  taxis[index].available = false;
  taxis[index].timeRemaining = duration;
  taxis[index].totalRides += 1;
  taxis[index].position = position;
  fillReport(requestId, position, theCloseOne.taxiId, duration);
  console.log(`Taxi ${theCloseOne.taxiId} assigned for duration ${duration}`);
}
function finalRaport() {
  try {
    for (let i = 0; i < rapport.length; i++) {
      console.log(rapport[i]);
    }
    console.log(`All rides completed.\n--- Final Report ---`);
    for (let i = 0; i < taxiRapport.length; i++) {
      console.log(taxiRapport[i]);
    }
  } catch (error) {
    console.log(error);
  }
}
function closestTaxi(taxis, position) {
  theCloseOne = { position: Infinity, taxiId: 0 };
  for (let i = 0; i < taxis.length; i++) {
    if (taxis[i].available == true) {
      if (theCloseOne.position > Math.abs(taxis[i].position - position)) {
        theCloseOne.position = Math.abs(taxis[i].position - position);
        theCloseOne.taxiId = taxis[i].id;
      }
    }
  }
  console.log(
    "The closest Taxi to the customer is taxi number :",
    theCloseOne.taxiId
  );
}
function step() {
  for (let i = 0; i < taxis.length; i++) {
    if (taxis[i].timeRemaining == 0) {
      taxis[i].available = true;
    } else if (taxis[i].timeRemaining > 0) {
      taxis[i].timeRemaining = taxis[i].timeRemaining - 1;
      taxis[i].available = false;
    }
  }
}
function ValidatePendingRequests() {
  while (waitingQueue.length > 0) {
    availableTaxis = [];
    availableTaxisFun(taxis);

    if (availableTaxis.length == 0) break;

    let req = waitingQueue.shift();

    closestTaxi(taxis, req.position);
    confirmRequest(req.duration, req.position, req.reqId);
    requests.push(req);
  }
}
function fillReport(requestId, position, taxiId, distance) {
  try {
    rapport.push(
      `Minute ${rapCounteur++}: → Request ${requestId} at position ${position} → Taxi ${taxiId} assigned (distance: ${distance})`
    );
    taxiRapport.push(
      `Taxi ${taxiId}: ${taxis[taxiId - 1].totalRides} rides, position ${
        taxis[taxiId - 1].position
      }`
    );
  } catch (error) {
    console.log(error);
  }
}

start();
