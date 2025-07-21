"use client";

import { bookingSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

//Added helper function
function formatTimeSlot(slot) {
    // Assuming slot is already in "HH:mm" format in CST
    return slot; // No conversion needed if availability provides CST times
  }

  function toShanghaiDate(date) {
    const offsetMilliseconds = 8 * 60 * 60 * 1000; // +8 hours in ms
    return new Date(date.getTime() + offsetMilliseconds);
  }
  
  function formatDateToShanghai(date) {
    const shanghaiDate = toShanghaiDate(date);
    return shanghaiDate.toISOString().slice(0, 10); // 'yyyy-MM-dd'
  }
  
//Added helper function
  
const BookingForm = ({event, availability}) => {
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const {register, handleSubmit, formState: {errors},} = useForm({
        resolver: zodResolver(bookingSchema),
    });
    
    /*const availableDays = availability.map((day) => new Date(day.date));
   
   const timeSlots = selectedDate
        ? availability.find(
            (day) => day.date === format(selectedDate, "yyyy-MM-dd")
        )?.slots || []
        : [];*/
        const availableDays = availability.map((day) =>
            new Date(day.date + "T00:00:00")
          );
          
          const timeSlots = selectedDate
            ? availability.find(
                (day) => day.date === formatDateToShanghai(selectedDate)
              )?.slots || []
            : [];
          

    return (
        <div className = "flex flex-col gap-8 p-10 border bg-white"> 
            <div className = "md: h-96 flex flex-col md: flex-row gap-5">
                <div>
                    <DayPicker 
                    mode = "single"
                    selected = {selectedDate}
                    onSelect = {(date) => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                    }}
                    disabled = {[{ before: new Date() }]}
                    modifiers = {{
                        available: availableDays,
                    }}
                    modifiersStyles = {{
                        available: {
                            background: "#ffe5e5",
                            borderRadius: 100,
                        },
                    }}
                    />
                </div>
                    <div className = "w-full h-full md: overflow-scroll no-scrollbar">
                        {selectedDate && (
                            <div className = "mb-4">
                                <h3 className = "text-lg font-semibold mb-2">
                                    可用时段
                                </h3>
                                <div className = "grid grid-cols-2 lg: grid-cols-3 gap-2">
                                {timeSlots.map((slot) => (
                                <Button
                                    key={slot}
                                    onClick={() => setSelectedTime(slot)}
                                    variant={selectedTime === slot ? "default" : "outline"}
                                >
                                    {slot}
                                </Button>
                                ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            <div>

            </div>
    </div>
    );
};

export default BookingForm;

/*

"use client";

import { bookingSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

//Added helper function
function convertUtcTimeToCstString(utcTimeStr) {
    const [hours, minutes] = utcTimeStr.split(":").map(Number);
    const utcDate = new Date(Date.UTC(1970, 0, 1, hours, minutes));
    utcDate.setUTCHours(utcDate.getUTCHours() + 8); 
    return utcDate.toISOString().slice(11, 16); 
  }

  function toShanghaiDate(date) {
    const offsetMilliseconds = 8 * 60 * 60 * 1000; // +8 hours in ms
    return new Date(date.getTime() + offsetMilliseconds);
  }
  
  function formatDateToShanghai(date) {
    const shanghaiDate = toShanghaiDate(date);
    return shanghaiDate.toISOString().slice(0, 10); // 'yyyy-MM-dd'
  }
  
//Added helper function
  
const BookingForm = ({event, availability}) => {
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const {register, handleSubmit, formState: {errors},} = useForm({
        resolver: zodResolver(bookingSchema),
    });
    
    //const availableDays = availability.map((day) => new Date(day.date));
   
   //const timeSlots = selectedDate
        //? availability.find(
          //  (day) => day.date === format(selectedDate, "yyyy-MM-dd")
 //       )?.slots || []
      //  : [];
        const availableDays = availability.map((day) =>
            new Date(day.date + "T00:00:00")
          );
          
          const timeSlots = selectedDate
            ? availability.find(
                (day) => day.date === formatDateToShanghai(selectedDate)
              )?.slots || []
            : [];
          

    return (
        <div className = "flex flex-col gap-8 p-10 border bg-white"> 
            <div className = "md: h-96 flex flex-col md: flex-row gap-5">
                <div>
                    <DayPicker 
                    mode = "single"
                    selected = {selectedDate}
                    onSelect = {(date) => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                    }}
                    disabled = {[{ before: new Date() }]}
                    modifiers = {{
                        available: availableDays,
                    }}
                    modifiersStyles = {{
                        available: {
                            background: "#ffe5e5",
                            borderRadius: 100,
                        },
                    }}
                    />
                </div>
                    <div className = "w-full h-full md: overflow-scroll no-scrollbar">
                        {selectedDate && (
                            <div className = "mb-4">
                                <h3 className = "text-lg font-semibold mb-2">
                                    可用时段
                                </h3>
                                <div className = "grid grid-cols-2 lg: grid-cols-3 gap-2">
                                {timeSlots.map((slot) => {
                                    const cstSlot = convertUtcTimeToCstString(slot);
                                    return (
                                        <Button
                                        key={slot}
                                        onClick={() => setSelectedTime(cstSlot)}
                                        variant={selectedTime === cstSlot ? "default" : "outline"}
                                        >
                                        {cstSlot}
                                        </Button>
                                    );
                                    })}
                            
                             //  {timeSlots.map((slot) => {
                           //       return (  <Button key = {slot} onClick = {() => setSelectedTime(slot)}
                                 //   variant = {selectedTime === slot ? "default" : "outline"}
                             //       >
                           //             {slot}</Button>
                             //     );
                          //      })}
                                
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            <div>

            </div>
    </div>
    );
};

export default BookingForm;

*/