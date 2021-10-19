const data = [
    {
        major: 333,
        minor: 333,
        latitude: 24.17126437909835,
        longitude: 120.64181412436885,
        accuracy: 1.94,
    },
    {
        major: 666,
        minor: 666,
        latitude: 24.17117506181963,
        longitude: 120.64178998448874,
        accuracy: 28.04,
    },
    {
        major: 7,
        minor: 711,
        latitude: 24.171230755252594,
        longitude: 120.64174093167196,
        accuracy: 0.51,
    },
    {
        major: 7,
        minor: 111,
        latitude: 24.171237900553493,
        longitude: 120.64182502578589,
        accuracy: 0.31,
    },
];
//---testing data
const test = blhtoXYZ(data, 25);
const delta = weightedPoint(test, data);
console.log(_XYZ2BLH(delta));
//
function dataVaildation(data) {
    distanceValidation = 0; //distanceValidation>1   --->accuracy出現負值
    beaconIntersection = 0; //beaconIntersection>=3  --->出現的點未與三個接收站產生交點
    beaconLng = [];
    beaconLat = [];
    beaconDistance = [];
    for (var i = 0; i < data.length; i++) {
        beaconLng.push(data[i].longitude);
        beaconLat.push(data[i].latitude);
        if (data[i].accuracy < 0) {
            distanceValidation += 1;
        }
    }

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < beaconLng.length; j++) {
            const distance = Math.sqrt(
                (data[i].longitude - beaconLng[j]) ^
                (2 + (data[i].latitude - beaconLat[j])) ^
                2
            );
            beaconDistance.push(distance);
        }
    }
    beaconDistance = beaconDistance.filter(function (item) {
        return item !== 0;
    });
    for (var i = 0; i < beaconDistance.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (beaconDistance[i] > data[j].accuracy) {
                beaconIntersection += 1;
            }
        }
    }
    if (distanceValidation > 1) {
        return false, console.log("accuracy出現負值");
    } else if (beaconIntersection >= 3) {
        return false, console.log("出現的點未與三個接收站產生交點");
    } else {
        return true, console.log("有效輸入");
    }
}

function _XYZ2BLH(data) {
    var a = 6378135; //常半徑（須針對不同緯度下去做調整）
    var e2 = 0.006693421622966; //第一偏心率平方值
    const XYZData = [];
    try {
        var X = data[0];
        var Y = data[1];
        var Z = data[2];
        var L = (Math.atan(Y / X) * 180) / Math.PI;
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
        B = (B * 180) / Math.PI;
        var resultObj = [];
        resultObj.latitude = L;
        resultObj.longitude = 180 - B;
        resultObj.height = H;
        if (resultObj.B < 0) {
            resultObj.B = resultObj.B + 180;
        }
        if (resultObj.L < 0) {
            resultObj.L = resultObj.L + 180;
        }
        XYZData.push(resultObj);
        return XYZData;
    } catch (error) {
        console.log("直角坐標轉換經緯度失敗", error);
    }
}
function blhtoXYZ(data, height) {
    try {
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
                    1 -
                    e2 * Math.sin(blhObj.b * pi_180) * Math.sin(blhObj.b * pi_180)
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
        var arrlen = data.length;
        for (var i = 0; i < arrlen; i++) {
            var blhobj = {
                b: data[i].longitude,
                l: data[i].latitude,
                h: height,
            };

            var xyz = _BLH2XYZ(blhobj);
            var litarr = [xyz.X, xyz.Y, xyz.Z];
            newPolygonsArray.push(litarr);
        }
        return newPolygonsArray;
    } catch (error) {
        console.log("經緯度轉換直角坐標失敗", error);
    }
}
function weightedPoint(data, accuracy) {
    try {
        const aData = [];
        const bData = [];
        const wData = [];
        const adjustpoint = [];
        for (var i = 0; i < data.length - 1; i++) {
            aData[i] = [
                2 * (data[i][0] - data[data.length - 1][0]),
                2 * (data[i][1] - data[data.length - 1][1]),
            ];

            bData[i] = [
                data[i][0] ^
                (2 - data[data.length - 2][0]) ^
                (2 + data[i][1]) ^
                (2 - data[data.length - 2][1]) ^
                (2 + accuracy[data.length - 2].accuracy) ^
                (2 - accuracy[i].accuracy) ^
                2,
            ];
            wData[i] = [];
            for (var j = 0; j < data.length - 1; j++) {
                wData[i].push(0);
            }
            wData[i][i] = 1 / accuracy[i].accuracy;
        }
        const atw = math.multiply(math.transpose(aData), wData);
        const atwa = math.multiply(atw, aData);

        const atwainv = math.inv(atwa); //ata inv
        const atwainvat = math.multiply(atwainv, math.transpose(aData)); //ata inv*at
        const atwainvatw = math.multiply(atwainvat, wData);
        const atwainvatwb = math.multiply(atwainvatw, bData);
        adjustpoint.push(
            data[data.length - 1][0] - parseFloat(atwainvatwb[0]),
            data[data.length - 1][1] - parseFloat(atwainvatwb[1]),
            data[data.length - 1][2]
        );
        return adjustpoint;
    } catch (error) {
        console.log("平差失敗", error)
    }
}