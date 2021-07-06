import React from 'react';
import {Col, Row} from "react-bootstrap";
import {卦名} from "../gua";

function Tu(props) {

    return (
        <div className={"container-sm justify-content-md-center"} style={{width: "25vh"}}>
            {props.result!==""&&props.result.split("").map(c =>
                c === "0"
                    ? <Row style={{marginTop:"1vh"}}>
                        <Col xs={5} style={{backgroundColor: "black"}}>.</Col>
                        <Col xs={2}></Col>
                        <Col xs={5} style={{backgroundColor: "black"}}>.</Col>
                    </Row>
                    : <Row style={{marginTop:"1vh"}}>
                        <Col xs={12} style={{backgroundColor: "black"}}>.</Col>
                    </Row>
            )

            }
            {props.result!==""&& <h2>{卦名[props.result]["组合"]+卦名[props.result]["卦"]}</h2>}
        </div>
    );
}

export default Tu;