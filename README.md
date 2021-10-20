# mqtt-distance
##### test.html直接使用Live Server跑就可以
##### 沒有使用node modules import math(矩陣計算)的原因是因為需要使用webpack or express...etc啟用server才能正常使用，所以寫了test.html用cdn方式引用math的包
*   ### _XYZ2BLH(data)直角坐標轉換成BLH(wgs84)經緯度坐標  
    ```
    data=[  
        X,  
        Y,  
        Z  
      ]
    ```
      
*   ### blhtoXYZ(data, height)BLH(wgs84)經緯度坐標轉換成直角坐標  
    ```
    data=[  
        {longitude:longitude, latitude:latitude},  
        {longitude:longitude, latitude:latitude},  
        {longitude:longitude, latitude:latitude}, 
                           ...
      ]
      
    height=Float
    ```
        
*   ### weightedPoint(data, accuracy)以距離加權對三點定位之結果獲得平差後交點  
    ```
    beaconLatLon=[  
         [  
          x(經轉換後x坐標),  
          y(經轉換後y坐標),  
          z(經轉換後z坐標),  
        ],  
         [  
          x(經轉換後x坐標),  
          y(經轉換後y坐標),  
          z(經轉換後z坐標),  
        ], 
                 [  
          x(經轉換後x坐標),  
          y(經轉換後y坐標),  
          z(經轉換後z坐標),  
        ], 
        ....
     ],
     beaconAccuracy= [
        float,
        float,
        float
         ...
     ] 
 
       
       ```
   

    

