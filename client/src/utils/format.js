export function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export function shortenDays(days) {
    var shortened = {
        "Monday": "M",
        "Tuesday": "Tu",
        "Wednesday": "W",
        "Thursday": "Th",
        "Friday": "F",
        "Saturday": "Sa",
        "Sunday": "Su"
    };
    var dayString = '';
    days.forEach(day => {
        if (day in shortened)
            dayString += shortened[day];
        else
            console.log("day " + day + " not found");
    });
    return dayString;
}

export function timeToString(time) {
    // invalid time, return empty string
    if (!time) return '';
    // parse time
    var hours = parseInt(time.substring(0, 2));
    var period = hours <= 12 ? 'AM' : 'PM';
    hours = (hours > 12) ? hours - 12 : hours;
    return hours + time.substring(2) + period;
}

export function arrayToString(array) {
    return array.join(', ');
}