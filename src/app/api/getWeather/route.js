export async function GET(req, res) {
    console.log("in the weather API page");

    try {
        // Use the native `fetch` available in Next.js
        const weatherResponse = await fetch('http://api.weatherapi.com/v1/current.json?key=7e1ff16f76c649fb832184436242510&q=Dublin&aqi=no');
        
        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await weatherResponse.json();

        // Log the temperature for debugging
        console.log(data.current.temp_c);

        // Get the current temperature
        const currentTemp = data.current.temp_c;

        // Return the temperature as a JSON response
        return res.json({ temp: currentTemp });

    } catch (err) {
        // Handle any errors
        console.error('Error:', err);
        return res.status(500).json({ message: 'Error fetching weather data', error: err.message });
    }
}
