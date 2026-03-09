let focusTime = 1500
let breakTime = 300

let time = focusTime
let interval = null
let mode = "focus"

const bell = new Audio("bell.mp3")

const timeDisplay = document.getElementById("time")
const circle = document.querySelector(".progress-ring-circle")

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

if(time <= 0){

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

let f = document.getElementById("focusInput").value
let b = document.getElementById("breakInput").value

if(f>0) focusTime = f*60
if(b>0) breakTime = b*60

mode="focus"
time=focusTime
updateTimer()

}

document.getElementById("mode").onclick = ()=>{
document.body.classList.toggle("dark")
}

updateTimer()

/* TODO LIST */

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
box.type="checkbox"

let span = document.createElement("span")
span.textContent=text

box.onchange=()=>{
span.classList.toggle("completed")
saveTodos()
}

li.appendChild(box)
li.appendChild(span)

list.appendChild(li)

document.getElementById("todoText").value=""

saveTodos()

}

/* SAVE TODOS */

function saveTodos(){

let todos=[]

document.querySelectorAll("#todoList li").forEach(li=>{
todos.push({
text:li.children[1].textContent,
done:li.children[0].checked
})
})

localStorage.setItem("todos",JSON.stringify(todos))

}

/* LOAD TODOS */

function loadTodos(){

let todos=JSON.parse(localStorage.getItem("todos"))||[]

todos.forEach(t=>{

let li=document.createElement("li")

let box=document.createElement("input")
box.type="checkbox"
box.checked=t.done

let span=document.createElement("span")
span.textContent=t.text

if(t.done) span.classList.add("completed")

box.onchange=()=>{
span.classList.toggle("completed")
saveTodos()
}

li.appendChild(box)
li.appendChild(span)

list.appendChild(li)

})

}

loadTodos()

/* SERVICE WORKER */

if("serviceWorker" in navigator){
navigator.serviceWorker.register("sw.js")
}
