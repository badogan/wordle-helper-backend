const express = require('express')
const cors = require('cors')
const fs = require('fs')
const helper = require('./helper')

const app = express()
const port = 3009

app.use(cors());
app.use(express.json());

let myArr = []
helper("words5-from-OSPD4").then(result => {
    console.log(result)
    myArr = result
})

function compliesToDisallowedList(word, disallowedArr) {
    // console.log("disallowedArr: ",disallowedArr)
    // console.log("word: ",word)
    // console.log("word[0]: ",word[0])
    if (
        disallowedArr.includes(word[0]) ||
        disallowedArr.includes(word[1]) ||
        disallowedArr.includes(word[2]) ||
        disallowedArr.includes(word[3]) ||
        disallowedArr.includes(word[4])
        ) {
        return false;
    } else {
        return true;
    }
}

function compliesToMustIncludeListV3(word, possibleLettersAndPositions) {
    const keys = Object.keys(possibleLettersAndPositions);
    if (keys.length === 0) {
        return false;
    }
    for (i = 0; i < keys.length; i++) {
        let innerResult = false;
        for (j = 0; j < possibleLettersAndPositions[keys[i]].length; j++) {
            if (word[possibleLettersAndPositions[keys[i]][j]] === keys[i]) {
                //if it is positioned in one of those
                innerResult = true;
            }
        }
        if (!innerResult) {
            return false;
        }
    }
    return true;
}

function compliesToGreenArray(greenArray, word) {
    // [ '*', '*', '*', '*', 'a' ] "arise"
    // if (word === 'zesty') {
    //     console.log("I am zesty")
    // }
    let result = true

    for (let index = 0; index < 5; index++) {
        if ((greenArray[index] !== '*') && (greenArray[index] !== word[index])) {
            // if (word === 'zesty') {
            //     console.log("I am zesty - index: ", index)
            // }
            return false
        }
    }

    return result
}

//

app.get('/', (req, res) => {
    res.send('Hello from wordle-helper-be-v1')
})

app.post('/providepossiblewords', (req, res) => {
    console.log("req received")
    console.log(req.body.disAllowedArr)
    console.log(req.body.possibleLettersAndPositions)
    console.log(req.body.greenArray)
    //

    let reducedArr = [];
    // console.log("sample 5 letter word:",myArr[Math.floor(Math.random()*myArr.length)])
    let disAllowedArr = req.body.disAllowedArr; //list of disallowed letters pushed into an array
    let possibleLettersAndPositions = req.body.possibleLettersAndPositions;
    const noYellow = Object.keys(possibleLettersAndPositions).length === 0;
    let potentialWords1 = [];
    // const reducedSet = bringReducedSet(possibleLettersAndPositions)
    // const greenLetterExist = [new Set(req.body.greenArray)].length !== 1
    for (let i = 0; i < myArr.length; i++) {
        // console.log(myArr[i])
        //GREENs req.body.greenArray [ '*', '*', '*', '*', 'a' ]
        if (compliesToGreenArray(req.body.greenArray, myArr[i])) {
            //NOT ALLOWEDs
            if (compliesToDisallowedList(myArr[i], disAllowedArr)) {
                //YELLOWs
                if (
                    compliesToMustIncludeListV3(myArr[i], possibleLettersAndPositions) ||
                    noYellow
                ) {
                    potentialWords1.push(myArr[i]);
                }
            }
        }
    }
    // potentialWords1.map((word) => console.log(word));
    console.log('potentialWords1: ', potentialWords1);

    //
    res.send({
        'result': potentialWords1
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})