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

function getCurrPageRules(pageUrl, rules) {
	var rules = getRules()
	var page = '' 
	for(var i = 0; i < rules.length; i++) {
		page = rules[i]['page']
		page = page.replace(".", "\.").replace("*", ".*");
		reg = new RegExp(page);
		if(reg.test(pageUrl)) {
			return rules[i]
		}
	}
}
function getConfig() {
	return chrome.extension.getBackgroundPage().localStorage.getItem('show-ip-setting') === 'true' || false
}
function getRules() {
	return chrome.extension.getBackgroundPage().localStorage.getItem('show-ip-domain-lists') ? JSON.parse(chrome.extension.getBackgroundPage().localStorage.getItem('show-ip-domain-lists')) : []
}
function filterUserRules(userRule, hosts) {
	var result = []
	if(userRule && hosts && userRule.enable) {
		var domains = userRule['domains']
		for(var i = 0; i < domains.length; i++) {
			result.push({'host':domains[i], 'detail': hosts[domains[i]]})
		}
	}
	return result
}
function filterStaticRules(staticRule, hosts) {
	var result = []
	for(var i = 0; i < staticRule.length; i++) {
		result.push({'host': staticRule[i], 'detail': hosts[staticRule[i]]})
	}
	return result
}

chrome.webRequest.onCompleted.addListener(
        function(details) {
        	var hostName = getHost(details.url);
			if(hostName) {
        		hostNames[hostName] = details;
			}
		}
,filters);


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		// var filtered = {},
		// 	domains = request.domains,
		// 	currentpageurl = request.currentpageurl,
		// 	domain, i = 0,
		// 	is_in_arr,
		// 	configs = get_localStorage_to_array(),
		// 	isopenConf = get_localStorage_defaultconf();

		// if(isopenConf == "false") {
		// 	domains = [currentpageurl];
		// }

		// is_in_arr = in_arr(currentpageurl, configs);

		// if(is_in_arr === false && isopenConf == "false") {
		// 	sendResponse({mapping: filtered});
		// 	return;
		// } else if(is_in_arr !== false) {
		// 	domains = domains.concat(configs[is_in_arr]['h']);			
		// }

		// for(; i < domains.length; i++) {
		// 	domain = domains[i];
		// 	if(hostNames[domain]) {
		// 		filtered[domain] = hostNames[domain];
		// 	}
		// }
		// if(Object.keys(filtered)) {
		// 	sendResponse({mapping: filtered});
		// 	return;
		// }
		var config = getConfig() // boolean value
		var currPageDomains = request.domains // ['*.jd.com', '*.test.com']
		var currPageUrl = request.currentpageurl // test.jd.com/sss
		var rules = getRules() 
		var currPageRules = getCurrPageRules(currPageUrl, rules) // {page:'*.jd.com',enable:true,domains:'sss.jd.com\n'}
		var result = []
		if(config == true) {
			// 开启配置后要检查两个
			// staticDomains = staticDomains.concat(currPageRules)
			result = filterUserRules(currPageRules, hostNames).concat(filterStaticRules(currPageDomains, hostNames))
			console.log('user and default')
			console.log(result)
		} else {
			console.log(currPageRules)
			if(currPageRules) {
				// 没有开启默认配置，仅仅检查用户配置
				currPageRules['domains'] = [request.currentpageurl].concat(currPageRules['domains'].split('\n'))
				result = filterUserRules(currPageRules, hostNames)
				console.log('default page rules:')
				console.log(result)
			}
		}
		sendResponse({mapping: result});
});
      
