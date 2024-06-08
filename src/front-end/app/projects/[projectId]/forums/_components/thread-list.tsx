'use client';

import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {Thread} from "@/type";
import Link from "next/link";

interface ThreadListProps {
    threads: Thread[],
    projectId: string,
}
function ThreadList({
                          threads,
                          projectId
                      }:ThreadListProps) {

    const [ac, setAc] = useState([
        { id: 1, title: 'Hiking' },
        { id: 2, title: 'Biking' },
        { id: 3, title: 'Swimming' },
        { id: 4, title: 'Running' },
    ]);



    return (
        <div className="flex flex-col items-center mt-8">
            <h2 className="text-3xl font-semibold mb-4">Threads</h2>
            <ul className="grid gap-4">
                {threads !== undefined && threads.map(thread => (
                    <Link
                        href={`/projects/${projectId}/forums/${thread._id}`}
                        key={thread._id}
                        className="bg-gray-200 rounded-lg p-4 shadow-md w-64"
                    >
                        <h3 className="text-xl font-semibold">{thread.title}</h3>
                        {/* You can add more details about each activity here */}
                    </Link>
                ))}
            </ul>
        </div>
    );
}

export default ThreadList;