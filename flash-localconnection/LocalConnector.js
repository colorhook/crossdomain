YUI.add('local-connector', function(Y){
			var LocalConnector = function(config){
				

				LocalConnector.superclass.constructor.apply(this, arguments);
			
				if(config.hasOwnProperty('boundingBox')){
					this.set('boundingBox', config.boundingBox);
				}
				if(config.hasOwnProperty('selfName')){
					this.set('selfName', config.selfName);
				}
				if(config.hasOwnProperty('targetName')){
					this.set('targetName', config.targetName);
				}
				if(config.hasOwnProperty('allowDomain')){
					this.set('allowDomain', config.allowDomain);
				}
				if(config.hasOwnProperty('swfURL')){
					this.set('swfURL', config.swfURL);
				}
			}

			Y.extend(LocalConnector, Y.Base, {
				initializer: function(){
			
					 var oElement = Y.one(this.get("boundingBox"));

					 var params = {version: "10.0.45",
  	          				 fixedAttributes: {allowScriptAccess:"always", allowNetworking:"all", scale: "noscale"},
							 flashVars: {selfName: this.get('selfName'), targetName: this.get('targetName'), allowDomain: this.get('allowDomain')}
					 };
					 this.swf = new Y.SWF(oElement, this.get('swfURL'), params);
					 var relEvent = Y.bind(this._relayEvent, this);
					 this.swf.on('message', relEvent);
					 this.swf.on('error', relEvent);
					  this.swf.on('status', relEvent);
					 this.swf.on('swfReady', relEvent);
				},
				_relayEvent: function(event){
					this.fire(event.type, event);
				},

				sendMessage: function(message){
					this.swf.callSWF('sendMessage', [message]);
				}
			},
			{
				ATTRS:{
					boundingBox:{
						value: null,
						writeOnce: 'initOnly'
					},
					selfName:{
						value : "selfName",
						writeOnce: 'initOnly'
					},
					targetName:{
						value : "targetName",
						writeOnce: 'initOnly'
					},
					allowDomain:{
						value:"*"
					},
					swfURL:{
						value : null,
						writeOnce: 'initOnly'
					}
				}
			});

			Y.LocalConnector = LocalConnector;
			
}, '1.0.0', {requires:['swf']});