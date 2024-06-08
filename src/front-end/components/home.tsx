'use client';


import {useEffect, useState} from "react";

export const Home = () => {
    const [text, setText] = useState('Loading');
    useEffect(() => {
        fetch("http://localhost:8081/api/home").then(
            response => response.json()
        ).then(
            data => {
                console.log(data)
                setText(data.message)
            }
        ).catch(error => console.log(error));
    }, []);

    return (
        <div>
            {text}
        </div>
    )
}