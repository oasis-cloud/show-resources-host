window.onload = function() {
	function get_localStorage_to_array() {
		var values = chrome.extension.getBackgroundPage().localStorage.getItem("pop-host-names");
		if(!values) return [];
		values = values.split("|");
		return values;
	}

	function set_localStorage(value) {
		if(!value) return false;
		chrome.extension.getBackgroundPage().localStorage.setItem("pop-host-names", value.join("|"));
		return true;
	}
	function get_localStorage_defaultconf() {
		var values = chrome.extension.getBackgroundPage().localStorage.getItem("pop-host-default-conf");
		return values;
	}
	function set_localStorage_defaultconf(value) {
		if(!value) return false;
		chrome.extension.getBackgroundPage().localStorage.setItem("pop-host-default-conf", value);
		return true;
	}

	var v_host_lists = new Vue({
		el:'#pop-lists',
		data:{
			lists:[]
		},
		methods:{
			del_host:function(event){
				console.log(event.target)
				var el_host = event.target.previousSibling.innerText;
				v_host_lists.lists.splice(v_host_lists.lists.indexOf(el_host), 1);
				set_localStorage(v_host_lists.lists);
			},
			del_mouseenter:function(){
				var $parent = event.target.parentElement;
				$parent.className = "hover";
			},
			del_mouseout:function(){
				var $parent = event.target.parentElement;
				$parent.className = "";	
			}
		}
	});

	var v_add_list = new Vue({
		el:"#add-list-form",
		methods:{
			add_host_name:function(event){
				var el_input = document.querySelector("input", this.$el);
				var el_a = document.createElement("a");
				el_a.href = "http://" + el_input.value;
				if(el_a.host) {
					var localStorage_array = get_localStorage_to_array();
					var host_name = el_a.host;
					if(localStorage_array.indexOf(host_name) == -1) {
						localStorage_array.push(host_name);
						if(set_localStorage(localStorage_array)){
							v_host_lists.lists = localStorage_array;
						}
					}
				}
			}
		}
	});
	var v_explain = new Vue({
		el:".explain-header",
		methods:{
			show_explain:function(event){
				var $explain = document.querySelector("#explain");
				var is_open = $explain.dataset.open;
				if(is_open == 'no') {
					$explain.style.display = "block";
					$explain.dataset.open = "yes";
				} else {
					$explain.style.display = "none";
					$explain.dataset.open = "no";
				}
			}
		}
	});

	var v_default_conf = new Vue({
		el:"#default-conf-form",
		data:{
			open:"true"
		},
		methods:{
			isopen:function(event){
				if(event.target.checked) {
					set_localStorage_defaultconf("true");
				} else {
					set_localStorage_defaultconf("false");
				}
				
			}
		}
	})
	var default_conf = get_localStorage_defaultconf();
	console.log(default_conf)
	if(typeof default_conf == "undefined") {
		set_localStorage_defaultconf("ture");
		v_default_conf.open = "true";
	} else {
		v_default_conf.open = default_conf;
	}
	v_host_lists.lists = get_localStorage_to_array();

}