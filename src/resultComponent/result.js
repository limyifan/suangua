import React from 'react';
import {Button} from "react-bootstrap";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {卦名} from "../gua";
import DialogContent from "@material-ui/core/DialogContent";
import ResultDetails from "./resultDetails";
import DialogActions from "@material-ui/core/DialogActions";
import {useSnackbar} from "notistack";

function Result({卦1,result1,result12,辞,pic,docId,guaContract,account}) {
    const [open, setOpen] = React.useState(false);
    const {enqueueSnackbar,closeSnackbar} = useSnackbar();

    const buyPicture=async () => {
        if (docId && window.ethereum) {
            await guaContract.methods.mint(pic).send({from: account})
                .on('transactionHash', function (hash) {
                    console.log(hash)
                    enqueueSnackbar(`Transaction Pending...`, {
                        variant: 'info', persist: true,
                    })
                })
                .on('receipt', function (receipt) {
                    console.log(receipt)
                    if (receipt) {
                        console.log("receipt",receipt)
                        // db.collection("users").where("walletAddress", "==", account).get().then((snapshot) => {
                        // snapshot.forEach((doc)=>{
                        //     if(doc.id===docId)
                        //     {
                        //         doc.ref.update(mintTokenId:)
                        //     }
                        // })
                        // })
                        closeSnackbar()
                        enqueueSnackbar("Token Bought Successfully ✅", {
                            variant: 'success',
                            autoHideDuration: 3000,
                        });
                    }
                })//mint token initially
                .on('error', function (e, receipt) {
                    switch (e.code) {
                        case(4001):
                            enqueueSnackbar(`Transaction rejected by user`, {
                                variant: 'error',
                                autoHideDuration: 3000,
                            })
                            break

                        default:
                            closeSnackbar()
                            enqueueSnackbar("Failed to mint token", {
                                variant: 'error',
                            })
                            break
                    }
                });
        }
    }
    return (
        <div>
            <h1>计算结果：</h1>
            <hr
                style={{
                    color: "black",
                    backgroundColor: "black",
                    height: 0.5
                }}
            />
            <img
                src={pic}
                alt={"resultPic"} width={"50%"}/>
            <br/>
            <br/>
            {/*<Button variant="outline-info" onClick={buyPicture} style={{marginBottom: "30px"}}>*/}
            {/*    购买图片*/}
            {/*</Button>*/}
            <Button variant="outline-info" onClick={() => setOpen(true)} style={{marginBottom: "30px",marginLeft:"30px"}}>
                详细信息
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"><h2>{卦名[卦1]["卦"]}卦</h2>
                </DialogTitle>
                <DialogContent>
                    <ResultDetails 卦1={卦1} result1={result1} result12={result12} 辞={辞}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        关闭窗口
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Result;