/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3908489092")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = createdBy",
    "deleteRule": "@request.auth.id = createdBy",
    "listRule": "@request.auth.id = createdBy",
    "updateRule": "@request.auth.id = createdBy",
    "viewRule": "@request.auth.id = createdBy"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3908489092")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
