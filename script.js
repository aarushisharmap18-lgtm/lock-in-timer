let focusTime = 1500
let breakTime = 300
let time = focusTime
let mode = "focus"
let interval = null

const bell = new Audio("bell.mpeg")

const timeDisplay = document.getElementById("time")
const circle = document.querySelector(".progress-ring-circle")

let sessionCount = localStorage.getItem("sessions") || 0
const sessionDisplay = document.getElementById("sessionCount")
sessionDisplay.textContent = sessionCount

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

setProgress(1 - time/total)

}

function startTimer(){

if(interval) return

interval = setInterval(()=>{

time--
updateTimer()

if(time<=0){

bell.currentTime=0
bell.play().catch(()=>{})

clearInterval(interval)
interval=null

if(mode==="focus"){

sessionCount++
localStorage.setItem("sessions",sessionCount)
sessionDisplay.textContent=sessionCount

mode="break"
time=breakTime

}else{

mode="focus"
time=focusTime

}

updateTimer()

}

},1000)

}

document.getElementById("start").onclick=startTimer

document.getElementById("pause").onclick=()=>{
clearInterval(interval)
interval=null
}

document.getElementById("reset").onclick=()=>{
clearInterval(interval)
interval=null
mode="focus"
time=focusTime
updateTimer()
}

document.getElementById("break").onclick=()=>{
clearInterval(interval)
interval=null
mode="break"
time=breakTime
updateTimer()
}

document.getElementById("setTimes").onclick=()=>{

let f=document.getElementById("focusInput").value
let b=document.getElementById("breakInput").value

if(f>0) focusTime=f*60
if(b>0) breakTime=b*60

mode="focus"
time=focusTime
updateTimer()

}

document.getElementById("mode").onclick=()=>{
document.body.classList.toggle("dark")
}

updateTimer()

/* TODO LIST */

const panel=document.getElementById("todoPanel")
const list=document.getElementById("todoList")

document.getElementById("todoToggle").onclick=()=>{
panel.classList.toggle("open")
}

document.getElementById("addTodo").onclick=()=>{

let text=document.getElementById("todoText").value
if(!text) return

let li = document.createElement("li")

let box = document.createElement("input")
box.type = "checkbox"

let span = document.createElement("span")
span.textContent = text

let del = document.createElement("button")
del.textContent = "✖"
del.className = "delete"

box.onchange = () => {
span.classList.toggle("completed")
}

del.onclick = () => {
li.remove()
}

li.appendChild(box)
li.appendChild(span)
li.appendChild(del)

list.appendChild(li)
box.onchange=()=>{
span.classList.toggle("completed")
}

li.appendChild(box)
li.appendChild(span)

list.appendChild(li)

document.getElementById("todoText").value=""

}

/* PICTURE IN PICTURE */

document.getElementById("pip").onclick=async()=>{

if(!document.pictureInPictureElement){

const canvas=document.createElement("canvas")
canvas.width=200
canvas.height=100

const ctx=canvas.getContext("2d")

setInterval(()=>{

ctx.fillStyle="#111"
ctx.fillRect(0,0,200,100)

ctx.fillStyle="#fff"
ctx.font="30px sans-serif"
ctx.textAlign="center"

ctx.fillText(timeDisplay.textContent,100,60)

},1000)

const stream=canvas.captureStream()

const video=document.createElement("video")
video.srcObject=stream
video.play()

await video.requestPictureInPicture()

}else{

document.exitPictureInPicture()

}

}

/* SERVICE WORKER */

if("serviceWorker" in navigator){
navigator.serviceWorker.register("sw.js")
}

