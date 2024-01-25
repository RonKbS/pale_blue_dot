
var ndvi_image_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
                  .filterDate('2012-01-01', '2023-12-31')
                  .map(function(image){
                    // return image.reproject('EPSG:3857', null, 30).clip(geometry)
                    return image.clip(geometry2)
                  })
                  .filterBounds(geometry2);
                  
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
  
  return ee.Feature(image.geometry().centroid(), {
    'system:time_start': image.get('system:time_start'),
    'NDVI': ndviValue
  });
};

var collectionWithNDVITable = collectionWithNDVI.map(createNDVITable);


console.log(collectionWithNDVITable)



Export.table.toDrive({
    collection: collectionWithNDVITable,
    description: 'kampala_ndvi_with_points',
    folder: 'data_nerds',
    fileNamePrefix: 'ndvi_time_series_multiple_with_points_smaller_bound',
    fileFormat: 'CSV'
})
