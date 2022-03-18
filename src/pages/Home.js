import {useNavigate} from "react-router-dom";
import "./Home.css";
import Grid from "../components/Grid";
import {useEffect, useRef, useState} from "react";
import SudoSolver from "../SudoSolver";

const difficultSudo = [
    [[0,0,5, 3,0,0, 0,0,0],
        [8,0,0, 0,0,0, 0,2,0],
        [0,7,0, 0,1,0, 5,0,0],

        [4,0,0, 0,0,5, 3,0,0],
        [0,1,0, 0,7,0, 0,0,6],
        [0,0,3, 2,0,0, 0,8,0],

        [0,6,0, 5,0,0, 0,0,9],
        [0,0,4, 0,0,0, 0,3,0],
        [0,0,0, 0,0,9, 7,0,0]],

    [[8,0,0, 0,0,0, 0,0,0],
        [0,0,3, 6,0,0, 0,0,0],
        [0,7,0, 0,9,0, 2,0,0],

        [0,5,0, 0,0,7, 0,0,0],
        [0,0,0, 0,4,5, 7,0,0],
        [0,0,0, 1,0,0, 0,3,0],

        [0,0,1, 0,0,0, 0,6,8],
        [0,0,8, 5,0,0, 0,1,0],
        [0,9,0, 0,0,0, 4,0,0]],

    [[3,9,0, 2,0,0, 8,0,0],
        [0,0,0, 7,0,0, 0,2,9],
        [7,0,0, 3,0,0, 0,5,0],

        [0,0,0, 0,0,0, 9,3,0],
        [0,0,0, 4,1,2, 0,0,0],
        [0,5,6, 0,0,0, 0,0,0],

        [0,7,0, 0,0,4, 0,0,2],
        [4,1,0, 0,0,6, 0,0,0],
        [0,0,3, 0,0,7, 0,8,4]],

    [[0,0,0, 1,0,0, 0,0,0],
        [0,4,5, 0,0,0, 3,0,0],
        [7,0,0, 0,8,0, 0,9,0],

        [6,0,0, 0,2,0, 9,8,0],
        [0,8,9, 0,0,5, 0,0,4],
        [0,7,3, 0,0,0, 6,1,0],

        [0,0,0, 5,0,0, 0,0,0],
        [0,9,0, 0,0,2, 0,0,8],
        [0,0,2, 0,0,0, 4,7,0]],

    [[1,2,0, 0,0,0, 0,9,3],
        [0,0,0, 0,0,0, 0,0,0],
        [0,3,9, 0,0,0, 7,0,1],

        [0,7,6, 4,0,0, 1,0,5],
        [8,0,0, 0,0,0, 0,3,0],
        [9,0,0, 0,0,0, 0,7,0],

        [0,6,0, 2,0,0, 0,0,7],
        [7,0,0, 0,8,5, 0,1,0],
        [0,0,0, 0,3,4, 0,0,0]],

    [[0,0,0, 0,0,0, 0,2,3],
        [0,0,5, 0,0,6, 0,0,0],
        [0,1,9, 0,0,8, 0,0,0],

        [0,0,8, 0,0,0, 0,0,0],
        [3,0,0, 0,0,0, 0,4,0],
        [0,0,0, 0,0,9, 1,0,0],

        [4,0,0, 2,3,0, 0,0,0],
        [0,0,0, 0,0,0, 0,0,0],
        [6,0,0, 0,0,0, 9,0,0]]
];

function getEmptyArr () {
    let v = [];

    for (let i = 0; i < 9; i++) {
        let r = [];
        for (let j = 0; j < 9; j++) {
            r.push(0);
        }
        v.push(r);
    }
    return v;
}

// 将时间戳转换为时分秒。 timestamp单位需要是毫秒的
function parseTimestamp2hhmmss(timestamp) {
    if (!timestamp || timestamp < 0) {timestamp = 0;}
    let second = Math.floor(timestamp / 1000); /* 秒。 */
    let minSecond = String(timestamp - (second*1000)).padStart(3, "0");
    if (second < 60) {
        return second + "." + minSecond;
    }
    let min = Math.floor(second / 60); /* 分 */
    second = second - (min * 60); /*计算了分后，剩余的秒*/
    if (min < 60) {return min + "'" + second + "." + minSecond;}
    let hour = Math.floor(min / 60); /*时*/
    min = min - (hour * 60);/*计算了小时后，剩余的分*/
    return hour + "'" + min + "'" + second + "." + minSecond;
}

let isRunning = false;

