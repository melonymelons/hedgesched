"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { eventSchema } from "@/app/lib/validators";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { createEvent } from "@/actions/events";
import { useRouter } from "next/navigation";

const EventForm = ({onSubmitForm}) => {
    const router = useRouter();
   
    const {register, handleSubmit, control, formState: {errors},} = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues:{
            duration: 30,
            isPrivate: true,
        }
    });

    const {loading, error, fn: fnCreateEvent} = useFetch(createEvent);

    const onSubmit = async (data)=> {
        await fnCreateEvent(data)
        if(!loading && !error) onSubmitForm();
        router.refresh();
    };

    return (
        <form className = "px-5 flex flex-col gap-4" onSubmit = {handleSubmit(onSubmit)}> 
            <div>
                <label htmlFor = "title"
                    className = "block text-sm font-medium text-gray-700">
                    活动标题
                </label>

            <Input id = "title" {...register("title")} className = "mt-1"/>

            {errors.title && (
                <p className = "text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
            </div>

            <div>
                <label htmlFor = "description"
                    className = "block text-sm font-medium text-gray-700">
                    活动说明
                </label>

            <Input id = "description" {...register("description")} className = "mt-1"/>

            {errors.description && (
                <p className = "text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
            </div>

            <div>
                <label htmlFor = "duration"
                    className = "block text-sm font-medium text-gray-700">
                    时长 (分钟)
                </label>

            <Input 
            id = "duration" 
            {...register("duration", {
                valueAsNumber: true, 
            })} 
            type = 'number' 
            className = "mt-1"
            />

            {errors.duration && (
                <p className = "text-red-500 text-sm mt-1">{errors.duration.message}</p>
            )}
            </div>

            
            <div>
                <label htmlFor = "isPrivate"
                    className = "block text-sm font-medium text-gray-700">
                    活动隐私
                </label>

                <Controller 
                name = 'isPrivate'
                control = {control}
                render = {({field})=>(
                    <Select value={field.value?"true":"false"}
                    onValueChange = {(value)=>field.onChange(value==="true")}
                    >
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Privacy" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">私人的</SelectItem> 
                        <SelectItem value="false">民众</SelectItem>
                    </SelectContent>
                    </Select>
                )}
                />

            {errors.isPrivate && (
                <p className = "text-red-500 text-sm mt-1">{errors.isPrivate.message}</p>
            )}
            </div>

            {error && <p className = "text-red-500 text-xs mt-1">{error.message}</p>}

            <Button type='submit' disabled = {loading}>
                {loading? "正在提交..." : "创建事件"}
            </Button>
        </form>
    );
}; 

export default EventForm;