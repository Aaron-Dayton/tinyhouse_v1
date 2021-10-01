import express from 'express';
import { listings } from "./listings"

const app = express();
const port = 9000;

app.use(express.json());

// listings
app.get("/listings", (_req, res) => {
  return res.send(listings);
});

// delete-listings
app.post("/delete-listing", (req, res) => {
  const id: string = req.body.id;
  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      return res.send(listings.splice(i, 1))
    }
  }

  return res.send("failed to delete listing")
});

app.listen(9000);

console.log(`[app]: http://localhost:${port}`);
