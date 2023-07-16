// variables
const bodyElements = {
    liveTime: document.querySelector('.main-time'),
    hourInput: document.querySelector('#hour'),
    minutesInput: document.querySelector('#minutes'),
    datePicker: document.querySelector('#date'),
    add: document.querySelector('.add-reminder'),
    reminderNote: document.querySelector('#reminderNote'),
    remindSuccess: document.querySelector('.reminder-success'),
    hourErr: document.querySelector('.hour-err'),
    minutesErr: document.querySelector('.mins-err'),
    dateErr: document.querySelector('.date-err'),
    noteErr: document.querySelector('.note-err'),
    dayNight: document.querySelector('#day-night'),
    remindersArr: [],
    getDate: new Date()
}
// -------------------------------------------------------------------
// EVENT LISTENERS
// on page load
document.addEventListener('DOMContentLoaded', function () {
    setMinDate()
    createOptions(13, 60)
    getCurrentTime()
    checkPastTime()
})
// on input in HH
bodyElements.hourInput.addEventListener('input', function () {
    checkVal(bodyElements.hourInput, 12, bodyElements.hourErr, 'HH')
})
// on input in minutes
bodyElements.minutesInput.addEventListener('input', function () {
    checkVal(bodyElements.minutesInput, 59, bodyElements.minutesErr, 'MM')
})
// on click on add
bodyElements.add.addEventListener('click', function () {
    getAllValues()
})
// on input in date
bodyElements.datePicker.addEventListener('focusout', function () {
    checkDateValidity()
    checkPastTime()
})
// -------------------------------------------------------------------
// FUNCTIONS
// live time
function updateCurrTime() {
    let currentTime = new Date().toLocaleTimeString();
    bodyElements.liveTime.innerHTML = currentTime
    return currentTime
}
setInterval(updateCurrTime, 1000);

// check hours validity
function checkVal(input, max, error, timeHand) {
    if (input.value == '') {
        error.style.visibility = 'visible'
        error.innerHTML = `${timeHand} cannot be empty`
    } else if (input.value > max) {
        error.style.visibility = 'visible'
        error.innerHTML = `${timeHand} cannot be more than ${max}`

        setTimeout(() => {
            error.style.visibility = 'hidden'
        }, 5000);

        input.value = ''
    } else if (input.value.length > 2) {
        error.style.visibility = 'visible'
        error.innerHTML = `${timeHand} cannot be more than ${max}`
    } else {
        // console.log('value is valid')
        error.style.visibility = 'hidden'
        return (input.value)
    }
}

