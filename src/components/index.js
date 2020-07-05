import Vue from 'vue'
import ListView from './YKList.vue'
const Components = {
    ListView
}
Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name])
})
export default Components