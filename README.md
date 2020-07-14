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
                    charSortBy: "name",
			}
		},
}		
```

# Instructions

## Component Initial - settings

Properties|Description|Example
--|:--:|--:
id|required;  unique identifier|id: "ykList1"
keyNaviBy|optional; select the property of list data to enable keyboard character navigation|keyNaviBy: "name"
itemSize|optional; set the size of the list elements|itemSize: {width:200,height:50}
height|optional; set the height of the list, the unit must be px or percentage|height: "600px"
horizontal|optional; set whether it is a horizontal list|horizontal:true

## Component Initial - listData
the json object array which stored the list data，e.g.：
[{name:"name1", id:1},...{name:"namen", id:n}]

## Component Initial - height
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


