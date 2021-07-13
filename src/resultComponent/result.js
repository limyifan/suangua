import React from 'react';
import Tu from "../homeComponent/卦象";
import {Col, Container, Row} from "react-bootstrap";

function Result({卦1,result1,result12,辞}) {
    return (
        <Container fluid>
            <h1>计算结果：</h1>
            <hr
                style={{
                    color: "black",
                    backgroundColor: "black",
                    height: 0.5
                }}
            />
            <Row className="justify-content-md-center">
                <Col xs={12}>
                    <Tu result={卦1}/>

                </Col>
                <Col  xs={12} className={"result"}>
                    {/*<h1>{卦名[卦1]["卦"]}卦</h1>*/}

                        <h5>【原文】</h5>
                        <li> {result1["原文"]}</li>
                        <h5>【白话】</h5>

                        <li> {result1["白话"]}</li>
                        <h5>【解读】</h5>

                        <li> {result1["解读"]}</li>
                        <h5>【市场解读】</h5>

                        <li>{result1["市场解读"]}</li>
                        <h5>【运势建议】</h5>

                        <li> {result1["运势建议"]}</li>
                        <h5>【发生概率】</h5>

                        <li> {(result1["发生概率"]*100).toFixed(0)}%</li>
                </Col>
                <Col  xs={12} className={"result"}>

                    <h1>{辞}</h1>

                        <h5>【原文】</h5>

                        <li> {result12["原文"]}</li>
                        <h5>【白话】</h5>

                        <li> {result12["白话"]}</li>
                        <h5>【解读】</h5>

                        <li> {result12["解读"]}</li>
                        <h5>【市场解读】</h5>

                        <li>{result12["市场解读"]}</li>
                        <h5>【运势建议】</h5>

                        <li> {result12["运势建议"]}</li>
                        <h5>【发生概率】</h5>

                        <li> {(result12["发生概率"]*100).toFixed(0)}%</li>

                </Col>
            </Row>


            {/*{卦2 !== "" && <h1>第二卦：{卦名[卦2]["卦"]}卦</h1>}*/}

            {/*<ul>*/}
            {/*    {*/}
            {/*        Object.keys(result2).map(function (key) {*/}
            {/*            return <li key={key.id}>{`${key}: ${result2[key]}`}</li>*/}
            {/*        })*/}
            {/*    }*/}
            {/*</ul>*/}

        </Container>
    );
}

export default Result;