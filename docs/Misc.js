function createArray(len) {
    var arr = new Array(len || 0),
        i = len;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--){ arr[len-1 - i] = createArray.apply(this, args);}
    }
    return arr;
}