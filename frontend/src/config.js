// ************************************************************
//   DON'T CHANGE ENVS. THESE AREN'T INCLUDED IN ANY PUSHES SO
//    EACH RESPECTIVE .ENV (SERVER/LOCAL) WILL REMAIN CORRECT
//    WITHOUT ANY MANUAL UPDATES OT THESE FILES.
// ************************************************************
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173'; // local development
  // const API_URL = ''; // server production
export { API_URL };