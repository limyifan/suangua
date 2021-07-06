import React, {useEffect, useState} from 'react';
import {Button,  Form, FormControl, InputGroup} from "react-bootstrap";
import firebase from "../firebase";
import {爻, 卦名} from "../gua";

function Home(props) {

    const [firstNumber, setFirstNumber] = useState("")
    const [secondNumber, setSecondNumber] = useState("")
    const [thirdNumber, setThirdNumber] = useState("")
    const [result1, setResult1] = useState("")
    const [result12, setResult12] = useState("")
    const [result2, setResult2] = useState("")
    const [辞, set辞] = useState("")
    const [卦1, set卦1] = useState("")
    const [卦2, set卦2] = useState("")

    const changeHandler = e => {
        switch (e.currentTarget.name) {
            case"1":
                setFirstNumber(e.target.value)
                break
            case"2":
                setSecondNumber(e.target.value)
                break
            case"3":
                setThirdNumber(e.target.value)
                break
            default:
                return

        }
    }
    // useEffect(() => {
    //     const input = document.getElementById('input')
    //     input.addEventListener('change', () => {
    //         var num=0;
    //         readXlsxFile(input.files[0]).then((rows) => {
    //            for(let i=0;i< rows.length;i++)
    //             {
    //                 const row=rows[i]
    //                 if((i>=7&&i%7===0)||i===0)
    //                 {
    //                     num++;
    //                     console.log(num)
    //                 }
    //                 const gua=row[1]
    //                 const collectionName=卦名[编号[num]]["卦"]
    //                 const documentName=row[2]
    //
    //                 const doc={
    //                     原文:row[3],
    //                     白话:row[4],
    //                     解读:row[5],
    //                     市场解读:row[6],
    //                     运势建议:row[7],
    //                     发生概率:row[8],
    //                 }
    //                 const db = firebase.firestore();
    //                 db.collection(collectionName).doc(documentName).set(doc);
    //                 console.log("added ",collectionName)
    //             }
    //
    //
    //             // `rows` is an array of rows
    //             // each row being an array of cells.
    //         })
    //     })
    // });
    useEffect(() => {
        if (firstNumber === "")
            setFirstError("This Field is Required")

    }, [firstNumber])
    useEffect(() => {
        if (secondNumber === "")
            setSecondError("This Field is Required")

    }, [secondNumber])
    useEffect(() => {
        if (thirdNumber === "")
            setThirdError("This Field is Required")

    }, [thirdNumber])


    const submitForm = e => {

        e.preventDefault();


        const a = convertToBinary(firstNumber % 8)
        const b = convertToBinary(secondNumber % 8)
        const c = (thirdNumber === 0 || thirdNumber % 6 === 0) ? 6 : thirdNumber % 6
        const result1 = b.toString() + a.toString()
        const result2 = 变爻(result1, c)
        const 卦1 = 卦名[result1]["卦"];
        const 辞 = 爻[c]
        const 卦2 = 卦名[result2]["卦"];
        set卦1(result1);
        set卦2(result2);
        set辞(辞)

        const db = firebase.firestore();
        db.collection(卦1).doc(辞.toString()).get().then((doc) => {
            console.log("Cached document data:", doc.data());
            setResult1(doc.data())
        }).catch((error) => {
            console.log("Error getting cached document:", error);
        });

        db.collection(卦1).doc(爻[0].toString()).get().then((doc) => {
            console.log("Cached document data:", doc.data());
            setResult12(doc.data())

        }).catch((error) => {
            console.log("Error getting cached document:", error);
        });

        db.collection(卦2).doc(爻[0].toString()).get().then((doc) => {
            console.log("Cached document data:", doc.data());
            setResult2(doc.data())
        }).catch((error) => {
            console.log("Error getting cached document:", error);
        });


    }
    const 变爻 = (result, no) => {
        const split = result.split('');
        var changePosition = 6 - no;
        //   console.log(result.substring(0,changePosition-1).toString())
        // console.log(split[changePosition]==='0'?"1":"0")
        //  console.log(result.substring(changePosition).toString())
        var res = result.substring(0, changePosition).toString() + (split[changePosition] === '0' ? "1" : "0").toString() + result.substring(changePosition + 1).toString();
        // console.log(res)
        return res;
    }
    const convertToBinary = number => {
        switch (number) {
            case(0):
                return "000"
            case(1):
                return "111"
            case(2):
                return "011"
            case(3):
                return "101"
            case(4):
                return "001"
            case(5):
                return "110"
            case(6):
                return "010"
            case(7):
                return "100"
            case(8):
                return "000"
            default:
                return
        }
    }
    return (
        <div>
            <div className="container-md col-lg-4 col-md-4 col-sm-4 container justify-content-center">
                {/*<input type="file" id="input" />*/}
                <Form onSubmit={submitForm}>
                    <Form.Label>心里默念想占问的币，然后随机输入3个3位数</Form.Label>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-default">第一个数字</InputGroup.Text>
                            <FormControl
                                onChange={changeHandler}
                                name={"1"}
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                            />
                        </InputGroup>

                    </Form.Group>

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">第二个数字</InputGroup.Text>
                        <FormControl
                            onChange={changeHandler}
                            name={"2"}
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                        />

                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">第三个数字</InputGroup.Text>
                        <FormControl
                            onChange={changeHandler}
                            name={"3"}
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"

                        />

                    </InputGroup>

                    <Button variant="primary" type="submit">
                        开始算命
                    </Button>
                </Form>
                <Form.Text className="text-muted">
                    使用《易经》占卦，需要遵守“三不占”原则：1.不诚不占：此乃求教于神明，首重真诚。2.不义不占：不合乎正当性及道义的问题，不必占问。3.不疑不占：必须是理性难以测度之事，因为有些问题依照常理常情可决定其结果，也不必占问。
                </Form.Text>
            </div>
            {/*<卦象 result={卦1}/>*/}
            {卦1 !== "" && <h1>第一卦：{卦名[卦1]["卦"]}卦</h1>}
            <ul>
                {
                    Object.keys(result1).map(function (key) {
                        return <li key={key.id}>{`${key}: ${result1[key]}`}</li>
                    })
                }
            </ul>
            <h1>{辞}</h1>
            <ul>
                {
                    Object.keys(result12).map(function (key) {
                        return <li key={key.id}>{`${key}: ${result12[key]}`}</li>
                    })
                }
            </ul>
            {卦2 !== "" && <h1>第二卦：{卦名[卦2]["卦"]}卦</h1>}

            <ul>
                {
                    Object.keys(result2).map(function (key) {
                        return <li key={key.id}>{`${key}: ${result2[key]}`}</li>
                    })
                }
            </ul>

        </div>
    );
}

export default Home;