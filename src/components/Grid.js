import "./Grid.css";
import GridInput from "./GridInput";
import {forwardRef, useImperativeHandle, useRef} from "react";

function Grid(props, ref) {
    let refs = [];
    for (let i = 0; i < 9; i++) {
        let arr = [];
        for (let j = 0; j < 9; j++) {
            arr.push(useRef.call(this));
        }
        refs.push(arr);
    }

    function onValueChange(row, col, value) {
        if (props.onValueChange) {
            props.onValueChange(row, col, value);
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
                            <GridInput ref={refs[row][col]} row={row} col={col} value={props.values[row][col]} onValueChange={onValueChange}/>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}


export default forwardRef(Grid);