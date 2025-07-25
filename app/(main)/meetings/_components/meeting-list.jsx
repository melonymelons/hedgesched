"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import React, { useEffect } from "react";
import CancelMeetingButton from "./cancel-meeting";
import useFetch from "@/hooks/use-fetch";
import { getLastestUpdates } from "@/actions/dashboard";

const MeetingList = ({meetings, type}) => {
   
    const {
        loading: loadingUpdates,
        data: upcomingMeetings,
        data: PastMeetings,
        fn: fnUpdates,
    } = useFetch(getLastestUpdates);
    useEffect(() => {
        (async () => await fnUpdates())();
    }, []);
    //ADDED ^^^

    if(meetings.length === 0) {
        return (
            <p> 未找到{type}会议。 </p>
        );
    }

    return (
        <div className = "grid gap-4 md:grid-cols-2 lg:grid-cols-3"> 
            {meetings.map((meeting) => {
            return (
                <Card key = {meeting.id} className = "flex flex-col justify-between">
                <CardHeader>
                    <CardTitle>{meeting.event.title}</CardTitle>
                    <CardDescription>和{meeting.name}</CardDescription>
                    <CardDescription>
                        &quot;{meeting.additionalInfo}&quot;
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className = "flex items-center mb-2">
                        <Calendar className = "mr-2 h-4 w-4" />
                        <span>
                          {format(new Date(meeting.startTime), "MMMM d, yyyy")}  
                        </span>
                    </div>
                    <div className = "flex items-center mb-2">
                        <Clock className = "mr-2 h-4 w-4" />
                        <span>
                         {/* {format(new Date(meeting.startTime), "h:mm a")} -{" "}
                            {format(new Date(meeting.endTime), "h:mm a")} */}   
                                            {!loadingUpdates ? (
                                                <div>
                                                {format(new Date(meeting.startTime), "h:mm a")} -{" "}
                                                {format(new Date(meeting.endTime), "h:mm a")} 
                                                </div>
                                                ) : (
                                                    <p></p>
                                                )}
                        </span>
                    </div>
                </CardContent>
                {type === "upcoming" && (
                <CardFooter className = "flex justify-between">
                    <CancelMeetingButton meetingId={meeting.id} />
                </CardFooter>
                )}
                </Card>
            );
        })} </div>
    );
};

export default MeetingList;