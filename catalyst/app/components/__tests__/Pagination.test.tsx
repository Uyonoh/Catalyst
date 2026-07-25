import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination component', () => {
  it('returns null when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} totalCount={10} pageSize={10} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders correct page items summary and pagination controls when totalPages > 1', () => {
    render(
      <Pagination currentPage={2} totalPages={5} totalCount={50} pageSize={10} />
    );

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument(); // startItem
    expect(screen.getByText('20')).toBeInTheDocument(); // endItem
    expect(screen.getByText('50')).toBeInTheDocument(); // totalCount

    // Check page link 2 (active)
    const page2 = screen.getByText('2');
    expect(page2).toBeInTheDocument();
    expect(page2.className).toContain('from-cyan-500');
  });

  it('disables previous and first page buttons when on the first page', () => {
    render(
      <Pagination currentPage={1} totalPages={3} totalCount={30} pageSize={10} />
    );

    const firstPageLink = screen.getByTitle('First Page');
    const prevPageLink = screen.getByTitle('Previous Page');

    expect(firstPageLink.className).toContain('pointer-events-none');
    expect(prevPageLink.className).toContain('pointer-events-none');
  });

  it('disables next and last page buttons when on the last page', () => {
    render(
      <Pagination currentPage={3} totalPages={3} totalCount={30} pageSize={10} />
    );

    const nextPageLink = screen.getByTitle('Next Page');
    const lastPageLink = screen.getByTitle('Last Page');

    expect(nextPageLink.className).toContain('pointer-events-none');
    expect(lastPageLink.className).toContain('pointer-events-none');
  });
});
