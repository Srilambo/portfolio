async function check() {
  try {
    const res = await fetch('https://srilambo.vercel.app/api/data');
    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch Error:', err instanceof Error ? err.message : err);
  }
}

check();
