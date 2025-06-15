export async function GET(req: Request) {
  const dataUrl = req.body;
  console.log("\nDATA URL:", dataUrl, "\n");
  //   const res = await fetch("https://data.mongodb-api.com/...", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "API-Key": process.env.DATA_API_KEY,
  //     },
  //   });
  //   const data = await res.json();

  return Response.json({ msg: "ok" }, { status: 200 });
}
