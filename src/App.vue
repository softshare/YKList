<template>
  <div style="width:100%;">
    <div style="clear:both;float:left;width:100%;">
      <YKList ref="ykList1" :settings="settings" :listData="listData" :height="height">
        <template v-slot:YKListItems="YKListItems">
          <div style="user-select: none;">
            {{ YKListItems.item.name }}, {{ YKListItems.index }}
          </div>
        </template>
      </YKList>
    </div>
    <div style="clear:both;float:left;width:100%;">
      <button @click="resize" style="width: 100px; height:40px;">resize</button>
      <button @click="append" style="width: 100px; height:40px;">append</button>
      <button @click="remove" style="width: 100px; height:40px;">remove</button>
      <button @click="toogleDirection" style="width: 100px; height:40px;">toogleDirection</button>
      <button @click="setItemSize" style="width: 100px; height:40px;">setItemSize</button>
      <button @click="sortData" style="width: 100px; height:40px;">sortData</button>
      <button @click="getItems" style="width: 100px; height:40px;">getItems</button>
      <button @click="getItem" style="width: 100px; height:40px;">getItem</button>
    </div>
  </div>
</template>

<script>
	import YKList from '@/components/YKList.vue'

	export default {
		name: 'App',
		components: {
			YKList
		},
		data() {
			return {
				height:"600px",
				listData: [],
				settings: {
					id: "ykList1",
					keyNaviBy: "name",
					testingData: 100,
					itemSize: {
						width: 128,
						height: 64
					},
					onListClick: function (event, itemInfo) {
						console.log(event, itemInfo);
					},
					// horizontal: true
				}
			}
		},
		methods: {
			resize() {
				this.height = "800px";
				// this.$refs.ykList1.setHeight("800px");
			},
			append() {
				this.$refs.ykList1.appendItem({name: 'yklist123'});
			},
			remove() {
        this.$refs.ykList1.removeItems(this.$refs.ykList1.getSelectedItems());
			},
			toogleDirection() {
				this.$refs.ykList1.setHorizontal(!this.$refs.ykList1.getHorizontal());
			},
			setItemSize() {
				this.$refs.ykList1.setItemSize({width:200, height:36});
			},
			sortData() {
				this.$refs.ykList1.sortData("name", !this.$refs.ykList1.isAscend());
			},
			getItems() {
				console.log(this.$refs.ykList1.getItemsData(this.$refs.ykList1.getSelectedItems()));
			},
			getItem() {
				console.log(this.$refs.ykList1.getItemData(this.$refs.ykList1.getHotItem()));
			},
		},
		mounted() {
		},
	}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  body {
    height: auto;
    min-height: 100%;
  }

  * {
    padding: 0;
    margin: 0;
  }

  html {
    height: 100%;
  }

</style>
