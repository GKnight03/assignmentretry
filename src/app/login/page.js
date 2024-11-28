export default function LoginPage({ onLoginSuccess }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let email = data.get('email');
    let pass = data.get('pass');

    setLoading(true);
    setError('');
    setSuccess(false);

    const apiUrl = '/api/login';
    const bodyData = { email, pass };

    runDBCallAsync(apiUrl, bodyData);
  };

  async function runDBCallAsync(url, bodyData) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        onLoginSuccess(); // Call parent function to navigate to the dashboard
      } else {
        setError('Invalid login credentials. Please try again.');
      }
    } catch (err) {
      setError('Error connecting to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm">
      {/* Existing login form */}
    </Container>
  );
}
