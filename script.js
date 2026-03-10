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
circle.style.strokeDashoffset = circumference - percent * circumference
}

function updateTimer(){

let minutes = Math.floor(time/60)
let seconds = time % 60

timeDisplay.textContent =
`${minutes}:${seconds.toString().padStart(2,"0")}`

let total = mode === "focus" ? focusTime : breakTime
setProgress(1 - time/total)

}

/* TIMER */

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

let li=document.createElement("li")

let box=document.createElement("input")
box.type="checkbox"

let span=document.createElement("span")
span.textContent=text

let del=document.createElement("button")
del.textContent="✖"
del.className="delete"

box.onchange=()=>{
span.classList.toggle("completed")
}

del.onclick=()=>{
li.remove()
}

li.appendChild(box)
li.appendChild(span)
li.appendChild(del)

list.appendChild(li)

document.getElementById("todoText").value=""

}

/* FLOATING TIMER WITH CONTROLS */

let pipWindow = null

document.getElementById("pip").onclick = () => {

if(pipWindow && !pipWindow.closed){
pipWindow.close()
pipWindow = null
return
}

pipWindow = window.open(
"",
"Timer",
"width=220,height=160"
)

const doc = pipWindow.document

doc.body.style.margin="0"
doc.body.style.display="flex"
doc.body.style.flexDirection="column"
doc.body.style.alignItems="center"
doc.body.style.justifyContent="center"
doc.body.style.fontFamily="sans-serif"
doc.body.style.background="#111"
doc.body.style.color="#fff"

/* TIMER TEXT */

const timerText = doc.createElement("div")
timerText.style.fontSize="32px"
timerText.style.marginBottom="10px"
timerText.innerText = timeDisplay.textContent

doc.body.appendChild(timerText)

/* BUTTON CONTAINER */

const controls = doc.createElement("div")
controls.style.display="flex"
controls.style.gap="10px"

doc.body.appendChild(controls)

/* START BUTTON */

const startBtn = doc.createElement("button")
startBtn.innerText = "Start"

startBtn.onclick = () => {
startTimer()
}

controls.appendChild(startBtn)

/* PAUSE BUTTON */

const pauseBtn = doc.createElement("button")
pauseBtn.innerText = "Pause"

pauseBtn.onclick = () => {
clearInterval(interval)
interval = null
}

controls.appendChild(pauseBtn)

/* UPDATE TIMER DISPLAY */

setInterval(()=>{

if(pipWindow && !pipWindow.closed){
timerText.innerText = timeDisplay.textContent
}

},500)

}

/* SERVICE WORKER */

if("serviceWorker" in navigator){
navigator.serviceWorker.register("sw.js")
}

