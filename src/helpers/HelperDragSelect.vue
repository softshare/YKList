<script>
    import HelperSysDOM from "@/helpers/HelperSysDOM";

    export default {
        Helper: {
            RectDragSelectID: "YKList-dragselect-rect",
            rectSelection_beginPos: undefined, //矩形框选择的开始点，记录开始item的row,col索引
            viewDomInfo: {
                offset: undefined,
                width: undefined,
                height: undefined
            }, //ListView容器的坐标偏移量信息
            init(onMouseDown, onMouseMove, onMouseUp) {
                document.onmousedown = onMouseDown;
                document.onmousemove = onMouseMove;
                document.onmouseup = onMouseUp;
            },
            cancel(event, callback) {
                document.multiLine = false;
                document.getElementById(this.RectDragSelectID).remove();
                this.rectSelection_beginPos = undefined;
                if (callback != undefined) callback(event);
            },
            isDoing() {
                //是否处于鼠标框选状态
                return document.multiLine == true;
            },
            getPos_end() {
                if (this.isDoing()) return document.endPos;
                else return undefined;
            },
            getPos_begin() {
                if (this.isDoing()) return document.startPos;
                else return undefined;
            },
            doMouseDown(event, domID, callback = undefined) {
                if (event.ctrlKey || event.shiftKey || event.button != 0) return; //非常重要，不能再有按键的情况下启动框选，而且必须是鼠标左键按下
                var fileListView = document.getElementById(domID);
                var viewDomInfo = this.viewDomInfo;

                viewDomInfo.offset = {
                    left: HelperSysDOM.Helper.getElementLeft(fileListView),
                    top: HelperSysDOM.Helper.getElementLeft(fileListView)
                };
                viewDomInfo.width = HelperSysDOM.Helper.getElementWidth(domID);
                viewDomInfo.height = HelperSysDOM.Helper.getElementHeight(domID);
                if (
                    //限制框选区域，只能在domID的node内
                    event.pageX <= viewDomInfo.offset.left ||
                    event.pageY <= viewDomInfo.offset.top ||
                    event.pageX > viewDomInfo.offset.left + viewDomInfo.width ||
                    event.pageY > viewDomInfo.offset.top + viewDomInfo.height
                )
                    return;
                console.log(viewDomInfo);

                console.log(document.startPos);
                if (document.getElementById(this.RectDragSelectID) == undefined) {
                    document.multiLine = true;
                    document.startPos = {
                        x: event.pageX,
                        y: event.pageY
                    };
                    document.endPos = {
                        x: event.pageX,
                        y: event.pageY
                    };
                    var rect = document.createElement("div");
                    rect.id = this.RectDragSelectID;
                    document.body.appendChild(rect);
                }

                if (callback != undefined) callback(event, document.startPos); //如果有初始化事件
            },
            doMouseMove(event, callback) {
                if (document.multiLine) {
                    var viewDomInfo = this.viewDomInfo;
                    var X = event.pageX;
                    var Y = event.pageY;
                    if (X < viewDomInfo.offset.left) X = viewDomInfo.offset.left;
                    if (X > viewDomInfo.offset.left + viewDomInfo.width)
                        X = viewDomInfo.offset.left + viewDomInfo.width;
                    if (Y < viewDomInfo.offset.top) Y = viewDomInfo.offset.top;
                    if (Y > viewDomInfo.offset.top + viewDomInfo.height)
                        Y = viewDomInfo.offset.top + viewDomInfo.height;
                    document.endPos = {
                        x: X,
                        y: Y
                    };
                    this.updateRect();
                    if (callback != undefined) callback(event);
                }
            },
            updateRect() {
                let rect = document.getElementById("YKList-dragselect-rect"),
                    startX = document.startPos.x,
                    startY = document.startPos.y,
                    endX = document.endPos.x,
                    endY = document.endPos.y,
                    width = Math.abs(endX - startX) + "px",
                    height = Math.abs(endY - startY) + "px",
                    left = endX > startX ? startX : endX,
                    top = endY > startY ? startY : endY;

                rect.style.position = "absolute";
                rect.style.width = width;
                rect.style.height = height;
                rect.style.left = left;
                rect.style.top = top;
                rect.style.outline = "1px solid #0078d7";
            }
        }
    };
</script>
