# mqtt-distance

．_XYZ2BLH(xyz1)---->直角坐標轉換成BLH(wgs84)經緯度坐標
    xyz1={
        X:data,
        Y:data,
        Z:data
      }
    
．blhtoXYZ(polygonPoints)---->BLH(wgs84)經緯度坐標轉換成直角坐標
    polygonPoints=[
        [longitude, latitude, height],
        [longitude, latitude, height],
        [longitude, latitude, height],
      ]
      
．weightedPoint(beaconLatLon, beaconAccuracy)---->以距離加權對三點定位之結果獲得平差後交點
    beaconLatLon={
        first: {
          x: 經轉換後x坐標,
          y: 經轉換後y坐標,
          z: 經轉換後z坐標,
        },
        second: {
          x: 經轉換後x坐標,
          y: 經轉換後y坐標,
          z: 經轉換後z坐標,
        },
        last: {
          x: 經轉換後x坐標,
          y: 經轉換後y坐標,
          z: 經轉換後z坐標,
        },
   }
   
   beaconAccuracy={
       first:第一個beacon與使用這距離(M)
       second: 第二個beacon與使用這距離(M)
       last:第三個beacon與使用這距離(M)
 
   }
    
