<script>
	import HelperSysDOM from "@/helpers/HelperSysDOM";
	import HelperDragSelect from "@/helpers/HelperDragSelect";

	export default {
		Helper: {
			//根据鼠标的绝对坐标，获取下方的item对象信息
			getItemInfoByMouse(YKList, mouseX, mouseY) {
				//根据鼠标的绝对坐标，获取点击下的item信息
				let domYKList = document.getElementById(YKList.settings.id);
				let offsetLeft = HelperSysDOM.Helper.getElementLeft(domYKList);
				let offsetTop = HelperSysDOM.Helper.getElementTop(domYKList);

				let mouseInListViewX = mouseX - offsetLeft; //Get the relative position of mouse: x
				let mouseInListViewY = mouseY - offsetTop; //Get the relative position of mouse: y
				console.log(mouseInListViewX, mouseInListViewY)

				let topHeight = 0;
				let topOffset = 0;
				let itemX = 0;
				let itemY = 0;
				if (YKList.horizontal) {
					topHeight = ( YKList.startIndex / YKList.visible_rows ) * YKList.itemSize_width; //startIndex的标准位置
					topOffset = domYKList.scrollLeft - topHeight; //偏移量
					itemX = Math.ceil(( domYKList.scrollLeft + mouseInListViewX ) / YKList.itemSize_width); //水平方向的item;
					itemY = Math.ceil(mouseInListViewY / YKList.itemSize_height);
					if (itemY >= YKList.total_rows) itemY = 0;
				} else {
					topHeight = ( YKList.startIndex / YKList.visible_cols ) * YKList.itemSize_height; //startIndex的标准位置
					topOffset = domYKList.scrollTop - topHeight; //偏移量
					itemX = Math.ceil(mouseInListViewX / YKList.itemSize_width);
					itemY = Math.ceil(( domYKList.scrollTop + mouseInListViewY ) / YKList.itemSize_height); //垂直方向的item;
					if (itemX >= YKList.total_cols) itemX = 0;
				}
				console.log(itemX, itemY)
				return {
					itemX, itemY
				}


				// let itemX = Math.ceil(mouseInListViewX / YKList.itemSize_width); //水平方向的item
				// let itemY = Math.ceil(
				// 		( mouseInListViewY + topOffset ) / YKList.itemSize_height
				// ); //垂直方向的item
				//
				// if (itemX > YKList.visible_cols) return null; //如果x超出最大列，直接返回空
				// let itemIndex = YKList.startIndex + (itemY - 1) * YKList.visible_cols + itemX - 1;
				// if (itemIndex > YKList.list.length - 1) return null; //如果超出最大索引，直接返回空
				//
				// let itemLeft = (itemX - 1) * YKList.itemSize_width;
				// let itemTop = (itemY - 1) * YKList.itemSize_height - topOffset;
				// let mouseInItemX = mouseInListViewX - itemLeft; //鼠标在item单元内部的相对位置 - X
				// let mouseInItemY = mouseInListViewY - itemTop; //鼠标在item单元内部的相对位置 - Y
				//
				// let padding = 5;
				// let isMouseInIcon =
				//   mouseInItemX > (YKList.itemSize_width - YKList.itemSize_image) / 2 && //左侧边界
				//   mouseInItemX <
				//     YKList.itemSize_width - (YKList.itemSize_width - YKList.itemSize_image) / 2 && //右侧边界
				//   mouseInItemY > padding && //顶部边界
				//   mouseInItemY <
				//     YKList.itemSize_height -
				//       padding -
				//       (YKList.itemSize_height - YKList.itemSize_image); //顶部边界
				//
				// return {
				//   x: itemX, //在可视区域的x
				//   y: itemY, //在可视区域的y
				//   id: itemIndex, //总索引位置,
				//   mouseInItemX,
				//   mouseInItemY,
				//   isMouseInIcon
				// };
			},
			checkSelectRect(YKList) {
				let pBegin = HelperDragSelect.Helper.getPos_begin();
				let pEnd = HelperDragSelect.Helper.getPos_end();
				if (pBegin == undefined || pEnd == undefined) return;
				let domYKList = document.getElementById(YKList.settings.id);

				let offsetLeft = HelperDragSelect.Helper.viewDomInfo.offset.left;
				let offsetTop = HelperDragSelect.Helper.viewDomInfo.offset.top;
				let xMin = Math.min(pBegin.x, pEnd.x) - offsetLeft;
				let xMax = Math.max(pBegin.x, pEnd.x) - offsetLeft;
				let yMin = Math.min(pBegin.y, pEnd.y) - offsetTop;
				let yMax = Math.max(pBegin.y, pEnd.y) - offsetTop;
				let r1 = {left: xMin, right: xMax, top: yMin, bottom: yMax};

				let iStart = YKList.startIndex; //the first item index of active page
				let iStop = iStart + YKList.visible_cols * YKList.visible_rows; //the last item index of active page
				if (iStop >= YKList.list.length) iStop = YKList.list.length - 1;

				let rectSelectionGrid = {
					xMin: undefined,
					yMin: undefined,
					xMax: undefined,
					yMax: undefined
				};

				let iTopRowOffset = this.getTopOffset(YKList);

				for (let i = iStart; i <= iStop; i++) {
					//判断当前屏幕内，是否有新的item被选中
					let isSelection = this.isItemInRect(
							YKList,
							i,
							iTopRowOffset,
							r1
					);
					console.log(isSelection)
					//获取矩形选择信息
					if (isSelection) {
						//如果在矩形范围内：
						let coord = this.getItemCoord(i);
						// if (this.GLOBAL.dragSelection.rectSelection_beginPos == undefined)
						// 	this.GLOBAL.dragSelection.rectSelection_beginPos = pos; //关键！！第一次选择的起点
						rectSelectionGrid.xMin == undefined
								? ( rectSelectionGrid.xMin = coord.x )
								: ( rectSelectionGrid.xMin = Math.min(
								rectSelectionGrid.xMin,
								coord.x
								) );
						rectSelectionGrid.xMax == undefined
								? ( rectSelectionGrid.xMax = coord.x )
								: ( rectSelectionGrid.xMax = Math.max(
								rectSelectionGrid.xMax,
								coord.x
								) );
						rectSelectionGrid.yMin == undefined
								? ( rectSelectionGrid.yMin = coord.y )
								: ( rectSelectionGrid.yMin = Math.min(
								rectSelectionGrid.yMin,
								coord.y
								) );
						rectSelectionGrid.yMax == undefined
								? ( rectSelectionGrid.yMax = coord.y )
								: ( rectSelectionGrid.yMax = Math.max(
								rectSelectionGrid.yMax,
								coord.y
								) );
					}

					let beginPos = HelperDragSelect.Helper.rectSelection_beginPos; //获取真正的选择起、止index矩形
					if (beginPos == undefined) return; //可能存在开始时没有计算得到起始点的问题

					xMin = Math.min(rectSelectionGrid.xMin, beginPos.x);
					xMax = Math.max(rectSelectionGrid.xMax, beginPos.x);
					yMin = Math.min(rectSelectionGrid.yMin, beginPos.y);
					yMax = Math.max(rectSelectionGrid.yMax, beginPos.y);
					this.checkBySelectionRect(YKList, xMin, yMin, xMax, yMax); //执行矩形范围内的选择更新，矩形框外的选中要清除
					break;
				}
			},
			getItemCoord(YKList, id) {
				//传入一个id<获取它所在的col,row
				if (YKList.horizontal) {
					let x = ( id % YKList.total_rows ) + 1;
					let y = Math.ceil(( id + 1 ) / YKList.total_rows);
					return {x, y};
				} else {
					let x = ( id % YKList.total_cols ) + 1;
					let y = Math.ceil(( id + 1 ) / YKList.total_cols);
					return {x, y};
				}
			},
			getTopOffset(YKList) {// get the top row/col 's offset to the grid top/left
				let domYKList = document.getElementById(YKList.settings.id);
				if (YKList.horizontal) {
					let iTopVisibleColIndex = this.getItemCoord(YKList, YKList.startIndex).x;
					let iTopVisibleColScrollShouldBe = ( iTopVisibleColIndex - 1 ) * YKList.itemSize_width;
					return domYKList.scrollLeft - iTopVisibleColScrollShouldBe;
				} else {
					let iTopVisibleRowIndex = this.getItemCoord(YKList, YKList.startIndex).y;
					let iTopVisibleRowScrollShouldBe = ( iTopVisibleRowIndex - 1 ) * YKList.itemSize_height;
					return domYKList.scrollTop - iTopVisibleRowScrollShouldBe;
				}
			},
			isItemInRect(YKList, itemIndex, iTopRowOffset, r1) {
				//判断一个index的item图像矩形，是否在鼠标框选的矩形框范围内
				var itemInfo = this.getRelativeCoord(YKList, itemIndex); //获取这个节点在虚拟Grid上的相对坐标范围
				var topX = ( itemInfo.x - 1 ) * YKList.itemSize_width;
				var topY = ( itemInfo.y - 1 ) * YKList.itemSize_height - iTopRowOffset;
				var r2 = {
					left: topX,
					right: topX + YKList.itemSize_width,
					top: topY,
					bottom: topY + YKList.itemSize_height
				};
				return !(
						r1.left > r2.right ||
						r1.top > r2.bottom ||
						r2.left > r1.right ||
						r2.top > r1.bottom
				);
			},
			getRelativeCoord(YKList, id) { //get a item's col/row info relative the startIndex
				var pos = this.getItemCoord(YKList, id);
				var posStartIndex = this.getItemCoord(YKList, YKList.startIndex);
				return {x: pos.x - posStartIndex.x + 1, y: pos.y - posStartIndex.y + 1};
			},
			checkBySelectionRect(YKList, xMin, yMin, xMax, yMax) {
				//执行矩形范围内的选择更新，矩形框外的选中要清除
				var iBegin = this.getItemIDByPosXY(xMin, yMin);
				var iEnd = this.getItemIDByPosXY(xMax, yMax);
				// this.list_sort_checked(); //选中的节点要排序
				// for (var i = this.list_checked.length - 1; i >= 0; i--) {
				// 	//判断选择区域外的节点，可能有选中要取消
				// 	var id = this.list_checked[i];
				// 	var p = this.listView_get_posXY(id);
				// 	if (
				// 			p.x < xMin ||
				// 			p.x > xMax ||
				// 			id < iBegin ||
				// 			id > iEnd ||
				// 			p.y < yMin ||
				// 			p.y > yMax
				// 	) {
				// 		this.listView_check_set(id, false);
				// 	}
				// }

				//判断选择区域内的节点
				// for (var i = iBegin; i <= iEnd; i++) {
				// 	//开始到结束要选中
				// 	if (i >= this.list.length) break; //可能末尾index超出了list范围
				// 	if (!this.list[i].isChecked) {
				// 		//如果是未选中节点
				// 		var p = this.listView_get_posXY(i);
				// 		if (p.x >= xMin && p.x <= xMax) this.listView_check_set(i, true);
				// 	} else {
				// 		//如果是已选中节点
				// 		var p = this.listView_get_posXY(i);
				// 		if (p.x < xMin || p.x > xMax) this.listView_check_set(i, false);
				// 	}
				// }
			},
			getItemIDByPosXY(YKList, x, y) { //get item id from its coordinate
				if (YKList.horizontal) {
					return this.visible_rows * ( y - 1 ) + x - 1;
				} else {
					return this.visible_cols * ( y - 1 ) + x - 1;
				}
			},
			hotItem_clear(YKList) {
				YKList.itemHot = -1;
			},
			checkAll(YKList) {
				//所有选中
				if (YKList.list_checked.length == YKList.list.length) return; //不要重复设置全选
				YKList.list_checked = [];
				for (let i = 0; i < YKList.list.length; i++) {
					YKList.list[i].isChecked = true;
					YKList.list_checked.push(i);
				} // this.list_checked = Array.from(this.list) //ES6语法，复制数组
			},
			unCheckAll(YKList) {
				//清楚所有选中
				for (let i = 0; i < YKList.list_checked.length; i++) {
					YKList.list[YKList.list_checked[i]].isChecked = false;
				}
				YKList.list_checked = [];
				this.listView_hotItem_clear(YKList);
			},

		}
	};
</script>
