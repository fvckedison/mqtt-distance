function dataVaildation(accuracy, point) {
    const aDistance = accuracy.a;
    const bDistance = accuracy.b;
    const cDistance = accuracy.c;
    const abDistance = math.sqrt((point.a.x - point.b.x) ^ 2 + (point.a.y - point.b.y) ^ 2)
    const acDistance = math.sqrt((point.a.x - point.c.x) ^ 2 + (point.a.y - point.c.y) ^ 2)
    const bcDistance = math.sqrt((point.c.x - point.b.x) ^ 2 + (point.c.y - point.b.y) ^ 2)
    if (aDistance || bDistance || cDistance < 0) {
        return false, console.log("accuracy出現負值")
    } else if ((aDistance < abDistance || acDistance || bcDistance) && (bDistance < abDistance || acDistance || bcDistance) && (cDistance < abDistance || acDistance || bcDistance)) {
        return false, console.log("出現的點未與三個接收站產生交點")
    } else { return ture }
}
function _XYZ2BLH(xyz1) {
    var a = 6378135;
    var e2 = 0.006693421622966; //第一偏心率平方值
    var X = xyz1.X;
    var Y = xyz1.Y;
    var Z = xyz1.Z;
    var L = Math.atan(Y / X) * 180 / Math.PI;
    var B = Math.atan(Z / Math.sqrt(X * X + Y * Y));
    while (true) {
        //迭代计算
        var N = a / Math.sqrt(1 - e2 * Math.sin(B) * Math.sin(B));
        var tempB = Math.atan(
            (N * e2 * Math.sin(B) + Z) / Math.sqrt(X * X + Y * Y)
        );
        B = Math.atan(
            (Z + N * e2 * Math.sin(tempB)) / Math.sqrt(X * X + Y * Y)
        );
        if (tempB == B) {
            break;
        }
    }
    var H = Z / Math.sin(B) - N * (1 - e2);
    B = B * 180 / Math.PI;
    var resultObj = {};
    resultObj.L = L;
    resultObj.B = 180 - B;
    resultObj.H = H;
    if (resultObj.B < 0) {
        resultObj.B = resultObj.B + 180;
    }
    if (resultObj.L < 0) {
        resultObj.L = resultObj.L + 180;
    }
    return resultObj;
}
const xyz1 = {
    X: -2973108.1352892383,
    Y: -1334366.8293782612,
    Z: 5464405.507574263,
};

function blhtoXYZ(polygonPoints) {
    function _BLH2XYZ(blhObj) {
        //将大地坐标喜欢换为空间直角坐标系
        var pi_180 = Math.PI / 180;
        var projectionTypes = {};
        projectionTypes.bj54 = {
            a: 6378245, //长半轴
            e2: 0.006693421622966, //第一偏心率平方
        };
        projectionTypes.wgs84 = {
            a: 6378135, //长半轴
            e2: 0.00669437999013, //第一偏心率平方
        };
        var e2 = 0.00669437999013;
        // var a = projectionTypes[projectionType].a;//长半轴
        var a = 6378135; //长半轴
        var N =
            a /
            Math.sqrt(
                1 - e2 * Math.sin(blhObj.b * pi_180) * Math.sin(blhObj.b * pi_180)
            );
        var X =
            (N + blhObj.h) *
            Math.cos(blhObj.b * pi_180) *
            Math.cos(blhObj.l * pi_180);
        var Y =
            (N + blhObj.h) *
            Math.cos(blhObj.b * pi_180) *
            Math.sin(blhObj.l * pi_180);
        var Z = [N * (1 - e2) + blhObj.h] * Math.sin(blhObj.b * pi_180);
        var resultObj = {};
        resultObj.X = X;
        resultObj.Y = Y;
        resultObj.Z = Z;
        return resultObj;
    }

    var newPolygonsArray = [];
    var arrlen = polygonPoints.length;

    for (var i = 0; i < arrlen; i++) {
        var temp = polygonPoints[i].push(0);
        var blhobj = {
            b: polygonPoints[i][0],
            l: polygonPoints[i][1],
            h: polygonPoints[i][2],
        };
        var xyz = _BLH2XYZ(blhobj);
        var litarr = [xyz.X, xyz.Y, xyz.Z];
        newPolygonsArray.push(litarr);
    }
    return newPolygonsArray;
}
function weightedPoint(beaconLatLon, beaconAccuracy) {
    const a = [
        [
            2 * (beaconLatLon.first.x - beaconLatLon.last.x),
            2 * (beaconLatLon.first.y - beaconLatLon.last.y),
        ],
        [
            2 * (beaconLatLon.second.x - beaconLatLon.last.x),
            2 * (beaconLatLon.second.y - beaconLatLon.last.y),
        ],
    ];
    const b = [
        [
            beaconLatLon.first.x ^
            (2 - beaconLatLon.last.x) ^
            (2 + beaconLatLon.first.y) ^
            (2 - beaconLatLon.last.y) ^
            (2 + beaconAccuracy.last) ^
            (2 - beaconAccuracy.first) ^
            2,
        ],
        [
            beaconLatLon.second.x ^
            (2 - beaconLatLon.last.x) ^
            (2 + beaconLatLon.second.y) ^
            (2 - beaconLatLon.last.y) ^
            (2 + beaconAccuracy.last) ^
            (2 - beaconAccuracy.second) ^
            2,
        ],
    ];
    const w = [
        [1 / beaconAccuracy.first, 0],
        [0, 1 / beaconAccuracy.second],
    ];
    const atw = math.multiply(math.transpose(a), w);
    const atwa = math.multiply(atw, a);
    const atwainv = math.inv(atwa); //ata inv
    const atwainvat = math.multiply(atwainv, math.transpose(a)); //ata inv*at
    const atwainvatw = math.multiply(atwainvat, w);
    const atwainvatwb = math.multiply(atwainvatw, b);
    const adjustpoint = {
        X: beaconLatLon.last.x - parseFloat(atwainvatwb[0]),
        Y: beaconLatLon.last.y - parseFloat(atwainvatwb[1]),
        Z: beaconLatLon.last.z
    };
    return adjustpoint;
}