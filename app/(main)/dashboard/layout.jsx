"use client";
import { useUser } from "@clerk/nextjs";
import React from 'react';
import { BarChart, Calendar, Users, Clock } from "lucide-react";
import { BarLoader } from "react-spinners";
import Link from "next/link";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/meetings", label: "Meetings", icon: Users },
    { href: "/availability", label: "Availability", icon: Clock },
  ];  

const AppLayout = ({children}) => {
    const { isLoaded } = useUser();

    return (
        <>
        {!isLoaded && <BarLoader width={"100%"} color = "#36d7b7" />}
        <div className = "flex flex-col h-screen bg-red-50 md:flex-row">
            <aside className = "hidden md:block w-64 bg-white"> 
                <nav className = "mt-8">
                    <ul>
                        {navItems.map((item) => (
                            <li key = {item.href} >
                                 <Link href = {item.href} className = "flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100"
                              > 
                                <item.icon className = "w-5 h-5 mr-3" /> 
                                {item.label} 
                            </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </div>
        {children}
        </>
    );
};

export default AppLayout;