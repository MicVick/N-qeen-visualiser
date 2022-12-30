const numberbox = document.getElementById("numberbox");
const progressBar = document.getElementById("progress-bar");
const playButton = document.getElementById("play-button");

// queen element 
const queen = '<i class="fas fa-chess-queen" style="color:#000"></i>';

let n, q, Board = 0;

// number of boards to be printed on the screen for given value of n => max accepted value n = 8
// possible arrangement of boards => (from index = 1) => answer + 1 => [0, 1+1, 0+1, 0+1, 2+1, ...]
let m_boards = [0, 2, 1, 1, 3, 11, 5, 41, 93]

// to store the state of boards
let pos = {}

class Queen{
    constructor() {
        this.position = Object.assign({}, pos);
        this.uuid = [];
    }

    nQueen = async () => {
        Board = 0;
        this.position[`${Board}`] = {};
        numberbox.disabled = true;
        playButton.disabled = true;
        await q.solveQueen(Board, 0, n);
        await q.clearColor(Board);
        numberbox.disabled = false;
        playButton.disabled = false;
    }

    // valid
    isValid = async (board, r, col, n) => {
        const table = document.getElementById(`table-${this.uuid[board]}`);
        const currentRow = table.firstChild.childNodes[r];
        const currentColumn = currentRow.getElementsByTagName("td")[col];
        currentColumn.innerHTML = queen;
        await q.delay();

        // checking for column
        for(let i = r - 1; i >= 0; --i) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[col];
            const value = column.innerHTML;
            if(value == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = '-';
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await q.delay();
        }

        // checking for obtuse angle diagonal
        for(let i = r - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];
            const value = column.innerHTML;

            if(value == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = '-';
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await q.delay();
        }

        // checking for acute angle diagonal
        for(let i = r - 1, j = col + 1; i >= 0 && j < n; --i, ++j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];
            const value = column.innerHTML;

            if(value == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = '-';
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await q.delay();
        }
        return true;
    }

    // clearColor
    clearColor = async (board) => {
        const table = document.getElementById(`table-${this.uuid[board]}`);
        for(let i = 0; i < n; ++i) {
            let row = table.firstChild.childNodes[i];
            for(let j = 0; j < n; ++j) {
                if((i + j) & 1) {
                    row.getElementsByTagName("td")[j].style.backgroundColor = "#FF9F1C";
                } else {
                    row.getElementsByTagName("td")[j].style.backgroundColor = "#FCCD90";
                }
            }
        }
    }

    // recursion solution
    solveQueen = async (board, r, n) => {
        // base case
        if(r == n) {
            ++Board;
            let table = document.getElementById(`table-${this.uuid[Board]}`);
            // placing one queen in one row at specific cell of the row
            for(let i = 0; i < n; ++i) {
                let row = table.firstChild.childNodes[i];
                row.getElementsByTagName("td")[this.position[board][i]].innerHTML = queen;
            }
            this.position[Board] = this.position[board];
            return;
        }

        for(let i = 0; i < n; ++i) {
            await q.delay();
            await q.clearColor(board);
            if(await q.isValid(board, r, i, n)) {
                await q.delay();
                await q.clearColor(board);
                let table = document.getElementById(`table-${this.uuid[board]}`);
                let row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = queen;
                this.position[board][r] = i;

                if(await q.solveQueen(board, r + 1, n)){
                    await q.clearColor(board);
                }
                await q.delay();
                board = Board;
                table = document.getElementById(`table-${this.uuid[board]}`);
                row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = "-";

                delete this.position[`${board}`][`${r}`];
            }
        }
    }  
    
    // delay to see what is happening
    delay = async () => {
        await new Promise((done) => setTimeout(() => done(), 150));
    }

}


// onclick event on button
playButton.onclick = async function possiblilities() {
    const chessBoard = document.getElementById("n-queen-board");
    const arrangement = document.getElementById("queen-arrangement");

    n = numberbox.value;
    q = new Queen();

    if(n > 8) {
        numberbox.value = "";
        alert("Queen value should be less than 9")
        return;
    } else if(n < 1) {
        numberbox.value = "";
        alert("Queen value should be greater than 0");
        return;
    }

    // clear the content created by previous execution
    while(chessBoard.hasChildNodes()) {
        chessBoard.removeChild(chessBoard.firstChild);
    }
    if(arrangement.hasChildNodes()) {
        arrangement.removeChild(arrangement.lastChild);
    }

    // display the total possibility for particular value of n
    const para = document.createElement("p");
    para.setAttribute("class", "queen-info");
    para.innerHTML = `For ${n}*${n} board, ${m_boards[n] - 1} arrangment are possible.`;
    arrangement.appendChild(para);
    

    // displaying boards on the screen
    if(chessBoard.childElementCount === 0) {
        for(let i = 0; i < m_boards[n]; ++i) {
            q.uuid.push(i + 1);
            let div = document.createElement('div');
            let table = document.createElement('table');
            let header = document.createElement('h4');
            header.innerHTML = `Board-${q.uuid[i]}`;
            header.setAttribute("id", `header-${q.uuid[i]}`);
            table.setAttribute("id", `table-${q.uuid[i]}`);
            div.appendChild(header);
            div.appendChild(table);
            chessBoard.appendChild(div);
        }
    }

    for(let k = 0; k < m_boards[n]; ++k) {
        let table = document.getElementById(`table-${q.uuid[k]}`);

        for(let i = 0; i < n; ++i) {
            // inserting ith row
            const row = table.insertRow(i);
            row.setAttribute("id", `Row${i}`);
            for(let j = 0; j < n; ++j) {
                // inserting jth row to ith col
                const col = row.insertCell(j);
                if((i + j) & 1) {
                    col.style.background = "#FF9F1C";
                } else {
                    col.style.background = "#FCCD90";
                }
                col.innerHTML = "-";
                col.style.border = "0.3px solid #373f51";
            }
        }
        await q.clearColor(k);
    }
    await  q.nQueen();
};
