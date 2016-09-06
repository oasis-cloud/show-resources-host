var hostNames = {};

var filters = {
	urls: ["<all_urls>"],
	types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest"]
};

function getHost(url) {
	var matched = url.match(/([a-z0-9A-Z]+\.)+[a-z]+/);
	if(matched.length > 0 ) {
		return matched[0];
	}
	return null;
}

function get_localStorage_to_array() {
	var values = chrome.extension.getBackgroundPage().localStorage.getItem("pop-host-names");
	if(!values) return [];
	values = values.split("|");
	return values;
}

chrome.webRequest.onCompleted.addListener(
        function(details) {
        	var hostName = getHost(details.url);
			if(hostName) {
        		hostNames[hostName] = details.ip;
			}
		}
,filters);


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var filtered = {};
		
		var configs = get_localStorage_to_array();

		var domains = request.domains;
		var domain, i = 0;
		domains = domains.concat(configs);
		console.log(hostNames)
		console.log(domains)
		for(; i < domains.length; i++) {
			domain = domains[i];
			if(hostNames[domain]) {
				filtered[domain] = hostNames[domain];
			}
		}
		if(Object.keys(filtered)) {
			sendResponse({mapping: filtered});
		}
});
      