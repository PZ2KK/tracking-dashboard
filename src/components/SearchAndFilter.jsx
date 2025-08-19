import { useState } from 'react';
import Dropdown from './Dropdown';

export default function SearchAndFilter({ onSearch, onFilter, onSort, embedded = false }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'InTransit', label: 'In Transit' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Delayed', label: 'Delayed' },
    { value: 'Canceled', label: 'Canceled' },
    { value: 'Pending', label: 'Pending' },
  ];

  const sortOptions = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Name' },
    { value: 'startDate', label: 'Start Date' },
    { value: 'endDate', label: 'End Date' },
    { value: 'cost', label: 'Cost' },
    { value: 'votes', label: 'Votes' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    onFilter(value === 'all' ? '' : value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSort(value, sortOrder);
  };

  const handleOrderChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);
    onSort(sortBy, value);
  };

  return (
    <div className={`bg-white ${embedded ? '' : 'p-4 rounded-lg shadow mb-6'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Dropdown
          label="Status"
          options={statusOptions}
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val);
            onFilter(val === 'all' ? '' : val);
          }}
        />

        <Dropdown
          label="Sort By"
          options={sortOptions}
          value={sortBy}
          onChange={(val) => {
            setSortBy(val);
            onSort(val, sortOrder);
          }}
        />

        <Dropdown
          label="Order"
          options={[
            { value: 'asc', label: 'Ascending' },
            { value: 'desc', label: 'Descending' },
          ]}
          value={sortOrder}
          onChange={(val) => {
            setSortOrder(val);
            onSort(sortBy, val);
          }}
        />
      </div>
    </div>
  );
}
