package
{
	import flash.display.Sprite;
	import flash.display.Loader;
	import flash.text.TextField;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.TimerEvent;
	import flash.events.IEventDispatcher;
	import flash.utils.Timer;
	import flash.external.ExternalInterface;

	public class TextFieldLoader extends Sprite
	{
		private var httpComplete:Function;
		private var httpError:Function;
		private var httpTimeout:Function;
		private var loaderMap:Object = {};
		private var yId:String;
		private var handler:String = 'YAHOO.util.Connect.handleXdrResponse';
		
		protected var textField:TextField;
		private var _ID:String = '_textFieldLoader';

		public function TextFieldLoader() {
			ExternalInterface.addCallback("send", send);
			ExternalInterface.addCallback("abort", abort);
			ExternalInterface.addCallback("isCallInProgress", isCallInProgress);
			ExternalInterface.call('YAHOO.util.Connect.xdrReady');
			
		}

		public function send(uri:String, cb:Object, id:uint):void {
			cb.data = cb.data || {}
			uri = uri + "?" + objectToQuery(cb.data);
			uri = 'http://www.google.com.hk/intl/zh-CN/images/logo_cn.png';
			if(textField == null){
				textField = new TextField();
			}
			textField.htmlText = ' <img id="' + _ID + '" src="' + uri + '"/>';
			var loader:Loader = Loader(textField.getImageReference(_ID));
			var timer:Timer;
			var prop:String;

			if (cb.timeout) {
				timer = new Timer(cb.timeout, 1);
			}
			loaderMap[id] = { c:loader.contentLoaderInfo, readyState: 0, t:timer };
			defineListeners(id, timer);
			addListeners(loader.contentLoaderInfo, timer);

			start(id);
			if (cb.timeout) {
				timer.start();
			}
			
			
		}
		// from xdr.js in dojo library
		private function objectToQuery(map:*):String{
			var enc = encodeURIComponent;
			var pairs = [];
			var backstop = {};
			for(var name in map){
				var value = map[name];
				if(value != backstop[name]){
					var assign = enc(name) + "=";
					if(value is Array){
						for(var i=0; i < value.length; i++){
							pairs.push(assign + enc(value[i]));
						}
					}else{
						pairs.push(assign + enc(value));
					}
				}
			}
			return pairs.join("&");
		}
		
		private function defineListeners(id:uint, timer:Timer):void {
			httpComplete = function(e:Event):void { success(e, id, timer); };
			httpError = function(e:IOErrorEvent):void { failure(e, id, timer); };

			if (timer) {
				httpTimeout = function(e:TimerEvent):void { abort(id); };
			}
		}

		private function addListeners(target:IEventDispatcher, timer:IEventDispatcher):void  {
			target.addEventListener(Event.COMPLETE, httpComplete);
			target.addEventListener(IOErrorEvent.IO_ERROR, httpError);

			if (timer) {
				timer.addEventListener(TimerEvent.TIMER_COMPLETE, httpTimeout);
			}
		}

		private function removeListeners(id:uint):void  {
			loaderMap[id].c.removeEventListener(Event.COMPLETE, httpComplete);
			loaderMap[id].c.removeEventListener(IOErrorEvent.IO_ERROR, httpError);

			if (loaderMap[id].t) {
				loaderMap[id].t.removeEventListener(TimerEvent.TIMER_COMPLETE, httpTimeout);
			}
		}

		private function start(id:uint):void {
			var response:Object = { tId: id, statusText: 'xdr:start' };

			loaderMap[id].readyState = 2;
			ExternalInterface.call(handler, response);
		}

		private function success(e:Event, id:uint, timer:Timer):void {
			var data:* = e.target.content.result;
			var message:String;
			if(!data || data.error){
				message = 'xdr:error';
			}else{
				message = 'xdr:success';
			}

			var response:Object = {
				tId: id,
				statusText: message,
				responseText: data
			};
			
			loaderMap[id].readyState = 4;

			if (timer && timer.running) {
				timer.stop();
			}

			ExternalInterface.call(handler, response);
			destroy(id);
		}

		private function failure(e:Event, id:uint, timer:Timer):void {
			var data:String,
				response:Object = { tId: id, statusText: 'xdr:error' };

			loaderMap[id].readyState = 4;

			if (e is IOErrorEvent) {
				response.responseText = e["text"];
			}

			if (timer && timer.running) {
				timer.stop();
			}

			ExternalInterface.call(handler, response);
			destroy(id);
		}

		public function abort(id:uint):void {
			var response:Object = { tId: id, statusText: 'xdr:abort' };

			loaderMap[id].c.loader.close();

			if (loaderMap[id].t && loaderMap[id].t.running) {
				loaderMap[id].t.stop();
			}

			ExternalInterface.call(handler, response);
			destroy(id);
		}

		public function isCallInProgress(id:uint):Boolean {
			if (loaderMap[id]) {
				return loaderMap[id].readyState !== 4;
			}
			else {
				return false;
			}
		}

		private function destroy(id:uint):void {
			removeListeners(id);
			delete loaderMap[id];
		}
	}
}