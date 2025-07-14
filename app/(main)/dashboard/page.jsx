"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from '@/app/lib/validators';

const Dashboard = () => {

    const {isLoaded, user} = useUser();
    console.log(user);

    const {register, handleSubmit} = useForm({
        resolver: zodResolver (usernameSchema),
    })

    const onSubmit = async (data) => {};
    
    return (
        <div className = "space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>
                        欢迎, {user?.firstName}
                    </CardTitle>
                </CardHeader>
               {/*  Latest Updates */}
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
                                    {window?.location.origin}/
                                </span>
                                <Input {...register("username")} placeholder = "用户名"/>
                            </div>
                        </div>
                        <Button type = "submit">
                            更新用户名
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;