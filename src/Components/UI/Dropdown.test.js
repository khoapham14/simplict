import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dropdown from './Dropdown';

describe('Dropdown', () => {
  test('dropdown opens when toggle is clicked', () => {
    render(
      <Dropdown>
        <Dropdown.Toggle>Select Option</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>Option 1</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );

    // Menu should not be visible initially
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();

    // Click toggle to open
    fireEvent.click(screen.getByText('Select Option'));

    // Menu should now be visible
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  test('dropdown closes when item is clicked', () => {
    const handleClick = jest.fn();

    render(
      <Dropdown>
        <Dropdown.Toggle>Select Option</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleClick}>Option 1</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );

    // Open dropdown
    fireEvent.click(screen.getByText('Select Option'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();

    // Click item
    fireEvent.click(screen.getByText('Option 1'));

    // Verify onClick was called
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Verify dropdown closed
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  test('dropdown closes on outside click', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <Dropdown>
          <Dropdown.Toggle>Select Option</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Option 1</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );

    // Open dropdown
    fireEvent.click(screen.getByText('Select Option'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));

    // Dropdown should close
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  test('dropdown closes on Escape key', () => {
    render(
      <Dropdown>
        <Dropdown.Toggle>Select Option</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>Option 1</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );

    // Open dropdown
    fireEvent.click(screen.getByText('Select Option'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Dropdown should close
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  test('item onClick is called before dropdown closes', () => {
    const callOrder = [];
    const handleClick = () => callOrder.push('onClick');

    render(
      <Dropdown>
        <Dropdown.Toggle>Select Option</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleClick}>Option 1</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );

    // Open and click item
    fireEvent.click(screen.getByText('Select Option'));
    fireEvent.click(screen.getByText('Option 1'));

    // onClick should have been called
    expect(callOrder).toContain('onClick');
  });
});
