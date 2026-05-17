async function fetchHtml() {
  try {
    const res = await fetch('https://srilambo.vercel.app/');
    const text = await res.text();
    console.log('--- HTML Start ---');
    console.log(text);
    console.log('--- HTML End ---');
  } catch (err) {
    console.error('Fetch Error:', err instanceof Error ? err.message : err);
  }
}

fetchHtml();
