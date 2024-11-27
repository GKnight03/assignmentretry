export async function GET(req, res) {
    // Log to the console for debugging
    console.log("in the weather API page");

    try {
        // Fetch the weather data from the external API
        const res2 = await fetch('http://api.weatherapi.com/v1/current.json?key=7e1ff16f76c649fb832184436242510&q=Dublin&aqi=no');
        
        if (!res2.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await res2.json();

        // Log the temperature for debugging
        console.log(data.current.temp_c);

        // Get the current temperature
        let currentTemp = data.current.temp_c;

        // Return the temperature as a JSON response
        return res.json({ temp: currentTemp });

    } catch (err) {
        // Handle any errors that occurred during the fetch or processing
        console.error('Error:', err);
        return res.status(500).json({ message: 'Error fetching weather data', error: err.message });
    }
}
