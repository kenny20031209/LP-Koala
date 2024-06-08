'use client';

import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {Activity} from "@/type";
import Link from "next/link";

interface ActivityListProps {
    activities: Activity[],
    projectId: string,
    moduleId: string
}
function ActivityList({
                          activities,
                          projectId,
                          moduleId
                      }:ActivityListProps) {

    const [ac, setAc] = useState([
        { id: 1, title: 'Hiking' },
        { id: 2, title: 'Biking' },
        { id: 3, title: 'Swimming' },
        { id: 4, title: 'Running' },
    ]);



    return (
        <div className="flex flex-col items-center mt-8">
            <h2 className="text-3xl font-semibold mb-4">Activities</h2>
            <ul className="grid gap-4">
                {activities !== undefined && activities.map(activity => (
                    <Link
                        href={`/projects/${projectId}/modules/${moduleId}/activities/${activity._id}`}
                        key={activity._id}
                        className="bg-gray-200 rounded-lg p-4 shadow-md w-64"
                    >
                        <h3 className="text-xl font-semibold">{activity.description}</h3>
                        {/* You can add more details about each activity here */}
                    </Link>
                ))}
            </ul>
        </div>
    );
}

export default ActivityList;