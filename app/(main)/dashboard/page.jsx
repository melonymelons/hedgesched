"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from '@/app/lib/validators';
import useFetch from '@/hooks/use-fetch';
import { updateUsername } from '@/actions/users';
import { BarLoader } from 'react-spinners';

const Dashboard = () => {

    const {isLoaded, user} = useUser();
    console.log(user);

    const {
        register, 
        handleSubmit, 
        setValue, 
        formState:{errors},
    } = useForm({
        resolver: zodResolver (usernameSchema),
    });

    useEffect(() => {
        setValue("username", user?.username);
    }, [isLoaded]);


    const {
        loading, 
        error, 
        fn: fnUpdateUsername,
    } = useFetch(updateUsername);

    const onSubmit = async (data) => {
        fnUpdateUsername(data.username);
    };

    return (
        <div className = "space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>
                        欢迎, {user?.firstName}
                    </CardTitle>
                </CardHeader>
              { /* Latest Updates */ }
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>
                        您的独特链接
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className = "space-y-4">
                        <div>
                            <div className = "flex items-center gap-2">
                                <span>
                                    http://localhost:3000/ (need to change)
                                </span>
                                <Input {...register("username")} placeholder = "用户名" readOnly/>
                            </div>

                            {errors.username && (
                                <p className = "text-red-500 text-sm mt-1">
                                    {errors.username.message}
                                </p>
                            )}
                            {error && (
                                <p className = "text-red-500 text-sm mt-1">{error?.message}</p>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;

/*
<Button type = "submit">
     更新用户名
</Button>

{loading && <BarLoader className = "mb-4" width = {"100%"} color = "#36d7b7"/>}
*/