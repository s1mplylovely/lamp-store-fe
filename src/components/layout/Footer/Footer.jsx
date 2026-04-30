import { Box, Typography, Divider } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <Box component="footer" className={styles.footer}>
      <Box className={styles.content}>
        <Box className={styles.contacts}>
          <Box className={styles.contactItem}>
            <PhoneIcon fontSize="small" />
            <Typography variant="body2">+7 (800) 555-35-35</Typography>
          </Box>
          <Divider orientation="vertical" flexItem className={styles.divider} />
          <Box className={styles.contactItem}>
            <EmailIcon fontSize="small" />
            <Typography variant="body2">info@lampstore.ru</Typography>
          </Box>
          <Divider orientation="vertical" flexItem className={styles.divider} />
          <Box className={styles.contactItem}>
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2">г. Москва</Typography>
          </Box>
        </Box>
      </Box>
      <Typography variant="caption" className={styles.copy}>
        © {new Date().getFullYear()} ЗАВОД ЛАМПОЧЕК
      </Typography>
    </Box>
  );
}
