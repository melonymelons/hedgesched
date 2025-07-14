import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { eventSchema } from "@/app/lib/validators";

const EventForm = () => {
   
    const {register, handleSubmit, formState: {errors},} = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues:{
            duration: 30,
            isPrivate: true,
        }
    });

    return (
        <form className = "px-5 flex flex-col gap-4"> 
            <div>
                <label htmlFor = "title"
                    className = "block text-sm font-medium text-gray-700">
                    活动标题
                </label>

            <Input id = "title" {...register("title")} className = "mt-1"/>

            {errors.title && (
                <p className = "text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
            </div>

            <div>
                <label htmlFor = "description"
                    className = "block text-sm font-medium text-gray-700">
                    活动说明
                </label>

            <Input id = "description" {...register("description")} className = "mt-1"/>

            {errors.description && (
                <p className = "text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
            </div>
        </form>
    );
}; 

export default EventForm;