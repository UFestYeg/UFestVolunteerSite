import log from 'loglevel';

// Set level based on environment variable
if (process.env.NODE_ENV === 'production') {
  log.setLevel('warn');
} else {
  log.setLevel('debug'); // or 'trace'
}

export default log;
