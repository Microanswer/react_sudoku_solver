let GET_VALUE_BY_RANDOM = 1;
let GET_VALUE_BY_ORDER = 2;

let inner_run_dely = 0;

let STATUS_KEEPGOING = 1;
let STATUS_BACK = 2;
let List = function () {
    let obj = {};
    obj._data = [];

    obj.add = function (value) {
        obj._data.push(value);
    };

    obj.removeFirst = function () {
        return obj._data.shift();
    };
    obj.removeRandom = function () {
        let index = Math.floor(Math.random() * (obj._data.length));
        return obj._data.splice(index, 1)[0];
    };

    obj.removeLast = function () {
        return obj._data.pop();
    };

    obj.remove = function (value) {
        let index = -1;
        for (let i = 0; i < obj._data.length; i++) {
            if (value === obj._data[i]) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            return index;
        }
        obj._data.splice(index, 1);
        return index;
    };

    obj.contains = function (value) {
        let index = -1;
        for (let i = 0; i < obj._data.length; i++) {
            if (value === obj._data[i]) {
                index = i;
                break;
            }
        }
        return index > -1;
    };
    obj.size = function () {
        return obj._data.length;
    };

    obj.get = function (index) {
        return obj._data[index];
    };

    return obj;
};

function SudoSolver(sudo) {
    if (!sudo) {
        sudo = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],

            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],

            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]];
    }

    let obj = {};

    obj.copyArray = function (srcArray) {
        let newArray = [];
        for (let i = 0; i < srcArray.length; i++) {
            let array = [];
            for (let j = 0; j < srcArray[i].length; j++) {
                array[j] = srcArray[i][j];
            }
            newArray[i] = array;
        }
        return newArray;
    };

    obj.originSudo = obj.copyArray(sudo);

    obj.sudoSolverListener = undefined;

    obj.setSudoSolverListener = function (sudoSolverListener) {
        obj.sudoSolverListener = sudoSolverListener;
    };

    obj.getSudoSolverListener = function () {
        return obj.sudoSolverListener;
    };

    obj.getOriginSudo = function () {
        return obj.originSudo;
    };

    obj.setSudo = function (sudo) {
        obj.originSudo = obj.copyArray(sudo);
    };

    obj.stopFind = function () {
        obj.__innerRunnParam.kill = true;
    };


    obj.findAnswer = function (solverListener) {
        obj.setSudoSolverListener(solverListener);

        let tryHistory = List();

        let tempSudo = obj.copyArray(obj.originSudo);

        obj.lastAnswer = null;

        obj.__innerRunnParam = {
            tryHistory: tryHistory,
            tempSudo: tempSudo,
            status: STATUS_KEEPGOING,
            kill: false
        };

        obj.__startTime = Date.now();
        obj.__innerRun();

    };
    obj.__innerRun = function () {
        let tryHistory = obj.__innerRunnParam.tryHistory;
        let status = obj.__innerRunnParam.status;
        let tempSudo = obj.__innerRunnParam.tempSudo;
        let kill = obj.__innerRunnParam.kill;
        if (kill) {
            obj.onflish();
            return;
        }

        let ij = null;

        if (STATUS_KEEPGOING === status) {
            ij = obj.getNextEmptyPosition(tempSudo);
        } else if (STATUS_BACK === status) {
            ij = tryHistory.get(tryHistory.size() - 1);
        }

        if (ij) {

            if (status === STATUS_KEEPGOING) {
                let nextNumber = ij.nextNumber();
                if (null == nextNumber) {
                    if (obj.sudoIsTrue(tempSudo)) {

                    } else {
                        status = STATUS_BACK;
                    }
                } else {
                    tempSudo[ij.i][ij.j] = nextNumber;
                    tryHistory.add(ij);
                }

            } else if (status === STATUS_BACK) {

                let number = ij.nextNumber();

                if (null == number) {
                    tempSudo[ij.i][ij.j] = 0;
                    tryHistory.removeLast();
                    if (tryHistory.size() === 0) {

                        obj.onflish();
                        return;
                    }
                    status = STATUS_BACK;
                } else {

                    tempSudo[ij.i][ij.j] = number;
                    status = STATUS_KEEPGOING;
                }
            }

        }

        obj.onProgress(tempSudo);

        if (obj.sudoIsTrue(tempSudo)) {
            let end = obj.onFindAnswer(tempSudo);

            if (end) {
                obj.onflish();
                return;
            }


            for (let ind = tryHistory.size() - 1; ind >= 0; ind--) {
                let ij2 = tryHistory.get(ind);
                if (!ij2.hasNext()) {
                    tryHistory.remove(ind);
                    tempSudo[ij2.i][ij2.j] = 0;
                } else {
                    status = STATUS_BACK;

                    obj.__innerRunnParam.tempSudo = tempSudo;
                    obj.__innerRunnParam.status = status;
                    obj.__innerRunnParam.tryHistory = tryHistory;
                    setTimeout(obj.__innerRun, inner_run_dely);
                    return;
                }
            }
            obj.onflish();

            return;

        } else {
            if (!ij) {
                obj.onflish();
                return;
            }
        }

        obj.__innerRunnParam.tempSudo = tempSudo;
        obj.__innerRunnParam.status = status;
        obj.__innerRunnParam.tryHistory = tryHistory;
        setTimeout(obj.__innerRun, inner_run_dely);
    };

    obj.onflish = function () {
        if (obj.sudoSolverListener) {
            obj.sudoSolverListener.onFlish();
        }
    };

    obj.onProgress = function (sudo) {
        if (obj.sudoSolverListener != null) {
            obj.sudoSolverListener.onProgress(obj.copyArray(sudo));
        }
    };

    obj.onFindAnswer = function (answer) {
        obj.lastAnswer = obj.copyArray(answer);
        if (obj.sudoSolverListener) {
            return obj.sudoSolverListener.onAnswerFind(obj.lastAnswer);
        }
        return false;
    };

    obj.getNextEmptyPosition = function (sudo) {
        let useAbleNumbersMostLessIJ = null;
        for (let i = 0; i < sudo.length; i++)
            for (let j = 0; j < sudo[i].length; j++) {
                if (sudo[i][j] === 0) {

                    if (!useAbleNumbersMostLessIJ) {
                        useAbleNumbersMostLessIJ = obj.newIJ(i, j, obj.findUseAbleNumbers(sudo, i, j));
                    } else {
                        let useAbleNumbersIJ = obj.newIJ(i, j, obj.findUseAbleNumbers(sudo, i, j));
                        if (useAbleNumbersIJ.size() < useAbleNumbersMostLessIJ.size()) {
                            useAbleNumbersMostLessIJ = useAbleNumbersIJ;
                        }
                    }
                }
            }

        return useAbleNumbersMostLessIJ;
    };

    obj.findUseAbleNumbers = function (sudo, i, j) {
        if (sudo[i][j] !== 0) {
            throw new Error("这个位置已有数字：" + sudo[i][j]);
        }

        let numbers = List();
        for (let n = 1; n <= 9; n++)
            numbers.add(n);

        for (let a = 0; a < sudo[i].length; a++) {
            if (numbers.contains(sudo[i][a]))
                numbers.remove(sudo[i][a]);
        }

        for (let b = 0; b < sudo.length; b++) {
            if (numbers.contains(sudo[b][j]))
                numbers.remove(sudo[b][j]);
        }

        let grid = obj.getGridArray(sudo, i, j);

        for (let c = 0; c < grid.length; c++) {
            if (numbers.contains(grid[c]))
                numbers.remove(grid[c]);
        }

        return numbers;
    };

    obj.sudoIsTrue = function (sudo) {
        let result = false;

        if (sudo == null) {
            return result;
        }
        let i = 0;
        for (; i < sudo.length; i++) {
            if (sudo[i].length !== 9) {
                return result;
            }
        }

        if (i !== 9) {
            return result;
        }

        w: for (i = 0; i < sudo.length; i++) {
            for (let j = 0; j < sudo[i].length; j++) {
                if (obj.isNumberTrueInRow(sudo, i, j)) {
                    if (obj.isNumberTrueInCol(sudo, i, j)) {
                        if (obj.isNumberTrueInGrid(sudo, i, j)) {
                            result = true;
                        } else {
                            result = false;
                            break w;
                        }
                    } else {
                        result = false;
                        break w;
                    }
                } else {
                    result = false;
                    break w;
                }
            }
        }
        return result;
    };

    obj.isNumberTrueInRow = function (sudo, i, j) {
        let result = false;

        let row = sudo[i];
        let num = row[j];

        if (0 === num) {
            return result;
        }

        result = obj.numInArrayOnceOrNone(num, row);

        return result;
    };
    obj.isNumberTrueInCol = function (sudo, i, j) {
        let result = false;

        let col = [sudo[0][j], sudo[1][j], sudo[2][j],
            sudo[3][j], sudo[4][j], sudo[5][j],
            sudo[6][j], sudo[7][j], sudo[8][j]];

        let num = col[i];

        if (0 === num) {
            return result;
        }

        result = obj.numInArrayOnceOrNone(num, col);

        return result;
    };

    obj.isNumberTrueInGrid = function (sudo, i, j) {
        let result = false;

        let grid = obj.getGridArray(sudo, i, j);

        let num = sudo[i][j];

        if (0 === num) {
            return result;
        }

        result = obj.numInArrayOnceOrNone(num, grid);

        return result;
    };

    obj.numInArrayOnceOrNone = function (num, array) {
        let count = 0;
        if (num === 0) {
            return false;
        }
        for (let i = 0; i < array.length; i++) {
            if (num === array[i]) {
                count++;
            }
        }
        return count <= 1;
    };

    obj.getGridArray = function (sudo, i, j) {
        let grid = [];

        if ((0 <= i && i <= 2) && (0 <= j && j <= 2)) {
            let index = 0;
            for (let h = 0; h <= 2; h++) {
                for (let s = 0; s <= 2; s++) {
                    grid[index] = sudo[h][s];
                    index++;
                }
            }
        } else if ((3 <= i && i <= 5) && (0 <= j && j <= 2)) {
            let index = 0;
            for (let h = 3; h <= 5; h++) {
                for (let s = 0; s <= 2; s++) {
                    grid[index] = sudo[h][s];
                    index++;
                }
            }
        } else if ((6 <= i && i <= 8) && (0 <= j && j <= 2)) {
            let index = 0;
            for (let h = 6; h <= 8; h++) {
                for (let s = 0; s <= 2; s++) {
                    grid[index] = sudo[h][s];
                    index++;
                }
            }
        } else if ((0 <= i && i <= 2) && (3 <= j && j <= 5)) {
            let index = 0;
            for (let h = 0; h <= 2; h++) {
                for (let s = 3; s <= 5; s++) {
                    grid[index] = sudo[h][s];
                    index++;
                }
            }
        } else if ((3 <= i && i <= 5) && (3 <= j && j <= 5)) {
            let index = 0;
            for (let h = 3; h <= 5; h++) {
                for (let s = 3; s <= 5; s++) {
                    grid[index] = sudo[h][s];
                    index++;
                }
            }
        } else if ((6 <= i && i <= 8) && (3 <= j && j <= 5)) {
            let index = 0;
            for (let h = 6; h <= 8; h++) {
                for (let s = 3; s <= 5; s++) {
                    grid[index] = sudo[h][s];
                    index++;
                }
            }
        } else if ((0 <= i && i <= 2) && (6 <= j && j <= 8)) {
            let index = 0;
            for (let h = 0; h <= 2; h++) {
                for (let s = 6; s <= 8; s++) {
                    grid[index] = sudo[h][s];
                    index++;
                }
            }
        } else if ((3 <= i && i <= 5) && (6 <= j && j <= 8)) {
            let index = 0;
            for (let h = 3; h <= 5; h++) {
                for (let s = 6; s <= 8; s++) {
                    grid[index] = sudo[h][s];
                    index++;
                }
            }
        } else if ((6 <= i && i <= 8) && (6 <= j && j <= 8)) {
            let index = 0;
            for (let h = 6; h <= 8; h++) {
                for (let s = 6; s <= 8; s++) {
                    grid[index] = sudo[h][s];
                    index++;
                }
            }
        } else {
            throw new Error("到达了不可能到达的位置。");
        }
        return grid;
    };

    let IJ = function (i, j) {
        let obj = {};
        obj.getValueBy = GET_VALUE_BY_RANDOM;
        obj.i = i;
        obj.j = j;
        obj.useAbleNumbers = List();
        obj.tryedNumbers = List();

        obj.hasNext = function () {
            return obj.useAbleNumbers.size() > 0;
        };

        obj.nextNumber = function () {
            if (obj.useAbleNumbers.size() < 1) {
                return null;
            } else {
                let nu;
                if (obj.getValueBy === GET_VALUE_BY_ORDER) {
                    nu = obj.useAbleNumbers.removeFirst();
                } else if (obj.getValueBy === GET_VALUE_BY_RANDOM) {
                    nu = obj.useAbleNumbers.removeRandom();
                } else {
                    nu = obj.useAbleNumbers.removeFirst();
                }
                obj.tryedNumbers.add(nu);
                return nu;
            }
        };

        obj.setUseAbleNumbers = function (useAbleNumbers) {
            obj.useAbleNumbers = useAbleNumbers;
            return obj;
        };

        obj.size = function () {
            return obj.useAbleNumbers.size();
        };

        return obj;
    };

    obj.newIJ = function (i, j, useAbleNumbers) {
        return IJ(i, j).setUseAbleNumbers(useAbleNumbers);
    };

    return obj;
}

export default SudoSolver;