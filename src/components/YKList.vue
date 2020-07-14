/**
Copyright(c) 2020
Author : YangKe
E-mail : softshare@163.com

If YKList is useful to you, please star me at github:
https://github.com/softshare/YKList
**/
<template>
  <div
      class="YKList-listMain"
      ref="settings.id"
      tabindex="0"
      :id="settings.id"
      :style="{height:listHeightByUser}"
      @scroll="onScroll"
      @keydown="onListViewKeyDown($event)"
      @mousedown="onListViewContainerMouseDown($event)"
      @mouseup="onListViewContainerMouseUp($event)"
      @dblclick="onListViewContainerDoubleClick($event)"
      v-bind:class="[
          { 'YKList-listMain-vert': horizontal==false },
          { 'YKList-listMain-hori': horizontal==true },
        ]"
  >
    <div v-bind:style="styleInnerScroll"></div>
    <div v-bind:style="styleInnerContent">
      <template v-if="horizontal">
        <div v-for="(item,index) in vcols_getArray" :key="index"
             style="height: 100%;float:left;clear:none;"
             :style="{width:itemSize_width+'px'}"
        >
          <div v-for="(item2, index2) in item.data" :key='index2' class="YKList-list-item"
               v-bind:style="styleItem"
               @click="onItemClick($event, (startIndex + index) * visible_rows + index2, item)"
               :id="getItemDomID((startIndex + index) * visible_rows + index2)"
               v-bind:class="[
          { 'YKList-list-item-checked': isChecked((startIndex + index) * visible_rows + index2) },
          { 'YKList-list-item-hot': isHotItem((startIndex + index) * visible_rows + index2) },
        ]"
          >
            <slot name="YKListItems" v-bind:item="item2" v-bind:index="(startIndex + index) * visible_rows + index2">
            </slot>
          </div>
        </div>
      </template>

      <template v-else>
        <div
            v-for="(item, index) in splitData"
            :key="index"
            class="YKList-list-item"
            v-bind:style="styleItem"
            @click="onItemClick($event, startIndex + index, item)"
            :id="getItemDomID(startIndex + index)"
            v-bind:class="[
          { 'YKList-list-item-checked': isChecked(startIndex + index) },
          { 'YKList-list-item-hot': isHotItem(startIndex + index) }
        ]"
        >
          <slot name="YKListItems" v-bind:item="item" v-bind:index="startIndex + index">
          </slot>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
	import HelperDragSelect from "@/helpers/HelperDragSelect";
	import HelperCtlListView from "@/helpers/HelperCtlListView";
	import HelperSysDOM from "../helpers/HelperSysDOM";

	export default {
		name: 'YKList',
		data() {
			return {
				list: [],
				list_checked: [],
				list_charSort: [], // array which stored the first char to sort
				vcols_total: [], //垂直容器列的数量
				defaultScrollBarSize: 18, //默认的滚动条占用的像素大小
				fileListView_MouseTime: 0, //计算是否是list单击的时间缓存
				itemSize_image: 80, //图片尺寸
				total_cols: 1, //数据的理论总列数
				total_rows: 1, //数据的理论总行数
				listWidth: 0, //列表宽
				listHeight: 0, //列表高
				listHeightByUser: 0, //用户设置的列表高
				startIndex: 0, //虚拟显示的开始item
				itemHot: -1, //当前的热点item
				scrollTopValue: 0, //监测滚动条是否停止滚动的变量
				MouseTime: 0, //Detect mouse click event
				iLoadIconLP_Index: 0, //自动加载低优先级缩略图图标生成任务的索引值,
				iListHeightDetect: 0,
				sortAsend: true,
			};
		},
		props: {
			settings: { //the data to show
				type: Object,
				required: true,
				default: function () {
					return {
						itemSize: { //the size of a list node
							type: Object,
							default: function () {
								return {
									width: 128,
									height: 128,
								}
							},
						},
						sortData: 0, //1 : ascend, 2: descend
						beforeMouseDown: function (event, itemInfo) {
							return true;
						},
						onListClick: function (event, itemInfo) {
							return;
						},
						onListDblClick: function (event, itemInfo) {
							return;
						},
					}
				}
			},
			listData: { //the data to show
				type: Array,
				default: function () {
					return []
				},
			},
			height: {
				type: String,
				default: function () {
					return "500px"
				},
			},
		},
		computed: {
			dom() {
				return document.getElementById(this.settings.id);
			},
			horizontal() {
				return this.settings.horizontal;
			},
			itemSize_width() {
				return this.settings.itemSize == undefined ? 128 : this.settings.itemSize.width;
			},
			itemSize_height() {
				return this.settings.itemSize == undefined ? 128 : this.settings.itemSize.height;
			},
			visible_cols() {  //虚拟滚动数据的显示总列数
				let v = 0;
				if (this.horizontal) {
					v = Math.ceil(this.listWidth / this.itemSize_width) + 0; //+1可以增加滚动平滑度
				} else {
					v = Math.floor(( this.listWidth - this.defaultScrollBarSize ) / this.itemSize_width);
				}
				if (v <= 0) v = 1;
				return v;
			},
			visible_rows() { //虚拟滚动数据的显示总行数
				let v = 0;
				if (this.horizontal) {
					v = Math.floor(( this.listHeight - this.defaultScrollBarSize ) / this.itemSize_height);
				} else {
					v = Math.ceil(( this.listHeight ) / this.itemSize_height) + 1; //+1可以增加滚动平滑度
				}
				if (v <= 0) v = 1;
				return v;
			},
			scrollMaxSize() {//滚动条的最大值
				if (this.horizontal) {
					return this.total_cols * this.itemSize_width;
				} else {
					return this.total_rows * this.itemSize_height;
				}
			},
			limitCount() { //一页显示的条数
				return this.visible_cols * this.visible_rows;
			},
			splitData() {//当前显示页的数据
				return this.list.slice(
						this.startIndex,
						this.startIndex + this.limitCount
				);
			},
			styleInnerScroll() {
				if (this.horizontal) {
					return {
						width: this.scrollMaxSize + "px",
						height: "1px"
					};
				} else {
					return {
						height: this.scrollMaxSize + "px",
						width: "1px"
					};
				}
			},
			styleInnerContent() {
				if (this.horizontal) {
					return {
						position: "absolute",
						height: "100%",
						width: this.visible_cols * this.itemSize_width + 'px',
						left: ( this.startIndex * this.itemSize_width ) + 'px'
					};
				} else {
					return {
						position: "absolute",
						width: "100%",
						top: ( this.startIndex * this.itemSize_height ) / this.total_cols + 'px',
					};
				}
			},
			styleItem() {
				let style = {
					width: this.itemSize_width + 'px',
					height: this.itemSize_height + 'px',
				};
				return style;
			},
			vcols_getArray() { //获取当前虚拟滚动区域，要显示的列范围
				return this.vcols_total.slice(this.startIndex, this.startIndex + this.visible_cols)
			},
			styleListWidth() {
				return this.settings.width == undefined ? "100%" : this.settings.width
			}
		},
		methods: {
			refreshLayout() {//计算行、列的数量；垂直、水平的列表，计算方式不同
				this.listWidth = this.dom.offsetWidth;
				this.listHeight = this.dom.offsetHeight;
				this.iListHeightDetect = this.listHeight;
				if (this.horizontal) {
					this.total_rows = Math.floor(( this.listHeight - this.defaultScrollBarSize ) / this.itemSize_height);
					if (this.total_rows <= 0) this.total_rows = 1;
					this.total_cols = Math.ceil(this.list.length / this.total_rows);

					this.vcols_total = new Array(this.total_cols)
					for (let i = 0; i < this.vcols_total.length; i++) {
						this.vcols_total[i] = {
							cid: i,
							data: this.list.slice(i * this.visible_rows, ( i + 1 ) * this.visible_rows)
						}
					}
					if (this.dom.scrollLeft > 1) this.dom.scrollLeft = this.dom.scrollLeft - 1; //fix the wrong scroll offset
				} else {
					this.total_cols = Math.floor(( this.listWidth - this.defaultScrollBarSize ) / this.itemSize_width);
					if (this.total_cols <= 0) this.total_cols = 1;
					this.total_rows = Math.ceil(this.list.length / this.total_cols);
					if (this.dom.scrollTop > 1) this.dom.scrollTop = this.dom.scrollTop - 1; //fix the wrong scroll offset
				}
			},
			settingsCheck() {
				if (this.settings.horizontal == undefined) this.settings.horizontal = false;
			},
			onScroll() {
				// 根据滚动的距离，估算出这个滚动位置对应的数组序列，例如滚动100px，每条40px，对应第3条
				if (this.horizontal) {
					let scrollLeft = this.dom.scrollLeft;
					let colStartIndex = Math.floor(scrollLeft / this.itemSize_width)
					let maxStartIndexLimit = this.total_cols - this.visible_cols; //非常重要，要设置最大的滚动起始点，必须是n列中，所有页-1
					if (colStartIndex >= maxStartIndexLimit) colStartIndex = maxStartIndexLimit //水平滚动条会自动延展，要检查超限
					if (colStartIndex < 0) colStartIndex = 0
					this.startIndex = colStartIndex
				} else {
					let scrollTop = this.dom.scrollTop;
					this.startIndex =
							Math.floor(scrollTop / this.itemSize_height) *
							this.total_cols; //当前是第几个item，而不是第几行
				}
			},
			onListViewKeyDown(e) {
				if (
						e.keyCode == 33 || //page up
						e.keyCode == 34 || //page down
						e.keyCode == 37 || //left
						e.keyCode == 38 || //up
						e.keyCode == 39 || //right
						e.keyCode == 40 || //down
						e.keyCode == 35 || //end
						e.keyCode == 36 //home
				) { //Direction Selection
					e.preventDefault();
					HelperCtlListView.Helper.hotItem_setByKey(this, e.keyCode, e.shiftKey);
					return;
				}

				if (e.key == "a" && e.ctrlKey) { //Select All
					this.checkAll();
					return;
				}

				if (
						( e.keyCode >= 48 && //0
								e.keyCode <= 57 ) || //9
						( e.keyCode >= 65 && //a
								e.keyCode <= 90 ) //z
				) {
					HelperCtlListView.Helper.hotItem_setByChar(this, e.key);
					return;
				}
			},
			onListViewContainerMouseDown(event) {
				this.MouseTime = HelperCtlListView.Helper.getTimeStamp();
			},
			onListViewContainerMouseUp(event) {
				var clickTime =
						HelperCtlListView.Helper.getTimeStamp() - this.MouseTime;
				if (
						clickTime <= 200 &&
						!event.shiftKey &&
						!event.ctrlKey &&
						event.button == 0
				) {
					//鼠标左键按下，弹起时间不超过?毫秒，视为单击
					var itemAtMouse = HelperCtlListView.Helper.getItemInfoByMouse(
							this,
							event.pageX,
							event.pageY
					);
					if (itemAtMouse == null) {
						this.unCheckAll();
						this.clearHotItem();
					}
					if (this.settings.onListClick != undefined) {
						this.settings.onListClick(event, itemAtMouse);
					}
				}
			},
			onListViewContainerDoubleClick(event) {
				var itemAtMouse = HelperCtlListView.Helper.getItemInfoByMouse(
						this,
						event.pageX,
						event.pageY
				);
				if (this.settings.onListDblClick != undefined) {
					this.settings.onListDblClick(event, itemAtMouse);
				}
			},
			onLayoutResized() {
				this.refreshLayout();
			},
			on_dragSelect_mouseDown(event) {
				if (event.shiftKey || event.ctrlKey) return; //如果此时用户按下了shift或者ctrl，可能是在进行鼠标选择，不能处理拖拽
				var itemAtMouse = HelperCtlListView.Helper.getItemInfoByMouse(
						this,
						event.pageX,
						event.pageY
				);
				if (this.settings.beforeMouseDown != undefined && !this.settings.beforeMouseDown(event, itemAtMouse)) return;
				HelperDragSelect.Helper.doMouseDown(event, this);
			},
			on_dragSelect_mouseMove(event) {
				let vmobj = this;
				HelperDragSelect.Helper.doMouseMove(event, function (e) {
					HelperCtlListView.Helper.checkSelectRect(vmobj);
				});
			},
			on_dragSelect_mouseUp(event) {
				HelperDragSelect.Helper.cancel(event);
			},
			onItemClick(event, index, item) {
				if (event.shiftKey && this.list_checked.length > 0) {
					HelperCtlListView.Helper.checkSort(this);
					HelperCtlListView.Helper.checkRangeByShifIndex(this, index);
					this.setHotItem(index)
					return;
				}

				if (event.ctrlKey || event.altKey) {
					this.checkToogle(index)
				} else {
					this.unCheckAll();
					this.checkToogle(index);
				}

				if (this.isChecked(index)) {
					this.setHotItem(index);
				} else {
					if (this.list_checked.length > 0)
						this.setHotItem(this.list_checked[this.list_checked.length - 1]);
				}

			},
			tm_autoScroll() { //the timer of auto scrolling
				if (this.dom.offsetHeight != this.iListHeightDetect) { //check the change of list height
					this.refreshLayout();
				}

				if (!HelperDragSelect.Helper.isDoing()) return;
				var posBegin = HelperDragSelect.Helper.getPos_begin();
				var posEnd = HelperDragSelect.Helper.getPos_end();
				var offsetTop = HelperDragSelect.Helper.viewDomInfo.offset.top;
				var offsetLeft = HelperDragSelect.Helper.viewDomInfo.offset.left;
				var x = posEnd.x - offsetLeft;
				var y = posEnd.y - offsetTop;
				var iScrollTo = undefined;

				if (this.horizontal) {
					if (
							posBegin.x > posEnd.x &&
							x < this.itemSize_width &&
							this.dom.scrollLeft > 0
					) {//left?
						iScrollTo = this.dom.scrollLeft - this.itemSize_width / 2;
						if (iScrollTo < 0) iScrollTo = 0;
					}
					if (
							posBegin.x < posEnd.x &&
							x > this.listWidth - this.itemSize_width &&
							this.dom.scrollLeft < this.scrollMaxSize
					) {//right?
						iScrollTo = this.dom.scrollLeft + this.itemSize_width / 2;
						if (iScrollTo > this.scrollMaxSize) iScrollTo = this.scrollMaxSize;
					}
					if (iScrollTo != undefined) {
						this.dom.scrollLeft = iScrollTo; //执行滚动
						HelperCtlListView.Helper.checkSelectRect(this);
					}
				} else {
					if (
							posBegin.y > posEnd.y &&
							y < this.itemSize_height &&
							this.dom.scrollTop > 0
					) {//up?
						iScrollTo = this.dom.scrollTop - this.itemSize_height / 2;
						if (iScrollTo < 0) iScrollTo = 0;
					}
					if (
							posBegin.y < posEnd.y &&
							y > this.listHeight - this.itemSize_height &&
							this.dom.scrollTop < this.scrollMaxSize
					) {//down?
						iScrollTo = this.dom.scrollTop + this.itemSize_height / 2;
						if (iScrollTo > this.scrollMaxSize) iScrollTo = this.scrollMaxSize;
					}
					if (iScrollTo != undefined) {
						this.dom.scrollTop = iScrollTo; //执行滚动
						HelperCtlListView.Helper.checkSelectRect(this);
					}
				}
			},
			getItemData(index) {
				if (index >= 0 && index < this.list.length)
					return this.list[index];
				else
					return null;
			},
			getItemsData(list) {
				let retValue = [];
				for(let i=0; i<list.length; i++){
					retValue.push(this.getItemData(list[i]));
        }
				return retValue;
			},
			getItemDomID(index) {
				return 'YKList_Item_' + index;
			},
			isChecked(index) {
				return this.list_checked.indexOf(index) >= 0;
			},
			isHotItem(index) {
				return this.itemHot == index;
			},
			setHotItem(index) {
				this.itemHot = index;
				if (index >= 0) {
					this.setItemVisible(index);
				}
			},
			getHotItem() {
				return this.itemHot;
			},
			clearHotItem() {
				this.setHotItem(-1);
			},
			checkSet(index, isChecked) {
				var iCheckIndex = this.list_checked.indexOf(index);
				if (isChecked && iCheckIndex < 0) {
					this.list_checked.push(index);
				}
				if (!isChecked && iCheckIndex >= 0) {
					this.list_checked.splice(iCheckIndex, 1);
				}
			},
			checkToogle(index) { //switch check status
				var iCheckIndex = this.list_checked.indexOf(index);
				if (iCheckIndex < 0) {
					this.list_checked.push(index);
				} else {
					this.list_checked.splice(iCheckIndex, 1);
				}
			},
			checkAll() {
				if (this.list_checked.length == this.list.length) return; //不要重复设置全选
				this.list_checked = [];
				for (let i = 0; i < this.list.length; i++) {
					this.list_checked.push(i);
				}
			},
			checkBetween(indexFrom, indexTo) {
				this.unCheckAll();
				for (let i = indexFrom; i <= indexTo; i++) this.checkSet(i, true)
			},
			unCheckAll() {
				this.list_checked = [];
				this.clearHotItem();
			},
			setItemVisible(index) {
				let coord = HelperCtlListView.Helper.getItemCoord(this, index);
				var offsetStart = HelperCtlListView.Helper.getTopOffset(this);
				let coordRelativeStart = HelperCtlListView.Helper.getRelativeCoord(this, index);
				if (this.horizontal) {
					let posLeft = ( coordRelativeStart.x - 1 ) * this.itemSize_width - offsetStart;
					let posRight = posLeft + this.itemSize_width - this.listWidth;
					if (posLeft < 0) this.dom.scrollLeft = ( coord.x - 1 ) * this.itemSize_width;
					if (posRight > 0) this.dom.scrollLeft = coord.x * this.itemSize_width - this.listWidth;
				} else {
					let posTop = ( coordRelativeStart.y - 1 ) * this.itemSize_height - offsetStart;
					let posBottom = posTop + this.itemSize_height - this.listHeight;
					if (posTop < 0) this.dom.scrollTop = ( coord.y - 1 ) * this.itemSize_height;
					if (posBottom > 0) this.dom.scrollTop = coord.y * this.itemSize_height - this.listHeight;
				}
			},
			isItemVisible(index) {
				var offsetStart = HelperCtlListView.Helper.getTopOffset(this);
				let coordRelativeStart = HelperCtlListView.Helper.getRelativeCoord(this, index);
				if (this.horizontal) {
					let posLeft = ( coordRelativeStart.x - 1 ) * this.itemSize_width - offsetStart;
					let posRight = posLeft + this.itemSize_width;
					return posLeft >= 0 && posRight <= this.listWidth;
				} else {
					let posTop = ( coordRelativeStart.y - 1 ) * this.itemSize_height - offsetStart;
					let posBottom = posTop + this.itemSize_height;
					return posTop >= 0 && posBottom <= this.listHeight;
				}
			},
			setHeight(val) {
				this.listHeightByUser = val;
				this.refreshLayout();
			},
			setListData(data) {
				if (this.settings.sortData != undefined) {
					if (this.settings.sortData == 1) {
						this.list = data.sort((a, b) => ( a.name )[0].charCodeAt() - ( b.name )[0].charCodeAt()); //排序
					} else {
						this.list = data.sort((a, b) => ( b.name )[0].charCodeAt() - ( a.name )[0].charCodeAt()); //排序
					}
				} else {
					this.list = data;
				}

				this.unCheckAll();
				this.list_charSort = [];
				this.refreshLayout();
				if (this.settings.keyNaviBy != undefined) {
					for (let i = 0; i < this.list.length; i++) {
						let sortValue = eval("this.list[i]." + this.settings.keyNaviBy).toString();
						if (sortValue.length > 0) sortValue = sortValue[0].toLowerCase();
						this.list_charSort.push(sortValue);
					}
				}
			},
			removeItems(items) {
				this.list_checked = [];
				this.setHotItem(-1);
				items = items.sort((a, b) => a - b);
				for (let i = items.length - 1; i >= 0; i--) {
					this.list.splice(items[i], 1);
					this.list_charSort.splice(items[i], 1);
				}
				this.refreshLayout();
			},
			appendItem(item) {
				this.list_checked = [];
				this.list.push(item);
				if (this.settings.keyNaviBy != undefined) {
					let sortValue = eval("item." + this.settings.keyNaviBy).toString();
					if (sortValue.length > 0) sortValue = sortValue[0].toLowerCase();
					this.list_charSort.push(sortValue);
				}
				this.refreshLayout();
			},
			setHorizontal(val) {
				this.settings.horizontal = val;
				this.refreshLayout();
			},
			getHorizontal() {
				return this.settings.horizontal;
			},
			getSelectedItems() {
				return this.list_checked;
			},
			setItemSize(val) {
				this.settings.itemSize.width = val.width;
				this.settings.itemSize.height = val.height;
				this.refreshLayout();
			},
			sortData(colName, isAscend = true) {
				this.sortAsend = isAscend;
				if (isAscend)
					this.setListData(this.list.sort((a, b) => ( eval('a.' + colName) )[0].charCodeAt() - ( eval('b.' + colName) )[0].charCodeAt()));
				else
					this.setListData(this.list.sort((a, b) => ( eval('b.' + colName) )[0].charCodeAt() - ( eval('a.' + colName) )[0].charCodeAt()));
			},
			isAscend() {
				return this.sortAsend;
			}
		},
		watch: {
			settings: function (valNew) {
				this.settingsCheck();
				this.refreshLayout();
			},
			height: function (valNew) {
				this.setHeight(valNew);
			},
		},
		created() {
		},
		mounted() {
			this.settingsCheck();
      if(this.height!=undefined) this.setHeight(this.height);
			if (this.listData.length == 0 && this.settings.testingData != undefined) {
				this.setListData(HelperCtlListView.Helper.createTestData(this.settings.testingData));
			} else {
				this.setListData(this.listData);
			}
			HelperDragSelect.Helper.init(this.on_dragSelect_mouseDown, this.on_dragSelect_mouseMove, this.on_dragSelect_mouseUp);
			setInterval(this.tm_autoScroll, 333);

		},
	}
</script>
<style>
  .YKList-listMain {
    height: 500px;
    width: 100%;
    /*background-color: antiquewhite;*/
    border: 0px;
    margin: 0;
    padding: 0px;
    position: relative;
    outline: none;
  }

  .YKList-listMain-vert {
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .YKList-listMain-hori {
    overflow-x: scroll;
    overflow-y: hidden;
  }

  .YKList-list-item {
    padding: 0px;
    /*background-color: white;*/
    text-align: center;
    clear: none;
    margin: 0;
    border: 0;
    float: left;
  }

  .YKList-list-item-checked {
    background-color: rgba(72, 179, 255, 0.5);
  }

  .YKList-list-item-hot {
    box-sizing: border-box;
    -moz-box-sizing: border-box; /* Firefox */
    -webkit-box-sizing: border-box; /* Safari */
    border: 1px solid rgba(41, 152, 255, 0.89);
    background-color: rgba(72, 179, 255, 0.5);
  }

  /*拖拽选择框的背景样式*/
  #YKList-dragselect-rect {
    background: rgba(72, 179, 255, 0.44);
    z-index: 99;
    outline: 1px solid #0078d7;
  }

</style>
