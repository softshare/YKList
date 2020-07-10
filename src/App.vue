<template>
  <YKList msg="Welcome to Your Vue.js App" ref="ykList1" :settings="settings" :listData="listData">
    <template v-slot:YKListItems="YKListItems">
      <div onselectstart="return false;">
        {{ YKListItems.item.name }}, {{ YKListItems.index }}
      </div>
    </template>
  </YKList>
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
				listData: [],
				settings: {
					id: "ykList1",
					charSortBy: "name",
					onListClick: function (event, itemInfo) {
						console.log('click', itemInfo);
					},
					// beforeMouseDown: function (event, itemInfo) {
					// 	console.log(itemInfo);
					// 	return true;
					// },
					// afterMouseDown:function(){
					//     return false;
					// },
					horizontal: true
				}
			}
		},
		methods: {
			getRandomName() {
				let store = ['Marry', 'Jhon', 'Tom', 'Lily', 'Richard', 'Max', 'Cherry', 'Lee', 'Yang','Betty','Andy'];
				return store[Math.floor(Math.random() * store.length)];
			},
			initTestData() {
				let testtingArray = [];
				for (let i = 0; i < 200; i++) {
					testtingArray.push({
						index: i,
						name: this.getRandomName() + i
					});
				}
				this.listData = testtingArray.sort((a, b) => (a.name)[0].charCodeAt() - (b.name)[0].charCodeAt()); //排序
			}
		},
		mounted() {
			console.log("Sys Mounted.");
			this.initTestData();
			console.log(this.$refs.ykList1.list);
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

  body{
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
