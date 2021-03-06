// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

//var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
//});

var nextTab = function(){
  // first, get currently active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length) {
      var activeTab = tabs[0],
      tabId = activeTab.id,
      currentIndex = activeTab.index;
      // next, get number of tabs in the window, in order to allow cyclic next
      chrome.tabs.query({currentWindow: true}, function (tabs) {
        var numTabs = tabs.length;
        // finally, get the index of the tab to activate and activate it
        chrome.tabs.query({index: (currentIndex + 1) % numTabs}, function(tabs){
          if (tabs.length) {
            var tabToActivate = tabs[0],
            tabToActivate_Id = tabToActivate.id;
            chrome.tabs.update(tabToActivate_Id, {active: true});
          }
        });
      });
    }
  });
};

var prevTab = function(){
  // first, get currently active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length) {
      var activeTab = tabs[0],
      tabId = activeTab.id,
      currentIndex = activeTab.index;
      // next, get number of tabs in the window, in order to allow cyclic next
      chrome.tabs.query({currentWindow: true}, function (tabs) {
        var numTabs = tabs.length;
        // finally, get the index of the tab to activate and activate it
        if (currentIndex == 0){
          currentIndex = tabs.length;
        }
        chrome.tabs.query({index: currentIndex - 1}, function(tabs){
          if (tabs.length) {
            var tabToActivate = tabs[0],
            tabToActivate_Id = tabToActivate.id;
            chrome.tabs.update(tabToActivate_Id, {active: true});
          }
        });
      });
    }
  });
};

var closeTab = function(){
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length) {
      var activeTab = tabs[0];
      chrome.tabs.remove(activeTab.id, function(tabs){
        console.log("close tab!!");
      });
    }
  });
};

var newTab = function(){
  chrome.tabs.create({'url': 'http://www.google.com'}, function(tab) {
    console.log("new tab!!");
  });
}
var startListening = function(){
  console.log('init!')
  window.doppler.init(function(event) {
    switch(event){
      case "LEFT":
        prevTab();
        console.log('LEFT!')
        break;
      case "RIGHT":
        nextTab();
        console.log('RIGHT!')
        break;
      case "FUCK":
        closeTab();
        console.log('FUCK!')
        break;
    }
  });
}

var stopListening = function(){
  console.log('stop!')
  window.doppler.stop();
}

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.permissionAcquired == true){
      sendResponse();
      startListening();
    } else if (request.killswitch == true){
      stopListening();
    } else if(request.start == true){
      startListening();
    } else if(request.getstatus == true){
      sendResponse(window.doppler.getStatus());
    } else if(request.calibrate == true){
      window.doppler.calibrate();
    }
});
chrome.commands.onCommand.addListener(function (command) {
    if (command === "stop") {
        stopListening();
    } else if (command == "start"){
      startListening();
    }
});

chrome.idle.onStateChanged.addListener(function (state){
  if(state == "idle" || state == "locked"){
    stopListening();
  }
});
