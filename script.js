/* ---------------- TIMER VARIABLES ---------------- */

let focusTime = 1500
let breakTime = 300

let time = focusTime
let mode = "focus"
let interval = null

const bell = new Audio("bell.mpeg")

const timeDisplay = document.getElementById("time")
const circle = document.querySelector(".progress-ring-circle")

/* ---------------- SESSION COUNTER ---------------- */

let sessionCount = localStorage.getItem("sessions") || 0
const sessionDisplay = document.getElementById("sessionCount")
sessionDisplay.textContent = sessionCount

/* ---------------- PROGRESS RING ---------------- */

const radius = 100
const circumference = 2 * Math.PI * radius

circle.style.strokeDasharray = circumference
circle.style.strokeDashoffset = circumference

function setProgress(percent){
circle.style.strokeDashoffset = circumference - percent * circumference
}

/* ---------------- UPDATE TIMER ---------------- */

function updateTimer(){

let minutes = Math.floor(time/60)
let seconds = time % 60

timeDisplay.textContent =
`${minutes}:${seconds.toString().padStart(2,"0")}`

let total = mode === "focus" ? focusTime : breakTime
setProgress(1 - time/total)

}

/* ---------------- START TIMER ---------------- */

function startTimer(){

if(interval) return

interval = setInterval(()=>{

time--
updateTimer()

if(time <= 0){

bell.currentTime = 0
bell.play().catch(()=>{})

clearInterval(interval)
interval = null

if(mode === "focus"){

sessionCount++
localStorage.setItem("sessions", sessionCount)
sessionDisplay.textContent = sessionCount

mode = "break"
time = breakTime

}else{

mode = "focus"
time = focusTime

}

updateTimer()

}

},1000)

}

/* ---------------- BUTTONS ---------------- */

document.getElementById("start").onclick = startTimer

document.getElementById("pause").onclick = ()=>{
clearInterval(interval)
interval = null
}

document.getElementById("reset").onclick = ()=>{
clearInterval(interval)
interval = null
mode = "focus"
time = focusTime
updateTimer()
}

document.getElementById("break").onclick = ()=>{
clearInterval(interval)
interval = null
mode = "break"
time = breakTime
updateTimer()
}

/* ---------------- CUSTOM TIMES ---------------- */

document.getElementById("setTimes").onclick = ()=>{

let f = document.getElementById("focusInput").value
let b = document.getElementById("breakInput").value

if(f > 0) focusTime = f * 60
if(b > 0) breakTime = b * 60

mode = "focus"
time = focusTime

updateTimer()

}

/* ---------------- DARK MODE ---------------- */

document.getElementById("mode").onclick = ()=>{
document.body.classList.toggle("dark")
}

/* ---------------- TODO LIST ---------------- */

const panel = document.getElementById("todoPanel")
const list = document.getElementById("todoList")

document.getElementById("todoToggle").onclick = ()=>{
panel.classList.toggle("open")
}

document.getElementById("addTodo").onclick = ()=>{

let text = document.getElementById("todoText").value
if(!text) return

let li = document.createElement("li")

let box = document.createElement("input")
box.type = "checkbox"

let span = document.createElement("span")
span.textContent = text

let del = document.createElement("button")
del.textContent = "✖"
del.className = "delete"

box.onchange = ()=>{
span.classList.toggle("completed")
}

del.onclick = ()=>{
li.remove()
}

li.appendChild(box)
li.appendChild(span)
li.appendChild(del)

list.appendChild(li)

document.getElementById("todoText").value = ""

}

/* ---------------- PIP FLOATING WINDOW ---------------- */

let pipWindow = null

document.getElementById("pip").onclick = ()=>{

if(pipWindow && !pipWindow.closed){
pipWindow.close()
pipWindow = null
return
}

pipWindow = window.open("", "Timer", "width=220,height=160")

pipWindow.document.body.innerHTML = `
<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;font-family:sans-serif;background:#111;color:white;">
<div id="pipTime" style="font-size:32px;margin-bottom:10px;">${timeDisplay.textContent}</div>
<div>
<button onclick="window.opener.startTimer()">Start</button>
<button onclick="window.opener.pauseTimer()">Pause</button>
</div>
</div>
`

}

/* pause function for pip */

function pauseTimer(){
clearInterval(interval)
interval = null
}

window.startTimer = startTimer
window.pauseTimer = pauseTimer

/* update pip timer */

setInterval(()=>{

if(pipWindow && !pipWindow.closed){
pipWindow.document.getElementById("pipTime").innerText = timeDisplay.textContent
}

},500)

/* ---------------- INIT ---------------- */

updateTimer()
