/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3908489092")

  // update collection data
  unmarshal({
    "updateRule": null
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3908489092")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id = createdBy"
  }, collection)

  return app.save(collection)
})
