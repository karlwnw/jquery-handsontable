(function(Handsontable){

  'use strict';

  var clonableWRAPPER = document.createElement('DIV');
  clonableWRAPPER.className = 'htAutocompleteWrapper';

  var clonableTextWRAPPER = document.createElement('DIV');
  clonableTextWRAPPER.className = 'selected';

  var clonableARROW = document.createElement('DIV');
  clonableARROW.className = 'htAutocompleteArrow';
  clonableARROW.appendChild(document.createTextNode('\u25BC'));

  var wrapTdContentWithDiv = function(TD, WRAPPER){
    WRAPPER.innerHTML = TD.innerHTML;
    Handsontable.Dom.empty(TD);
    TD.appendChild(WRAPPER);
  };

  var SelectRenderer = function (instance, TD, row, col, prop, value, cellProperties) {

    var WRAPPER = clonableWRAPPER.cloneNode(true); //this is faster than createElement
    var ARROW = clonableARROW.cloneNode(true); //this is faster than createElement
    var textWRAPPER = clonableTextWRAPPER.cloneNode(true);

    if (value !== null) {
      value = cellProperties.selectOptions[value];
      //instance.view.wt.wtDom.fastInnerHTML(TD, value);
    }
    Handsontable.renderers.TextRenderer(instance, TD, row, col, prop, value, cellProperties);

    wrapTdContentWithDiv(TD, textWRAPPER);

    TD.appendChild(ARROW);
    Handsontable.Dom.addClass(TD, 'htAutocomplete');

    if (!TD.firstChild) { //http://jsperf.com/empty-node-if-needed
      //otherwise empty fields appear borderless in demo/renderers.html (IE)
      TD.appendChild(document.createTextNode('\u00A0')); //\u00A0 equals &nbsp; for a text node
      //this is faster than innerHTML. See: https://github.com/warpech/jquery-handsontable/wiki/JavaScript-&-DOM-performance-tips
    }

    if (!instance.acArrowListener) {
      //not very elegant but easy and fast
      instance.acArrowListener = function () {
        instance.view.wt.getSetting('onCellDblClick');
      };
      instance.rootElement.on('mousedown', '.htAutocomplete', instance.acArrowListener); //this way we don't bind event listener to each arrow. We rely on propagation instead
    }
  };

  Handsontable.SelectRenderer = SelectRenderer;
  Handsontable.renderers.SelectRenderer = SelectRenderer;
  Handsontable.renderers.registerRenderer('select', SelectRenderer);

})(Handsontable);