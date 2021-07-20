import React, {useEffect, useState} from 'react';
import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import firebase from "../firebase";
import {爻, 卦名, 结果} from "../gua";
import "../assets/css/main.css"
import web3 from "web3";
import {useSnackbar} from 'notistack';
import {CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Result from "../resultComponent/result";
import {RECEIVER_ADDRESS} from "../utilities/constants";

function Home({account, cbcContract,guaContract}) {
    const {enqueueSnackbar} = useSnackbar();
    const [firstNumber, setFirstNumber] = useState()
    const [secondNumber, setSecondNumber] = useState()
    const [thirdNumber, setThirdNumber] = useState()
    const [result1, setResult1] = useState()
    const [result12, setResult12] = useState()
    // const [result2, setResult2] = useState()
    const [ci, setCi] = useState()
    const [卦1, set卦1] = useState()
    const [pic] = useState("https://firebasestorage.googleapis.com/v0/b/suangua-47a55.appspot.com/o/卦象%2F乾卦一爻.jpeg?alt=media&token=615c9f96-2d94-48bb-9a9f-44eaec356746")
    // const [卦2, set卦2] = useState()
    const [firstError, setFirstError] = useState()
    const [secondError, setSecondError] = useState()
    const [thirdError, setThirdError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const[docId,setDocId]=useState()
    const db = firebase.firestore();

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
    //         var s={};
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
    //                 switch(documentName)
    //                 {
    //                     case("卦辞"):
    //                         s[collectionName]={...s[collectionName],"卦辞":doc}
    //                     case("一爻"):
    //                         s[collectionName]={...s[collectionName],"一爻":doc}
    //                     case("二爻"):
    //                         s[collectionName]={...s[collectionName],"二爻":doc}
    //                     case("三爻"):
    //                         s[collectionName]={...s[collectionName],"三爻":doc}
    //                     case("四爻"):
    //                         s[collectionName]={...s[collectionName],"四爻":doc}
    //                     case("五爻"):
    //                         s[collectionName]={...s[collectionName],"五爻":doc}
    //                     case("六爻"):
    //                         s[collectionName]={...s[collectionName],"六爻":doc}
    //
    //             }
    //                 // const db = firebase.firestore();
    //                 // db.collection(collectionName).doc(documentName).set(doc);
    //             }
    //             localStorage.setItem('jso', JSON.stringify(s));
    //
    //             console.log("added ",s)
    //
    //             // `rows` is an array of rows
    //             // each row being an array of cells.
    //         })
    //     })
    // });
    useEffect(() => {
        if (!firstNumber)
            return
        if (firstNumber === "")
            setFirstError("此处不能为空")
        else if (!isNumeric(firstNumber))
            setFirstError("此处只能输入数字")
        else
            setFirstError("")
    }, [firstNumber])
    useEffect(() => {
        if (!secondNumber)
            return
        if (secondNumber === "")
            setSecondError("此处不能为空")
        else if (!isNumeric(secondNumber))
            setSecondError("此处只能输入数字")
        else
            setSecondError("")
    }, [secondNumber])
    useEffect(() => {
        if (!thirdNumber)
            return
        if (thirdNumber === "")
            setThirdError("此处不能为空")
        else if (!isNumeric(thirdNumber))
            setThirdError("此处只能输入数字")
        else
            setThirdError("")
    }, [thirdNumber])
    const validate = () => {
        if (!firstNumber)
            setFirstError("此处不能为空")
        if (!secondNumber)
            setSecondError("此处不能为空")
        if (!thirdNumber)
            setThirdError("此处不能为空")
        return (firstError + secondError + thirdError).length === 0;


    }
    const isNumeric = (value) => {
        return /^\d+$/.test(value);
    }
    useEffect(() => {
        if (isLoading) {
            setProgress(0)
            const interval = setInterval(() => {
                console.log(progress)
                setProgress(progress => progress + 1);
            }, 165);
             setTimeout(() => {
                clearInterval(interval)
            }, 16500);
        }
    }, [isLoading]);


    const submitForm = async e => {

        e.preventDefault();
        const isValidate = validate();
        if (isValidate === false)
            return
        let amount = web3.utils.toWei("0.1", 'ether')//convert to wei
        await cbcContract.methods.transfer(RECEIVER_ADDRESS, amount).send({from: account})
            .on('transactionHash', function (hash) {
                console.log(hash)
                setIsLoading(true)
            })
            .on('receipt', function (receipt) {
                console.log(receipt)
                const a = convertToBinary(firstNumber % 8)
                const b = convertToBinary(secondNumber % 8)
                const c = (thirdNumber === 0 || thirdNumber % 6 === 0) ? 6 : thirdNumber % 6
                const total = b.toString() + a.toString()
                // const result2 = 变爻(result1, c)
                const 卦 = 卦名[total]["卦"];
                const 辞 = 爻[c]
                // const 卦2 = 卦名[result2]["卦"];
                set卦1(total);
                // set卦2(result2);
                setCi(辞)
                setResult1(结果[卦][爻[0].toString()])
                setResult12(结果[卦][辞.toString()])

                addUserHistoru(total, 辞,)
                setIsLoading(false)

            })
            .on('error', function (e, receipt) {
                switch (e.code) {
                    case(4001):
                        enqueueSnackbar(`Transaction rejected by user`, {
                            variant: 'error',
                            autoHideDuration: 3000,
                        })
                        setIsLoading(false)
                        break

                    default:
                        enqueueSnackbar(`Transaction Failed`, {
                            variant: 'error',
                            autoHideDuration: 3000,
                        })
                        console.log('Error, deposit: ', e)
                        setIsLoading(false)
                        break
                }
            });


    }
    const addUserHistoru = (卦1, ci) => {

        if (account) {
            db.collection("users").where("walletAddress", "==", account).get().then((snapshot) => {
                if (snapshot.size === 0) {
                    //create new document
                    db.collection("users").add({
                        walletAddress: account
                    }).then((doc) => {
                            doc.collection("history").add(
                                {
                                    time: Date.now(),
                                    gua: 卦1.toString(),
                                    ci: ci,
                                }
                            ).then((docRef)=>{
                                setDocId(docRef.id)
                            })
                        }
                    )
                } else {
                    snapshot.docs[0].ref.collection("history").add(
                        {
                            time: Date.now(),
                            gua: 卦1.toString(),
                            ci: ci,
                        }
                    ).then((docRef)=>{
                        setDocId(docRef.id)
                    })
                }
            })
        }
    }
    // const 变爻 = (result, no) => {
    //     const split = result.split('');
    //     let changePosition = 6 - no;
    //     //   console.log(result.substring(0,changePosition-1).toString())
    //     // console.log(split[changePosition]==='0'?"1":"0")
    //     //  console.log(result.substring(changePosition).toString())
    //     let res = result.substring(0, changePosition).toString() + (split[changePosition] === '0' ? "1" : "0").toString() + result.substring(changePosition + 1).toString();
    //     // console.log(res)
    //     return res;
    // }
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
    const reset = () => {
        setFirstNumber("")
        setSecondNumber("")
        setThirdNumber("")
        setResult1(undefined)
        setResult12(undefined)
        // setResult2(undefined)
        setCi(undefined)
        set卦1(undefined)
        // set卦2(undefined)
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
                                value={firstNumber}
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                            />
                        </InputGroup>
                        {firstError && <div className={"alert alert-danger"}>{firstError}</div>}
                    </Form.Group>

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">第二个数字</InputGroup.Text>
                        <FormControl
                            onChange={changeHandler}
                            name={"2"}
                            aria-label="Default"
                            value={secondNumber}
                            aria-describedby="inputGroup-sizing-default"
                        />

                    </InputGroup>
                    {secondError && <div className={"alert alert-danger"}>{secondError}</div>}

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">第三个数字</InputGroup.Text>
                        <FormControl
                            onChange={changeHandler}
                            name={"3"}
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            value={thirdNumber}

                        />

                    </InputGroup>
                    {thirdError && <div className={"alert alert-danger"}>{thirdError}</div>}

                    <Button variant="primary" type="submit">
                        开始算命
                    </Button>
                </Form>
                <Form.Text className="text-muted">
                    使用《易经》占卦，需要遵守“三不占”原则：1.不诚不占：此乃求教于神明，首重真诚。2.不义不占：不合乎正当性及道义的问题，不必占问。3.不疑不占：必须是理性难以测度之事，因为有些问题依照常理常情可决定其结果，也不必占问。
                </Form.Text>
            </div>
            {result1 && result12 && !isLoading && <div>
                <Button variant="outline-danger" onClick={reset} style={{marginTop: "10px", marginBottom: "10px"}}>
                    重新计算
                </Button>
                <Result 卦1={卦1} result1={result1} result12={result12} 辞={ci} pic={pic} guaContract={guaContract} account={account} docId={docId} cbcContract={cbcContract}/>
            </div>}
            {isLoading && <div
                style={{
                    width: "15vh",
                    margin: "auto",
                    justifyContent: "center",
                    paddingTop: "5vh"
                }}
            >
                <CircularProgressbarWithChildren value={progress}>
                    <div style={{fontSize: 13, marginTop: -5}}>
                        <strong>{progress > 99 ? 99 : progress}%</strong>
                    </div>
                    <div style={{fontSize: 14, marginTop: -5}}>
                        <strong>处理中</strong>
                    </div>
                </CircularProgressbarWithChildren>
                {/*<Loader type="BallTriangle" color="#005bbd" height="15vh" width="15vh"/>*/}
            </div>}
        </div>
    );
}

export default Home;