/**
Copyright(c) 2020
Author : Yang Ke
E-mail : softshare@163.com

If YKList is useful to you, please star me at github:
https://github.com/softshare/YKList
**/
<script>
	import HelperSysDOM from "@/helpers/HelperSysDOM";
	import HelperCtlListView from "@/helpers/HelperCtlListView";

	export default {
		Helper: {
			RectDragSelectID: "YKList-dragselect-rect",
			rectSelection_beginPos: undefined, //矩形框选择的开始点，记录开始item的row,col索引
			YKList: undefined,  // The Active YKList Instance
			viewDomInfo: {
				offset: undefined,
				width: undefined,
				height: undefined
			}, //ListView容器的坐标偏移量信息
			resetEvents(YKList, onMouseDown, onMouseMove, onMouseUp) {
				let parent = YKList.dom;
				document.onmousedown = onMouseDown;
				document.onmousemove = onMouseMove;
				document.onmouseup = onMouseUp;
			},
			cancel(event, callback) {
				document.multiLine = false;
				let rect = document.getElementById(this.RectDragSelectID);
				if (rect != null) {
					document.getElementById(this.RectDragSelectID).remove();
					this.rectSelection_beginPos = undefined;
					if (callback != undefined) callback(event);
				}
			},
			isDoing() {
				//是否处于鼠标框选状态
				return document.multiLine == true;
			},
			getPos_end() {
				if (this.isDoing()) return document.endPos;
				else return undefined;
			},
			getPos_begin() {
				if (this.isDoing()) return document.startPos;
				else return undefined;
			},
			doMouseDown(event, YKList, callback = undefined) {
				if (event.ctrlKey || event.shiftKey || event.button != 0) return; //非常重要，不能再有按键的情况下启动框选，而且必须是鼠标左键按下
				this.YKList = YKList;
				let domID = YKList.settings.id;
				let domYKList = document.getElementById(domID);

				this.viewDomInfo.offset = {
					left: HelperSysDOM.Helper.getElementLeft(domYKList),
					top: HelperSysDOM.Helper.getElementTop(domYKList)
				};
				this.viewDomInfo.width = HelperSysDOM.Helper.getElementWidth(domID);
				this.viewDomInfo.height = HelperSysDOM.Helper.getElementHeight(domID);
				if (
						//限制框选区域，只能在domID的node内
						event.pageX <= this.viewDomInfo.offset.left ||
						event.pageX > this.viewDomInfo.offset.left + this.viewDomInfo.width ||
						event.pageY <= this.viewDomInfo.offset.top ||
						event.pageY > this.viewDomInfo.offset.top + this.viewDomInfo.height
				)
					return;
				if (document.getElementById(this.RectDragSelectID) == undefined) {
					document.multiLine = true;
					document.startPos = {
						x: event.pageX,
						y: event.pageY
					};
					document.endPos = {
						x: event.pageX,
						y: event.pageY
					};
					let rect = document.createElement("div");
					rect.id = this.RectDragSelectID;
					document.body.appendChild(rect);
				}

				if (YKList.settings.custom_afterMouseDown != undefined) YKList.settings.custom_afterMouseDown(event, document.startPos); //If there were custom method
			},
			doMouseMove(event, callback) {
				if (document.multiLine) {
					let X = event.pageX;
					let Y = event.pageY;
					if (X < this.viewDomInfo.offset.left) X = this.viewDomInfo.offset.left;
					if (X > this.viewDomInfo.offset.left + this.viewDomInfo.width)
						X = this.viewDomInfo.offset.left + this.viewDomInfo.width;
					if (Y < this.viewDomInfo.offset.top) Y = this.viewDomInfo.offset.top;
					if (Y > this.viewDomInfo.offset.top + this.viewDomInfo.height)
						Y = this.viewDomInfo.offset.top + this.viewDomInfo.height;
					document.endPos = {
						x: X,
						y: Y
					};
					this.updateRect(); //update the rect of selection
					HelperCtlListView.Helper.checkSelectRect(this.YKList);
				}
			},
			updateRect() {
				let rect = document.getElementById("YKList-dragselect-rect"),
						startX = document.startPos.x,
						startY = document.startPos.y,
						endX = document.endPos.x,
						endY = document.endPos.y,
						width = Math.abs(endX - startX) + "px",
						height = Math.abs(endY - startY) + "px",
						left = endX > startX ? startX : endX,
						top = endY > startY ? startY : endY;
				rect.style.position = "absolute";
				rect.style.width = width;
				rect.style.height = height;
				rect.style.left = left + 'px';
				rect.style.top = top + 'px';
			}
		}
	};
</script>
