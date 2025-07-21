"use client";

import { bookingSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

const BookingForm = () => {
    const {register, handleSubmit, formState: {errors},} = useForm({
        resolver: zodResolver(bookingSchema)
    })

    return (
        <div> Booking Form </div>
    );
};

export default BookingForm;