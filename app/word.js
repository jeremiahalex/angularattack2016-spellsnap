System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Word;
    return {
        setters:[],
        execute: function() {
            Word = (function () {
                function Word(x, y, content, downards) {
                    if (downards === void 0) { downards = false; }
                    this.x = x;
                    this.y = y;
                    this.isWord = this.isClaimed = false;
                    this.content = content;
                    this.downards = downards;
                }
                Word.prototype.length = function () {
                    return this.content.length;
                };
                Word.prototype.points = function () {
                    //for now points are 2^length
                    return Math.pow(2, this.length());
                };
                return Word;
            }());
            exports_1("Word", Word);
        }
    }
});
//# sourceMappingURL=word.js.map