"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import React from 'react';
import { Button } from "@/components/ui/button";

type User = {
  _id: string;
  name: string;
  projects: string[];
  role: string;
}

type ColumnProps = {
  toggleRater: (id: string) => void;
  isSelected: (id: string) => boolean;
};

export const columns = ({ toggleRater, isSelected }: ColumnProps): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          type='button'
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
            type='button'
            variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
          <div>
            {row.getValue('role')}
          </div>
      )
    }
  },
  {
    accessorKey: "allocate",
    header: ({ column }) => {
      return (
        <p>Allocate</p>
      )
    },
    cell: ({ row }) => {
      return(
        <div className="flex items-center">
          <label htmlFor={`editCheckbox-${row.original._id}`} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              id={`editCheckbox-${row.original._id}`}
              className="form-checkbox h-4 w-4"
              onChange={() => toggleRater(row.original._id)}
              checked={isSelected(row.original._id)}
            />
          </label>
        </div>
      )
    }
  }
];

