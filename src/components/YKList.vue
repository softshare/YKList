<template>
    <div
            class="YKList-listMain"
            ref="settings.id"
            tabindex="0"
            :id="settings.id"
            @scroll="onScroll"
            v-bind:class="[
          { 'YKList-listMain-vert': settings.horizontal==false },
          { 'YKList-listMain-hori': settings.horizontal==true },
        ]"
    >
        <div v-bind:style="styleInnerScroll"></div>
        <div v-bind:style="styleInnerContent">
            <template v-if="horizontal" >
                <div v-for="(item,index) in vcols_getArray" :key="index"
                     style="height: 100%;float:left;clear:none;"
                     :style="{width:itemSize_width+'px'}"
                >
                    <div v-for="(item2, index2) in item.data"  :key='index2' class="YKList-list-item" v-bind:style="styleItem">
                        <slot name="YKListItems" v-bind:item="item2">
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
            >
                <slot name="YKListItems" v-bind:item="item">
                </slot>
            </div>
            </template>
        </div>
    </div>
</template>
<script>
    import HelperDragSelect from "@/helpers/HelperDragSelect";

    var elementResizeDetectorMaker = require("element-resize-detector");
    var erd = elementResizeDetectorMaker();

    export default {
        data() {
            return {
                list: [],
                vcols_total: [], //垂直容器列的数量
                defaultScrollBarSize: 18, //默认的滚动条占用的像素大小
                fileListView_MouseTime: 0, //计算是否是list单击的时间缓存
                itemSize_image: 80, //图片尺寸
                total_cols: 1, //数据的理论总列数
                total_rows: 1, //数据的理论总行数
                listWidth: 0, //列表宽
                listHeight: 0, //列表高
                startIndex: 0, //虚拟显示的开始item
                listAutoTarget: undefined,
                multi_mode: 0, // 0: 无，1：shift,2：ctrl
                itemHot: -1, //当前的热点item
                scrollTopValue: 0, //监测滚动条是否停止滚动的变量
                scrollTopInterval: null, //监测滚动条是否停止滚动的定时器
                iLoadIconLP_Index: 0 //自动加载低优先级缩略图图标生成任务的索引值
            };
        },
        props: {
            settings: { //the data to show
                type: Object,
                required: true
            },
            listData: { //the data to show
                type: Array,
                default: function () {
                    return []
                },
            },
            itemSize: { //the size of a list node
                type: Object,
                default: function () {
                    return {
                        width: 128,
                        height: 128,
                    }
                },
            },
            thumbnailSize: {//the size of a node thumbnail image
                type: Object,
                default: function () {
                    return {
                        width: 80,
                        height: 80,
                    }
                },
            },
        },
        computed: {
            horizontal(){
                return this.settings.horizontal;
            },
            itemSize_width() {
                return this.itemSize.width;
            },
            itemSize_height() {
                return this.itemSize.height;
            },
            visible_cols() {  //虚拟滚动数据的显示总列数
                var v=0;
                if(this.horizontal){
                    v = Math.ceil(this.listWidth / this.itemSize_width) + 1; //+1可以增加滚动平滑度
                }else {
                    v = Math.floor((this.listWidth - this.defaultScrollBarSize) / this.itemSize_width);
                }
                if (v <= 0) v = 1;
                return v;
            },
            visible_rows() { //虚拟滚动数据的显示总行数
                var v=0;
                if(this.horizontal){
                    v = Math.floor((this.listHeight - 18) / this.itemSize_height)  ;
                }else {
                    v = Math.ceil((this.listHeight ) / this.itemSize_height) +1; //+1可以增加滚动平滑度
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
                console.log(this.visible_cols , this.visible_rows);
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
                        position:"absolute",
                        height: "100%",
                        width: this.visible_cols * this.itemSize_width+'px',
                        left: (this.startIndex * this.itemSize_width)  + 'px'
                    };
                } else {
                    return {
                        position:"absolute",
                        width: "100%",
                        top: (this.startIndex * this.itemSize_height) / this.total_cols + 'px',
                    };
                }
            },
            styleItem() {
                var style = {
                    width: this.itemSize_width + 'px',
                    height: this.itemSize_height + 'px',
                };
                return style;
            },
            vcols_getArray () { //获取当前虚拟滚动区域，要显示的列范围
                return this.vcols_total.slice(this.startIndex, this.startIndex + this.visible_cols)
            },
        },
        methods: {
            setListData(list) {//设置列表数据
                this.list = list;
            },
            reCalcTotalRowsCols() {//计算行、列的数量；垂直、水平的列表，计算方式不同
                var element = document.getElementById(this.settings.id);
                var width = element.offsetWidth;
                var height = element.offsetHeight;
                this.listWidth = width;
                this.listHeight = height;
                if (this.horizontal) {
                    this.total_rows = Math.floor((this.listHeight - 18) / this.itemSize_height);
                    if (this.total_rows <= 0) this.total_rows = 1;
                    this.total_cols = Math.ceil(this.list.length / this.total_rows);
                } else {
                    this.total_cols = Math.floor((this.listWidth - 18) / this.itemSize_width);
                    if (this.total_cols <= 0) this.total_cols = 1;
                    this.total_rows = Math.ceil(this.list.length / this.total_cols);
                }
                console.log(this.total_rows, this.total_cols)
                if(this.horizontal){
                    this.vcols_total = new Array(this.total_cols)
                    for (var i = 0; i < this.vcols_total.length; i++) {
                        this.vcols_total[i] = {
                            cid: i,
                            data: this.list.slice(i * this.visible_rows, (i + 1) * this.visible_rows)
                        }
                    }
                }
            },
            settingsCheck() {
                if (this.settings.horizontal == undefined) this.settings.horizontal = false;
            },
            onScroll() {
                // 根据滚动的距离，估算出这个滚动位置对应的数组序列，例如滚动100px，每条40px，对应第3条
                if(this.horizontal){
                    let scrollLeft = document.getElementById(this.settings.id).scrollLeft;
                    var colStartIndex = Math.floor(scrollLeft / this.itemSize_width)
                    var maxStartIndexLimit = this.total_cols - this.visible_cols //非常重要，要设置最大的滚动起始点，必须是n列中，所有页-1
                    if (colStartIndex >= maxStartIndexLimit) colStartIndex = maxStartIndexLimit //水平滚动条会自动延展，要检查超限
                    if (colStartIndex < 0) colStartIndex = 0
                    this.startIndex = colStartIndex
                }else {
                    let scrollTop = document.getElementById(this.settings.id).scrollTop;
                    this.startIndex =
                        Math.floor(scrollTop / this.itemSize_height) *
                        this.total_cols; //当前是第几个item，而不是第几行
                }
            },
            onLayoutResized(){
                this.reCalcTotalRowsCols();
            },
            on_dragSelect_mouseDown(event){
                if (event.shiftKey || event.ctrlKey) return; //如果此时用户按下了shift或者ctrl，可能是在进行鼠标选择，不能处理拖拽
                // var vmobj = this;
                HelperDragSelect.Helper.doMouseDown(event, this.settings.id);
            },
            on_dragSelect_mouseMove(event){
                //var vmobj = this;
                HelperDragSelect.Helper.doMouseMove(event, function(e) {
                    //vmobj.listView_check_selectRect2(); //进行框选检查
                    //todo
                    console.log(e);
                });
            },
            on_dragSelect_mouseUp(event){
                HelperDragSelect.Helper.cancel(event);
            },
            test() {
                console.log("this is YKList Component.");
            },
            initTestData() {
                var testtingArray = [];
                for (var i = 0; i < 50; i++) {
                    testtingArray.push({
                        index: i,
                        name: "name" + i
                    });
                }
                this.setListData(testtingArray);
                console.log("Testing Data Created.");
            }
        },
        watch: {
            listData: function (newList) {
                this.list = newList;
                this.reCalcTotalRowsCols();
                console.log(newList);
            },
            settings: function () {
                this.settingsCheck();
                this.reCalcTotalRowsCols();
            },
        },
        created() {
            this.settingsCheck();
        },
        mounted() {
            var vmobj = this; //开始监听div缩放事件
            erd.listenTo(document.getElementById(vmobj.settings.id), function() {
                vmobj.onLayoutResized();
            });
            HelperDragSelect.Helper.init(this.on_dragSelect_mouseDown, this.on_dragSelect_mouseMove, this.on_dragSelect_mouseUp);
        },
    }
</script>
<style>
    .YKList-listMain {
        height: 100%;
        width: 100%;
        background-color: antiquewhite;
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
        background-color: white;
        text-align: center;
        clear: none;
        margin: 0;
        border: 0;
        float:left;
    }

    /*拖拽选择框的背景样式*/
    #YKList-dragselect-rect {
        background: rgba(72, 179, 255, 0.44);
        z-index: 99;
    }

</style>
