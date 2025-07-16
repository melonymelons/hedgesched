import { getUserEvents } from "@/actions/events";
import EventCard from "@/components/event-card";
import { Suspense } from "react";

export default function EventsPage() {
    return (
        <Suspense fallback = {<div>加载事件...</div>}>
            <Events />
        </Suspense>
    );
}

const Events = async () => {

    const {events, username} = await getUserEvents();
    
    if (events.length === 0) {
        return <p>您尚未创建任何活动</p>;
    }


    return (
        <div className = "grid gap-4 grid-cols-1 lg: grid-cols-2"> 
            {events.map((event) => (
                <EventCard key = {event.id} event = {event} username = {username}/>
            ))} 
        </div>
    );
};