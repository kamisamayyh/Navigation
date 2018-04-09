	function Map(){
        this.map;
        this.myGeo;
        this.city;
        this.toPosition;
        this.myPosition;
        this.showPostiones;
        this.postionIndex=0;
        this.postiones=new Array();
        //创建和初始化地图函数：
        this.initMap = function(){
        	var t= this;
            //this.createMap();//创建地图
            //this.setMapEvent();//设置地图事件
            //this.addMapControl();//向地图添加控件
            this.myGeo = new BMap.Geocoder();//初始化地址解析
            this.geolocation =  new BMap.Geolocation();
   
//          this.positionMe();
//          this.postionBookstore();
           
        }
        //创建地图函数：
        this.createMap = function () {
            this.map = new BMap.Map("navigationMap");//在百度地图容器中创建一个地图
            var point = new BMap.Point();//定义一个中心点坐标
            this.map.centerAndZoom(point,12);//设定地图的中心点和坐标并将地图显示在地图容器中
            window.map = this.map;//将map变量存储在全局
        }
        //地图事件设置函数：
        this.setMapEvent =function (){
            this.map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
            this.map.enableScrollWheelZoom();//启用地图滚轮放大缩小
            this.map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
            this.map.enableKeyboard();//启用键盘上下左右键移动地图
        }
        this.positionMe = function(func){
        	var t =this;
	     	plus.nativeUI.showWaiting();
	        plus.geolocation.getCurrentPosition(showLocation, function(e) {
	            mui.toast("获取定位位置信息失败：" + e.message);
	            plus.nativeUI.closeWaiting();
	        }, {
	            geocode: true
	        });
        	function showLocation(r) {  
		        jingDu = r.coords.longitude;
		        weiDu = r.coords.latitude; 
		        Address = r.addresses; 
		        centerPointer = new BMap.Point(r.coords.longitude,r.coords.latitude);
		        exchange(); 
		    }
        	 function exchange(){
		        var convertor = new BMap.Convertor();
		        var pointArr = [];
		        pointArr.push(centerPointer);
		        convertor.translate(pointArr,1,5,translateCallback);
		    }
		    function translateCallback(data){
		        if(data.status==0){
		        	func();
		        	t.myPosition = data.points[0];
		            var marker = new BMap.Marker(data.points[0]);
		            map.addOverlay(marker);
		            map.setCenter(data.points[0]);
		            plus.nativeUI.closeWaiting();
		        }
		    }
		       
        }
        
        this.positionOther = function(func,name){
        	 var t= this;
        	 t.postiones = [];
        	 t.postionIndex =0;
	         var options = {      
            	renderOptions: {map: this.map},
			    onSearchComplete: function(results){      
			        if (t.local.getStatus() == BMAP_STATUS_SUCCESS){      
			            // 判断状态是否正确      
			            var s = [];      
			            for (var i = 0; i < results.getCurrentNumPois(); i ++){  
			            	t.postiones.push({title:results.getPoi(i).title,address:results.getPoi(i).address})
			                //s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);      
			            }      
			             t.showDestination();
						func(t.postiones);
			        }      
			    }      
			 };
            this.local = new BMap.LocalSearch(this.map,options);
        	this.local.search(name);
        }
        
        this.postionBookstore = function(func){
        	
        	var t= this;
        	 t.postiones = [];
        	 t.postionIndex =0;
	         var options = {      
            	renderOptions: {map: this.map},
			    onSearchComplete: function(results){      
			    
			        if (t.local.getStatus() == BMAP_STATUS_SUCCESS){      
			            // 判断状态是否正确      
			       
			            var s = [];      
			            for (var i = 0; i < results.getCurrentNumPois(); i ++){  
			            	t.postiones.push({title:results.getPoi(i).title,address:results.getPoi(i).address})
			                //s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);      
			            }      
			             t.showDestination();
						func(t.postiones);
			        }      
			    }      
			 };
            this.local = new BMap.LocalSearch(this.map,options);
        	this.local.search("书店");
        
        }
        this.showDestination = function(){
        	$("#destination").text(this.postiones[this.postionIndex]['title']);
        }
        this.walkNavigation = function(For,To,Pan){
 
        	var walking = 
        	new BMap.WalkingRoute(this.map, 
        		{renderOptions:{map: this.map,panel: Pan, autoViewport: true}});
        	
        	walking.search(For, To);
        }
        this.transitNavigation = function(For,To,Pan){
        	
        	var transit = 
        	new BMap.TransitRoute(this.map, 
        		{renderOptions:{map: this.map,panel: Pan, autoViewport: true}});
        	
        	transit.search(For, To);
        }
       	this.driveNavigation = function(For,To,Pan){
     
        	var driving = 
        	new BMap.DrivingRoute(this.map, 
        		{renderOptions:{map: this.map,panel: Pan, autoViewport: true}});
        	
        	driving.search(For, To);
        }
        //地图控件添加函数：
        this.addMapControl =function (){
            //向地图中添加缩放控件
            var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
            this.map.addControl(ctrl_nav);
            //向地图中添加缩略图控件
            var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
            this.map.addControl(ctrl_ove);
            //向地图中添加比例尺控件
            var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
            this.map.addControl(ctrl_sca);
        }
        //地图添加标注
        this.addMapMaker = function (lng,lat) {
            var point = new BMap.Point(lng,lat);
            // 创建点坐标
            var marker = new BMap.Marker(point);
            this.map.addOverlay(marker);
        }
        //地址解析
        this.addressResolution = function(address,city,label){
            var t = this;
            // 将地址解析结果显示在地图上,并调整地图视野
            this.myGeo.getPoint(address, function(point){
                if (point) {
                    //t.map.centerAndZoom(point, 16);
                    var marker = new BMap.Marker(point);
                    t.map.addOverlay(marker);
                    marker.setLabel(new BMap.Label(label+"</br>"+address,{offset:new BMap.Size(20,-10)}));
                }else{
                    alert("地址没有解析到结果!");
                }
            }, city);
        }
        this.geocodeSearch = function(pt,func){
        	this.myGeo.getLocation(pt, function(rs){
				var addComp = rs.addressComponents;
				var address = addComp.city + addComp.district + addComp.street;
        		func(address);
        	});
        }
        //城市定位
        this.centerAndZoom = function(city){
            this.city = city;
            this.map.centerAndZoom(city,11);
        }
        //地名定位
        this.positionByAddress = function(address){
            var t = this;
            // 将地址解析结果显示在地图上,并调整地图视野
            this.myGeo.getPoint(address, function(point){
                if (point) {
                    t.map.centerAndZoom(point, 16);
                }else{
                    alert("地址没有解析到结果!");
                }
            }, this.city);
        }
     
		
		
    }