// URL que proporcionaste
const url = "http://192.168.1.190:9182/metrics";

// Función para obtener y procesar las métricas
async function fetchAndProcessMetrics() {
    try {
        // Hacer la solicitud GET a la URL
        const response = await fetch(url);
        const text = await response.text();

        // Procesar las métricas y convertirlas a un objeto
        const metrics = {};

        // Dividir las líneas de texto y buscar las métricas go_gc_duration_seconds
        const lines = text.split("\n");
        lines.forEach(line => {
            const match = line.match(/go_gc_duration_seconds\{quantile="([^\"]+)"\} ([\d\.]+)/);
            if (match) {
                const quantile = match[1]; // El valor del quantile (por ejemplo: 0, 0.25, 0.5, etc.)
                const value = parseFloat(match[2]); // El valor numérico de la métrica
                metrics[quantile] = value;
            }
        });

        // Mostrar el resultado en formato JSON
        console.log(JSON.stringify(metrics, null, 4));

    } catch (error) {
        console.error("Error al obtener las métricas:", error);
    }
}

// Llamar a la función
fetchAndProcessMetrics();
