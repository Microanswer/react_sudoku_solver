import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";

function GridInput(props, ref) {
    const [color, setColor] = useState("black");
    const medom = useRef();
    const [value, setValue] = useState(props.value);

    useEffect(() => {setValue(props.value);}, [props]);
    useEffect(() => {
        // let event = new KeyboardEvent("keypress", {
        //     code: "Tab",
        //     keyCode: 9,
        //     key: "Tab",
        //     bubbles: true,
        //     cancelable: true,
        //     isTrusted: true,
        // })
        // event.initEvent("keypress", true, true);
        // console.log(event);
        // medom.current.dispatchEvent(event);

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

    function onKeyUp({keyCode}) {
        if (props.onKeyUp) {
            if (window.isRunning) {
                return;
            }
            props.onKeyUp(props.row, props.col, keyCode);
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
        },
        $el: medom.current
    }));


    return (
        <input ref={medom} style={{color: color}} value={value>0 && value<10?value:""} onChange={onChange} onKeyUp={onKeyUp}/>
    );
}


export default forwardRef(GridInput);