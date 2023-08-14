import * as express from "express";

import { sequelize } from "./db";
import { Shop } from "./db/models";
import { index } from "./lib/algolia";

const app = express();
const port = process.env.PORT || 2000;

app.use(express.json());

app.post("/shops", async (req, res) => {
  const shop = await Shop.create(req.body);

  index.saveObject({
    objectID: shop.get("id"),
    name: shop.get("name"),
    _geoloc: {
      lat: shop.get("lat"),
      lng: shop.get("lng"),
    },
  });

  res.json(shop);
});

app.get("/shops", async (req, res) => {
  const shops = await Shop.findAll();

  res.json(shops);
});

app.get("/shops/:id", async (req, res) => {
  const shop = await Shop.findByPk(req.params.id);

  res.json(shop);
});

app.get("/shops-near", async (req, res) => {
  const { lat, lng } = req.query;

  const shopsFound = await index.search("", {
    aroundLatLng: `${lat}, ${lng}`,
    aroundRadius: 10000,
  });

  res.json(shopsFound.hits);
});

app.put("/shops/:id", async (req, res) => {
  const shop = await Shop.update(req.body, { where: { id: req.params.id } });

  index.partialUpdateObject(
    { ...req.body, objectID: req.params.id },
    {
      createIfNotExists: false,
    }
  );

  res.json(shop);
});

app.listen(port, () => {
  console.log(`running server on port ${port}`);
});
