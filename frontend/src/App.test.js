import { render, screen } from '@testing-library/react';
import App from './App';

test('renders bond yield calculator heading', () => {
  render(<App />);
  const heading = screen.getByText(/Bond Yield Calculator/i);
  expect(heading).toBeInTheDocument();
});
