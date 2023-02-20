var Test = /** @class */ (function () {
    function Test() {
    }
    Test.prototype.toSay = function (arg) {
        Test.target = arg;
    };
    return Test;
}());
