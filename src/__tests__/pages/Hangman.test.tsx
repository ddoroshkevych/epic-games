import React from 'react';
import { render, screen } from '@testing-library/react';
import Hangman from '../../pages/Hangman';

test('renders learn react link', () => {
  render(<Hangman />);
  const linkElement = screen.getByText(/Hangman/i);
  expect(linkElement).toBeInTheDocument();
});
