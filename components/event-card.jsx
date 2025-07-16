"use client";

import React, { useState } from 'react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Link, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const EventCard = ({event, username, isPublic = false}) => {

    const [isCopied, setIsCopied] = useState(false);
    const router = useRouter();

    const handleCopy = async() => {
        try {
            await navigator.clipboard.write
        } catch (error) {

        }
    };

    return (
        <Card className = "flex flex-col justify-between cursor-pointer">
        <CardHeader>
          <CardTitle className = "text-2xl">{event.title}</CardTitle>
          <CardDescription className = "flex justify-between">
            <span>
            {event.duration} 分钟 | {event.isPrivate?"私人的":"民众"} 
            </span>
            <span>
                {event._count.bookings} Bookings
            </span>
            </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{event.description}</p>
        </CardContent>
       {!isPublic && ( 
        <CardFooter className = "flex gap-2">
          <Button variant = "outline" className = "flex items-center" onClick = {handleCopy}>
            <Link className = "mr-2 h-4 w-4" /> 复制链接
             </Button>
          <Button variant = "destructive">
            <Trash2 className = "mr-2 h-4 w-4" />
            删除
          </Button>
        </CardFooter> 
    )}
      </Card>
    );
};

export default EventCard;