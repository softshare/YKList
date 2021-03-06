# YKList
A simple, powerful, easy-to-use, high-performance VueJS ListView UI control.
If you have any requirements/suggestion, please leave me a message.
If you want to expand and improve YKList, welcome to join!

# Key features
1. High performance. Support massive data; the bottleneck depends on the memory size of the computer and the time of data preparation; the efficiency of data display is close to that of the operating system.

2. Just one component can support both vertical and horizontal display. The display mode can be switched at any time without reloading the page.

3. Support keyboard navigation. Up, down, left, and right arrows, as well as page up, page down, home, and end, can easily switch the hotspot elements.

4. Support mouse drag&select. Not only that, press and hold the mouse, drag the mouse and move, the page scrolling will be triggered automatically at any time.

5. Support keyboard combination selection. Just press shift/ctrl when mouse select or keybord navigation, you'll got a smart selection enhancement.

5. Built-in easy-to-use and streamlined event custom processing, which can accurately detect list elements under any position of mouse click .

6. Dynamic data/property modification
    + Can replace all data dynamically
    + Can dynamically delete specified elements
    + Can dynamically add elements
    + Can dynamically modify the horizontal/vertical direction of the list
    + Can dynamically modify the size of list elements

7. Flexible and free function expansion support
    + Through the open slot interface, you can access and customize the appearance and behavior of each element;
    + Including easy interaction of custom elements including drag and drop;
    
8. Use MIT license. Can be used for commercial purposes at will.   



# Quick Start
## install

    npm install yklist

## import YKList in your vue project    

    import YKList from "yklist";
    import "yklist/dist/yklist.css";

## simple example
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
        listData: [{name:'name1'},{name:'name2'},{name:'name3'},{name:'name4'}],
		data() {
			return {
				settings: {
					id: "ykList1",
                    keyNaviBy: "name",
			}
		},
}		
```

# Instructions

## Property - settings

Properties|Description|Example
--|:--:|--:
id|required;  unique identifier|id: "ykList1"
keyNaviBy|optional; select the property of list data to enable keyboard character navigation|keyNaviBy: "name"
itemSize|optional; set the size of the list elements|itemSize: {width:200,height:50}
height|optional; set the height of the list, the unit must be px or percentage|height: "600px"
horizontal|optional; set whether it is a horizontal list|horizontal:true
checkBeforeDragSelection|optional, customize a method to check before dragging selection, if the method returns false then drag selection is not allowed|checkBeforeDragSelection: function (event, itemInfo){return false;}

## Property - listData
the json object array which stored the list data，e.g.：
[{name:"name1", id:1},...{name:"namen", id:n}]

## Property - height
set up the list height, you may call the method 'setHeight' or modify the height property at runtime.

## Method
Method|Description|Example
--|:--|--:
setHeight|Set the height of YKList, the height can be px or percentage| this.$refs.ykList1.setHeight("800px");
setItemSize|Set the size of the list elements| this.$refs.ykList1.setItemSize({width:200, height:36});
setHorizontal|Set whether the list scrolls horizontally|this.$refs.ykList1.setHorizontal(!this.$refs.ykList1.getHorizontal());
appendItem|Add an element to the end of the list|this.$refs.ykList1.appendItem({name: 'yklist123'});
removeItems|Remove list elements, the input parameter is an array||this.$refs.ykList1.removeItems(this.$refs.ykList1.getSelectedItems());
getItemsData|Get a group of data corresponding to a set of elementsv|console.log(this.$refs.ykList1.getItems(this.$refs.ykList1.getSelectedItems()));
getItemData|Get one data corresponding to a set of elements|console.log(this.$refs.ykList1.getItemData(this.$refs.ykList1.getHotItem()));
setListData|change all the list data at runtime|this.$refs.ykList1.setListData(newListData);
getSelectedItems|Get the selected element array|var selectedItems=this.$refs.ykList1.getSelectedItems();


### Event
+ onListClick(event, itemInfo) 
Triggered when the list is clicked, used to obtain the coordinates/list element  under the mouse.
E.g:
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
Triggered when the list is double clicked, used to obtain the coordinates/list element  under the mouse.
E.g:
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
Detect the mouse position and elements during the mouse movement
E.g:
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
When moving mouse within list, it will detect the list elements continuously under 
the mouse coordinates. If the detected element is different from the last detection 
result, this event will be triggered
```
<YKList ref="ykList1" :settings="settings" :listData="listData" :height="height"
              @onItemUnderMouseChanged="onItemUnderMouseChanged"
>
....
onItemUnderMouseChanged( itemInfo) {
    console.log("onItemUnderMouseChanged", itemInfo);
},

```

+ onSelectedChange(valNew)
Fires when the array storing the index of the selected element changes
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
Fires when mouse right button click the list item
```
<YKList ref="ykList1" :settings="settings" :listData="listData" :height="height"
              @onContextMenu="onContextMenu"
>
....
onContextMenu(event, itemInfo) {
    console.log("onContextMenu", event, itemInfo);
},

```