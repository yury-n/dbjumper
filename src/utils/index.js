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