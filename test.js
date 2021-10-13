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
        [118.22166324000011, 33.940180132000084, 27],
        [118.22166694800001, 33.940138392000051, 27],
        [118.22167282000009, 33.940096924000045, 27],
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
