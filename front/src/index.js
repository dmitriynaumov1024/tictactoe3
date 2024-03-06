import { h, reactive, createApp } from "vue"
import { Client } from "@/game/Client.js"
import { Timer } from "@/game/Timer.js"
import MainView from "@/comp/MainView.js"

let client = reactive(Client.create())
let timer = reactive(Timer.create())
timer.start()

let app = createApp({
    render() {
        return h(MainView, { client })
    }
})

app.config.globalProperties.$timer = timer

setTimeout(()=> {
    app.mount("#app-root")
}, 560)
