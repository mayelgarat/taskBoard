import { Pagination, Select, MenuItem, Box } from '@mui/material';

const PaginationControls = ({ page, totalPages, onPageChange, limit, onLimitChange }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" marginTop={2}>
      <Select value={limit} onChange={onLimitChange}>
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
      </Select>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(event, value) => onPageChange(value)}
      />
    </Box>
  );
};

export default PaginationControls;
