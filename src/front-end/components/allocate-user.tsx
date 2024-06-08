'use client';
import {columns} from "@/app/(dashboard)/projects/create/_component/columns";
import {DataTable} from "@/app/(dashboard)/users/_component/data-table";
import Cookies from "js-cookie";
import {useEffect, useState} from "react";

interface AllocationProps {
    isOpen: boolean;
    onClose: (event?: React.MouseEvent<HTMLButtonElement>) => void;
    onConfirm: React.MouseEventHandler<HTMLButtonElement>;
    onUpdateUsers: (raters: any[]) => void;
    allocatedUsers: string[];
    userType: string;
  }
  
  
const Allocation: React.FC<AllocationProps> = ({ isOpen, onClose, onConfirm, onUpdateUsers, allocatedUsers, userType }) => {
    if (!isOpen) return null;

    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>(allocatedUsers?allocatedUsers:[]);

    const getUsers = async () => {
        const response = await fetch('https://lp-koala-backend-c0a69db0f618.herokuapp.com/users/getUsers', {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": Cookies.get('token')!
            }
        });

        const result = await response.json();
        const filteredUsers = result.data.users.filter((user: any) => user.role === userType);
        setUsers(filteredUsers);
    };

    useEffect(() => {
        getUsers();
    }, []);

    const toggleRater = (id: string) => {
        setSelectedUsers(current => {
            const isCurrentlySelected = current.includes(id);
            const newSelectedUsers = isCurrentlySelected ? current.filter(userId => userId !== id) : [...current, id];
            // console.log(`Toggling rater ${id}:`, { isCurrentlySelected, newSelectedRaters });
            return newSelectedUsers;
        });
    };

    const handleConfirm = () => {
        onUpdateUsers(selectedUsers); // Pass the selected raters back to the parent component
        onClose(); // Close the modal
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
            <div style={{
                padding: 20,
                background: 'white',
                borderRadius: 5,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '50%',
                minHeight: '300px',
                maxWidth: '80%',
                overflow: 'auto'
            }}>
                <h2>Allocate {userType}</h2>
                <DataTable
                    columns={columns({ toggleRater, isSelected: id => selectedUsers.includes(id) })}
                    data={users}
                    canCreateUser={false}
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                    <button style={{
                        backgroundColor: '#121212',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        transition: 'background-color 300ms'
                    }} onClick={()=>handleConfirm()}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default Allocation;