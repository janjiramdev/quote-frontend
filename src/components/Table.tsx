import { useState, type ReactNode } from 'react';
import PaginateButton from './buttons/PaginateButton';

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  width?: string;
}

interface TableProps<T> {
  columns: readonly Column<T>[];
  rows: T[];
  rowKey: keyof T;
  renderActions?: (row: T, index: number) => ReactNode;
  isSearchAndSort?: boolean;
  searchBy?: string;
  setSearchBy?: (input: string) => void;
  sortBy?: string;
  setSortBy?: (input: string) => void;
  sortOptions?: string[];
  isPaginate?: boolean;
  page?: number;
  setPage?: (input: number) => void;
  totalPages?: number;
}

const ShortTermCell = ({ value }: { value: string }) => {
  const [showFullContent, setShowFullContent] = useState<boolean>(false);
  const formattedValue = value?.trim();

  return (
    <span
      onClick={() => setShowFullContent((prev) => !prev)}
      className="cursor-pointer break-all whitespace-normal "
      title={value}
    >
      {showFullContent
        ? formattedValue
        : formattedValue?.length < 80
          ? formattedValue
          : formattedValue.slice(0, 80) + '...'}
    </span>
  );
};

export default function Table<T>({
  columns,
  rows,
  rowKey,
  renderActions,
  isSearchAndSort = false,
  searchBy,
  setSearchBy,
  sortBy,
  setSortBy,
  sortOptions,
  isPaginate = false,
  page,
  setPage,
  totalPages,
}: TableProps<T>) {
  const cellClass =
    'px-4 py-3 text-center border border-gray-300 truncate max-w-[200px] whitespace-nowrap overflow-hidden';

  return (
    <>
      {isSearchAndSort && setSearchBy && setSortBy && sortOptions?.length ? (
        <div className="flex items-center w-full max-w-auto mx-auto mb-6 gap-x-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="flex-[7] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-[3] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {sortOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : undefined}

      <div className="overflow-x-auto rounded-lg shadow ">
        <table className="table-auto w-full border border-gray-300 divide-y divide-gray-200 text-sm ">
          <thead className="bg-gray-100 text-center text-gray-800 uppercase tracking-wider whitespace-nowrap ">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-2 text-center text-sm"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {rows.length > 0 ? (
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row, index) => (
                <tr
                  key={row[rowKey] ? String(row[rowKey]) : `row-${index}`}
                  className="hover:bg-gray-50"
                >
                  {columns.map((col) => {
                    if (col.key === 'actions')
                      return (
                        <td
                          key={'actions'}
                          className="px-6 py-4 text-center border border-gray-300"
                          style={{ width: col.width }}
                        >
                          {renderActions ? (
                            renderActions(row, index)
                          ) : (
                            <div className="flex justify-center gap-2"></div>
                          )}
                        </td>
                      );

                    const rawValue = row[col.key as keyof T];
                    let displayValue: ReactNode;

                    if (col.key === 'content' && typeof rawValue === 'string')
                      displayValue = <ShortTermCell value={rawValue} />;
                    else displayValue = String(rawValue ?? '-');

                    return (
                      <td key={String(col.key)} className={cellClass}>
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          ) : undefined}
        </table>
      </div>

      {isPaginate && page && setPage && totalPages ? (
        <div className="mt-6 flex justify-center items-center space-x-4">
          <PaginateButton
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </PaginateButton>

          <span>
            Page {page} of {totalPages}
          </span>

          <PaginateButton
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </PaginateButton>
        </div>
      ) : undefined}
    </>
  );
}
