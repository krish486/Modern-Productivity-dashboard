function timmer(min = 25, sec = 0) {

    let screen = document.querySelector(".progress-ring .inner span");
    let startbtn = document.querySelector(".play-btn");
    let resetbtn = document.querySelector(".reset");
    let ring = document.querySelector(".progress-ring");

    let totalSeconds = (min * 60) + sec;
    let total = totalSeconds;

    let flag = 0;
    let interval;

    function flagCheck() {
        if (flag === 0) {
            timmerOn();
            startbtn.innerHTML = "❚❚";
        } else {
            clearInterval(interval);
            startbtn.innerHTML = "▶";
        }
    }

    function timeUi() {
        let m = Math.floor(totalSeconds / 60);
        let s = totalSeconds % 60;

        screen.innerHTML = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    function timmerOn() {
        clearInterval(interval);

        interval = setInterval(function () {
            totalSeconds--;

            let per = (totalSeconds / total) * 100;

            ring.style.background = `conic-gradient(#3b82f6 0% ${per}%,
            rgba(255, 255, 255, 0.08) 75% 100%)`;

            timeUi();

            if (totalSeconds <= 0) {
                clearInterval(interval);
            }
        }, 1000);
    }

    startbtn.onclick = () => {
        flag = flag === 0 ? 1 : 0;
        flagCheck();
    };

    resetbtn.onclick = () => {
        flag = 1;
        totalSeconds = (min * 60) + sec;
        total = totalSeconds;
        timeUi();
        flagCheck();
        ring.style.background = `conic-gradient(#3b82f6 0% 100%,
            rgba(255, 255, 255, 0.08) 75% 100%)`;
    };

    timeUi();
}
timmer();


function varTimmer() {
    let settingTime = document.querySelector(".set")
    let setTime = document.querySelector(".setTime")
    let timeForm = document.querySelector(".setTime form")

    settingTime.addEventListener("click", () => {
        setTime.style.display = "flex";
    })

    setTime.addEventListener("click", (elem) => {
        if (elem.target.classList.contains("setTime")) {
            setTime.style.display = "none";
        }
    })

    timeForm.addEventListener("submit", (elem) => {
        elem.preventDefault();
        let min = Number(elem.target[0].value)
        let sec = Number(elem.target[1].value)
        timmer(min, sec)
        setTime.style.display = "none";
    })
}
varTimmer();


let tasks_list = JSON.parse(localStorage.getItem("tasks_local")) || []
let completedTask = tasks_list.filter(t => t.completed).length;
let totalTask = tasks_list.length;


function renderTasks() {
    let addbtn = document.querySelector("#addTaskBtn")
    let task_input = document.querySelector(".task-input")
    let task_input_form = document.querySelector(".task-input form")
    let tasks = document.querySelector("#taskList")

    function updateCounts() {
        totalTask = tasks_list.length;
        completedTask = tasks_list.filter(t => t.completed).length;
    }

    function renderUI() {
        let que = ``

        tasks_list.forEach(function (elem, idx) {
            que += `
            <div class="task ${elem.priority} ${elem.completed ? "complete" : ""}">
                <input type="checkbox" data-id="${idx}" ${elem.completed ? "checked" : ""}>
                <span>${elem.title}</span>
                <small>${elem.date}</small>
                <button data-id="${idx}">🗑</button>
            </div>`
        })

        tasks.innerHTML = que
    }

    renderUI();
    taskStatus();
    progressRing();

    tasks.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            let index = e.target.getAttribute("data-id")

            tasks_list.splice(index, 1)

            localStorage.setItem("tasks_local", JSON.stringify(tasks_list))

            updateCounts();
            renderUI();
            taskStatus();
            progressRing();
        }
    })

    tasks.addEventListener("change", function (e) {
        if (e.target.type === "checkbox") {
            let index = e.target.getAttribute("data-id")

            tasks_list[index].completed = e.target.checked

            localStorage.setItem("tasks_local", JSON.stringify(tasks_list))

            updateCounts();
            renderUI();
            taskStatus();
            progressRing();
        }
    })

    addbtn.addEventListener("click", () => {
        task_input.style.display = "block"
    })

    task_input_form.addEventListener("submit", (elem) => {
        elem.preventDefault();

        if (task_input_form[0].value.trim() === "") return;
        if (task_input_form[1].value.trim() === "") return;
        if (task_input_form[2].value.trim() === "") return;

        let task = {
            title: task_input_form[0].value,
            date: task_input_form[1].value,
            priority: task_input_form[2].value,
            completed: false,
        }

        tasks_list.push(task);

        localStorage.setItem("tasks_local", JSON.stringify(tasks_list))

        task_input_form.reset();

        updateCounts();
        renderUI();
        taskStatus();
        progressRing();
    })
}

renderTasks();


function taskStatus() {
    let totalTsk = document.querySelector(".status1 p")
    let completedTsk = document.querySelector(".status2 p")
    let removeTsk = document.querySelector(".status3 p")

    totalTsk.innerHTML = totalTask;
    completedTsk.innerHTML = completedTask;
    removeTsk.innerHTML = totalTask - completedTask;
}

function progressRing() {
    let disk = document.querySelector(".status4 .circle")
    per = totalTask === 0 ? 0 : (completedTask / totalTask) * 100 
    disk.innerHTML = Math.round(per)+"%"
    disk.style.background = `conic-gradient(#309fc8 0% ${per}%,
            transparent 0% 100%)`;
}