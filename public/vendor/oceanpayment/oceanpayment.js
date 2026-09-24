var ipAddressOnePage = "https://secure.oceanpayment.com";
var Oceanpayment = {
	init : function($isSandBox,$cssUrl,$language,$configuration) {
		ipAddressOnePage = $isSandBox ? "https://test-secure.oceanpayment.com" : "https://secure.oceanpayment.com";
		document.getElementById("oceanpayment-element").innerHTML = '<iframe id="oceanpayment-iframe-card" name="oceanpayment-iframe-card" width="100%" style="overflow-x : hidden;overflow-y : hidden;" src="' + ipAddressOnePage + '/gateway/direct/checkpage?language=' +$language+ '" frameborder="0" height="131" seamless></iframe>';
        //获取iframe元素
        var iframe = document.getElementById("oceanpayment-iframe-card");
        //iframe网页IP:PORT
        var childDomain = ipAddressOnePage;
		var showCardName = false;
		if ($configuration && $configuration.showCardName) {
			showCardName = true;
		}
		iframe.onload = function(){
			//发送消息到iframe网页
			iframe.contentWindow.postMessage({'methodType':'init','cssUrl':$cssUrl,'language':$language,'backUrl':window.parent.location.href,'showCardName':showCardName}, childDomain);
		};
	},
	checkout : function($data){
        //获取iframe元素
        var iframe = document.getElementById("oceanpayment-iframe-card");
        //iframe网页IP:PORT
        var childDomain = ipAddressOnePage;
        //发送消息到iframe网页
        iframe.contentWindow.postMessage($data, childDomain);
	}
}
window.addEventListener('message', function(e) {
	var iframe = document.getElementById('oceanpayment-iframe-card');
	if (!iframe || e.source !== iframe.contentWindow || e.origin !== ipAddressOnePage) return;
	var data = e.data;
	var method;
	if (data && typeof data === 'object') {
		method = data.method;
	} else if (typeof data === 'string') {
		try {
			var doc = new DOMParser().parseFromString(data, 'text/xml');
			var methods = doc.getElementsByTagName('methods');
			method = methods.length ? methods[0].textContent : undefined;
		} catch (_) { return; }
	}
	if (method !== 'Credit Card') return;
	if (data && typeof data === 'object') reinitIframeCard(data.height);
	// code=1 是布局通知，不是完整性校验。失焦错误和提交错误均交给页面按提交状态区分。
	if (typeof oceanpaymentCallBack === 'function') oceanpaymentCallBack(data);
});

function reinitIframeCard(heightData) {
	var iframe = document.getElementById("oceanpayment-iframe-card");
	try {
		if (heightData != undefined && heightData != '') {
			iframe.height = heightData;
		}
	} catch (ex) {
		console.log(ex);
		iframe.height = 200;
	}
}

if (typeof window !== 'undefined') {
	window.Oceanpayment = Oceanpayment;
}
