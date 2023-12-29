
var ndvi_image_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
                  .filterDate('2021-01-01', '2022-12-31')
                  .map(function(image){return image.clip(geometry)})
                  .filterBounds(geometry);
                  
// Map.addLayer(image)
// console.log(image)

// console.log(ndvi_image_collection.first().geometry().centroid())

var addNDVI = function(image) {
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  
}

var collectionWithNDVI = ndvi_image_collection.map(addNDVI);

var addNDVIimage = function(image) {
  // var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  
  var ndviValue = image.select('NDVI').reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: roi,
    scale: 30
  }).get('NDVI');
  
  return ee.Feature(null, {
    'system:time_start': image.get('system:time_start'),
    'NDVI': ndvi
  });
};

var collectionWithNDVI = ndvi_image_collection.map(addNDVIimage);

// // var ndviTable = collectionWithNDVI.select(['NDVI'])
// //   .reduceColumns({
// //     reducer: ee.Reducer.toList(),
// //     selectors: ['system:time_start']
// //   });

console.log(collectionWithNDVI)




// Export.table.toDrive({
//     collection: collectionWithNDVI,
//     description: 'kampala_ndvi',
//     folder: 'data_nerds',
//     fileNamePrefix: 'ndvi_time_series_multiple',
//     fileFormat: 'CSV'
// })

// BELOW IS THE EXAMPLE
// var point = ee.Geometry.Point([-122.292, 37.9018]);

// // Import the Landsat 8 TOA image collection.
// var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA');

// // Get the least cloudy image in 2015.
// var image = ee.Image(
//   l8.filterBounds(point)
//     .filterDate('2015-01-01', '2015-12-31')
//     .sort('CLOUD_COVER')
//     .first()
// );

// var nir = image.select('B5');
// var red = image.select('B4');
// var ndvi = nir.subtract(red).divide(nir.add(red)).rename('NDVI');

// // Display the result.
// Map.centerObject(image, 9);
// var ndviParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};
// Map.addLayer(ndvi, ndviParams, 'NDVI image');