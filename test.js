// 坐標轉換  WGS84經緯度 => 大地坐標系BLH  XYZ

var pi_180 = Math.PI / 180;
var _180_pi = 180 / Math.PI;
var projectionTypes = {};
projectionTypes.bj54 = {
    a: 6378245,//長半軸
    e2: 0.006693421622966//第一偏心率平方
};
projectionTypes.wgs84 = {
    a: 6378135,//長半軸
    e2: 0.00669437999013//第一偏心率平方
};

var myparams = {
    dx: 31.4,
    dy: -144.3,
    dz: -74.8,
    rx: 0,
    ry: 0,
    rz: 0.814,
    m: -0.38
};
function _BLH2XYZ(blhObj) {//將大地坐標喜歡換為空間直角坐標系
    // var e2 = projectionTypes[projectionType].e2;//第一偏心率平方值
    var e2 = 0.00669437999013;
    // var a = projectionTypes[projectionType].a;//長半軸
    var a = 6378135;//長半軸
    var N = a / Math.sqrt(1 - e2 * Math.sin(blhObj.b * pi_180) * Math.sin(blhObj.b * pi_180));
    var X = (N + blhObj.h) * Math.cos(blhObj.b * pi_180) * Math.cos(blhObj.l * pi_180);
    var Y = (N + blhObj.h) * Math.cos(blhObj.b * pi_180) * Math.sin(blhObj.l * pi_180);
    var Z = [N * (1 - e2) + blhObj.h] * Math.sin(blhObj.b * pi_180);
    var resultObj = {};
    resultObj.X = X;
    resultObj.Y = Y;
    resultObj.Z = Z;
    return resultObj;
}
var polygonPoints =
    [
        [120.64178998448874, 24.17117506181963, 27],
        [120.64181412436885, 24.17126437909835 , 27],
        [120.64174093167196, 24.171230755252594, 27],
    ];
var newPolygonsArray = [];
var arrlen = polygonPoints.length;
console.log(111, arrlen)
for (var i = 0; i < arrlen; i++) {
    // console.log(polygonPoints[i])
    var temp = polygonPoints[i].push(0);
    var blhobj = { b: polygonPoints[i][0], l: polygonPoints[i][1], h: polygonPoints[i][2] };
    var xyz = _BLH2XYZ(blhobj);
    console.log(xyz)
    var litarr = [xyz.X, xyz.Y,xyz.Z];
    newPolygonsArray.push(litarr);
}
console.log("----", newPolygonsArray)
for (let i = 0; i < newPolygonsArray.length; i++) {
    console.log(newPolygonsArray[i])
}


function _XYZ2BLH(xyz1){
    var a = 6378135;
    var e2 = 0.006693421622966;//第一偏心率平方值
    var X = xyz1.X;
    var Y = xyz1.Y;
    var Z = xyz1.Z;
    var L = Math.atan(Y / X) * 180 / Math.PI;
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
const aaxyz=_XYZ2BLH({
    X:-2973121.9555147216,
    Y:-1334376.5390092612,
    Z:5464402.722454134
})
console.log(aaxyz)