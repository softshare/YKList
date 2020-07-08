<template>
    <div id="app" style="width:100%;height:800px;background-color: rgba(44,62,80,0.2);">
        <YKList msg="Welcome to Your Vue.js App" ref="ykList1"  :settings="settings" :listData="listData">
            <template v-slot:YKListItems="YKListItems">
                <div  onselectstart="return false;" >
                {{ YKListItems.item.name }},
                </div>
            </template>
        </YKList>
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
                listData:[],
                settings:{
                    id: "ykList1",
                    custom_afterMouseDown: function (event, posInYKList) {
                        console.log(posInYKList)
                    },
                    // custom_beforeMouseDown:function(){
                    //     return false;
                    // },
                    horizontal: true
                }
            }
        },
        methods: {
            initTestData(){
                let testtingArray=[];
                for(let i=0;i<100;i++){
                    testtingArray.push({
                        index:i,
                        name: "name"+i
                    });
                }
                this.listData=testtingArray;
                console.log("Testing Data Created.");
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
</style>
