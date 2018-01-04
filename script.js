"use strict";

const parseTimes = function (str) {
    str = str.toLowerCase().trim();
    if (str.startsWith("once")) {
        return 1;
    } else if (str.startsWith("twice")) {
        return 2;
    } else if (str.startsWith("thrice")) {
        return 3;
    }
    return parseFloat(str);
};

const toSeconds = function (unit) {
    unit = unit.toLowerCase().trim();
    if (unit.startsWith("sec")) {
        return 1.0;
    } else if (unit.startsWith("min")) {
        return 60.0;
    } else if (unit.startsWith("hour") || unit.startsWith("hr")) {
        return 3600.0;
    } else if (unit.startsWith("day")) {
        return 24 * 3600.0;
    } else if (unit.startsWith("week") || unit.startsWith("wk")) {
        return 7 * 24 * 3600.0;
    } else if (unit.startsWith("mon")) {
        return 30 * 24 * 3600.0;
    } else if (unit.startsWith("year") || unit.startsWith("yr")) {
        return 365 * 24 * 3600.0;
    }
    return -1;
};

const parseDuration = function (str) {
    str = str.toLowerCase().trim();
    var arr = str.split(" ").filter(e => e.length > 0);
    if (arr.length == 1) {
        return toSeconds(arr[0]);
    } else if (arr.length == 2) {
        return toSeconds(arr[1]) * parseFloat(arr[0]);
    }
    return -1;
};

const timeAllowed = function (timesPerDay, secondsShaved, savingPeriodInDays) {
    var timeSavedPerDay = timesPerDay * secondsShaved;
    return timeSavedPerDay * savingPeriodInDays;
};

const approxQty = function (number, unit) {
    if (isNaN(number)) {
        return null;
    }
    number = Math.round(number);
    return number + " " + unit + (number != 1 ? "s" : "");
};

const secondsToHumanReadable = function (seconds) {
    if (seconds < 0) {
        return null;
    }
    
    var minutes = seconds / 60.0;
    var hours = minutes / 60.0;
    var days = hours / 24.0;
    var weeks = days / 7.0;
    var months = days / 30.0;
    var years = days / 365.0;

    if (seconds < 60 || minutes < 1) {
        return approxQty(seconds, "second");
    } else if (minutes < 60 || hours < 1) {
        return approxQty(minutes, "minute");
    } else if (hours < 24 || days < 1) {
        return approxQty(hours, "hour");
    } else if (days < 30 || months < 1) {
        var approxDays = Math.round(days);
        var approxWeeks = Math.round(weeks);
        if (approxWeeks > 0 && Math.abs(days - approxWeeks * 7) <= 2) {
            return approxQty(weeks, "week");
        }
        return approxQty(days, "day");
    } else if (months < 12 || years < 1) {
        return approxQty(months, "month");
    } else {
        return approxQty(years, "year");
    }
};

var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {

    $scope.frequency = "once/week";
    $scope.timeSaved = "1 hour";
    $scope.savingDuration = "5 years";

    $scope.compute = function (frequency, timeSaved, savingDuration) {
        var times = frequency.split("/")[0].trim();
        var duration = frequency.split("/")[1].trim();
        var timesPerDay = (parseTimes(times) * 24 * 3600.0) / parseDuration(duration);
        var secondsShaved = parseDuration(timeSaved);
        var savingPeriodInDays = parseDuration(savingDuration) / (24 * 3600.0);
        return secondsToHumanReadable(timeAllowed(timesPerDay, secondsShaved, savingPeriodInDays));
    };
});