import { useState, useEffect } from 'react';
import { InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './SearchBar.module.css';
import { useDebounce } from '../../../hooks/useDebounce';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Поиск по названию или артикулу...',
  delay = 400,
}) {
  const [inputValue, setInputValue] = useState(value || '');

  const debouncedValue = useDebounce(inputValue, delay);

  useEffect(() => {
    if (onChange) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <Paper className={styles.root} elevation={0}>
      <IconButton size="small" disabled>
        <SearchIcon fontSize="small" />
      </IconButton>

      <InputBase
        className={styles.input}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'поиск' }}
      />

      {inputValue && (
        <IconButton size="small" onClick={handleClear}>
          <ClearIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );
}