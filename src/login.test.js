import {screen,render} from '@testing-library/react';
import Login from "./Login"

test('renders button with label', () => {
    const mockIsTrue = jest.fn();
    render(<Login isTrue={mockIsTrue} />);
    const btn = screen.getByRole('button',{name:/login/i});
    expect(btn).toBeInTheDocument();
  });


  test('username in the document', () => {
    
    render(<Login />);
    const username = screen.getByPlaceholderText("Enter the username:");
    expect(username).toBeInTheDocument();
  });


  test('password in the document', () => {
    
    render(<Login />);
    const password = screen.getByPlaceholderText("Enter the password:");
    expect(password).toBeInTheDocument();
  });

  test('login button in the document', () => {
    
    render(<Login />);
    const btn = screen.getByRole('button',{name:/login/i});
    expect(btn).toBeInTheDocument();
  });


 
 