function visible(error){
    error.style.visibility = 'visible'
}
function hidden(error){
    error.style.visibility = 'hidden'
}
// check date and time validity
function checkEmpty(input1, input2, error1, error2) {
    if (input1.value == '' && input2.value == '') {
        visibility(error1)
        visibility(error2)
    } else if (input1.value == '') {
        visible(error1)
        hidden(error2)
    } else if (input2.value == '') {
        visible(error2)
        hidden(error1)
    } else {
        hidden(error1)
        hidden(error2)
        let dateVal = input1.value
        let noteVal = input2.value
        // usually functions can return only 1 value
        // if we want to return multiple values then we can use array. return as array and use as array
        return [dateVal, noteVal]
    }
}
// get selected am/pm value
function checkTimeUnit() {
    let unitValue = bodyElements.dayNight.value
    // console.log(unitValue)
    return unitValue
}
checkTimeUnit()
// check all on add
function getAllValues() {
    const finalVal = {
        hour: checkVal(bodyElements.hourInput, 12, bodyElements.hourErr, 'HH'),
        mins: checkVal(bodyElements.minutesInput, 59, bodyElements.minutesErr, 'MM'),
        timeUnit: checkTimeUnit(),
        dateNote: checkEmpty(bodyElements.datePicker, bodyElements.reminderNote, bodyElements.dateErr, bodyElements.noteErr)
    }


    if (finalVal.hour !== undefined && finalVal.mins !== undefined && finalVal.dateNote !== undefined) {

        bodyElements.remindSuccess.innerHTML = `Your reminder is set for <span class="summ-date">${finalVal.dateNote[0]}</span> at <span class="summ-time">${finalVal.hour}: ${finalVal.mins} ${finalVal.timeUnit}</span> with a note saying <span class="summ-note">${finalVal.dateNote[1]}</span>`
        bodyElements.remindSuccess.classList.add('fadeIn')

        setTimeout(() => {
            bodyElements.remindSuccess.classList.remove('fadeIn')
        }, 8000);

        const reminderObj = {
            date: finalVal.dateNote[0],
            time: `${finalVal.hour}:${finalVal.mins}${finalVal.timeUnit}`,
            // mins: finalVal.mins,
            note: finalVal.dateNote[1]
        }

        bodyElements.remindersArr.push(reminderObj)
        // console.log(bodyElements.remindersArr)

        let localLen = localStorage.length
        localStorage.setItem("reminders", JSON.stringify(bodyElements.remindersArr))

        /* if(localStorage.length <= bodyElements.reminderCount){
         bodyElements.reminderCount +=1
         // localStorage.setItem(reminderCount, JSON.stringify(reminderObj))
        }
        else{
         localStorage.setItem(bodyElements.reminderCount, JSON.stringify(reminderObj))
        } */
    } else {
        // console.log('you missed some fields')
    }
    // checkMinsVal(bodyElements.minutesInput, 59, bodyElements.minutesErr)
    // console.log(new Date(bodyElements.datePicker.value).toLocaleDateString())
}
// get today date and add to input date min attribute
function setMinDate() {
    let today = new Date()
    let todayDate = new String(today.getDate())
    let currentMonth = new String(today.getMonth() + 1)
    let currentYear = new String(today.getFullYear())

    if (todayDate.length < 2) {
        todayDate = `0${todayDate}`
    }
    if (currentMonth.length < 2) {
        currentMonth = `0${currentMonth}`
    }

    let currentDate = new String(`${currentYear}-${currentMonth}-${todayDate}`)
    bodyElements.datePicker.disabled = false;
    bodyElements.datePicker.setAttribute('min', currentDate)
    bodyElements.datePicker.value = currentDate
}
// get current time
function getCurrentTime() {
    let currentLiveTime = new Date().toLocaleTimeString()

    let currentLiveHours = currentLiveTime.split(":", 2)[0]
    bodyElements.hourInput.value =  `0${+currentLiveHours}`

    let currentLiveMinutes = currentLiveTime.split(":", 2)[1]
    bodyElements.minutesInput.value = currentLiveMinutes

    let secondsTimeUnit = currentLiveTime.split(':')[2]
    let getSplitTimeUnit = secondsTimeUnit.substring(3, 6)

    let timeUnitOpts = (bodyElements.dayNight).options;
    Array.from(timeUnitOpts).forEach((option) => {
        if (option.value == getSplitTimeUnit) {
            option.setAttribute('selected', 'true')
        } else {
            return false
        }
    })
}
// create options for select element
function createOptions(hours, minutes) {
    for (let i = 1; i < hours; i++) {
        var leadingZeroHours = (i < 10 ? "0" : "") + i
        bodyElements.hourInput.options[(bodyElements.hourInput.options).length] = new Option(leadingZeroHours, leadingZeroHours);
    }
    for (let j = 0; j < minutes; j++) {
        var leadingZeroMins = (j < 10 ? "0" : "") + j
        bodyElements.minutesInput.options[(bodyElements.minutesInput.options).length] = new Option(leadingZeroMins, leadingZeroMins);
    }
}
// check if year is less than current
function showYearError() {
    bodyElements.datePicker.value = ''
    bodyElements.dateErr.innerHTML = 'Please input a valid date'
    bodyElements.dateErr.style.visibility = 'visible'
    setTimeout(() => {
        bodyElements.dateErr.style.visibility = 'hidden'
    }, 3000);
}
// check if year is greater than current year
function removeError() {
    bodyElements.dateErr.style.visibility = 'hidden'
}
// check if date valid
function checkDateValidity() {
    let currentDate = +new Date().getFullYear()
    let inputDate = bodyElements.datePicker.value
    let inputYear = inputDate.split('-')[0]
    if (+inputYear < currentDate || inputYear.length > 4) {
        showYearError()
    } else if (inputYear.length > 4) {
        showYearError()
    } else {
        removeError()
    }
}
// check reminder time in local and check if match
function matchReminderTime(){
    let reminders = JSON.parse(localStorage.getItem("reminders"))
    // console.log(reminders, 'reminders array from local storage')
    let currentDay = `0${bodyElements.getDate.getDate()}`
    let currentMonth = `0${bodyElements.getDate.getMonth() + 1}`
    let currentYear = `${bodyElements.getDate.getFullYear()}`
    let matchDate = `${currentYear}-${currentMonth}-${currentDay}`
    let currentTime = new Date().toLocaleTimeString()
    let splitCurrTime = currentTime.split("")
    let finalCurrTime = `0${splitCurrTime[0]}:${splitCurrTime[2]}${splitCurrTime[3]}${splitCurrTime[8]}${splitCurrTime[9]}`

    if(reminders){
        reminders.forEach(reminder => {
            if(reminder.time == finalCurrTime && reminder.date == matchDate){
                bodyElements.remindSuccess.innerHTML = `It's time to <b>${reminder.note}.</b>`
                bodyElements.remindSuccess.classList.add('fadeIn')
    
                setTimeout(() => {
                    bodyElements.remindSuccess.classList.remove('fadeIn')
                }, 60000);
            }
        });
    }

}
setInterval(() => {
    matchReminderTime()
}, 1000);

// check past time
function checkPastTime(){
    let currentTimeHourIndex = bodyElements.hourInput.selectedIndex
    let allOpts = (bodyElements.hourInput).options
    console.log(allOpts);
    Array.from(allOpts).forEach((option) => {
        if(option.index < currentTimeHourIndex){
            
            option.style.display = 'none'
        }
        else{
            option.style.display = 'block'
        }  
    })
    let currentTimeUnit = bodyElements.dayNight.options[bodyElements.dayNight.selectedIndex].value
    let inputDate = bodyElements.datePicker.value
    // console.log(inputDate);
    let currentDay = `0${bodyElements.getDate.getDate()}`
    let currentMonth = `0${bodyElements.getDate.getMonth() + 1}`
    let currentYear = `${bodyElements.getDate.getFullYear()}`
    let matchDate = `${currentYear}-${currentMonth}-${currentDay}`
    if(inputDate == matchDate && currentTimeUnit == 'PM'){
        bodyElements.dayNight.options[0].style.display = 'none'
    }
    else{
        bodyElements.dayNight.options[0].style.display = 'block'
    }
}