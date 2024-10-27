import { TextField, Select, MenuItem, Box, FormControl, InputLabel } from '@mui/material';

const TaskFilters = ({ filters, onFilterChange }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      gap={3}
      margin="0 auto"
      padding={2}
    >
      <TextField
        label="Search by title"
        name="title"
        variant="outlined"
        value={filters.title || ''}
        onChange={onFilterChange}
        fullWidth
      />

      <FormControl fullWidth variant="outlined">
        <InputLabel>Priority</InputLabel>
        <Select
          name="priority"
          value={['low', 'medium', 'high'].includes(filters.priority) ? filters.priority : ''}
          onChange={onFilterChange}
          label="Priority"
        >
          <MenuItem value="">All Priorities</MenuItem>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel>Sort By</InputLabel>
        <Select
          name="sortBy"
          value={filters.sortBy || 'createdAt'}
          onChange={onFilterChange}
          label="Sort By"
        >
          <MenuItem value="createdAt">Created At</MenuItem>
          <MenuItem value="priority">Priority</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel>Order</InputLabel>
        <Select
          name="order"
          value={['asc', 'desc'].includes(filters.order) ? filters.order : 'asc'}
          onChange={onFilterChange}
          label="Order"
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default TaskFilters;
