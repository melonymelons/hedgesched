import { getEventAvailability, getEventDetails } from "@/actions/events";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import EventDetails from "./_components/event-details";
import BookingForm from "./_components/booking-form";

export async function generateMetadata ({params}) {
    const resolvedParams = await Promise.resolve(params);
    const username = resolvedParams?.username;
    const eventId = resolvedParams?.eventId;

    const event = await getEventDetails(username, eventId);

    if(!event) {
        return {
            title: "未找到活动",

        };
    }

    return {
        title: `预订活动${event.title}，联系${event.user.name} | HEDGEsched`,
        description: `预约一个${event.duration}-分钟的${event.title}活动，与${event.user.name}联系.`,
    };
} 

const EventPage = async ({params}) => {
    const resolvedParams = await Promise.resolve(params);
    const username = resolvedParams?.username;
    const eventId = resolvedParams?.eventId;

    const event = await getEventDetails(username, eventId);
    const availability = await getEventAvailability(eventId);
    console.log(availability);

    if(!event) {
        notFound();
    }

    return (
        <div className = "flex flex-col justify-center lg: flex-row px-4 py-8"> 
            <EventDetails event = {event} />
           <Suspense fallback = {<div>正在加载预约表单...</div>}> 
                 <BookingForm event = {event} availability = {availability}/>
           </Suspense>  
        </div>
    );
};

export default EventPage;