<script>
	import HelperSysDOM from "@/helpers/HelperSysDOM";
	import HelperDragSelect from "@/helpers/HelperDragSelect";

	export default {
		Helper: {
			//根据鼠标的绝对坐标，获取下方的item对象信息
			getItemInfoByMouse(YKList, mouseX, mouseY) {
				//根据鼠标的绝对坐标，获取点击下的item信息
				let domYKList = YKList.dom;
				let offsetLeft = HelperSysDOM.Helper.getElementLeft(domYKList);
				let offsetTop = HelperSysDOM.Helper.getElementTop(domYKList);

				let mouseInListViewX = mouseX - offsetLeft; //Get the relative position of mouse: x
				let mouseInListViewY = mouseY - offsetTop; //Get the relative position of mouse: y

				let index = 0; // item index
				let itemX = 0;
				let itemY = 0;
				if (YKList.horizontal) {
					itemX = Math.ceil(( domYKList.scrollLeft + mouseInListViewX ) / YKList.itemSize_width); //水平方向的item;
					itemY = Math.ceil(mouseInListViewY / YKList.itemSize_height);
					if (itemX > YKList.total_cols) return null;
					if (itemY > YKList.total_rows) return null;
					index = (itemX-1) * YKList.total_rows + (itemY-1);
					if (index >= YKList.list.length ) return null;
				} else {
					itemX = Math.ceil(mouseInListViewX / YKList.itemSize_width);
					itemY = Math.ceil(( domYKList.scrollTop + mouseInListViewY ) / YKList.itemSize_height); //水平方向的item;
					if (itemX > YKList.total_cols) return null;
					if (itemY > YKList.total_rows) return null;
					index =(itemY-1) * YKList.total_cols + (itemX-1);
					if (index>= YKList.list.length ) return null;
				}
				return {
					itemX, itemY, index
				}
			},
			checkSelectRect(YKList) {
				let pBegin = HelperDragSelect.Helper.getPos_begin();
				let pEnd = HelperDragSelect.Helper.getPos_end();
				if (pBegin == undefined || pEnd == undefined) return;

				let offsetLeft = HelperDragSelect.Helper.viewDomInfo.offset.left;
				let offsetTop = HelperDragSelect.Helper.viewDomInfo.offset.top;
				let xMin = Math.min(pBegin.x, pEnd.x) - offsetLeft;
				let xMax = Math.max(pBegin.x, pEnd.x) - offsetLeft;
				let yMin = Math.min(pBegin.y, pEnd.y) - offsetTop;
				let yMax = Math.max(pBegin.y, pEnd.y) - offsetTop;
				let r1 = {left: xMin, right: xMax, top: yMin, bottom: yMax};

				let iStart = 0; //the first item index of active page
				if (YKList.horizontal)
					iStart = YKList.startIndex * YKList.visible_rows;
				else
					iStart = YKList.startIndex;
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
					let inRect = this.isItemInRect(
							YKList,
							i,
							iTopRowOffset,
							r1
					);
					//获取矩形选择信息
					if (inRect) {
						//如果在矩形范围内：
						let coord = this.getItemCoord(YKList, i);
						//关键！！第一次选择的item起点，必须从这里计算获得，不能在mouseDown中获得
						//因为
						if (HelperDragSelect.Helper.rectSelection_beginPos == undefined)
							HelperDragSelect.Helper.rectSelection_beginPos = coord;
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
				}

				let beginPos = HelperDragSelect.Helper.rectSelection_beginPos; //获取真正的选择起、止index矩形
				if (beginPos == undefined) {
					return;
				} //可能存在开始时没有计算得到起始点的问题:从边缘的空白部分进行选择

				YKList.clearHotItem();
				xMin = Math.min(rectSelectionGrid.xMin, beginPos.x);
				xMax = Math.max(rectSelectionGrid.xMax, beginPos.x);
				yMin = Math.min(rectSelectionGrid.yMin, beginPos.y);
				yMax = Math.max(rectSelectionGrid.yMax, beginPos.y);
				this.checkBySelectionRect(YKList, xMin, yMin, xMax, yMax); //执行矩形范围内的选择更新，矩形框外的选中要清除
			},
			getItemCoord(YKList, id) {
				//传入一个id<获取它所在的col,row
				if (YKList.horizontal) {
					let x = Math.ceil(( id + 1 ) / YKList.total_rows);
					let y = ( id % YKList.total_rows ) + 1;
					return {x, y};
				} else {
					let x = ( id % YKList.total_cols ) + 1;
					let y = Math.ceil(( id + 1 ) / YKList.total_cols);
					return {x, y};
				}
			},
			getTopOffset(YKList) {// get the first visible row/col 's offset to the grid top/left
				let domYKList = document.getElementById(YKList.settings.id);
				if (YKList.horizontal) {
					let iTopVisibleColIndex = this.getItemCoord(YKList, YKList.startIndex * YKList.visible_rows).x;
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
				var topX = 0;
				var topY = 0;
				if (YKList.horizontal) {
					topX = ( itemInfo.x - 1 ) * YKList.itemSize_width - iTopRowOffset;
					topY = ( itemInfo.y - 1 ) * YKList.itemSize_height;
				} else {
					topX = ( itemInfo.x - 1 ) * YKList.itemSize_width;
					topY = ( itemInfo.y - 1 ) * YKList.itemSize_height - iTopRowOffset;
				}
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
				var posStartIndex = 0;
				if (YKList.horizontal)
					posStartIndex = this.getItemCoord(YKList, YKList.startIndex * YKList.visible_rows);
				else
					posStartIndex = this.getItemCoord(YKList, YKList.startIndex);

				return {x: pos.x - posStartIndex.x + 1, y: pos.y - posStartIndex.y + 1};
			},
			checkBySelectionRect(YKList, xMin, yMin, xMax, yMax) {
				//执行矩形范围内的选择更新，矩形框外的选中要清除
				var iBegin = this.getItemIDByPosXY(YKList, xMin, yMin);
				var iEnd = this.getItemIDByPosXY(YKList, xMax, yMax);

				this.checkSort(YKList); //选中的节点要排序
				for (let i = YKList.list_checked.length - 1; i >= 0; i--) {
					//判断选择区域外的节点，可能有选中要取消
					var id = YKList.list_checked[i];
					var p = this.getItemCoord(YKList, id);
					if (
							p.x < xMin ||
							p.x > xMax ||
							id < iBegin ||
							id > iEnd ||
							p.y < yMin ||
							p.y > yMax
					) {
						YKList.checkSet(id, false);
					}
				}
				// 判断选择区域内的节点
				for (let i = iBegin; i <= iEnd; i++) {
					//开始到结束要选中
					if (i >= YKList.list.length) break; //可能末尾index超出了list范围
					if (!YKList.list[i].isChecked) {
						//如果是未选中节点
						let p = this.getItemCoord(YKList, i);
						if (YKList.horizontal) {
							if (p.x >= xMin && p.x <= xMax && p.y >= yMin && p.y <= yMax) YKList.checkSet(i, true);
						} else {
							if (p.x >= xMin && p.x <= xMax) YKList.checkSet(i, true);
						}
						// break;
					} else {
						//如果是已选中节点
						let p = this.getItemCoord(YKList, i);
						if (YKList.horizontal) {
							if (p.x < xMin || p.x > xMax || p.y < yMin || p.y > yMax) YKList.checkSet(i, false);
						} else {
							if (p.x < xMin || p.x > xMax) YKList.checkSet(i, false);
						}
					}
				}
			},
			getItemIDByPosXY(YKList, x, y) { //get item id from its coordinate
				if (YKList.horizontal) {
					return YKList.visible_rows * ( x - 1 ) + y - 1;
				} else {
					return YKList.visible_cols * ( y - 1 ) + x - 1;
				}
			},
			checkSort(YKList) {
				//对节点进行排序
				YKList.list_checked = YKList.list_checked.sort((a, b) => a - b); //排序
			},
			hotItem_setByKey(YKList, keyCode, isShift) {
				if (YKList.list.length < 0) return; //确定有数据
				if (YKList.itemHot == -1 ){
					YKList.checkSet(0, true);
					YKList.setHotItem(0);
					return;
				}
				let newID = 0; //37-左,38-上,39-右,40-下
        let pageSize = 0;
        let coordHot = this.getItemCoord(YKList,YKList.itemHot);
				if (YKList.horizontal) {
					pageSize = YKList.total_rows * (YKList.visible_cols-1);
					if (keyCode == 38) newID = YKList.itemHot - 1;
					if (keyCode == 37) newID = YKList.itemHot - YKList.total_rows;
					if (keyCode == 40) newID = YKList.itemHot + 1;
					if (keyCode == 39) newID = YKList.itemHot + YKList.total_rows;
				} else {
					pageSize = YKList.total_cols * (YKList.visible_rows-1);
					if (keyCode == 37) newID = YKList.itemHot - 1;
					if (keyCode == 38) newID = YKList.itemHot - YKList.total_cols;
					if (keyCode == 39) newID = YKList.itemHot + 1;
					if (keyCode == 40) newID = YKList.itemHot + YKList.total_cols;
				}
				if (keyCode == 33) newID = YKList.itemHot - pageSize;
				if (keyCode == 34) newID = YKList.itemHot + pageSize;
				if (keyCode == 35) newID = YKList.list.length - 1;
				if (keyCode == 36) newID = 0;
				if (newID < 0) newID = 0;
				if (newID >= YKList.list.length) newID = YKList.list.length - 1;
				if (isShift) {
					this.checkRangeByShifIndex(YKList, newID);
				} else {
					YKList.unCheckAll(); //如果shift,ctrl都没有按下，需要清空所有已选择
					YKList.checkSet(newID, true);
				}
				YKList.setHotItem(newID);
			},
			hotItem_setByChar(YKList, key) { //change the hot item by key press of char
				key = key.toLowerCase();
				var iFirstIndex = YKList.list_charSort.indexOf(key); //当前key在文件首字母索引中的位置
				if (iFirstIndex < 0) return; //根本就不存在，直接返回
				var iStartIndex = 0;
				if (YKList.list_checked.length > 0) {
					//有已选中，而且选中的首字母和key一样
					iStartIndex = YKList.list_checked[0] + 1; //从下一个开始计算
					var subArray = YKList.list_charSort.slice(iStartIndex);
					if (subArray.indexOf(key) < 0) iStartIndex = iFirstIndex; //从头开始
				}
				for (var i = iStartIndex; i < YKList.list_charSort.length; i++) {
					if (key == YKList.list_charSort[i]) {
						YKList.unCheckAll();
						YKList.checkSet(i, true);
						YKList.setHotItem(i);
						break;
					}
				}
			},
			checkRangeByShifIndex(YKList, index) {
				if (YKList.list_checked.length < 0) return null;
				let iCheckFrom = YKList.list_checked[0];
				let iCheckTo = YKList.list_checked[YKList.list_checked.length - 1];
				if (index > iCheckTo) YKList.checkBetween(iCheckFrom, index);
				if (index < iCheckFrom) YKList.checkBetween(index, iCheckTo);
				if (index > iCheckFrom && index <iCheckTo) YKList.checkBetween(iCheckFrom, index);
			},
			getTimeStamp() {
				return new Date().valueOf();
			},
		}
	};
</script>
