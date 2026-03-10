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

/* WORKING PICTURE IN PICTURE */

const pipButton = document.getElementById("pip")

let pipWindow = null

pipButton.onclick = async () => {

if (!("documentPictureInPicture" in window)) {
alert("Picture-in-Picture not supported in this browser")
return
}

if (pipWindow) {
pipWindow.close()
pipWindow = null
return
}

pipWindow = await window.documentPictureInPicture.requestWindow({
width:200,
height:120
})

const pipTimer = pipWindow.document.createElement("div")

pipTimer.style.display = "flex"
pipTimer.style.alignItems = "center"
pipTimer.style.justifyContent = "center"
pipTimer.style.height = "100%"
pipTimer.style.fontSize = "32px"
pipTimer.style.fontFamily = "sans-serif"

pipTimer.textContent = timeDisplay.textContent

pipWindow.document.body.appendChild(pipTimer)

setInterval(()=>{
if(pipWindow){
pipTimer.textContent = timeDisplay.textContent
}
},500)

}
