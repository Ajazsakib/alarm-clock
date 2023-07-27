var globalCurrentTime;
// Digital Clock Function
function digitalClock() {
  var currentTime = new Date();
  var hours = currentTime.getHours();
  var mins = currentTime.getMinutes();
  var sec = currentTime.getSeconds();
  var twelveHourFormat = hours % 12 || 12;
  var ampm = hours >= 12 ? "PM" : "AM";

  twelveHourFormat =
    twelveHourFormat >= 10 ? twelveHourFormat : "0" + twelveHourFormat;
  mins = mins >= 10 ? mins : "0" + mins;
  sec = sec >= 10 ? sec : "0" + sec;

  document.getElementById(
    "show-current-time"
  ).innerHTML = `${twelveHourFormat}:${mins}:${sec} ${ampm}`;

  globalCurrentTime = `${twelveHourFormat}:${mins}:${sec} ${ampm}`;

  triggerAlarm();
}

// Initial call function to show the time when page loads
digitalClock();

// call the function every second
setInterval(digitalClock, 1000);

// catch the input element for entering time

var hour = document.getElementById("hour");
var minutes = document.getElementById("minutes");
var seconds = document.getElementById("seconds");
var ampm = document.getElementById("ampm");
var setAlarmButton = document.getElementById("set-alarm");

// Restrict the user that they can only enter numeric value in input field
function restrictUser(e, callback) {
  var inputVal = e.target.value;

  var integerRegex = /^[+-]?\d+$/;

  if (!integerRegex.test(inputVal)) {
    e.target.value = inputVal.slice(0, -1);
  }

  //   if (inputVal.length >= 2) {
  //     e.preventDefault();
  //     minutes.focus();
  //   }
  callback(inputVal);
}

hour.addEventListener("input", function (e) {
  restrictUser(e, function (inputVal) {
    if (inputVal.length >= 2) {
      e.preventDefault();
      minutes.focus();
    }
  });
});
minutes.addEventListener("input", function (e) {
  restrictUser(e, function (inputVal) {
    if (inputVal.length >= 2) {
      e.preventDefault();
      seconds.focus();
    }
  });
});
seconds.addEventListener("input", function (e) {
  restrictUser(e, function (inputVal) {
    if (inputVal.length >= 2) {
      e.preventDefault();
      ampm.focus();
    }
  });
});

// Validation for alarm field

var alarmList = [];
var alarm;
setAlarmButton.addEventListener("click", function () {
  if (hour.value === "" || minutes.value === "" || seconds.value === "") {
    alert("All the fields are required");
  }
  // alarm = {
  //   hour: hour.value,
  //   minutes: minutes.value,
  //   seconds: seconds.value,
  //   ampm: ampm.value,
  // };
  alarm = `${hour.value}:${minutes.value}:${seconds.value} ${ampm.value}`;

  alarmList.push(alarm);

  hour.value = "";
  minutes.value = "";
  seconds.value = "";
  createAndAppendAlarm();
});

// Render alarm

function createAndAppendAlarm() {
  // craete parent alarm div
  var alarmListDiv = document.createElement("div");
  alarmListDiv.setAttribute("class", "alarm-list");

  var showAlarmTimeDiv = document.createElement("div");

  showAlarmTimeDiv.setAttribute("class", "show-alarm-time");
  showAlarmTimeDiv.setAttribute("id", "show-alarm-time");

  var h4 = document.createElement("h4");
  h4.setAttribute("class", "alarm-heading");
  h4.textContent = alarm;

  showAlarmTimeDiv.appendChild(h4);
  alarmListDiv.appendChild(showAlarmTimeDiv);

  var deleteBtnDiv = document.createElement("div");
  deleteBtnDiv.setAttribute("class", "delete-button");
  deleteBtnDiv.setAttribute("id", "delete-button");

  var deleteButton = document.createElement("button");

  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("class", "btn btn-delete-alarm");

  deleteBtnDiv.appendChild(deleteButton);

  alarmListDiv.appendChild(deleteBtnDiv);

  document.getElementById("parentAlarm").appendChild(alarmListDiv);

  // select all delete button to delete the alarm
  deleteButton.addEventListener("click", deleteAlarm);
}

// convert the time into seconds

function convertTimeIntoSecond(timeString) {
  var timeComponents = timeString.split(":");
  var hour = parseInt(timeComponents[0]);
  var minute = parseInt(timeComponents[1]);
  var second = parseInt(timeComponents[2].split(" ")[0]);
  var period = timeComponents[2].split(" ")[1].toUpperCase();

  // Convert hour, minute, and second to seconds
  var totalSeconds = hour * 3600 + minute * 60 + second;

  // Adjust for AM/PM
  if (period === "PM" && hour !== 12) {
    totalSeconds += 12 * 3600;
  } else if (period === "AM" && hour === 12) {
    totalSeconds -= 12 * 3600;
  }

  return totalSeconds;
}

// Trigger Alarm

function triggerAlarm() {
  if (alarmList) {
    for (var i = 0; i < alarmList.length; i++) {
      let alarmTime = convertTimeIntoSecond(alarmList[i]);
      let currentTime = convertTimeIntoSecond(globalCurrentTime);

      if (alarmTime >= currentTime) {
        let timeDifference = alarmTime - currentTime;

        if (timeDifference === 0) {
          alert(alarmList[i] + "!!!!!!!!!!!!!!!!!!");
          // remove alarm from the alarm list invoke
          removeAlarm(alarmList[i]);
          alarmList.splice(i, 1);
        }
      }
    }
  }
}

// remove alarm from alarm list function declaration
function removeAlarm(alarmValue) {
  var parentElement = document.getElementById("parentAlarm");
  var alarms = document.querySelectorAll(".alarm-list");

  for (var i = 0; i < alarms.length; i++) {
    var alarmsHeading = alarms[i].querySelector("h4").textContent;
    if (alarmsHeading == alarmValue) {
      parentElement.removeChild(alarms[i]);
    }
  }
}

// delete alarm on clicking the delete button
// var deleteButton = document.querySelectorAll(".btn-delete-alarm");
// console.log(deleteButton);
// for (var i = 0; i < deleteButton.length; i++) {
//   deleteButton[i].addEventListener("click", deleteAlarm(this));
// }

function deleteAlarm(event) {
  console.log(event.target.parentElement.parentElement);
  var alarmToRemove = event.target.parentElement.parentElement;
  var parentAlarm = document.getElementById("parentAlarm");

  parentAlarm.removeChild(alarmToRemove);
}
