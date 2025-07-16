import { getUserEvents } from "@/actions/events";
import EventCard from "@/components/event-card";
import { Suspense } from "react";

export default function EventsPage() {
    return (
        <Suspense fallback = {<div>Loading Events...</div>}>
            <Events />
        </Suspense>
    );
}

const Events = async () => {

    const {events, username} = await getUserEvents();
    
    if (events.length === 0) {
        return <p>You haven&apos;t created any events yet.</p>;
    }


    return (
        <div> 
            {events.map((event) => (
                <EventCard key = {event.id} event = {event} username = {username}/>
            ))} 
        </div>
    );
};