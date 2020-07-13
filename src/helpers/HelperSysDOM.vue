/**
Copyright(c) 2020
Author : YangKe
E-mail : softshare@163.com

If YKList is useful to you, please star me at github:
https://github.com/softshare/YKList
**/
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
				if (div == null) return 0;
				var width =
						div.style.width ||
						div.clientWidth ||
						div.offsetWidth ||
						div.scrollWidth;
				var sValue = width.toString().toLowerCase();
				if (sValue.indexOf("px")) sValue = sValue.replace("px", "");
				return parseInt(sValue);
			},
			getElementHeightByDom(dom) {
				var width =
						dom.style.height ||
						dom.clientHeight ||
						dom.offsetHeight ||
						dom.scrollHeight;
				var sValue = width.toString().toLowerCase();
				if (sValue.indexOf("px")) sValue = sValue.replace("px", "");
				return parseInt(sValue);
			},
			getElementHeight(id) {
				var dom = document.getElementById(id);
				return this.getElementHeightByDom(dom);
			}
		}
	};
</script>
