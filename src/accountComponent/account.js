import React, {useEffect, useState} from 'react';
import Web3 from "web3";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {Col, Container, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import * as routes from "../routes";
import firebase from "../firebase";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {卦名, 爻, 结果} from "../gua";

function Account({account, balance}) {
    const [history, setHistory] = useState([])

    useEffect(() => {
        const fetchUserHistory = () => {
            if (account) {
                const db = firebase.firestore();
                let arr = []
                db.collection("users").where("walletAddress", "==", account).get().then((snapshot) => {
                    snapshot.docs[0].ref.collection("history").orderBy("time", "desc").get().then((historySnapshot) => {
                        historySnapshot.docs.forEach((doc) => {
                            arr.push(doc.data())
                        })
                        setHistory([...arr])
                    })
                })

            }
        }
        fetchUserHistory()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const formatTime = (stamp) => {
        return new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit', day: '2-digit',}).format(stamp)
    }
    return (
        (!account || !balance) ? <Redirect to={routes.ERROR}/> :
            <Container>
                <p style={{float: "right"}}>余额：{Web3.utils.fromWei(balance)} BNB</p>
                <h3><u>历史记录</u></h3>
                {history.map((data) => {
                    const 卦 = 卦名[data["gua"]]["卦"]
                    return <Accordion defaultActiveKey="0" key={data["gua"]}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <h4>
                                {卦}卦 &nbsp;&nbsp;
                            </h4>
                            <span>{formatTime(data["time"])}</span>
                        </AccordionSummary>
                        <AccordionDetails>

                            <Row>
                                <Col md={1}><h2>{卦}</h2>
                                </Col>
                                <Col md={5}>
                                    <ul>
                                        <li><b>原文: </b> {结果[卦][爻[0]]["原文"]}</li>
                                        <li><b>白话: </b> {结果[卦][爻[0]]["白话"]}</li>
                                        <li><b>解读: </b> {结果[卦][爻[0]]["解读"]}</li>
                                        <li><b>市场解读: </b> {结果[卦][爻[0]]["市场解读"]}</li>
                                        <li><b>运势建议: </b> {结果[卦][爻[0]]["运势建议"]}</li>
                                        <li><b>发生概率: </b>{(结果[卦][爻[0]]["发生概率"] * 100).toFixed(0)}%</li>
                                    </ul>
                                </Col>
                                <Col md={1}><h2>{data["ci"]}</h2></Col>
                                <Col md={5}>
                                    <ul>
                                        <li><b>原文: </b> {结果[卦][data["ci"]]["原文"]}</li>
                                        <li><b>白话: </b> {结果[卦][data["ci"]]["白话"]}</li>
                                        <li><b>解读: </b> {结果[卦][data["ci"]]["解读"]}</li>
                                        <li><b>市场解读: </b> {结果[卦][data["ci"]]["市场解读"]}</li>
                                        <li><b>运势建议: </b> {结果[卦][data["ci"]]["运势建议"]}</li>
                                        <li><b>发生概率: </b>{(结果[卦][data["ci"]]["发生概率"] * 100).toFixed(0)}%</li>
                                    </ul>
                                </Col>
                            </Row>


                        </AccordionDetails>
                    </Accordion>
                })}
                {history.length > 0 && <p className={"text-muted"}>您一共占问了 <span
                    style={{fontSize: "1.4em", fontWeight: "bold", color: "black"}}>{history.length}</span> 次</p>
                }
            </Container>
    );
}

export default Account;