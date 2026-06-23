async function main() {
  const url = 'http://localhost:3000/api/auth/login';
  const body = {
    email: 'rhr3032@yahoo.com',
    password: 'rhr3032',
    rememberMe: false
  };

  console.log("Sending POST to", url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log("Response text:", text);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

main();
