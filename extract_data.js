
var ndvi_image_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
                  .filterDate('2021-01-01', '2022-12-31')
                  .map(function(image){return image.clip(geometry)})
                  .filterBounds(geometry);
                  
// Map.addLayer(image)
// console.log(image)

// console.log(ndvi_image_collection.first().geometry().centroid())

var addNDVI = function(image) {
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
};


var collectionWithNDVI = ndvi_image_collection.map(addNDVI);

var createNDVITable = function(image) {
  var ndviValue = image.select('NDVI').reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: image.geometry().centroid(),
    scale: 30
  }).get('NDVI');
  
  return ee.Feature(null, {
    'system:time_start': image.get('system:time_start'),
    'NDVI': ndviValue
  });
};

var collectionWithNDVITable = collectionWithNDVI.map(createNDVITable);


console.log(collectionWithNDVITable)



// Export.table.toDrive({
//     collection: collectionWithNDVI,
//     description: 'kampala_ndvi',
//     folder: 'data_nerds',
//     fileNamePrefix: 'ndvi_time_series_multiple',
//     fileFormat: 'CSV'
// })
