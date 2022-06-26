import "./Grid.css";
import GridInput from "./GridInput";
import {forwardRef, useImperativeHandle, useRef} from "react";

function Grid(props, ref) {
    /**
     * 标记我当前是否有焦点。 九宫格内任何一个输入框有焦点的情况，此字段就应该被置为true。 九宫格内任何一个输入框都没有焦点的情况，此字段就应该被置为false
     * 当用户主动输入一个数字后，自动跳转到下一个输入框前，会 使用 focu 方法将指定格子进行聚焦从而让输入光标跳到下一个输入框。此字段在focu函数中使用，用于判断
     * 是否允许进行此次对角操作。
     */
    let i_have_fcous = useRef(false);
    let refs = [];
    for (let i = 0; i < 9; i++) {
        let arr = [];
        for (let j = 0; j < 9; j++) {
            arr.push(useRef.call(this));
        }
        refs.push(arr);
    }

    function onKeyUp(row, col, keyCode) {
        if (keyCode === 40) { // 下
            focu(row + 1, col);
        } else if (keyCode === 38) { // 上
            focu(row - 1, col);
        } else if (keyCode === 37 || keyCode === 8) { // 左
            if (col === 0) {
                col = 9;
                row = row - 1;
            }
            focu(row, col - 1);
        } else if (keyCode === 39 || keyCode === 13 || keyCode === 32) { // 右
            if (col === 8) {
                col = -1;
                row = row+1;
            }
            focu(row, col + 1);
        }
    }

    function focu(row, col) {
        if (window.isRunning) {
            return;
        }
        if (!i_have_fcous.current) {
            return;
        }

        let rd = refs[row];
        if(rd && rd[col]){
            rd[col].current.$el?.focus();
        }
    }

    function onBlur() {i_have_fcous.current = false;}
    function onFocus() {i_have_fcous.current = true;}


    function onValueChange(row, col, value) {
        if (props.onValueChange) {
            props.onValueChange(row, col, value);

            if (window.isRunning) {
                return;
            }
            if (value) {
                if (col === 8) {
                    col = -1;
                    row = row+1;
                }
                focu(row, col +1);
            } else {
                // if (col  === 0) {
                //     col = 9;
                //     row = row-1;
                // }
                // focu(row, col -1);
            }
        }
    }

    useImperativeHandle(ref, ()=>({
        pinColor(color, f) {
            for (let i = 0; i < refs.length; i++) {
                for (let j = 0; j < refs[i].length; j++) {
                    refs[i][j].current.pinColor(color, f);
                }
            }
        },

        getColor (row, col) {
            return refs[row][col].current.getColor();
        }
    }))

    return (
        <div ref={ref} className={["grid"]}>
            {props.values.map((f, row) =>
                <div key={row} className={["grid-row", (row===2||row===5)?"grid-row-bottom-border-weight-1":'', row===0?"grid-row-start":"", row===8?"grid-row-end":""].join(" ")}>
                    {f.map((f,col) =>
                        <div key={col} className={["grid-col", (col===2||col===5)?"grid-col-right-border-weight-1":'', col===0?"grid-col-start":"", col === 8?'grid-col-end':''].join(" ")}>
                            <GridInput
                                onKeyUp={onKeyUp}
                                ref={refs[row][col]}
                                row={row}
                                col={col}
                                value={props.values[row][col]}
                                onValueChange={onValueChange}
                                onBlur={onBlur}
                                onFocus={onFocus}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}


export default forwardRef(Grid);