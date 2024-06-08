import { render, fireEvent, waitFor } from '@testing-library/react';
import ChangePasswordForm from "@/components/change-password-form";
import '@testing-library/jest-dom';
import { describe, expect, it} from "@jest/globals";
import React from "react";



describe('ChangePasswordForm component', () => {
    it('renders correctly', () => {
        const { getByLabelText, getByText } = render(<ChangePasswordForm />);

        expect(getByLabelText('Current Password')).toBeInTheDocument();
        expect(getByLabelText('New Password')).toBeInTheDocument();
        expect(getByText('Clear')).toBeInTheDocument();
        expect(getByText('Confirm')).toBeInTheDocument();
    });

    it('clears new password field on Clear button click', () => {
        const { getByText, getByLabelText } = render(<ChangePasswordForm />);
        const newPasswordInput = getByLabelText('New Password');

        fireEvent.change(newPasswordInput, { target: { value: 'newpassword' } });
        expect(newPasswordInput).toHaveValue('newpassword');

        fireEvent.click(getByText('Clear'));
        expect(newPasswordInput).toHaveValue('');
    });

    it('displays error message for incorrect current password', async () => {
        // Mock fetch request to simulate incorrect current password
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: jest.fn().mockResolvedValueOnce({}),
        });

        const { getByText, getByLabelText } = render(<ChangePasswordForm />);

        fireEvent.change(getByLabelText('Current Password'), { target: { value: 'incorrectpassword' } });
        fireEvent.change(getByLabelText('New Password'), { target: { value: 'newpassword' } });

        fireEvent.click(getByText('Confirm'));

        await waitFor(() => {
            expect(getByText('Your current password is incorrect')).toBeInTheDocument();
        });
    });

    // Add more test cases as needed to cover other scenarios
});
