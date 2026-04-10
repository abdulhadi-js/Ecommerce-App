import http from 'http';

async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/auth/callback/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "email=adi&password=wrong"
    });
    console.log("Status:", res.status);
  } catch (e) {
    console.error(e);
  }
}
test();