function Home() {

    const nav = useNavigate();

    const gridRef = useRef();
    const answerRef = useRef();
    const [randomSudoIndex, setRandomSudoIndex] = useState(Math.floor(Math.random() * difficultSudo.length));
    const [answerslength, setAnswersLength] = useState([]);
    const [currentSudo, setCurrentSudo] = useState(getEmptyArr());
    const [startBtnDisabled, setStartBtnDisabled] = useState(false);
    const [stopBtnDisabled, setStopBtnDisabled] = useState(true);
    const [clearBtnDisabled, setClearBtnDisabled] = useState(true);
    const [createBtnDisabled, setCreateBtnDisabled] = useState(false);
    const [helpBtnDisabled, setHelpBtnDisabled] = useState(false);
    // const [sudoSolver, setSudoSolver] = useState(undefined);
    const sudoSolverRef = useRef();
    const [timeHint, setTimeHint] = useState("");
    useEffect(() =>{setCurrentSudo(currentSudo);}, [currentSudo])

    // 点击 生成
    function onCreateClick() {
        let newindex = Math.floor(Math.random() * difficultSudo.length);
        while (newindex === randomSudoIndex) {
            newindex = Math.floor(Math.random() * difficultSudo.length);
        }
        setRandomSudoIndex(newindex);
        setCurrentSudo(difficultSudo[newindex]);
        setClearBtnDisabled(false);
    }

    // 点击停止
    function onStopClick() {
        if (sudoSolverRef.current) {
            sudoSolverRef.current.stopFind();
            setStartBtnDisabled(false);
        }
        isRunning = false;
    }

    // 点击 计算
    function onStartClick() {
        setClearBtnDisabled(true);
        setCreateBtnDisabled(true);
        setStopBtnDisabled(false);
        setHelpBtnDisabled(true);
        setStartBtnDisabled(true);

        gridRef.current.pinColor("blue");

        let s =new SudoSolver(currentSudo);
        sudoSolverRef.current = s;

        let lastAnswer = undefined;
        isRunning = true;
        requestAnimationFrame(function updateHint (){

            if (sudoSolverRef.current ) {
                setTimeHint("已用时：" + parseTimestamp2hhmmss(Date.now() - sudoSolverRef.current.__startTime));
            }
            if (isRunning) {
                requestAnimationFrame(updateHint);
            }
        });
        s.findAnswer({
            onProgress(arr) {
                setCurrentSudo(arr);
            },
            onAnswerFind(arr) {
                lastAnswer = arr;
                setAnswersLength(answerslength+1);
                renderAnswer(arr, parseTimestamp2hhmmss(Date.now() - sudoSolverRef.current.__startTime));

            },
            onFlish () {
                isRunning = false;
                if (lastAnswer) {
                    setCurrentSudo(lastAnswer);
                }

                setClearBtnDisabled(false);
                setCreateBtnDisabled(true);
                setStopBtnDisabled(true);
                setHelpBtnDisabled(false);
                setStartBtnDisabled(true);

            },
        });


    }

    // 点击清空
    function onClearClick() {
        gridRef.current.pinColor("black", true);
        setTimeHint("");
        setAnswersLength(0);
        setCurrentSudo(getEmptyArr());
        answerRef.current.innerHTML = "";
        setClearBtnDisabled(true);
        setCreateBtnDisabled(false);
        setStopBtnDisabled(true);
        setHelpBtnDisabled(false);
        setStartBtnDisabled(false);
    }

    // 点击帮助
    function onHelpClick() {
        nav("/about");
    }

    // 当手动手动输入内容时，会执行。
    function onValueChange(row, col, value) {
        currentSudo[row][col] = value;
        setCurrentSudo(currentSudo);
    }


    function renderAnswer(answer, time) {
        var i = 0;
        var item = document.createElement("div");
        item.setAttribute("data-time", time);
        item.className = 'answeritem';
        for (var index = 0; index < answer.length; index++) {
            var classnam1 = "answeritem-row";
            if (index === 3 || index === 6) {
                classnam1 += " soo";
            }

            var itemrow = document.createElement("div");
            itemrow.className = classnam1;

            for (var jndex = 0; jndex < answer[index].length; jndex++) {
                var className = "answeritem-col ";

                var itemcol = document.createElement("span");

                if (jndex === 2 || jndex === 5) {
                    className += " spp";
                }

                itemcol.className = className;
                itemcol.style.color = gridRef.current.getColor(index, jndex);
                itemcol.innerText = answer[index][jndex];
                i++;
                itemrow.appendChild(itemcol);
            }
            item.appendChild(itemrow);
        }

        answerRef.current.appendChild(item);
    }

    return (
        <div>
            <Grid ref={gridRef} values={currentSudo} onValueChange={onValueChange}/>
            <div style={{paddingTop: "10px"}}><small>　{timeHint}　</small></div>
            <div style={{padding: "10px"}}>
                <button disabled={startBtnDisabled} onClick={onStartClick}>计算</button>
                <button disabled={stopBtnDisabled} onClick={onStopClick}>停止</button>
                <button disabled={clearBtnDisabled} onClick={onClearClick}>清空</button>
                <button disabled={createBtnDisabled} onClick={onCreateClick}>生成</button>
                <button disabled={helpBtnDisabled} onClick={onHelpClick}>帮助</button>
            </div>
            <div>
                {answerslength > 0 && <h2>已找到解</h2>}
                <div ref={answerRef}>
                    {/*{answers.map((answer,o) => {*/}
                    {/*    return (<div key={o} className={"answeritem"}>*/}
                    {/*        {answer.map((row,index) => {*/}
                    {/*            return (<div key={index} className={["answeritem-row", (index === 3 || index === 6)?"soo":""].join(" ")}>*/}
                    {/*                {row.map((col, jndex) => <div key={jndex} style={{color: gridRef.current.getColor(index, jndex)}} className={["answeritem-col", (jndex === 2 || jndex === 5)?"spp":""].join(" ")}>*/}
                    {/*                    {col}*/}
                    {/*                </div>)}*/}
                    {/*            </div>)*/}
                    {/*        })}*/}
                    {/*    </div>)*/}
                    {/*})}*/}
                </div>
            </div>
        </div>
    )
}

export default Home;