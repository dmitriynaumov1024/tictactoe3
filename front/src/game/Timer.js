// Timer

export const Timer = {
    create() {
        let timer = { 
            time: Date.now(),
            start() {
                setInterval(()=> {
                    this.time = Date.now()
                }, 320)
            }
        }
        return timer
    }
}
