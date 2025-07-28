"use client";

import { bookingSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { createBooking, getBookedSlots } from "@/actions/bookings";

const BookingForm = ({ event, availability }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Shanghai timezone adjustment
  const shanghaiTimeStr = new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Shanghai",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const currentHour = parseInt(shanghaiTimeStr.split(":")[0]);

  // Stable date map
  const availableDatesMap = useMemo(() => {
    const map = new Map();
    availability.forEach((day) => {
      const date = parseISO(day.date);
      if (currentHour >= 12) {
        date.setDate(date.getDate() + 1);
      }
      map.set(format(date, "yyyy-MM-dd"), day.slots);
    });
    return map;
  }, [availability, currentHour]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const {
    loading: loadingBookedSlots,
    data: bookedSlots = [],
    fn: fnGetBookedSlots,
  } = useFetch(getBookedSlots);
  
  const [localBookedSlots, setLocalBookedSlots] = useState([]);  

  const {
    loading: loadingCreateBooking,
    data: bookingData,
    fn: fnCreateBooking,
  } = useFetch(createBooking);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      setValue("date", dateStr);
      fnGetBookedSlots(event.id, dateStr).then((slots) => {
        setLocalBookedSlots(slots || []);
      });
    }
  }, [selectedDate]);
  

  useEffect(() => {
    if (selectedTime) {
      setValue("time", selectedTime);
    }
  }, [selectedTime]);

  const timeSlots =
  selectedDate &&
  availableDatesMap.get(format(selectedDate, "yyyy-MM-dd"))?.filter(
    (slot) => !localBookedSlots.includes(slot)
  );


  const onSubmit = async (formData) => {
    if (!selectedDate || !selectedTime) {
      console.error("未选择日期或时间");
      return;
    }

    const startTime = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`
    );
    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    const bookingPayload = {
      eventId: event.id,
      name: formData.name,
      email: formData.email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      additionalInfo: formData.additionalInfo,
    };

    await fnCreateBooking(bookingPayload);

    // Optimistically update UI without waiting for fetch delay
    setLocalBookedSlots((prev) => [...prev, selectedTime]);
    setSelectedTime(null);

  };

  if (bookingData) {
    return (
      <div className="text-center p-10 border bg-white">
        <h2 className="text-2xl font-bold mb-4">
          预订成功! 别忘了记好你的预约时间和日期。
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-10 border bg-white">
      <div className="md:h-96 flex flex-col md:flex-row gap-5">
        <div className="w-full">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            disabled={(date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              return !availableDatesMap.has(dateStr);
            }}
            modifiers={{
              available: (date) => {
                const dateStr = format(date, "yyyy-MM-dd");
                return availableDatesMap.has(dateStr);
              },
            }}
            modifiersStyles={{
              available: {
                backgroundColor: "#ffe5e5",
                borderRadius: "100%",
              },
            }}
          />
        </div>
        <div className="w-full h-full md:overflow-scroll no-scrollbar">
          {selectedDate && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">可用时段</h3>
              {!loadingBookedSlots ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {timeSlots?.map((slot) => (
                    <Button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      variant={selectedTime === slot ? "default" : "outline"}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              ) : (
                <p>加载中...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedTime && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <h2>别忘了记好你的预约时间和日期。</h2>
          </div>
          <div>
            <Input {...register("name")} placeholder="你的名字" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="你的电子邮件"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Textarea
              {...register("additionalInfo")}
              placeholder="附加信息"
            />
          </div>
          <Button type="submit" disabled={loadingCreateBooking} className="w-full">
            {loadingCreateBooking ? "正在安排中..." : "预约时间"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default BookingForm;


/*
"use client";

import { bookingSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { createBooking, getBookedSlots } from "@/actions/bookings";

const BookingForm = ({ event, availability }) => {

        const [selectedDate, setSelectedDate] = useState(null);
        const [selectedTime, setSelectedTime] = useState(null);
        const [bookedSlots, setBookedSlots] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });


            //ADDED 
const shanghaiTimeStr = new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Shanghai",
    hour12: false, 
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  
  const currentHour = parseInt(shanghaiTimeStr.split(":")[0]);
  
  const availableDatesMap = new Map();
  availability.forEach(day => {
  const date = parseISO(day.date);

    console.log(date);
    
    if (currentHour >= 12) {
      date.setDate(date.getDate() + 1);
    }
    
    console.log("currenthour", currentHour);
    
    availableDatesMap.set(format(date, 'yyyy-MM-dd'), day.slots);
  });
            //ADDED

 // const availableDatesMap = new Map();
  //availability.forEach(day => {
  //  const date = parseISO(day.date);
                                                    //     date.setDate(date.getDate() + 1); // force +1 day
  //  availableDatesMap.set(format(date, 'yyyy-MM-dd'), day.slots);
 // });


  const timeSlots = selectedDate
    ? availableDatesMap.get(format(selectedDate, 'yyyy-MM-dd'))?.filter(slot => 
        !bookedSlots.includes(slot)
      ) || []
    : [];

  useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
      const fetchBookedSlots = async () => {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const booked = await getBookedSlots(event.id, dateStr);
        setBookedSlots(booked);
      };
      fetchBookedSlots();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime) {
      setValue("time", selectedTime);
    }
  }, [selectedTime]);

  const { loading, data, fn: fnCreateBooking } = useFetch(createBooking);

  const onSubmit = async (data) => {
    if (!selectedDate || !selectedTime) {
      console.error("未选择日期或时间");
      return;
    }

    const startTime = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`
    );

    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    const bookingData = {
      eventId: event.id,
      name: data.name,
      email: data.email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      additionalInfo: data.additionalInfo,
    };

    await fnCreateBooking(bookingData);
  };

  if (data) {
    return (
      <div className="text-center p-10 border bg-white">
        <h2 className="text-2xl font-bold mb-4">
          预订成功! 别忘了记好你的预约时间和日期。
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-10 border bg-white">
      <div className="md: h-96 flex flex-col md: flex-row gap-5">
        <div className="w-full">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            disabled={(date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              return !availableDatesMap.has(dateStr);
            }}
            modifiers={{
              available: (date) => {
                const dateStr = format(date, "yyyy-MM-dd");
                return availableDatesMap.has(dateStr);
              },
            }}
            modifiersStyles={{
              available: {
                backgroundColor: "#ffe5e5",
                borderRadius: "100%",
              },
            }}
          />
        </div>
        <div className="w-full h-full md: overflow-scroll no-scrollbar">
          {selectedDate && (
           <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">可用时段</h3>
               <div className="grid grid-cols-2 lg: grid-cols-3 gap-2">
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
      {selectedTime && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <h2> 别忘了记好你的预约时间和日期。</h2>
          </div>
          <div>
            <Input {...register("name")} placeholder="你的名字" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="你的电子邮件"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Textarea
              {...register("additionalInfo")}
              placeholder="附加信息"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "正在安排中..." : "预约时间"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default BookingForm;
*/


  /*   const availableDays = availability.map((day) => {
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





      const timeSlots = selectedDate
        ? availability.find(
        (day) => day.date === formatDateToShanghai(selectedDate)
        )?.slots || []
    : []; 
             ^^^^^ most recent timeSlots. use this when errors arise.
        
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
      */

    //does it shift a day only in the afternoon? test it out. in the morning it works fine with the original code.




//most recent, but does not account for overlapping booked time slot for students

    /*
"use client";

import { bookingSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { createBooking } from "@/actions/bookings";
  
const BookingForm = ({event, availability}) => {
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const {register, handleSubmit, formState: {errors}, setValue} = useForm({
        resolver: zodResolver(bookingSchema),
    });

    //const availableDays = availability.map((day) =>
    //   new Date(day.date + "T00:00:00")
    // );

    const availableDateStrings = new Set(availability.map(day => day.date));
    
    const timeSlots = selectedDate
    ? availability.find(
        (day) => day.date === selectedDate.toISOString().slice(0, 10)
        )?.slots || []
    : [];

    useEffect(() => {
        if(selectedDate) {
            setValue("date", format(selectedDate, "yyyy-MM-dd"));
        }
    }, [selectedDate]);

    useEffect(() => {
        if(selectedTime) {
            setValue("time", selectedTime);
        }
    }, [selectedTime]);

    const {loading, data, fn: fnCreateBooking} = useFetch(createBooking);

    const onSubmit = async (data) => {
        console.log(data);

        if(!selectedDate || !selectedTime) {
            console.error("未选择日期或时间");
            return;
        }

        const startTime = new Date(
            `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`
        );

        const endTime = new Date(startTime.getTime() + event.duration * 60000);

        const bookingData = {
            eventId: event.id,
            name: data.name,
            email: data.email,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            additionalInfo: data.additionalInfo,
        };

        await fnCreateBooking(bookingData);
    };

    if(data){
        return (
            <div className = "text-center p-10 border bg-white">
                <h2 className = "text-2xl font-bold mb-4">
                    预订成功! 别忘了记好你的预约时间和日期。
                </h2>
            </div>
        )
    }
          
    return (
        <div className = "flex flex-col gap-8 p-10 border bg-white"> 
            <div className = "md: h-96 flex flex-col md: flex-row gap-5">
                <div className = "w-full">
                            <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date);
                                setSelectedTime(null);
                            }}
                            disabled={(date) => {
                                const iso = date.toISOString().slice(0, 10);
                                return !availableDateStrings.has(iso);
                            }}
                            modifiers={{
                                available: (date) => {
                                const iso = date.toISOString().slice(0, 10);
                                return availableDateStrings.has(iso);
                                }
                            }}
                            modifiersStyles={{
                                available: {
                                backgroundColor: "#ffe5e5",
                                borderRadius: "100%",
                                }
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
        {
            selectedTime &&  (<form onSubmit = {handleSubmit(onSubmit)} className = "space-y-4">
               <div>
                <h2> 别忘了记好你的预约时间和日期。</h2>
               </div>
                <div>
                    <Input {...register("name")} placeholder = "你的名字"/>
                    {errors.name && (
                        <p className = "text-red-500 text-sm">{errors.name.message}</p>
                    )}
                </div>
                <div>
                <Input {...register("email")} type = "email" placeholder = "你的电子邮件"/>
                    {errors.email && (
                        <p className = "text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>
                <div>
                    <Textarea 
                    {...register("additionalInfo")}
                    placeholder = "附加信息"
                    />
                </div>
                <Button type = "submit" disabled ={loading} className = "w-full">
                    {loading ? "正在安排中..." : "预约时间"}
                </Button>
            </form>)
        }
    </div>
    );
};

export default BookingForm;
*/

                        //{">"}{">"}> 2nd version, works in the afternoon but not in the morning

/*
"use client";

import { bookingSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { createBooking } from "@/actions/bookings";
import { getBookedSlots } from "@/actions/bookings";
  
const BookingForm = ({event, availability}) => {
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);

    const {register, handleSubmit, formState: {errors}, setValue} = useForm({
        resolver: zodResolver(bookingSchema),
    });

    //const availableDays = availability.map((day) =>
    //    new Date(day.date + "T00:00:00")
    //);
    
    const availableDateStrings = new Set(availability.map(day => day.date));
    
    const timeSlots = selectedDate
    ? availability.find(
        (day) => day.date === selectedDate.toISOString().slice(0, 10)
    )?.slots.filter(slot => !bookedSlots.includes(slot)) || []
    : [];

    useEffect(() => {
        if (selectedDate) {
            setValue("date", format(selectedDate, "yyyy-MM-dd"));
            // Fetch booked slots for the selected date
            const fetchBookedSlots = async () => {
                const dateStr = format(selectedDate, "yyyy-MM-dd");
                const booked = await getBookedSlots(event.id, dateStr);
                setBookedSlots(booked);
            };
            fetchBookedSlots();
        }
    }, [selectedDate]);

    useEffect(() => {
        if(selectedTime) {
            setValue("time", selectedTime);
        }
    }, [selectedTime]);

    const {loading, data, fn: fnCreateBooking} = useFetch(createBooking);

    const onSubmit = async (data) => {
        console.log(data);

        if(!selectedDate || !selectedTime) {
            console.error("未选择日期或时间");
            return;
        }

        const startTime = new Date(
            `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`
        );

        const endTime = new Date(startTime.getTime() + event.duration * 60000);

        const bookingData = {
            eventId: event.id,
            name: data.name,
            email: data.email,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            additionalInfo: data.additionalInfo,
        };

        await fnCreateBooking(bookingData);
    };

    if(data){
        return (
            <div className = "text-center p-10 border bg-white">
                <h2 className = "text-2xl font-bold mb-4">
                    预订成功! 别忘了记好你的预约时间和日期。
                </h2>
            </div>
        )
    }
          
    return (
        <div className = "flex flex-col gap-8 p-10 border bg-white"> 
            <div className = "md: h-96 flex flex-col md: flex-row gap-5">
                <div className = "w-full">
                            <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date);
                                setSelectedTime(null);
                            }}
                            disabled={(date) => {
                                const iso = date.toISOString().slice(0, 10);
                                return !availableDateStrings.has(iso);
                            }}
                            modifiers={{
                                available: (date) => {
                                const iso = date.toISOString().slice(0, 10);
                                return availableDateStrings.has(iso);
                                }
                            }}
                            modifiersStyles={{
                                available: {
                                backgroundColor: "#ffe5e5",
                                borderRadius: "100%",
                                }
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
        {
            selectedTime &&  (<form onSubmit = {handleSubmit(onSubmit)} className = "space-y-4">
               <div>
                <h2> 别忘了记好你的预约时间和日期。</h2>
               </div>
                <div>
                    <Input {...register("name")} placeholder = "你的名字"/>
                    {errors.name && (
                        <p className = "text-red-500 text-sm">{errors.name.message}</p>
                    )}
                </div>
                <div>
                <Input {...register("email")} type = "email" placeholder = "你的电子邮件"/>
                    {errors.email && (
                        <p className = "text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>
                <div>
                    <Textarea 
                    {...register("additionalInfo")}
                    placeholder = "附加信息"
                    />
                </div>
                <Button type = "submit" disabled ={loading} className = "w-full">
                    {loading ? "正在安排中..." : "预约时间"}
                </Button>
            </form>)
        }
    </div>
    );
};

export default BookingForm;
*/












                    //backup: test this version. works in the morning

/*
"use client";

import { bookingSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, parseISO, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { createBooking, getBookedSlots } from "@/actions/bookings";

const BookingForm = ({ event, availability }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const availabilityMap = availability.reduce((map, day) => {
    // Parse and normalize the date to local timezone
    const dateObj = startOfDay(parseISO(day.date));
    const dateKey = format(dateObj, 'yyyy-MM-dd');
    return map.set(dateKey, day.slots);
  }, new Map());

  const timeSlots = selectedDate
    ? availabilityMap.get(format(startOfDay(selectedDate), 'yyyy-MM-dd'))?.filter(
        slot => !bookedSlots.includes(slot)
      ) || []
    : [];

  useEffect(() => {
    if (selectedDate) {
      const dateKey = format(startOfDay(selectedDate), 'yyyy-MM-dd');
      setValue("date", dateKey);
      
      const fetchBookedSlots = async () => {
        const booked = await getBookedSlots(event.id, dateKey);
        setBookedSlots(booked);
      };
      fetchBookedSlots();
    }
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-8 p-10 border bg-white">
      <div className="md:h-96 flex flex-col md:flex-row gap-5">
        <div className="w-full">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            disabled={(date) => {
              const dateKey = format(startOfDay(date), 'yyyy-MM-dd');
              return !availabilityMap.has(dateKey);
            }}
            modifiers={{
              available: (date) => {
                const dateKey = format(startOfDay(date), 'yyyy-MM-dd');
                return availabilityMap.has(dateKey);
              },
            }}
            modifiersStyles={{
              available: {
                backgroundColor: "#ffe5e5",
                borderRadius: "100%",
              },
            }}
          />
        </div>
        
        <div className="w-full h-full md:overflow-scroll no-scrollbar">
          {selectedDate && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">可用时段</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
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
      
      {selectedTime && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        </form>
      )}
    </div>
  );
};

export default BookingForm;
*/






/*

"use client";

import { bookingSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { createBooking, getBookedSlots } from "@/actions/bookings";

const BookingForm = ({ event, availability }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const {
    loading: loadingSlots,
    data: bookedSlotsData,
    fn: fetchBookedSlots,
  } = useFetch(getBookedSlots);

  const {
    loading: submittingBooking,
    data: bookingResult,
    fn: submitBooking,
  } = useFetch(createBooking);

  console.log("Creating booking with data:", bookedSlotsData);
  console.log("Booking created:", bookingResult);

  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTime, setSelectedTime] = React.useState(null);
  
  useEffect(() => {
    (async () => await fetchBookedSlots())();
    }, []); 
  useEffect(() => {
        (async () => await submitBooking())();
        }, []); 

  const getShanghaiTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Shanghai",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const processAvailability = () => {
    const currentHour = parseInt(getShanghaiTime().split(":")[0]);
    const availableDatesMap = new Map();

    availability.forEach(day => {
      const date = parseISO(day.date);
      
      if (currentHour >= 12) {
        date.setDate(date.getDate() + 1);
      }
      
      availableDatesMap.set(format(date, 'yyyy-MM-dd'), day.slots);
    });

    return availableDatesMap;
  };

  const availableDatesMap = processAvailability();

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const allSlots = availableDatesMap.get(dateStr) || [];
    const bookedSlotsSet = new Set(bookedSlotsData || []);
    
    return allSlots.filter(slot => !bookedSlotsSet.has(slot));
  };

  const timeSlots = getAvailableTimeSlots();

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      setValue("date", dateStr);
      fetchBookedSlots(event.id, dateStr);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime) {
      setValue("time", selectedTime);
    }
  }, [selectedTime]);

  useEffect(() => {
    if (bookingResult && !bookingResult.error) {
      reset();
      setSelectedTime(null);
      if (selectedDate) {
        fetchBookedSlots(event.id, format(selectedDate, "yyyy-MM-dd"));
      }
    }
  }, [bookingResult]);

  const onSubmit = async (formData) => {
    if (!selectedDate || !selectedTime) return;

    const startTime = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`
    );
    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    const bookingData = {
      eventId: event.id,
      name: formData.name,
      email: formData.email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      additionalInfo: formData.additionalInfo,
    };

    await submitBooking(bookingData);
  };

  if (bookingResult && !bookingResult.error) {
    return (
      <div className="text-center p-10 border bg-white">
        <h2 className="text-2xl font-bold mb-4">
          预订成功! 别忘了记好你的预约时间和日期。
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-10 border bg-white">
      <div className="md:h-96 flex flex-col md:flex-row gap-5">
        <div className="w-full">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            disabled={(date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              return !availableDatesMap.has(dateStr);
            }}
            modifiers={{
              available: (date) => {
                const dateStr = format(date, "yyyy-MM-dd");
                return availableDatesMap.has(dateStr);
              },
            }}
            modifiersStyles={{
              available: {
                backgroundColor: "#ffe5e5",
                borderRadius: "100%",
              },
            }}
          />
        </div>
        <div className="w-full h-full md:overflow-scroll no-scrollbar">
          {selectedDate && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">可用时段</h3>
              {loadingSlots ? (
                <p>加载中...</p>
              ) : timeSlots.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
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
              ) : (
                <p>没有可用的时间段</p>
              )}
            </div>
          )}
        </div>
      </div>
      {selectedTime && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <h2>别忘了记好你的预约时间和日期。</h2>
          </div>
          <div>
            <Input {...register("name")} placeholder="你的名字" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="你的电子邮件"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Textarea
              {...register("additionalInfo")}
              placeholder="附加信息"
            />
          </div>
          <Button type="submit" disabled={submittingBooking} className="w-full">
            {submittingBooking ? "正在安排中..." : "预约时间"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default BookingForm;
*/