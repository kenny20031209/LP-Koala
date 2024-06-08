import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignInForm from "@/components/sign-in-form";
import { useRouter } from "next/navigation";
import React from "react";
import Cookies from 'js-cookie';
import {beforeEach, describe, expect, it} from "@jest/globals";

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

(global as any).fetch = jest.fn(); // Temporarily disable TypeScript checks for 'fetch' property


describe('SignInForm component', () => {
    beforeEach(() => {
        // Clear any cookies before each test
        Cookies.remove('token');
    });

    it('renders correctly', () => {
        const { getByText, getByLabelText } = render(<SignInForm />);

        expect(getByText('Welcome to DLASSP')).toBeInTheDocument();
        expect(getByLabelText('Username')).toBeInTheDocument();
        expect(getByLabelText('Password')).toBeInTheDocument();
        expect(getByText('Sign in')).toBeInTheDocument();
        expect(getByText('Need an account?')).toBeInTheDocument();
    });

    it('displays error message on incorrect username or password', async () => {
        const { getByText, getByLabelText } = render(<SignInForm />);

        fireEvent.change(getByLabelText('Username'), { target: { value: 'invalidUsername' } });
        fireEvent.change(getByLabelText('Password'), { target: { value: 'invalidPassword' } });
        fireEvent.submit(getByText('Sign in'));

        await waitFor(() => {
            expect(getByText('Incorrect Username or Password')).toBeInTheDocument();
        });
    });

    it('redirects to projects page on successful login', async () => {
        const mockRouterPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

        const mockData = {
            token: 'mockToken',
            data: {
                user: { id: 1, username: 'mockUser' },
            },
        };
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            json: () => Promise.resolve(mockData),
        });

        const { getByLabelText, getByText } = render(<SignInForm />);

        fireEvent.change(getByLabelText('Username'), { target: { value: 'validUsername' } });
        fireEvent.change(getByLabelText('Password'), { target: { value: 'validPassword' } });
        fireEvent.submit(getByText('Sign in'));

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/projects');
        });
    });
});
