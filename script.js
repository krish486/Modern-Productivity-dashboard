"use strict";



let timerInterval = null;
let timerState = {
  min: 25,
  sec: 0,
  totalSeconds: 25 * 60,
  remainingSeconds: 25 * 60,
  running: false,
};

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updateTimerUI() {
  const screen = document.querySelector(".progress-ring .inner span");
  const ring = document.querySelector(".progress-ring");

  if (!screen || !ring) return;

  screen.textContent = formatTime(timerState.remainingSeconds);

  const per =
    timerState.totalSeconds === 0
      ? 0
      : (timerState.remainingSeconds / timerState.totalSeconds) * 100;

  ring.style.background = `conic-gradient(#3b82f6 0% ${per}%, rgba(255, 255, 255, 0.08) 75% 100%)`;
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerState.running = false;

  const startbtn = document.querySelector(".play-btn");
  if (startbtn) startbtn.innerHTML = "▶";
}

function startTimer() {
  const startbtn = document.querySelector(".play-btn");
  if (!startbtn) return;

  clearInterval(timerInterval);
  timerState.running = true;
  startbtn.innerHTML = "❚❚";

  timerInterval = setInterval(() => {
    if (timerState.remainingSeconds <= 0) {
      stopTimer();
      timerState.remainingSeconds = 0;
      updateTimerUI();
      alert("⏰ Time's up!");
      return;
    }

    timerState.remainingSeconds--;
    updateTimerUI();
  }, 1000);
}

function timmer(min = 25, sec = 0) {
  timerState.min = Math.max(0, Number(min) || 0);
  timerState.sec = Math.max(0, Number(sec) || 0);

  timerState.totalSeconds = timerState.min * 60 + timerState.sec;

  if (timerState.totalSeconds <= 0) {
    timerState.totalSeconds = 25 * 60;
  }

  timerState.remainingSeconds = timerState.totalSeconds;

  stopTimer();
  updateTimerUI();
}


timmer();


const startbtn = document.querySelector(".play-btn");
const resetbtn = document.querySelector(".reset");

startbtn.addEventListener("click", () => {
  if (timerState.running) {
    stopTimer();
  } else {
    startTimer();
  }
});

resetbtn.addEventListener("click", () => {
  timmer(timerState.min, timerState.sec);
});


function varTimmer() {
  const settingTime = document.querySelector(".set");
  const setTime = document.querySelector(".setTime");
  const timeForm = document.querySelector(".setTime form");

  if (!settingTime || !setTime || !timeForm) return;

  settingTime.addEventListener("click", () => {
    setTime.style.display = "flex";
  });

  setTime.addEventListener("click", (elem) => {
    if (elem.target.classList.contains("setTime")) {
      setTime.style.display = "none";
    }
  });

  timeForm.addEventListener("submit", (elem) => {
    elem.preventDefault();

    const min = Number(elem.target[0].value);
    const sec = Number(elem.target[1].value);

    timmer(min, sec);

    setTime.style.display = "none";
    timeForm.reset();
  });
}
varTimmer();



let tasks_list = JSON.parse(localStorage.getItem("tasks_local")) || [];

let completedTask = tasks_list.filter((t) => t.completed).length;
let totalTask = tasks_list.length;

function updateCounts() {
  totalTask = tasks_list.length;
  completedTask = tasks_list.filter((t) => t.completed).length;
}

function taskStatus() {
  const totalTsk = document.querySelector(".status1 p");
  const completedTsk = document.querySelector(".status2 p");
  const removeTsk = document.querySelector(".status3 p");

  if (!totalTsk || !completedTsk || !removeTsk) return;

  totalTsk.textContent = totalTask;
  completedTsk.textContent = completedTask;
  removeTsk.textContent = totalTask - completedTask;
}

function progressRing() {
  const disk = document.querySelector(".status4 .circle");
  if (!disk) return;

  const per = totalTask === 0 ? 0 : (completedTask / totalTask) * 100;

  disk.textContent = `${Math.round(per)}%`;
  disk.style.background = `conic-gradient(#309fc8 0% ${per}%, transparent 0% 100%)`;
}

function renderTasks() {
  const addbtn = document.querySelector("#addTaskBtn");
  const task_input = document.querySelector(".task-input");
  const task_input_form = document.querySelector(".task-input form");
  const tasks = document.querySelector("#taskList");

  if (!addbtn || !task_input || !task_input_form || !tasks) return;

  function renderUI() {
    let que = "";

    tasks_list.forEach((elem, idx) => {
      que += `
        <div class="task ${elem.priority} ${elem.completed ? "complete" : ""}">
          <input type="checkbox" data-id="${idx}" ${elem.completed ? "checked" : ""}>
          <span>${elem.title}</span>
          <small>${elem.date}</small>
          <button data-id="${idx}">🗑</button>
        </div>`;
    });

    tasks.innerHTML = que;
  }

  renderUI();
  taskStatus();
  progressRing();

 
  tasks.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const index = Number(e.target.getAttribute("data-id"));

      tasks_list.splice(index, 1);
      localStorage.setItem("tasks_local", JSON.stringify(tasks_list));

      updateCounts();
      renderUI();
      taskStatus();
      progressRing();
    }
  });

  
  tasks.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
      const index = Number(e.target.getAttribute("data-id"));

      tasks_list[index].completed = e.target.checked;
      localStorage.setItem("tasks_local", JSON.stringify(tasks_list));

      updateCounts();
      renderUI();
      taskStatus();
      progressRing();
    }
  });

  
  addbtn.addEventListener("click", () => {
    task_input.style.display = "block";
  });

  
  task_input_form.addEventListener("submit", (elem) => {
    elem.preventDefault();

    const title = task_input_form[0].value.trim();
    const date = task_input_form[1].value.trim();
    const priority = task_input_form[2].value.trim();

    if (!title || !date || !priority) return;

    const task = {
      title,
      date,
      priority,
      completed: false,
    };

    tasks_list.push(task);
    localStorage.setItem("tasks_local", JSON.stringify(tasks_list));

    task_input_form.reset();
    task_input.style.display = "none";

    updateCounts();
    renderUI();
    taskStatus();
    progressRing();
  });
}

renderTasks();


window.addEventListener("resize", () => {
  taskStatus();
  progressRing();
  updateTimerUI();
});