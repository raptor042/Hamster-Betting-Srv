import { ethers } from "ethers"
import { BETTING_ABI, BETTING_CA } from "./__web3__/config.js"
import { getSigner } from "./__web3__/init.js"

const getStatus = async () => {
    const betting = new ethers.Contract(
        BETTING_CA,
        BETTING_ABI,
        getSigner()
    )

    const status = await betting.status()
    console.log(Number(status))

    return Number(status)
}

const bet_started = async () => {
    const betting = new ethers.Contract(
        BETTING_CA,
        BETTING_ABI,
        getSigner()
    )

    try {
        betting.on("Betting_Round_Started", (duration, e) => {
            console.log(duration)

            const interval = setInterval(async () => {
                const status = await getStatus()

                if(status == 0) {
                    timer()
                } else {
                    clear()
                }
            }, 1000)

            const clear = () => clearInterval(interval)
        })
    } catch (error) {
        console.log(error)
    }
}

const timer = async () => {
    const betting = new ethers.Contract(
        BETTING_CA,
        BETTING_ABI,
        getSigner()
    )

    const duration = await betting.duration()
    console.log(Number(duration))

    const timestamp = await betting.timestamp()
    console.log(Number(timestamp))

    const now = Date.now() / 1000
    console.log(now)

    const seconds = Number(now.toFixed(0)) - Number(timestamp)
    console.log(seconds)

    const second = Number(duration) - seconds
    console.log(second)

    if(second <= 0) {
        await stop_bet()
    }
}

const stop_bet = async () => {
    const betting = new ethers.Contract(
        BETTING_CA,
        BETTING_ABI,
        getSigner()
    )

    try {
        await betting.stop_betting_round()
    } catch (error) {
        console.log(error)
    }
}

setTimeout(() => {
    bet_started()
}, 1000)