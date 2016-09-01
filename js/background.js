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
		var domains = request.domains;
		var domainsLength = domains.length;
		var domain, i = 0;

		for(; i < domainsLength; i++) {
			domain = domains[i];
			if(hostNames[domain]) {
				filtered[domain] = hostNames[domain];
			}
		}
		if(Object.keys(filtered)) {
			sendResponse({mapping: filtered});
		}
});
      