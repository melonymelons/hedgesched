"use client";

import { bookingSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";


function formatTimeSlot(slot) {
    return slot; 
  }

  function toShanghaiDate(date) {
    const offsetMilliseconds = 8 * 60 * 60 * 1000;
    return new Date(date.getTime() + offsetMilliseconds);
  }
  
  function formatDateToShanghai(date) {
    const shanghaiDate = toShanghaiDate(date);
    return shanghaiDate.toISOString().slice(0, 10); 
  }
  
const BookingForm = ({event, availability}) => {
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const {register, handleSubmit, formState: {errors},} = useForm({
        resolver: zodResolver(bookingSchema),
    });

    const availableDays = availability.map((day) => {
        const date = new Date(day.date + "T00:00:00");
        date.setDate(date.getDate() + 1); // force +1 day
        return date;
      });
          
          
    const timeSlots = selectedDate
      ? availability.find((day) => {
          const shiftedDate = new Date(selectedDate);
          shiftedDate.setDate(shiftedDate.getDate() + -1); // Force +1 day
          return day.date === format(shiftedDate, "yyyy-MM-dd");
        })?.slots || []
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

  /* const availableDays = availability.map((day) =>
        new Date(day.date + "T00:00:00")
    );
          
    const timeSlots = selectedDate
        ? availability.find(
        (day) => day.date === formatDateToShanghai(selectedDate)
        )?.slots || []
    : []; */