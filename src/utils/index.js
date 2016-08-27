export const focusWithoutScroll = (elem) => {
    var x = window.scrollX, y = window.scrollY;
    elem.focus();
    window.scrollTo(x, y);
};

export const getQueryInputClientWidth = (query) => {
    const queryInputNode = document.createElement('DIV');
    queryInputNode.className = 'query-input';
    queryInputNode.innerHTML = query;
    queryInputNode.style.position = 'absolute';
    queryInputNode.style.left = '-9999px';
    queryInputNode.style.width = 'auto';
    queryInputNode.style.borderRight = 'none';
    document.body.appendChild(queryInputNode);
    const clientWidth = queryInputNode.clientWidth;
    document.body.removeChild(queryInputNode);
    return clientWidth;
};

export const getIndexInParent = (node) => {
    var children = node.parentNode.childNodes;
    var num = 0;
    for (var i=0; i<children.length; i++) {
        if (children[i]==node) return num;
        if (children[i].nodeType==1) num++;
    }
    return -1;
};

export const findNearestQuerySeparator = (query, offset, direction) => {
    const possibleSeparators = ['=', '.', ';', '+', '(', ')'];
    const nearest = findNearestOccurrence(possibleSeparators, query, offset, direction);
    return {
        separator: nearest.occurrence,
        offset: nearest.offset
    }
};

export const findNearestOccurrence = (needle, haystack, offset, direction) => {

    const needles = Array.isArray(needle) ? needle: [needle];

    if ((direction == 'left' && offset === 0)  // nothing to the left
        || (direction == 'right' && offset === haystack.length)) { // nothing on the right

        return {separator: null, offset: null};
    }

    let queryPartFromOffset;
    if (direction == 'left') {
        queryPartFromOffset = haystack.slice(0, offset);
    } else {  // right
        queryPartFromOffset = haystack.slice(offset, haystack.length);
    }

    let nearestOccurrence = null;
    let nearestOccurrenceOffset = null;
    needles.forEach(needle => {
        let indexOfFunc = (direction == 'left' ? 'lastIndexOf' : 'indexOf');
        let currentSeparatorOffset = queryPartFromOffset[indexOfFunc](needle);
        if (currentSeparatorOffset === -1) {
            return; // to the next item to lookup for
        }
        if (nearestOccurrenceOffset === null) {
            nearestOccurrence = needle;
            nearestOccurrenceOffset = currentSeparatorOffset;
            return; // to the next item to lookup for
        }
        if ((direction == 'left' && currentSeparatorOffset > nearestOccurrenceOffset)
            || (direction == 'right' && currentSeparatorOffset < nearestOccurrenceOffset)) {
            nearestOccurrence = needle;
            nearestOccurrenceOffset = currentSeparatorOffset;
        }
    });
    if (nearestOccurrence !== null && direction == 'right') {
        nearestOccurrenceOffset += offset;
    }

    return {occurrence: nearestOccurrence, offset: nearestOccurrenceOffset};
};