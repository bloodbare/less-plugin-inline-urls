module.exports = function(less) {
    function InlineImages() {
        this._visitor = new less.visitors.Visitor(this);
    };

    InlineImages.prototype = {
        isReplacing: true,
        isPreEvalVisitor: true,
        run: function (root) {
            return this._visitor.visit(root);
        },
        visitRule: function (ruleNode, visitArgs) {
            this._inRule = true;
            return ruleNode;
        },
        visitRuleOut: function (ruleNode, visitArgs) {
            this._inRule = false;
        },
        visitUrl: function (URLNode, visitArgs) {
            if (!this._inRule) {
                return URLNode;
            }

            var fragmentStart = URLNode.currentFileInfo.filename.indexOf('?');
            var fragment2Start = URLNode.currentFileInfo.filename.indexOf('#');
            if (fragment2Start > fragmentStart && fragmentStart > -1) {
                URLNode.currentFileInfo.filename = URLNode.currentFileInfo.filename.slice(0, fragmentStart-1) + URLNode.currentFileInfo.filename.slice(fragment2Start, -1);
            } else if (fragmentStart > -1) {
                URLNode.currentFileInfo.filename = URLNode.currentFileInfo.filename.slice(0, fragmentStart-1);
            }

            return new less.tree.Call("data-uri", [URLNode.value], URLNode.index || 0, URLNode.currentFileInfo);
        }
    };
    return InlineImages;
};
