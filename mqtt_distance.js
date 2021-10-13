function intersection(c1, c2) {
    // Start constructing the response object.
    const result = {
        intersect_count: 0,
        intersect_occurs: true,
        one_is_in_other: false,
        are_equal: false,
        point_1: { x: null, y: null },
        point_2: { x: null, y: null },
    };

    // Get vertical and horizontal distances between circles.
    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;

    // Calculate the distance between the circle centers as a straight line.
    const dist = Math.hypot(dy, dx);

    // Check if circles intersect.
    if (dist > c1.r + c2.r) {
        result.intersect_occurs = false;
    }

    // Check one circle isn't inside the other.
    if (dist < Math.abs(c1.r - c2.r)) {
        result.intersect_occurs = false;
        result.one_is_in_other = true;
    }

    // Check if circles are the same.
    if (c1.x === c2.x && c1.y === c2.y && c1.r === c2.r) {
        result.are_equal = true;
        result.are_equal = true;
    }

    // Find the intersection points
    if (result.intersect_occurs) {
        // Centroid is the pt where two lines cross. A line between the circle centers
        // and a line between the intersection points.
        const centroid = (c1.r * c1.r - c2.r * c2.r + dist * dist) / (2.0 * dist);

        // Get the coordinates of centroid.
        const x2 = c1.x + (dx * centroid) / dist;
        const y2 = c1.y + (dy * centroid) / dist;

        // Get the distance from centroid to the intersection points.
        const h = Math.sqrt(c1.r * c1.r - centroid * centroid);

        // Get the x and y dist of the intersection points from centroid.
        const rx = -dy * (h / dist);
        const ry = dx * (h / dist);

        // Get the intersection points.
        result.point_1.x = Number((x2 + rx).toFixed(15));
        result.point_1.y = Number((y2 + ry).toFixed(15));

        result.point_2.x = Number((x2 - rx).toFixed(15));
        result.point_2.y = Number((y2 - ry).toFixed(15));

        // Add intersection count to results
        if (result.are_equal) {
            result.intersect_count = null;
        } else if (result.point_1.x === result.point_2.x && result.point_1.y === result.point_2.y) {
            result.intersect_count = 1;
        } else {
            result.intersect_count = 2;
        }
    }
    return result;
}
// [{“minor”:333,“rssi”:-54,“major”:333,“proximity”:“ProximityNear”,“accuracy”:0.47,“uuid”:“015E2CC7-D3F0-4275-B67B-2F930DD63013"},{“minor”:711,“rssi”:-44,“major”:7,“proximity”:“ProximityNear”,“accuracy”:0.64,“uuid”:“015E2CC7-D3F0-4275-B67B-2F930DD63013"},{“minor”:666,“rssi”:-58,“major”:666,“proximity”:“ProximityNear”,“accuracy”:0.83,“uuid”:“015E2CC7-D3F0-4275-B67B-2F930DD63013"},{“minor”:713,“rssi”:-56,“major”:7,“proximity”:“ProximityFar”,“accuracy”:3.24,“uuid”:“015E2CC7-D3F0-4275-B67B-2F930DD63013"}]}]]
const beaconAccuracy = {
    beacon666: 3.83,//0.3-5.6
    beacon333: 2.47,
    beacon711: 5.64
}
const beaconLatLon = {
    beacon666: { x: 120.64178998448874, y: 24.17117506181963 },
    beacon333: { x: 120.64181412436885, y: 24.17126437909835 },
    beacon711: { x: 120.64174093167196, y: 24.171230755252594 }
}
const distance=Math.sqrt((-2973109.400933985-(-2973109.4316711384))^2+(-1334370.90434703-(-1334376.4864563972))^2)
console.log(distance)
// console.log(beaconLatLon.beacon666)

const data = intersection(
    { x: -2973109.400933985, y: -1334370.90434703, r: beaconAccuracy.beacon666 },
    { x: -2973109.4316711384, y: -1334376.4864563972, r: beaconAccuracy.beacon333 }
)
const data2 = intersection(
    { x: -2973103.814546414, y: -1334371.86919484, r: beaconAccuracy.beacon711 },
    { x: -2973109.4316711384, y: -1334376.4864563972, r: beaconAccuracy.beacon333 }
)
console.log(data, data2)

var polygonPoints =
[
    [beaconLatLon.beacon666.x, beaconLatLon.beacon666.y],
    [beaconLatLon.beacon333.x, beaconLatLon.beacon333.y],
    [beaconLatLon.beacon711.x, beaconLatLon.beacon711.y]
];

//大地坐標轉直角坐標
// function blhtoXYZ(polygonPoints){
//     function _BLH2XYZ (blhObj) {//将大地坐标喜欢换为空间直角坐标系
//         var pi_180 = Math.PI / 180;
//         var projectionTypes = {};
//         projectionTypes.bj54 = {
//             a: 6378245,//长半轴
//             e2: 0.006693421622966//第一偏心率平方
//         };
//         projectionTypes.wgs84 = {
//             a: 6378135,//长半轴
//             e2: 0.00669437999013//第一偏心率平方
//         };
//         var e2 = 0.00669437999013;
//         // var a = projectionTypes[projectionType].a;//长半轴
//         var a = 6378135;//长半轴
//         var N = a / Math.sqrt(1 - e2 * Math.sin(blhObj.b * pi_180) * Math.sin(blhObj.b * pi_180));
//         var X = (N + blhObj.h) * Math.cos(blhObj.b * pi_180) * Math.cos(blhObj.l * pi_180);
//         var Y = (N + blhObj.h) * Math.cos(blhObj.b * pi_180) * Math.sin(blhObj.l * pi_180);
//         var Z = [N * (1 - e2) + blhObj.h] * Math.sin(blhObj.b * pi_180);
//         var resultObj = {};
//         resultObj.X = X;
//         resultObj.Y = Y;
//         resultObj.Z = Z;
//         return resultObj;
//     }
    
//     var newPolygonsArray = [];
//     var arrlen = polygonPoints.length;
    
//     for (var i = 0; i < arrlen; i++) {
//         // console.log(polygonPoints[i])
//         var temp = polygonPoints[i].push(0);
//         var blhobj = { b: polygonPoints[i][0], l: polygonPoints[i][1], h: polygonPoints[i][2] };
//         var xyz = _BLH2XYZ(blhobj);
//         var litarr = [xyz.X, xyz.Y];
//         newPolygonsArray.push(litarr);
//     }
//     return newPolygonsArray        
// }
// const aa=blhtoXYZ(polygonPoints)//aa[0][0]--->第一筆資料的x     aa[0][1]--->第一筆資料的y以此類推
// console.log(aa[0][0],aa[0][1])

