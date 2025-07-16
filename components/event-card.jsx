import React from 'react'

const EventCard = ({event, username}) => {
    return (
        <div>{event.title}</div>
    );
};

export default EventCard;