
async function Main(){
	// inject js and html into page
	var scritpElm = document.createElement('script');
	scritpElm.text = `
	if(localStorage.candicates === undefined){
		localStorage.candicates = JSON.stringify([]);
	}
	function onTakeIn(){
		var candicates = JSON.parse(localStorage.candicates);
		var as = document.querySelector('#as').value;
		candicates.push({as: as});
		localStorage.candicates = JSON.stringify(candicates);

		// communication from page to extension,  across page
		const channel = new BroadcastChannel('example-channel');
		channel.postMessage({
			candidateName: document.querySelector('[data-bind*=candidateName]').innerText,
			mobilePhone: document.querySelector('[data-bind*=mobilePhone]').innerText,
			as: as,
			url: document.URL
		});
	}
	`;
	document.head.appendChild(scritpElm);
	document.body.insertAdjacentHTML('afterBegin',`
	<div style="position: fixed; top: 10px; right:20px">
	给他的岗位：<input id="as" type="text">
	<button id='btnTakeIn' onclick="onTakeIn()">收录</button>
	</div>
	`)

	// data init
	var interval = setInterval(function(){
		var eleMobile = document.querySelector('[data-bind*=mobilePhone]');
		if(eleMobile == undefined)
			return;
		
		chrome.storage.local.get(['candicates'], function(getRes) {
			console.log(getRes);
			candicates = getRes.candicates == undefined ? [] : getRes.candicates;
			if(candicates.some(function(element){
				var isIt = element.mobilePhone === eleMobile.innerText;
				if(isIt) { 
					document.querySelector('#as').value = element.as;
					clearInterval(interval);   // 如果已收录，就停止 扫描
				}
				return isIt;
			})){
				console.log('had added');
				document.querySelector('#btnTakeIn').innerText = '已收录';
			}
		});	
	}, 1000);

	const channel = new BroadcastChannel('example-channel');
	channel.addEventListener('message', (event) => {
		// console.log(event.data);
		chrome.storage.local.get(['candicates'], function(getRes) {
			console.log(getRes);
			candicates = getRes.candicates == undefined ? [] : getRes.candicates;
			if(candicates.some(function(element){
				return element.mobilePhone === event.data.mobilePhone;
			})){
				console.log('had added');
				return;
			}
			var date = new Date();
			var month = date.getMonth() + 1;
			event.data.date = date.getFullYear() + '/' + month + '/' + date.getDate();
			candicates.push(event.data);
			chrome.storage.local.set({candicates: candicates}, function(setRes) {
				console.log("chrome.storage.local.set({candicates: candicates}, function(res) {");
				console.log(setRes);
			});
		});
	});
}

Main().then();
