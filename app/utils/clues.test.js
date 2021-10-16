const rewire = require("rewire")
const clues = rewire("./clues")
const isStart = clues.__get__("isStart")
// @ponicode
describe("isStart", () => {
    test("0", () => {
        let callFunction = () => {
            isStart({ index: 100, prevCell: { isBlackSquare: true }, nextCell: { isBlackSquare: true } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            isStart({ index: 1, prevCell: { isBlackSquare: true }, nextCell: { isBlackSquare: false } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            isStart({ index: -1, prevCell: { isBlackSquare: false }, nextCell: { isBlackSquare: true } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            isStart({ index: -1, prevCell: { isBlackSquare: true }, nextCell: { isBlackSquare: false } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            isStart({ index: 0, prevCell: { isBlackSquare: false }, nextCell: { isBlackSquare: false } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            isStart({ index: undefined, prevCell: undefined, nextCell: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("clues.getCellClue", () => {
    test("0", () => {
        let callFunction = () => {
            clues.getCellClue({ grid: undefined, getNextClueNumber: undefined, row: undefined, column: Infinity })
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("clues.assignClueNumbersToGrid", () => {
    test("0", () => {
        let callFunction = () => {
            clues.assignClueNumbersToGrid("Pierre Edouard")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            clues.assignClueNumbersToGrid("George")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            clues.assignClueNumbersToGrid("Edmond")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            clues.assignClueNumbersToGrid("Anas")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            clues.assignClueNumbersToGrid("Michael")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            clues.assignClueNumbersToGrid(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
