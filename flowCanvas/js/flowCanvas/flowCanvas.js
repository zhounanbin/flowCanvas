	var LineObj = function($a,$b,$module1,$module2,option){
		this.$a = $a;
		this.$b = $b;
		this.$startMod = $module1,
		this.$endMod = $module2,
		this.key = $a.attr("divNumber")+"to"+$b.attr("divNumber");
		this.keyReverse = $b.attr("divNumber")+"to"+$a.attr("divNumber");
		this.option = option;
		this.lineDivArr = [];
		this.add = function($lineDiv){
			$("body").append($lineDiv);
			$lineDiv.on("click",this.option.lineClickEvent);
			if(typeof $lineDiv.data("initLineKey")=="undefined"){
				$lineDiv.attr("initLineKey",this.key);
				$lineDiv.data("targetModule",this.$endMod);
			}
			this.lineDivArr.push($lineDiv);
		};
		this.offset = FlowCanvas.prototype.getOffset($a,$b);
		this.topOffset = this.offset.top;
		this.leftOffset = this.offset.left;
		this.drawDivCountVertical = -this.offset.top/(option.smallDivCss.height+2);
		this.drawDivCountLevel = -this.offset.left/(option.smallDivCss.width+2);
		this.reset = function($a,$b,option){
			this.$a = $a;
			this.$b = $b;
			this.key = $a.attr("divNumber")+"to"+$b.attr("divNumber");
			this.keyReverse = $b.attr("divNumber")+"to"+$a.attr("divNumber");
			if(option)
			this.option = option;
			this.lineDivArr = [];
			this.offset = FlowCanvas.prototype.getOffset($a,$b);
			this.topOffset = this.offset.top;
			this.leftOffset = this.offset.left;
			this.drawDivCountVertical = -this.offset.top/(this.option.smallDivCss.height+2);
			this.drawDivCountLevel = -this.offset.left/(this.option.smallDivCss.width+2);
		}
		this.draw = function(){
	 				//	确定div的坐标
	 				if(this.topOffset<=0 && this.leftOffset<=0){ //a在左上
	 					this.genDiv("left_up");
	 				}else if(this.topOffset<=0 && this.leftOffset>0){
	 					this.genDiv("right_up");
	 				}else if(this.topOffset>0 && this.leftOffset<=0){ //a在左下
	 					this.genDiv("left_down");
	 				}else if(this.topOffset>0 && this.leftOffset>0){
	 					this.genDiv("right_down");
	 				}
		};
		this.genDiv = function(position){
					var option = this.option,
						divHeight = this.topOffset<0 ? -this.topOffset : this.topOffset,
						divWidth = this.leftOffset<0 ? -this.leftOffset : this.leftOffset,
						divHTML = "<div></div>",
						$divHTML = $(divHTML),
						aTop = this.$a.offset().top,
						aLeft = this.$a.offset().left;
					var	$div1 = $divHTML.clone(),
	 					$div2 = $divHTML.clone();
	 				var basicCss = {
	 						top : aTop,
	 						left : aLeft,
	 						height : divHeight,
	 						width : divWidth
	 					};
	 					$div1.addClass('basicLineCss');
	 					$div2.addClass('basicLineCss');
	 					$div1.css(basicCss);
	 					$div2.css(basicCss);
					if(position=="left_up"){
	 							//向下画的线段
	 							$div1.css({
			 						width : option.lineWH
	 							});
	 							$div2.css({
			 						top : aTop+divHeight,
			 						height : option.lineWH
	 							});
					}else if(position=="left_down"){
	 							$div1.css({
			 						top : aTop-divHeight,
			 						width : option.lineWH
	 							});
	 							$div2.css({
			 						top : aTop-divHeight,
			 						height : option.lineWH
	 							});
					}else if(position=="right_up"){
								$div1.css({
			 						top : aTop+3,
			 						width : option.lineWH
	 							});
	 							$div2.css({
			 						top : aTop+divHeight,
			 						left : aLeft-divWidth,
			 						height : option.lineWH
	 							});
					}else if(position=="right_down"){
								$div1.css({
			 						top : aTop-divHeight,
			 						width : option.lineWH
	 							});
	 							$div2.css({
	 								top : aTop-divHeight,
	 								left : aLeft-divWidth,
			 						height : option.lineWH
	 							});
					}
					//将生成的线段保存到对象的线段数组中
 					this.add($div1);
 					this.add($div2);
		};
		this.reDraw = function($c,$m){ //$c 新坐标  $m移动的控件
			if($m.attr("id")==this.$startMod.attr("id") && this.$a.attr("divNumber")!=$c.attr("divNumber")){//如果移动的控件是第一个且存在移动，重置第一个的坐标
				this.cleanLine();
				this.reset($c,this.$b);
				this.offset = FlowCanvas.prototype.getOffset(this.$a,this.$b);
				this.draw();
			}else if(this.$b.attr("divNumber")!=$c.attr("divNumber")){
				this.cleanLine();
				this.reset(this.$a,$c);
				this.offset = FlowCanvas.prototype.getOffset(this.$a,this.$b);
				this.draw();
			}
		};
		this.cleanLine = function(){
			var lineDivArr = this.lineDivArr;
			for(var i=0;lineDivArr[i];i++){
				var $d = lineDivArr[i];
				$d.remove();
			}
		}
	}

	 var FlowCanvas = function(e,options){
	 	this.$e = $(e);
	 	this.option = options;
	 }

	 FlowCanvas.prototype = {
	 	constructor : FlowCanvas,
	 	lineArray : [],
	 	init : function(){
	 			var _o = this.option;
	 			$sDiv = $(_o._html_sdiv),
			 	$mainDiv = this.$e;
	 			$mainDiv.html("");
	 			this.initModule();
				 for(var i=1;i<=_o.sdivCount;i++){
				 	var $d = $sDiv.clone();
				 	$d.css(_o.smallDivCss);
				 	$d.attr("divNumber",i);
				 	$d.attr("data-dismiss","smallDiv");
				 	/*标记横坐标 start */
				 	if(i<=_o.rowCount && i%_o.numInterval==0){ /*标记横坐标*/
				 				var num = _o.numHTML,
				 				$num = $(num);
				 				$num.text(i);
				 				$num.addClass('num');
				 				$d.append($num);
				 				$d.css("background","#ccc");
				 			}
				 	$mainDiv.append($d);
				 }

				 	$("[data-dismiss='mindModule']").on("click",function(){
				 	$("[data-dismiss='mindModule']").removeClass('flowModuleChange');
				 	$(this).toggleClass('flowModuleChange');
				 });
				 //生成删除图标
				 	var $closeDiv = $("<div id='flowModuleClose'></div>");
				 	$closeDiv.css({
				 		position : "absolute",
				 		width:"25px",
				 		height:"25px",
				 		buttom:"0px",
				 		left:"0px",
				 		display:"none",
				 		"z-index" : "99999",
				 		"background-image" : "url(image/close.png)"
				 	});
				 	$("body").append($closeDiv);
				 	this.$closeDiv = $closeDiv;
				 this.setClickEve();
				 //this.setDBLClickEve;
				 this.setDrawLineEve();
				 this.setMouseOverEve();
				 this.initDraw();
	 		},
	 		initModule : function(){
	 			var $m = $("[data-dismiss='mindModule']");
	 			$m.each(function(){
	 				var $this = $(this),
	 					offset = $this.offset();
	 					$this.data("beforePosition",offset);
	 					$this.attr("flowModule", "false");
	 			});
	 		},
	 		initDraw : function(){
	 			var option = this.option,
	 				flowData = option.flowData;
	 				if(flowData){
	 					for(var key in flowData){
	 						var startMod = flowData[key],
	 							targetModule = startMod.targetModule || [],
	 							startModCenterDIVNum = startMod.centerDivNumber,
	 							$module1 = $("#"+key);
	 							$a = $("[divNumber='"+startModCenterDIVNum+"']");
	 							$module1.trigger("click");
	 							$a.trigger("click");
	 						for(var i=0;targetModule[i];i++){
	 						var f = targetModule[i],
	 							targetModuleID = f.targetModuleID,
	 							targetDivNumber = f.targetDivNumber;
	 							//先选择控件放到画布上
	 							var	$b = $("[divNumber='"+targetDivNumber+"']"),
	 								$module2 = $("#"+targetModuleID);
	 							$module2.trigger('click');
	 							$b.trigger('click');
	 							this.drawLine($a,$b,$module1,$module2);
	 						}
	 					}
	 				}
	 		},
	 		getFlowData : function(){
	 			var flowData = {},
	 				lines = this.lines;
	 			for(var l in lines){
	 				var line = lines[l],
	 					$a = line.$a,
	 					$b = line.$b,
	 					centerDivNumber = $a.attr("divNumber"),
	 					targetDivNumber = $b.attr("divNumber"),
	 					$startMod = line.$startMod,
	 					$endMod = line.$endMod,
	 					tempKey = $startMod.attr("id"),
	 					targetModuleID = $endMod.attr("id");
	 					if(!flowData[tempKey]){
	 						flowData[tempKey] = {};
	 						flowData[tempKey].targetModule = [];
	 					}
	 					var m = flowData[tempKey],
	 						mt = m.targetModule;
	 					m.centerDivNumber = centerDivNumber;
	 					mt.push({
	 						targetModuleID : targetModuleID,
	 						targetDivNumber : targetDivNumber
	 					});
	 			}
	 			return flowData;
	 		},
	 			setClickEve : function(){
	 				var that = this,_o = this.option;
				 	$(document).on("click","[data-dismiss='smallDiv']",function(){
				 		var $this = $(this),
				 			$m = $(".flowModuleChange");
				 			$m.data("centerDiv",$this); //保存点击位置的小DIV
				 			$m.attr("flowModule","true");
				 		that.fixM($m,this);
				 		//如果已经有连线，重绘
				 		var lines = $m.data("lines") || [];
				 		for(var l=0;lines[l];l++){
				 			var lineKey = lines[l],
				 				lineObj = that.lines[lineKey];
				 				lineObj.reDraw($this,$m);
				 		}
				 		$m.removeClass('flowModuleChange');
				 	});
	 			},
	 			setMouseOverEve : function(){
	 				var that = this,
	 					option = this.option,
	 					dismiss = option.mouseoverDismiss,
	 					$closeDiv = this.$closeDiv;
	 				$(document).on("mouseover",dismiss,function(){
	 					var $this = $(this),
	 						width = $this.width(),
	 						top = $this.offset().top,//close图标出现的高度
	 						left = $this.offset().left+width;//close图标出现的左边距
	 						$closeDiv.css({
	 							top : top-12,
	 							left : left
	 						});
	 						$closeDiv.show();
	 						
	 						$closeDiv.data("targetModule",$this);
	 				});
	 				$closeDiv.unbind("click");
	 				$closeDiv.bind("click",function(){
						if (confirm("确定删除此节点？")) {
							var $this = $(this),
								$m = $this.data("targetModule"),
								beforePosition = $m.data("beforePosition"),
								lines = $m.data("lines");
							$m.attr("flowModule", "false");
							$m.data("lines","");
							$m.css({
								"left": beforePosition.left,
								"top": beforePosition.top
							});
							$this.hide();
							for (var i = 0; lines[i]; i++) {
								var key = lines[i],
									lineObj = that.lines[key];
								if(lineObj) lineObj.cleanLine();
								delete that.lines[key];
							}
							if(that.option.removeModuleEve)
							that.option.removeModuleEve($m);
						}
	 				});
	 			},
	 			fixM : function($m,t){
	 						var option = this.option,
	 						fixW = $m.width()/2+option.smallDivCss.width*option.fixOffset,
				 			fixH = $m.height()/2+option.smallDivCss.width*option.fixOffset,
				 			_top = this.getTop(t),
				 			_left = this.getLeft(t);
				 			$m.css({
					 			position:"absolute",
					 			top : _top-fixH,
					 			left : _left-fixW
					 		});
	 			},
	 			setDBLClickEve : function(){
	 				var that = this,_o = this.option;
	 				//双击的时候，创建一个module放到对应位置
				 	$(document).on("dblclick","[data-dismiss='smallDiv']",function(){
				 		var $this = $(this),
				 			$m = $(_o.module);
				 		$("body").append($m);
				 			fixW = $m.width();
				 			fixH = $m.height();
				 			_top = that.getTop(this);
				 			_left = that.getLeft(this);
				 		$m.data("centerDiv",$this); //保存点击位置的小DIV
				 		$m.css({
				 			position:"absolute",
				 			top : _top-fixH,
				 			left : _left-fixW
				 		});
				 	});
	 			},
	 			setDrawLineEve : function(){
	 				var that = this,lineArray = this.lineArray;
	 				//按下ctrl的同时，选中两个控件，添加连线
	 				$(document).on("click","[data-dismiss='mindModule']",function(){
	 					var $this = $(this);
	 					if(event.ctrlKey){
	 						$this.toggleClass('selectModule');
	 						lineArray.push($this);
	 						if(lineArray.length==2){
	 							var a = lineArray[0],b = lineArray[1];
	 							var $centerDiv1 = a.data("centerDiv"),$centerDiv2 = b.data("centerDiv");
	 							that.drawLine($centerDiv1,$centerDiv2,a,b);//画线
	 							lineArray.length = 0;	//清空
	 							that.releaseControl(); //释放所有控件的锚
	 						}
	 					}
	 				});
	 			},
	 			drawLine : function($a,$b,$module1,$module2){
	 				var option = this.option,
	 					lineObj = new LineObj($a,$b,$module1,$module2,option);
	 					//判断是否已经存在此连线，有则不绘制
	 					if(typeof this.lines[lineObj.key] == "undefined"){
	 						lineObj.draw();  //绘制连线
						var lines = [],lines1 = [];
							lines.push(lineObj.key);
							lines1.push(lineObj.key);
							lines = lines.concat($module1.data("lines") || []);
							$module1.data("lines",lines);
							lines1 = lines1.concat($module2.data("lines") || []);
							$module2.data("lines",lines1);

							this.saveLine(lineObj);
	 					}
	 			},
	 			lines : {},
	 			saveLine : function(line){
	 				this.lines[line.key] = line;
	 			},
	 			getOffset : function($a,$b){
	 				var a = $a.get(0),
	 					b = $b.get(0),
	 					aTop = this.getTop(a);
	 					bTop = this.getTop(b);
	 					aLeft = this.getLeft(a);
	 					bLeft = this.getLeft(b);
	 				var topOffset = aTop-bTop,
	 					leftOffset = aLeft-bLeft;
	 				var offset = {
	 					top : topOffset, //为负数说明a在上
	 					left : leftOffset //为负数说明a在左
	 				}
	 				//console.log(offset)
	 				return offset;
	 			},
	 		 	//获取元素的纵坐标 
				 getTop : function(e){ 
					var offset=e.offsetTop; 
						if(e.offsetParent!=null) offset+=this.getTop(e.offsetParent); 
					return offset; 
				},
				//获取元素的横坐标 
				 getLeft : function(e){ 
					var offset=e.offsetLeft; 
						if(e.offsetParent!=null) offset+=this.getLeft(e.offsetParent); 
					return offset; 
				},
				//释放对所有控件的控制
				releaseControl : function(){
					$(".flowModuleChange[data-dismiss='mindModule']").removeClass('flowModuleChange');
					$(".selectModule[data-dismiss='mindModule']").removeClass('selectModule');
				}
	 }

	 $.fn.flowCanvas = function (option) {
	 	if(typeof option == 'string' && option=="getFlowData"){
	 		 var $this = $(this)
	        , data = $this.data('flowCanvas')
	 		return data[option]();
	 	}else{
	 		 return this.each(function () {
	      var $this = $(this)
	        , data = $this.data('flowCanvas')
	        , options = $.extend({}, $.fn.flowCanvas.defaults, typeof option == 'object' && option);
	      if (!data) $this.data('flowCanvas', (data = new FlowCanvas(this, options)))
	      if (typeof option == 'string') data[option]();
	  		else data["init"]();
	    	})
	 	}
	  }

	  /*参数*/
	  $.fn.flowCanvas.defaults = {
	  	sdivCount : 15000,  //网格个数
	  	rowCount : 160,		//每行个数
	 	numInterval : 10,	//坐标间隔
	 	fixOffset : 2, 		//偏移量
	 	lineWH : 5,
	 	contentDismiss : "[data-dismiss='flowMainDiv']",
	 	mouseoverDismiss: "[flowModule='true']",
	 	lineClickEvent : function(){
	 	},
	 	_html_sdiv : "<div></div>",
	 	smallDivCss : {
	 		width:4,
			height:4,
			border:"1px solid #f9f9f9",
			float:"left"
		},
		divLineCss : {
			backgroundColor:"#66CC66",
			border:"1px solid #66CC66"
		},
		cleanDivLineCss : {
			backgroundColor:"",
			border:"1px solid #f9f9f9"
		},
	 	module : "<button class='moduleBtn'>x</button>",
	 	numHTML : "<span></span>"
	  };