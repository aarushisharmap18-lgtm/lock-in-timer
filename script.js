let focusTime = 1500
let breakTime = 300

let time = focusTime

let interval = null
let mode = "focus"

const timeDisplay = document.getElementById("time")
const circle = document.querySelector(".progress-ring-circle")

const bell = new Audio("bell.mp3")

const radius = 100
const circumference = 2 * Math.PI * radius

circle.style.strokeDasharray = circumference
circle.style.strokeDashoffset = circumference

function setProgress(percent){

const offset = circumference - percent * circumference
circle.style.strokeDashoffset = offset

}

function updateTimer(){

let minutes = Math.floor(time/60)
let seconds = time % 60

timeDisplay.textContent =
`${minutes}:${seconds.toString().padStart(2,"0")}`

let total = mode === "focus" ? focusTime : breakTime

let progress = 1 - time/total

setProgress(progress)

}

function startTimer(){

if(interval) return

interval = setInterval(()=>{

time--

updateTimer()

if(time <=0){

bell.play()

clearInterval(interval)
interval = null

if(mode === "focus"){

mode = "break"
time = breakTime

alert("Break time!")

}else{

mode = "focus"
time = focusTime

alert("Focus time!")

}

updateTimer()

}

},1000)

}

document.getElementById("start").onclick = startTimer

document.getElementById("reset").onclick = ()=>{

clearInterval(interval)
interval = null

mode = "focus"
time = focusTime

updateTimer()
setProgress(0)

}

document.getElementById("break").onclick = ()=>{

clearInterval(interval)
interval = null

mode = "break"
time = breakTime

updateTimer()
setProgress(0)

}

document.getElementById("setTimes").onclick = ()=>{

let focus = document.getElementById("focusInput").value
let br = document.getElementById("breakInput").value

if(focus > 0){

focusTime = focus * 60

}

if(br > 0){

breakTime = br * 60

}

mode = "focus"
time = focusTime

updateTimer()
setProgress(0)

}

document.getElementById("mode").onclick = ()=>{

document.body.classList.toggle("dark")

}

updateTimer()