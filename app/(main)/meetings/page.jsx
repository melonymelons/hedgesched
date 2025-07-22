import { getUserMeetings } from "@/actions/meetings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { Suspense } from "react";
import MeetingList from "./_components/meeting-list";

export const metadata = {
    title: "您的会议 | HEDGEsched",
    description: "查看和管理即将召开和过去的会议.",
};

const MeetingPage = () => {
    return (
        <Tabs defaultValue="upcoming">
        <TabsList>
            <TabsTrigger value="upcoming">即将推出 (Upcoming)</TabsTrigger> 
            <TabsTrigger value="past">过去的 (Past)</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
            <Suspense fallback = {<div>加载即将召开的会议...</div>} >
                <UpcomingMeetings />
            </Suspense>
        </TabsContent>
        <TabsContent value="past">
         <Suspense fallback = {<div>加载过去的会议...</div>} >
                <PastMeetings />
            </Suspense>
        </TabsContent>
        </Tabs>
    );
};

async function UpcomingMeetings() {
    const meetings = await getUserMeetings("upcoming");
    return <MeetingList meetings = {meetings} type = {"upcoming"} />;
}

async function PastMeetings() {
    const meetings = await getUserMeetings("past");
    return <MeetingList meetings = {meetings} type = {"past"} />;
}

export default MeetingPage;