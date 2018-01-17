// 
// [
// 	{
// 		page:'*.jd.com',
//		enable: true,
// 		domains:'static.jd.com\ntest.jd.com',
//		ishandle: true
// 	}
// ]
window.onload = function() {
	var LS = !!chrome.extension ? chrome.extension.getBackgroundPage().localStorage : window.localStorage
	var tip = {
		'textarea': '开启后将显示指定域名下对应的 Script 和 Link 资源访问的 IP \n可使用通配符‘＊’指定域名，例如：＊.jd.com',
		'eg': '例: www.xxx.com'
	}
	var App = new Vue({
		el: '#app',
		data: {
			currIdx: 0,
			setting: true,
			clicked: false,
			textarea: tip.textarea,
			domainLists: []
		},
		methods: {
			set_setting: function() {
				this.clicked = false
				this.setting = !this.setting
			},
			del: function(idx) {
				this.clicked = false
				this.domainLists.splice(idx, 1)
				this.currIdx = null
				this.textarea = tip.textarea
			},
			edit: function(idx) {
				this.currIdx = idx
				this.clicked = false
				this.domainLists[idx]['isedit'] = !this.domainLists[idx]['isedit']
				this.textarea = this.domainLists[idx]['domains'] || ''
			},
			setting_domain: function (idx) {
				this.clicked = false
				this.domainLists[idx]['enable'] = !this.domainLists[idx]['enable']
			},
			add_domain: function() {
				this.domainLists.push({
					'page': 'Enter page domain',
					'enable': true,
					'isedit': false,
					'domains': ''
				})
				this.clicked = false
				this.textarea = ''
				this.currIdx = this.domainLists.length
			},
			set_detail: function() {
				if(this.currIdx !== null) {		
					this.domainLists[this.currIdx]['domains'] = this.textarea
				}
				this.clicked = false
			},
			show_detail: function(idx) {
				var item = this.domainLists[idx]
				this.currIdx = idx
				this.textarea = item['domains'] || ''
			},
			show_default_setting_desc: function() {
				this.textarea = tip.textarea
				this.clicked = false
				this.currIdx = null
			},
			save: function() {
				var that = this
				var i = 0
				for(; i < this.domainLists.length; i++) {
					this.domainLists[i]['isedit'] = false
				}
				this.clicked = true
				LS.setItem('show-ip-setting', this.setting)
				LS.setItem('show-ip-domain-lists', JSON.stringify(this.domainLists))
			}
		}
	})
	function init(App) {
		App.setting = (LS.getItem('show-ip-setting') === 'true' || LS.getItem('show-ip-setting') == null) || false
		App.domainLists = JSON.parse(LS.getItem('show-ip-domain-lists') || '[]')
	}
	init(App)
}