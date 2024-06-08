import { render, waitFor } from '@testing-library/react';
import {ProjectsList} from "@/components/projects-list";
import { getUserRole } from '@/lib/utils';
import Cookies from 'js-cookie';
import {afterEach, describe, expect, it} from "@jest/globals";
import React from "react";


jest.mock('@/lib/utils', () => ({
    getUserRole: jest.fn(),
}));

jest.mock('js-cookie', () => ({
    get: jest.fn(),
}));

describe('ProjectsList component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    it('renders projects correctly', async () => {
        const mockProjects = [
            { _id: '1', title: 'Project 1', image: './public/next.svg' },
            { _id: '2', title: 'Project 2', image: './public/next.svg' },
        ];
        const mockUserRole = 'rater';
        getUserRole.mockResolvedValueOnce(mockUserRole);
        Cookies.get.mockReturnValueOnce('mockToken');
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ data: mockProjects }),
        });

        const { getByText, getByAltText } = render(<ProjectsList />);

        await waitFor(() => {
            expect(getByText('Project 1')).toBeInTheDocument();
            expect(getByText('Project 2')).toBeInTheDocument();
            expect(getByAltText('Project 1')).toBeInTheDocument();
            expect(getByAltText('Project 2')).toBeInTheDocument();
        });
    });

    it('displays "No Projects found" message when no projects are returned', async () => {
        getUserRole.mockResolvedValueOnce('rater');
        Cookies.get.mockReturnValueOnce('mockToken');
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ data: [] }),
        });

        const { getByText } = render(<ProjectsList />);

        await waitFor(() => {
            expect(getByText('No Projects found')).toBeInTheDocument();
        });
    });

    it('handles error when fetching projects fails', async () => {
        getUserRole.mockResolvedValueOnce('rater');
        Cookies.get.mockReturnValueOnce('mockToken');
        global.fetch = jest.fn().mockRejectedValueOnce(new Error('Fetch error'));


        await waitFor(() => {
            expect(global.fetch).rejects.toThrow();
        });
    });
});
