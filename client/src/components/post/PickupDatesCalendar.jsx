import { useState, useEffect } from "react";
import { Typography, Box, Stack } from "@mui/material";
import Calendar from "react-calendar";
import "./Calendar.css";
//import "react-calendar/dist/Calendar.css";

const PickupDatesCalendar = ({ post }) => {
    const [calendarDate, setCalendarDate] = useState({});

    const findDate = (calDate, dates) => {
        return dates.find((date) => {
            //console.log(date.from);
            const from = new Date(date.from).setHours(0, 0, 0, 0);
            const until = new Date(date.until).setHours(0, 0, 0, 0);
            const pickedDate = new Date(calDate).setHours(0, 0, 0, 0);
            // console.log("picked up", pickedDate);
            // console.log("from", from);
            // console.log("to", until);
            // console.log(date);

            return from <= pickedDate && pickedDate <= until;
        });
    };

    function isDateInRange(date, dateFrom, dateTo) {
        return date >= dateFrom && date <= dateTo;
    }

    const tileClassName = ({ date, view }) => {
        const dates = post.pickUpDates;
        return view === "month" && // Block day tiles only
            dates.some((pickUpDate) => {
                return isDateInRange(
                    date,
                    new Date(pickUpDate.from).setHours(0, 0, 0, 0),
                    new Date(pickUpDate.until)
                );
            })
            ? "active-date"
            : null;
    };

    const tileDisabled = ({ date, view }) => {
        const dates = post.pickUpDates;
        return (
            view === "month" && // Block day tiles only
            dates.some((pickUpDate) => {
                return !isDateInRange(
                    date,
                    new Date(pickUpDate.from).setHours(0, 0, 0, 0),
                    new Date(pickUpDate.until)
                );
            })
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString().split(",")[0];
    }

    const formatDateToTime = (date) => {
        const hour = new Date(date).getHours();
        const minutes = new Date(date).getMinutes();
        return hour + ':' + minutes;
    }

    return (
        <>
            <Calendar
                tileClassName={tileClassName}
                tileDisabled={tileDisabled}
                onClickDay={(value, event) => {
                    const date = findDate(value, post.pickUpDates);
                    //console.log(new Date(date.from).getHours());
                    setCalendarDate({ ...date, current: value, isRepeated: true });
                }}
            />
            <Box marginTop="5px" marginBottom="5px" sx={{ textAlign: "center", visibility: !calendarDate.current ? "hidden" : "visible" }}>
                <Typography variant="h5">{formatDate(calendarDate.current)}</Typography>
                <Typography><b>From: </b> {formatDateToTime(calendarDate.from)}</Typography>
                <Typography><b>Until: </b>
                    {!calendarDate.isRepeated &&
                        new Date(calendarDate.until).setHours(0, 0, 0, 0) === new Date(calendarDate.current).setHours(0, 0, 0, 0) ?
                        formatDateToTime(calendarDate.until) :
                        calendarDate.isRepeated ?
                            formatDateToTime(calendarDate.until) :
                            "End Of Day"}
                </Typography>
            </Box>

        </>
    );
}

export default PickupDatesCalendar;