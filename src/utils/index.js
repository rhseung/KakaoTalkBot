exports.isConstructor = (fn) => {
    try {
        new fn();
        return true;
    } catch (e) {
        return false;
    }
};