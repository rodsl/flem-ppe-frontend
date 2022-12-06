export function dynamicSort(property, valueType = String) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  if (valueType === Number) {
    return function (a, b) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      const param1 = a[property];
      const param2 = b[property];
      var result = param1 < param2 ? -1 : param1 > param2 ? 1 : 0;
      return result * sortOrder;
    };
  } else {
    return function (a, b) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      const param1 = a[property]
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
      
      const param2 = b[property]
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
      var result = param1 < param2 ? -1 : param1 > param2 ? 1 : 0;
      return result * sortOrder;
    };
  }
}
