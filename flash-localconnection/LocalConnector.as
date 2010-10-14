package{

	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.StatusEvent;
	import flash.net.LocalConnection;
	
	import com.yahoo.util.YUIBridge;
	
	public class LocalConnector extends Sprite{
	
		protected var bridge:YUIBridge;
		protected var connection:LocalConnection;
			
		private var selfName:String;
		private var targetName:String;
		private var allowDomain:String;
		
		public function LocalConnector(){
			bridge = new YUIBridge(stage);
			selfName = bridge.flashvars['selfName']||"selfName";
			targetName = bridge.flashvars['targetName']||"targetName";
			allowDomain = bridge.flashvars['allowDomain'];
			initializeComponent();
			bridge.addCallbacks({sendMessage: sendMessage});
		}
		
		protected function initializeComponent():void{
			connection = new LocalConnection();
			if(allowDomain && allowDomain!=""){
				connection.allowDomain(allowDomain);
			}
			connection.client = this;
			connection.addEventListener(StatusEvent.STATUS, onStatus);
			try{
				connection.connect(selfName);
			}catch(error:ArgumentError){
				bridge.sendEvent({type:'error'});
			}
		}
		
		 private function onStatus(event:StatusEvent):void {
            switch (event.level) {
                case "status":
                    bridge.sendEvent({type:'status'});
                    break;
                case "error":
                    bridge.sendEvent({type:'error'});
                    break;
            }
        }

		public function sendMessage(message:String):void{
			 connection.send(targetName, "onReceiveMessage", message);
		}

		public function onReceiveMessage(message:String):void{
			bridge.sendEvent({type:'message', message:message});
		}
	}
}