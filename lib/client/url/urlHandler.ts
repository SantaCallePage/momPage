import os from 'os';
const networkInterfaces = os.networkInterfaces();

function getLocalIp(){
  // Filtrar para encontrar la dirección IPv4 externa
  var localIp = "";    
  if (Object != undefined){
      const values = Object.values(networkInterfaces).flat();
      for(let v of values){
        if(v?.family === 'IPv4' && !v.internal){
           localIp = v.address;
        }
      }
    }

      return localIp;
}
function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://${getLocalIp()}:3000`;
}