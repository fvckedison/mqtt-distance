var _180_pi = 180 / Math.PI;
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
const distance = Math.sqrt((-2973109.400933985 - (-2973109.4316711384)) ^ 2 + (-1334370.90434703 - (-1334376.4864563972)) ^ 2)
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


function _XYZ2BLH(xyz1){
    var a = 6378135;
    var e2 = 0.006693421622966;//第一偏心率平方值
    var X = xyz1.X;
    var Y = xyz1.Y;
    var Z = xyz1.Z;
    var L = Math.atan(Y / X) * _180_pi;
    var B = Math.atan(Z / Math.sqrt(X * X + Y * Y));
    while(true){//迭代计算
        var N = a / Math.sqrt(1 - e2 * Math.sin(B) * Math.sin(B));
        var tempB = Math.atan((N  * e2 * Math.sin(B) + Z ) / Math.sqrt(X * X + Y * Y ));
        B = Math.atan((Z + N * e2 * Math.sin(tempB)) / Math.sqrt(X * X + Y * Y ));
        if(tempB == B){
            break;
        }
    }
    var H = Z / Math.sin(B) - N * (1 - e2);
    B = B * _180_pi;
    var resultObj = {};
    resultObj.L = L;
    resultObj.B = B;
    resultObj.H = H;
    if( resultObj.B < 0 ){
        resultObj.B = resultObj.B + 180;
    }
    if(resultObj.L < 0 ){
        resultObj.L = resultObj.L + 180;
    }
    return resultObj;
}
const xyz1 = {
    X: -2973108.1352892383,
    Y: -1334366.8293782612,
    Z: 5464405.507574263
}
const aa=_XYZ2BLH(xyz1)
console.log(aa)