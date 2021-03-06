# YKList
一个简洁、强大、易用、高性能的VueJS列表显示控件。
如果您对YKList有更多功能需求或建议，请给我留言。
如果您希望扩展和完善YKList，欢迎加入！

# 关键特性

1. 高性能.支持海量数据的列表显示; 数据显示的瓶颈取决于计算机的内存大小和数据准备的时间；数据显示的效率接近操作系统原生的
列表性能。 

2. 一个列表控件即可同时支持垂直列表和水平列表。例如：只需要在控件初始化时设置 "horizontal: true", 即可控制列表的滚动方向为水平。
垂直、水平的显示可以随时切换，无须重新载入页面。

3. 支持键盘导航。上、下、左、右箭头，以及page up, page down, home ,end可以方便的切换热点元素。

4. 默认支持鼠标框选。按下鼠标不放，拖动鼠标即可完成矩形多选。鼠标框选的自动滚动。

5. 默认支持键盘+键盘的组合选择。支持点击鼠标/按下方向键时，和shift/ctrl一起控制选择范围。

5. 内置易用、精简的事件自定义处理，可精确探测任意点击位置下的列表元素。

6. 动态数据修改
    + 可以动态全部替换数据
    + 可以动态删除指定元素
    + 可以动态添加元素
    + 可以动态修改列表水平/垂直方向
    + 可以动态修改列表元素尺寸

7. 灵活、自由的功能扩展支持
    + 通过开放的slot接口，可以访问和自定义每一个元素的外观、行为；
    + 包括轻松实现包括拖拽在内的自定义元素交互；
    
8. 使用MIT许可证. 可随意应用于商业用途。    



# 快速开始：
## 安装 

    npm install yklist

## 在项目中引用YKList    

    import YKList from "yklist";
    import "yklist/dist/yklist.css";

## 简单示例：
```
<template>
  <YKList ref="ykList1" :settings="settings" :listData="listData" height="600px">
    <template v-slot:YKListItems="YKListItems">
      <div style="user-select: none;">
        {{ YKListItems.item.name }}, {{ YKListItems.index }}
      </div>
    </template>
  </YKList>
</template>

import YKList from "yklist";
import "yklist/dist/yklist.css";

export default {
		name: 'App',
		components: {
			YKList
		},
        listData: [{name:'name1'},{name:'name2'},{name:'name3'}],
		data() {
			return {
				settings: {
					id: "ykList1",
                    keyNaviBy: "name",
			}
		},
}		
```

# 使用说明

## 初始化设置  settings
属性|说明|示例
--|:--:|--:
id|必须，唯一标识|id: "ykList1"
keyNaviBy|可选; 在列表数据中选择一列启用键盘字符导航|keyNaviBy: "name"
itemSize|可选；设置列表元素的尺寸|itemSize: {width:200,height:50}
horizontal|可选；设置是否为水平列表|horizontal:true
checkBeforeDragSelection|可选, 自定义一个方法，在鼠标拖动选择前进行检查，如果方法返回false则不允许拖动选择|checkBeforeDragSelection: function (event, itemInfo){return false;}

## 初始化设置 - listData
存储列表数据的json数组，例如：
[{name:"name-1", id:1},...{name:"name-n", id:n}]


## 初始化设置 - height
设置列表高度，您可以在运行时调用setHeight方法，或者修改height的值动态改变列表高度

## 方法
方法|说明|示例
--|:--|--:
setHeight|设置YKList的高度, 高度可以是px或者百分比| this.$refs.ykList1.setHeight("800px");
setItemSize|设置列表元素的尺寸| this.$refs.ykList1.setItemSize({width:200, height:36});
setHorizontal|设置列表是否水平滚动|this.$refs.ykList1.setHorizontal(!this.$refs.ykList1.getHorizontal());
appendItem|添加一个元素到列表末尾|this.$refs.ykList1.appendItem({name: 'yklist123'});
removeItems|删除列表元素，输入参数为数组|this.$refs.ykList1.removeItems(this.$refs.ykList1.getSelectedItems());
getItemsData|获取一组元素对应的数据|console.log(this.$refs.ykList1.getItems(this.$refs.ykList1.getSelectedItems()));
getItemData|获取一个元素对应的数据|console.log(this.$refs.ykList1.getItemData(this.$refs.ykList1.getHotItem()));
setListData|动态改变列表数据|this.$refs.ykList1.setListData(newListData);
getSelectedItems|获取被选中的元素数组|var selectedItems=this.$refs.ykList1.getSelectedItems();


### 事件
+ onListClick(event, itemInfo) 
列表被单击时触发，用于获取鼠标点击位置下的坐标、列表元素信息
例如：
```
<YKList ref="ykList1" :settings="settings" :listData="listData" :height="height"
              @onListClick="onListClick"
>
....
onListClick(event, itemInfo) {
    console.log("onListClick", event, itemInfo);
},

```

+ onListDblClick(event, itemInfo)
列表被双击时触发，用于获取鼠标点击位置下的坐标、列表元素信息
例如：
```
<YKList ref="ykList1" :settings="settings" :listData="listData" :height="height"
              @onListDblClick="onListDblClick"
>
....
onListDblClick(event, itemInfo) {
    console.log("onListDblClick", event, itemInfo);
},

```


+ onMouseMove(event, itemInfo) 
鼠标移动过程中，对鼠标位置、元素进行探测
例如：
```
<YKList ref="ykList1" :settings="settings" :listData="listData" :height="height"
              @onMouseMove="onMouseMove"
>
....
onMouseMove(event, itemInfo) {
    console.log("onMouseMove", event, itemInfo);
},

```


+ onItemUnderMouseChanged(itemInfo)
鼠标在列表范围内移动时，会不断探测鼠标坐标下的列表元素，如果探测到的元素和上一次探测的结果不一样，则触发本事件
```
<YKList ref="ykList1" :settings="settings" :listData="listData" :height="height"
              @onItemUnderMouseChanged="onItemUnderMouseChanged"
>
....
onItemAtMouseChanged(itemInfo) {
    console.log("onItemUnderMouseChanged", itemInfo);
},

```


+ onSelectedChange(valNew)
当存储已选中元素的索引的数组发生改变时触发
```
<YKList ref="ykList1" :settings="settings" :listData="listData" :height="height"
              @onSelectedChange="onSelectedChange"
>
....
onSelectedChange(valNew) {
    console.log("onSelectedChange", valNew);
},

```


+ onContextMenu(event, itemInfo)
右键进行点击时
```
<YKList ref="ykList1" :settings="settings" :listData="listData" :height="height"
              @onContextMenu="onContextMenu"
>
....
onContextMenu(event, itemInfo) {
    console.log("onContextMenu", event, itemInfo);
},

```