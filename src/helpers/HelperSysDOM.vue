<script>
export default {
  Helper: {
    getElementTop(element) {
      var actualTop = element.offsetTop;
      var current = element.offsetParent;

      while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
      }
      return actualTop;
    },
    getElementLeft(element) {
      var actualLeft = element.offsetLeft;
      var current = element.offsetParent;

      while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
      }
      return actualLeft;
    },
    getElementWidth(id) {
      var div = document.getElementById(id);
      var width =
        div.style.width ||
        div.clientWidth ||
        div.offsetWidth ||
        div.scrollWidth;
      var sValue = width.toString().toLowerCase();
      if (sValue.indexOf("px")) sValue = sValue.replace("px", "");
      return parseInt(sValue);
    },
    getElementHeight(id) {
      var div = document.getElementById(id);
      var width =
        div.style.height ||
        div.clientHeight ||
        div.offsetHeight ||
        div.scrollHeight;
      var sValue = width.toString().toLowerCase();
      if (sValue.indexOf("px")) sValue = sValue.replace("px", "");
      return parseInt(sValue);
    }
  }
};
</script>
