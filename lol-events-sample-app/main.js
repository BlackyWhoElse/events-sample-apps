// this a subset of the features that LoL events provides - however,
// when writing an app that consumes events - it is best if you request
// only those features that you want to handle.
//
// NOTE: in the future we'll have a wildcard option to allow retreiving all
// features
var g_interestedInFeatures = [
  'summoner_info',
  'gameMode',
  'teams',
  'matchState',
  'kill',
  'death',
  'respawn',
  'assist',
  'minions',
  'level',
  'abilities',
  'announcer',
  'counters',
  'match_info',
  'damage',
  'heal',
  'live_client_data',
  `jungle_camps`
  // 'gold'
];

var onErrorListener,onInfoUpdates2Listener,	onNewEventsListener;

function registerEvents() {

  onErrorListener = function(info) {
    console.log("Error: " + JSON.stringify(info));
  }
  
  onInfoUpdates2Listener = function(info) {
    console.log("Info UPDATE: " + JSON.stringify(info));
  }
  
  onNewEventsListener = function(info) {
    console.log("EVENT FIRED: " + JSON.stringify(info));
  }

  // general events errors
  overwolf.games.events.onError.addListener(onErrorListener);
  
  // "static" data changed (total kills, username, steam-id)
  // This will also be triggered the first time we register
  // for events and will contain all the current information
  overwolf.games.events.onInfoUpdates2.addListener(onInfoUpdates2Listener);									
  // an event triggerd
  overwolf.games.events.onNewEvents.addListener(onNewEventsListener);
}

function unregisterEvents() {
    overwolf.games.events.onError.removeListener(onErrorListener);
  overwolf.games.events.onInfoUpdates2.removeListener(onInfoUpdates2Listener);
    overwolf.games.events.onNewEvents.removeListener(onNewEventsListener);
}

function gameLaunched(gameInfoResult) {
  if (!gameInfoResult) {
    return false;
  }

  if (!gameInfoResult.gameInfo) {
    return false;
  }

  if (!gameInfoResult.runningChanged && !gameInfoResult.gameChanged) {
    return false;
  }

  if (!gameInfoResult.gameInfo.isRunning) {
    return false;
  }

  // NOTE: we divide by 10 to get the game class id without it's sequence number
  if (Math.floor(gameInfoResult.gameInfo.id/10) != 5426) {
    return false;
  }

  console.log("LoL Launched");
  return true;

}

function gameRunning(gameInfo) {

  if (!gameInfo) {
    return false;
  }

  if (!gameInfo.isRunning) {
    return false;
  }

  // NOTE: we divide by 10 to get the game class id without it's sequence number
  if (Math.floor(gameInfo.id/10) != 5426) {
    return false;
  }

  console.log("LoL running");
  return true;

}


function setFeatures() {
  overwolf.games.events.setRequiredFeatures(g_interestedInFeatures, function(info) {
    if (info.success == false)
    {
      //console.log("Could not set required features: " + info.error);
      //console.log("Trying in 2 seconds");
      window.setTimeout(setFeatures, 2000);
      return;
    }

    console.log("Set required features:");
    console.log(JSON.stringify(info));
  });
}


// Start here
overwolf.games.onGameInfoUpdated.addListener(function (res) {
  if (gameLaunched(res)) {
    unregisterEvents();
    registerEvents();
    setTimeout(setFeatures, 1000);
  }
  console.log("onGameInfoUpdated: " + JSON.stringify(res));
});

overwolf.games.getRunningGameInfo(function (res) {
  if (gameRunning(res)) {
    registerEvents();
    setTimeout(setFeatures, 1000);
  }
  console.log("getRunningGameInfo: " + JSON.stringify(res));
});
