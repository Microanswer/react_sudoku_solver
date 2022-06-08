import {useNavigate} from "react-router-dom";


function About() {
    const nav = useNavigate();
    return (
        <div>
            <div style={{maxWidth: "500px", minWidth: "300px", margin: "0 auto", textAlign: "left"}}>
                <p style={{margin: "10px 30px"}}>这是一个可以计算出数独的所有答案的在线计算工具。计算速度取决于数独难度和设备的性能。</p>
                <p style={{margin: "10px 30px"}}>输入你的数独内容，然后点击<button disabled={true}>计算</button>按钮，程序将会立即开始解答，每当出现一个可行解时，屏幕下方将会出现对应的结果。
                直到所有的答案被全部找到，计算终止。</p>
                <p style={{margin: "10px 30px"}}>如果你输入的数独本身是一个错误的（无法找到有效解的），你依然可以尝试点击计算，程序在你点击计算之前并不知道你输入的内容是否正确，因此即便你输入
                的内容无解，程序也会在点击计算的时候开始尝试解答，直到尝试完所有可能最终未能得到答案，计算终止。</p>
                <p style={{margin: "10px 30px"}}>你也可以什么都不输入，直接计算，但是这会产生很多个解，以至于网页都容纳不下来，随着解越来越多的被找到，计算速度也会逐渐降低。</p>
                <p style={{margin: "10px 30px"}}>你也可以通过点击<button disabled={true}>生成</button>按钮来生成一个数独，然后再点击<button disabled={true}>计算</button>按钮来计算生成的数独。
                请注意，自动生成的数独都是<b>地狱级</b>难度的，解答时间可能会超过10秒钟。</p>
                <p style={{margin: "10px 30px"}}>本界面采用React制作，最多只显示已找到的10个最新解。</p>
                <ul style={{margin: "30px"}}>
                    <li>代码：<a href={"https://www.microanswer.cn/blog/46"}>点击跳转</a></li>
                    <li>网站：<a href={"https://www.microanswer.cn/"}>点击跳转</a></li>
                    <li>Github：<a href={"https://github.com/microAnswer"}>Microanswer</a></li>
                </ul>

            </div>
            <button onClick={() => {nav(-1)}}>返回</button>

        </div>
    )
}

export default About;