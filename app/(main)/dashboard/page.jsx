import { useUser } from '@clerk/nextjs';
import React from 'react';

const Dashboard = () => {

    const {isLoaded, user} = useUser();

    return (
        <div>

        </div>
    );
};

export default Dashboard;