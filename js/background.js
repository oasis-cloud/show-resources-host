var hostNames = {};

var filters = {
	urls: ["<all_urls>"],
	types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest"]
};

function getHost(url) {
	var matched = url.match(/([a-z0-9A-Z\-\_]+\.)+[a-z]+/);
	if(matched.length > 0 ) {
		return matched[0];
	}
	return null;
}

function in_arr(key,arr) {
	var reg;
	for(var i = 0; i < arr.length; i++) {
		arr[i]['d'] = arr[i]['d'].replace(".", "\.");
		arr[i]['d'] = arr[i]['d'].replace("*", ".*");
		reg = new RegExp(arr[i]['d']);
		/*if(arr[i]['d'] == key) {
			return i
		}*/
		if(reg.test(key)) {
			return i;
		}
	}
	return false;	
}

function get_localStorage_defaultconf() {
	var values = chrome.extension.getBackgroundPage().localStorage.getItem("pop-host-default-conf");
	return values;
}

function get_localStorage_to_array() {
	var values = chrome.extension.getBackgroundPage().localStorage.getItem("hosts-names");
	if(!values) return [];
	return JSON.parse(values);
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
		var filtered = {},
			domains = request.domains,
			currentpageurl = request.currentpageurl,
			domain, i = 0,
			is_in_arr,
			configs = get_localStorage_to_array(),
			isopenConf = get_localStorage_defaultconf();

		if(isopenConf == "false") {
			domains = [currentpageurl];
		}

		is_in_arr = in_arr(currentpageurl, configs);

		if(is_in_arr === false && isopenConf == "false") {
			sendResponse({mapping: filtered});
			return;
		} else if(is_in_arr !== false) {
			domains = domains.concat(configs[is_in_arr]['h']);			
		}

		for(; i < domains.length; i++) {
			domain = domains[i];
			if(hostNames[domain]) {
				filtered[domain] = hostNames[domain];
			}
		}
		if(Object.keys(filtered)) {
			sendResponse({mapping: filtered});
			return;
		}
});
      
