import {forwardRef, useEffect, useImperativeHandle, useState} from "react";

function GridInput(props, ref) {
    const [color, setColor] = useState("black");

    const [value, setValue] = useState(props.value);

    useEffect(() => {setValue(props.value);}, [props]);
    useEffect(() => {
        if (props.onValueChange) {
            props.onValueChange(props.row, props.col, value);
        }
    }, [value])

    function onChange({target: {value: data}}) {
        if (!data || (0 < data && data < 10)) {
            setValue(data);
        } else if (data > 10) {
            setValue(String(data).split("").pop());
        }
    }

    useImperativeHandle(ref, () => ({
        pinColor (color, forice) {
            if (value > 0 || forice) {
                setColor(color);
            }
        },
        getColor () {
            return color;
        }
    }));


    return (
        <input style={{color: color}} value={value>0 && value<10?value:""} onChange={onChange}/>
    );
}


export default forwardRef(GridInput);